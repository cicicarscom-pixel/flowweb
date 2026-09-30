---
name: workigomFlow
project: Omnichannel AI Dijital Asistan
version: 1.0.0
platform: mobile
frame: 390×844
colors:
  background: '#0A0A0B'
  background-alt: '#131315'
  surface-glass: 'rgba(32,31,34,0.4)'
  surface-glass-hover: 'rgba(32,31,34,0.55)'
  border-glass: 'rgba(255,255,255,0.05)'
  border-glass-active: 'rgba(255,255,255,0.12)'
  on-surface: '#E5E2E3'
  on-surface-variant: '#849495'
  outline: '#3B494B'
  ai-primary: '#00F0FF'
  ai-secondary: '#4EDEA3'
  ai-border: '#00A2FF'
  social-primary: '#BC13FE'
  finance-primary: '#FFB95F'
  success: '#4EDEA3'
  error: '#FF6B6B'
  warning: '#FFB95F'
  instagram: '#E1306C'
  facebook: '#1877F2'
  tiktok: '#00F2EA'
  youtube: '#FF0000'
  linkedin: '#0A66C2'
  google-business: '#4285F4'
  whatsapp: '#25D366'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.43'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.33'
    letterSpacing: 0.05em
  metric-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.1'
  metric-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  md: 0.5rem
  lg: 1rem
  xl: 1.5rem
  card: 1.5rem
  button: 1rem
  pill: 9999px
spacing:
  unit: 8px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 32px
  screen-margin: 20px
  glass-padding: 20px
  bento-gap: 12px
  nav-offset-bottom: 20px
elevation:
  level-0: none
  level-1: '0 4px 20px rgba(0,0,0,0.5)'
  level-2: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(0,240,255,0.1)'
  level-3: '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(0,240,255,0.15)'
  fab: '0 8px 24px rgba(0,240,255,0.35), 0 4px 12px rgba(188,19,254,0.2)'
blur:
  glass-sm: 12px
  glass-md: 20px
  glass-lg: 40px
---

# Design System: workigomFlow
**Project:** Omnichannel AI Dijital Asistan  
**Version:** 1.0.0  
**Platform:** Mobile-first (390×844), iOS-inspired depth

---

## 1. Visual Theme & Atmosphere

workigomFlow is the **business brain** for Turkish SMB owners — a premium omnichannel cockpit that unifies social media, WhatsApp, AI automation, analytics, and lightweight accounting into one calm, focused interface.

The aesthetic merges **Deep Dark Mode** with **Glassmorphism** and **Anti-gravity** floating layers. Despite handling massive data flows (multi-platform inbox, cross-channel publishing, financial metrics), the UI must feel as clean as Apple or Stripe — never cluttered, never exhausting.

**Emotional Target:** Calm, focused control. The user should feel like a pilot in a sophisticated cockpit, not overwhelmed by a control panel.

