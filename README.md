# Workigom Ecosystem Architecture

Workigom projesi monorepo mimarisinden bağımsız ve modüler 4 ayrı projeye (repository) bölünmüştür. Bu yapı, her bir ürünün bağımsız geliştirilmesini, deploy edilmesini ve yönetilmesini sağlar.

## Repolar ve Görevleri

1. **Workigom (Marketing Hub)**
   - **Repo:** cicicarscom-pixel/workigom
   - **Domain:** www.workigom.com
   - **Görev:** Ana landing page ve pazarlama sitesidir. /flow ve /ledger tanıtım sayfalarını içerir. Kullanıcı kayıt/giriş işlemlerini yürütmez, doğrudan uygulamanın login sayfasına yönlendirir.
   
2. **Workigom Flow (Ana Uygulama)**
   - **Repo:** cicicarscom-pixel/flow (Eski adıyla ai_muhasebeci)
   - **Domain:** flow.workigom.com
   - **Görev:** Flow'un gerçek yapay zeka ve otomasyon uygulamasıdır. Supabase ve arka plan API'lerine bağlıdır. Çalışması için Vercel üzerinde Environment Variables (Ortam Değişkenleri) yapılandırmasına ihtiyaç duyar.

3. **Workigom Ledger (Ana Uygulama)**
   - **Repo:** cicicarscom-pixel/ledger
   - **Domain:** ledger.workigom.com
   - **Görev:** Muhasebe ve Ledger platformunun gerçek uygulamasıdır.

4. **Workigom FlowWeb (Legacy / Standalone Landing)**
   - **Repo:** cicicarscom-pixel/flowweb
   - **Görev:** Flow için hazırlanmış eski bağımsız tanıtım projesidir (Şu an tanıtım sayfaları ana Workigom reposuna taşındığı için daha pasif durumdadır).

## Geliştirme ve Deployment Kuralları
- **Yönlendirmeler:** Tanıtım sayfalarındaki "Giriş Yap" butonları (örn: www.workigom.com/flow veya /ledger), direkt olarak uygulamanın kendi domain'indeki (örn: https://flow.workigom.com/login) giriş sayfalarına yönlendirmelidir.
- **Environment Variables:** flow ve ledger gibi gerçek uygulama repoları Vercel'de deploy edilirken .env dosyasındaki tüm API ve veritabanı değişkenleri eksiksiz olarak Vercel paneline girilmelidir, aksi takdirde 500 Internal Server Error hatası alınır.
- **Root Directory:** Repolar ayrıldığı için Vercel üzerindeki Root Directory ayarları boş bırakılmalıdır (Eskiden apps/flow vs. idi, artık tüm repolar kendi kök dizininde çalışır).

---

# Workigom FlowWeb - Dashboard UI

Bu proje, Workigom AI platformunun gelişmiş statik HTML dashboard arayüzlerinin **Next.js (App Router)** mimarisine entegre edilmiş halidir. Tüm tasarım konfigürasyonları mobil uygulama mimarisine sadık kalınarak yeniden uyarlanmış ve performans odaklı bileşenlere dönüştürülmüştür.

## 🚀 Proje Hakkında
Temmuz 2026 kararlarına istinaden, dashboard içerisindeki ekranların her biri (`Anasayfa`, `Ai Muhasebe`, `Sosyal Medya`, `Ai Asistan`, `Analiz`) React ve Next.js App Router yapısına çevrilmiştir.

- **Route Groups (`(dashboard)`):** Projedeki tüm dashboard sayfaları merkezi bir `layout.tsx` yapısı üzerinden servis edilmektedir. Böylece sayfalar arası geçişlerde sidebar ve header tekrarlarının önüne geçilerek asimetrik tasarım hataları giderilmiştir.
- **Tasarım İzolasyonu:** Sayfalara özgü neon (glow) ve degrade (gradient) efektleri, `.module.css` dosyaları ile izole edilmiştir.
- **Modülerlik:** Her statik ekran (`create-post`, `gelen-mesaj-analizi`, vb.) alt rotalar halinde ayrıştırılmıştır. Tasarımdaki öğeler statik iskelet (skeleton) standartlarına oturtulmuştur.

