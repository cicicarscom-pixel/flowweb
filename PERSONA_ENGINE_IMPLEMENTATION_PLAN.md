# Persona Engine — Uygulama Planı (Workigom Flow / AI Asistan)

**Durum:** v15 — PHASE 0, 1 ve 3 CANLI ORTAMDA DOĞRULANDI ve repoya commit'lenip push edildi; PHASE 2 ve PHASE 4 kod düzeyinde tamamlandı, deploy/canlı doğrulama bekleniyor; **PHASE 5 kısmen tamamlandı (sadece WEB — mobil hâlâ yapılmadı, bkz. FAZ 5 raporu madde 5).** Kullanıcı planı onayladı, uygulama sırasını kilitledi ve 12 maddelik ek koruma/ince ayar verdi (v5); v6-v14 önceki fazları raporladı. **v15'te FAZ 5 (web)** ile `flowweb`'in ai-asistan sayfası artık ham seçimleri `organization_ai_settings`'e yazıyor (bir merged prompt string DEĞİL) ve Canlı Test artık `persona-test`'i kullanıyor — bu, `flowweb`/`flow` repolarına dokunulan ilk faz.
**Kaynak:** Master Implementation Prompt (33 madde) + `flowweb`/`flow`/`ledger` repolarının gerçek kod incelemesi (v1-v4) + kullanıcının onay/guardrail notları (v5)

---

## ✅ ONAYLANMIŞ UYGULAMA KURALLARI (Execution Guardrails)

> Bu blok, kullanıcının onayladığı ve uygulayıcıya (Antigravity veya başka bir agent/geliştirici) doğrudan verilebilecek kırmızı çizgiler ve sıralamadır. Aşağıdaki bölümler (0. Discovery, 1. Persona Veri Modeli, 2. Faz Planı) bu kuralların gerekçesini ve detayını açıklıyor.

**Mimari karar:** Mevcut WORKIGOM AI CORE yeniden yazılmayacak. Discovery'de doğrulandığı üzere canonical Flow AI hattı zaten `WAHA/Zernio → HandleIncomingMessageUseCase → AIOrchestrator → PromptBuilder → Gemini + ToolRegistry` şeklinde çalışıyor. Persona Engine bu mevcut mimarinin üzerine entegre edilecek, paralelikinci bir mimari kurulmayacak.

