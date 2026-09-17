Subject: Re: Threads OAuth connect never completes — captured authUrl + exact failure point

We captured the authUrl and reproduced the issue live. This points pretty clearly at the Meta app configuration, details below.

**Captured authUrl** (from a fresh attempt, 2026-09-17 ~17:02 UTC):

```
https://threads.net/oauth/authorize?client_id=1410550293434390&redirect_uri=https%3A%2F%2Fzernio.com%2Fapi%2Fv1%2Fconnect%2Fthreads%2Fcallback&scope=threads_basic%2Cthreads_content_publish%2Cthreads_read_replies%2Cthreads_manage_replies%2Cthreads_manage_insights%2Cthreads_delete&response_type=code&auth_type=rerequest&state=6a1ccc574b5ddae0b0eea48a-6aa0ba34022bb4cf3642e98f-1789664552374-https%253A%252F%252Fflow.workigom.com%252Fsosyal-medya-ct_682386d0a7c6ebc0d743950040278f5f16b2685b8fd6a871
```

Decoded query params:
- `client_id`: 1410550293434390
- `redirect_uri`: https://zernio.com/api/v1/connect/threads/callback
- `scope`: threads_basic, threads_content_publish, threads_read_replies, threads_manage_replies, threads_manage_insights, threads_delete
- `response_type`: code
- `auth_type`: rerequest

**What actually happens when we navigate to this URL**

We do NOT land on an app-authorization/consent screen (nothing mentioning "Zernio" or listing the requested permissions). Instead the browser ends up at `threads.net/login/` showing Threads' generic "Choose how you'd like to create your Threads account" screen (options: "Use Instagram account" / "Use phone number") — i.e., the account **creation/signup** flow, not an OAuth consent dialog for an existing app. No redirect back to `redirect_uri` happens at all, on either the success or `?error=...` path.

This strongly suggests Meta is not recognizing the request as a valid app-authorization request for `client_id=1410550293434390` — most likely because the Meta app behind this client_id doesn't have the Threads API / "Login with Threads" product properly added or enabled (or it's pointing at a different/older app ID than the one actually configured for Threads).

**Ask**

Could you check, on your Meta App Dashboard, for `client_id=1410550293434390`:
1. Is the "Threads API" product added and configured for this app?
2. Is this the correct/current app ID your integration should be using for Threads connect URLs, or has this drifted from a different app that's actually set up for Threads?
3. Is the app's Threads Login use case in a usable state (Live, or this account added as a tester)?

Happy to attempt again immediately once you've made a change, and can capture a fresh authUrl/HAR at that time.

Best regards,
Volkan
