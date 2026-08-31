# Workigom Flow — Agent Kurallarý ve Proje Hafýzasý

## ?? Kritik Kural: Ortak Veritabaný Etkileþimi (Web & Mobil)

**Web ve Mobil versiyonlar AYNI (Supabase) veritabanýný paylaþmaktadýr.** 
- Web tarafýnda bir veritabaný (þema, tablo, edge function) veya query deðiþikliði yaptýðýnýzda, bunun Mobil (React Native) uygulamasýný da doðrudan etkileyeceðini ve bozabileceðini DAÝMA hesaba katýn.
- Herhangi bir API metodolojisi (`.single()` vb.) veya veri modeli deðiþikliði yapmadan önce, bunun her iki platformdaki koda nasýl yansýyacaðýný kontrol edin.

## ?? Kritik Kural: Expo SDK

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

## ?? Kritik Kural: Dependency Injection

**`tsyringe` KULLANILMAMAKTADIR ve kullanýlMAYACAKTIR.**

- `@injectable()`, `@inject()`, `reflect-metadata` › **KESÝNLÝKLE YASAK**
- Hermes JS Engine bu dekoratörleri desteklemez › Build patlar
- Tüm baðýmlýlýklar `src/core/container.ts` içindeki **manuel singleton** sistemiyle yönetilir

### Yeni servis/repository eklemek için:

```typescript
// 1. src/core/container.ts içinde singleton oluþtur
const myNewRepository = new MyNewRepository();

// 2. resolve() switch'ine ekle (string key veya class ref ile)
if (cls === 'MyNewRepository') return myNewRepository;
if (cls === MyNewUseCase) return myNewUseCase;
```

---

## ??? Mimari Yapý

### Proje Teknolojileri

- **Frontend**: React Native 0.86, Expo SDK 57, React 19, React Navigation v7
- **Backend**: Supabase (PostgreSQL + Realtime + Edge Functions)
- **Auth**: Supabase Auth + AsyncStorage
- **DI**: Manuel container (`src/core/container.ts`) — tsyringe YOK
- **Stil**: NativeWind v2 + Tailwind CSS v3, StyleSheet + Glassmorphism, renk paleti `#131315` (bg) / `#4edea3` (primary)

### Katman Kurallarý (Clean Architecture)

```
Domain  ‹ Application ‹ Infrastructure ‹ Presentation
```

- **Domain**: Sadece saf TypeScript. React/Supabase import YOK.
- **Application**: UseCase'ler. Sadece interface'lere baðýmlý, concrete class import YOK.
- **Infrastructure**: Supabase, WAHA, Zernio implementasyonlarý.
- **Presentation**: React Native ekranlarý ve hook'lar. Container üzerinden UseCase çaðýrýr.

### Modül Yapýsý

```
src/
+¦¦ core/
-   +¦¦ container.ts          — Manuel DI container (singleton'lar burada)
-   L¦¦ navigation/
-       +¦¦ AppNavigator.js   — Root navigator
-       L¦¦ TabNavigator.js   — Tab bar + nested stacks
-
+¦¦ shared/
-   +¦¦ lib/supabase.js       — Supabase client (createClient)
-   +¦¦ errors/               — AppError, NetworkError, ValidationError...
-   L¦¦ ui/                   — Paylaþýlan UI bileþenleri
-
L¦¦ modules/
    +¦¦ randevu/              — ?? Randevu yönetimi
    +¦¦ muhasebe/             — ?? AI muhasebe
    L¦¦ sosyal_medya/         — ?? Bot yönetimi + sosyal medya
```

---

## ?? Randevu Modülü — Hafýza Notlarý

### Ekranlar ve Navigasyon

```
BotYonetimiScreen
  L¦> RandevuScreen        (stack: "RandevuMain")
        L¦> HizmetAyarlariScreen  (stack: "HizmetAyarlari")
```

Navigasyon: `TabNavigator.js` içindeki `BotYonetimiStack` altýnda tüm 3 ekran tanýmlý.

### RandevuScreen Özellikleri

- `stickyHeaderIndices={[0]}` — Calendar + Heatmap her zaman ekranda sabit
- Takvim þeridi: yatay kaydýrýlabilir, seçili gün yeþil/büyük
- Heatmap: 3 satýr (Sabah/Öðle/Akþam), 30 dakikalýk slotlar, tüm satýrlar birlikte kayar
- Timeline: `useAppointments` hook'undan gelen gerçek DB verisi
- FAB: Nabýz atan animasyonlu `+` butonu (tab bar + insets üzerinde)

### useAppointments Hook (src/modules/randevu/presentation/hooks/useAppointments.ts)

```typescript
const { appointments, loading, isSlotBusy, selectedDate, setSelectedDate } = useAppointments();
```

- `container.resolve('AppointmentRepository')` ile repo alýr
- `selectedDate` deðiþince `getAppointmentsByDate()` çeker
- `subscribeToAppointments()` ile Realtime dinler, unmount'ta temizler
- `isSlotBusy(timeSlot: string)` › o saatte Pending/Approved randevu var mý?
- `extractTime(dateStr)` — ISO/space-separated datetime'dan "HH:MM" çýkarýr

### SupabaseAppointmentRepository Metodlarý

| Metod | Açýklama |
|-------|----------|
| `create()` | Yeni randevu oluþtur |
| `approve(id)` | Randevu onayla |
| `cancel(id)` | Randevu iptal et |
| `findByToken(token)` | Token ile randevu bul |
| `findAvailableHours(date, serviceId)` | Müsait saatleri listele |
| `getAppointmentsByDate(date)` | Güne göre randevularý çek |
| `subscribeToAppointments(date, cb)` | Realtime dinle, unsubscribe fn döner |

### Supabase Realtime

- Table: `appointments`
- Publication: `supabase_realtime` — appointments tablosu ekli olmalý
- Filter: `date=eq.${date}` — sadece seçili günün deðiþikliklerini dinler
- Her event'te tüm liste yeniden çekilir (tutarlýlýk garantisi için)

---

## ?? Tasarým Sistemi

### Renk Paleti (Dark Theme)