## 🛠 Kullanılan Teknolojiler
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Custom CSS Modules (Neon/Glow/Gradient efektleri için)
- **Paket Yöneticisi:** npm
- **İkonlar:** FontAwesome & Lucide

## 📁 Sayfa Yapısı

```
src/app/(dashboard)/
├── page.tsx (Anasayfa)
├── ai-asistan/
│   ├── page.tsx
│   ├── isletme-hizmetleri/
│   └── randevu/
├── ai-muhasebe/
│   ├── page.tsx
│   ├── isletmem/
│   ├── odeme-takvimi/
│   └── veri-girisi/
├── analiz/
│   ├── page.tsx (Gönderi Analizi)
│   └── gelen-mesaj-analizi/
└── sosyal-medya/
    ├── page.tsx
    ├── create-post/ (AI Paylaşım)
    ├── inbox/
    ├── posts/
    └── share/
```

## ⚙️ Kurulum ve Çalıştırma

Projeyi lokalinizde çalıştırmak için:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 📝 Önemli Geliştirme Kuralları (AGENTS.md)
Yeni sayfa ekleneceği zaman uyulması gereken temel kurallar:
1. Hiçbir sayfa (`page.tsx`) kendi `<nav>` (sidebar) veya `<header>` elemanını oluşturmamalıdır. Global `layout.tsx` zaten bu öğeleri içermektedir.
2. Sayfalara özgü özel efektler ve scrollbar'lar, global `tailwind.config` dosyasını kirletmemek adına `.module.css` olarak tasarlanmalıdır.
3. Tasarımdaki form öğeleri ve dinamik chart verileri, dış kütüphanelere yük bindirmemek için statik arayüz iskeletleri (React skeleton) olarak kodlanmalıdır.