1. **Ledger AI kesinlikle kapsam dışı.** DOKUNULMAYACAK dosyalar: `ledger-ai-chat`, `ledger-process-document`, `mutabakat-chat`, `ledger-generate-schema`, `ledger-isleyici-api`, `ledger_mimar_google_api`, **`gemini-chat`**.
1b. **[v8, kullanıcı kararı] `whatsapp-webhook` (Zernio üzerinden sağlanan resmi WhatsApp yapılandırması) da kapsam dışı ve DOKUNULMAYACAK.** Açık kalan "Seçenek A / Seçenek B" kararı kullanıcı tarafından **Seçenek B** olarak kesinleştirildi: bu fonksiyon hiçbir fazda değiştirilmeyecek, `AIOrchestrator`/`PromptBuilder`/`PersonaService`'e taşınmayacak. Bu dosya artık `gemini-chat` ve Ledger AI fonksiyonlarıyla aynı korumaya sahip — DOKUNULMAYACAK listesine eklendi. Bkz. Bölüm 0.9 — bu fonksiyonun AI'a bağlandığı tam nokta, hiçbir kod değişikliği yapılmadan, sadece dokümante edildi.
2. **Persona render işlemi client tarafında yapılmayacak.** Web ve mobil sadece ham seçimleri kaydeder: `persona_id, business_role, tone, persona_intensity, humor_level, modern_adaptation, custom_instruction`.
3. **Runtime persona üretimi sunucu tarafında olacak:** `PersonaRepository → PersonaService → PersonaPromptBuilder → PromptBuilder.buildBotPersonality()`.
4. **Persona data-driven olacak.** Yeni persona eklemek frontend/backend branch logic gerektirmeyecek (`if persona === "adam-smith"` YOK, persona'ya özel application kodu YOK).
5. **Customer Relations Policy persona'nın içine eklenmeyecek.** Policy `PromptBuilder`'ın `SYSTEM_POLICY` katmanında kalacak; SYSTEM POLICY her zaman BOT PERSONALITY'den önceliklidir.
6. **`bot_settings.system_prompt` migration sırasında fallback olarak korunacak.** Yeni persona config varsa yeni engine kullanılır; yoksa legacy `system_prompt` fallback olur. Kolon ilk migration'da silinmeyecek.
7. **Canlı Test için `gemini-chat` değiştirilmeyecek.** Yeni bir `persona-test` Edge Function oluşturulacak; bu fonksiyon gerçek `PromptBuilder`/`AIOrchestrator`/`ToolRegistry` pipeline'ını kullanacak ama gerçek dış kanala (WAHA/Zernio) mesaj göndermeyecek.
8. **Live Test için `executionMode: "production" | "simulation"` eklenecek.** Write/external-action tool'lar simulation modunda gerçek side effect oluşturmayacak (ör. randevu tool'u gerçek DB yazmak yerine `WOULD_CREATE_APPOINTMENT` döner ya da test verisine yazar).
9. **`ai_personas` modeline minimum `version`, `persona_schema_version`, `status` eklenecek.** Status: `draft | testing | published | archived`.
10. **İlk curated katalog:** `Standart, Albert Einstein, Adam Smith, William Shakespeare, Mimar Sinan, Nikola Tesla` ile sınırlı. Yeni persona sayısı, behavior/compliance testleri tamamlanmadan artırılmayacak. (Gordon Ramsay ve Sherlock Holmes — mobildeki mevcut kayıtlar — silinmeyecek ama v1 seed'ine dahil edilmeyecek.)
11. **Her faz sonunda STOP + REPORT, ardından Ledger regression smoke test, ardından Antigravity'ye verilecek bir "deploy/doğrulama promptu" yazılır.** [v11] Bu oturumun Supabase CLI/API/deploy erişimi yok — sadece dosya okuma/yazma. Bu yüzden her fazın raporunun sonuna, o fazda yapılması gereken deploy/migration/test-çalıştırma adımlarını ve kırmızı çizgileri içeren, doğrudan kopyala-yapıştır ile Antigravity'ye (veya başka bir CLI/deploy erişimi olan araca) verilebilecek bir prompt bloğu ekleniyor.
12. **Uygulama sırası kilitlendi (bir sonraki faza geçmeden önce mevcut faz doğrulanmalı):**

```
PHASE 0 — Safety Snapshot / Ledger Isolation Verification
PHASE 1 — Persona Database Schema (+ seed + media)
PHASE 2 — PersonaRepository + PersonaService + PersonaPromptBuilder
PHASE 3 — PromptBuilder Integration (fallback'li)
PHASE 4 — persona-test Real Pipeline (simulation mode)
PHASE 5 — Web/Mobile Settings Save Refactor
PHASE 6 — Persona Carousel UI
PHASE 7 — Persona Compliance/Evaluation Tests (status gating)
PHASE 8 — Admin Persona Creator
```

**Persona Engine Modeli (AGENTS.md'ye işlenmesi önerilir):**

```
Persona Engine          = Player   (asla persona'ya özel kod içermez)
ai_personas kaydı       = Cassette (data, insert/update ile eklenir)
organization_ai_settings = Player Settings (hangi kaset takılı + ses/parlaklık ayarları)
System Policy           = Firmware (her zaman kasetten önce çalışır, kaset onu değiştiremez)
```

Yeni bir kaset/persona eklemek player'ı yeniden yazmayı gerektirmemeli.

---

## 0. Discovery — Gerçek Mimari (v1-v4'ten değişmeden taşındı)

### 0.1 Gerçek bir "AI Core" zaten var ve iş görüyor

`ledger/supabase/functions/shared/` altında Clean Architecture ile kurulmuş, gerçek mesaj akışı:

```
waha-webhook / zernio-webhook (ince router)
  └─ container.ts → createMessageUseCase(supabaseAdmin)
        └─ HandleIncomingMessageUseCase.execute()
              1. bot_settings'i merchant_id ile HER MESAJDA taze çeker
              2. whatsapp_bot_active / social_bot_active toggle kontrolü
              3. AIContext kurar
              4. AIOrchestrator.handleMessage(context, userMessage)
                    └─ PromptBuilder.build(context) → 4 katmanlı sistem prompt'u
                    └─ Gemini + ToolRegistry/ToolExecutor (randevu, RAG), 5 tura kadar
              5. WahaClient/ZernioClient ile gerçek kanala gönderir
              6. ai_communication_logs'a loglar
```

Instagram yorumları için `ai_jobs` kuyruğu var (8-13 dk gecikme, "insan gibi" davranmak için).

### 0.2 `PromptBuilder`'ın 4 katmanı ve persona'nın gerçek yeri

```
=== SYSTEM POLICY ===    ← sabit, class içinde hardcoded, hiçbir girdi buraya karışamaz
=== BUSINESS CONTEXT ===
=== BOT PERSONALITY ===  ← context.botSettings.system_prompt (BUGÜN İŞLENMEDEN)
=== CHANNEL CONTEXT ===
```

SYSTEM POLICY zaten yapısal olarak persona'nın önünde ve erişilemez durumda — madde 26'nın garantisi kısmen zaten var. **Bütün iş `buildBotPersonality()`'yi zenginleştirmeye indirgeniyor.**

### 0.3 Mobilde yarım kalmış ama isabetli bir persona motoru var

`flow/src/modules/persona_engine/` — `OrchestrationEngine → BlueprintFactory → GeminiRenderer`, `StructuralPersona` tipi (`lore, vocabulary, forbiddenWords, favoriteExpressions, greetingStyle, farewellStyle, humorStyle, emojiLevel`). Sadece Einstein V2'ye taşınmış, geri kalanı legacy string. Client tarafında çalışıp nihai string'i `bot_settings.system_prompt`'a kaydediyor. **Bu motor atılmayacak — alanlarının çoğu yeni şemaya referans olarak kullanılacak (bkz. Bölüm 1).**

### 0.4 🚨 Canlı Test, gerçek AI Core'u hiç kullanmıyor

Web/mobil Canlı Test, `AIOrchestrator/PromptBuilder/ToolRegistry`'den geçmeyen, ayrı ve basit bir `gemini-chat` çağırıyor. SYSTEM POLICY, tool'lar, business/channel context yok. Madde 20'nin "fake chat yapma" uyarısına aykırı.

### 0.5 Web'in persona seçimi gerçek müşteriye ulaşmıyor

`page.tsx handleSave()`, birleşik `fullSystemPrompt`'u hiç kaydetmiyor — sadece taban şablonu. Gerçek mesajlar `bot_settings.system_prompt`'u okuduğu için web'den yapılan persona seçimleri prodüksiyona hiç yansımıyor.

### 0.6 Doğru çözüm: render işlemini client'tan sunucuya taşımak

0.4 ve 0.5, ayrı ayrı yamanacak iki bug değil — ikisi de aynı kök nedenin (persona'nın client'ta "önceden pişirilmesi") sonucu. Çözüm: render işlemini `buildBotPersonality()`'ye taşımak.

### 0.7 Diğer bulgular

- `bot_settings.merchant_id` doğru/aktif kolon; `actions/bots.ts` (`user_id`) ölü kod — **PHASE 0'da kesin doğrulandı, bkz. aşağıdaki rapor.**
- Persona görselleri hiçbir yerde yok.
- **[PHASE 0'da düzeltildi]** `whatsapp-webhook`, `waha-webhook`'un eskisi/duplike'i DEĞİL — ikisi tamamen farklı, ikisi de canlı iki ayrı WhatsApp entegrasyonu. Detay için PHASE 0 raporuna bakın (Bölüm 2).

### 0.8 🛡️ Ledger AI kesin izolasyon

Ledger'ın kendi AI fonksiyonları (`ledger-ai-chat, ledger-process-document, mutabakat-chat, ledger-generate-schema, ledger-isleyici-api, ledger_mimar_google_api`) `shared/`'dan import etmiyor, kendi `LEDGER_GEMINI_API_KEY`'ini kullanıyor — teyit edildi. Tek gerçek paylaşılan risk: `gemini-chat` (Ledger `/ai-settings` + Flow Canlı Test + sosyal metin üretimi aynı fonksiyonu paylaşıyor). Bu yüzden `gemini-chat`'e hiç dokunulmayacak, Canlı Test için ayrı `persona-test` fonksiyonu yazılacak.

### 0.9 🛡️ `whatsapp-webhook` — dokunulmayacak, ama tam olarak nerede AI'a bağlandığı (v8, sadece dokümantasyon — kod değişikliği YOK)

Kullanıcının talimatı: *"whatsapp-webhook yapılandırmasına dokunma, sadece yapay zeka bağlantı noktasını netleştir."* Aşağıdaki, `ledger/supabase/functions/whatsapp-webhook/index.ts` dosyasında **tek ve yegâne** AI bağlantı noktasının tam dökümü — dosyada hiçbir satır değiştirilmedi, sadece okunup belgelendi:

| Ne | Nerede | Detay |
|---|---|---|
| **AI çağrı fonksiyonu** | `askGemini(prompt, apiKey, systemPrompt)` — satır 22-149 | Dosyanın içinde tanımlı, yerel bir yardımcı fonksiyon. `AIOrchestrator`/`ToolRegistry`/`PromptBuilder`'dan tamamen bağımsız; kendi tool-calling şemasını (`list_available_slots`, `create_pending_appointment`, `check_slot_conflict`, `suggest_alternative_slots`, `get_user_booking_history`, `estimate_duration_by_service`) kendi içinde tanımlıyor. |
| **Çağrıldığı yer** | POST handler içinde, sadece `message.type === 'text'` dalında — satır 342-346 | `askGemini(incomingText, apiKey, profile.system_prompt)`. İnteraktif buton yanıtları (`message.type === 'interactive'`) AI'a hiç gitmiyor, doğrudan `appointmentService.approveAppointment()`'a gidiyor (satır 264-294). |
| **Persona/system prompt kaynağı** | `public.profiles` tablosu — satır 302-306 | `supabaseAdmin.from('profiles').select('id, system_prompt, whatsapp_access_token, whatsapp_message_count, whatsapp_monthly_quota').eq('whatsapp_phone_number_id', businessPhoneNumberId).single()`. **Önemli düzeltme:** Bu, `bot_settings.system_prompt` DEĞİL — tamamen ayrı bir `profiles` tablosu ve tamamen ayrı bir anahtar (`whatsapp_phone_number_id`, `merchant_id` değil). Persona Engine'in `organization_ai_settings`/`ai_personas` tabloları bu path'e hiç değmiyor; bu path kendi ayrı veri kaynağını okumaya devam edecek. |
| **API anahtarı** | `Deno.env.get("GEMINI_API_KEY")` — satır 333 | Ledger'ın kendi `LEDGER_GEMINI_API_KEY`'inden AYRI. `container.ts`'teki `GeminiClient`'ın kullandığı anahtarla aynı isim olabilir ama kod yolu tamamen farklı ve bağımsız — bu dosyanın kendi doğrudan `fetch` çağrısı var, ortak `GeminiClient` sınıfını hiç import etmiyor. |
| **Gerçek AI uç noktası** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` — satır 128 | Model adı (`gemini-2.5-flash`) dosya içinde sabit/hardcoded. `AIOrchestrator`'ın kullandığı Gemini istemcisiyle hiçbir kod paylaşımı yok. |
| **Kullanım loglaması** | `public.api_usage_logs` — satır 465-473 | `ai_communication_logs` (WAHA/Zernio path'inin kullandığı tablo) DEĞİL, ayrı bir tablo. |

**Sonuç ve kilit:** Bu path, Persona Engine'in dokunacağı hiçbir bileşeni (ne `PromptBuilder`, ne `PersonaService`, ne `ai_personas`, ne `organization_ai_settings`, ne `AIOrchestrator`) kullanmıyor — sıfır kod paylaşımı, sıfır ortak tablo (`gemini-chat` ile Ledger arasındaki gibi tek bir ortak risk noktası bile yok). Bu, `whatsapp-webhook`'a hiç dokunmadan Persona Engine'i güvenle inşa edebileceğimizin somut kanıtı. Bu bölüm sadece referans amaçlıdır — hiçbir fazda bu dosyaya yazma işlemi planlanmıyor.

---

## 1. Persona Veri Modeli

### 1.1 Alan aileleri

Sadece tarihsel karakterlerle sınırlı kalmaması için (ileride "Premium Resepsiyonist", "Neşeli Barista" gibi persona paketleri de aynı motoru kullanabilsin), `ai_personas` alanlarını ailelere ayırıyoruz:

| Aile | Alanlar |
|---|---|
| **identity** | `id, slug, name, icon, category, short_bio, long_bio` |
| **worldview** | `identity_prompt (lore), worldview jsonb, preferred_metaphors jsonb` |
| **language** | mobildeki `vocabulary`, `favoriteExpressions`, `greetingStyle`, `farewellStyle` |
| **style** | `speaking_style jsonb` (formal/warm/humorous/metaphorical ağırlıkları), `humorStyle`, `emojiLevel` |
| **behavior** | `forbidden_behaviors jsonb` (mobildeki `forbiddenWords`'ü de kapsar) |
| **boundaries** | persona'nın asla yapmayacakları — Customer Relations Policy'den AYRI, persona'ya özel sınırlar (ör. "Adam Smith asla rakip firma önermez" gibi persona'ya özgü olabilecek ekstra kısıtlar) |
| **defaults** | `default_persona_intensity, default_humor_level, default_modern_adaptation, default_response_length` |
| **media** | `avatar_url, thumbnail_url` |

### 1.2 Versiyon ve durum (guardrail madde 9)

```sql
version int default 1,
persona_schema_version int default 1,
status text default 'draft' check (status in ('draft','testing','published','archived')),
is_active boolean default true,
is_featured boolean default false,
sort_order int default 0,
created_by uuid,
created_at timestamptz,
updated_at timestamptz
```

`status` ilerideki Admin Persona Creator (Faz 8) için önemli: **bir persona `published` olmadan gerçek müşteri trafiğinde kullanılamaz**, ve `published` olabilmesi Faz 7'deki test suite'ini geçmiş olmasına bağlı. `version`/`persona_schema_version` sayesinde "Adam Smith v1" ile "Adam Smith v2"yi ayrı satır açmadan aynı `slug` altında sürümleyebiliriz (aktif sürüm `organization_ai_settings.persona_id` ile değil, gerekirse `persona_id + version` ile referanslanır).

### 1.3 "Standart" özel bir durumdur, persona değildir

Kullanıcının netleştirdiği önemli karar: **"Standart" seçeneği `ai_personas` tablosunda bir satır DEĞİL.** `organization_ai_settings.persona_id = NULL` durumudur ve `PromptBuilder`'ın bugünkü fallback'ine düşer ("Standart, kibar ve profesyonel bir asistan gibi davran."). UI'da carousel'de "Persona Yok / Standart" seçeneği, `persona_id`'yi null'a set eden özel bir kart olarak gösterilir — bir DB kaydına tıklamak gibi görünse de aslında "persona'yı kapat" anlamına gelir.

### 1.4 `organization_ai_settings`

**[PHASE 1'de düzeltildi]** Tablo adı onaylandığı gibi `organization_ai_settings` kaldı, ama anahtar kolon `organization_id` DEĞİL, `merchant_id` — çünkü Flow'da ayrı bir "organizations" tablosu yok; `bot_settings` ve `ai_communication_logs` gibi mevcut tüm tablolar doğrudan `auth.users(id)`'i `merchant_id` adıyla referanslıyor. Yeni, paralel bir "tenancy" kavramı icat etmemek için gerçek migration bu isimlendirmeyi izliyor:

```sql
merchant_id uuid primary key references auth.users(id) on delete cascade,
persona_id uuid null references ai_personas(id) on delete set null,
business_role text,
tone text,
persona_intensity int default 50,
humor_level int default 30,
modern_adaptation int default 70,
custom_instruction text,
assistant_enabled boolean default true,
updated_at timestamptz
```

### 1.5 Seed mekanizması (guardrail madde 10'un erken versiyonu)

Admin UI (Faz 8) gelene kadar personalar `scripts/personas/*.json` formatında (ör. `adam-smith.json`, `einstein.json`) tutulur ve basit bir import script'i ile `ai_personas`'a yazılır. Bu, geliştiricinin elle SQL yazmasını önler ve **"yeni persona eklemek = DB insert + görsel yükleme, kod değişikliği = 0" Definition of Done'ını Faz 1'den itibaren gerçek kılar.**

---

## 2. Faz Planı (Kilitli Sıra)

Her fazın sonunda: **STOP → REPORT → Ledger `/ai-settings` smoke test → Ledger invoice-processing smoke test → `git diff` ile `gemini-chat`'e ve Ledger fonksiyonlarına dokunulmadığının teyidi.**

### PHASE 0 — Safety Snapshot / Ledger Isolation Verification

1. Ledger repo genelinde `bot_settings`/`persona` referansı yok denetimi (zaten yapıldı, PHASE 0'da resmi olarak tekrar teyit edilip rapora yazılır).
2. `actions/bots.ts` gerçekten ölü kod mu — repo geneli tarama ile kesinleştir, kaldır.
3. `waha-webhook` vs `whatsapp-webhook` — hangisi deploy/aktif, diğeri plan dışına alınır veya silinir.
4. Bu fazın çıktısı: mevcut davranışın "önce" durumu olarak bir referans (WhatsApp'a örnek bir mesaj gönderip alınan yanıtı, Ledger `/ai-settings`'ten örnek bir soru-cevabı) kaydedilir — sonraki fazlarda regresyon karşılaştırması için.

**DoD:** Ölü kod/duplike fonksiyon netleşti; Ledger izolasyonu resmi olarak doğrulandı; "önce" referans yanıtlar kayıt altında.

#### ✅ PHASE 0 — SONUÇ RAPORU (tamamlandı)

**1) Ledger izolasyonu — resmi olarak doğrulandı, 4 ayrı kanıtla:**
- Ledger'ın kendi AI fonksiyonları (`ledger-ai-chat, ledger-process-document, mutabakat-chat, ledger-generate-schema, ledger-isleyici-api`) — hiçbiri `shared/`'dan import etmiyor, hepsi kendi `LEDGER_GEMINI_API_KEY`'ini okuyor.
- `ledger/supabase/schema.sql` (Ledger'ın takip ettiği tam şema dökümü) içinde `bot_settings`, `persona`, `merchant_id` kelimelerinin **hiçbiri geçmiyor.**
- Ledger'ın kendi, tamamen ayrı bir "AI Core"u daha var: `apps/ledger/ai-core/` — kendi `PolicyEngine`, `IntentRouter`, `ToolRegistry` (mükellef/fatura/bildirim araçları için, `tools/registry.ts`), `turkish-normalizer.ts` ile. Flow'un `shared/` klasörüyle hiçbir ilgisi yok — isim benzerliği (ikisi de "policy"/"registry" kelimeleri kullanıyor) tamamen tesadüf, kod paylaşımı yok.
- `apps/ledger/app/ai-settings/page.tsx` (Ledger'ın AI Asistanı ekranı) içinde `bot_settings`, `persona`, `character`, `merchant_id` — hiçbiri geçmiyor.

**Sonuç:** Ledger AI, planın hiçbir fazından etkilenmeyecek şekilde zaten izole. `gemini-chat` hâlâ tek gerçek ortak nokta ve dokunulmayacak.

**2) `actions/bots.ts` — ölü kod olduğu kesinleşti.** `flowweb/src` altındaki 30 dosyanın tamamı tarandı (`app/`, `components/`, `actions/` — tümü); `getBotSettings`/`updateBotSettings`/`actions/bots` sadece tanımlandığı dosyada geçiyor, başka hiçbir yerden import edilmiyor. **PHASE 1'de güvenle silinebilir.**

**3) 🚨 `waha-webhook` vs `whatsapp-webhook` — planı etkileyen yeni ve önemli bir düzeltme:**

Bunlar duplike değil, **iki tamamen farklı, ikisi de gerçek/canlı WhatsApp entegrasyonu** — kullanıcı bunu doğruladı: biri gayri resmi WAHA yapılandırması, diğeri Zernio üzerinden sağlanan resmi WhatsApp yapılandırması. İkisi birbirinin yerine geçmiyor, karıştırılmayacak:

| | `waha-webhook` (1.9KB) | `whatsapp-webhook` (20KB) |
|---|---|---|
| Bağlandığı servis | WAHA (gayri resmi, self-hosted/QR session tabanlı WhatsApp) | Zernio üzerinden sağlanan **resmi** WhatsApp entegrasyonu (Meta Business Cloud API, `graph.facebook.com` ile konuşuyor) — kullanıcının teyit ettiği iki ayrı, gerçek WhatsApp yapılandırmasından biri, diğeri değil |
| Mimari | Yeni: `container.ts → HandleIncomingMessageUseCase → AIOrchestrator → PromptBuilder → ToolRegistry` | **Eski:** kendi içinde doğrudan `generativelanguage.googleapis.com`'a fetch atıyor, kendi `GEMINI_API_KEY`'i, kendi tool-calling mantığı — `AIOrchestrator`/`PromptBuilder`'dan hiç geçmiyor |
| Persona kaynağı | `bot_settings` → (PHASE 3 sonrası) `PersonaService` | **`profiles.system_prompt`** — `bot_settings` DEĞİL, ayrı bir `profiles` tablosundan, `whatsapp_phone_number_id` ile eşleşerek okunuyor; doğrudan, işlenmeden kullanılıyor (bkz. Bölüm 0.9) |
| Deploy kanıtı | Kod olarak mevcut ve güncel mimariyle uyumlu | `flow/README.md`'deki deploy script'lerinde açıkça listeleniyor (`npx supabase functions deploy whatsapp-webhook --no-verify-jwt`), aktif olarak belgelenmiş |

**Bunun planı etkileyen sonucu:** PHASE 3'te `PromptBuilder.buildBotPersonality()`'yi güncellemek, sadece WAHA ve Zernio/Instagram müşterilerine ulaşır. **Meta Cloud API üzerinden WhatsApp kullanan müşteriler, `whatsapp-webhook` kendi ayrı yolunu kullanmaya devam ettiği sürece yeni Persona Engine'den hiç faydalanamaz** — ve daha da önemlisi, madde 9'daki Customer Relations Policy de bu müşterilere hiç uygulanmamış olur (çünkü `whatsapp-webhook`'un kendi ayrı Gemini çağrısında hiçbir SYSTEM POLICY katmanı yok).

**✅ [v8] Karar kesinleşti — Seçenek B.** Kullanıcı açıkça onayladı: `whatsapp-webhook` yapılandırmasına dokunulmayacak, Persona Engine bu path'e hiç genişletilmeyecek. Bu artık geçici bir varsayım değil, kilitli bir guardrail (bkz. yukarıda madde 1b). Persona Engine PHASE 3-4'te sadece WAHA + Zernio (DM/yorum) path'ini kapsayacak; Zernio'nun resmi WhatsApp entegrasyonundaki müşteriler bu iterasyonun kapsamı dışında kalmaya devam edecek — bu bilinçli ve onaylı bir kapsam sınırı, unutulmuş bir eksiklik değil.

Kullanıcının talebi üzerine, hiçbir kod değişikliği yapılmadan, bu fonksiyonun AI'a bağlandığı **tam nokta** Bölüm 0.9'da dokümante edildi — böylece ileride (ör. Antigravity veya başka bir geliştirici) bu dosyaya yanlışlıkla dokunma riski azaltılıyor: nerede durulması gerektiği net.

**4) "Önce" referans kaydı:** Canlı bir mesaj gönderip yanıt kaydetmek benim erişimimin dışında (bu oturumda WAHA/Zernio'ya mesaj gönderme veya Supabase'e canlı sorgu atma yetkim yok — sadece dosya erişimim var). Bunun yerine, daha güvenilir bir referans olarak **her üç reponun şu anki git commit'lerini** kaydettim:

```
flowweb @ e4c622e457d61bdc01295f19ab26a3a29fb4135a
flow    @ 2f9a90656f8d8e3c04627bd3a43af0707a0a8cc2
ledger  @ e54e516ec4c83a4dcc20e59e05b7faac8cfd103e
```

Bu SHA'lar, PHASE 1+ sırasında yapılan her değişikliğin `git diff <sha>` ile tam olarak görülebilmesini sağlıyor — canlı bir "önce/sonra" davranış testinden daha güvenilir bir rollback referansı. Gerçek WhatsApp/Instagram davranış testi (madde 27'nin gerçek senaryoları) için PHASE 7'de senin ya da bir test hesabının gerçek mesaj göndermesi gerekecek.

**📋 ANTIGRAVITY PROMPTU — FAZ 0:** Gerekmiyor. Bu faz sadece kod okuma/analiz içeriyor; deploy edilecek veya çalıştırılacak hiçbir şey yok.

---

### PHASE 1 — Persona Database Schema (+ seed + media)

1. `ai_personas` (Bölüm 1.1-1.2'deki alanlarla) ve `organization_ai_settings` (Bölüm 1.4) için migration — sadece `CREATE TABLE`, mevcut hiçbir tabloya `ALTER`/`DROP` yok.
2. `scripts/personas/*.json` seed dosyaları: Standart hariç 5 persona (Einstein, Adam Smith, Shakespeare, Mimar Sinan, Tesla) — mobildeki mevcut Einstein/Shakespeare verisini taban alıp, madde 1.1'deki ailelere göre tamamla. Hepsi `status: 'draft'` ile başlar.
3. Supabase Storage `ai-personas` bucket'ı + her persona için avatar/thumbnail.
4. RLS: `ai_personas` herkese okunur/sadece admin yazar; `organization_ai_settings` sadece kendi organizasyonu.

**DoD:** 5 persona DB'de `draft` durumunda, medyalarıyla birlikte; şema Ledger'ın hiçbir tablosuna dokunmadan canlıda.

#### ✅ PHASE 1 — SONUÇ RAPORU (tamamlandı — kod + canlı deploy, Antigravity tarafından doğrulandı)

**1) Migration dosyası teslim edildi:** `ledger/supabase/migrations/20260828120000_ai_personas_schema.sql`. İçeriği:
- `public.ai_personas` — Bölüm 1.1-1.2'deki tüm alan aileleri (identity/worldview/language/style/behavior/boundaries/defaults/media/versioning), `status` için `draft|testing|published|archived` CHECK kısıtı, `status` ve `slug` üzerinde index, RLS açık: `authenticated` rolü sadece `status='published' AND is_active=true` olan satırları okuyabilir, `service_role` hepsini yönetir.
- `public.organization_ai_settings` — Bölüm 1.4'te düzeltildiği gibi `merchant_id` anahtarlı, RLS ile kullanıcı sadece kendi satırını (`auth.uid() = merchant_id`) yönetebilir, `service_role` hepsini yönetir; `updated_at` için otomatik trigger.
- **Sadece `CREATE TABLE IF NOT EXISTS` / `CREATE POLICY` / `CREATE TRIGGER`** — mevcut hiçbir tabloya (`bot_settings`, Ledger'ın `core/finance/audit/analytics/ai` şemaları dahil) `ALTER`/`DROP` YOK. Dosyanın en başına, bu izolasyon kararının gerekçesini (neden `ai` şeması değil `public.ai_*` deseni seçildiği) açıklayan kalıcı bir yorum bloğu eklendi.
- **Şema çakışması riski somut olarak elendi:** `ledger/supabase/migrations/20260820100000_ai_core_foundation.sql` ve `20260820110000_phase1_ai_audit_schemas.sql` dosyaları okunarak, Postgres'te gerçekten `ai` adında bir şemanın halihazırda var olduğu ve bunun tamamen Ledger'ın kendi DDD mimarisine (`ai.audit_logs, ai.extraction_schemas, ai.accountant_ai_conversations` vb.) ait olduğu doğrulandı. Bu, Persona Engine tablolarının `public.ai_personas` / `public.organization_ai_settings` olarak (bir `ai.personas` DEĞİL) tutulması kararını kesinleştirdi.

**2) Seed verisi teslim edildi:** `ledger/scripts/personas/` altında 5 persona JSON'u — `einstein.json`, `adam-smith.json`, `shakespeare.json`, `mimar-sinan.json`, `tesla.json`. Hepsi Bölüm 1.1'deki alan ailelerini dolduruyor (identity_prompt/worldview/preferred_metaphors/vocabulary/favorite_expressions/greeting-farewell style/speaking_style ağırlıkları/humor_style/emoji_level/forbidden_behaviors/boundaries/default_* alanları) ve hepsi **`status: "draft"`** ile geliyor — guardrail madde 9 gereği hiçbiri bu haliyle gerçek müşteri trafiğine çıkamaz.

**3) Seed script'i teslim edildi:** `ledger/scripts/personas/seed-personas.mjs` — `@supabase/supabase-js` ile service-role key kullanarak klasördeki tüm `.json` dosyalarını `public.ai_personas`'a `slug` üzerinden `upsert` eder. Kullanım talimatları `ledger/scripts/personas/README.md`'de.

**4) ✅ [v12] Erişimim dışında kalan adımlar Antigravity tarafından tamamlandı:**
- Migration gerçekten uygulandı (`supabase db push`, linked remote veritabanına).
- 5 persona canlı veritabanına yüklendi — Antigravity, `SUPABASE_SERVICE_ROLE_KEY` ortam değişkeni sistemde bulunmadığı için `seed-personas.mjs`'i doğrudan çalıştırmak yerine, Supabase CLI'ın zaten yetkilendirilmiş `--linked` bağlantısı üzerinden JSON dosyalarını okuyup SQL `upsert` ile aynı sonucu elde etti. **Bu kabul edilebilir bir eşdeğer yol** — hedef (5 persona, `status='draft'`, `ai_personas` tablosunda) birebir aynı şekilde gerçekleşti. `seed-personas.mjs` script'i, ileride `SUPABASE_SERVICE_ROLE_KEY` tanımlı bir CI/otomasyon ortamında tekrarlanabilir bir seed akışı isteyen olursa hâlâ kullanılabilir durumda duruyor.
- `ai-personas` Storage bucket'ı oluşturuldu (mevcut `avatars` bucket'ıyla aynı `public=true` şemasında).
- Avatar/thumbnail görselleri hâlâ yüklenmedi (`avatar_url`/`thumbnail_url` boş) — bu, Faz 6 (Persona Carousel UI)'dan önce herhangi bir noktada tamamlanabilir, Faz 1'in DoD'sini engellemiyor (görseller olmadan da personalar veri olarak tam ve doğru).

PHASE 1'in DoD'si artık **tam olarak karşılandı**: şema Ledger'a dokunmadan canlıda, 5 persona `draft` durumunda gerçekten veritabanında yaşıyor.

**5) Ledger dokunulmazlığı teyidi:** Bu faz boyunca `ledger/supabase/functions/**` (gemini-chat dahil), `apps/ledger/**`, ve Ledger'ın `core/finance/audit/analytics/ai` şemalarına ait hiçbir dosyaya yazma/değiştirme işlemi yapılmadı — sadece yeni dosyalar eklendi (`supabase/migrations/20260828120000_...sql`, `scripts/personas/*`).

**📋 ANTIGRAVITY PROMPTU — FAZ 1 (kopyala/yapıştır):**

```
Görev: Persona Engine — FAZ 1 deploy ve doğrulama (ledger reposu)

Bağlam: ledger reposuna şu yeni dosyalar eklendi, mevcut hiçbir dosya değişmedi:
- supabase/migrations/20260828120000_ai_personas_schema.sql (sadece CREATE TABLE/POLICY/TRIGGER — hiçbir mevcut tabloya ALTER/DROP yok)
- scripts/personas/{einstein,adam-smith,shakespeare,mimar-sinan,tesla}.json
- scripts/personas/seed-personas.mjs + README.md

Yap:
1. cd ledger && npx supabase db push (veya projenin kullandığı migration deploy yöntemi neyse onunla) — migration'ı uygula.
2. cd ledger/scripts/personas && npm install @supabase/supabase-js
3. SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node seed-personas.mjs — 5 persona'yı ekle.
4. Supabase Dashboard > Storage'da "ai-personas" adında yeni bir bucket oluştur (projenin diğer bucket'larıyla tutarlı erişim ayarıyla).

KIRMIZI ÇİZGİLER (asla ihlal etme):
- ledger'ın core/finance/audit/analytics/ai şemalarına DOKUNMA.
- bot_settings tablosuna DOKUNMA.
- whatsapp-webhook, ledger-ai-chat, ledger-process-document, mutabakat-chat, ledger-generate-schema, ledger-isleyici-api, ledger-gemini-chat, ledger_mimar_google_api dosyalarına DOKUNMA.

Doğrula ve bana/kullanıcıya raporla:
- Migration hatasız uygulandı mı?
- `select slug, status from ai_personas;` → 5 satır, hepsi status='draft' mı?
- `select count(*) from organization_ai_settings;` → 0 mı (henüz kimse persona seçmedi, bu normal)?
- "ai-personas" bucket'ı oluştu mu?
- Ledger'ın /ai-settings sayfası hâlâ normal çalışıyor mu (hızlı regresyon kontrolü)?
```

**✅ ANTIGRAVITY DOĞRULAMA RAPORU — FAZ 1 (alındı, kullanıcı tarafından iletildi):**

| Kontrol | Sonuç |
|---|---|
| Migration (`supabase db push`) | ✅ Hatasız uygulandı |
| `ai_personas` — 5 satır, hepsi `status='draft'` | ✅ Doğrulandı (`einstein, adam-smith, shakespeare, mimar-sinan, tesla`) |
| `organization_ai_settings` — 0 satır | ✅ Doğrulandı |
| `ai-personas` Storage bucket | ✅ Oluşturuldu (`avatars` ile aynı `public=true` şeması) |
| Kırmızı çizgiler (Ledger, `gemini-chat`, `bot_settings`, `core/finance` şemaları) | ✅ Hiçbirine dokunulmadı |
| Ledger `/ai-settings` regresyonu | ✅ Etkilenmedi, normal çalışmaya devam ediyor |

**Not (yöntem sapması, kabul edildi):** Seed adımı `node seed-personas.mjs` yerine, `SUPABASE_SERVICE_ROLE_KEY` ortam değişkeni sistemde tanımlı olmadığından, Supabase CLI'ın `--linked` bağlantısı üzerinden JSON'ları okuyup doğrudan SQL `upsert` ile uygulandı. Sonuç birebir aynı (5 persona, `draft`) — script ileride otomasyon/CI için hâlâ kullanılabilir durumda.

**PHASE 1 artık tam anlamıyla tamamlandı ve canlı doğrulandı.**

### PHASE 2 — PersonaRepository + PersonaService + PersonaPromptBuilder

Kesin katman ayrımı (guardrail madde 6, kullanıcının ısrarla vurguladığı nokta):

```
PersonaRepository   → sadece veri okur (ai_personas, organization_ai_settings)
PersonaService      → "hangi ayarlar geçerli" config'ini kurar (org override + persona default'ları birleştirir, intensity/humor/modern_adaptation sayısal mantığını uygular) — STRING ÜRETMEZ
PersonaPromptBuilder → PersonaService'in ürettiği config'i LLM'e verilecek metne çevirir (worldview/vocabulary/forbidden_behaviors'ı, intensity eşiklerine göre render eder)
```

`PersonaService`'in "koca bir string builder"a dönüşmemesi için bu ayrım kod incelemesinde açıkça kontrol edilecek.

**DoD:** Birim testte, aynı persona + farklı intensity/tone kombinasyonlarının tutarlı ama farklı metin ürettiği doğrulandı; `PersonaService` içinde hiç string concatenation yok.

#### ✅ PHASE 2 — SONUÇ RAPORU (tamamlandı — kod; birim testler yazıldı ama bu oturumda ÇALIŞTIRILAMADI)

**1) Teslim edilen dosyalar:** `ledger/supabase/functions/shared/ai/persona/` altında yeni bir klasör:
- `PersonaTypes.ts` — `PersonaRow`/`OrganizationAiSettingsRow` (DB satırlarının ham şekli, migration'daki kolonlarla birebir), ve `PersonaRenderConfig` (PersonaService'in ürettiği, PersonaPromptBuilder'ın tek girdisi olan normalize edilmiş config tipi) + `ExecutionMode`/`PersonaStatus`.
- `PersonaRepository.ts` — sadece veri okur/yazar: `getOrganizationSettings`, `getPersonaById`, `getPersonaBySlug`, `listPublishedPersonas` (Faz 6 için hazırlandı), `upsertOrganizationSettings` (Faz 5 için hazırlandı, şimdilik hiçbir yerden çağrılmıyor). İçinde hiçbir iş kuralı veya string üretimi yok.
- `PersonaService.ts` — `resolveForMerchant(merchantId, executionMode)` ve saf/testable `resolveFromRows(persona, orgSettings, executionMode)`. Guardrail madde 9'u burada kod olarak uyguluyor: **`executionMode==='production'` iken `status !== 'published'` olan bir persona`null` döner** (yani PromptBuilder'ın fallback zincirine düşer) — sadece `simulation` modunda (Faz 4 Canlı Test) yayınlanmamış personalar önizlenebilir. İçinde tek "birleştirme" mantığı var (org override yoksa persona default'u), hiç string concatenation yok.
- `PersonaPromptBuilder.ts` — `render(config): string`. Persona yoğunluğuna (düşük/orta/yüksek) göre worldview/metaphor/vocabulary/favorite_expressions'ın ne kadarının göründüğünü belirliyor; `forbidden_behaviors`/`boundaries` yoğunluktan BAĞIMSIZ her zaman tam olarak render ediliyor (güvenlik kritik alanlar asla seyreltilmiyor); `business_role` set edilmişse kimliği bozmadan iş koluna uyarlama talimatı ekliyor; `humor_level`/`modern_adaptation` dial'larını ayrı bantlarla (düşük/orta/yüksek) yönlendirici cümlelere çeviriyor.
- `index.ts` — barrel export (Faz 3'ün `PromptBuilder.ts`'den tek satırda import edebilmesi için).
- `PersonaPromptBuilder.test.ts`, `PersonaService.test.ts` — Deno'nun yerleşik test çatısıyla yazıldı (5+5 test): aynı persona farklı intensity'lerde farklı ama tutarlı metin üretiyor mu, forbidden_behaviors/boundaries her koşulda görünüyor mu, `business_role` sadece set edildiğinde eklenen cümleyi tetikliyor mu, düşük `humor_level`'ın yüksek `humor_style`'ı bile bastırdığı, `production` modunda draft persona'nın reddedildiği, `simulation` modunda kabul edildiği, org override'ın persona default'unu ezdiği, org satırı yokken persona default'una düşüldüğü.

**2) 🚧 Erişimim dışında kalan adım:** Bu oturumda `deno test` çalıştıramıyorum (device shell/Deno runtime erişimim yok, sadece dosya okuma/yazma). Testler mantığı doğrulamak için özenle yazıldı ve elle (statik) doğrulandı, ama **gerçekten koşulmadı.** Lütfen (veya Antigravity) şunu çalıştırsın:
```
cd ledger
deno test supabase/functions/shared/ai/persona/
```

**3) Kapsam ve izolasyon teyidi:** Bu fazda `shared/ai/PromptBuilder.ts`, `shared/ai/types.ts`, `container.ts`, `HandleIncomingMessageUseCase.ts` — **hiçbiri değişmedi.** Sadece yeni bir klasör (`shared/ai/persona/`) eklendi. Bu bilinçli bir tercih: Faz 2'nin DoD'si "yeni sınıfların doğru çalıştığı" ile ilgili, entegrasyon (mevcut `PromptBuilder`'a bağlamak) Faz 3'ün işi. `gemini-chat`, `whatsapp-webhook` ve Ledger'ın hiçbir dosyasına dokunulmadı.

**4) Not — `PersonaRepository.upsertOrganizationSettings`:** Faz 5'te kullanılacak yazma metodu şimdiden eklendi (repository'nin yazma yüzeyinin en baştan gözden geçirilebilir olması için), ama şu an hiçbir yerden çağrılmıyor — canlı hiçbir davranışı etkilemiyor.

**📋 ANTIGRAVITY PROMPTU — FAZ 2 (kopyala/yapıştır):**

```
Görev: Persona Engine — FAZ 2 birim testlerini çalıştır (ledger reposu)

Bağlam: ledger/supabase/functions/shared/ai/persona/ altına yeni bir klasör eklendi
(PersonaTypes.ts, PersonaRepository.ts, PersonaService.ts, PersonaPromptBuilder.ts,
index.ts, PersonaPromptBuilder.test.ts, PersonaService.test.ts). Mevcut hiçbir dosya
değişmedi — deploy gerektiren bir şey yok, sadece testlerin gerçekten geçtiğinin
doğrulanması gerekiyor (yazan taraf/Claude bu testleri hiç çalıştıramadı, sadece
statik olarak inceledi).

Yap:
cd ledger
deno test supabase/functions/shared/ai/persona/

Beklenen: 10 testin tamamı (5+5) PASS vermeli. FAIL varsa, hatayı ve ilgili dosya/satırı
raporla — kod değişikliği gerekip gerekmediğine kullanıcıyla birlikte karar verilecek.

KIRMIZI ÇİZGİLER: Bu faz hiçbir mevcut dosyaya dokunmuyor, sadece yeni bir klasör test
ediliyor — yine de gemini-chat/whatsapp-webhook/Ledger dosyalarına dokunma.
```

### PHASE 3 — PromptBuilder Integration (fallback'li)

`PromptBuilder.buildBotPersonality()` güncellenir — guardrail madde 6'daki fallback mantığıyla:

```ts
private buildBotPersonality(context: AIContext): string {
  if (context.personaConfig) {
    return this.personaPromptBuilder.render(context.personaConfig); // yeni motor
  }
  if (context.botSettings?.system_prompt) {
    return context.botSettings.system_prompt; // legacy fallback — SİLİNMEZ
  }
  return "Standart, kibar ve profesyonel bir asistan gibi davran.";
}
```

*(v10 notu: `context.organizationAiSettings` yerine, gerçek uygulamada `context.personaConfig` kullanıldı — PersonaService'in async DB sorgusu gerektirmesi nedeniyle, çözümleme mesaj işlenmeden ÖNCE `HandleIncomingMessageUseCase` içinde yapılıyor ve zaten hazır/çözümlenmiş bir `PersonaRenderConfig` `AIContext`'e ekleniyor — böylece `PromptBuilder.build()` senkron kalmaya devam ediyor, `AIOrchestrator`'a hiç dokunulmadı. Detay için aşağıdaki rapora bakın.)*

Customer Relations Policy (madde 9), persona bloğuna değil `PromptBuilder`'ın kendi `SYSTEM_POLICY` sabitine eklenir — kavramsal olarak **"WORKIGOM CUSTOMER SERVICE CONSTITUTION"** olarak adlandırılabilir: hangi persona seçilirse seçilsin (Adam Smith, Einstein, Shakespeare...) "müşteriyle tartışma", "işletmeyi refleksle savunma", "işlem olmadan yaptım deme" kuralları değişmez.

**Kapsam sınırı (gerçekleşen, v10):** `shared/ai/PromptBuilder.ts`, `shared/ai/types.ts` ve yeni `shared/ai/persona/*` dosyalarına ek olarak, `container.ts` (DI wiring) ve `HandleIncomingMessageUseCase.ts` (async persona çözümlemesinin gerçekten tetiklendiği yer) da değişti — bu, orijinal kapsam notunda öngörülmemişti ama teknik olarak kaçınılmazdı (bkz. rapor, madde 2). `AIOrchestrator.ts`, `gemini-chat` ve Ledger fonksiyonlarına dokunulmadı.

**DoD:** `organization_ai_settings` dolu olan bir org için yeni motor, boş olan için legacy `system_prompt` fallback çalışıyor — geçiş sırasında hiçbir bot "kişiliksiz" kalmıyor; Ledger `/ai-settings` regresyon testi temiz.

#### ✅ PHASE 3 — SONUÇ RAPORU (tamamlandı — kod; canlıya alınmadı, sende doğrulama bekliyor)

**1) Değişen dosyalar (4 dosya, hepsi `ledger` reposunda, hepsi bu fazda ilk kez dokunulan üretim dosyaları):**
- `shared/ai/types.ts` — `AIContext`'e tek bir opsiyonel alan eklendi: `personaConfig?: PersonaRenderConfig | null`. Mevcut hiçbir alan silinmedi/değişmedi; eski kod bu alanı hiç okumadığı için geriye dönük tamamen uyumlu.
- `shared/ai/PromptBuilder.ts` — `buildBotPersonality()` yukarıdaki 3 kademeli fallback zincirine güncellendi; sınıfa `personaPromptBuilder` bağımlılığı eklendi ama **varsayılan değerle** (`= new PersonaPromptBuilder()`), yani `new PromptBuilder()` şeklindeki eski çağrı biçimi de hâlâ çalışır — hiçbir çağıran kırılmadı. `build()`, `buildBusinessContext()`, `buildChannelContext()`, `SYSTEM_POLICY` — **tek satır bile değişmedi.**
- `container.ts` — `PersonaRepository`/`PersonaService`/`PersonaPromptBuilder` burada inşa edilip `PromptBuilder`'a ve `HandleIncomingMessageUseCase`'e enjekte ediliyor. `AppointmentRepository`/`DriveKnowledgeRepository` ile birebir aynı DI deseni kullanıldı.
- `shared/application/usecases/HandleIncomingMessageUseCase.ts` — `botSettings` çekildikten hemen sonra, `AIContext` inşa edilmeden önce `personaService.resolveForMerchant(merchantId, 'production')` çağrılıyor ve sonuç `try/catch` içinde: **hata olursa (veya migration henüz uygulanmadıysa, tablo yoksa) `personaConfig = null` kalır ve akış kesintisiz devam eder** — hiçbir zaman mesajın işlenmesini durdurmaz.

**2) Neden kapsam genişledi (`container.ts` + `HandleIncomingMessageUseCase.ts`):** `PersonaService.resolveForMerchant()` bir DB sorgusu olduğu için async; ama `PromptBuilder.build()`/`buildBotPersonality()` senkron. İki seçenek vardı: (a) `PromptBuilder.build()`'ı async yapıp `AIOrchestrator`'ın onu `await` etmesini sağlamak — bu `AIOrchestrator.ts`'e de dokunmayı gerektirirdi, ya da (b) async çözümlemeyi, zaten `botSettings`'i async çektiği yer olan `HandleIncomingMessageUseCase`'e taşıyıp, hazır sonucu `AIContext` üzerinden senkron `PromptBuilder`'a taşımak. (b) seçildi — daha az dosyaya dokunuyor, `AIOrchestrator.ts`'i hiç değiştirmiyor, ve `botSettings` için zaten var olan desenle (aynı yerde, aynı şekilde async fetch) birebir tutarlı. Bu, orijinal "sadece PromptBuilder.ts + types.ts + persona/*" kapsam notunu teknik gerekçeyle aştı — ama guardrail'ın asıl amacı (Ledger'a ve `gemini-chat`'e dokunmamak) tam olarak korundu.

**3) Güvenlik/geri dönüş özellikleri:**
- Migration henüz canlıya uygulanmamış olsa bile (bkz. Faz 1 raporu — bu hâlâ senin/Antigravity'nin tarafında bekleyen bir adım) bu kod **çökmez**: `PersonaRepository` sorgu hatasını yutup `null` döner, `PersonaService` `null` döner, `PromptBuilder` legacy `system_prompt`'a düşer — yani Faz 3'ün kodu, Faz 1'in migration'ı uygulanmadan da güvenle deploy edilebilir.
- Hiçbir org için davranış değişmedi: `organization_ai_settings` tablosu boş olduğu (veya yok olduğu) sürece her mesaj tam olarak eskisi gibi `bot_settings.system_prompt`'a düşüyor.
- `AIOrchestrator.ts`, `gemini-chat`, `whatsapp-webhook`, Ledger'ın hiçbir dosyası bu fazda değişmedi.

**4) 🚧 Erişimim dışında kalan doğrulama:** Bu kodu deploy edemem/canlı test edemem (Supabase CLI/API erişimim yok). Lütfen bunu doğrula:
- `npx supabase functions deploy waha-webhook zernio-webhook --no-verify-jwt` (veya projenizin deploy script'i) sonrası, `organization_ai_settings`'i BOŞ bırakan bir merchant için WAHA/Zernio üzerinden gerçek bir mesajın hâlâ eskisi gibi yanıtlandığını doğrulayın (regresyon).
- Migration (Faz 1) uygulandıktan ve bir merchant'a elle bir `organization_ai_settings` satırı (`persona_id` = Einstein'ın id'si, `status='published'`e elle güncellenmiş) eklendikten sonra, aynı merchant'tan gelen bir mesajın artık Einstein tonunda yanıtlandığını doğrulayın.
- Ledger `/ai-settings` sayfasında bir soru sorup normal çalıştığını doğrulayın (regresyon — Ledger AI hiç değişmedi ama "STOP → REPORT" guardrail'ı her faz sonunda bunu istiyor).

**📋 ANTIGRAVITY PROMPTU — FAZ 3 (kopyala/yapıştır):**

```
Görev: Persona Engine — FAZ 3 deploy ve doğrulama (ledger reposu)

Bağlam: shared/ai/types.ts, shared/ai/PromptBuilder.ts, container.ts,
shared/application/usecases/HandleIncomingMessageUseCase.ts güncellendi.
PromptBuilder.buildBotPersonality() artık 3 kademeli fallback kullanıyor:
(1) çözümlenmiş bir persona config varsa onu render et, (2) yoksa eski
bot_settings.system_prompt'u kullan (DEĞİŞMEDİ), (3) o da yoksa standart
cümle. FAZ 1'in migration'ı henüz uygulanmadıysa bile bu kod GÜVENLİDİR —
sorgu hatasını yutar ve (2)'ye düşer, hiçbir mesajı bloklamaz.

Yap:
1. Eğer FAZ 1'in migration'ı henüz uygulanmadıysa önce onu uygula (FAZ 1 promptuna bak).
2. cd ledger && npx supabase functions deploy waha-webhook zernio-webhook --no-verify-jwt
   (projenin flow/README.md'deki gerçek deploy komutunu/scriptini kullan).

Doğrula ve raporla:
1. REGRESYON: organization_ai_settings'te satırı OLMAYAN bir merchant'tan WAHA veya
   Zernio üzerinden gerçek bir test mesajı gönder → yanıtın deploy ÖNCESİYLE birebir
   aynı tonda geldiğini doğrula. Hiçbir davranış değişikliği OLMAMALI.
2. YENİ DAVRANIŞ: ai_personas'tan Einstein'ın id'sini al, status'unu elle 'published'
   yap; bir test merchant'ı için organization_ai_settings'e bir satır ekle
   (persona_id=Einstein'ın id'si, persona_intensity=70). O merchant'tan WAHA/Zernio
   üzerinden bir test mesajı gönder → yanıtın artık Einstein tonunda (bilim/görelilik
   referanslı) geldiğini doğrula.
3. LEDGER REGRESYONU: Ledger /ai-settings sayfasında bir soru sor → normal çalıştığını
   doğrula.
4. git diff ile gemini-chat, whatsapp-webhook ve apps/ledger/** klasörüne hiç
   dokunulmadığını doğrula.

KIRMIZI ÇİZGİLER: whatsapp-webhook'a KESİNLİKLE dokunma (kullanıcı kararı, kalıcı).
gemini-chat'e dokunma. Ledger'ın ai-core'una dokunma.

Sorun çıkarsa: bu 4 dosyayı plan Bölüm 2 PHASE 0 raporundaki "ledger @ <sha>" commit'ine
göre git diff ile karşılaştırıp geri alabilirsin; hiçbir veri kaybına yol açmaz (sadece kod).
```

**✅ ANTIGRAVITY DOĞRULAMA RAPORU — FAZ 3 (alındı, kullanıcı tarafından iletildi):**

| Kontrol | Sonuç |
|---|---|
| `waha-webhook`/`zernio-webhook` deploy | ✅ `--no-verify-jwt` ile üretime deploy edildi |
| Regresyon (persona atanmamış merchant) | ✅ "Merhaba, nasılsın?" → eski `bot_settings.system_prompt` tonuyla yanıtlandı (fallback kademe 1→2 doğru çalıştı), hiçbir bozulma yok |
| Yeni davranış (Einstein, `published`, intensity=70) | ✅ "Bana kendinden bahset." → Einstein kimliğiyle, görelilik/kütle-çekim referanslarıyla, `greeting_style` ("Bilimin ışığıyla selamlar!") ve mizahla yanıtlandı — `PersonaService`→`PersonaPromptBuilder` zinciri uçtan uca çalıştı |
| Ledger `/ai-settings` regresyonu | ✅ Etkilenmedi |
| `git diff gemini-chat whatsapp-webhook apps/ledger` | ✅ Boş — hiçbirine dokunulmadı |

**🚨 [v13] Kritik güvenlik takibi — kapatılması gereken bir açık:** Doğrulama için Einstein'ın `status`'u elle `'published'` yapıldı. Ama Einstein FAZ 7'nin (Persona Compliance/Evaluation Tests) hiçbir senaryosundan geçmedi — guardrail madde 9 açıkça "bir persona `published` olmadan gerçek müşteri trafiğinde kullanılamaz, `published` olmak FAZ 7 testlerini geçmeye bağlı" diyor. Bu, sadece manuel doğrulama amaçlıydı ama şu haliyle bırakılırsa guardrail teknik olarak ihlal edilmiş olur (Einstein artık FAZ 7'den geçmeden gerçek trafiğe açık). **Antigravity'den şunu istedim (yanıt bekleniyor):**
1. `update ai_personas set status='draft' where slug='einstein';` — Einstein'ı teste geri döndür.
2. Test merchant gerçek bir işletmeyse `organization_ai_settings.persona_id`'sini `NULL`'a çekmesi, test/sandbox hesabıysa satırı tamamen silmesi.
3. Ardından, önceden üzerinde anlaşılan 3 ayrı faz-bazlı commit (`Faz 1` / `Faz 2` / `Faz 3`) ile `origin/main`'e push.

Bu adım tamamlanıp teyit gelene kadar **FAZ 3 "canlıda doğrulandı" olarak işaretleniyor ama "temiz kapatıldı" değil** — sıradaki fazlara geçmek için bir engel değil (kodun kendisi doğru çalıştığı zaten kanıtlandı), ama takip edilmesi gereken açık bir madde olarak burada kayıtlı.

**✅ [v14] Kapatıldı.** Antigravity: (1) Einstein'ı `status='draft'`'a geri döndürdü, (2) test için eklenen `organization_ai_settings` satırını sildi (test merchant'ın gerçek bir işletme olduğunu doğruladı — o işletme artık test öncesi haline %100 döndü), (3) değişiklikleri **3 ayrı faz-bazlı commit** halinde (`Phase 1 - Schema and Seeds`, `Phase 2 - Persona Domain & Services`, `Phase 3 - Fallback Logic and Integration`) `origin/main`'e push etti. FAZ 3 artık hem kod hem canlı davranış hem repo geçmişi açısından tam ve temiz kapandı.

### PHASE 4 — persona-test Real Pipeline (simulation mode)

Yeni, bağımsız `persona-test` edge function:

```
Frontend draft settings (henüz kaydedilmemiş persona_id/tone/intensity)
  ↓
persona-test
  ↓ resolve authenticated organization
  ↓ create temporary AIContext (executionMode: "simulation")
  ↓ PersonaService → PromptBuilder → AIOrchestrator → ToolRegistry → Gemini
  ↓ response
  ✗ WahaClient.send() / ZernioClient.send() — ÇAĞRILMAZ
```

`AIContext`'e `executionMode: "production" | "simulation"` eklenir. Randevu gibi write tool'lar `simulation` modunda gerçek DB'ye yazmaz — ya `WOULD_CREATE_APPOINTMENT` gibi bir sonuç döner ya da ayrı bir test tablosuna yazar. Böylece kullanıcı Canlı Test'te "yarın 14:00'e randevu al" dediğinde gerçek bir randevu oluşmaz, ama tool çağrısının kendisi (ve AI'ın ona nasıl tepki verdiği) gerçekten test edilir.

**DoD (güncellendi):** Canlı Test artık gerçek `PromptBuilder`+`ToolRegistry`'yi kullanıyor; randevu tool'u tetikleniyor ama side effect'i simulation modunda kontrollü/simüle ediliyor; `gemini-chat` dosyası bu faz boyunca hiç değişmedi (`git diff` ile teyit).

#### ✅ PHASE 4 — SONUÇ RAPORU (tamamlandı — kod; deploy/canlı doğrulama bekleniyor)

**1) Yeni dosya — `ledger/supabase/functions/persona-test/index.ts`:** Bağımsız bir edge function. `container.ts`'teki **aynı** `AIOrchestrator`/`PromptBuilder`/`ToolRegistry` inşasını kullanır (aşağıya bakın — `buildAiPipeline` sayesinde production ile Live Test asla birbirinden sapamaz), ama `WahaClient`/`ZernioClient`/`CommunicationLoggerRepository` hiç import etmez/oluşturmaz — yani gerçek bir kanala mesaj gönderme veya `ai_communication_logs`'a yazma FİZİKSEL OLARAK mümkün değil, sadece "yapılmıyor" değil.
- Request body'den (`personaId`, `businessRole`, `tone`, `personaIntensity`, `humorLevel`, `modernAdaptation`, `customInstruction`) **henüz kaydedilmemiş taslak değerlerle** bir `PersonaRenderConfig` çözümlenir — `organization_ai_settings`'ten DEĞİL, doğrudan istekten. Bu, `PersonaService.resolveFromRows()`'un DB'siz/saf tasarlanmış olmasının tam olarak işe yaradığı yer (Faz 2'de bilerek böyle bırakılmıştı).
- `executionMode: "simulation"` her zaman sabit — `PersonaService` bu modda `draft`/`testing` personaların da önizlenmesine izin veriyor (guardrail madde 9'un istisnası, tam olarak Live Test için var).
- **Auth:** `gemini-chat`'ten daha sıkı — çağıranın kimliği Supabase JWT ile doğrulanıyor VE `merchantId`'nin doğrulanmış kullanıcıyla birebir aynı olması zorunlu tutuluyor (401/403). `gemini-chat` hiçbir kimlik kontrolü yapmıyordu; bu, persona-test'in kendiliğinden getirdiği bir güvenlik iyileştirmesi.

**2) Değişen dosyalar (executionMode güvenlik zinciri, guardrail madde 8):**
- `shared/ai/types.ts` — `AIContext`'e `executionMode?: "production" | "simulation"` eklendi.
- `shared/application/usecases/HandleIncomingMessageUseCase.ts` — gerçek mesaj yolunda artık açıkça `executionMode: 'production'` set ediliyor (önceden zımni olarak aynı davranıyordu, şimdi net).
- `shared/ai/tools/appointments/CreatePendingAppointmentTool.ts` — `context.executionMode`'u `AppointmentService`'e iletiyor.
- `shared/domain/appointment/AppointmentService.ts` — **asıl güvenlik noktası:** `createPendingAppointment()` artık `executionMode==='simulation'` olduğunda çakışma kontrolünü (salt okunur, güvenli) yine de çalıştırıyor ama gerçek `INSERT`'i tamamen atlıyor ve `"SUCCESS"` döndürüyor — böylece Live Test'te "yarın 14:00'e randevu al" dendiğinde AI'ın verdiği yanıt gerçek bir müşterininkiyle birebir aynı olur, ama veritabanına sahte bir randevu satırı YAZILMAZ.
- `container.ts` — `createMessageUseCase`'in iç mantığı `buildAiPipeline()` adlı ortak bir fonksiyona çıkarıldı (davranış değişmedi, sadece taşındı) ve yeni `createPersonaTestPipeline()` eklendi. Bu, DRY'dan öte bir güvenlik kararı: production ve Live Test'in AYNI kod yolundan geçmesi, ikisinin zamanla birbirinden sapıp Live Test'in gerçek davranışı yanlış temsil etmesini yapısal olarak imkânsız kılıyor.

**3) Dokunulmayan/korunan:** `gemini-chat` bu fazda da hiç değişmedi (Ledger `/ai-settings`, eski Canlı Test ve sosyal metin üretimi hâlâ onu kullanıyor, etkilenmediler). `whatsapp-webhook`, `waha-webhook`, `zernio-webhook` — sadece `AppointmentService`/`CreatePendingAppointmentTool`/`types.ts` üzerinden **dolaylı ve geriye-uyumlu** şekilde etkilendiler (yeni alan hep opsiyonel, `undefined` iken davranış production ile birebir aynı).

**4) 🚧 Erişimim dışında kalan doğrulama:** Bu fonksiyonu deploy edemem/canlı çağıramam. Aşağıdaki Antigravity promptu bunu kapatıyor.

**📋 ANTIGRAVITY PROMPTU — FAZ 4 (kopyala/yapıştır):**

```
Görev: Persona Engine — FAZ 4 deploy ve doğrulama (ledger reposu)

Bağlam: Yeni bağımsız bir edge function eklendi: supabase/functions/persona-test/index.ts.
Bu, gemini-chat'e HİÇ dokunmadan, gerçek PromptBuilder/AIOrchestrator/ToolRegistry
pipeline'ını simulation modunda çalıştırıyor. Ayrıca executionMode güvenlik zinciri
için 4 dosya değişti: shared/ai/types.ts, shared/application/usecases/
HandleIncomingMessageUseCase.ts, shared/ai/tools/appointments/
CreatePendingAppointmentTool.ts, shared/domain/appointment/AppointmentService.ts,
ve container.ts (buildAiPipeline refactor + createPersonaTestPipeline eklendi).

Yap:
1. cd ledger && npx supabase functions deploy persona-test
   (DİKKAT: --no-verify-jwt KULLANMA — bu fonksiyon varsayılan JWT doğrulamasına
   ihtiyaç duyuyor, çünkü içeride çağıranın kimliğini merchantId ile karşılaştırıyor.)
2. Diğer değişen dosyalar (types.ts, HandleIncomingMessageUseCase.ts,
   CreatePendingAppointmentTool.ts, AppointmentService.ts, container.ts) zaten
   waha-webhook/zernio-webhook'un İÇİNDE (shared/ klasörü) — bu yüzden bu iki
   fonksiyonu da yeniden deploy et: npx supabase functions deploy waha-webhook
   zernio-webhook --no-verify-jwt

Doğrula ve raporla:
1. AUTH: persona-test'i GEÇERSİZ/eksik bir Authorization header ile çağır → 401
   dönmeli. Sonra geçerli bir kullanıcı JWT'siyle ama BAŞKA bir merchantId ile
   çağır → 403 dönmeli.
2. STANDART ÖNİZLEME: personaId GÖNDERMEDEN (null) bir istek at → yanıtın o
   merchant'ın mevcut bot_settings.system_prompt'una (veya Standart cümleye)
   uygun geldiğini doğrula.
3. DRAFT PERSONA ÖNİZLEME: einstein'ı TEKRAR published yapmadan (status='draft'
   kalsın!), doğrudan persona-test'e personaId=Einstein'ın id'si ve
   personaIntensity=90 ile bir istek at → yanıtın Einstein tonunda geldiğini
   doğrula. Bunun çalışması draft bir personanın simulation modunda
   önizlenebildiğinin kanıtı.
4. RANDEVU SIMÜLASYONU (kritik): persona-test'e "yarın saat 14:00'e randevu
   almak istiyorum" gibi bir mesaj gönder, AI'ın randevu akışını başlattığını
   gözlemle, SONRA appointments tablosunu kontrol et → BU TEST İÇİN YENİ BİR
   SATIR EKLENMEMİŞ OLMALI (executionMode=simulation nedeniyle). Eğer bir satır
   eklendiyse bu bir güvenlik hatasıdır, hemen bildir.
5. REGRESYON: waha-webhook/zernio-webhook'un yeniden deploy'undan sonra gerçek
   bir müşteri mesajının hâlâ normal (production modunda, gerçek randevu
   oluşturabilen) çalıştığını doğrula.
6. git diff ile gemini-chat, whatsapp-webhook, apps/ledger/** klasörüne hiç
   dokunulmadığını doğrula.

KIRMIZI ÇİZGİLER: gemini-chat'e dokunma. whatsapp-webhook'a dokunma. Einstein'ı
(veya başka bir personayı) test sırasında published yapman GEREKMİYOR artık —
persona-test draft personaları zaten önizleyebiliyor. Eğer yine de bir persona'yı
test için published yaparsan, testten HEMEN SONRA draft'a geri döndürmeyi unutma.

Commit için önerim: bu değişiklikleri de "Faz 1/2/3" ile aynı desende AYRI bir
commit yap: "feat: Persona Engine Phase 4 - persona-test simulation pipeline".
```

### PHASE 5 — Web/Mobile Settings Save Refactor

`page.tsx handleSave()` ve mobil `useSavePersona`, artık ham seçimleri (`persona_id, business_role, tone, persona_intensity, humor_level, modern_adaptation, custom_instruction`) `organization_ai_settings`'e yazar — hiçbir client kendi başına final string üretmez. Bu noktadan sonra web VE mobil aynı kaydetme sözleşmesini kullanır. `bot_settings.system_prompt` yazılmaz hâle gelir (ama Phase 3'teki fallback nedeniyle kolon DB'de kalmaya devam eder — sadece yeni kayıtlarda kullanılmaz).

**DoD:** Web'den persona seçip kaydeden bir işletmenin gerçek WhatsApp/Instagram müşterisi, Canlı Test'te görülenle birebir aynı yanıtı alıyor.

#### ✅ PHASE 5 — SONUÇ RAPORU (WEB tamamlandı; MOBİL henüz yapılmadı — bkz. madde 5)

**1) `flowweb/src/app/(dashboard)/ai-asistan/page.tsx` — `handleSave()` tamamen değişti:** Artık `bot_settings`'e hiçbir şey yazmıyor (ne `system_prompt`, ne `tone`, ne `role`, ne `character`). Bunun yerine seçilen karakter bir slug'a çevrilip (`CHARACTER_SLUGS` haritası: Einstein/Shakespeare/Mimar Sinan → `einstein`/`shakespeare`/`mimar-sinan`), yeni bir server action olan `saveAiPersonaSettings()`'e ham seçimler (`characterSlug, businessRole, tone, customInstruction`) gönderiliyor. Bugünkü sabit 3 karakterli buton listesi (Faz 6'nın işi) DEĞİŞMEDİ — sadece kaydetme mekanizması değişti.

**2) Yeni dosya — `flowweb/src/actions/aiPersonaSettings.ts`** (server action, `'use server'`):
- `saveAiPersonaSettings()` — kullanıcının kimliğini (cookie tabanlı, RLS'e tabi normal client ile) doğrular, `characterSlug` verilmişse `ai_personas`'tan `id`'sini bulur, ham seçimleri `organization_ai_settings`'e `upsert` eder (yine normal, RLS'e tabi client ile — `auth.uid()=merchant_id` politikası zaten kendi satırı dışına yazmayı engelliyor). **Hiçbir yerde string birleştirme/prompt inşası yok** — guardrail madde 2'nin tam istediği şey.
- `getAiPersonaSettings()` — `page.tsx`'in sayfa yüklenince ayarları geri okuyabilmesi için eklendi (aksi halde kaydetme çalışır ama sayfa yenilendiğinde seçimler sıfırlanmış görünürdü).

**3) 🚨 Neden bir "admin" client gerekti — geçici ama kasıtlı bir kısıtlama:** `ai_personas` satırları FAZ 7'nin compliance testlerinden geçmeden `published` olamayacağı için (guardrail madde 9) hâlâ `status='draft'`. RLS politikası `authenticated` rolüne SADECE `status='published'` satırları okutuyor — yani normal, oturum çerezine dayalı client `slug`'dan `persona_id`'ye çeviremiyor. Bunun için yeni bir dosya eklendi: `flowweb/src/lib/supabase/admin.ts` — service-role bir client döndürüyor, **SADECE** bu tek dar okuma (slug→id ve id→slug çevirisi) için kullanılıyor; `organization_ai_settings`'e yazma hâlâ normal/RLS'li client ile yapılıyor. Bu, RLS'i gevşetmek yerine, ihtiyaç duyulan tek noktada kontrollü bir istisna açmanın en az riskli yolu.
- **Yeni gerekli ortam değişkeni:** `SUPABASE_SERVICE_ROLE_KEY` — `flowweb`'in kendi hosting ortamına (muhtemelen Vercel) eklenmesi gerekiyor; bu `ledger`'ın Deno ortamındaki değişkenden AYRI bir şey, kontrol edilmesi gerekiyor.

**4) `persona-test` (Faz 4) genişletildi — `personaSlug` desteği eklendi:** Web istemcisi henüz gerçek `persona_id`'leri bilmediği (RLS nedeniyle) için, `persona-test`'in isteğine `personaSlug` alanı eklendi; fonksiyon zaten `supabaseAdmin` ile çalıştığından bunu RLS sorunu olmadan çözebiliyor (`PersonaRepository.getPersonaBySlug()` — Faz 2'de tam bunun için hazırlanmıştı). `handleSendMessage()` artık `gemini-chat` yerine `persona-test`'i çağırıyor, henüz KAYDEDİLMEMİŞ taslak seçimleri doğrudan gönderiyor — Faz 5'in DoD'sinin dayandığı mekanizma tam olarak bu.

**5) 🚧 Kapsam dışı bırakılan (bu turda YAPILMADI):** Plan mobil (`flow` reposundaki `useSavePersona`) için de aynı refactor'ü istiyordu. Bunu bu turda yapmadım — sadece web tarafını tamamladım, aksi halde tek bir "STOP+REPORT" penceresinde hem web hem mobilde çok büyük, gözden geçirilmesi zor bir değişiklik seti birikirdi. **Mobil kısmı ayrı bir alt-adım (FAZ 5b) olarak öneriyorum**, onay verirsen hemen ardından yaparım.

**6) Silinemeyen ölü kod notu:** `flowweb/src/actions/bots.ts` (PHASE 0'da ölü kod olduğu kesinleşen dosya) bu oturumun dosya silme yeteneği olmadığı için hâlâ repoda duruyor. Aşağıdaki Antigravity promptuna bir `git rm` adımı ekledim.

**7) Dokunulmayan:** `bot_settings`'in whatsapp/social toggle'ları (`handleToggle`) hiç değişmedi. Ledger, `gemini-chat`, `whatsapp-webhook` bu fazda da hiç değişmedi.

**📋 ANTIGRAVITY PROMPTU — FAZ 5 (WEB) (kopyala/yapıştır):**

```
Görev: Persona Engine — FAZ 5 (web) deploy ve doğrulama

Bağlam: flowweb reposunda değişen/eklenen dosyalar:
- src/app/(dashboard)/ai-asistan/page.tsx (handleSave/fetchSettings/handleSendMessage değişti)
- src/actions/aiPersonaSettings.ts (YENİ — server action)
- src/lib/supabase/admin.ts (YENİ — service-role client, SADECE server action içinde kullanılıyor)
ledger reposunda değişen dosya:
- supabase/functions/persona-test/index.ts (personaSlug desteği eklendi)

Yap:
1. flowweb'in hosting ortamına (muhtemelen Vercel) SUPABASE_SERVICE_ROLE_KEY ortam
   değişkenini ekle (henüz yoksa) — src/lib/supabase/admin.ts bunu okuyor.
   DİKKAT: Bu değeri asla NEXT_PUBLIC_ önekiyle ekleme, sadece server-side kalmalı.
2. cd ledger && npx supabase functions deploy persona-test (--no-verify-jwt KULLANMA).
3. flowweb'i normal deploy akışınla yeniden deploy et (Vercel otomatik/manuel, ne
   kullanıyorsan).
4. (Opsiyonel ama önerilir) git rm flowweb/src/actions/bots.ts — PHASE 0'da ölü kod
   olduğu kesinleşmişti, artık bu faz onun yerini alan gerçek bir dosya (aiPersonaSettings.ts)
   ekledi.

Doğrula ve raporla:
1. /ai-asistan sayfasını aç, bir karakter seç (ör. Einstein), rol/ton seç, "Değişiklikleri
   Kaydet"e bas → hata almadan kaydedildiğini doğrula.
2. Supabase'de organization_ai_settings tablosunu sorgula → bu merchant için bir satır
   oluştuğunu, persona_id'nin Einstein'ın gerçek id'sine eşit olduğunu doğrula.
3. Sayfayı YENİLE (F5) → seçtiğin karakter/rol/ton'un hâlâ seçili göründüğünü doğrula
   (fetchSettings/getAiPersonaSettings'in doğru çalıştığının kanıtı).
4. Canlı Test kutusuna bir mesaj yaz → yanıtın Einstein tonunda geldiğini doğrula (artık
   persona-test üzerinden, gemini-chat üzerinden DEĞİL).
5. bot_settings tablosunu kontrol et → bu kayıt için system_prompt/tone/role/character
   kolonlarının ARTIK GÜNCELLENMEDİĞİNİ (eski değerlerinde sabit kaldığını) doğrula.
6. git diff ile gemini-chat, whatsapp-webhook, apps/ledger/** klasörüne hiç
   dokunulmadığını doğrula.

KIRMIZI ÇİZGİLER: gemini-chat'e dokunma. whatsapp-webhook'a dokunma. SUPABASE_SERVICE_ROLE_KEY'i
asla client tarafına (NEXT_PUBLIC_ öneki, veya tarayıcıya gönderilen herhangi bir kod) sızdırma.

Commit önerisi: "feat: Persona Engine Phase 5 (web) - settings save refactor + persona-test slug support"
```

### PHASE 6 — Persona Carousel UI

`page.tsx`'i (628 satır) component'lere böl (`AICharacterPanel, PersonaCarousel, PersonaCard, ToneSelector, AdvancedPersonaSettings, PersonaSlider, LiveTestPanel...`). `characters` sabit dizisi kaldırılır, `ai_personas`'tan (sadece `status='published'` olanlar) çekilir. "Standart" kartı `persona_id=null`'a set eden özel bir kart olarak eklenir (bkz. 1.3). Kategori filtresi persona sayısı arttıkça eklenir.

### PHASE 7 — Persona Compliance/Evaluation Tests (status gating)

Madde 27'deki 5 senaryo (fiyat itirazı, randevu, bilgi talebi, hakaret, "müşteriyle tartış" injection) her persona için hem `persona-test` hem gerçek webhook path'i üzerinden koşulur. **Bir persona bu testleri geçmeden `status: 'published'` olamaz** — `draft`/`testing` durumundaki personalar gerçek müşteri trafiğinde kullanılamaz (Phase 6'daki carousel sadece `published` gösterir).

### PHASE 8 — Admin Persona Creator

`/admin/personas` — form + preview + `draft/testing/published/archived` durum yönetimi + Phase 1'deki JSON seed akışının UI karşılığı. Projede hiç admin/rol altyapısı olmadığından ilk adım "kim admin" sorusunu çözmek.

---

### Kilitli sıranın dışındaki, sonraki işler (opsiyonel, ilerisi için)

- **Mobil senkronizasyon:** Mobildeki hardcoded `PERSONAS`/`PERSONAS_V2` dizilerini kaldırıp `PersonaRepository`'ye bağlamak (Gordon Ramsay/Sherlock Holmes bu noktada `ai_personas`'a `draft` olarak eklenebilir, istenirse).
- **Analytics:** `ai_persona_usage_log` — ağır analytics kurulmayacak.

---

## 3. Sıradaki Somut Adım

**PHASE 0 ve PHASE 1 tamamen tamamlandı ve canlıda doğrulandı** (Bölüm 2'deki raporlara bakın). Antigravity, migration'ı uyguladı, 5 persona'yı `draft` durumunda veritabanına yükledi ve `ai-personas` Storage bucket'ını oluşturdu — hepsi doğrulanmış durumda, Ledger regresyonu temiz.

**`whatsapp-webhook` kararı kapalı:** Kullanıcı Seçenek B'yi kesinleştirdi — bu dosyaya dokunulmayacak, Persona Engine ona hiç genişletilmeyecek. AI bağlantı noktası (Bölüm 0.9) sadece referans için dokümante edildi, kod değişmedi.

**PHASE 3 tamamen kapandı:** canlıda uçtan uca doğrulandı, güvenlik temizliği yapıldı (Einstein `draft`'a döndü, test verisi silindi), 3 ayrı commit halinde `origin/main`'e push edildi.

**✅ GATE KAPANDI (v17) — PHASE 2 Closure + PHASE 4 Deploy/Verification canlıda doğrulandı:**
- **A — PHASE 2 birim testleri:** `deno test --no-check supabase/functions/shared/ai/persona/` → **10/10 PASS** (131ms). PromptBuilder'ın 5 senaryosu + PersonaService'in draft/production engelleme ve fallback mantığının 5 senaryosu, hepsi yeşil.
- **B — PHASE 4 deploy/doğrulama:** `persona-test` varsayılan JWT doğrulamasıyla (yani `--no-verify-jwt` OLMADAN) deploy edildi; `waha-webhook`/`zernio-webhook` güncel `shared/` kodunu almak için `--no-verify-jwt` ile yeniden deploy edildi. 6 doğrulama maddesinin hepsi geçti: (1) auth — geçersiz header→401, yanlış merchantId→403; (2) standart önizleme (personaId=null) legacy fallback'e düştü; (3) draft Einstein (`status='draft'` kalarak) `personaIntensity=90` ile doğru tonda önizlendi — draft personanın simulation modunda published olmadan önizlenebildiğinin canlı kanıtı; (4) **kritik randevu simülasyonu** — "yarın 14:00 saç kesimi" mesajı sonrası `appointments` tablosunda `count(*) = 0`, yani `executionMode: "simulation"` kalkanı gerçek INSERT'i tam olarak engelledi; (5) regresyon — gerçek WhatsApp payload'u production modunda eski tonuyla hatasız yanıtladı; (6) `git diff` ile `gemini-chat`/`whatsapp-webhook`/`apps/ledger/**`'a hiç dokunulmadığı doğrulandı. Değişiklikler `"feat: Persona Engine Phase 4 - persona-test simulation pipeline"` commit'iyle `origin/main`'e pushlandı, geçici test betikleri temizlendi.

Gate artık kapalı — **FAZ 5 (web) deploy promptu serbest bırakıldı**, aşağıda.

**PHASE 5 kod düzeyinde tamamlandı — ama sadece WEB tarafı** (yukarıdaki v15 raporuna bakın): `flowweb`'deki `page.tsx`'in `handleSave()`'i artık ham seçimleri (`persona_id, business_role, tone, custom_instruction` — dial'lar persona default'larından geliyor) yeni `saveAiPersonaSettings` server action'ı üzerinden `organization_ai_settings`'e yazıyor; `handleSendMessage()` (Canlı Test) artık `gemini-chat` değil `persona-test`'i çağırıyor. `bot_settings`'e persona ile ilgili hiçbir yeni yazma yok — `system_prompt` sadece legacy fallback olarak salt-okunur gösteriliyor. Deploy ve canlı doğrulama (env var + save/reload + Canlı Test doğrulaması) Antigravity'nin FAZ 5 (WEB) promptuyla bekleniyor.

**🔒 KULLANICI GATE'İ (v16) — ✅ KAPANDI (v17):** Antigravity FAZ 5'e başlamadan önce açık iki doğrulamanın kapanması istenmişti: (A) PHASE 2 birim testleri (`deno test`, 10/10 PASS bekleniyor) ve (B) PHASE 4 deploy/canlı doğrulama. Kullanılan birleşik prompt aşağıda arşiv olarak duruyor; A ve B'nin ikisi de canlıda doğrulandı (yukarıdaki "✅ GATE KAPANDI (v17)" raporuna bakın) — FAZ 5 artık serbest.

**📋 ANTIGRAVITY PROMPTU — PHASE 2 Closure + PHASE 4 Deploy/Verification (kopyala/yapıştır):**

```
Görev: Persona Engine — PHASE 2 Closure + PHASE 4 Deploy/Verification
PHASE 5'e KESİNLİKLE BAŞLAMA. Önce mevcut açık doğrulamaları kapat.

A — PHASE 2 TEST
cd ledger
deno test supabase/functions/shared/ai/persona/
Beklenen: 10/10 PASS.
Bir test FAIL olursa PHASE 4/5'e devam etme. Hatanın test adı, gerçek çıktı,
beklenen çıktı ve ilgili dosya/satırlarını raporla, DUR.

B — PHASE 4 DEPLOY/DOĞRULAMA (A tamamen yeşil olmadan başlama)
Bağlam: Yeni bağımsız bir edge function eklendi: supabase/functions/persona-test/index.ts.
Bu, gemini-chat'e HİÇ dokunmadan, gerçek PromptBuilder/AIOrchestrator/ToolRegistry
pipeline'ını simulation modunda çalıştırıyor. Ayrıca executionMode güvenlik zinciri
için 4 dosya değişti: shared/ai/types.ts, shared/application/usecases/
HandleIncomingMessageUseCase.ts, shared/ai/tools/appointments/
CreatePendingAppointmentTool.ts, shared/domain/appointment/AppointmentService.ts,
ve container.ts (buildAiPipeline refactor + createPersonaTestPipeline eklendi).

Yap:
1. cd ledger && npx supabase functions deploy persona-test
   (DİKKAT: --no-verify-jwt KULLANMA — bu fonksiyon varsayılan JWT doğrulamasına
   ihtiyaç duyuyor, çünkü içeride çağıranın kimliğini merchantId ile karşılaştırıyor.)
2. Diğer değişen dosyalar zaten waha-webhook/zernio-webhook'un İÇİNDE (shared/
   klasörü) — bu yüzden bu iki fonksiyonu da yeniden deploy et:
   npx supabase functions deploy waha-webhook zernio-webhook --no-verify-jwt

Doğrula ve raporla:
1. AUTH: persona-test'i GEÇERSİZ/eksik bir Authorization header ile çağır → 401
   dönmeli. Sonra geçerli bir kullanıcı JWT'siyle ama BAŞKA bir merchantId ile
   çağır → 403 dönmeli.
2. STANDART ÖNİZLEME: personaId GÖNDERMEDEN (null) bir istek at → yanıtın o
   merchant'ın mevcut bot_settings.system_prompt'una (veya Standart cümleye)
   uygun geldiğini doğrula.
3. DRAFT PERSONA ÖNİZLEME: einstein'ı TEKRAR published yapmadan (status='draft'
   kalsın!), doğrudan persona-test'e personaId=Einstein'ın id'si ve
   personaIntensity=90 ile bir istek at → yanıtın Einstein tonunda geldiğini
   doğrula.
4. RANDEVU SIMÜLASYONU (kritik): persona-test'e "yarın saat 14:00'e randevu
   almak istiyorum" gibi bir mesaj gönder, SONRA appointments tablosunu kontrol
   et → BU TEST İÇİN YENİ BİR SATIR EKLENMEMİŞ OLMALI. Eğer eklendiyse bu bir
   güvenlik hatasıdır, hemen bildir, DUR.
5. REGRESYON: waha-webhook/zernio-webhook'un yeniden deploy'undan sonra gerçek
   bir müşteri mesajının hâlâ normal (production modunda) çalıştığını doğrula.
6. git diff ile gemini-chat, whatsapp-webhook, apps/ledger/** klasörüne hiç
   dokunulmadığını doğrula.

KIRMIZI ÇİZGİLER: gemini-chat'e dokunma. whatsapp-webhook'a dokunma. FAZ 5'e
(flowweb deploy'una) bu turda HİÇ dokunma — o ayrı bir onayla gelecek.
Einstein'ı (veya başka bir personayı) test için published yapman GEREKMİYOR.

Commit önerisi: A ve B için TEK bir commit değil, ayrı ayrı:
"test: verify Persona Engine Phase 2 unit tests (10/10 pass)" (sadece test
çalıştırma bir kod değişikliği değilse commit gerekmez, sadece raporla) ve
"feat: Persona Engine Phase 4 - persona-test simulation pipeline" (B için).

A FAIL olursa: hiçbir commit/push yapma, sadece raporla ve dur.
```

**Sırada iki seçenek var, sıralama serbest (yukarıdaki gate kapandıktan SONRA):**

1. **PHASE 5b — Mobile Settings Save Refactor (`flow` reposu, henüz başlanmadı):** `flow`'daki `useSavePersona` hook'unun (ve ilgili ekranın) aynı mantıkla — ham seçimleri `organization_ai_settings`'e, final string üretimi yok — refactor edilmesi. Web'de kurulan `saveAiPersonaSettings`/`getAiPersonaSettings` server action'ları sadece `flowweb`'e özel (Next.js) olduğundan, mobil tarafta muhtemelen doğrudan Supabase client çağrısı + aynı admin-lookup ihtiyacı (draft persona slug→id çözümü) yeniden ele alınmalı — mobil bunu bir server action üzerinden değil, doğrudan client'tan mı yapıyor yoksa kendi API route'u var mı, önce mevcut `useSavePersona` kodunu okuyup karar vereceğim.
2. **PHASE 6 — Persona Carousel UI:** Kullanıcının 5 persona'yı (Einstein, Shakespeare, Mimar Sinan + yeni eklenenler) görsel olarak seçebileceği carousel/kart arayüzü, hem web hem mobilde.

İkisi de birbirinden bağımsız — hangisiyle devam edeceğimi kullanıcı belirtmezse, kilitli faz sırasına en yakın olan PHASE 5b (mobil, PHASE 5'in tamamlayıcısı) ile devam edeceğim, sonra PHASE 6, PHASE 7 (compliance testleri — `published` durumuna geçişin tek kapısı) ve PHASE 8 (Admin Persona Creator).
