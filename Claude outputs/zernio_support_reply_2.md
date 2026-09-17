Subject: Re: Threads OAuth connect never completes — no error returned to redirect_url

Thanks for the detailed breakdown — here's what we can confirm from our own server-side logs for two failed attempts today, plus answers to your specific questions.

**Attempt timestamps (server-verified, from our edge function's access logs)**

- Mobile app attempt: 2026-09-17 16:21:27 UTC
- Web app attempt: 2026-09-17 16:37:09 UTC (a preceding call at 16:37:04 UTC on the same page load was an account-sync call, not the connect call)

Both `GET /v1/connect/threads` calls (proxied through our own backend) returned 200 with a populated `authUrl` in the response — confirmed via our function logs (response size ~520-540 bytes, consistent with a valid `{authUrl, profileId}` payload). So on our side, Zernio's `getConnectUrl` call succeeded both times.

**Browser / webview question — answered directly from our source code**

- Web: confirmed via User-Agent captured in our own request logs — desktop Chrome 153 on Windows, i.e., the normal system browser (`window.location.href = authUrl`), not an embedded frame.
- Mobile: our app uses Expo's `WebBrowser.openAuthSessionAsync(authUrl, redirectUrl)` — this is not a plain in-app WebView. It opens Android Chrome Custom Tabs / iOS `ASWebAuthenticationSession`, i.e., the platform's standard, Meta-recommended OAuth container that shares cookies/session with the system browser. So we can rule out "embedded webview dropped the redirect" — both attempts used a proper system-level browser context, and both failed identically.

**The full `authUrl` and a HAR capture**

We don't log the `authUrl` response body server-side (only request metadata), and since `state` is regenerated per attempt, an old one wouldn't help you correlate a new attempt anyway. We'll capture this live on the next attempt: opening browser DevTools with "preserve log" on, triggering the connect, and pulling the `authUrl` from the `zernio-client` response plus a HAR of the subsequent navigation. We'll send that as a follow-up.

Given attempts on both platforms fail identically, at the exact same step, with two different (both standard) browser contexts, we think this narrows it down to the Meta app's configuration for Threads specifically (mode/permissions/tester eligibility) rather than anything client-side. Let us know if the timestamps above are enough to check whether Zernio's callback ever received anything for these two attempts — if it received nothing, that would confirm the failure is happening inside Meta's authorization dialog itself.

We'll follow up shortly with the captured `authUrl` / HAR from a fresh attempt.

Best regards,
Volkan
