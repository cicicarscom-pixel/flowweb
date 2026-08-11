# workigomFlow — Site Vision & Roadmap

**Product:** Omnichannel AI Dijital Asistan  
**Platform:** Mobile-first (390×844)  
**Language:** Turkish UI  
**Design System:** `DESIGN.md`

---

## 1. Vision

workigomFlow, işletmelerin tüm sosyal medya hesaplarını, WhatsApp iletişimini, AI otomasyonunu, analitiği ve ön muhasebeyi tek bir premium kokpitte birleştiren "işletme beyni" platformudur.

Arayüz Apple/Stripe temizliğinde olmalı — devasa veri akışına rağmen asla kalabalık hissettirmemeli.

---

## 2. Stitch Project

| Field | Value |
|-------|-------|
| **Project Name** | workigomFlow |
| **Project ID** | _(Stitch'te oluşturulacak — stitch.json'a kaydedilecek)_ |
| **Device Type** | MOBILE (390×844) |
| **Generation Tool** | Stitch MCP / Figma AI |

---

## 3. Navigation Architecture

```
Bottom Nav (5 tabs):
├── Ana Sayfa      → / (Dashboard)
├── Gelen Kutusu   → /inbox
├── AI Paylaş      → /publish
├── Analitik       → /analytics
└── Bot            → /bot

Secondary:
└── Sosyal Medya   → /social (Dashboard'dan veya settings'ten erişim)
```

---

## 4. Sitemap

| # | Screen | File | Route | Status |
|---|--------|------|-------|--------|
| 1 | Dashboard (Ana Ekran + Ön Muhasebe) | `index.html` | `/` | [x] |
| 2 | InboxScreen (Gelen Kutusu) | `inbox.html` | `/inbox` | [ ] |
| 3 | SosyalMedyaScreen | `social.html` | `/social` | [ ] |
| 4 | AiUretimScreen (AI ile Paylaş) | `publish.html` | `/publish` | [ ] |
| 5 | AnalyticsScreen | `analytics.html` | `/analytics` | [ ] |
| 6 | BotYonetimiScreen | `bot.html` | `/bot` | [ ] |

---

## 5. Roadmap (Generation Order)

1. [x] **Dashboard** — Nav pattern + bento grid + finance + timeline kurulumu
2. [ ] **InboxScreen** — Core UX, platform badges, floating pill input, tree-view
3. [ ] **SosyalMedyaScreen** — Platform connection grid, brand glows
4. [ ] **AiUretimScreen** — Preview + platform checkboxes + FAB
5. [ ] **AnalyticsScreen** — KPI cards + neon charts + time filters
6. [ ] **BotYonetimiScreen** — System instruction hero card + toggles + presets

---

## 6. Shared Components (Cross-Screen)

Bu component'ler ilk ekranda (Dashboard) oluşturulur, sonraki ekranlarda tekrar kullanılır:

- [x] Bottom Navigation (floating glass pill, 5 tabs)
- [x] Glass Card (base container)
- [x] Header (64px, title + optional actions)
- [ ] Floating Pill Input (Inbox'ta)
- [ ] Platform Badge (Inbox + Social'ta)
- [ ] Tab Bar (Inbox + Analytics'te)
- [ ] FAB (Publish'te)
- [ ] Metric Card (Dashboard + Analytics'te)
- [ ] Toggle Switch (Bot'ta)
- [ ] System Instruction Card (Bot'ta)

---

## 7. Creative Freedom (Future Screens)

- Ayarlar / Profil ekranı
- Randevu detay ekranı
- Fatura listesi ekranı
- Bildirim merkezi
- Onboarding / hesap bağlama wizard'ı

---

## 8. Iteration Log

| Date | Screen | Notes |
|------|--------|-------|
| 2026-08-04 | Dashboard | İlk ekran — HTML prototype + next-prompt.md oluşturuldu |
