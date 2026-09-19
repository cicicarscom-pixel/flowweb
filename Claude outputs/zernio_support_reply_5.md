Subject: Re: Threads OAuth connect never completes — reproduced in 3 independent browser sessions today (18.09.2026), plus a new technical detail

Hi,

Continuing from our messages yesterday (17.09) and earlier today — we ran three more independent reproductions today, specifically to rule out any client-side (cache/cookie/session) explanation, and the result was identical every time.

**Reproduction 1 — normal browser session (18.09, ~18:24 UTC):**
Fresh `authUrl` captured, same structure as yesterday's report (`client_id=1410550293434390`, same scopes, same `redirect_uri`). Landed on `threads.com/login/`, the generic "Choose how you'd like to create your Threads account" screen.

**Reproduction 2 — Chrome Incognito window (18.09):**
Brand new session, no cookies/local storage from any prior attempt. Same result: `threads.com/login/` → "Threads hesabını nasıl oluşturmak istediğini seç" (account-creation chooser: "Use Instagram account" / "Use phone number"). This rules out stale session/cookie state as the cause.

**Reproduction 3 — Opera, cookies manually cleared beforehand (18.09):**
Same result again, third browser engine, guaranteed-clean cookie jar. Identical landing screen.

So across three different browsers/session states today, the behavior is 100% consistent: Meta is never presenting an app-authorization/consent screen for `client_id=1410550293434390` — it always routes straight to the generic Threads account-creation flow.

**New technical detail from today's testing:**

1. From Reproduction 2, clicking "Use Instagram account" on that chooser screen redirects to `instagram.com/accounts/login/?force_authentication&platform_app_id=1289884158133322&enable_fb_login&...` — note that `platform_app_id` here is **1289884158133322**, which is a *different* ID from the `client_id=1410550293434390` we're using for the Threads connect URL. We don't know if this is expected (a generic Instagram-login-bridge app ID Meta uses internally for this chooser flow) or a clue that the Threads connect request itself isn't being tied to the right app — flagging it in case it's useful on your end.

2. From Reproduction 3, we inspected the Network tab on `threads.com/login/` and found a `bootloader-endpoint` XHR request loading module `BarcelonaLoginRoot.react`, whose internal Comet route (`__crn` param) resolves to something ending in `...BarcelonaSignUpLandingRoute`. This is Threads' own frontend explicitly naming the page it rendered for us as a **sign-up landing route** — not an OAuth/app-authorization route. This is a concrete, name-level confirmation (not just visual) that Meta's server is treating this as a plain sign-up visit rather than a third-party app authorization request.

Taken together, this points even more clearly at the Meta App configuration behind `client_id=1410550293434390` not being recognized as a valid Threads API app-authorization request — consistent with what we asked in our last two messages, still unanswered:

1. Is the "Threads API" product added and configured for the Meta App behind `client_id=1410550293434390`?
2. Is this the correct/current app ID your integration should be using for Threads connect URLs, or has this drifted from a different app that's actually set up for Threads?
3. Is the app's Threads Login use case in a usable state (Live, or has our account been added as a tester)?
4. Is `https://zernio.com/api/v1/connect/threads/callback` registered as an allowed redirect URI for this app's Threads product specifically?

We're happy to reproduce again and capture a fresh HAR/authUrl as soon as you've made a change, to confirm the fix on our end.

Best regards,
Volkan
