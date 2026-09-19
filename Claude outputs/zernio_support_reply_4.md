Subject: Re: Threads OAuth connect never completes — reproduced again today (18.09.2026), unchanged

Hi,

Following up on the report we sent yesterday (17.09.2026) — we re-tested the Threads connect flow again today and the result is unchanged: same failure, same signature.

**Fresh authUrl captured today** (2026-09-18, ~18:24 UTC / 21:24 local TRT):

```
https://threads.net/oauth/authorize?client_id=1410550293434390&redirect_uri=https%3A%2F%2Fzernio.com%2Fapi%2Fv1%2Fconnect%2Fthreads%2Fcallback&scope=threads_basic%2Cthreads_content_publish%2Cthreads_read_replies%2Cthreads_manage_replies%2Cthreads_manage_insights%2Cthreads_delete&response_type=code&auth_type=rerequest&state=6a1ccc574b5ddae0b0eea48a-6aa0ba34022bb4cf3642e98f-1789755554812-https%253A%252F%252Fflow.workigom.com%252Fsosyal-medya-ct_82405eedcfe2050b4df95cdf56919b1b13a16f25f8bd89c5
```

Decoded query params (identical structure to yesterday's capture — same `client_id`, same scopes, same redirect target):
- `client_id`: 1410550293434390
- `redirect_uri`: https://zernio.com/api/v1/connect/threads/callback
- `scope`: threads_basic, threads_content_publish, threads_read_replies, threads_manage_replies, threads_manage_insights, threads_delete
- `response_type`: code
- `auth_type`: rerequest
- Zernio `profileId` embedded in state: `6aa0ba34022bb4cf3642e98f` (same profile as our 17.09 report)

Our `get-connect-url` call succeeded on our end (`{"success": true, ...}`) and produced this well-formed authUrl, so the request generation itself is fine — the issue is still downstream, on Meta's side of the handshake, exactly as described in our previous report. We did not observe any change in behavior compared to yesterday's reproduction.

We haven't heard back yet on the questions from our last message, so re-sending them here for visibility:

1. Is the "Threads API" product added and configured for the Meta App behind `client_id=1410550293434390`?
2. Is this the correct/current app ID your integration should be using for Threads connect URLs, or has this drifted from a different app that's actually set up for Threads?
3. Is the app's Threads Login use case in a usable state (Live, or has our account been added as a tester)?
4. Is `https://zernio.com/api/v1/connect/threads/callback` registered as an allowed redirect URI for this app's Threads product specifically?

Happy to reproduce again immediately and capture a fresh authUrl/HAR as soon as you've made a change, to confirm the fix on our end.

Best regards,
Volkan