```
Background:   #131315
Surface:      rgba(32,31,34,0.4)  (glassmorphism)
Primary:      #4edea3  (yeþil vurgu)
On-Primary:   #003824
Secondary:    #ffb95f  (turuncu)
Tertiary:     #c0c1ff  (mor)
On-Surface:   #e5e1e4
Muted:        #bbcabf
Border:       rgba(60,74,66,0.2)
```

### Glassmorphism Kart Stili

```javascript
{
  backgroundColor: 'rgba(32,31,34,0.4)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.05)',
  borderRadius: 14,
  // iOS shadow:
  shadowColor: '#4edea3', shadowOpacity: 0.2, shadowRadius: 8,
  // Android:
  elevation: 4,
}
```

### FAB Konumlandýrma (Tab Bar Üstünde)

```javascript
const insets = useSafeAreaInsets();
const tabBarBottom = Math.max(insets.bottom + 10, 20);
const tabBarHeight = 64;
const fabBottom = tabBarBottom + tabBarHeight + 14;
// fab: { position: 'absolute', bottom: fabBottom, right: 18 }
```

---

## ?? Supabase Yapýlandýrmasý

### Client (src/shared/lib/supabase.js)

```javascript
import 'react-native-url-polyfill/auto';      // ZORUNLU — React Native'de URL.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true } }
);
```

### .env Deðiþkenleri

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## ?? Bilinen Sorunlar ve Çözümleri

| Sorun | Çözüm |
|-------|-------|
| `TypeInfo not known for "X"` | tsyringe kalýntýsý var. `container.resolve(X)` ile resolve et, `@injectable` kaldýr |
| `declare class` TypeScript hatasý | Babel TypeScript plugin sýrasý sorunu. `tsyringe` kaldýr, `reflect-metadata` import etme |
| `Element type is invalid: got undefined` | Named/default export karýþýklýðý. Component export'larýný kontrol et |
| `SafeAreaView has been deprecated` | `react-native-safe-area-context`'ten import et, `react-native`'den deðil |
| FAB tab bar'ýn altýnda kalýyor | `useSafeAreaInsets` kullan, hardcoded bottom deðeri verme |
| Realtime çalýþmýyor | Supabase panelinde `supabase_realtime` publication'a tabloyu ekle |

---

## ?? Navigasyon Yapýsý

```
App.js
L¦¦ AppNavigator (Stack)
    +¦¦ AuthScreen
    L¦¦ TabNavigator (Bottom Tabs)
        +¦¦ Tab: Dashboard
        +¦¦ Tab: Muhasebe › AiMuhasebeScreen
        +¦¦ Tab: BotYonetimi (BotYonetimiStack)
        -   +¦¦ BotYonetimiScreen    ("BotYonetimiMain")
        -   +¦¦ RandevuScreen        ("RandevuMain")
        -   L¦¦ HizmetAyarlariScreen ("HizmetAyarlari")
        L¦¦ Tab: SosyalMedya
```

---

## ?? Önemli Paketler

```json
{
  "expo": "~56.0.x",
  "react-native": "0.76.x",
  "@react-navigation/native": "^7.x",
  "@react-navigation/bottom-tabs": "^7.x",
  "@react-navigation/native-stack": "^7.x",
  "@supabase/supabase-js": "^2.x",
  "expo-blur": "~14.x",
  "@expo/vector-icons": "^14.x",
  "react-native-safe-area-context": "^5.x",
  "react-native-url-polyfill": "^2.x"
}
```

---

## ?? Son Geliþtirme Günlüðü (25 Temmuz 2026)

### Yapýlan Deðiþiklikler ve Çözülen Hatalar:
1. **Paket Temizliði:** `tsyringe`, `reflect-metadata` ve gereksiz Babel decorator plugin'leri `package.json`'dan kaldýrýldý.
2. **Konfigürasyon Temizliði:** `tsconfig.json` dosyasýndaki `experimentalDecorators` ve `emitDecoratorMetadata` flag'leri kaldýrýldý.
3. **Dokümantasyon Senkronizasyonu:** AGENTS.md dosyasý mevcut teknoloji yýðýnýna (Expo 57 / RN 0.86 / React 19) göre güncellendi.
4. **Mimari Düzenlemeler:** Eksik `index.ts` dosyalarý (randevu, persona_engine, business-profile) oluþturuldu. BotYonetimiScreen'deki derin (deep) import kural ihlalleri barrel export üzerinden tek satýra indirgendi.
5. **Container Baðlantýlarý:** Eksik olan `wahaService` ve `transactionRepository` container DI sistemine resolve olarak eklendi. `container` nesnesi `core/index.ts` üzerinden dýþa aktarýldý.

---

## ?? Geçmiþ Geliþtirme Günlüðü (5 Temmuz 2026)

### Yapýlan Deðiþiklikler ve Çözülen Hatalar:
1. **Zernio Client ve Analytics Cache Güncellemesi:** Supabase Edge Functions altýndaki `ZernioClient.ts` dosyasý güncellenerek sosyal medya platformlarý (YouTube, LinkedIn, Instagram, Google Business, vb.) için analytics metotlarý önbellekleme (cache) desteði ile entegre edildi.
2. **Hata Yönetimi ve Silme Ýþlemi:** Zernio hesabýný ayýrma (`disconnect-account`) iþlemi doðrudan ZernioClient içindeki metoda baðlandý.
3. **Veritabaný Migration'ý:** Analytics cache için yeni bir Supabase veritabaný migration'ý (`20260705000000_analytics_cache.sql`) oluþturuldu.
4. **Baðýmlýlýklar:** `package.json` ve `package-lock.json` dosyalarý güncellendi.

---

## ?? Geçmiþ Geliþtirme Günlüðü (27 Haziran 2026)

