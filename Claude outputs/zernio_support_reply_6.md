Subject: Re: Threads OAuth connect never completes — controlled test with an active Threads session, still no consent screen, callback never hit (18.09.2026)

Hi,

Thanks for walking through the four questions — we ran exactly the test you suggested (an already-authenticated Threads session, triggering connect through your own dashboard this time) so we could isolate "not logged in" from "app not recognized." The result rules out the login-state explanation.

**Setup:** Threads was already logged in in this browser session (confirmed visually — the account's personalized "For You" feed was loading normally) before triggering the connect flow from `zernio.com/dashboard/connections`.

**Captured request** (DevTools Network tab, 18.09.2026 ~18:52 UTC), full decoded URL:

```
https://threads.net/oauth/authorize?
  client_id=1410550293434390
  &redirect_uri=https://zernio.com/api/v1/connect/threads/callback
  &scope=threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies,threads_manage_insights,threads_delete
  &response_type=code
  &auth_type=rerequest
  &state=6a1ccc574b5ddae0b0eea48a-6aa0ba34022bb4cf3642e98f-1789757243629-https://zernio.com/dashboard/connections?profile=6aa0ba34022bb4cf3642e98f&group=profile
```

(`state` confirms this was triggered from your Connections page for profile `6aa0ba34022bb4cf3642e98f`, as expected.)

Two back-to-back requests to this `authorize` URL both came back **302**. The browser then landed on plain `https://www.threads.com/` — the normal logged-in home feed — with **no query parameters at all**: no `?code=`, no `?error=`.

**The critical check:** we filtered the Network tab for `callback` (which would match any request to your registered `redirect_uri`, since that string appears literally in it). Zero matching requests to `zernio.com/api/v1/connect/threads/callback` were made — the only two hits on that filter were the `authorize` calls themselves, because "callback" happens to appear inside their own `redirect_uri` query parameter. In other words: **Meta's `/oauth/authorize` endpoint never once redirected back to your callback, neither with a success code nor with an error.** The request dies entirely inside Meta's own authorize step, before your callback logic (or ours) ever runs.

This is what rules out "just not logged in": that explanation predicts that an authenticated session should reach a consent screen (or at minimum get an `?error=` bounce to your callback). Instead, with a confirmed-authenticated session, the authorize call still returns a 302 straight back into Threads' own product, silently, with the callback never touched at all.

Given this is now a narrowly reproducible signature (exact `client_id`, exact timestamp, exact `state` above), would it be possible to trace this specific request on your side against Meta's own authorize logs for `client_id=1410550293434390`? We'd like to understand what Meta returns internally on that 302 — if there's a `Location` header or an app-review/scope-mismatch signal on your end that doesn't reach us as a visible `?error=`, that would explain the silent bounce.

Happy to run another live test in sync with you if that's faster — just say when.

Best regards,
Volkan
