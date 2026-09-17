Subject: Threads OAuth connect never completes — no error returned to redirect_url

Hi Zernio team,

We're integrating the Connect API (`GET /v1/connect/{platform}`) and are stuck trying to connect a Threads account. Details below.

**What we're seeing**

- We call `GET /v1/connect/threads` with a valid `profileId` and `redirect_url`, and receive a valid `authUrl` back (200 OK) — this part works correctly.
- The browser is redirected to that `authUrl` and the user logs into Instagram/Threads normally.
- After login, the browser does NOT come back to our `redirect_url` at all — instead it lands on threads.net's own home feed, as if the OAuth flow was silently abandoned.
- No error is ever delivered to our `redirect_url`. Per your docs ("Get OAuth connect URL" reference page), any failure should redirect back to `redirect_url` with `platform`, `error`, and `error_message` query params — our app already handles that case (we show the error to the user), but we never receive it. The flow just dead-ends on Meta's side before ever returning to Zernio or to us.

**What we've already ruled out on our end**

- The connecting Instagram account is a Business account and is public (not private/restricted).
- The Threads profile itself is public as well.
- The same connect flow (same code path, same `get-connect-url` call, only `platform` differs) works correctly for our other platforms.
- Our `redirect_url` and profile resolution logic are confirmed correct — the `get-connect-url` call succeeds and returns a well-formed `authUrl`; the profile/account records on our side show nothing unusual.

**What this points to**

Since the failure never reaches the redirect_url-with-error-params mechanism your docs describe, the break appears to happen inside Meta's own authorization dialog, before it ever hands control back to Zernio's callback. The most common cause of this exact symptom (silent drop back to the platform's own home screen, no error, no redirect) is the connecting Meta app not yet being in Live mode for the Threads permissions (`threads_basic`, `threads_content_publish`, etc.), or the connecting account not being added as a tester/developer on that Meta app while it's still in Development mode.

**Could you check:**

1. The Live/App Review status of the Threads permissions on the Meta app used for our Zernio integration.
2. Whether our account needs to be added as a tester on that Meta app.

**Reference info**

- Platform: `threads`
- Zernio profile ID used in the failed attempt: `6a98de50aab7e58f1846456e`
- Attempts were made today via both our web app and mobile app, both showing the identical behavior.

Thanks for looking into this — happy to provide HAR/network logs from our side if useful.

Best regards,
Volkan