### Yapýlan Deðiþiklikler ve Çözülen Hatalar:
1. **GitHub Senkronizasyonu:** Local `master` dalý `origin/master` ile güncel olmasýna raðmen en son güncellemelerin (Randevu Realtime, RAG Drive senkronizasyonu, dual prompt ve RGB border) `origin/main` dalýnda olduðu fark edildi. Local repo `main` dalýna geçirilerek güncel kod çekildi.
2. **Randevu Modülü i18n:** `RandevuScreen.js` ve `HizmetAyarlariScreen.js` ekranlarýndaki tüm hardcoded Türkçe kelimeler temizlenerek `tr.json`, `en.json` ve `de.json` dosyalarýna baðlandý. `useTranslation` hook'u ile dinamik yerelleþtirme tamamlandý.
3. **Animated Ref Render Eriþimi Çözüldü:** `RandevuScreen.js` ve `AiUretimScreen.js`'deki Animated Value'larýn render esnasýnda ref üzerinden `.current` olarak okunmasý nedeniyle linter'ýn fýrlattýðý `Cannot access refs during render` hatasý, `useState` tabanlý `Animated.Value` tanýmlamasýna geçilerek tamamen çözüldü.
4. **TypeScript Path Aliases & Anti-Bypass Entegrasyonu:** `tsconfig.json` dosyasýnda `@domain/*`, `@application/*`, `@infrastructure/*` ve `@presentation/*` alias'larýna `randevu` modülü dahil edildi. Projedeki tüm relative path import'lar path alias'larýna geçirilerek ESLint'in `no-restricted-imports` (Anti-Bypass) kuralý yeþile çekildi.
5. **Kapsamlý Linter Kontrolü:** `npm run lint` çalýþtýrýlarak tüm 42 hata giderildi ve linter **0 hata** ile tamamlandý.
6. **Sistem Talimatý Kartýna Gök Mavisi Neon Çerçeve ve Dönen Aura Gölgesi Entegrasyonu:** 
    - `BotYonetimiScreen.js` içindeki Sistem Talimatý kartýna, kartýn tüm kenarlarýný eþit kalýnlýkta kaplayan (`borderWidth: 1.5`) solid `#00a2ff` (gök mavisi) renginde sürekli parlayan neon bir sýnýr çizgisi uygulandý.
    - **Dönen Aura Gölgesi (blue_glow):** Yumuþak geçiþli gök mavisi, lacivert ve turkuaz tonlarýndan oluþan dairesel bir conic gradient resim (`blue_glow.png`) üretildi. Bu resim kartýn arkasýna yerleþtirilerek native `blurRadius={12}` ile bulanýklaþtýrýldý ve 8 saniyelik lineer bir döngüde dönen bir `Animated.View` ile döndürülerek kart etrafýnda dönen/dolaþan hareketli bir mavi aura gölgesi elde edildi.
    - **Yuvarlatýlmýþ Köþeler ve Boþluk Düzenlemesi:** Ana `ScrollView` bileþenine `contentContainerStyle={{ paddingHorizontal: 16 }}` uygulanarak kartlarýn ekran kenarlarýna yapýþmasý önlendi ve mavi çizginin `borderRadius: 20` olan yuvarlatýlmýþ köþeleri görünür kýlýndý.
    - **Ýç Çerçeve/Siyah-Gri Gölge Sýzýntýsýnýn Önlenmesi (Solid Background):** Kartýn arka planý yarý saydam yerine tamamen opak koyu gri (`#1c1b1d`) olarak güncellendi. Bu sayede Android shadow motorunun `elevation` nedeniyle kartýn arkasýnda oluþturduðu koyu sistem gölgesinin cam katmanýn içinden sýzarak mavi çizginin altýnda ikinci bir koyu çerçeve oluþturmasý (shadow bleed-through) engellendi.
    - Kart içi hazýr rol preset butonlarýnýn aktif kenarlýk/yazý renkleri de turkuazdan `#00a2ff` (gök mavisi) tonuna güncellenerek görsel uyum tamamlandý.
    - "AI Karakter Talimatý" (`botInstruction`) kutusu `height: 280` olarak (eski 140px deðerinden 2 kat daha büyük) sabitlendi ve `showsVerticalScrollIndicator={true}` eklenerek yapýþtýrýlan uzun metinlerde kutunun büyümesi önlenip yan kaydýrma çubuðu ile gezilebilmesi saðlandý.















---

## ?? AI Muhasebe — Hafýza Notlarý (18 Temmuz 2026)

### 1. 4 Fazlý AI Fatura Entegrasyonu Mimari Kararlarý
Flow (Mükellef) ile Ledger (Müþavir) arasýndaki entegrasyon için 4 fazlý akýþ kabul edildi:
1. **Veri Yakalama (Flow):** Fatura fotoðrafý/PDF'i yüklenir, Gemini AI JSON olarak veriyi ayrýþtýrýr.
2. **Proaktif Chat (Flow):** AI mükellefe faturanýn türüne göre soru sorar:
   - Alýþ Faturasý: "Ödendi mi?" (Evet/Hayýr) -> Hayýr ise "Tarih?"
   - Satýþ Faturasý: "Tahsil edildi mi?" (Evet/Hayýr) -> Hayýr ise "Tarih?"
3. **Draft Kuyruðu (Flow -> Backend):** Veriler doðrudan \	ransactions\ tablosuna yazýlmaz. Yeni oluþturulan \submit-accounting-draft\ Edge Function'ý ile \ccounting_drafts\ tablosuna "pending_approval" statüsü ile iletilir. Mobil uygulamanýn doðrudan DB yazma yetkisi (RLS) kýsýtlandý.
4. **Müþavir Onayý (Ledger):** Müþavir kendi ekranýnda bu draft'larý Split-View (Görsel + Data) olarak inceler, onaylayarak \	ransactions\ tablosuna aktarýr.