**Key Characteristics:**
- Infinite digital space via deep coal-black backgrounds (#0A0A0B)
- Frosted glass surfaces that float at distinct depth levels
- Module-specific neon accents (Cyan for AI, Purple for Social, Orange for Finance)
- Generous whitespace — content breathes, glows have room to project
- Turkish UI labels throughout (*Gelen Kutusu*, *Bot Yönetimi*, *AI Muhasebe*)
- Photography and platform logos treated as first-class visual elements

---

## 2. Color Palette & Roles

### Foundation
| Name | Hex | Role |
|------|-----|------|
| **Coal Black** | `#0A0A0B` | Primary background — infinite canvas |
| **Charcoal Alt** | `#131315` | Secondary background, scroll areas |
| **Frosted Glass** | `rgba(32,31,34,0.4)` | All cards, bubbles, menus — always with backdrop-blur |
| **Whisper Border** | `rgba(255,255,255,0.05)` | 1px glass edge definition |
| **Active Border** | `rgba(255,255,255,0.12)` | Connected/selected/hover states |

### Typography Colors
| Name | Hex | Role |
|------|-----|------|
| **Soft White** | `#E5E2E3` | Headlines, primary body text |
| **Muted Slate** | `#849495` | Secondary text, timestamps, placeholders |
| **Outline Gray** | `#3B494B` | Dividers, inactive icons |

### Module Accents
| Module | Primary | Secondary | Usage |
|--------|---------|-----------|-------|
| **AI / Bot** | Electric Cyan `#00F0FF` | Mint Green `#4EDEA3` | Bot management, AI generation, inbox auto-reply, system instruction card border `#00A2FF` |
| **Social Media** | Neon Purple `#BC13FE` | — | Platform cards, social connection grid, publish screen |
| **Finance / Muhasebe** | Warm Orange `#FFB95F` | — | Revenue/expense cards, invoice scanner, scheduled publish |

### Functional States
| Name | Hex | Role |
|------|-----|------|
| **Success Mint** | `#4EDEA3` | Connected status, positive deltas, income metrics |
| **Alert Coral** | `#FF6B6B` | Errors, expense metrics, destructive actions |
| **Warning Amber** | `#FFB95F` | Scheduled items, pending states |

### Platform Brand Colors (Glow Only)
Each platform card/icon uses its authentic brand color as a **subtle outer glow** (10–20px Gaussian blur, 40% opacity):
- Instagram `#E1306C` → gradient pink-purple
- Facebook `#1877F2`
- TikTok `#00F2EA` + `#FF0050`
- YouTube `#FF0000`
- LinkedIn `#0A66C2`
- Google Business `#4285F4`
- WhatsApp `#25D366`

---

## 3. Typography Rules

**Primary:** Inter — neutral, highly legible on dark glass  
**Technical/Data:** Geist — metrics, timestamps, metadata, extracted invoice fields

### Hierarchy
| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| Display | Inter | 32px | 700 | Screen titles, hero metrics |
| Headline | Inter | 24px | 600 | Section headers, card titles |
| Subhead | Inter | 20px | 600 | Subsection labels |
| Body | Inter | 16px | 400 | Message previews, descriptions |
| Caption | Inter | 14px | 400 | Secondary content, tab labels |
| Label | Geist | 12px | 500 | Badges, deltas, timestamps, handles |
| Metric XL | Inter | 28–32px | 700 | Financial numbers, analytics KPIs |

### Principles
- Headlines: tight letter-spacing (-0.02em) for authoritative feel
- Body: relaxed line-height (1.5) for readability on glass
- Metrics: bold weight, no letter-spacing — numbers dominate
- Turkish labels treated as navigation anchors, never translated

---

## 4. Component Library

### 4.1 Glass Card (Base Container)
- **Background:** Frosted Glass `rgba(32,31,34,0.4)`
- **Blur:** 20px backdrop-filter
- **Border:** 1px Whisper Border `rgba(255,255,255,0.05)`
- **Corners:** Generously rounded (24px / 1.5rem)
- **Shadow:** Level 1 elevation
- **Internal glow:** Subtle radial gradient from top-left (white 3% → transparent)
- **Padding:** 20px standard
- **Module stripe:** Optional 3px left edge in module accent color

### 4.2 Glass Button — Primary
- **Shape:** Rounded (16px), full-width or auto
- **Fill:** Linear gradient Electric Cyan `#00F0FF` → Neon Purple `#BC13FE`
- **Text:** Soft White `#E5E2E3`, Inter 16px medium
- **Glow:** 10px Cyan drop shadow at 40% opacity
- **Press:** Scale 0.98, border brightness doubles
- **Height:** 48px minimum (touch target)

### 4.3 Glass Button — Secondary (Ghost)
- **Fill:** Transparent
- **Border:** 1px module accent color (Cyan/Purple/Orange)
- **Text:** Accent color or Soft White
- **Hover:** 5% accent fill overlay

### 4.4 FAB (Floating Action Button)
- **Size:** 56×56px circle
- **Fill:** Cyan→Purple gradient
- **Shadow:** FAB elevation (dual Cyan + Purple glow)
- **Position:** Bottom-right, 20px from edges, above bottom nav
- **Usage:** "Seçili Platformlarda Paylaş" — always the largest interactive element

### 4.5 Floating Pill Input
- **Shape:** Full-radius capsule (height 52px)
- **Background:** Frosted Glass with 40px blur
- **Border:** 1px Whisper Border, Cyan glow on focus
- **Margin:** 16px horizontal, fixed 20px above bottom nav
- **Contents:** Placeholder text (left), AI sparkle icon, send button (Cyan gradient circle, right)
- **Shadow:** Level 2 elevation — appears detached from content

### 4.6 Platform Badge
- **Size:** 16×16px icon inside 20×20px colored circle
- **Placement:** Bottom-right of avatar OR inline before username
- **Style:** Platform logo on semi-transparent brand-color background
- **Rule:** Must be crisp and consistent across all screens

### 4.7 Status Chip
- **Shape:** Pill (full-radius)
- **Height:** 24px
- **Fill:** Accent color at 15% opacity
- **Text:** Solid accent color, Geist 12px
- **States:** "Bağlı" (green), "Aktif" (cyan), "Durduruldu" (gray), "İşleniyor" (pulsing cyan)

### 4.8 Tab Bar (Inbox / Analytics)
- **Container:** Glass pill, horizontal
- **Tabs:** "Mesajlar", "Yorumlar", "Değerlendirmeler" OR time filters
- **Active:** Cyan underline glow + brighter text
- **Inactive:** Muted Slate text
- **Transition:** 200ms ease on indicator slide

### 4.9 Toggle Switch (iOS-style)
- **Track:** 51×31px, gray when off, accent when on
- **Thumb:** White circle with subtle shadow
- **Labels:** Icon + text left, switch right
- **Usage:** WhatsApp Bot / Sosyal Medya Bot toggles

### 4.10 Checkbox (Multi-Select)
- **Shape:** Circle, 22×22px
- **Empty:** 1px Whisper Border
- **Selected:** Cyan fill + white checkmark
- **Usage:** Inbox multi-select mode only

### 4.11 Bottom Navigation
- **Style:** Floating glass pill bar
- **Position:** 20px from bottom screen edge
- **Height:** 72px
- **Blur:** 40px backdrop-filter
- **Shadow:** Level 2 elevation
- **Tabs (5):** Ana Sayfa, Gelen Kutusu, AI Paylaş, Analitik, Bot
- **Active tab:** Cyan icon + label glow
- **Inactive:** Muted Slate

### 4.12 Tree-View Reply Row
- **Indent:** 24px per nesting level
- **Prefix:** "↳ @username" in Electric Cyan
- **Connector:** 1px vertical line on left edge (Whisper Border)
- **Background:** Slightly dimmer glass than parent comment

### 4.13 System Instruction Card (Bot Hero)
- **Border:** 1.5px Electric Cyan `#00A2FF` neon line
- **Aura:** Rotating/pulsing Cyan radial gradient behind card (200px, 15% opacity, blur 40px)
- **Size:** Full-width minus margins, min-height 200px
- **Content:** Editable textarea, character count, "Kaydet" ghost button
- **This is always the focal point of BotYonetimiScreen**

### 4.14 Metric Card (Finance / Analytics)
- **Layout:** Label (Geist 12px, Muted Slate) → Value (Metric XL, bold) → Delta (Geist, green/red)
- **Income:** Success Mint `#4EDEA3`
- **Expense:** Alert Coral `#FF6B6B`
- **Module stripe:** Orange for finance, Purple for social analytics

### 4.15 Chart Container
- **Background:** Glass card
- **Grid lines:** `rgba(255,255,255,0.05)`
- **Stroke colors:** Platform brand neon colors
- **No harsh white axes** — all labels in Muted Slate
- **Legend:** Colored dots + platform name, Geist 12px

---

## 5. Layout Principles

### Grid & Structure
- **Frame:** 390×844 (iPhone 14 Pro reference)
- **Mobile grid:** 4-column bento, elements span 2 or 4 columns
- **Screen margin:** 20px horizontal
- **Section gap:** 24px vertical between major blocks
- **Bento gap:** 12px between cards in same row

### Depth Layers (Z-Axis)
| Level | Element | Blur | Shadow |
|-------|---------|------|--------|
| 0 | Background + radial glows | — | — |
| 1 | Static glass cards, lists | 20px | Level 1 |
| 2 | Floating input, bottom nav, hovered cards | 40px | Level 2 |
| 3 | Modals, bottom sheets, FAB | 40px | Level 3 |

### Whitespace Strategy
- **Never cramped** — if data is dense, increase section gaps, not reduce padding
- **Breathing room for glows** — neon effects need 16px+ clear space around them
- **Single focal point per screen** — one hero element dominates visual hierarchy
- **Scroll areas:** Content scrolls; header + bottom nav remain fixed

### Fixed Dimensions
| Element | Height |
|---------|--------|
| Header | 64px |
| Bottom Nav | 72px + 20px offset |
| Floating Input Pill | 52px |
| Platform Card (grid) | ~140px |
| Conversation Row | 72px min |

---

## 6. Screen Specifications

### 6.1 Dashboard (Ana Ekran + Ön Muhasebe)
**Route:** `/` | **Module accent:** Mixed (Cyan + Orange)

**Structure:**
1. Greeting — "Günaydın, [İsim]" + date (Muted Slate)
2. AI Daily Summary Bubble — glass card, Cyan left stripe, sparkle icon, briefing text
3. Financial Bento (2-col) — "Toplam Gelir" (green) + "Toplam Gider" (red), Orange module stripe
4. Invoice Scanner Split-View — left: photo thumbnail, right: AI-extracted fields (Geist Mono)
5. Appointments Timeline — vertical timeline, Cyan dots, connecting line
6. Bottom Navigation — floating glass pill

**Focal point:** AI Daily Summary Bubble  
**Data density:** Highest — counterbalance with extra whitespace

---

### 6.2 InboxScreen (Gelen Kutusu) ★ Core Screen
**Route:** `/inbox` | **Module accent:** Electric Cyan

**Structure:**
1. Header — "Gelen Kutusu", search icon, multi-select toggle
2. Tab Bar — "Mesajlar" | "Yorumlar" | "Değerlendirmeler"
3. Conversation List — avatar + platform badge + preview + timestamp
4. Tree-View (Comments tab) — nested replies with ↳ prefix
5. Multi-Select Mode — circular checkboxes, "X seçildi" + "Sil" bar
6. Floating Pill Input — above bottom nav
7. Bottom Navigation

**Focal point:** Conversation list with platform badges  
**Critical rule:** Platform icons must be crisp, consistent 16px, never ambiguous

---

### 6.3 SosyalMedyaScreen (Hesap Bağlantı)
**Route:** `/social` | **Module accent:** Neon Purple

**Structure:**
1. Header — "Sosyal Medya Hesapları", "Senkronize Et" button (top-right)
2. Status Bar — "7/7 Hesap Bağlı" with progress ring
3. Connection Grid (2-col) — 7 platform cards with brand-color glows
4. Connected State — green "Bağlı" badge, profile avatar, handle
5. Card Actions — "Hesabı Ayır" / "Yeniden Bağla"
6. Bottom Navigation

**Platforms:** Instagram, Facebook, TikTok, YouTube, LinkedIn, Google Business, WhatsApp  
**Disconnected:** Dim glass, muted glow, "Hesap Bağla" CTA  
**Connected:** Brighter border, pulsing green status dot

---

### 6.4 AiUretimScreen (AI ile Paylaş)
**Route:** `/publish` | **Module accent:** Cyan + Purple

**Structure:**
1. Header — "AI ile Paylaş", back arrow
2. Preview Area — 4:5 glass card, image + "Görsel Seç" overlay
3. Caption Editor — glass textarea, character count
4. Platform Selector — horizontal scroll, 48px icon checkboxes
5. Publish Options — "Hemen Yayınla" / "Planla" radio pills
6. Actions — "Yapay Zeka ile Metin Üret" (ghost) + FAB "Seçili Platformlarda Paylaş"
7. Bottom Navigation

**Focal point:** Preview area (top 40%) + FAB  
**AI state:** Pulsing Cyan border on text area during generation

---

### 6.5 AnalyticsScreen (Analitik)
**Route:** `/analytics` | **Module accent:** Neon Purple

**Structure:**
1. Header — "Analitik", export icon
2. Time Filter Pills — "Son 7 Gün" | "Son 30 Gün" | "Tüm Zamanlar"
3. Summary Cards (horizontal scroll) — Erişim, Takipçi Artışı, Etkileşim Oranı
4. Platform Charts — one glass card per platform with mini chart
5. Combined Chart — multi-line overlay, legend bottom
6. Bottom Navigation

**Focal point:** Summary KPI cards  
**Charts:** Dark grid, neon strokes, no harsh white axes

---

### 6.6 BotYonetimiScreen (Bot Yönetimi)
**Route:** `/bot` | **Module accent:** Electric Cyan + Mint

**Structure:**
1. Header — "Bot Yönetimi", "Aktif" status chip
2. System Instruction Card (Hero) — neon border, rotating aura, editable textarea
3. Platform Toggles — "WhatsApp Botu" + "Sosyal Medya Botu"
4. Role Presets — horizontal chip scroll (Müşteri Hizmetleri, Satış Asistanı, etc.)
5. Bot Preview — sample auto-reply chat bubble
6. Bottom Navigation

**Focal point:** System Instruction Card — always center-stage, largest element

---

## 7. Stitch / Figma Generation Guide

### Master Prompt Prefix (paste before any screen prompt)
```
workigomFlow mobile dashboard. Deep Dark Mode (#0A0A0B), glassmorphism cards (rgba(32,31,34,0.4), 20px blur), module neon accents (AI: #00F0FF, Social: #BC13FE, Finance: #FFB95F). Inter + Geist typography. iOS floating depth. Turkish UI labels. Apple/Stripe cleanliness. 390×844 frame.
```

### Screen Generation Order
1. Dashboard → establishes nav + bento pattern
2. InboxScreen → core UX, platform badges
3. SosyalMedyaScreen → platform card grid
4. AiUretimScreen → FAB + preview flow
5. AnalyticsScreen → charts + KPI cards
6. BotYonetimiScreen → hero card + toggles

### Language Rules for Prompts
| Avoid | Use Instead |
|-------|-------------|
| `rounded-xl` | "generously rounded corners (24px)" |
| `shadow-lg` | "iOS-style floating shadow with Cyan glow" |
| `bg-gray-900` | "Frosted Glass surface (#0A0A0B background showing through)" |
| `text-sm` | "Caption text in Muted Slate (#849495)" |
| "blue button" | "Primary glass button with Cyan→Purple gradient" |

### Incremental Edit Pattern
When refining a screen, change ONE component at a time:
```
Update the Floating Pill Input on InboxScreen: increase height to 52px, add AI sparkle icon left of send button, ensure 20px gap above bottom nav. Preserve all other elements.
```

---

## 8. Accessibility & Interaction Notes

- **Touch targets:** Minimum 44×44px for all interactive elements
- **Contrast:** Soft White on Coal Black = 15.8:1 (AAA)
- **Focus states:** Cyan outer glow on all inputs and buttons
- **Reduced motion:** Disable aura rotation, use static glow instead
- **Platform icons:** Always include text label or tooltip for screen readers
- **Multi-select:** Announce count ("3 mesaj seçildi") for assistive tech

---

## 9. File & Asset Conventions

```
workigomFlow/
├── DESIGN.md              ← this file (source of truth)
├── screens/
│   ├── 01-dashboard.png
│   ├── 02-inbox.png
│   ├── 03-social.png
│   ├── 04-ai-publish.png
│   ├── 05-analytics.png
│   └── 06-bot-management.png
├── components/
│   └── (Figma component library exports)
└── prompts/
    └── next-prompt.md     ← active Stitch iteration prompt
```

---

*Generated for workigomFlow v1.0 — Omnichannel AI Dijital Asistan*
