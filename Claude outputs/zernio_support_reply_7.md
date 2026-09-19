Subject: Re: Threads OAuth connect never completes — checked account linkage, the eligible-account theory doesn't hold either (18.09.2026)

Hi,

Thanks for confirming the callback-side logs and passing this to Pau — appreciate it. We checked the specific thing you asked about right away.

**Checked:** Meta Accounts Center (`accountscenter.threads.com`) for the browser session that was logged in during our last test.

**Result:** The Threads profile (`workigom.com2026`) and the Instagram profile (`workigom.com2026`) are listed together under the same Accounts Center, same username, clearly linked as one identity — not two separate/unrelated profiles. We also checked the Instagram side directly (`instagram.com/accounts/professional_account_settings/`): it's a **Professional account**, category "Yazılım Şirketi" (Software Company), not a personal account.

So the specific failure mode you described — logged-in Threads profile not being the one backed by the eligible IG professional account — doesn't seem to match what we're seeing. They're the same account, and it's already a Business/Professional account, not a phone-only or personal Threads profile.

Screenshots of both (Accounts Center linkage + Instagram professional account settings) are attached for Pau's reference.

At this point we've ruled out, with direct evidence each time:
1. Client-side cache/cookies/session (3 independent browser reproductions — normal, incognito, cleared-cookie).
2. Simple "not logged in" (authenticated-session test — still no consent screen, callback never hit).
3. Wrong/unlinked Threads profile vs. IG professional account (Accounts Center shows them linked, IG account is Professional).

We're glad to keep narrowing this down together — let us know what Pau would like us to check next, or if a live synced session would be faster at this point.

Best regards,
Volkan