### 2. Türkiye (TR-TR) Fatura Ayrýþtýrma Þemasý Kesin Kurallarý
- **Düz (Flat) JSON:** Ýç içe obje kullanýlmayacak. Tüm KDV ve matrah alanlarý (1, 8, 10, 18, 20) doðrudan \at1Base\, \at1Amount\ þeklinde döndürülecek. Bulunmayan veriler \ \ (sýfýr) olacak, \
ull\ veya boþ string dönülmeyecek.
- **Ýþlem Yönü (\invoiceType\):** Belgedeki alýcý/satýcý VKN'si ile Flow kullanýcýsýnýn (iþletmenin) VKN'si karþýlaþtýrýlacak. Ýþletme alýcýysa \purchase_invoice\, satýcýysa \sales_invoice\ dönecek.
- **Açýklama (\description\):** Sadece karþý tarafýn firma adý kullanýlacak. Ürün, hizmet, iþlem özeti uydurulmayacak veya eklenmeyecek.
- **Tevkifat:** Varsa aynen "1/10" gibi string olarak yazýlacak.
- **Matematiksel Uyum:** Uyuþmazlýk durumunda veriler deðiþtirilmeyecek, JSON içindeki \eviewFlags\ dizisine \AMOUNT_MISMATCH\ eklenecek.

### [26.07.2026] Yapýlan Son Güncellemeler
- **Veritabaný Uyumsuzluklarý Giderildi:** `transactions` tablosundaki geçersiz `name` sütunu kod bazýnda temizlendi. AI Asistanýn döndürdüðü `title`, `type` ve `status` alanlarýnýn `SupabaseTransactionRepository` ve `TransactionMapper` tarafýndan sorunsuz iþlenip veritabanýna eklenmesi saðlandý. Veritabanýndaki eski migration çakýþmalarý temizlendi.
- **OdemeTakvimiScreen Yeni Tasarým:** `OdemeTakvimiScreen`, grid yapýsýndan "Neo-Fintech Noir" tarzý, dikey listeli ve Gelir/Gider olarak ikiye bölünmüþ kart tasarýmýna geçirildi. Giderler kýrmýzý (`#ff3b30`), gelirler yeþil (`#22c55e`) olarak renklendirildi.
- **Filtreleme Mantýðý Düzeltildi:** Takvim ekranýnda iþlemlerin hem gelir hem gidere düþmesine neden olan `t.amount > 0` þartý kaldýrýlarak; `t.type === 'income'` / `'sales'` (gelir) ve `t.type === 'expense'` / `'ALIS'` (gider) kurallarýyla kesin bir ayrým yapýldý.
- **Gerçek Zamanlý Güncelleme:** `AiMuhasebeScreen` (Dashboard), `transactions` tablosuna yapýlan eklemeleri de dinleyecek (realtime subscription) þekilde geniþletildi ve `useFocusEffect` ile ekran açýldýkça verilerin anýnda güncellenmesi garantilendi.

## ?? Geçmiþ Geliþtirme Günlüðü (28 Temmuz 2026) - WAHA/Zernio Ayrýmý & Zernio Medya Optimizasyonu
### Yapýlan Deðiþiklikler ve Mimari Kararlar:
1. **Zernio Medya Yükleme Optimizasyonu (Backend):** Ai_muhasebeci/supabase içindeki zernio-client edge fonksiyonu, resimleri base64/url olarak göndermek yerine Zernio Media API'sine yükleyip 'mediaIds' dizisi ile gönderecek þekilde optimize edildi.
2. **Zernio Fallback Cron (Backend):** Her gece 03:00'da kaçýrýlan Zernio mesajlarýný/yorumlarýný eþitlemek için 'pg_cron' kullanan yeni bir Supabase SQL migration dosyasý oluþturuldu.
3. **Abonelik Mimarisine Hazýrlýk (Sosyal Medya Asistaný):** Basic (Sadece WhatsApp/WAHA) ve Premium (Tam sosyal medya/Zernio) paket ayrýmý kararý alýndý. Bu kapsamda 'Sosyal Medya Asistaný' þalteri, BotYonetimiScreen ekranýndan sökülerek doðrudan SosyalMedyaScreen ekranýna taþýndý.
4. **WAHA Temel Talimat Alaný:** BotYonetimiScreen içerisine kilitli olmayan (Basic pakete açýk) 'Asistan Talimatý Oluþtur' metin kutusu eklendi. Buraya girilen deðer doðrudan Custom Role (Özel Karakter) olarak WAHA system_instruction'ýna beslenmek üzere baðlandý.


## ?? Son Geliþtirme Günlüðü (9 Aðustos 2026)

### Yapýlan Deðiþiklikler ve Çözülen Hatalar:
1. **Zernio AI Yanýt Hatasý (Bug) Düzeltildi:** `HandleIncomingMessageUseCase.ts` içerisindeki ZernioClient fonksiyon çaðrýlarý (sendMessage, likeComment, replyToComment) düzeltilerek `.inbox` ve `.comments` alt modüllerine yönlendirildi. Bu sayede AI'ýn Instagram'a yanýt verememesi (TypeError) sorunu çözüldü.
2. **Ýletiþim Raporlarý Senkronizasyonu:** `InboxScreen.js`'de silinen mesajlarýn ve yorumlarýn anasayfadaki (Dashboard) `ai_communication_logs` tablosundan da eþ zamanlý olarak silinmesi saðlandý.
3. **Manuel Rapor Temizleme Butonu:** Dashboard üzerindeki `CommunicationLogsTable.js` bileþeninin altýna, eski ve takýlý kalmýþ raporlarý temizlemek için bir "Raporlarý Temizle" butonu eklendi. Ýþlemin çalýþmasý için `useCommunicationLogs.ts` hook'una `clearLogs` fonksiyonu yazýldý.
4. **Supabase RLS Policy Eklendi:** `ai_communication_logs` tablosu için eksik olan DELETE yetkisi (Row Level Security), yeni bir SQL migration dosyasý (`20260809223300_ai_communication_logs_delete_policy.sql`) oluþturularak canlý veritabanýna push edildi.

### [11.08.2026] Bildirimler Ekraný & AI Bildirim Altyapýsý (Flow)
1. **Bildirimler UI/UX:** Glassmorphism tasarým stili ile \BildirimlerScreen.js\ oluþturuldu ve \AppNavigator\'a eklendi.
2. **Dinamik Çan Ýkonu:** \DashboardScreen\ üst menüsündeki bildirim çaný, veritabanýndan okunmamýþ bildirim sayýsýný alýp kýrmýzý bir rozet gösterecek þekilde güncellendi.
3. **Gerçek Zamanlý Silme & Okuma:** Kullanýcýlar bildirimleri okuyabilir veya çöpe atýp Supabase'den silebilirler.
4. **AI Bildirim Entegrasyonu:** Ledger tarafýndaki yapay zeka asistanýnýn isme veya profile özel anýnda in-app bildirim atabilmesini saðlayan veritabaný altyapýsý ve araçlar tamamlandý.