## 📌 Son Güncellemeler
- 13 farklı statik HTML tasarımı Next.js'e başarıyla uyarlandı.
- Vercel üretim ortamı derleme testleri (Build) 0 hata ile tamamlandı.
- **Düzen ve Ölçeklendirme:** Genel `globals.css` üzerindeki font küçültme (14px) kaldırılarak orjinal boyutlar (%100 ölçekleme) geri getirildi. `layout.tsx` iskeleti `w-full` ile esnek hale getirilerek sayfaların (örn. Ai Muhasebe) ekrana tam oturması sağlandı.
- **Sade Tasarım (Minimalizm):** Sidebar ve Header alanlarındaki karmaşık yapılar, logolar ve bildirim metinleri silinerek karanlık temaya tam oturan sade/temiz bir görünüme kavuşturuldu.
- **Ai Asistan Yenilenmesi:** Ai Asistan sayfası tamamen baştan kodlandı. Kasa kapağı animasyonları (Vault Door), duman partikülleri ve özel WebGL arka planı (Shader) içeren interaktif "Sihirli Kasa" tasarımı entegre edildi.
- **Aura Efektleri Revizyonu (Ağustos 2026):** Magic Container etrafında dönen ışık (Aura) efektleri, animasyon sorunları sebebiyle kaldırılmış, yerine çerçevenin tamamını kaplayan ve yumuşak geçişlerle gökkuşağı renklerine dönüşen sabit ve kalın bir neon (Color Shift Breathing) tasarımı getirilmiştir.
- **Ai Asistan Dikey Düzen (Ağustos 2026):** Kullanıcı kararıyla "Sihirli Kasa" (Magic Vault) tamamen iptal edilmiş; WhatsApp Asistanı, Asistan Talimatı, İleri Seviye Ayarlar ve AI Kişiliği bölümleri sayfada grid yapısı olmaksızın, tam genişlikte yatay bloklar halinde dikey olarak (üst üste) sıralanmıştır.
- **Premium Arayüz & Glassmorphism Adaptasyonu (Ağustos 2026):** Projedeki genel arayüz (Ai Asistan başta olmak üzere) yüksek kaliteli cam efekti (glassmorphism) ve şık geçişlerle Premium bir yapıya kavuşturuldu. Ai Asistan için iki sütunlu (Left/Right) yapıya geçildi.
- **Canlı Test ve Simülasyon (Ağustos 2026):** Ai Asistan sağ sütununa "Canlı Test" bölümü eklendi. Kullanıcı "Asistan ile konuşun" kısmına odaklandığında (focus) örnek simülasyon silinerek temiz bir test paneline geçilmesi sağlandı.
- **Ai Randevu Yönetimi Adaptasyonu (Ağustos 2026):** Mobil sürümdeki Randevu ekranı, web versiyonunun şık renkleri ve cam efektli modal tasarımıyla Next.js ortamına uyarlandı (Takvim Şeridi, Isı Haritası, Dikey Timeline).
- **Sosyal Medya Bölünmüş ve Kaydırılabilir Düzeni (Ağustos 2026):** Eski "cute" (sevimli) kart tasarımı korunarak tüm sosyal medya yönetim ekranı mobildeki "kaydırmalı slider" mantığına çekildi. Üst kısımda bağlanabilecek tüm hesaplar (Hesabınızı Ekleyin), alt kısımda ise halihazırda bağlanmış hesaplar (Eklediğiniz Hesaplarınız) yatay düzlemde listelendi. Her iki liste için özel bir "drag-to-scroll" (fare ile sürükleyerek kaydırma) bileşeni geliştirilerek akıcı bir kullanıcı deneyimi sağlandı. Kart boyutları daha zarif (premium) hale getirildi.
- **Web ve Mobil UI/UX Senkronizasyonu (Ağustos 2026):** Mobil platform ile tam fonksiyonel ve görsel eşitlik sağlandı. Web üzerindeki Dashboard widget'ları mobil tarafa eklendi, Mobil taraftaki Sosyal Medya kartları ise Web'in şık cam (glassmorphism) ve neon tasarımlı, sevimli emoji (👥, 📸) ikonlarına sahip yatay kaydırılabilir yapısına kavuşturuldu.
- **Web ve Mobil Supabase Veritabanı Senkronizasyonu (Ağustos 2026):** Web panelindeki tüm sahte (mock) veriler kaldırılarak uygulamanın mobil versiyonunda kullanılan gerçek Supabase veritabanına bağlandı.
  - *Ai Muhasebe ve Ödeme Takvimi:* `transactions` tablosuna ve realtime aboneliklere bağlandı.
  - *Sosyal Medya:* Platform hesapları (`social_accounts`) ve gönderiler (`posts`) veritabanından çekilir hale getirildi. Zernio bağlantıları yapılandırıldı.
  - *Gelen Kutusu:* Mesajlar (`conversations`, `messages`), yorumlar (`comments`) ve değerlendirmeler (`reviews`) Supabase ve Zernio edge function'larına bağlanarak tamamen gerçek verilere dönüştürüldü.
  - *Analiz:* Günlük gösterim (views), beğeniler (likes), takipçi istatistikleri ve platform bazlı analiz verileri `zernio-client` Supabase fonksiyonu kullanılarak çekilir duruma getirildi. Birebir mobil entegrasyonu sağlandı.

### [16.08.2026] Son Güncellemeler (Çoklu Seçim & Silme Optimizasyonu)
1. **Gelen Kutusu Çoklu Seçim Geliştirmesi:** "Tümünü Seç ve Sil" özelliği arayüze entegre edildi. Gelen kutusundaki (Mesajlar, Yorumlar, Değerlendirmeler) seçim moduna eklenen "Tümünü Seç" butonu ile kullanıcıların tüm öğeleri tek seferde seçip toplu olarak silebilmesi sağlandı.
2. **Kalıcı Silme Güvenliği:** Yorumların ve mesajların silindiğinde tekrar geri gelmesini önlemek amacıyla, Supabase `comments` ve `messages` tablolarına `DELETE` (Row Level Security) yetkileri eklendi ve frontend tetikleyicileri (Supabase `.delete().in()`) buna göre güncellendi.

