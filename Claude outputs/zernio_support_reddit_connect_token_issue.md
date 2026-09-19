Subject: Reddit connect flow regression — callback now returns undocumented `connect_token` instead of documented `accountId`/`username` (standard mode, no `headless` param sent)

Hi,

We're reporting a separate issue from the ongoing Threads thread — this one is on Reddit, and it's a regression: connecting a Reddit account through your standard OAuth flow used to work correctly for us, and as of today it no longer completes.

**What we're calling (unchanged from when it worked):**

```
GET /v1/connect/reddit?profileId=6aa0ba34022bb4cf3642e98f&redirect_url=https%3A%2F%2Fflow.workigom.com%2Fsosyal-medya
```

We do not pass `headless` at all (so this should be standard mode per your docs at `docs.zernio.com/guides/connecting-accounts`).

**Two different failure symptoms observed today, same integration, same code path:**

**1) Rate-limit bounce (earlier attempt today):**
Callback redirected to our `redirect_url` with:
```
?error=connection_failed&platform=reddit&error_message=reddit+rate+limit+reached.+Quota+resets+in+5s.
```

**2) OAuth completes on Reddit's side, but our side never gets a usable result (later attempt today, fully captured):**

- Generated `authUrl` (decoded):
  ```
  https://www.reddit.com/api/v1/authorize?
    client_id=qqE64Cvz0rCkjg9_C1gxSA
    &response_type=code
    &state=6a1ccc574b5ddae0b0eea48a-6aa0ba34022bb4cf3642e98f-1789763540185-https%3A%2F%2Fflow.workigom.com%2Fsosyal-medya
    &redirect_uri=https%3A%2F%2Fgetlate.dev%2Fapi%2Fv1%2Fconnect%2Freddit%2Fcallback
    &duration=permanent
    &scope=identity+submit+read+mysubreddits+flair+history+privatemessages+edit+vote
  ```
- Reddit's consent screen rendered correctly: "Hey, turkeywallstreetbets! **Late** would like to connect with your reddit account" with the full permission list and Accept/Decline — confirming the OAuth handshake itself is healthy on Reddit's side, your app is recognized, and the user account is eligible.
- User clicked **Accept**.
- Browser console (captured live):
  ```
  Navigated to https://www.reddit.com/api/v1/authorize?client_id=qqE64Cvz0rCkjg9_C1gxSA&...
  Navigated to https://flow.workigom.com/sosyal-medya?connected=reddit&profileId=6aa0ba34022bb4cf3642e98f&connect_token=25dbd22...
  ```

**The problem:** per your own docs (`docs.zernio.com/guides/connecting-accounts`), a standard-mode success should append `connected={platform}&profileId=...&accountId=...&username=...`. What we actually received has `connected=reddit` and `profileId=...`, but **no `accountId`, no `username`** — instead there's a `connect_token`, which your docs explicitly describe as appearing *"only in headless mode... for platforms requiring secondary selection (Facebook Pages, LinkedIn organizations, etc.)"* and state that Reddit, as a standard flow without secondary selection, should never produce one.

Since we never requested `headless=true`, our client has no logic to consume `connect_token` (per your docs, it shouldn't need to — "no separate finalization endpoint exists" for standard mode). So even though the user completed Reddit's consent screen successfully, the account is never finalized on our end and never appears in `GET /v1/profiles/{profileId}/accounts`.

**Questions:**
1. Has something changed recently in the Reddit connect backend — possibly a fallback introduced for the rate-limiting behavior in symptom (1) above — that's now causing standard-mode Reddit connects to return `connect_token` instead of `accountId`/`username`?
2. If this is intentional going forward, what endpoint should we call with `connect_token` to finalize the connection? We don't see one documented for non-headless flows.
3. Since this previously worked exactly as documented (no `headless` param, direct `accountId` in the callback) for Reddit, can this be restored, or do we need to migrate to `headless=true` + a selection step for Reddit going forward?

Happy to provide the full `profileId`/timestamp pair for any of today's attempts if it helps you trace this in your logs.

Best regards,
Volkan
