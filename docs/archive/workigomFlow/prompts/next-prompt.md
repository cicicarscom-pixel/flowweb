---
page: inbox
screen: 02-inbox
route: /inbox
status: active
next: social
---

workigomFlow — Unified Omnichannel Inbox. THE core screen. All DMs, comments, and reviews from Instagram, Facebook, TikTok, YouTube, LinkedIn, Google Business, WhatsApp in one place. Mobile 390×844. Turkish UI.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile app UI, iOS-inspired, 390×844 frame
- Theme: Deep Dark Mode (#0A0A0B), glassmorphism, anti-gravity floating layers
- Glass Surface: rgba(32,31,34,0.4), backdrop-blur 20px, 1px border rgba(255,255,255,0.05)
- Module Accent: Electric Cyan (#00F0FF) + Mint (#4EDEA3) — AI communication hub
- Text Primary: #E5E2E3 | Text Secondary: #849495
- Typography: Inter + JetBrains Mono for timestamps
- Bottom Nav: Floating glass pill, 5 tabs (Gelen Kutusu active)
- Language: Turkish

**Page Structure:**
1. **Header (64px):** "Gelen Kutusu" title, search icon right, multi-select toggle icon (checkbox mode)
2. **Tab Bar:** Glass pill container — "Mesajlar" (active, Cyan underline glow), "Yorumlar", "Değerlendirmeler"
3. **Conversation List:** Vertical scrollable glass rows (72px min height each):
   - Row 1: Avatar (40px circle) + Instagram badge (16px, bottom-right of avatar) + "Ayşe Demir" + "Merhaba, ürününüz hakkında..." preview + "14:32" timestamp. Unread: Cyan dot left edge.
   - Row 2: Avatar + WhatsApp badge (green) + "Mehmet K." + "Randevu alabilir miyim?" + "13:15"
   - Row 3: Avatar + TikTok badge + "Zeynep A." + "Harika video! 🔥" + "12:40"
   - Row 4: Avatar + Facebook badge + "Can T." + "Fiyat bilgisi alabilir miyim?" + "11:20"
   - Row 5: Avatar + YouTube badge + "Burak S." + "Yeni videonuz ne zaman?" + "Dün"
4. **Tree-View hint (Comments tab state):** Show one expanded comment thread — parent comment full-width, child reply indented 24px with "↳ @AyşeDemir Teşekkürler!" in Cyan, connected by 1px vertical line
5. **Floating Pill Input:** Fixed 20px above bottom nav — capsule shape (52px height), glass background, placeholder "Mesaj yaz...", AI sparkle icon, Cyan gradient send button circle. Level 2 elevation shadow.
6. **Bottom Navigation:** Gelen Kutusu tab active (Cyan glow)

**Critical Rules:**
- Platform badge icons MUST be crisp 16px in colored circles — Instagram pink, WhatsApp green, TikTok cyan, Facebook blue, YouTube red
- Unread messages: brighter glass + Cyan dot indicator
- Never ambiguous platform origin — icon placement consistent on every row