### [15.08.2026] Ã‡apraz Platform VeritabanÄ± Senkronizasyonu & Hata Giderimleri
1. **Ai Randevu (Web):** Ai Randevu YÃ¶netimi ekranÄ±ndaki takvim gÃ¼nleri yana kaydÄ±rÄ±labilir (drag-to-scroll) hale getirildi.
2. **Ortak VeritabanÄ± UyumsuzluÄŸu (406 HatasÄ±):** Dashboard ve AI Muhasebe (Web) ekranlarÄ±nda, organizasyon Ã¼yelerini Ã§eken .single() metotlarÄ± boÅŸ sonuÃ§ dÃ¶nebileceÄŸi iÃ§in 406 Not Acceptable hatasÄ± veriyordu. Bunlar gÃ¼venli olan .maybeSingle() ile deÄŸiÅŸtirildi ve sÄ±fÄ±r hata (No errors) durumuna ulaÅŸÄ±ldÄ±.
3. **Sosyal Medya Entegrasyonu (Web):** Web versiyonundaki "Hesap BaÄŸla" uyarÄ± mesajÄ± kaldÄ±rÄ±larak, mobil versiyondaki Supabase Edge Function (zernio-client) tabanlÄ± gÃ¼venli Instagram/Zernio yetkilendirme linki alma ve yÃ¶nlendirme sistemi web versiyonuna entegre edildi.
4. **Gelen Kutusu (Web):** Gelen Kutusu (/gelen-kutusu) ekranÄ±ndaki comments tablosu sorgusunda yer alan geÃ§ersiz posts iliÅŸkisi (posts(media_urls, title)) kaldÄ±rÄ±larak sadece .select('*') bÄ±rakÄ±ldÄ± ve "400 Bad Request" hatasÄ± giderildi. TÃ¼m iletiÅŸim raporlarÄ± sÄ±fÄ±r hata ile yÃ¼klenebilir hale geldi.
5. **Agent KurallarÄ±:** Web ve Mobil projelerin kalÄ±cÄ± hafÄ±zasÄ±na (AGENTS.md) Ã§apraz veritabanÄ± etkileÅŸimi hakkÄ±nda yeni "ğŸš¨ Kritik Kural: Ortak VeritabanÄ± EtkileÅŸimi" kuralÄ± iÅŸlendi.

### [16.08.2026] Gelen Kutusu (Web) Senkronizasyon Hata Giderimi
1. **Gelen Kutusu Silinen Yorumlar Senkronizasyonu:** Silinen yorumlarin Supabase realtime sync dongusu ve edge function tarafindan tekrar getirilip geri gelmesi sorunu Web versiyonu (page.tsx) icinde de cozuldu. Silinen zernio_comment_id'ler i_communication_logs tablosunda zernio_deleted_comment platform markasi ile loglanip Web frontend tarafinda listeleme yapilmadan once filtrelenmesi saglandi.

### [16.08.2026] Sosyal Medya Optimizasyonları (Post Silme ve Zamanlama)
1. **Workigom Flow Özel Silme Modalı:** Web tarafındaki "Sadece panelden sil" veya "Platformlardan da sil" şeklindeki Zernio stili şık modal tasarımı tamamlandı. Silinen gönderiler için veritabanında "soft-delete" (`status = 'deleted'`) mantığı kullanıldı ve veri kaybı önlendi.
2. **Dinamik Zamanlama ve Timezone (Zernio SDK):** Zamanlanmış (Scheduled) gönderiler seçildiğinde tarih alanı artık sabit değil; kullanıcının anlık tarihi + 10 dakika olacak şekilde dinamikleşti. Zernio'nun Timezone (Saat Dilimi) desteği Dropdown menüsü ile eklendi. Seçilen IANA Timezone değeri, `zernio-client` edge function üzerinden Zernio API'ye başarılı bir şekilde iletilerek hassas gönderi planlaması sağlandı.