### [14.08.2026] Web ve Mobil Platform UI/UX Senkronizasyonu
1. **Mobil Arayüz Web ile Eþitlendi:** Web versiyonunda bulunan þýk, cam görünümlü yatay kaydýrýlabilir (horizontal) Sosyal Medya hesap kartlarý, aynen Flow mobil (React Native) uygulamasýna uyarlandý.
2. **Emoji Ýkonlar ve Glow Efekti:** Standart marka ikonlarý iptal edildi; yerine Web versiyonunda kullanýlan emojiler (??, ?? vb.) getirildi ve kart etrafýndaki neon parlama (glow) efekti %20 oranýnda güçlendirilerek çok daha estetik bir görünüm elde edildi.
3. **Dashboard Paritesi:** Web tarafýndaki eski paneller temizlenip, güncel 'Son Aktiviteler' ve 'Ýletiþim Raporlarý' Web Dashboard'a dahil edilerek Mobil ekranla tam senkron saðlandý.

### [15.08.2026] Ã‡apraz Platform VeritabanÄ± Senkronizasyonu & Hata Giderimleri
1. **Ai Randevu (Web):** Ai Randevu YÃ¶netimi ekranÄ±ndaki takvim gÃ¼nleri yana kaydÄ±rÄ±labilir (drag-to-scroll) hale getirildi.
2. **Ortak VeritabanÄ± UyumsuzluÄŸu (406 HatasÄ±):** Dashboard ve AI Muhasebe (Web) ekranlarÄ±nda, organizasyon Ã¼yelerini Ã§eken .single() metotlarÄ± boÅŸ sonuÃ§ dÃ¶nebileceÄŸi iÃ§in 406 Not Acceptable hatasÄ± veriyordu. Bunlar gÃ¼venli olan .maybeSingle() ile deÄŸiÅŸtirildi ve sÄ±fÄ±r hata (No errors) durumuna ulaÅŸÄ±ldÄ±.
3. **Sosyal Medya Entegrasyonu (Web):** Web versiyonundaki "Hesap BaÄŸla" uyarÄ± mesajÄ± kaldÄ±rÄ±larak, mobil versiyondaki Supabase Edge Function (zernio-client) tabanlÄ± gÃ¼venli Instagram/Zernio yetkilendirme linki alma ve yÃ¶nlendirme sistemi web versiyonuna entegre edildi.
4. **Gelen Kutusu (Web):** Gelen Kutusu (/gelen-kutusu) ekranÄ±ndaki comments tablosu sorgusunda yer alan geÃ§ersiz posts iliÅŸkisi (posts(media_urls, title)) kaldÄ±rÄ±larak sadece .select('*') bÄ±rakÄ±ldÄ± ve "400 Bad Request" hatasÄ± giderildi. TÃ¼m iletiÅŸim raporlarÄ± sÄ±fÄ±r hata ile yÃ¼klenebilir hale geldi.
5. **Agent KurallarÄ±:** Web ve Mobil projelerin kalÄ±cÄ± hafÄ±zasÄ±na (AGENTS.md) Ã§apraz veritabanÄ± etkileÅŸimi hakkÄ±nda yeni "ðŸš¨ Kritik Kural: Ortak VeritabanÄ± EtkileÅŸimi" kuralÄ± iÅŸlendi.

