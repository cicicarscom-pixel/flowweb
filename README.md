## 🔄 AKTARIM NOTU (HANDOVER) - 30 EYLÜL 2026 (Rezervasyon ve Müsaitlik Çekirdeği Eşitlemesi)

**Şu Anki Durum:**
Faz kapsamında, AI Asistan Randevu modülündeki rezerve edilen saatlerin (calendar_blocks) yönetimi, web (FlowWeb) ve mobil (Flow) uygulamalarında ortak veritabanı kurallarına göre senkronize edildi.

**Web & Mobil (Ortak) Durumu:**
- **Kapsam (Scope) Düğmesi Güncellemesi:** Randevu alma modalında yer alan "Seçili doktor" ibaresi dinamik hale getirildi. Kullanıcının `activeCalendarId` seçimine göre doğrudan ilgili doktorun adı (örn. Dr. Mehmet YALÇIN) gösteriliyor.
- **Isı Haritası (Heatmap) Rezerve Hücre UI İyileştirmesi:** Saat (örn. 10:00) hücrenin üst kısmında daha büyük (12px) ve vurgulu, randevu sebebi (Toplantı, İzinli vb.) ise alt kısımda (10px) yer alacak şekilde dikey (flex-col / View) yerleşime geçirildi. Hücre yükseklikleri (minHeight/height) 40px yapılarak metin kesilmeleri (clipping) önlendi.
- **Çeviri ve Yerelleştirme (i18n):** Mobil ve web platformlarında randevu notu (noteLabel, notePlaceholder) ile hata mesajları (`randevu.block.alreadyBlocked`) {tr, en, de} dillerinde eklendi. Sabit Türkçe bırakılan engel/sebep mesajları tamamen yerelleştirildi.

**Mobil (Flow) Durumu:**
- **Liste Sıralaması:** "Gün randevu listesi" (`appointments`), kronolojik takibi kolaylaştırmak adına `starts_at` ve `date` değerleri baz alınarak artan şekilde (09:00, 10:00, 11:00) sıralandı.
- **RPC Parametreleri Uyumsuzluğu Giderildi:** `SupabaseAppointmentRepository.ts` içerisinde Supabase RPC fonksiyonlarının beklediği parametre adları (`p_date`, `p_local_start`) tam uyumlu hale getirildi.

**Ledger (Backend / DB) Durumu:**
- **Çift Kayıt (Duplicate Calendar Blocks) Engeli:** Aynı saat diliminde üst üste blok kaydı oluşturulmasını engelleyen ve `ALREADY_BLOCKED` dönen Supabase `create_calendar_block` fonksiyonu yaması (`ledger-kayit-esitleme.patch`) başarıyla uygulandı. Çift kayıt oluşumu veritabanı seviyesinde önlendi.

## 🔄 AKTARIM NOTU (HANDOVER) - 29 EYLÜL 2026 (Finans Özetleri, Tarih & Para Formatı Optimizasyonları Tamamlandı)

**Şu Anki Durum:**
M4/Faz 4 kapsamında, AI Muhasebe, İşletmem ve Ödeme Takvimi modüllerinde tarih, zaman dilimi (timezone) ve para birimi formatlaması baştan aşağı yenilenmiş, web ve mobil sürümlerde tam senkronizasyon sağlanmıştır.

**Web & Mobil (Ortak) Durumu:**
- **Zaman Dilimi ve Tarih Hataları Çözüldü:** 
ew Date().toISOString() gibi yerel saat dilimini atlayan ve ay sonu kayıtlarında (-1 gün kaymasına yol açarak) 30 Eylül gibi kayıtların listelenmemesine neden olan sorunlar giderildi. Yerine lib/dates.ts içerisine eklenen, ay tabanlı tarihleri yerel saate saygı duyacak şekilde hesaplayan monthRangeYmd utility'si kullanıldı.
- **Para Birimi (Kuruş) Formatlama:** lib/money.ts oluşturuldu. Büyük meblağlarda gereksiz yere çıkan ,00 kuruş haneleri akıllıca gizlenirken (maximumFractionDigits: 0 hatasına düşmeden), 4.820,50 gibi gerçekten kuruş içeren değerler korundu. 
- **Yerelleştirme (i18n):** Mobil tarafta ("Ocak", "Şubat") gibi sabit Türkçe ay isimleri ve formatlama dizileri tamamen temizlendi. Yerine i18n.language ve 	oLocaleDateString ile cihaz diline ve yereline uygun dinamik tarih formatlamasına geçildi.

**Mobil (Flow) Durumu:**
- IsletmemScreen.js ve AiMuhasebeScreen.js içindeki sbuild kaynaklı derleme hataları (çift değişken tanımlaması, eksik süslü parantezler vb.) giderilerek uygulamanın çökmesi engellendi. Component'lerdeki undefined hataları 	sc testlerinden sıfır hatayla geçti.

**Ledger (Müşavir Uygulaması) Durumu:**
- ledger-isleyici-api (Edge Function) Müşavir entegrasyonu (Ledger) için 'sales' işlemi desteği ve get_finance_summary entegrasyonlarını kapsayacak şekilde origin/main'de yer alan en güncel commit (4e3997e) kullanılarak Supabase üzerinden başarıyla deploy edildi.


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