### [17.08.2026] Gelen Kutusu Profil Resmi ve Private Reply (Gizli DM) Entegrasyonu
1. **Eksik Profil Resimleri:** Gelen kutusu mesajlarinda Zernio'dan gelen participantPicture verisi edge function (zernio-client) uzerinden dogru sekilde haritalandirildi. Fotograf olmayan kullanicilar icin ui-avatars.com altyapisi ile fallback jenerik bas harf logolari eklendi.
2. **Aninda Silme (Optimistic UI):** Mesaj ve yorumlar silindiginde sayfayi yenilemeye gerek kalmadan arayuzden (UI) aninda kaybolmasini saglayan optimistic state guncellemeleri entegre edildi.
3. **Yorum Yanitlarinda Ciftlesme (Duplicate) Hatasi:** UI uzerinden yoruma yanit verildiginde Zernio API'den donen gercek yorum ID'si optimistic UI insert isleminde kullanilarak Zernio Webhook'un ikinci bir kopya olusturmasi ve yanitlarin akordiyon yapi yerine bagimsiz kart olarak uste dusmesi (gruplanamamasi) sorunu %100 cozuldu.
4. **Yorum uzerinden DM gonderme (Private Reply):** Yorum yapan ve daha once hic mesajlasilmamis kullanicilara Zernio SDK'nin private-reply yetenegi kullanilarak yorum uzerinden dogrudan DM gonderebilme altyapisi kuruldu. Bunun icin ozel bir modal arayuzu kodlandi.

