Subject: Threads OAuth Connect — Full Investigation Report

## Summary

Connecting a Threads account through `GET /v1/connect/threads` never completes. The call succeeds and returns a valid `authUrl`, but navigating to that URL never returns the user to our `redirect_url` — with or without an `error` parameter. Instead, the user lands on Threads' own generic account-creation/login chooser screen. This has been reproduced consistently, on both web (desktop Chrome) and mobile (Expo, system browser context), across two different accounts/organizations, over several attempts on 2026-09-17.

We believe the root cause sits in the Meta App configuration behind Zernio's Threads integration (`client_id=1410550293434390`) — specifically, that the Threads API / "Login with Threads" product may not be properly enabled or live for that app — rather than in our integration code. This report documents every check we ran to reach that conclusion, so your team can go straight to verifying the Meta App configuration.

## Our integration (for context)

- We call your `zernio-client` proxy (a Supabase Edge Function we operate) with action `get-connect-url`, which internally calls your SDK's `accounts.getConnectUrl({ platform: 'threads', profileId, redirectUrl })` — the same code path used for every other platform we support (Instagram, Facebook, LinkedIn, TikTok, YouTube, Bluesky, WhatsApp, Discord, Telegram, Snapchat, Reddit, Pinterest, Google Business), all of which connect successfully today.
- Web: on receiving `authUrl`, we do `window.location.href = authUrl` (normal top-level navigation, desktop Chrome, no embedded frame).
- Mobile (Expo/React Native): we call `WebBrowser.openAuthSessionAsync(authUrl, redirectUrl)`, which opens Android Chrome Custom Tabs / iOS `ASWebAuthenticationSession` — the standard, Meta-recommended system browser OAuth container, not an embedded WebView.

## Verification performed

### 1. Confirmed our backend call succeeds

We checked our own edge function's access logs for two connect attempts on 2026-09-17:

| Attempt | Client | Timestamp (UTC) | Result |
|---|---|---|---|
| A (mobile) | React Native app (Expo, Android) | 2026-09-17T16:21:27.135Z | `zernio-client` → 200 OK, response ~538 bytes (valid `{authUrl, profileId}` payload) |
| A (web) | Desktop Chrome 153 / Windows | 2026-09-17T16:37:09.615Z | `zernio-client` → 200 OK, response ~524 bytes (valid `{authUrl, profileId}` payload) |

Both requests resolved a valid Zernio profile on our side (no profile-resolution errors, no stale/duplicate profile state) and received a well-formed `authUrl` from your API. So `GET /v1/connect/threads` itself works correctly end-to-end on your API surface and ours.

### 2. Ruled out client-side / account-side causes

- Connecting Instagram account: **Business type**, confirmed.
- Instagram account visibility: **public**, confirmed.
- Threads profile itself: confirmed **public** (checked separately, since Threads has its own privacy toggle independent of Instagram's).
- Browser context: web uses a normal top-level navigation in desktop Chrome (not embedded); mobile uses `WebBrowser.openAuthSessionAsync` (Custom Tabs / `ASWebAuthenticationSession`), Meta's own recommended container — not a plain in-app WebView that could silently drop a redirect.
- The identical symptom reproduced on **two different accounts/organizations** and on **both platforms** (web and mobile), ruling out a single-account or single-device quirk.

### 3. Captured and decoded the actual `authUrl`

On a fresh attempt (2026-09-17T17:02:32.374Z UTC, captured via browser DevTools Network tab), the full URL returned by your API was:

```
https://threads.net/oauth/authorize?client_id=1410550293434390&redirect_uri=https%3A%2F%2Fzernio.com%2Fapi%2Fv1%2Fconnect%2Fthreads%2Fcallback&scope=threads_basic%2Cthreads_content_publish%2Cthreads_read_replies%2Cthreads_manage_replies%2Cthreads_manage_insights%2Cthreads_delete&response_type=code&auth_type=rerequest&state=6a1ccc574b5ddae0b0eea48a-6aa0ba34022bb4cf3642e98f-1789664552374-https%253A%252F%252Fflow.workigom.com%252Fsosyal-medya-ct_682386d0a7c6ebc0d743950040278f5f16b2685b8fd6a871
```

Decoded:

| Param | Value |
|---|---|
| Host/path | `threads.net/oauth/authorize` |
| `client_id` | `1410550293434390` |
| `redirect_uri` | `https://zernio.com/api/v1/connect/threads/callback` |
| `scope` | `threads_basic, threads_content_publish, threads_read_replies, threads_manage_replies, threads_manage_insights, threads_delete` |
| `response_type` | `code` |
| `auth_type` | `rerequest` |
| Zernio `profileId` embedded in state | `6aa0ba34022bb4cf3642e98f` |

This URL is well-formed and matches the standard OAuth authorization-code pattern documented on your Connect API reference page — nothing wrong with it on its face.

### 4. Observed what actually happens when navigating to it

Instead of an app-authorization/consent screen (naming Zernio, listing the requested scopes), the browser is served `threads.net/login/` — Meta's generic **"Choose how you'd like to create your Threads account"** screen (options: "Use Instagram account" / "Use phone number"). This is the account-creation/signup entry point, not a third-party app consent dialog. No redirect back to `redirect_uri` occurs — neither a success redirect nor an `?error=...` redirect, on either side (Meta → Zernio, or Zernio → us).

Per your own API reference documentation for `GET /v1/connect/{platform}`, any failure that reaches Zernio's callback is guaranteed to redirect back to our `redirect_url` with `platform`, `error`, and `error_message` params (and our integration already handles that case correctly — we display the error to the user). Since we never receive that, the failure must be happening **before** Meta ever hands control back to Zernio's callback — i.e., inside Meta's own authorization flow, at or before the point where it would normally recognize `client_id=1410550293434390` as a valid third-party app request.

## Conclusion / what we'd like checked

Based on all of the above, we believe this is most likely caused by one of the following on the Meta App behind `client_id=1410550293434390`:

1. The Threads API / "Login with Threads" product is not added or not fully configured on that Meta App.
2. `client_id=1410550293434390` is not actually the app your Threads integration is meant to use in production (possible app-ID drift).
3. The app's Threads permissions (`threads_basic`, `threads_content_publish`, etc.) are not in Live/App-Review-approved status, and our connecting accounts aren't registered as testers/developers on that app.
4. The registered redirect URI (`https://zernio.com/api/v1/connect/threads/callback`) is not correctly allowlisted for that Meta App's Threads product specifically.

Could your team check, in the Meta App Dashboard for `client_id=1410550293434390`:

- Whether the Threads API product is added and configured.
- Whether this is the correct/current app for Threads connect URLs (vs. a different app actually holding Threads access).
- Whether the app's Threads permissions are Live, or whether our test accounts need to be added as testers.
- Whether `https://zernio.com/api/v1/connect/threads/callback` is registered as an allowed redirect URI for this app's Threads product.

We're happy to reproduce immediately and provide a fresh `authUrl`/timestamp/HAR as soon as you've made a change, to confirm the fix on our end.

## Appendix — raw reference data

- Platform: `threads`
- `client_id`: `1410550293434390`
- Zernio profile IDs used across attempts: `6a98de50aab7e58f1846456e`, `6aa0ba34022bb4cf3642e98f`
- Attempt timestamps (UTC), 2026-09-17: `16:21:27` (mobile), `16:37:09` (web), `17:02:32` (authUrl capture)
- Observed landing page on failure: `https://www.threads.net/login/` (or `threads.com/login/`), generic "create your Threads account" chooser
- No `error` / `error_message` ever received at our `redirect_url` for any of these attempts