- **[11.10.2026] İşletmem gerçek veriye bağlandı (web):** Sayfa sahte sabit rakamlar (₺-5.900, "Haziran 2026/Eylül 2022", %4,2 düşüş, çizim grafik) yerine artık `get_payment_calendar` (kayıt listesi + ay listesi) ve `get_finance_summary` (gelir/gider/bakiye, kuruştan) ile çalışır; ay seçici, önceki aya göre gerçek değişim yüzdesi, Gelirler/Giderler/Faturalar sekmeleri, arama, durum rozetleri, "Yeni Ekle" → Veri Girişi, "Analiz Oluştur" (`generate-insights`). Mobil İşletmem ile aynı kaynak.
- **[11.10.2026] İşletmem (web):** Üst köşedeki işlevsiz bildirim çanı ve sabit yazılı "Bugün: 03 Temmuz 2026" tarih kutusu kaldırıldı.
- **[11.10.2026] Rezerve kapsamı etiketleri nötr (web):** "Tüm klinik / Seçili doktor" yerine "Tüm takvimler / Seçili takvim" (tr/en/de); her işletme türüne uygun.
- **[10.10.2026] Saati Rezerve Et: saat artık görünür ve ayarlanır (web):** "Tek slot" modunda da Başlangıç saati görünür ve değiştirilebilir; Bitiş otomatik +30 dk gösterilir (soluk). "Başlangıç-bitiş" modunda ikisi de düzenlenir.
- **[10.10.2026] Randevu: sadeleşen akış (web):** Boş saat hücresine tıklamak artık menü açmak yerine doğrudan "Yeni Randevu" formunu açar (saat seçili gelir). Saati kapatma (mola/izin/toplantı) ayrı bir **"Saati Rezerve Et"** düğmesine taşındı (ilk boş saat ve aralık seçimiyle açılır); rezerveli (kesikli) saate tıklayınca "Rezervasyonu kaldır" aynen çıkar. Metin: `randevu.block.reserveButton` (tr/en/de).
- **[10.10.2026] Randevu: geçmiş saat bildirimi:** Saati geçmiş (soluk) saat hücresine dokunulunca artık sessiz kalmıyor; "Bu saat geçti. Yeni randevu için ileri bir saat seçin." uyarısı çıkıyor (`randevu.block.slotPast`, tr/en/de). Geçmiş saatlere yeni randevu/rezervasyon açılmaz (kural değişmedi).
- **[10.10.2026] Bağımlılık güvenliği (Faz 10, web):** Next.js'in içinde gömülü eski `postcss` (güvenlik bulguları: sourceMappingURL ile dosya okuma, `</style>` XSS) `package.json` `overrides` ile `^8.5.23`'e sabitlendi; `npm audit` bulguları 11 → 9. Kalan 9 bulgu yalnızca geliştirme/derleme aracı bağımlılıkları (Tailwind 3 ve `eslint-config-next` içindeki `braces`/`chokidar`/`micromatch`/`fast-glob`) ve çözümleri büyük sürüm geçişi (Tailwind 4, Next 16) gerektiriyor; üretimde işlenmiyorlar, ayrı bir iş olarak planlanır.
- **[10.10.2026] Gelen Kutusu sekme sayaçları:** Mesajlar, Yorumlar ve Değerlendirmeler sekmelerindeki rozet artık toplam değil **okunmamış** sayısını gösterir (Mesajlar: okunmamış sohbet; Yorumlar: okunmamış yorum; Değerlendirmeler: yanıtsız; Bildirimler: okunmamış). Bir sohbet ya da gönderi açılınca okundu işaretlenir (`conversations.unread_count = 0`, `comments.is_read = true`). Veritabanı: `comments.is_read` (migration `20261010000003`); sütun yokken sayaç gösterilmez.
- **[10.10.2026] Gelen Kutusu › Yorumlar (gönderi başlığı/görseli):** Zernio'dan gelen yorumların bir kısmında `posts` kaydı yoktu (`post_id` boş), bu yüzden her gönderi "Gönderi detayı bulunamadı" ve gri görsel gösteriyordu. `zernio-client` `sync-comments` artık yorum alan gönderiler için eksik `posts` kaydını Zernio'daki metin ve görselle oluşturur, boş kalanları doldurur ve sahipsiz yorumları bağlar; sayfa senkronizasyondan sonra yorumları yeniden yükler.
- **[10.10.2026] Kalite Faz 9D (büyük sayfalar bölündü, web):** `gelen-kutusu/page.tsx` 1400 → 827, `RandevuClient.tsx` 1181 → 486, `sosyal-medya/share/page.tsx` 1065 → 641 satır. Başlık, sekme panelleri (Mesajlar/Yorumlar/Değerlendirmeler/Bildirimler), takvim/zaman çizelgesi, modallar, paylaşım bölümleri ve platform ayar formları aynı klasörlerde ayrı bileşen dosyalarına birebir taşındı (toplam 26 yeni dosya); durum ve işleyiciler sayfalarda kalır, bileşenlere tipli props ile geçer (tipler TypeScript denetleyicisinden türetildi). Davranış değişmedi; `tsc`, ESLint çıtası (24) ve `next build` doğrulandı.
- **[10.10.2026] Muhasebeci bağlantı kodu sertleştirme (Faz E2, web tarafı):** Muhasebecim sayfası yeni `RATE_LIMITED` yanıtını gösterir (çok fazla hatalı kod → "15 dakika sonra tekrar deneyin"; `aiMuhasebePage.muhasebecim.rateLimited`, tr/en/de). Veritabanı tarafı (deneme sınırı, sahipsiz firma kodlarının kullanılamaması, harf duyarsız kod) canlıda; ayrıntı: ledger `docs/FAZ_E_PLAN.md`.
- **[10.10.2026] Analiz (YouTube):** `get-youtube-daily-views` çağrısı kaldırıldı. Zernio'nun bu uç noktası tek bir videoya aittir (`videoId` zorunlu); sayfa videoId vermediği için her YouTube seçiminde konsola "Invalid input: expected string, received undefined" uyarısı düşüyordu ve dönen veri hiç kullanılamıyordu. Kanal zaman serisi `get-daily-metrics`'ten gelmeye devam ediyor (görünüm değişmedi).
- **[10.10.2026] Belgeler:** `AGENTS.md` §3 gerçek duruma getirildi — veritabanında tek tenant kimliği `organizations.id` (eski "sahibin kullanıcı kimliği" modeli Faz F ile bitti); Faz D ve F kapalı.
- **[10.10.2026] Ölü kod temizliği (web):** `src/actions/social.ts` silindi. Hiçbir yerden çağrılmıyordu ve veritabanında bulunmayan `inbox_messages` tablosuna başvuruyordu (`getPosts`, `createPost`, `deletePost`, `getMessages`, `replyToMessage`, `getSocialAccounts`). Bu işlemlerin gerçek karşılıkları ilgili sayfaların kendi sorgularında.
- **[10.10.2026] Analiz: bağlantısı kopmuş hesap artık sorgulanmıyor:** Analiz sayfası hesap listesini `is_active`/`needs_reconnection` süzmeden okuyordu; bağlantısı kopmuş (`is_active=false`, `needs_reconnection=true`) Instagram kaydı için Instagram seçilince `get-instagram-demographics` / `get-instagram-follower-history` istekleri "Forbidden: Account not owned by this organization" uyarısı veriyordu. Diğer sayfalarla (Gelen Kutusu, Paylaşım, Sosyal Medya) aynı süzgeç eklendi.
- **[10.10.2026] Analiz: platform filtresi hatası düzeltildi:** Platform seçilince (Instagram/Facebook/YouTube…) gönderi sayacı sorgusu `posts.platform` sütununu arıyordu; tabloda böyle bir sütun yok (`platforms` dizisi var), sorgu 400 dönüyordu ve "Toplam Gönderi" / biçim dağılımı 0 kalıyordu. Sorgu `platforms` dizisine göre filtreleyecek şekilde düzeltildi. (Hata Faz 9A'dan önce de vardı.)
- **[10.10.2026] Kalite Faz 9A (Analiz sayfası bölündü, web):** `analiz/page.tsx` 1544 → 168 satır. Taşıma birebirdir, davranış/görünüm değişmedi: `analizConfig.ts` (platform ve zaman aralığı sabitleri), `CustomTooltip.tsx`, `useAnalyticsData.ts` (kendi sayaçları + Zernio çağrıları; veri katmanı), `PostingAnalytics.tsx` ve `InboxAnalytics.tsx` (iki sekme). Sayfa artık yalnız filtreleri/sekmeleri tutar ve verileri alt bileşenlere props ile geçirir. `tsc`, ESLint çıtası (24) ve `next build` doğrulandı.
- **[10.10.2026] Vercel derleme hatası düzeltildi:** Faz 10 sonrası Vercel `pnpm install` ile çöktü (`ERR_PNPM_OUTDATED_LOCKFILE`: `pnpm-lock.yaml` `next-intl` 4 ile uyumsuzdu; depoda iki kilit dosyası vardı ve Vercel pnpm'i seçiyordu). Eski `pnpm-lock.yaml` ve `pnpm-workspace.yaml` silindi; tek kilit dosyası `package-lock.json` (GitHub CI ile aynı ağaç, `npm ci` ile doğrulanan). Önceki sürüm canlıda çalışmaya devam etti.
- **[10.10.2026] Kalite Faz 10 (bağımlılıklar, web):** `npm audit` 17 → 11 açık (yüksek 13 → 8): `npm audit fix` ile `next` 15.5.27 (önbellek zehirlenmesi), `sharp`, `postcss`, `nanoid`, `js-yaml`, `brace-expansion`, `source-map-js` güvenlik sürümlerine çekildi; `next-intl` 3 → 4.14.9 (açık yönlendirme / prototype pollution; uygulama etkilenen özellikleri kullanmıyordu ama güncel tutuldu). Kalan 11 açık yalnız geliştirme/derleme aracı zincirinde (`eslint-config-next`, `tailwindcss` 3, Next'in iç `postcss`'i) ve çözümü büyük sürüm atlaması istiyor (Next 16, Tailwind 4); üretimde çalışan kod etkilenmiyor, ayrı bir iş olarak planlandı. **Hata düzeltmesi:** ICU mesajlarında `'{ad}'` yazımı parametreyi değiştirmeden `{ad}` olarak gösteriyordu (Randevu takvim silme onayı ve Gelen Kutusu yanıt uyarısı); `''{ad}''` ile düzeltildi ve CI'ya `check-icu.mjs` denetimi eklendi.
- **[09.10.2026] Kalite Faz 3c (React efekt bağımlılıkları, web):** 13 `useEffect`/`useMemo` bağımlılık uyarısı giderildi (ESLint uyarısı 37 → 24; çıta tabanı 24). Veri çekme işlevleri `useCallback` ile sarıldı (AI Asistan, Muhasebecim, Ödeme Takvimi, Analiz, Gelen Kutusu/Mesajlar); uzun ömürlü realtime abonelikleri ve sayfa açılış senkronu (Gelen Kutusu, Sosyal Medya) yeni `lib/useLatest.ts` ile her zaman en güncel işlevi çağırır ama işlev kimliği değişince abonelik yeniden kurulmaz. Sosyal Medya Gelen Kutusu: seçili sohbet mesajları artık sohbet listesi her güncellendiğinde değil, yalnız seçili sohbet/sekme değişince çekilir (liste geç gelirse mesajlar da yüklenir). Doğrulandı: `useTranslations()` ve `useDialog()` işlevleri yeniden çizimlerde kararlı (efektler yeniden tetiklenmez).
- **[09.10.2026] Kalite Faz 8 (ortak uyarı/onay bileşeni, web):** Tarayıcının `alert()`/`confirm()` pencereleri (67 çağrı, 14 dosya) yerine çevirili, erişilebilir ortak bileşen (`components/ui/DialogProvider.tsx`, `useDialog()`): `dialog.alert(mesaj)` ve `await dialog.confirm(mesaj, { danger: true })`. Esc iptal, Enter onay, odak onay düğmesinde, birden çok uyarı sıraya girer, yıkıcı onaylar kırmızı. Sıfırlama paneli artık "tamamlandı" mesajını sayfa yenilenmeden önce gösterir. Yeni anahtarlar: `dialog.ok/confirm/cancel` (tr/en/de).
- **[09.10.2026] Eksik çeviri anahtarı:** Tüm `t("…")` çağrıları tr/en/de dosyalarıyla karşılaştırıldı; tek eksik `common.cancel` (Randevu rezervasyon penceresi "İptal" düğmesi) eklendi.
- **[09.10.2026] Kalite Faz 6B (i18n + e-posta doğrulama sayfası):** Doğrulama sayfası (`verify-email`), Onboarding formu, Müşteriler, Randevu (takvim yönetimi, rezervasyon penceresi), Gönderiler tablosu, Paylaşım uyarıları, Gelen Kutusu uyarıları, Çoklu Takvim anahtarı, Fatura kartı ve Kenar Çubuğu'ndaki sabit metinler tr/en/de anahtarlarına taşındı (78 yeni anahtar). Doğrulama sayfasında "Tekrar Gönder" artık 60 sn bekleme sayacı gösterir, hız sınırında anlaşılır uyarı verir ve hesap zaten doğrulanmışsa kullanıcıyı yanıltmaz (Supabase bu durumda e-posta göndermez ama başarılı döner); "Giriş sayfasına dön" bağlantısı eklendi. Kayıtta kullanıcının dili (`locale`) Supabase'e iletilir; e-posta şablonu bu dile göre seçilir. Kenar çubuğu ve doğrulama sayfasındaki `useEffect` bağımlılık uyarıları giderildi (38 → 37).
- **[09.10.2026] Kalite Faz 6A (i18n, Analiz sayfası):** `analiz/page.tsx` içindeki ~100 sabit Türkçe/İngilizce metin (kart başlıkları, tablo sütunları, grafik etiketleri, gün kısaltmaları, ısı haritası ipucu, Gelen Kutusu analizleri) `analizPage.*` anahtarlarına taşındı; tr/en/de 76 yeni anahtar. Ekran dili artık seçilen dille değişir; "Best times" ve saat ipucu da çevrilir (12 saat "am/pm" yerine 24 saat biçimi).
- **[09.10.2026] Kalite Faz 5 (CI kapıları):** CI artık `npm ci` + `tsc --noEmit` (hata olursa kırmızı) + ESLint çıtası çalıştırıyor. Çıta (`scripts/ci/eslint-ratchet.mjs`): hata/uyarı sayısı kayıtlı tabanı (0 hata, 38 uyarı) AŞAMAZ; temizlik yapıldıkça taban düşürülür. Yeni kod mevcut kaliteyi bozamaz.
- **[09.10.2026] Kalite Faz 3b:** ESLint uyarıları 86 → 38: kullanılmayan değişken/import/parametre uyarıları 45 → 1 (kalan: `muhasebecim` `handleDisconnect`, muhasebeci bağlantı yaşam döngüsü işiyle birlikte ele alınacak); Anasayfa'da sonucu hiçbir yerde kullanılmayan ödeme takvimi RPC'si ve 4 platform sayacı sorgusu kaldırıldı (her açılışta 5 gereksiz istek); 4 `useEffect` bağımlılığına `supabase` eklendi (tarayıcıda tek örnek olduğundan davranış değişmez). Tam `tsc` hatasız.
- **[09.10.2026] Kalite Faz 3:** ESLint hataları 5 → 0 (`prefer-const`, `@ts-nocheck`); 8 `<img>` alt metni (süs avatarlar `alt=""`); `(dashboard)/page.tsx`'te kullanılmayan `inc/exp` kaldırıldı; `lib/dates.test.ts` artık gerçek `dates.ts` modülünü sınıyor (önceden fonksiyonların kopyasını sınıyordu); Deno testleri `tsconfig`/ESLint dışında. Tam `tsc --strict` ve `deno test` temiz.
- **[09.10.2026] Temizlik (Kalite Faz 2):** hiçbir yerden çağrılmayan ve tablo izinleriyle zaten çalışmayan sunucu işlemleri (`actions/accounting.ts`, `actions/insights.ts`) ile derlenemeyen eski `docs/archive/test_appts.ts` silindi; tam `tsc` artık hatasız.
- **[09.10.2026] Güvenlik (Kalite Faz 1A):** hiçbir yerden çağrılmayan `src/actions/zernio.ts` silindi (Zernio ile tüm iletişim Supabase `zernio-client` Edge Function'ı üzerinden; anahtar yalnız Supabase Secrets'ta). Dosya, tarayıcıya gömülen `NEXT_PUBLIC_ZERNIO_API_KEY` adını da okuyordu; bu risk kökünden kalktı. Vercel'de Zernio anahtarına gerek yoktur.
- **[09.10.2026] Anasayfa "Yaklaşan Randevular":** boş durumda "Bugün için planlı randevu yok" yazıyordu (Bugünkü Randevular ile çelişiyordu); artık "Yaklaşan randevu veya rezervasyon bulunmuyor" (tr/en/de). Mobil zaten doğruydu.
- **[09.10.2026] Anasayfa Randevu Bildirimleri randevularla senkron:** silinen veya iptal edilen randevuların bildirimi artık listede ve zil sayacında görünmez (`get_appointment_notifications`, `count_unread_appointment_notifications` RPC'leri; web + mobil aynı kaynak).
- **[09.10.2026] Anasayfa Randevu Bildirimleri:** "Raporları Temizle" düğmesi eklendi (onay sorar; yalnız randevu bildirimlerini siler, randevular ve müşteri konuşmaları silinmez; tr/en/de). Veritabanı: `clear_appointment_notifications()`.
- **[09.10.2026] Randevu sayfası:** "🧹 Hafızayı Sil" düğmesi ve `clearChatMemory` işlemi kaldırıldı (işletmenin tüm konuşma kayıtlarını geri alınamaz şekilde siliyordu). Konuşma geçmişi silmek gerekirse yönetici tarafından veritabanından yapılır.
- **[09.10.2026] Canlı Test:** panelden "🧹 Hafızayı Sil" düğmesi kaldırıldı (işletmenin gerçek WhatsApp konuşma kayıtlarını `ai_communication_logs`'tan siliyordu; test paneli bu tabloyu kullanmaz). Yalnız "↻ Ekranı Temizle" kaldı. (Randevu sayfasındaki ayrı "Hafızayı Sil" düğmesine dokunulmadı.)
- **[09.10.2026] Canlı Test bilgilendirmesi (düzeltme):** not, kullanılmayan `LiveTestPanel.tsx` yerine sayfada gerçekten gösterilen Canlı Test paneline (`ai-asistan/page.tsx`) taşındı; ölü bileşendeki kopya ve anahtar kaldırıldı.
- **[09.10.2026] Canlı Test bilgilendirmesi:** AI Asistan sayfasındaki Canlı Test panelinin üstüne "hafızasızdır, her mesaj ilk karşılaşma gibi değerlendirilir; gerçek randevu açılmaz, mesaj gitmez" notu eklendi (tr/en/de).
- **[09.10.2026] Flow AI web sesli sohbet:** yanıt beklenirken ("Düşünüyor…") de mikrofon dinlemeye devam eder; o sırada söylenenler hemen sohbette görünür ve yanıt gelince otomatik gönderilir. Yanıt okunurken mikrofon yankıyı duymasın diye kapalıdır; okuma bitince yeniden açılır. Yanıt beklerken sessizlik sayılıp sohbet kapanmaz.
- **[09.10.2026] Flow AI → Paylaşım Merkezi devri:** video ve paylaşım işi artık Paylaşım Merkezi zaten açıkken de alınır (yalnız sayfa açılışında alınıyordu); panelde "Paylaş"a basınca sayfa hazır değilse Paylaşım Merkezi açılır ve hazır olunca paylaşım başlatılır. Paylaşım Merkezi'nde metin/platform eksikliği gibi erken çıkışlar panele hata olarak bildirilir (panel "paylaşılıyor"da takılı kalmaz).
- **[09.10.2026] Flow AI web — sesli sohbet:** panelde mikrofon düğmesi eklendi (tarayıcının Web Speech API'si; ek paket yok). Basınca eller serbest döngü: dinle → cümle bitince gönder → yanıtı sesli oku → yeniden dinle. "bitir/kapat/stop" ya da düğme ile kapanır; 3 sessiz tur sonra kendiliğinden durur. Desteklemeyen tarayıcıda (ör. Firefox) düğme görünmez. tr/en/de.
- **[08.10.2026] WhatsApp hatırlatma metni:** AI Asistan sayfasında işletme kendi hatırlatma metnini yazar ve mesaj dilini seçer (tr/en/de/fr/es); yer tutucular ({name}, {business}, {date}, {time}, {doctor}, {service}) ve örnek önizleme vardır. Hitap (Sayın/Mr./Herr…) metne işletme tarafından yazılır, kodda sabit değildir.
- **[08.10.2026] Profil:** "Profili Kaydet" düğmesi yalnız değişiklik varken etkin; kaydedince "Kaydedildi" yazıp pasif kalır, bir alan değişince yeniden etkinleşir. Profil kaydı artık hatayı sessizce yutmaz.
- **[08.10.2026] WhatsApp randevu hatırlatma:** AI Asistan sayfasına "WhatsApp randevu hatırlatma" düğmesi eklendi (yalnız işletme sahibi değiştirir; varsayılan kapalı). Açıkken onaylı randevulara 24 saat önce WhatsApp'tan otomatik hatırlatma gider.
- **[06.10.2026] Sosyal Medya Gönderiler:** Gönderi listesinden beğeni, yorum, paylaşım vb. analiz sütunları kaldırıldı (tablo genişliği iyileştirildi ve gereksiz veriler temizlendi).
- **[06.10.2026] WAHA Bot:** WhatsApp durum sorgusunda 'bot kurulmamış' durumu hata sayılmaz (yeni kullanıcı).
- **[05.10.2026] İletişim e-postası:** Gizlilik Politikası (§11) ve Hesap Silme sayfasına `info@workigom.com` eklendi (tr/en/de).
- **[05.10.2026] Hesap silme sonrası çıkış:** silinen kullanıcı için sunucuya global çıkış isteği 403 veriyordu; artık yalnız yerel oturum kapatılır (`signOut({ scope: "local" })`).
- **[05.10.2026] Gizlilik ve hesap silme sayfaları yenilendi:** sayfa aşağı kaydırılamıyordu (kök `body` `overflow-hidden`); sayfalar artık kendi kaydırma alanında açılır. Yeni tasarım: sabit üst çubuk, hero, `/gizlilik` için bölüm içindekiler menüsü (mobilde gizli), kart bölümler; `/hesap-sil` için numaralı adımlar. Ortak iskelet: `src/components/legal/LegalShell.tsx`.
- **[05.10.2026] Gizlilik politikası ve hesap silme (Google Play):** herkese açık `/gizlilik` (Gizlilik Politikası) ve `/hesap-sil` (hesap/veri silme bilgisi) sayfaları eklendi (tr/en/de, giriş gerektirmez; `proxy.ts` istisnası). Profil sayfasının altında "Hesabı sil" bölümü: kullanıcı e-postasını yazarak onaylar, `delete-account` Edge Function'ı hesabı ve bütün işletme verisini kalıcı siler. Giriş sayfasına Gizlilik Politikası bağlantısı. Play Console URL'leri: `https://flow.workigom.com/gizlilik`, `https://flow.workigom.com/hesap-sil`.
## 📌 Son Güncellemeler

- **[05.10.2026] Anasayfa "Tüm Hesaplar" kartı yenilendi:** toplam takipçi ve değişim, platform dağılım çubuğu, hesap başına takipçi/değişim satırları (avatar + platform rozeti) ve "Ayrıntılı analiz" bağlantısı. Bileşen: `src/components/dashboard/SocialSummaryCard.tsx`.
## 📌 Son Güncellemeler

- **[05.10.2026] Özel rol silme:** × ile silmeden önce "silmek istediğinden emin misin?" onayı sorulur.
## 📌 Son Güncellemeler

- **[05.10.2026] Özel işletme rolü kartları:** AI Asistan > İşletme Rolü listesinin başına "Ekle" kartı geldi. Tıklayınca rol yazılır (ör. "Muhalif haber sayfası"), kart olarak listeye eklenir, seçilir ve kaydedilince asistan o iş koluna göre davranır; × ile silinir (en fazla 20 rol). Roller `custom_business_roles` tablosunda işletmeye özel tutulur (RLS, kimlik gönderilmez). Önceki serbest metin kutusu kaldırıldı.
## 📌 Son Güncellemeler

- **[05.10.2026] Paylaşım Merkezi:** "Ne paylaşalım?" kutusu kaldırıldı (içerik yalnız "İçerik Metni" alanından yazılır). Kullanılmayan `sharePage.contentInput` çevirileri silindi.
## 📌 Son Güncellemeler

- **[05.10.2026] Anasayfa fatura kartı yenilendi:** belge önizlemesi artık görünür (özel `finance_receipts` kovasından `finance-receipt-url` Edge Function'ı ile kısa ömürlü imzalı adres alınır; büyütmek için tıklanır), tutar vurgulu, ödeme/taslak rozeti, KDV ve fatura no, son ödemeye kalan gün. Bileşen: `src/components/dashboard/InvoiceCard.tsx`.
## 📌 Son Güncellemeler

- **[05.10.2026] Anasayfa sosyal özet:** "Tüm Hesaplar" takipçi istatistiği yanıtının biçimi değişmişti; bağlı hesaplar görünmüyordu. Artık eski ve yeni yanıt biçimleri okunuyor.

- **[05.10.2026] AI Asistan: serbest işletme rolü:** İşletme Rolü listesinin altına "Kendi iş kolunu yaz" alanı eklendi (en çok 60 karakter, tek satır; mobildeki "Diğer" ile aynı: `business_role` ham metin). Asistan artık işletmenin gerçek adını (`organizations.name`) biliyor ve başka ad uydurmuyor; giden DM'lerin gelen kutusunda çift görünmesi giderildi (sunucu tarafı).

- **[04.10.2026] Flow AI düğmesi mobille birebir:** 138x52 koyu hap, dönen neon (cyan → mor → kırmızı) halka, mavi parlama, "Flow Ai" etiketi; mobildeki gibi sürüklenebilir. Panelde de mobildeki "düşünüyor" nokta animasyonu ve sparkles avatarı kullanıldı.

- **[04.10.2026] Flow AI web paneli (FA-W):** panel dashboard'un tüm sayfalarında sağ altta açılır; mobildeki Flow AI ile aynı sunucuyu (`flow-ai-agent`, `client: "web"`) kullanır. Sohbet, ekrana yönlendirme (`open_screen` → web yolları), proaktif öneri kartları ve onaylı yayın/zamanlama kartı (Onayla/Vazgeç) vardır. Vurgu, rehber modu ve taslak aracı webde yoktur. Metinler `flowAi.*` (tr/en/de).

- **[04.10.2026] Sosyal Medya sayfasına asistan şalteri:** mobildeki "Sosyal Medya Asistanı" şalteri web Sosyal Medya sayfasına eklendi (`bot_settings.social_bot_active`; Ana Sayfa'dan kapatılmışsa pasif görünür). Metinler `sosyalMedyaPage.assistant.*` (tr/en/de).

- **[04.10.2026] WAHA işlemleri sunucuya taşındı:** `src/actions/waha.ts` artık WAHA'ya doğrudan bağlanmaz; sunucudaki `waha-session` Edge Function'ını çağırır (durum, başlat, QR, eşleştirme kodu). WAHA adresi ve yönetici anahtarı bu depodan **tamamen kaldırıldı** (önceden kodda varsayılan anahtar vardı). Askıda/banlı hesap yeni WhatsApp oturumu açamaz (`common.serverErrors.wahaAccountNotActive`, tr/en/de).

- **[04.10.2026] Paylaşım Merkezi video yükleme düzeltmesi:** video, depolamaya her zaman `image.jpg` adı ve `image/jpeg` türüyle yükleniyordu; bu yüzden YouTube'a "videoya ihtiyaç var" hatası dönüyordu. Artık tür dosyadan okunur: video orijinal türü/uzantısıyla (sıkıştırılmadan), görsel sıkıştırılıp `.jpg` olarak yüklenir; `mediaItems` içine `type`/`mimeType` eklenir.

### [04.10.2026] Faz F4-1 — İstemci artık kimlik göndermiyor
- Randevu, müşteri/hizmet, takvim, bot ayarları, AI kişilik ayarları ve gelen kutusu günlüklerinde `merchant_id` / `organization_id = session.user.id` filtreleri ve yazma alanları **kaldırıldı**. İşletme kimliği veritabanında çözülür: RLS satırları kapsar, yazılan satırların `org_id` sütunu `DEFAULT current_org_id()` ile dolar (`src/lib/org.ts` → `getCurrentOrgId`, silme/toplu güncelleme gibi filtre gereken yerlerde).
- `organization_ai_settings` upsert çakışma anahtarı `merchant_id` → `org_id`. `getBusinessServices()` / `createBusinessService(formData)` artık kimlik parametresi almaz. `RandevuClient` prop'u `merchantId` → `orgId` (realtime filtresi `org_id=eq.…`).
- Bilerek DOKUNULMADI: `persona-test` çağrısındaki `merchantId` (fonksiyon canlıda eski paketle çalışıyor, deploy edilmeyecek) ve `waha.ts` içindeki WAHA oturum adı (`user.id`; değişirse canlı WhatsApp oturumları kopar).

- **[03.10.2026] Paylaş ekranı metin üretimi tek servise taşındı:** AI içerik metni artık `flow-caption` Edge Function'ını (JWT'li) çağırır; mobil AI Üretim ile aynı servis ve aynı kurallar (persona tonu, platform karakter sınırı, günlük sınır, kullanım ölçümü). Metin girişinin altına kapsam notu eklendi: AI içerik metni yalnızca ürün fotoğrafları ve reklam gönderileri içindir, videolarda çalışmaz (video seçiliyken not amber/kalın görünür). Çeviriler `sharePage.captionEditor.aiCaptionNote` ve `sharePage.errors.captionLimit` (tr/en/de).
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
1. **Gelen Kutusu Silinen Yorumlar Senkronizasyonu:** Silinen yorumlarin Supabase realtime sync dongusu ve edge function tarafindan tekrar getirilip geri gelmesi sorunu Web versiyonu (page.tsx) icinde de cozuldu. Silinen zernio_comment_id'ler `ai_communication_logs` tablosunda zernio_deleted_comment platform markasi ile loglanip Web frontend tarafinda listeleme yapilmadan once filtrelenmesi saglandi.

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

```text
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

## Son Guncellemeler

### [06.09.2026] Uluslararasılaştırma (i18n) — Faz 4: Server Action Hata Mesajları

**Tetikleyici:** Faz 3 raporunda `src/actions/*.ts` tamamen kapsam dışı bırakılmıştı ("server-side loglama, kullanıcıya doğrudan gösterilmiyor" varsayımıyla). Bu varsayım kısmen yanlıştı: dosyalar tekrar tarandığında, bazı server action'ların döndürdüğü `{success:false, error:'...'}` hata mesajlarının aslında ilgili client component'lerin `alert()`/toast'larına doğrudan yansıdığı (örn. `AiDataResetPanel.tsx`'in zaten çevrilmiş `"Error: {error}"` şablonunun içine ham Türkçe metin enjekte etmesi) görüldü. Kullanıcı bunu küçük, hedefli bir Faz 4 olarak tamamlamayı onayladı.

**Kapsam:** 13 dosyalık `src/actions/` klasörü tek tek tarandı; gerçekten kullanıcıya gösterilen, hardcoded Türkçe hata metni taşıyan **4 dosya** bulundu: `resetAiData.ts`, `waha.ts`, `zernio.ts`, `customers.ts`. (`aiPersonaSettings.ts` dahil incelenen diğer 9 dosyadaki hata mesajları zaten İngilizce/teknik idi — "Unauthorized", "DB Error: ...", "Unhandled Exception: ..." gibi geliştirici odaklı loglama metinleri — kasıtlı olarak dokunulmadı.)

**Mimari çözüm:** next-intl'in Server Component'lerde zaten kullanılan `getTranslations()` fonksiyonu (`next-intl/server`), Server Action'ların da aynı istek bağlamını (cookie'den okunan `NEXT_LOCALE`) paylaştığı için buralarda da sorunsuz çalışıyor — ayrı bir mimari yapıya gerek kalmadan aynı desen uygulandı: her exported fonksiyonun başında `const t = await getTranslations()`, hardcoded string'ler yerine `t('common.serverErrors.*')` çağrıları.

**Eklenen çeviriler:** `messages/{tr,en,de}.json`'a yeni `common.serverErrors` alt-namespace'i (`sessionNotFound`, `unknownError`, `noOrganization`, `zernioProfileSlotFailed`, `wahaSessionInfoUnavailable`, `wahaAutoHealFailed`, `wahaStartFailed`, `wahaQrFailed`, `wahaPairingCodeFailed` — 9 anahtar, WAHA/Zernio entegrasyonlarındaki tüm oturum/bağlantı hatalarını kapsar) ve `musteriler.unnamedCustomer` (isimsiz müşteri kaydı için görüntü adı fallback'i, `getCustomers()`'ta `customer.name || t(...)` deseninde kullanılıyor).

**Doğrulama:** 4 dosyadaki tüm `t('...')` çağrıları (10 farklı anahtar) çıkarılıp üç `messages/*.json` dosyasının da bunları içerdiği programatik olarak teyit edildi; dosyalarda kalan hiçbir hardcoded Türkçe literal olmadığı regex ile doğrulandı.

### [06.09.2026] Uluslararasılaştırma (i18n) — Faz 3: Kalan ~25 Dosyanın Tam Çevirisi ve Locale/₺ Temizliği

**Tetikleyici:** Faz 2 raporunun sonunda kapsam dışı bırakılan geri kalan hardcoded Türkçe sayfalar/bileşenler ve hardcoded `tr-TR` locale çağrıları için kullanıcı doğrudan talimat verdi: **"Tek seferde tam kapsamlı devam et"** — yani ayrı ayrı dalgalar halinde değil, kalan tüm dosyaların tek seferde bitirilmesi istendi.

**Kapsam ve yöntem:** Toplam 25 dosya (sayfa + bileşen), 9 paralel ajan tarafından, her biri çakışmayan bir `messages/{tr,en,de}.json` namespace'ine önceden atanarak çevrildi; sonra tüm çeviriler merkezi olarak tek bir merge script'i ile birleştirildi ve merge sonrası her dosyadaki **tüm** `t('...')` çağrıları programatik olarak taranıp üç dilin de (tr/en/de) karşılık gelen anahtara sahip olduğu doğrulandı (549 farklı anahtar, sıfır eksik).

**Yeni eklenen namespace'ler (`messages/{tr,en,de}.json`):** `aiAsistanPage`, `aiAsistanComponents` (LiveTestPanel), `hizmetAyarlari`, `randevuPage`, `aiMuhasebePage` (page/isletmem/muhasebecim/odeme-takvimi ortak), `veriGirisiPage`, `musteriler`, `profilPage`, `loginPage`, `analizPage`, `analizDetay`, `gelenKutusuPage`, `sosyalMedyaPage`, `sosyalMedyaInbox`, `postsPage`, `sharePage`, `dashboardHome`, `cropperModal`, `aiChatInput`, `aiDataResetPanel`.

**Değiştirilen dosyalar:** `ai-asistan/page.tsx`, `ai-asistan/randevu/RandevuClient.tsx`, `ai-asistan/isletme-hizmetleri/{page.tsx,HizmetAyarlariClient.tsx}`, `components/ai-asistan/LiveTestPanel.tsx`, `ai-muhasebe/{page,isletmem/page,muhasebecim/page,odeme-takvimi/page,veri-girisi/page}.tsx`, `musteriler/{page.tsx,MusterilerClient.tsx}`, `profil/page.tsx`, `login/page.tsx`, `analiz/{page.tsx,gelen-mesaj-analizi/page.tsx}`, `gelen-kutusu/page.tsx`, `sosyal-medya/{page,inbox/page,posts/page,share/page}.tsx`, `page.tsx` (dashboard ana sayfa), `components/CropperModal.tsx`, `components/chat/AiChatInput.tsx`, `components/settings/AiDataResetPanel.tsx`.

**Locale (`tr-TR`) temizliği:** Faz 1 denetiminde tespit edilen tüm hardcoded `.toLocaleString('tr-TR', ...)` / `.toLocaleDateString('tr-TR', ...)` çağrıları (dashboard ana sayfa, ai-muhasebe/page.tsx, odeme-takvimi/page.tsx, gelen-kutusu/page.tsx, sosyal-medya/inbox/page.tsx — toplam 20 çağrı, 7 dosya) `useLocale()`'den gelen aktif dile göre dinamikleşti. Artık örneğin İngilizce seçiliyken tarih/sayı formatları `en-US` kurallarına göre gösteriliyor.

**₺ (Türk Lirası) sembolü kararı — kasıtlı olarak DEĞİŞTİRİLMEDİ:** Tüm sayfalarda (14 kullanım, 4 dosya) `₺` sembolü aynen bırakıldı. Gerekçe: platformun gerçek işi TRY cinsinden gerçekleşiyor (ABD merkezli bir uygulamanın "$" sembolünü dil değişse bile korumasıyla aynı mantık) — sadece etraftaki sayı biçimlendirmesi (binlik/ondalık ayraç) dile göre değişiyor, para birimi sembolünün kendisi değil.

**Server/Client Component ayrımı:** Her dosya için `"use client"` direktifinin varlığına bakılarak doğru desen seçildi — Server Component'ler `next-intl/server`'dan `getTranslations()` ile `async` yapıldı (örn. `musteriler/page.tsx`, `analiz/gelen-mesaj-analizi/page.tsx`), Client Component'ler `useTranslations()` kullandı.

**Doğrulama:** Merge sonrası yazılan bir Python script'i, değiştirilen 25 dosyanın tamamını tarayıp içindeki her statik `t('namespace.key')` çağrısını çıkardı (549 farklı anahtar) ve üç `messages/*.json` dosyasının da bu anahtarların tümünü içerdiğini teyit etti (sıfır eksik anahtar). Ayrıca `analiz/page.tsx`'teki dinamik anahtar deseni (`t(\`analizPage.timeRanges.\${TIME_RANGE_KEY_BY_ID[tr.id]}\`)`, Faz 2'deki persona id/label ayrımıyla aynı desen) elle doğrulandı.

**Bilinen kapsam dışı (bilinçli olarak bırakıldı):** `src/actions/*.ts` (server action'lardaki hata mesajları — sunucu tarafı loglama/response metinleri, kullanıcıya doğrudan UI olarak gösterilmiyor), `ledger` reposu (Türk vergi mevzuatına özgü, uluslararası vizyonu yok — Faz 1'den beri kapsam dışı).

### [06.09.2026] Uluslararasılaştırma (i18n) — Faz 2: AI Kişiliği Rol/Üslup Etiketlerinin id/label Ayrımı

**Tetikleyici:** Faz 1 raporunda mimari bir engel (blocker) olarak işaretlenmişti: `AICharacterPanel.tsx` içindeki `ROLES`/`TONES` sabitlerinde `id === label` (Türkçe) — yani "Kebapçı", "Standart" gibi değerler hem ekranda gösterilen metin hem de `organization_ai_settings.business_role`/`.tone` kolonlarına yazılan ham veriydi. Kullanıcı bu engelin çözümünü doğrudan iki örnekle talimatlandırdı: İngilizce'de "Standart" → **"Standard"**, "Kebapçı" → **"Turkish Kebab"** olmalı. Bu, geri kalan 13 rol ve 8 üslup için de aynı desenin uygulanmasını gerektirdi.

**Mimari çözüm — id sabit, label çeviriden üretiliyor:** `AICharacterPanel.tsx`'e `ROLE_KEY_BY_ID`/`TONE_KEY_BY_ID` adında sabit bir id→i18n-anahtarı eşlemesi eklendi (ör. `"Kebapçı" → "kebapci"`). `ROLES`/`TONES` sabitlerindeki `id` değerleri **hiç değiştirilmedi** (mevcut kayıtlı `organization_ai_settings` satırları ve mobil tarafla parite bozulmasın diye). Bileşen artık render sırasında `useTranslations()` ile bu eşlemeyi kullanarak `personas.roles.*` / `personas.tones.*` çevirilerinden gösterilecek `label`'ı üretiyor; `RoleCarousel`/`ToneCarousel`/`PillGroup` gibi tüketici bileşenlerde hiçbir değişikliğe gerek kalmadı (zaten sadece `.label`'ı düz metin olarak basıyorlar).

**Eklenen çeviriler (`messages/{tr,en,de}.json` → yeni `personas` namespace'i):**
- `personas.sectionLabels.*` — "AI Kişiliği", "İŞLETME ROLÜ", "KARAKTER", "ÜSLUP", "KARAKTER AYARLARI" başlıkları.
- `personas.sliders.*` — "Karakter Yoğunluğu", "Mizah Seviyesi", "Modern Uyarlama" kadran etiketleri.
- `personas.roles.*` (15 rol) ve `personas.tones.*` (9 üslup) — İngilizce örnekler: Kebapçı → Turkish Kebab, Standart → Standard, Berber → Barber, Restoran → Restaurant, Diş Kliniği → Dental Clinic, Huysuz → Grumpy, vb. Almanca: Kebapçı → Kebap-Imbiss, Berber → Friseur, vb.
- `personas.standardCard.*`, `personas.loading`, `personas.empty` — `PersonaCarousel.tsx`'teki ayrı, sabit "Standart" karakter kartının (label/description/title) ve yükleniyor/boş liste metinlerinin çevirisi (bu, ÜSLUP'taki "Standart" tondan farklı, KARAKTER bölümündeki ayrı bir "kişilik yok" kartıydı — aynı desen orada da uygulandı).

**Değiştirilen dosyalar:** `src/components/ai-asistan/AICharacterPanel.tsx`, `src/components/ai-asistan/PersonaCarousel.tsx`, `messages/tr.json`, `messages/en.json`, `messages/de.json`.

**Çapraz platform notu (AGENTS.md kuralı gereği):** `organization_ai_settings.business_role`/`.tone` mobil (`flow`) tarafından da okunup yazıldığı için, mobildeki `BotYonetimiScreen.js`'in aynı rol/üslup listelerini gösterdiği `flow-repo/src/modules/persona_engine/domain/config/{roles,moods}.ts` dosyalarına da birebir aynı çözüm (id sabit, `title` yerine i18n çevirisinden üretilen label) uygulandı — bkz. `flow/README.md`'deki eşleşen Faz 2 girdisi. İki repo aynı id kümesini ve aynı İngilizce/Almanca çevirileri paylaşıyor.

**Bilinen kapsam dışı:** Bu tur sadece AI Kişiliği panelindeki rol/üslup etiketlerini kapsıyor. Faz 1 raporunda listelenen ~35-40 dosyadaki diğer hardcoded Türkçe metinler, 13 hardcoded `tr-TR` locale çağrısı ve 7+ hardcoded `₺` sembolü hâlâ bekliyor.

### [05.09.2026] Uluslararasılaştırma (i18n) — Faz 1: next-intl Altyapısı, Otomatik Dil Algılama, Sidebar/Header Çevirisi

**Tetikleyici:** Platform uluslararası kullanıcılara açılacağı için, kullanıcının açık talebi üzerine ("otomatik dil algılaması olmalı ve tüm arayüz İngilizceye/başka dillere kolay çevrilebilmeli") `flow`, `flowweb` ve `ledger` repoları i18n hazırlığı açısından denetlendi (tam denetim raporu `flow/README.md`'de). Bu depo (`flowweb`) denetim öncesinde **sıfır** i18n altyapısına sahipti — `<html lang="en">` bile içerikle uyumsuzdu (her şey Türkçe), tarayıcı dili algılama yoktu, ~500-650 hardcoded Türkçe string ~35-40 dosyaya yayılmıştı.

**Mimari karar — URL öneki yok, çerez tabanlı dil:** Bu panel girişli bir dashboard (`/login` hariç SEO'ya duyarlı hiçbir sayfa yok — `src/proxy.ts` zaten girişsiz her isteği `/login`'e yönlendiriyor), o yüzden `/en/...`, `/de/...` gibi URL önekleri eklemek yerine `next-intl`'in **"without i18n routing"** modu kullanıldı: dil bir `NEXT_LOCALE` çerezinde tutuluyor, URL yapısı ve mevcut Türkçe route slug'ları (`/ai-muhasebe`, `/sosyal-medya` vb.) hiç değişmedi.

**Eklenen/değişen dosyalar:**
1. `package.json` — `next-intl` bağımlılığı eklendi.
2. `next.config.ts` — `createNextIntlPlugin` ile sarmalandı.
3. `src/i18n/request.ts` (yeni) — dil çözümleme mantığı: (1) kullanıcının daha önce manuel seçtiği dil varsa (çerez) o kazanır, (2) yoksa tarayıcının `Accept-Language` başlığından otomatik algılama yapılır, (3) o da yoksa `tr` varsayılanına düşülür (mevcut içeriğin büyük çoğunluğu henüz sadece Türkçe olduğu için varsayılan bilinçli olarak `tr` seçildi, `en` değil).
4. `messages/{tr,en,de}.json` (yeni) — ilk namespace'ler: `common` (dil seçici metinleri, "Pro Plan", "Çıkış Yap"), `nav` (Sidebar menü etiketleri), `header` (sayfa başlıkları).
5. `src/actions/locale.ts` (yeni) — `setLocale()` server action'ı, seçilen dili `NEXT_LOCALE` çerezine yazar (1 yıl kalıcı).
6. `src/components/layout/LanguageSwitcher.tsx` (yeni) — TR/EN/DE arası anlık geçiş yapan, seçili dili vurgulayan küçük bir buton grubu. `src/components/layout/Sidebar.tsx`'in alt kısmına (her sayfada görünür, global chrome) eklendi.
7. `src/app/layout.tsx` — `NextIntlClientProvider` ile sarmalandı, `<html lang="en">` (yanlış/hardcoded) yerine gerçek çözümlenen dile göre dinamik `lang` attribute'u.
8. `src/components/layout/Sidebar.tsx` ve `Header.tsx` — **ilk tam çevrilen dosyalar (kanıt niteliğinde):** nav menü etiketleri, "Pro Plan", "Çıkış Yap", sayfa başlıkları artık `useTranslations()` üzerinden geliyor; `Header.tsx`'teki hardcoded `toLocaleDateString("tr-TR", ...)` çağrısı `useLocale()`'den gelen dile göre dinamikleşti (İngilizce'de "Friday, September 5, 2026" gibi doğru biçimleniyor).

**Bu turda bilinçli olarak ele alınmayan, sonraki dalgaya bırakılan bulgular (flow/README.md'deki tam denetimden):**
- Geri kalan ~35-40 dosyadaki (en yoğunları: `gelen-kutusu/page.tsx` 1105 satır, `sosyal-medya/share/page.tsx` 806 satır, `ai-asistan/page.tsx` 711 satır) hardcoded Türkçe metinler henüz çevrilmedi — yeni bir dil seçildiğinde şu an sadece Sidebar/Header İngilizce/Almanca olur, sayfa içerikleri hâlâ Türkçe görünür (bu beklenen ara durumdur, hata değildir).
- **Kritik mimari engel, bir sonraki dalgadan önce çözülmeli:** `src/components/ai-asistan/AICharacterPanel.tsx`'teki AI persona rol/ton dizileri (`ROLES`, `TONES` — örn. `{ id: "Kebapçı", label: "Kebapçı" }`) hem görünen etiket hem de `organization_ai_settings.business_role`/`.tone` sütunlarına yazılan veri anahtarı olarak aynı Türkçe string'i kullanıyor. Bu metinleri doğrudan çevirmek, veritabanındaki kayıtlı verileri ve mobil ile paylaşılan AI prompt mantığını bozar — önce stabil bir `id` (değişmez, Türkçe kalabilir) / `labelKey` (çevrilebilir) ayrımı yapılmalı.
- 19 yerde `.toLocaleDateString('tr-TR', ...)` gibi hardcoded locale çağrısı ve 7+ yerde hardcoded `₺` sembolü hâlâ duruyor (Header.tsx dışındakiler).
- `sosyal-medya/posts/page.tsx` gibi bazı dosyalarda İngilizce tablo başlıkları ile Türkçe alert mesajları karışık halde — mekanik bir "her string'i çevir" yaklaşımı yerine dosya dosya değerlendirme gerekiyor.

### [28.08.2026] Web ve Mobil "Canli Test" (AI Asistan) Esitlemesi ve Edge Function Onarimi
1. **Canli Test Web Entegrasyonu:** Web (Next.js) arayuzundeki `ai-asistan/page.tsx` icerisindeki statik Canli Test tasarimi, dinamik bir chat uygulamasina donusturuldu.
2. **Edge Function (Gemini) Uyumu:** Mobil uygulamada (`usePlayground.ts`) kullanilan `gemini-chat` Supabase Edge Function API yapisi incelenerek, web tarafindaki istek yapisi da mobil ile ayni standarda (`mode: 'playground'`) getirildi.
3. **Ai Muhasebe (Ledger) Edge Function Duzeltmesi:** `gemini-chat` Edge Function'inin (`ledger` deposunda yer alan) gelen tum istekleri (mode fark etmeksizin) fatura formatinda (Ai Muhasebe) JSON olarak yanitladigi fark edildi. Fonksiyon onarilarak `mode === 'playground'` durumunda normal sohbet (chat) donecek sekilde guncellendi ve deploy edildi.
4. **Proje Hafizasi Guncellemesi:** Web ve Mobil projelerin klasor dizinleri sistem hafizasina (AGENTS.md) islendi.

### [31.08.2026] AI Asistan Randevu ve K�lt�rel Hitap Mod�lleri (TAM PAKET)
1. **M��teri Tan�ma (CRM):** AI'nin tekrar eden m��terileri tan�mas� ve isimlerini `customers` tablosuna kaydetmesi/okumas� sa�land�. Flowweb'de `M��teriler` (CRM) sayfas� olu�turuldu.
2. **K�lt�rel Hitap Entegrasyonu:** `SYSTEM_POLICY` �zerinden dil/cinsiyet bazl� hitap yetene�i (�r. 'Volkan Bey', 'Ay�e Han�m') kazand�r�ld�.
3. **Randevu Mod�l� Kapatma/A�ma:** Flowweb'de Randevu �zelli�ini a��p kapatmak i�in Toggle eklendi.
4. **Randevu G�ncelleme (Reschedule):** Mevcut randevu saatinin g�ncellenebilmesi i�in `updateAppointmentDateTime` fonksiyonu ve `UpdateAppointmentTool` yaz�ld�.
5. **��letme Bildirimleri:** Randevu i�lemlerinde `notifications` tablosuna kay�t d��mesi sa�land�.
6. **Bug D�zeltmeleri:** Vercel TypeScript hatalar� (`createClient`) ve Edge Function syntax hatalar� giderildi.
7. **RAG/Drive Ertelemesi:** Drive/RAG geli�tirmelerinin �imdilik durduruldu�u notu eklendi.


### [01.09.2026] Mobil ve Web Modüllerinde Tasarım Eşitlemesi, CRM Entegrasyonu ve Bug Fix'ler
1. **Flow Mobil (React Native) - Müşteriler (CRM) Modülü:** Web tarafındaki "Müşteriler" mantığı mobil tarafa Clean Architecture ile (domain/entities/Customer, ICustomerRepository, SupabaseCustomerRepository) eklendi. Müşteriler, Supabase üzerinden customers ve `appointments` join'lenerek ekranda listelendi. MusterilerScreen.js oluşturulup TabNavigator'a bağlandı.
2. **Flow Mobil - Kırık Import ve Bundle Crash Çözümleri:** WahaService.ts içindeki bozuk @infrastructure/api/supabaseClient importu düzeltilerek Metro Bundler'ın çökmesi (App.js bundling failed) giderildi. Ayrıca OAuth Redirect Uri config ayarları güncellenerek Supabase Whitelist sorunları etrafından dolaşıldı.
3. **Flow Mobil - Master AI Toggle Kaldırılması:** BotYonetimiScreen.js'deki ana AI aç/kapat şalteri UI üzerinden kaldırılarak, alt platform (WhatsApp) şalterlerinin her zaman aktif görünebilmesi sağlandı.
4. **Flow Web (Next.js) - Takvim Saat Dilimi Bug Fix:** RandevuClient.tsx'in kullandığı sayfa seviyesindeki (page.tsx) `today` değişkeni UTC olduğu için gece saatlerinde takvimi önceki günde (ör: hala Ağustos) göstermesine sebep oluyordu. Bu, yerel saat dilimi offset'i kullanılarak düzeltildi.
5. **Flow Web - Randevu Ekranı Tasarımının Mobile Eşitlenmesi:** Web'deki iki sütunlu randevu takvimi ve yoğunluk haritası düzeni `flex-direction`: column ile tek sütun yapıldı. **Takvim** üstte, **Günlük Yoğunluk Haritası (Müsaitlik)** ortada ve **Randevu Listesi** en altta olacak şekilde dikey olarak sıralandı.
6. **Flow Web - Takvim Scroll UX İyileştirmeleri:** Takvim ve Yoğunluk Haritası container'larına yatay kaydırma çubuklarını gizleyen CSS sınıfları eklendi. overscroll-behavior-x: contain eklenerek sağa-sola swipe yaparken tüm ekranın kayması (swipe to go back veya page scroll) engellendi, native mobil hissi yaratıldı.
7. **Flow Web - Ülke Listesi Dropdown Renk Düzeltmesi:** Profil ekranındaki ülke, şehir, ilçe <select> etiketlerindeki <option>'ların varsayılan beyaz/açık renk arka planları #17151A olacak şekilde güncellenerek, üzerine gelen beyaz metinlerin okunamaması sorunu (koyu tema uyumsuzluğu) çözüldü.

### [03.09.2026] Zernio Sosyal Medya Hesap Bağlama Zinciri — Uçtan Uca Onarım (Organizasyon, RPC, Şema İzinleri, Kod)

**Rapor edilen sorun:** Kullanıcı flow.workigom.com üzerinden WhatsApp/Facebook hesabı bağlamayı denedi; önce "Hesap bağlama linki alınırken bir hata oluştu" hatası, sonra (kısmen düzeltildikten sonra) "Facebook'u bağladım ama Eklediğiniz Hesaplarınız listesi güncellenmedi" şikayeti geldi. Kök neden araştırması canlı veritabanı (Supabase) üzerinde doğrudan sorgularla ve gerçek tarayıcı testleriyle yapıldı; sırayla **4 ayrı, birbirinin üstünü örten hata** bulunup düzeltildi:

1. **Organizasyon eksikliği (403 "Kullanıcı herhangi bir organizasyona bağlı değil"):** `handle_new_user()` tetikleyicisi sadece `public.profiles` satırı oluşturuyordu, hiçbir kullanıcı için `organizations`/`organization_members` satırı açmıyordu. Sistemdeki 8 kullanıcıdan 7'si (proje sahibi hariç) bu yüzden Zernio'ya hiç bağlanamıyordu. **Düzeltme:** `20260903120000_backfill_organizations_for_solo_users.sql` — mevcut kullanıcılar için geriye dönük organizasyon oluşturuldu, tetikleyici yeni kullanıcılar için de otomatik organizasyon açacak şekilde güncellendi.
2. **RPC izin hatası (42501 "permission denied for schema integration"):** `resolve_zernio_profile_for_platform` fonksiyonu `SECURITY DEFINER` değildi; PostgREST üzerinden `service_role` ile çağrıldığında `integration` şemasına erişim yetkisi olmadığından patlıyordu. **Düzeltme:** `20260903123000_fix_resolve_zernio_profile_schema_perms.sql` — fonksiyona `SECURITY DEFINER SET search_path = integration, public` eklendi (projedeki `get_active_social_accounts_for_sync()` ile aynı desen).
3. **`integration` şeması için temel GRANT'ların hiç verilmemiş olması:** RLS politikaları (`Users can view social_accounts of their organization` vb.) doğru yazılmıştı, ama `service_role` ve `authenticated` rollerine `integration` şemasında `USAGE`, tablolarda `SELECT/INSERT/UPDATE/DELETE` izni **hiç verilmemişti**. Bu, `.schema('integration').from(...)` ile yapılan HER doğrudan sorgunun (RLS'den bağımsız olarak) "permission denied for schema integration" ile patlamasına neden oluyordu — hem `zernio-client`'ın hesap senkronizasyonu hem de zaten var olan `analiz` sayfası ve `zernio-webhook` için. **Düzeltme:** `20260903190000_grant_integration_schema_access.sql`.
4. **Kod: `public` ve `integration` şeması karışıklığı (asıl "hesap listede görünmüyor" hatası):** `zernio-client/index.ts` içindeki hesap senkronizasyonu (`sync-accounts`), gönderi paylaşma (`create-post`), mesaj/yorum yanıtlama (`send-message`, `reply-comment`, `send-private-reply`) ve bağlantı kesme işlemleri hâlâ eski, tekli-profil dönemi kalıntısı olan `public.social_accounts` tablosunu (`profile_id` sütunu ile) hedefliyordu; oysa güncel çoklu-profil mimarisi (bkz. AGENTS.md "Zernio Profile ↔ Workigom Organization") `integration.social_accounts`'u (`organization_id` sütunu ile) kullanıyor. Sonuç: senkronizasyon her zaman sessizce boş dönüyordu (`integration.zernio_profiles` sorgusu da aynı şema eksikliğinden hep boş geliyordu), yeni bağlanan hiçbir hesap hiçbir zaman veritabanına yazılmıyordu. **Düzeltme:** `zernio-client/index.ts` (ledger reposu) ve `sosyal-medya/page.tsx`, `sosyal-medya/share/page.tsx`, `actions/social.ts` (flowweb) içindeki tüm `social_accounts` erişimleri `integration` şemasına ve `organization_id`/`username`/`is_active` sütunlarına taşındı.

**Doğrulama:** Canlı tarayıcıda (kullanıcı oturum açmış haldeyken) WhatsApp bağlama akışı test edildi — Meta'nın gerçek WhatsApp Business Embedded Signup ekranına kadar sorunsuz ulaşıldı. Facebook OAuth sırasında görülen "HTTP_TRANSPORT_ERROR" ayrı, yerel internet kesintisinden (`net::ERR_INTERNET_DISCONNECTED`) kaynaklanan, kodla ilgisi olmayan geçici bir durumdu.

**Not:** Bu onarımdan sonra ilk gerçek hesap bağlama denemesinde AI asistanın yeni bağlanan hesap üzerinden de (WAHA'daki gibi standart şekilde) mesajlara yanıt verdiği ayrıca doğrulanmalı — `HandleIncomingMessageUseCase.ts`'teki `zernioAccountId` bulma sorgusu da bu düzeltmenin bir parçası olarak `integration.social_accounts`'a taşındı.

### [05.09.2026] Zernio Admin Paneli — Profil İsimlerinin İnsan-Okunur Hale Getirilmesi (`wg_{orgId}_{slot}` → "İşletme Adı — email")

**Rapor edilen sorun:** Yukarıdaki 6 zincir hatası da çözülüp hesap bağlama tamamen sorunsuz çalışır hale geldikten sonra, kullanıcı Zernio'nun kendi admin panelindeki (zernio.com/dashboard) profil seçici listesinin kriptik teknik isimlerle (`wg_84c54c33-40b4-45fa-a0cc-bb424f3f4609_1`, eski dönemden kalma `User_aa524f52-fe6...` gibi) dolu olduğunu, bunun da kötü niyetli/sorunlu bir kullanıcıyı bulup banlamak veya anlık oturumunu kapatmak istediğinde hangi profilin hangi gerçek Workigom işletmesine/kullanıcısına ait olduğunu ayırt etmesini çok zorlaştırdığını bildirdi.

**Kök neden:** `zernio-client/index.ts`'teki `get-connect-url` case'i, yeni bir Zernio profili oluştururken ismi tamamen deterministik-ama-okunaksız bir teknik anahtardan (`wg_${orgId}_${slot}`) üretiyordu. Bu isim sadece 409 "profil adı çakışması" hatasını (bkz. 5. Zincir Hatası) önlemek için tasarlanmıştı; hiçbir admin-okunabilirlik kaygısı yoktu. Zernio tarafında profilin `name` alanı bizim kendi veritabanımızdaki hiçbir kayıtla eşleşmiyor (biz sadece dönen `zernio_profile_id`'yi saklıyoruz), bu yüzden bu alanı değiştirmek mevcut hiçbir bağlama/senkronizasyon mantığını bozmuyor.

**Çözüm:**
1. **`zernio-client/index.ts`'e yeni `buildReadableProfileLabel(orgId, profileSlot)` yardımcı fonksiyonu eklendi.** Bu fonksiyon organizasyonun sahibi olan kullanıcının `profiles.business_name` (yoksa `organizations.name`'e düşer) ve `profiles.email` bilgilerini okuyup `"İşletme Adı — email"` formatında bir etiket üretir (örn. `"Hamurcu lahmacun — workigom.com@gmail.com"`). Aynı organizasyonun birden fazla Zernio profil slotu varsa (çoklu hesap mimarisi), çakışmayı önlemek için sona `(#slot)` eklenir — email zaten kullanıcı bazında benzersiz olduğundan tek-slotlu (yaygın) durumda ek bir UUID/suffix'e gerek kalmadı, isim admin için temiz kalıyor.
2. **`get-connect-url`'ün `is_new` dalı** artık yeni profil oluştururken `wg_${orgId}_${slot}` yerine bu okunur etiketi kullanıyor; `Idempotency-Key` (409 koruması) ve profil oluşturma/DB'ye yazma akışının geri kalanı hiç değişmedi.
3. **`ProfileApi.ts`'e yeni `updateProfile(profileId, name)` metodu eklendi** (Zernio Node SDK'sının `PUT /v1/profiles/{profileId}` endpoint'ini sarmalıyor).
4. **Mevcut 2 canlı profilin geriye dönük düzeltilmesi için** yeni, ayrı bir admin/bakım fonksiyonu (`zernio-admin-rename-profiles`) yazılıp deploy edildi. Bu fonksiyon hiçbir dışarıdan parametre almaz — her zaman `integration.zernio_profiles` tablosundaki TÜM aktif profilleri okuyup yukarıdaki aynı etiketleme kuralıyla yeniden adlandırır; bu sayede tamamen idempotent'tir ve gelecekte yeni organizasyonlar eklendiğinde veya bir işletme adı/email değiştiğinde güvenle tekrar tekrar çalıştırılabilir. Bu fonksiyon çalıştırılarak mevcut 2 profil başarıyla yeniden adlandırıldı:
   - `84c54c33-...` (mehmet güleç) → `"mehmet güleç — manoliskotron@gmail.com"`
   - `c879d92b-...` (Hamurcu lahmacun) → `"Hamurcu lahmacun — workigom.com@gmail.com"`

**Doğrulama:** `zernio-admin-rename-profiles` fonksiyonu Supabase'in kendi `pg_net` uzantısı üzerinden tetiklenip yanıtı doğrulandı — her iki profil için de Zernio API'sinden `success: true` döndü. `zernio-client` v100 olarak deploy edildi (yeni `buildReadableProfileLabel` içeriyor).

**Not:** Legacy/artık kullanılmayan `User_aa524f52-fe6...` ve `User_AI_Esnaf_Shar...` profilleri bu kapsamın dışında bırakıldı (henüz temizlenmesi istenmedi) — istenirse ayrı bir adımda ele alınabilir.

### [05.09.2026] Zernio Hesap Bağlama — 6. Zincir Hatası: `sync-accounts`'ta Sütun Adı Uyumsuzluğu (`last_seen_at` vs `last_synced_at`) — "Senkronize Et" HİÇBİR ZAMAN Çalışmamış

**Rapor edilen sorun:** Yukarıdaki 5 hata da düzeltilip Instagram OAuth akışı gerçekten uçtan uca tamamlandıktan (Zernio'dan `account.connected` webhook'u bile alındı) SONRA bile, "Eklediğiniz Hesaplarınız" listesi hâlâ boş kalıyordu — ne "İzin ver" sonrası otomatik, ne de manuel "Senkronize Et" butonuna basınca. Kullanıcı canlı Chrome DevTools Network sekmesinde `zernio-client` isteğinin `200 OK` döndüğünü ve hatta anlamlı boyutta bir yanıt gövdesi taşıdığını doğruladı — yani Zernio'dan hesap verisi gerçekten geliyordu, ama veritabanına hiçbir şey yazılmıyordu.

**Kök neden:** `zernio-client/index.ts`'teki `sync-accounts` case'i, Zernio'dan çekilen hesapları `integration.social_accounts`'a yazarken şu alanı kullanıyordu: `last_seen_at: new Date().toISOString()`. Ancak tablonun gerçek sütun adı `last_seen_at` DEĞİL, `last_synced_at`. PostgREST, var olmayan bir sütuna yazma isteğini reddediyor — ama bu upsert çağrısının dönen `error` değeri hiç kontrol edilmiyordu (`await supabase...upsert(...)` — sonucu hiç yakalamadan). Sonuç: her "Senkronize Et" denemesi sessizce başarısız oluyordu, HTTP 200 dönüyordu, hiçbir konsol hatası basılmıyordu — bu yüzden bugüne kadarki hiçbir testte fark edilemedi. Muhtemelen bu tek sütun-adı yazım hatası, tüm bu araştırma boyunca "hesap bağlandı ama listede görünmüyor" şikayetinin en dipteki, en kalıcı nedeniydi; diğer 5 hata (şema/izin/409 vb.) düzeltilse bile bu yüzden hiçbir zaman hesap listeye düşmüyordu.

**Düzeltme:** `zernio-client/index.ts`, `sync-accounts` case'i — `last_seen_at` → `last_synced_at` olarak düzeltildi, ayrıca upsert çağrısının `error` sonucu artık yakalanıp `console.error` ile loglanıyor (gelecekte benzer bir sessiz başarısızlık anında fark edilebilsin diye). Bu düzeltme doğrudan Supabase'e deploy edildi (zernio-client v99); `ledger` reposundaki kaynağı da senkron.

**Ders:** Bundan sonra `.upsert()`/`.insert()`/`.update()` çağrılarının dönen `error` değeri MUTLAKA yakalanıp loglanmalı — aksi halde bir sütun adı yazım hatası gibi basit bir hata, günlerce "her şey 200 dönüyor ama veri yok" şeklinde teşhisi çok zor bir soruna dönüşebiliyor.

### [05.09.2026] Zernio Hesap Bağlama — 5. Zincir Hatası: `zernio_profiles` Kalıcılaştırma (Persist) Adımında Şema Eksikliği (409 "profile_name_conflict")

**Rapor edilen sorun:** Yukarıdaki 4 hata da düzeltilip Supabase Dashboard'daki "Exposed schemas" ayarına `integration` eklendikten SONRA bile, Instagram (org `84c54c33-...`) bağlamaya çalışırken hâlâ genel bir hata alınıyordu: `"Hesap bağlama linki alınırken bir hata oluştu: Sosyal medya entegrasyon servisinde bir hata oluştu."` Sunucu tarafı loglarında gerçek hata Zernio API'sinden dönen `409 "A profile with this name already exists"` (`profile_name_conflict`) idi.

**Kök neden zinciri:**
1. `zernio-client/index.ts`'teki `get-connect-url` case'i, `resolve_zernio_profile_for_platform` RPC'si `is_new: true` döndürdüğünde Zernio'nun API'sinde yeni bir profil oluşturuyor (`POST /api/v1/profiles`), sonra bu profilin gerçek `zernio_profile_id`'sini ve `status: 'active'` durumunu bizim veritabanımıza geri yazıyordu — **ama bu geri-yazma sorgusu da (satır ~185) `.schema('integration')` çağrısından yoksundu**, yani sessizce (nonexistent) `public.zernio_profiles`'a yazmaya çalışıp hiçbir etkisi olmadan geçiyordu.
2. Sonuç: Zernio tarafında profil başarıyla oluşturulmasına rağmen, bizim veritabanımızdaki ilgili `integration.zernio_profiles` satırı sonsuza kadar `status='provisioning', zernio_profile_id=NULL` durumunda "takılı" kalıyordu.
3. `resolve_zernio_profile_for_platform` fonksiyonunun "provisioning" fallback sorgusu sadece `profile_slot`/`id` seçiyor, var olan bir `zernio_profile_id`'yi hiç kontrol etmiyor/döndürmüyor — bu yüzden bu takılı satır için her seferinde `is_new: true` raporluyordu.
4. Bu da `zernio-client`'ı, Zernio'nun API'sinde **aynı deterministic isimle (`wg_{org_id}_{slot}`) ikinci bir profil daha oluşturmaya** zorluyordu — Zernio bunu, ilk oluşturmadaki idempotency-key önbelleği süresi dolduğunda `409 profile_name_conflict` ile reddediyordu. Bu durum, aynı organizasyon için ikinci bir platform (örn. Instagram, WhatsApp'tan sonra) bağlanmaya çalışıldığında ortaya çıkıyordu.

**Düzeltme:**
- `zernio-client/index.ts` (satır ~185): geri-yazma sorgusuna `.schema('integration')` eklendi, ayrıca hata durumunda sessiz kalmaması için `console.error` logu eklendi.
- `20260905050000_backfill_stuck_zernio_profile_ids.sql`: sistemde bu hatadan etkilenen (ve `function_logs`'tan gerçek Zernio profil ID'leri geri kurtarılan) her iki takılı satır (org `84c54c33-...` ve `c879d92b-...`) canlı veritabanında `status='active'` ve doğru `zernio_profile_id` ile düzeltildi (bu veri onarımı migration olarak canlıya zaten uygulandı; kod değişikliği sadece **yeniden oluşmasını** önlüyor).

**Doğrulama notu:** Bu, `.schema('integration')` eksikliği örüntüsünün (bkz. 03.09.2026 kaydı, madde 4) bulunan **5.** ve — kod tabanındaki tüm `.from('zernio_profiles')`/`.from('social_accounts')` çağrıları grep ile tek tek doğrulanarak — **sonuncusu** oldu.

### [02.09.2026] Persona Engine "Tek Yapı" Refaktörü — Kültürel/Dil Adaptasyonu Sunucuya Taşındı
1. **Kritik Bulgu:** Mobildeki "İleri Seviye Ayarlar" panelinin gösterdiği prompt önizlemesinin (kültürel/dil adaptasyon kuralı dahil) gerçek müşteri botuna hiç ulaşmadığı, web'deki `AdvancedPersonaSettings.tsx` panelinin ise zaten Phase 5'ten beri `bot_settings.system_prompt`'a bir daha hiç yazılmayan, dondurulmuş/legacy bir metni salt-okunur gösterdiği doğrulandı.
2. **Kültürel/Dil Adaptasyonu Sunucuya (Ledger) Taşındı:** Platform uluslararası müşterilere hizmet verdiği için, kültürel/dil adaptasyonu artık configüre edilebilir bir ayar değil — ledger reposundaki `shared/ai/PromptBuilder.ts` dosyasının `SYSTEM_POLICY`'sine her zaman geçerli, kapatılamaz yeni bir kural (madde 1: "DİL VE KÜLTÜREL ADAPTASYON") eklendi: müşteri hangi dilde yazarsa bot o dilde, o kültürün günlük ifade/espri anlayışına uygun şekilde cevap veriyor — persona/karakter/rol seçiminden bağımsız.
3. **"İleri Seviye Ayarlar" Paneli Kaldırıldı (Web):** Artık gerçek bir işlevi kalmayan `AdvancedPersonaSettings.tsx` bileşeni ve `ai-asistan/page.tsx`'teki `systemPrompt`/`isAdvancedOpen` state'i, ilgili render bloğu ve `bot_settings.system_prompt` okuması tamamen kaldırıldı. Aynı temizlik mobil (flow) tarafında da yapıldı — "Tek Yapı": tek gerçek akış artık UI seçimleri → `organization_ai_settings` → sunucuda `PersonaService` + `PersonaPromptBuilder` → gerçek prompt.
### [07.09.2026] Zernio Medya İçerikleri İçin Teknik Borç ve Mimari Planlama ( media_type Refaktörü )

**Durum ve Bulgu:**
Zernio'dan gelen .blob uzantılı medya bağlantıları (https://media.zernio.com/media/...blob), hem resim hem de video dosyaları için kullanılabiliyor. URL yapısı dosya türünü belli etmediği için (örneğin .mp4 gibi bir uzantı barındırmıyor), `flowweb` tarafında bu medyanın resim (<img />) olarak mı yoksa video (<video />) olarak mı render edilmesi gerektiğini yalnızca URL'e bakarak anlamak teknik olarak güvenilir değildir. Geçici olarak .blob içeren bağlantıları video olarak render edecek şekilde frontend güncellenmiştir (çünkü mevcut örnekler video idi), ancak bu gelecekte bir resim postu geldiğinde boş bir video oynatıcı görünmesine yol açacaktır.

**Orta Vadeli Doğru Çözüm (Technical Debt):**
Uzantı tahminine güvenmek yerine, gerçek içerik türünü (mediaType) doğrudan veritabanında tutmak ve frontend'de buna göre render işlemi yapmak şarttır.

**Planlanan Değişiklikler:**
1. **Veritabanı (ledger reposu):** posts tablosuna media_type adında yeni bir kolon (text veya text[]) eklenecek.
2. **Senkronizasyon (zernio-client):** Zernio'nun listPosts yanıtında bulunan mediaItems içerisindeki orijinal `type` bilgisi (örn. "video" veya "image") çıkarılacak ve bu yeni media_type kolonuna yazılacak.
3. **Arayüz (`flowweb` reposu):** sosyal-medya/posts/page.tsx ve gelen-kutusu/page.tsx sayfalarında dosya uzantısını kontrol eden Regex (/\.(mp4|blob)/) tamamen kaldırılacak. Bunun yerine, doğrudan media_type === 'video' kontrolü yapılarak render tercihi (<img> vs <video>) belirlenecek.

### [11.09.2026] Zernio Sosyal Medya Modülü: Yarış Durumu (Race Condition) ve Unpublish Kurgusu Çözümü
1. **Realtime Fetch ve Alert Spam Çözümü:** `posts/page.tsx`'te Supabase Realtime olaylarının sebep olduğu ardışık ve redundant veri çekme (fetch) işlemleri `debounceTimer` ile tekilleştirildi ve `requestSeq` (Sequence / stale state koruması) eklenerek yarış durumları kökten çözüldü. Ayrıca `sosyal-medya/page.tsx`'te sekme odaklanmalarında sürekli tekrar eden cross-tenant conflict (çakışma) uyarıları `shownConflictsRef` kullanılarak oturum bazında tekilleştirildi.
2. **Zernio 'Siliyorum Ama Geri Geliyor' (Resurrection) Sorunu Çözümü:** `zernio-client/index.ts` backend servisinde, `sync-posts` işlemi sırasında yerelde `status: 'deleted'` olarak işaretlenen gönderilerin Zernio üzerinden tekrar yayınlanmış gibi (published) canlandırılması (resurrect) durduruldu.
3. **Yayınlanmış (Published) Gönderiler İçin Unpublish Mekanizması:** Zernio'nun yayınlanmış postlarda standart DELETE metodunu koşulsuz reddettiği bulgusu üzerine tam bir unpublish akışı uygulandı.
   - Backend (`ledger`): `PostApi.ts` içerisine SDK üzerinden `unpublishPost` metodu entegre edildi ve Edge Function'da (unpublish-post eylemi) erişime açıldı.
   - Frontend (`flowweb`): Platformlardan da kalıcı olarak silme işleminde `attemptZernioRemoval` asenkron yardımcısı kullanıldı. Instagram/TikTok gibi Zernio'nun unpublish API desteği vermediği platformlar için çoklu dilde (TR/EN/DE) uyarılar gösterilerek manuel silmeye yönlendirildi ve bu esnada panel üzerinden silme kurgusu (deleteFromPlatforms: false) stabil çalışacak şekilde korundu.

### [17.09.2026] Threads Hesap Bağlama — Geçici Olarak Devre Dışı (Zernio Meta App Sorunu)

**Sorun:** Kullanıcı "Sosyal Medya" sayfasından Threads'e bağlanmaya çalıştığında, Instagram/Meta girişini tamamladıktan sonra hiçbir hata mesajı görmeden threads.net'in kendi ana sayfasında kalıyor, `/sosyal-medya`'ya geri dönmüyordu.

**Kök neden (bizim kodumuzda değil):** `zernio-client`'ın `get-connect-url` çağrısı doğru çalışıyor ve geçerli bir `authUrl` üretiyor (`https://threads.net/oauth/authorize?client_id=1410550293434390&redirect_uri=https://zernio.com/api/v1/connect/threads/callback&scope=...`). Ancak bu URL'e gidildiğinde Meta, bir uygulama yetkilendirme (consent) ekranı göstermek yerine kullanıcıyı threads.net'in genel "hesap oluştur" (login/signup) akışına yönlendiriyor — yani `client_id=1410550293434390`'ye ait Meta App'te Threads API/"Login with Threads" ürünü düzgün yapılandırılmamış görünüyor. Bu, Zernio'nun App Dashboard'unda düzeltmesi gereken bir konfigürasyon sorunu; konu Zernio destek/mühendislik ekibine (captured `authUrl` + zaman damgaları ile) iletildi, yanıt bekleniyor.

**Geçici önlem:** Kullanıcı, sorun çözülene kadar kafa karıştırıcı bir "sessiz hata" ile karşılaşmasın diye, `sosyal-medya/page.tsx`'teki `PLATFORMS_DATA` dizisinden Threads kartı geçici olarak yorum satırına alındı (silinmedi). Zernio taraf sorunu düzelttiğini onayladığında bu satırın yorumdan çıkarılması yeterli.

### [17.09.2026] Paylaşım Merkezi: Bluesky İçin Platforma Özel Seçenekler Eklendi

**Sorun:** Zernio'nun kendi "Create Post" panelinde Bluesky için "thread" (zincir) anahtarı ve "custom caption" (300 karakter) alanı bulunmasına rağmen, `sosyal-medya/share/page.tsx` (Paylaşım Merkezi) dosyasındaki `PLATFORMS_DATA` dizisinde Bluesky hiç tanımlı değildi ve "Platform Specific Settings" bölümünde de bir Bluesky bloğu yoktu. Sonuç olarak: (1) bağlı bir Bluesky hesabı, hesap seçim ızgarasında marka rengi/ikonu yerine jenerik bir küre ikonuyla görünüyordu, (2) Bluesky seçildiğinde hiçbir platforma özel ayar (thread/özel açıklama) gösterilmiyordu ve `handleShare()` bu platform için `platformOptions`'ı hep boş gönderiyordu.

**Kök neden:** Sadece frontend eksikliğiydi — backend (`ledger-repo/supabase/functions/zernio-client/index.ts`, `create-post` action'ı) `platformSpecificData`'yı platformdan bağımsız, olduğu gibi Zernio SDK'sına geçiriyor; Bluesky için özel bir işleme/engelleme yok.

**Çözüm:**
1. `PLATFORMS_DATA` dizisine, `/sosyal-medya` (Yeni Hesap Bağla) sayfasıyla aynı renk/ikonla (`#0085ff`, ☁️) bir `bluesky` girişi eklendi.
2. Twitter/X bloğuyla aynı desende (`isThread` + `caption`) yeni bir Bluesky state çifti (`bskyIsThread`, `bskyCustomCaption`) ve `handleShare()` içinde karşılık gelen `platformOptions` dalı eklendi.
3. Zernio'nun kendi panelindeki görünümle birebir eşleşen bir "Bluesky" ayar kartı eklendi: thread açma/kapama anahtarı + 300 karakter sayaçlı özel açıklama kutusu.
4. `messages/{tr,en,de}.json`'a `sharePage.bluesky.threadToggle` / `threadDescription` anahtarları eklendi (özel açıklama alanı zaten paylaşılan `sharePage.platforms.customCaptionLabel/customCaptionPlaceholder` anahtarlarını kullanıyor).

**⚠️ Doğrulanmamış varsayım:** Bluesky için Zernio API'nin beklediği `platformSpecificData` alan adları (`isThread`, `caption`) resmi olarak teyit edilmedi — Zernio'nun ekran görüntüsündeki UI (thread anahtarı + custom caption) bu codebase'in Twitter/X entegrasyonuyla birebir aynı olduğu için aynı adlandırma varsayıldı. Zernio'dan bir alan adı hatası dönerse önce bu isimlendirme kontrol edilmeli.

### [17.09.2026] "Tüm Gönderiler" Ekranında (Web) Bluesky İkonu Düzeltildi

**Sorun:** Web tarafında (`sosyal-medya/posts/page.tsx`) yer alan "Tüm Gönderiler" ekranında, Bluesky platformuna ait gönderilerin ikonları eksikti ve yerinde boş/kırık bir ikon render oluyordu.

**Kök neden:** `getPlatformIcon()` fonksiyonunda `bluesky` için bir karşılık (`case`) yoktu ve varsayılan (`default`) değer olan `fa-circle-dot`'a düşüyordu. Bu varsayılan değer `fa-brands` önekiyle birleştirildiğinde geçersiz bir sınıf kombinasyonu oluşturuyor ve FontAwesome (ikon kütüphanesi) geçersiz ikon üretiyordu.

**Çözüm:** Yeni bir `renderPlatformIcon(platform, idx)` fonksiyonu tanımlandı. Bluesky için doğrudan projenin konvansiyonuna uyan marka rengiyle (`#0085ff`) emojili (`☁️`) `span` elementi render edilmesi sağlandı; diğer tüm platformlar için eski `fa-brands` mantığı aynen korundu.

### [17.09.2026] Analiz Ekranı: Best Times Özet Satırındaki Dil Tutarsızlığı Düzeltildi (Mon/Tue → Pzt/Sal)

**İstek:** Mobil-web parite çalışması sırasında (bkz. `flow-repo/README.md`) fark edilen bir detay — Best Times ısı haritasının (`analiz/page.tsx`) üst grid'i Türkçe gün kısaltmaları (Pzt/Sal/Çar...) kullanırken, altındaki "en iyi 2 zaman" özet satırı İngilizce (Mon/Tue/Wed...) kısaltmalar kullanıyordu. Kullanıcı bu tutarsızlığın düzeltilmesini istedi.

**Çözüm:** Özet satırının `days` dizisi, üstteki grid ile aynı Türkçe kısaltmalara (`["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]`) çevrildi. Mobil taraftaki (`flow-repo`, `AnalyticsScreen.js`) aynı satır da eşzamanlı olarak güncellendi, böylece iki platform hem kendi içlerinde hem birbirleriyle tutarlı. "Best times:" öneki ve saat gösterimindeki am/pm ifadesi kapsam dışı bırakıldı (işaret edilen tutarsızlık yalnızca gün kısaltmalarıyla ilgiliydi).

### [17.09.2026] AI Asistan Üslup Kartları: Komik/Resmi/Samimi İçin Görsel Eklendi

**İstek:** Kullanıcı, hem web hem mobil (`flow-repo`) "AI Asistan" bölümündeki üslup seçim kartlarında Resmi/Samimi/Komik için artık emoji yerine kendi sağladığı görselleri kullanmamızı istedi; dosyaları bu reponun `public/ai-asistan/tones/` klasörüne (`resmi`, `samimi`, `komik` isimleriyle) kendisi yerleştirdi.

**Not (bu oturumun kısıtı):** Bu session, kullanıcının bilgisayarına bağlı değildi (device bridge bağlantısı yoktu), bu yüzden klasörü doğrudan göremedim/dosya uzantısını teyit edemedim. Kullanıcıya sorup `.png` olduğunu (diğer 5 mizaç görseliyle — `neseli.png`, `sakin.png`, `dedikoducu.png`, `huysuz.png`, `sinirli.png` — aynı konvansiyon) teyit ettirdim.

**Çözüm:** `AICharacterPanel.tsx`'teki `TONES` dizisinde `Komik`/`Resmi`/`Samimi` girdilerine, mevcut 5 mizaçla (Neşeli/Sakin/Dedikoducu/Huysuz/Sinirli) aynı desende `avatarUrl: "/ai-asistan/tones/{komik,resmi,samimi}.png"` eklendi. `PersonaCard` zaten `avatarUrl` varsa görseli, yoksa emojiyi gösteriyor (bkz. `ToneCarousel.tsx`'teki mevcut yorum), bu yüzden başka bir render değişikliği gerekmedi. Mobil tarafta (`flow-repo/moods.ts`) da aynı üçlüye, dosyanın zaten kullandığı `TONE_AVATAR_BASE` (`https://flow.workigom.com/ai-asistan/tones`) sabitiyle eşzamanlı olarak `avatarUrl` eklendi — mobil zaten bu reponun barındırdığı statik PNG'lere uzaktan URL ile bağlanıyor. "Standart" kasıtlı olarak dokunulmadı (kullanıcının özellikle istediği robot 🤖 teması, hem web hem mobilde emoji ile kalmaya devam ediyor).

**Bilinen risk:** Uzantı `.png` olarak varsayıldı (kullanıcı onayıyla). Farklıysa `avatarUrl` yolları 404 verir ve kartlar otomatik olarak emojiye geri döner (build kırılmaz, sadece eski görünüm sessizce devam eder). Antigravity, `public/ai-asistan/tones/` altındaki 3 yeni PNG dosyasını bu patch'in kod değişikliğiyle birlikte `git add` etmeli — patch sadece kod diff'ini içerir, ikili görsel dosyaları içermez (dosyalar zaten kullanıcının bilgisayarında doğru klasörde duruyor).

**Sonuç (18.09.2026):** Uygulandı ve canlıda bağımsız olarak doğrulandı — dosyalar gerçekten `.png` çıktı. İlk push turunda sadece görsel dosyaları eklenmiş, koddaki `avatarUrl` satırları ve bu README kaydı `git commit -a` unutulduğu için unstaged kalıp push'lanmamıştı; bunu `git diff HEAD origin/main`'de fark edip ikinci bir düzeltme patch'i (kod+README, görsellere dokunmadan) gönderdim, o da uygulanıp push'landı. Şu an her iki platform da tam senkron.

### [18.09.2026] Threads Yeniden Görünür Yapıldı (Test İçin)

**İstek:** Kullanıcı, 17.09.2026'da Zernio/Meta App OAuth sorunu nedeniyle geçici olarak listeden kaldırılan Threads'i, tekrar test etmek amacıyla hem web hem mobilde yeniden görünür yapmamızı istedi.

**Çözüm:** `sosyal-medya/page.tsx`'teki `PLATFORMS_DATA` dizisinde yorum satırına alınmış `{ id: "threads", ... }` girdisi tekrar aktif edildi (mobil taraftaki `flow-repo/SosyalMedyaScreen.js` ile eşzamanlı). Kod yorumu, eski kök-neden açıklamasını koruyarak bu ikinci deneme notunu da ekleyecek şekilde güncellendi.

**Önemli — bu bir "düzeltme" DEĞİL, bir "tekrar deneme":** Zernio'nun Meta App yapılandırmasındaki (Threads API ürünü/App Review durumu) altta yatan sorunun çözüldüğü doğrulanmadı; kullanıcı sadece canlıda tekrar test etmek istedi. Bağlantı denemesi yine aynı şekilde (consent ekranı yerine threads.net'in genel login akışına düşme) başarısız olursa, bu satır tekrar yorum satırına alınmalı.

### [18.09.2026] Analiz Ekranı: "Engagement over time" Kartı Yanlış Metriğe Bakıyordu (Tek Gönderi → Hesap Geneli)

**Sorun:** Kullanıcı, Zernio'nun kendi panelindeki (`zernio.com/dashboard/analytics?profile=...`) "Engagement over time" grafiğinde gerçek veri (Likes 2.1K, Comments 305, Views 201.8K vb.) görürken, aynı profil için bizim `analiz/page.tsx` sayfamızdaki aynı isimli kartın tamamen sıfır göründüğünü bildirdi (ekran görüntüleriyle).

**Kök neden (bağımsız kod incelemesiyle doğrulandı, `git fetch` + `git diff HEAD origin/main` ile local'in canlıyla birebir aynı olduğu teyit edildikten sonra):** Sayfada aynı anda iki ayrı "etkileşim zaman serisi" kartı vardı. (1) i18n'li "Etkileşim ve Gösterim" kartı `get-daily-metrics`'ten gelen hesap/platform genelindeki günlük veriyi (`zernioData.timelineData`) doğru şekilde gösteriyordu. (2) Sabit İngilizce başlıklı, Zernio'nun kendi panelindeki başlığın birebir kopyası olan "Engagement over time" kartı ise `get-post-timeline` çağrısından geliyordu ve SADECE veritabanındaki en son oluşturulmuş TEK gönderinin (`zernio_post_id`) günlük etkileşim geçmişini gösteriyordu — hesabın tamamını değil. En son gönderi 17-18 Eylül tarihli, henüz Zernio'da etkileşim biriktirmemiş olduğu için bu kart sıfır gösteriyordu; veri kaybı değil, yanlış (dar kapsamlı) bir metriğe bakılıyordu. Mobil tarafta (`flow-repo/AnalyticsScreen.js`) bu `postTimeline` verisi çekiliyor ama hiçbir yerde render edilmiyor — yani bu yanıltıcı kart sadece web'de vardı.

**Kullanıcı kararı:** Kullanıcıya üç seçenek sunuldu (kaldır / başlığı netleştir / veri kaynağını hesap-geneli yap); kullanıcı "zernioda nasıl verileri gösteriyorsa aynı şekilde verileri çeksin" dedi.

**Çözüm:** Kart artık `get-post-timeline` yerine `get-daily-metrics`'i **`attribution: 'received'`** parametresiyle çağırıyor. Zernio SDK tip tanımına göre bu parametre "buckets the per-day increase in engagement by the day it actually arrived (engagement-over-time)" — yani Zernio'nun kendi "Engagement over time" grafiğinin ürettiği veriyle birebir aynı hesaplama mantığı. Yeni state alanı `engagementOverTime` (eski `postTimeline` alanının yerine), hesabın TAMAMININ seçili 30 günlük aralıktaki günlük toplamını taşıyor. Artık gereksiz hale gelen `recentPosts` (Supabase `posts` sorgusu) ve tek-gönderi `get-post-timeline` çağrısı tamamen kaldırıldı — sayfa yüklemesi bir network round-trip daha az yapıyor. Kartın checkbox/legend mantığı (Likes/Comments/Shares/Saves/Views/Impress./Reach/Clicks, Eng. Rate) değişmedi, sadece veri kaynağı düzeltildi. Mobil tarafta bu kart hiç render edilmediği için mobilde herhangi bir değişiklik gerekmedi.


## Session 27.09.2026 - Randevu Bug Fixes
- Separated Notes and Services UI rendering in Randevu cards on Web & Mobile.
- Synced selectedDate with currentDate for correct month view across platforms.
- Replaced horizontal scrollable date chips in Mobile with native DateTimePicker.
- Wrapped Mobile modal form in ScrollView to fix keyboard overlap and unresponsiveness.
- Made serviceId optional and added Validation Alert in Mobile.
- Fixed database constraint overlapping bug in Web and Mobile by replacing timestamp LIKE queries with gte/lt bounds.

### [27.09.2026] Faz 2: Ölü Kod Temizliği ve Ortak slotBusy Entegrasyonu
1. **Flow / FlowWeb Ortak Kütüphane:** Müsaitlik durumu ve saat hesaplamaları için bağımsız ve tamamen zaman dilimi uyumlu src/lib/slotBusy.ts (starts_at / ends_at çakışma tespiti) entegre edildi.
2. **Ölü Kodların Temizlenmesi (flow):** Eski WAHA tabanlı StartAppointmentFlowUseCase, ApproveAppointmentUseCase, CancelAppointmentUseCase, GetAvailableHoursUseCase ve WahaRandevuService dosyaları uygulamadan tamamen silindi ve dependency injection (container.ts) kayıtları kaldırıldı.
3. **Repository Güncellemesi (flow):** Eski string tabanlı indAvailableHours fonksiyonu silinip yerine veri tabanından starts_at, ends_at, timezone, status çeken getDayAppointmentsForCalendar eklendi.
4. **Heatmap & UI (flowweb & flow):** Web ve Mobil'deki gün içi yoğunluk haritası (isSlotBusy), yeni slotBusy.ts modülü kullanılarak string (date LIKE) aramasından aralık bazlı çakışma arayışına dönüştürüldü. Yeni Randevu Modalı (mobildeki) saatleri filtrelemek için güncellendi.
5. **Ledger Güncellemeleri:** waha-webhook v92 canlı ortamdan senkronize edildi. AI Core (ResponseGuards, claimsAction, vs.) testleri ile sisteme dahil edildi. Faz 2 temizliği doğrulandı.



9. **Flow & FlowWeb - İptal ve Kalıcı Silme Arayüzü:** Randevu listelerinde kullanılmak üzere iptal ve silme işlemleri RPC (cancel_appointment, delete_appointment) üzerinden backend ile tam entegre edildi. Web tarafında iptal nedenleri ve durum bildirimleri kartta soluk rozetler olarak gösterilirken, mobilde kart içine ActionSheet ('⋮') eklendi.
10. **Flow (Mobil) - Gelen Kutusu Zil Yönlendirmesi:** DashboardScreen'deki bildirim çanının yanlışlıkla 'Sosyal Medya' sekmesine yönlendirmesi sorunu düzeltilip, doğrudan ana gezinme yığını (Stack) seviyesine taşınan 'Inbox > Bildirimler' sekmesine yönlendirildi. Tanımsız kalan eski load data (fetchAppointments) fonksiyonları temizlendi.

### [07.10.2026] Flow AI Web Panel - Video Paylaşım Aracı (FA7)
- Flow AI paneline video ekleme ve handoff yeteneği kazandırıldı.
- Panel üzerinden AI destekli gönderi metni ve zamanlama onayı ile tam etkileşimli sosyal medya paylaşım akışı sağlandı.
- Flow AI hesap seçici (picker) kartı eklendi. Flow AI "Hangi hesaplarda paylaşalım?" sorusunu doğrudan panel içinden etkileşimli butonlarla çözüyor.
- Sosyal medya paylaşım hatası sonrası video ekinin silinmesi engellendi, kullanıcının tekrar denemesine olanak sağlandı.
- `share/page.tsx`'teki `flowai:share-result` olayı sadece "onaylı koşu" (Flow AI tarafından tetiklenen) durumunda ateşleniyor, böylece normal manuel paylaşımlarda Flow AI paneli hatalı olarak "Paylaşıldı" demiyor.
- `share/page.tsx` üzerinden Flow AI job register ve share entegrasyonu tamamlandı.