### [18.08.2026] Zernio Private Reply (Gizli DM) 24 Saat Kuralı Optimizasyonu
1. **Web ve Mobil Private Reply Senkronizasyonu:** Yorumlara DM gönderilirken geçmiş bir sohbet bulunduğunda sistemin standart 'send-message' yöntemine (Instagram'ın 24 saat aktif konuşma kuralına) takılıp hata vermesi sorunu çözüldü. Artık her iki platformda da bir yorumdan DM butonuna basıldığında geçmişe bakılmaksızın doğrudan (24 saat kuralını delen) 'send-private-reply' metodu tetiklenmektedir. Mobil (React Native) uygulamaya da web versiyonu ile aynı olan satıriçi (inline) Özel Yanıt gönderme yeteneği entegre edildi.


# WORKIGOM AI CORE — STEP 1: DISCOVERY & ARCHITECTURE REPORT

Based on the master plan (PDF) and the codebase analysis of the current Next.js/Supabase structure in `c:\Users\roman\flowweb`, here is the required architecture report.

## 1. Current Domain Models (Mapping)

Mevcut veritabanı tablolarının PDF'teki kavramlara eşleşmesi:

- **AccountingFirm & Accountant:** `accounting_firms` ve `organization_members` tablolarında tutulmaktadır. Müşavir yetkileri buradan gelir.
- **Taxpayer (Mükellef):** `accountant_taxpayer_links` (Müşavirin mükellefe erişim bağı) ve mükellefin bağlı olduğu `organization_members`.
- **FlowBusiness:** Uygulamayı kullanan işletmenin temel organizasyon kaydı (Supabase auth users ve organizations üzerinden).
- **Invoices / Documents:** `finance_documents` (Fiziksel belgeler ve kayıtlar) ve `accounting_drafts` (AI tarafından oluşturulan onay bekleyen taslaklar).
- **Payment / Debt:** `transactions` (Gelir/gider işlemleri ve borç takibi).
- **Notifications:** `notifications` (Uygulama içi ve harici bildirim kayıtları).

## 2. Reusable Services (Mevcut Altyapı)

Yeniden kullanılacak ve AI Core'un wrap edeceği servisler:

- **Database Clients:** `@/lib/supabase/server.ts` ve `@/lib/supabase/client.ts` zaten hazır ve çalışıyor. Doğrudan bu client üzerinden yetkilendirmeli işlemler yapılacak.
- **Auth Service:** `src/actions/auth.ts` içerisinde `supabase.auth.getUser()` kullanılarak tenant (user_id) bağımsızlığı zaten sağlanmış. AI Context'e buradan user/firm bilgisi çekilecek.
- **Data Actions:** `src/actions/accounting.ts` gibi hazır server action'lar mevcut (örn. `getTransactions`, `addTransaction`). AI Core bu servislerin iş mantığını ("Semantic Business Layer") kullanarak operasyon yapacak, doğrudan raw SQL atmayacak.

## 3. Missing Architecture Pieces (Eksik Parçalar)

Sıfırdan inşa etmemiz gereken foundation katmanları:

1. **AI Router & Fast Path:** Gelen mesajın intent'ini (`COUNT_TAXPAYERS` vb.) belirleyen ve eğer read-only ise tool orchestration'a girmeden anında cevap döndüren (Fast Path) yapı.
2. **Context Engine:** Kullanıcının hangi mükellefin sayfasında olduğunu veya bir önceki konuşmada kimi kastettiğini tutan kısa süreli state.
3. **Turkish Entity Resolver:** "Yılmaz İnşaat'ın", "Yilmaz insaat'a" gibi ekli ve bozuk Türkçe kelimeleri, doğru `taxpayer_id` ile eşleştirecek kritik pipeline (Unicode normalization + suffix awareness + fuzzy matching).
4. **Tool Registry & Semantic Business Layer:** AI modelinin doğrudan veritabanına erişmesini engelleyecek, `execute(context, input)` şemasına sahip type-safe (Zod) komut araçları.
5. **Policy Engine:** `risk: "read" | "write" | "external_action"` bazında RLS harici authorization kontrollerini (bu müşavir bu mükellefin verisine erişebilir mi?) yapan katman.
6. **AI Provider Abstraction:** Kodun direkt `Gemini SDK`'ya değil, `AIProvider` arayüzüne bağımlı olmasını sağlayacak wrapper.

## 4. Proposed Folder Structure (AI Core)

PDF direktiflerine uygun olarak, `src/ai-core/` dizin ağacı tam olarak aşağıdaki gibi oluşturulacaktır:

```text
src/ai-core/
├── router/
│   ├── intent-router.ts
│   ├── intent.types.ts
│   └── intent.schemas.ts
├── context/
│   ├── conversation-context.ts
│   └── context.types.ts
├── entities/
│   ├── taxpayer-resolver.ts
│   ├── turkish-normalizer.ts
│   ├── entity.types.ts
│   └── aliases.ts
├── tools/
│   ├── registry.ts
│   ├── tool.types.ts
│   ├── taxpayers/
│   │   ├── count-taxpayers.ts
│   │   ├── find-taxpayer.ts
│   │   ├── get-taxpayer-balance.ts
│   │   └── get-taxpayer-history.ts
│   ├── invoices/
│   │   ├── get-taxpayer-invoices.ts
│   │   └── get-missing-invoices.ts
│   └── notifications/
│       └── send-notification.ts
├── policy/
│   ├── policy-engine.ts
│   └── permissions.ts
├── audit/
│   ├── audit-service.ts
│   └── audit.types.ts
├── providers/
│   ├── ai-provider.ts
│   └── gemini-provider.ts
└── shared/
    ├── result.ts
    ├── errors.ts
    └── schemas.ts
```

## 5. Database Migrations (ai_audit_logs)

Sistemin audit edilmesi ve partial failure tespiti için gerekli olan loglama tablosu migration taslağı:

```sql
-- 20260819_ai_audit_logs.sql
CREATE TABLE IF NOT EXISTS ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID NOT NULL,
    user_id UUID NOT NULL,
    conversation_id UUID,
    
    intent VARCHAR(255),
    tool_name VARCHAR(255),
    tool_risk VARCHAR(50),      -- 'read', 'write', 'external_action'
    
    entity_type VARCHAR(100),   -- 'taxpayer', 'invoice' vb.
    entity_id VARCHAR(255),
    
    input_json JSONB,           -- LLM'den gelen parametreler
    output_json JSONB,          -- Servis yanıtı veya error detayları
    
    status VARCHAR(50) NOT NULL,-- 'success', 'failed', 'denied'
    error_code VARCHAR(100),
    error_message TEXT,
    
    latency_ms INT,             -- Total işlem süresi
    model VARCHAR(255),         -- Örn: 'gemini-1.5-pro'
    model_latency_ms INT,       -- AI cevap süresi
    tool_latency_ms INT,        -- Tool execute süresi
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexler (Hızlı arama ve observability için)
CREATE INDEX idx_ai_audit_firm_id ON ai_audit_logs(firm_id);
CREATE INDEX idx_ai_audit_status ON ai_audit_logs(status);
CREATE INDEX idx_ai_audit_created_at ON ai_audit_logs(created_at);

-- RLS Politakaları (Sadece yetkili organizasyon veya adminlerin logları görmesi için eklenecektir)
ALTER TABLE ai_audit_logs ENABLE ROW LEVEL SECURITY;
```

---

> [!IMPORTANT]
> **User Review Required**
> Yukarıdaki rapor "STEP 1 - DISCOVERY" fazını tamamlamaktadır. Mimarideki eşleşmeler ve klasör yapısı master plan (PDF) ile birebir örtüşmektedir.
> Raporu onaylamanız durumunda "STEP 2 - DOMAIN MAPPING" ve sonrasındaki klasörleri/dosyaları oluşturma adımına (STEP 3 - FOUNDATION) geçebiliriz. Onaylıyor musunuz?


### [21.08.2026] Müşavir Profil & Bağlantı Entegrasyonu
- **Müşavir Bağlantı Kartı:** Flow (Esnaf) uygulamasında "Muhasebecim" sayfasına girildiğinde, kullanıcının bağlı olduğu müşavir var ise doğrudan "Bağlı" durumunu gösteren ve müşavirin profil bilgilerini, İşletme Adı, resim ve iletişim numarasıyla birlikte sunan interaktif Glassmorphism Müşavir Kartı eklendi.  ccountant_taxpayer_links tablosundan canlı doğrulama sağlandı.

### [22.08.2026] Dashboard Yapay Zeka Veri Bağlantıları ve Profil Senkronizasyonu
- **Dashboard Güncellemeleri:** AI Asistan günlük özet kutusundaki ve Sosyal Medya etkileşim trendindeki görsel amaçlı sahte veriler (mock data) kaldırıldı. Flow projelerinde mesaj/yorum istatistikleri ve yaklaşan randevular doğrudan ilgili Supabase tablolarına; sosyal medya etkileşim büyümesi ise Zernio üzerinden gerçek verilere bağlandı.
- **Ledger Profil Yedekleme (Fallback) Sistemi:** Ledger uygulamasında, "Profil Bilgilerim" ekranının form alanlarında veritabanı boş olsa dahi (authorized_person, avatar_url) Google (OAuth) session'ından gelen verileri (user_metadata) varsayılan olarak göstermesi ve düzgün senkronize olması sağlandı.

## GitHub Token
ghp_***REDACTED***


---

# WORKIGOM AI CORE - STEP 2 & 3: FINAL IMPLEMENTATION (LEDGER SHARED BACKEND)

Ağustos 2026 itibarıyla kullanıcı kararıyla AI Core altyapısı frontend (Flow/Flowweb) içinden çıkartılmış, omnichannel (WAHA, Zernio, Web, Mobile) uyumluluğu için Ledger backend'indeki Edge Function shared katmanına (C:\Users\roman\ledger\supabase\functions\shared) taşınmıştır.

## 1. Mimari Prensipler (Clean AI Execution)

- **Doğru Konum (Canonical Backend):** Bütün botlar ve arayüzler aynı zekâyı kullanır. AI Core frontend modülü değil, backend application altyapısıdır.
- **Provider İzolasyonu:** GeminiClient saf bir LLM provider olarak refaktör edilmiş olup GeminiTurnResult dönmektedir. İçerisinde tool logic barındırmaz.
- **Güvenli Tool Executor:** ToolExecutor security-critical verileri (örn. organizationId) LLM argümanlarından almak yerine her zaman server-side AIContext'ten alır.
- **Domain Katmanı ve Concurrency:** Tool'lar (Örn: CreatePendingAppointmentTool) veritabanı logici taşımaz. AppointmentService gibi domain servislerini çağırır. Concurrency ve slot çakışma (collision) güvenliği DB repository/RPC seviyesinde (Idempotency, State Guards) sağlanır.
- **4 Katmanlı Prompt Sistemi:** PromptBuilder; SYSTEM POLICY, BUSINESS CONTEXT, BOT PERSONALITY ve CHANNEL CONTEXT metinlerini güvenli bir şekilde birleştirir.
- **Döngü Sınırı:** İşlemin sonsuz döngüye girmemesi için MAX_TOOL_ROUNDS = 5 olarak belirlenmiştir.

## 2. Klasör Yapısı (ledger/supabase/functions/shared/)

`	ext
application/
├── usecases/
│   └── HandleIncomingMessageUseCase.ts (Omnichannel Router & DI Consumer)
│
ai/
├── AIOrchestrator.ts (Loop Yöneticisi)
├── PromptBuilder.ts (4-Katmanlı Prompt)
├── types.ts (GeminiTurnResult, AIContext)
└── tools/
    ├── ToolRegistry.ts
    ├── ToolExecutor.ts (Güvenli argüman yöneticisi)
    ├── types.ts
    ├── appointments/
    │   ├── ListBusinessServicesTool.ts
    │   ├── ListAvailableSlotsTool.ts
    │   └── CreatePendingAppointmentTool.ts
    └── rag/
        └── SearchDriveKnowledgeTool.ts

domain/
├── appointment/
│   └── AppointmentService.ts (Idempotency & Concurrency)
└── knowledge/
    └── DriveKnowledgeService.ts

infrastructure/
├── clients/
│   ├── GeminiClient.ts (Saf Provider)
│   ├── WahaClient.ts
│   └── ZernioClient.ts
└── repositories/
    ├── AppointmentRepository.ts
    └── DriveKnowledgeRepository.ts

container.ts (Dependency Injection Initializer)
`

## 3. RAG ve Veritabanı (Vector Search)
Tenant-safe doküman araması için pgvector eklentisi zorunlu kılınmıştır. Yalnızca aktif organizasyona ait evraklarda arama yapılabilmesi için match_company_documents adında bir RPC fonksiyonu (20260826000000_rag_rpc.sql) oluşturulmuştur.

## 4. Webhook Entegrasyonları (WAHA & Zernio)
waha-webhook ve zernio-webhook uç noktalarındaki eski 'God Object' implementasyonları temizlenmiştir. Her iki webhook'ta da şu an:
1. container.ts üzerinden createMessageUseCase(supabaseAdmin) çağrılır.
2. İş mantığı (Bot ayarlarının alınması, RAG aramaları, 5-loop tool execution vb.) HandleIncomingMessageUseCase üzerinden AIOrchestrator'a devredilir.
3. AI kararı (Metin döndürme veya işlem yapma) yine router aracılığıyla uygun kanaldan (WhatsApp veya Instagram) müşteriye iletilir.