### [18.08.2026] Zernio Private Reply (Gizli DM) 24 Saat Kuralý Optimizasyonu
1. **Web ve Mobil Private Reply Senkronizasyonu:** Yorumlara DM gönderilirken geçmiþ bir sohbet bulunduðunda sistemin standart 'send-message' yöntemine (Instagram'ýn 24 saat aktif konuþma kuralýna) takýlýp hata vermesi sorunu çözüldü. Artýk her iki platformda da bir yorumdan DM butonuna basýldýðýnda geçmiþe bakýlmaksýzýn doðrudan (24 saat kuralýný delen) 'send-private-reply' metodu tetiklenmektedir. Mobil (React Native) uygulamaya da web versiyonu ile ayný olan satýriçi (inline) Özel Yanýt gönderme yeteneði entegre edildi.

### [19.08.2026] Çapraz Platform Profil & Müþavir Baðlantýsý Senkronizasyonu
1. **Flow Web ve Mobil Profil Paritesi:** Web tarafýnda (/profil) ve Mobil tarafýnda (ProfilScreen) kullanýcý profilleri tamamen eþitlendi. Her iki platforma da "Þirket Tam Adý", "Vergi Numarasý (VKN)" ve "Vergi Dairesi" alanlarý eklendi.
2. **Ortak Veritabaný (Organization Legal Profiles):** Kullanýcýnýn VKN bilgileri \profiles\ tablosu yerine, doðrudan Müþavirin (Ledger) görebileceði \organization_legal_profiles\ tablosuna (kullanýcýnýn \organization_id\si üzerinden) baðlandý. Böylece Esnaf bilgilerini güncellediðinde Müþavirin ekranýnda anýnda güncelleniyor.
3. **Muhasebecim Arayüzü (Gerçek Veri):** Hem Web hem de Mobil "Muhasebecim" ekranlarýndaki sahte zamanlayýcýlý (mock) görselleþtirme kaldýrýlarak, sayfa yüklendiðinde \ccountant_taxpayer_links\ tablosundan kullanýcýnýn gerçekten bir müþavire baðlý olup olmadýðý sorgulanmaya baþlandý. Baðlantý varsa otomatik "Baðarýyla Baðlandý" ekraný gösteriliyor.
4. **Müþavir Baðlantýsý Tetikleyicisi (PostgreSQL Trigger):** Müþavir (Ledger üzerinden) yeni bir mükellef baðladýðýnda Esnafa otomatik anlýk bildirim fýrlatmasý için \ccountant_taxpayer_links\ tablosuna bir \AFTER INSERT\ PostgreSQL tetikleyicisi eklendi.
5. **Gelen Kutusu Realtime Bildirimleri:** Web tarafýnda Gelen Kutusu sayfasýnýn \
otifications\ tablosu için Canlý Websocket (Realtime) aboneliði eksikti. Bu eklendi; böylece asistan veya tetikleyici bir bildirim gönderdiðinde kullanýcýnýn sayfasý yenilenmeden çan ikonu ve bildirim listesi güncelleniyor.
6. **Yapay Zeka VKN/Ýsim Arama Hata Çözümü:** \ledger-ai-chat\ Edge fonksiyonunda Türkçe karakterleri dönüþtüren RegExp (replace) kodlamasýnda yaþanan UTF-8 bozulmasý giderildi. Yapay zeka artýk "YILMAZ ÝNÞAAT TAAHHÜT..." gibi uzun ve Türkçe karakterli resmi adlarý veritabanýnda doðru bir þekilde % wildcard'a çevirerek eþleþtirebiliyor.
### [20.08.2026] V2 DDD Tablo Temizliði ve Gelecek Görevler
1. **Gereksiz Tablolar Temizlendi**: V1 mimarisinden kalan taxpayers, invoices, invoice_schemas, ledger_chat_history tablolarý Supabase üzerinden kalýcý olarak silindi. Storage Avatar yüklemeleri için eksik RLS kurallarý eklendi.
2. **BUGÜN YAPILACAKLAR (Bekleyen Görevler)**:
   - **Görev 1:** Mobil/Web arasý profil fotoðrafý (Avatar) senkronizasyonunun web (FlowWeb) tarafýnda hala görüntülenememesi sorunu (URL veya CORS/RLS kaynaklý olabilir) detaylýca incelenip çözülecek.
   - **Görev 2:** Veritabanýndaki eski test kullanýcýlarý tamamen silinip temiz kullanýcýlar oluþturulacak.
   - **Görev 3:** Supabase üzerinde Google Login (Google ile Giriþ Yap) entegrasyonu aktif edilecek ve test edilecek.

### [21.08.2026] Müþavir Profil & Baðlantý Entegrasyonu (Flow & Ledger Senkronizasyonu)
3. **Ledger Profil Ekraný:** Müþavirlerin kendi profil bilgilerini (Ýþletme Adý, Yetkili Kiþi Adý Soyadý, Telefon vb.) düzenleyebilecekleri ve galeriden Profil Fotoðrafý yükleyebilecekleri (Supabase Storage 'avatars' bucket üzerinden) özel bir '/profil' ekraný eklendi.
4. **Flow Baðlantý Kartý:** Esnafýn (Flow) "Muhasebecim" sayfasýnda yer alan sahte zamanlayýcýlý baðlantý görünümü kaldýrýlarak gerçek veritabanýna baðlandý. Artýk aktif bir baðlantý varsa doðrudan müþavirin güncel profili, iþletme adý ve fotoðrafý "Baðlý" rozeti ile Glassmorphism kartýnda gösterilmektedir.

### [22.08.2026] Dashboard Yapay Zeka Veri Baðlantýlarý ve Profil Senkronizasyonu
1. **Flow Web ve Mobil (React Native) Dashboard Güncellemeleri:** AI Asistan günlük özet kutusundaki ve Sosyal Medya etkileþim trendindeki görsel amaçlý sahte veriler (mock data) kaldýrýldý.
2. **Gerçek Veritabaný ve Zernio API Entegrasyonu:** Flow projelerinde mesaj/yorum istatistikleri ve yaklaþan randevular doðrudan ilgili Supabase tablolarýna; sosyal medya etkileþim büyümesi ise Zernio üzerinden gerçek verilere baðlandý.
3. **Ledger Web Profil Yedekleme (Fallback) Sistemi:** Ledger uygulamasýnda, "Profil Bilgilerim" ekranýnýn form alanlarýnda veritabaný boþ olsa dahi (authorized_person, avatar_url) Google (OAuth) session'ýndan gelen verileri (user_metadata) varsayýlan olarak göstermesi ve düzgün senkronize olmasý saðlandý.


## ?? Son Gelistirme Gunlugu (24 Agustos 2026) - Multi-Tenancy & Zernio Sync Fallback Mimarisi

### Yapilan Degisiklikler ve Mimari Kararlar:
1. **Multi-Tenancy & Zernio Sync (Organizasyon Fallback Sistemi):** Kullanicilarin Zernio ile senkronize olabilmesi icin gereken organizasyon baglantisinda (organization_members), bireysel (freelancer) kullanicilarin organizasyon kaydi bulunmamasi durumunda yasanilan Organizasyon bulunamadi hatasi giderilmistir.
2. **Kural:** Zernio Edge Functions (zernio-client, vb.) cagrilirken, kullanicinin bagli oldugu bir organization_id yoksa, zorunlu olarak kullanicinin kendi benzersiz kimligi (userId) izole bir kiraci (tenant) olarak kullanilarak (fallback) Zernioya iletilecektir. Boylece coklu kiraci (multi-tenancy) izolasyonu bozulmadan bireysel hesaplar da Zernioyu sorunsuz kullanabilir.
3. **Guvenilir Oturum Okumasi (Session Destructuring):** React Native tarafinda hot-reload ve onbellek kayiplari nedeniyle olusan gecersiz oturum hatalarini onlemek icin hatali getSession okumalari iptal edilmis, yerine garanti sunan supabase.auth.getUser metodu standart kabul edilmistir.### ?? Kritik Kural: Sosyal Medya (Zernio) Mimarisi ve Çoklu Hesaplar

**Zernio Profile ? Workigom Organization**

Zernio'da bir "Profile", platform (Instagram, Facebook vs.) baþýna en fazla bir hesap alabilir. Ayný profile ikinci bir Instagram hesabý baðlanýrsa, ilk hesabýn üzerine yazar ve geçmiþ veriler kaybolur.

Bu veri kaybýný önlemek ve bir Workigom iþletmesine sýnýrsýz sosyal hesap ekleme yeteneði kazandýrmak için mimari þöyledir:

- **Workigom Organization** › Ýçerisinde 1..N adet **Zernio Profile** barýndýrýr.
- **Zernio Profile (Slot)** › Sadece platform baþýna 1 hesabýn yerleþtirildiði teknik bir konteynerdir (Kullanýcýya gösterilmez).
- **Workigom Social Account** › Organizasyon altýndaki tüm sosyal hesaplarýn düz (flat) listesidir. Gerçek ccountId deðerleri üzerinden post atýlýr ve DM yanýtlanýr.

Yeni hesap eklendiðinde (esolve_zernio_profile_for_platform RPC ile) backend ilgili platform için boþ bir slot/profile arar; yoksa deterministic bir isim (wg_{org_id}_01) ve Idempotency-Key ile otomatik yeni profile oluþturur.
- **Frontend UI Kuralý (Web & Mobil):** Zernio'nun çoklu profil yeteneðinden faydalandýðýmýz için, kullanýcý "Yeni Hesap Baðla" listesinde daha önce baðladýðý bir platformu (ör. Instagram) görmeye devam ETMELÝDÝR. Frontend'de isConnected(platform) tabanlý filtreleme YAPILMAZ. Hangi Zernio profiline ekleneceði veya yeni profil açýlýp açýlmayacaðý tamamen backend esolveProfileForPlatform() sorumluluðundadýr.

### [27.08.2026] Mobil Platform UI/UX ve Hata Giderimi
1. **Frontend Patch:** Mobil arayüzdeki hizalama hatalarýný çözen yapý low reposuna sorunsuz eklendi.
2. **Dashboard Neon UI:** Flow mobil uygulamasýnýn ana sayfasýnda yer alan yatay kaydýrýlabilir görsel alanýna alttan taþan neon mavi (#00a2ff) bir shadow glow eklendi. overflow: hidden kullanan React Native görünümlerinde gölgenin çalýþmasý için dýþarýya ikinci bir sarýcý View katmaný uygulandý.
3. **Expo Native Crash Çözümü:** xpo-image-picker SDK 50+ sürümündeki katý JSMediaTypes casting kuralýna takýlarak profil fotoðrafý yüklerken uygulamanýn çökmesi hatasý giderildi ('image' parametresi array içerisinde 'images' olarak düzeltildi).
4. **Baðýmlýlýk Ýhlali:** MuhasebecimScreen içerisinde geçersiz noktalanan import dizini (../../../../../shared) onarýlarak uygulamanýn derlenmesi saðlandý.

## ?? Proje Dizinleri ve Depolar (Repositories)
- **Web (Next.js):** C:\Users\roman\flowweb (GitHub: https://github.com/cicicarscom-pixel/flowweb)
- **Mobil (React Native):** C:\Users\roman\flow (GitHub: https://github.com/cicicarscom-pixel/flow)

### [28.08.2026] Web ve Mobil "Canli Test" (AI Asistan) Esitlemesi ve Edge Function Onarimi
1. **Canli Test Web Entegrasyonu:** Web (Next.js) arayuzundeki `ai-asistan/page.tsx` icerisindeki statik Canli Test tasarimi, dinamik bir chat uygulamasina donusturuldu.
2. **Edge Function (Gemini) Uyumu:** Mobil uygulamada (`usePlayground.ts`) kullanilan `gemini-chat` Supabase Edge Function API yapisi incelenerek, web tarafindaki istek yapisi da mobil ile ayni standarda (`mode: 'playground'`) getirildi.
3. **Ai Muhasebe (Ledger) Edge Function Duzeltmesi:** `gemini-chat` Edge Function'inin (`ledger` deposunda yer alan) gelen tum istekleri (mode fark etmeksizin) fatura formatinda (Ai Muhasebe) JSON olarak yanitladigi fark edildi. Fonksiyon onarilarak `mode === 'playground'` durumunda normal sohbet (chat) donecek sekilde guncellendi ve deploy edildi.
4. **Proje Hafizasi Guncellemesi:** Web ve Mobil projelerin klasor dizinleri sistem hafizasina (AGENTS.md) islendi.

### [30.08.2026] WAHA Engine Krizi & AI Business Services (Hizmet Ayarlarý) Pipeline
1. **WAHA (WhatsApp) Engine Deðiþimi & Çifte Yanýt Çözümü:**
   - WhatsApp'ýn güncellenen DOM yapýsý sebebiyle WAHA konteynerindeki (Puppeteer tabanlý) WEBJS motorunun sürekli çökmesi ve QR kodun týkanmasý sorunu teþhis edildi. Motor NOWEB (Baileys tabanlý) olarak deðiþtirildi.
   - NOWEB motorunun mesajlarý çifte iþlemesini önlemek için, WAHA webhook fonksiyonunun (waha-webhook/index.ts) yalnýzca event === 'message' dinlediði teyit edildi (mesaj baþý tek iþleme). Ayrýca NOWEB formatýndaki fallback'ler (payload.data?.from) koda eklendi.
   - Üretim ortamýný kirleten (Dashboard'a düþen) koþulsuz DEBUG_WEBHOOK loglarý silinerek veri temizliði saðlandý.
2. **AI Ýþletme Hizmetleri (Business Services) Mimarisi:**
   - **Veritabaný:** Ledger deposunda yeni bir migration (20260830100000_business_services.sql) oluþturuldu. usiness_services tablosu merchant_id tenant yapýsýyla korumaya alýndý.
   - **Web (Flowweb):** Next.js Server Components, Server Actions (src/actions/businessServices.ts) ve SSR kurallarýna (wait createClient()) uygun Client Component (HizmetAyarlariClient) entegre edildi. Flow panelinden dinamik hizmet kaydý aktif edildi.
   - **Backend/AI (Ledger):** AI Asistanýnýn hizmetleri okumasý için ListBusinessServicesTool.ts gerçek tablo verilerine baðlandý.
3. **?? Kritik Mimari Kural (LLM Empty State Hallucination Korumasý):**
   - Tool'larýn (araçlarýn) boþ veri döndürmesi durumunda LLM'in o boþluðu (örn: hizmet listesi) varsayýlan verilerle (cilt bakýmý, manikür vb.) uydurarak doldurmasýný (halüsinasyon) engellemek adýna, ListBusinessServicesTool içerisine **sistem notu** (system_note) eklendi.
   - Kural: Eðer liste boþsa, AI'a doðrudan "Sistemde hizmet yok, asla uydurma, 'hizmet bulunmamaktadýr' de" komutu data payload'ýnýn içinde system_note olarak iletilir. Bu yöntem tüm dinamik liste çeken AI araçlarýnda standart olarak uygulanmalýdýr.
## ðŸš¨ Kritik Kural: Fonksiyon SahipliÄŸi ve Ä°simlendirme (31.08.2026)

Her Supabase Edge Function'Ä±n TEK bir sahibi vardÄ±r, isminden bellidir:

**ledger- Ã¶neki â†’ Ledger'a ait, mali mÃ¼ÅŸavir/muhasebe amaÃ§lÄ±, ASLA DOKUNULMAZ:**
| Fonksiyon | AmaÃ§ |
|---|---|
| ledger-ai-chat | Mali mÃ¼ÅŸavir â†” mÃ¼kellef sohbet kÃ¶prÃ¼sÃ¼ (ÅŸu an client'tan Ã§aÄŸrÄ±lmÄ±yor, yetim) |
| ledger-process-document | Belge iÅŸleme |
| mutabakat-chat | Mutabakat sohbeti |
| ledger-generate-schema | Åžema Ã¼retimi |
| ledger-isleyici-api | Ä°ÅŸleyici API |
| ledger_mimar_google_api | Google API entegrasyonu |
| ledger-gemini-chat | Fatura/iÅŸlem fotoÄŸrafÄ± â†’ JSON (eski gemini-chat'in muhasebe kÄ±smÄ±) |

**low- Ã¶neki veya persona-engine'e Ã¶zgÃ¼ isimler â†’ Flow'a ait, sosyal medya + WhatsApp/
Instagram mÃ¼ÅŸteri iliÅŸkileri, serbestÃ§e geliÅŸtirilebilir:**
| Fonksiyon | AmaÃ§ |
|---|---|
| flow-gemini-chat | Sosyal medya gÃ¶nderi metni (caption) Ã¼retimi |
| persona-test | CanlÄ± Test / persona Ã¶nizleme (executionMode: simulation) |
| waha-webhook | WhatsApp gerÃ§ek mÃ¼ÅŸteri mesajlarÄ± â†’ AIOrchestrator |
| zernio-webhook | Instagram/sosyal medya gerÃ§ek mÃ¼ÅŸteri mesajlarÄ± â†’ AIOrchestrator |

KURAL: Yeni bir fonksiyon eklerken Ã¶nce hangi platforma ait olduÄŸuna karar ver, ismini
buna gÃ¶re Ã¶nekle (ledger- veya flow-), ve eÄŸer ledger- ise yukarÄ±daki yasaklÄ± listeye
ekle. Ä°ki platformun aynÄ± fonksiyonu paylaÅŸmasÄ± (eski gemini-chat'in baÅŸÄ±na geldiÄŸi gibi)
KESÄ°NLÄ°KLE YAPILMAZ â€” paylaÅŸÄ±m, bir platform iÃ§in yapÄ±lan dÃ¼zeltmenin diÄŸerine yanlÄ±ÅŸlÄ±kla
dokunulmasÄ±na yol aÃ§ar.

## Phase 6 (August 31 2026)
**Note:** Drive/RAG feature development is currently an end-to-end placeholder and has been formally POSTPONED per user decision. Do not attempt to wire up actual embeddings, PGVector, or vector search logic until explicitly instructed to resume.


### Conversation Summary (31.08.2026)
- **Phase 5 (Customer CRM & Recognition)**: Identified that the AI couldn't save customer names because the DB didn't support it in the flow. Upgraded `appointments` and `customers` tables. Added returning customer recognition so AI skips asking names for known users. Built the 'Müþteriler' page in Flowweb to display the CRM data.
- **Phase 6 (TAM PAKET - AI Appointment & Culture)**: Implemented a robust 13-step plan. Added an ON/OFF toggle for the appointment module to `organization_ai_settings` and Flowweb. Created the `UpdateAppointmentTool` to reschedule slots without duplicating appointments. Added automatic merchant notifications for appointment actions. Improved the prompt builder to strictly use Turkish/English cultural addressing (e.g., 'Bey', 'Haným', 'Mr.') and ignore raw '@lid' WA IDs.
- **Troubleshooting**: Fixed a leftover syntax error (unclosed bracket) in `whatsapp-webhook/index.ts` that was breaking all edge function deployments. Fixed a Next.js server component `createClient(cookies())` type error that was causing Vercel builds to fail, and installed missing dependencies (`country-state-city`, `react-easy-crop`).
- **RAG Notice**: Documented that Drive/RAG feature development is postponed by user decision.



## ðŸš¨ Kritik Kural: Deploy SÃ¼reci ve YasaklÄ± Fonksiyonlar
Deploy komutlarÄ± ASLA toplu (supabase functions deploy argÃ¼mansÄ±z) Ã§alÄ±ÅŸtÄ±rÄ±lmaz, her zaman hedef fonksiyon adÄ±yla tek tek Ã§alÄ±ÅŸtÄ±rÄ±lÄ±r. Deploy sÄ±rasÄ±nda yasaklÄ± veya hedef dÄ±ÅŸÄ± bir fonksiyonda hata Ã§Ä±karsa, o dosyaya dokunulmaz â€” durum olduÄŸu gibi raporlanÄ±r ve talimat beklenir.

| flow-reset-ai-data | Test/mÃ¼ÅŸteri veri sÄ±fÄ±rlama â€” sadece organization_id/profile_id/merchant_id filtresiyle Ã§alÄ±ÅŸÄ±r, baÄŸlantÄ± verilerine (bot_settings, social_accounts) dokunmaz. |
