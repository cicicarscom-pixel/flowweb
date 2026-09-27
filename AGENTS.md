
## 🔄 AKTARIM NOTU (HANDOVER) - 27 EYLÜL 2026 (İptal/Silme Modülü Tamamlandı)

**Şu Anki Durum:**
Randevu modüllerinde Web ve Mobil tarafında eşitlik sağlandı ve "İptal Et" / "Kalıcı Olarak Sil" arayüzleri, RPC'ler üzerinden (cancel_appointment, delete_appointment) başarılı bir şekilde entegre edildi. DB update işlemleri frontend'den tamamen kaldırıldı.

**Web (flowweb) Durumu:**
- İptal edilen randevular kartlarda "İptal Edildi" (gri rozet) ve iptal nedeni etiketiyle gösteriliyor.
- Randevu listesindeki sorguya `Cancelled` statüsü dahil edildi (`getAppointmentsByDate`).
- UI Modal bildirimleri, zaman dilimi hatalarını çözen cihaz yereline bağlandı.

**Mobil (flow) Durumu:**
- `DashboardScreen.js` üzerinde bildirim çanının yanlış sekmeyi açması çözülüp, `Inbox > Bildirimler` doğrudan bağlandı.
- `RandevuScreen.js`'de randevu kartı içine "⋮" ActionSheet eklendi. Silme (Alert) ve İptal Nedenli (promptConfig) akışlar tamamlandı.

**Kalan / Yapılacak İşler (Faz 4/5 için):**
1. Persona modülündeki sessiz kısmi başarıların kontrolü.
2. Hizmet sorgusuna açık işletme (merchant) filtresi eklenmesi.
3. Common Scheduling Core (Merkezi saat üretimi) ve taslak mekanizması.

# Workigom Flow � Agent Kurallar� ve Proje Haf�zas�

## ?? Kritik Kural: Ortak Veritaban� Etkile�imi (Web & Mobil)

**Web ve Mobil versiyonlar AYNI (Supabase) veritaban�n� payla�maktad�r.** 
- Web taraf�nda bir veritaban� (�ema, tablo, edge function) veya query de�i�ikli�i yapt���n�zda, bunun Mobil (React Native) uygulamas�n� da do�rudan etkileyece�ini ve bozabilece�ini DA�MA hesaba kat�n.
- Herhangi bir API metodolojisi (`.single()` vb.) veya veri modeli de�i�ikli�i yapmadan �nce, bunun her iki platformdaki koda nas�l yans�yaca��n� kontrol edin.

## ?? Kritik Kural: Expo SDK

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

## ?? Kritik Kural: Dependency Injection

**`tsyringe` KULLANILMAMAKTADIR ve kullan�lMAYACAKTIR.**

- `@injectable()`, `@inject()`, `reflect-metadata` � **KES�NL�KLE YASAK**
- Hermes JS Engine bu dekorat�rleri desteklemez � Build patlar
- T�m ba��ml�l�klar `src/core/container.ts` i�indeki **manuel singleton** sistemiyle y�netilir

### Yeni servis/repository eklemek i�in:

```typescript
// 1. src/core/container.ts i�inde singleton olu�tur
const myNewRepository = new MyNewRepository();

// 2. resolve() switch'ine ekle (string key veya class ref ile)
if (cls === 'MyNewRepository') return myNewRepository;
if (cls === MyNewUseCase) return myNewUseCase;
```

---

## ??? Mimari Yap�

### Proje Teknolojileri

- **Frontend**: React Native 0.86, Expo SDK 57, React 19, React Navigation v7
- **Backend**: Supabase (PostgreSQL + Realtime + Edge Functions)
- **Auth**: Supabase Auth + AsyncStorage
- **DI**: Manuel container (`src/core/container.ts`) � tsyringe YOK
- **Stil**: NativeWind v2 + Tailwind CSS v3, StyleSheet + Glassmorphism, renk paleti `#131315` (bg) / `#4edea3` (primary)

### Katman Kurallar� (Clean Architecture)

```
Domain  � Application � Infrastructure � Presentation
```

- **Domain**: Sadece saf TypeScript. React/Supabase import YOK.
- **Application**: UseCase'ler. Sadece interface'lere ba��ml�, concrete class import YOK.
- **Infrastructure**: Supabase, WAHA, Zernio implementasyonlar�.
- **Presentation**: React Native ekranlar� ve hook'lar. Container �zerinden UseCase �a��r�r.

### Mod�l Yap�s�

```
src/
+�� core/
-   +�� container.ts          � Manuel DI container (singleton'lar burada)
-   L�� navigation/
-       +�� AppNavigator.js   � Root navigator
-       L�� TabNavigator.js   � Tab bar + nested stacks
-
+�� shared/
-   +�� lib/supabase.js       � Supabase client (createClient)
-   +�� errors/               � AppError, NetworkError, ValidationError...
-   L�� ui/                   � Payla��lan UI bile�enleri
-
L�� modules/
    +�� randevu/              � ?? Randevu y�netimi
    +�� muhasebe/             � ?? AI muhasebe
    L�� sosyal_medya/         � ?? Bot y�netimi + sosyal medya
```

---

## ?? Randevu Mod�l� � Haf�za Notlar�

### Ekranlar ve Navigasyon

```
BotYonetimiScreen
  L�> RandevuScreen        (stack: "RandevuMain")
        L�> HizmetAyarlariScreen  (stack: "HizmetAyarlari")
```

Navigasyon: `TabNavigator.js` i�indeki `BotYonetimiStack` alt�nda t�m 3 ekran tan�ml�.

### RandevuScreen �zellikleri

- `stickyHeaderIndices={[0]}` � Calendar + Heatmap her zaman ekranda sabit
- Takvim �eridi: yatay kayd�r�labilir, se�ili g�n ye�il/b�y�k
- Heatmap: 3 sat�r (Sabah/��le/Ak�am), 30 dakikal�k slotlar, t�m sat�rlar birlikte kayar
- Timeline: `useAppointments` hook'undan gelen ger�ek DB verisi
- FAB: Nab�z atan animasyonlu `+` butonu (tab bar + insets �zerinde)

### useAppointments Hook (src/modules/randevu/presentation/hooks/useAppointments.ts)

```typescript
const { appointments, loading, isSlotBusy, selectedDate, setSelectedDate } = useAppointments();
```

- `container.resolve('AppointmentRepository')` ile repo al�r
- `selectedDate` de�i�ince `getAppointmentsByDate()` �eker
- `subscribeToAppointments()` ile Realtime dinler, unmount'ta temizler
- `isSlotBusy(timeSlot: string)` � o saatte Pending/Approved randevu var m�?
- `extractTime(dateStr)` � ISO/space-separated datetime'dan "HH:MM" ��kar�r

### SupabaseAppointmentRepository Metodlar�

| Metod | A��klama |
|-------|----------|
| `create()` | Yeni randevu olu�tur |
| `approve(id)` | Randevu onayla |
| `cancel(id)` | Randevu iptal et |
| `findByToken(token)` | Token ile randevu bul |
| `findAvailableHours(date, serviceId)` | M�sait saatleri listele |
| `getAppointmentsByDate(date)` | G�ne g�re randevular� �ek |
| `subscribeToAppointments(date, cb)` | Realtime dinle, unsubscribe fn d�ner |

### Supabase Realtime

- Table: `appointments`
- Publication: `supabase_realtime` � appointments tablosu ekli olmal�
- Filter: `date=eq.${date}` � sadece se�ili g�n�n de�i�ikliklerini dinler
- Her event'te t�m liste yeniden �ekilir (tutarl�l�k garantisi i�in)

---

## ?? Tasar�m Sistemi

### Renk Paleti (Dark Theme)

```
Background:   #131315
Surface:      rgba(32,31,34,0.4)  (glassmorphism)
Primary:      #4edea3  (ye�il vurgu)
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

### FAB Konumland�rma (Tab Bar �st�nde)

```javascript
const insets = useSafeAreaInsets();
const tabBarBottom = Math.max(insets.bottom + 10, 20);
const tabBarHeight = 64;
const fabBottom = tabBarBottom + tabBarHeight + 14;
// fab: { position: 'absolute', bottom: fabBottom, right: 18 }
```

---

## ?? Supabase Yap�land�rmas�

### Client (src/shared/lib/supabase.js)

```javascript
import 'react-native-url-polyfill/auto';      // ZORUNLU � React Native'de URL.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true } }
);
```

### .env De�i�kenleri

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## ?? Bilinen Sorunlar ve ��z�mleri

| Sorun | ��z�m |
|-------|-------|
| `TypeInfo not known for "X"` | tsyringe kal�nt�s� var. `container.resolve(X)` ile resolve et, `@injectable` kald�r |
| `declare class` TypeScript hatas� | Babel TypeScript plugin s�ras� sorunu. `tsyringe` kald�r, `reflect-metadata` import etme |
| `Element type is invalid: got undefined` | Named/default export kar���kl���. Component export'lar�n� kontrol et |
| `SafeAreaView has been deprecated` | `react-native-safe-area-context`'ten import et, `react-native`'den de�il |
| FAB tab bar'�n alt�nda kal�yor | `useSafeAreaInsets` kullan, hardcoded bottom de�eri verme |
| Realtime �al��m�yor | Supabase panelinde `supabase_realtime` publication'a tabloyu ekle |

---

## ?? Navigasyon Yap�s�

```
App.js
L�� AppNavigator (Stack)
    +�� AuthScreen
    L�� TabNavigator (Bottom Tabs)
        +�� Tab: Dashboard
        +�� Tab: Muhasebe � AiMuhasebeScreen
        +�� Tab: BotYonetimi (BotYonetimiStack)
        -   +�� BotYonetimiScreen    ("BotYonetimiMain")
        -   +�� RandevuScreen        ("RandevuMain")
        -   L�� HizmetAyarlariScreen ("HizmetAyarlari")
        L�� Tab: SosyalMedya
```

---

## ?? �nemli Paketler

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

## ?? Son Geli�tirme G�nl��� (25 Temmuz 2026)

### Yap�lan De�i�iklikler ve ��z�len Hatalar:
1. **Paket Temizli�i:** `tsyringe`, `reflect-metadata` ve gereksiz Babel decorator plugin'leri `package.json`'dan kald�r�ld�.
2. **Konfig�rasyon Temizli�i:** `tsconfig.json` dosyas�ndaki `experimentalDecorators` ve `emitDecoratorMetadata` flag'leri kald�r�ld�.
3. **Dok�mantasyon Senkronizasyonu:** AGENTS.md dosyas� mevcut teknoloji y���n�na (Expo 57 / RN 0.86 / React 19) g�re g�ncellendi.
4. **Mimari D�zenlemeler:** Eksik `index.ts` dosyalar� (randevu, persona_engine, business-profile) olu�turuldu. BotYonetimiScreen'deki derin (deep) import kural ihlalleri barrel export �zerinden tek sat�ra indirgendi.
5. **Container Ba�lant�lar�:** Eksik olan `wahaService` ve `transactionRepository` container DI sistemine resolve olarak eklendi. `container` nesnesi `core/index.ts` �zerinden d��a aktar�ld�.

---

## ?? Ge�mi� Geli�tirme G�nl��� (5 Temmuz 2026)

### Yap�lan De�i�iklikler ve ��z�len Hatalar:
1. **Zernio Client ve Analytics Cache G�ncellemesi:** Supabase Edge Functions alt�ndaki `ZernioClient.ts` dosyas� g�ncellenerek sosyal medya platformlar� (YouTube, LinkedIn, Instagram, Google Business, vb.) i�in analytics metotlar� �nbellekleme (cache) deste�i ile entegre edildi.
2. **Hata Y�netimi ve Silme ��lemi:** Zernio hesab�n� ay�rma (`disconnect-account`) i�lemi do�rudan ZernioClient i�indeki metoda ba�land�.
3. **Veritaban� Migration'�:** Analytics cache i�in yeni bir Supabase veritaban� migration'� (`20260705000000_analytics_cache.sql`) olu�turuldu.
4. **Ba��ml�l�klar:** `package.json` ve `package-lock.json` dosyalar� g�ncellendi.

---

## ?? Ge�mi� Geli�tirme G�nl��� (27 Haziran 2026)

### Yap�lan De�i�iklikler ve ��z�len Hatalar:
1. **GitHub Senkronizasyonu:** Local `master` dal� `origin/master` ile g�ncel olmas�na ra�men en son g�ncellemelerin (Randevu Realtime, RAG Drive senkronizasyonu, dual prompt ve RGB border) `origin/main` dal�nda oldu�u fark edildi. Local repo `main` dal�na ge�irilerek g�ncel kod �ekildi.
2. **Randevu Mod�l� i18n:** `RandevuScreen.js` ve `HizmetAyarlariScreen.js` ekranlar�ndaki t�m hardcoded T�rk�e kelimeler temizlenerek `tr.json`, `en.json` ve `de.json` dosyalar�na ba�land�. `useTranslation` hook'u ile dinamik yerelle�tirme tamamland�.
3. **Animated Ref Render Eri�imi ��z�ld�:** `RandevuScreen.js` ve `AiUretimScreen.js`'deki Animated Value'lar�n render esnas�nda ref �zerinden `.current` olarak okunmas� nedeniyle linter'�n f�rlatt��� `Cannot access refs during render` hatas�, `useState` tabanl� `Animated.Value` tan�mlamas�na ge�ilerek tamamen ��z�ld�.
4. **TypeScript Path Aliases & Anti-Bypass Entegrasyonu:** `tsconfig.json` dosyas�nda `@domain/*`, `@application/*`, `@infrastructure/*` ve `@presentation/*` alias'lar�na `randevu` mod�l� dahil edildi. Projedeki t�m relative path import'lar path alias'lar�na ge�irilerek ESLint'in `no-restricted-imports` (Anti-Bypass) kural� ye�ile �ekildi.
5. **Kapsaml� Linter Kontrol�:** `npm run lint` �al��t�r�larak t�m 42 hata giderildi ve linter **0 hata** ile tamamland�.
6. **Sistem Talimat� Kart�na G�k Mavisi Neon �er�eve ve D�nen Aura G�lgesi Entegrasyonu:** 
    - `BotYonetimiScreen.js` i�indeki Sistem Talimat� kart�na, kart�n t�m kenarlar�n� e�it kal�nl�kta kaplayan (`borderWidth: 1.5`) solid `#00a2ff` (g�k mavisi) renginde s�rekli parlayan neon bir s�n�r �izgisi uyguland�.
    - **D�nen Aura G�lgesi (blue_glow):** Yumu�ak ge�i�li g�k mavisi, lacivert ve turkuaz tonlar�ndan olu�an dairesel bir conic gradient resim (`blue_glow.png`) �retildi. Bu resim kart�n arkas�na yerle�tirilerek native `blurRadius={12}` ile bulan�kla�t�r�ld� ve 8 saniyelik lineer bir d�ng�de d�nen bir `Animated.View` ile d�nd�r�lerek kart etraf�nda d�nen/dola�an hareketli bir mavi aura g�lgesi elde edildi.
    - **Yuvarlat�lm�� K��eler ve Bo�luk D�zenlemesi:** Ana `ScrollView` bile�enine `contentContainerStyle={{ paddingHorizontal: 16 }}` uygulanarak kartlar�n ekran kenarlar�na yap��mas� �nlendi ve mavi �izginin `borderRadius: 20` olan yuvarlat�lm�� k��eleri g�r�n�r k�l�nd�.
    - **�� �er�eve/Siyah-Gri G�lge S�z�nt�s�n�n �nlenmesi (Solid Background):** Kart�n arka plan� yar� saydam yerine tamamen opak koyu gri (`#1c1b1d`) olarak g�ncellendi. Bu sayede Android shadow motorunun `elevation` nedeniyle kart�n arkas�nda olu�turdu�u koyu sistem g�lgesinin cam katman�n i�inden s�zarak mavi �izginin alt�nda ikinci bir koyu �er�eve olu�turmas� (shadow bleed-through) engellendi.
    - Kart i�i haz�r rol preset butonlar�n�n aktif kenarl�k/yaz� renkleri de turkuazdan `#00a2ff` (g�k mavisi) tonuna g�ncellenerek g�rsel uyum tamamland�.
    - "AI Karakter Talimat�" (`botInstruction`) kutusu `height: 280` olarak (eski 140px de�erinden 2 kat daha b�y�k) sabitlendi ve `showsVerticalScrollIndicator={true}` eklenerek yap��t�r�lan uzun metinlerde kutunun b�y�mesi �nlenip yan kayd�rma �ubu�u ile gezilebilmesi sa�land�.















---

## ?? AI Muhasebe � Haf�za Notlar� (18 Temmuz 2026)

### 1. 4 Fazl� AI Fatura Entegrasyonu Mimari Kararlar�
Flow (M�kellef) ile Ledger (M��avir) aras�ndaki entegrasyon i�in 4 fazl� ak�� kabul edildi:
1. **Veri Yakalama (Flow):** Fatura foto�raf�/PDF'i y�klenir, Gemini AI JSON olarak veriyi ayr��t�r�r.
2. **Proaktif Chat (Flow):** AI m�kellefe faturan�n t�r�ne g�re soru sorar:
   - Al�� Faturas�: "�dendi mi?" (Evet/Hay�r) -> Hay�r ise "Tarih?"
   - Sat�� Faturas�: "Tahsil edildi mi?" (Evet/Hay�r) -> Hay�r ise "Tarih?"
3. **Draft Kuyru�u (Flow -> Backend):** Veriler do�rudan \	ransactions\ tablosuna yaz�lmaz. Yeni olu�turulan \submit-accounting-draft\ Edge Function'� ile \ccounting_drafts\ tablosuna "pending_approval" stat�s� ile iletilir. Mobil uygulaman�n do�rudan DB yazma yetkisi (RLS) k�s�tland�.
4. **M��avir Onay� (Ledger):** M��avir kendi ekran�nda bu draft'lar� Split-View (G�rsel + Data) olarak inceler, onaylayarak \	ransactions\ tablosuna aktar�r.

### 2. T�rkiye (TR-TR) Fatura Ayr��t�rma �emas� Kesin Kurallar�
- **D�z (Flat) JSON:** �� i�e obje kullan�lmayacak. T�m KDV ve matrah alanlar� (1, 8, 10, 18, 20) do�rudan \at1Base\, \at1Amount\ �eklinde d�nd�r�lecek. Bulunmayan veriler \ \ (s�f�r) olacak, \
ull\ veya bo� string d�n�lmeyecek.
- **��lem Y�n� (\invoiceType\):** Belgedeki al�c�/sat�c� VKN'si ile Flow kullan�c�s�n�n (i�letmenin) VKN'si kar��la�t�r�lacak. ��letme al�c�ysa \purchase_invoice\, sat�c�ysa \sales_invoice\ d�necek.
- **A��klama (\description\):** Sadece kar�� taraf�n firma ad� kullan�lacak. �r�n, hizmet, i�lem �zeti uydurulmayacak veya eklenmeyecek.
- **Tevkifat:** Varsa aynen "1/10" gibi string olarak yaz�lacak.
- **Matematiksel Uyum:** Uyu�mazl�k durumunda veriler de�i�tirilmeyecek, JSON i�indeki \eviewFlags\ dizisine \AMOUNT_MISMATCH\ eklenecek.

### [26.07.2026] Yap�lan Son G�ncellemeler
- **Veritaban� Uyumsuzluklar� Giderildi:** `transactions` tablosundaki ge�ersiz `name` s�tunu kod baz�nda temizlendi. AI Asistan�n d�nd�rd��� `title`, `type` ve `status` alanlar�n�n `SupabaseTransactionRepository` ve `TransactionMapper` taraf�ndan sorunsuz i�lenip veritaban�na eklenmesi sa�land�. Veritaban�ndaki eski migration �ak��malar� temizlendi.
- **OdemeTakvimiScreen Yeni Tasar�m:** `OdemeTakvimiScreen`, grid yap�s�ndan "Neo-Fintech Noir" tarz�, dikey listeli ve Gelir/Gider olarak ikiye b�l�nm�� kart tasar�m�na ge�irildi. Giderler k�rm�z� (`#ff3b30`), gelirler ye�il (`#22c55e`) olarak renklendirildi.
- **Filtreleme Mant��� D�zeltildi:** Takvim ekran�nda i�lemlerin hem gelir hem gidere d��mesine neden olan `t.amount > 0` �art� kald�r�larak; `t.type === 'income'` / `'sales'` (gelir) ve `t.type === 'expense'` / `'ALIS'` (gider) kurallar�yla kesin bir ayr�m yap�ld�.
- **Ger�ek Zamanl� G�ncelleme:** `AiMuhasebeScreen` (Dashboard), `transactions` tablosuna yap�lan eklemeleri de dinleyecek (realtime subscription) �ekilde geni�letildi ve `useFocusEffect` ile ekran a��ld�k�a verilerin an�nda g�ncellenmesi garantilendi.

## ?? Ge�mi� Geli�tirme G�nl��� (28 Temmuz 2026) - WAHA/Zernio Ayr�m� & Zernio Medya Optimizasyonu
### Yap�lan De�i�iklikler ve Mimari Kararlar:
1. **Zernio Medya Y�kleme Optimizasyonu (Backend):** Ai_muhasebeci/supabase i�indeki zernio-client edge fonksiyonu, resimleri base64/url olarak g�ndermek yerine Zernio Media API'sine y�kleyip 'mediaIds' dizisi ile g�nderecek �ekilde optimize edildi.
2. **Zernio Fallback Cron (Backend):** Her gece 03:00'da ka��r�lan Zernio mesajlar�n�/yorumlar�n� e�itlemek i�in 'pg_cron' kullanan yeni bir Supabase SQL migration dosyas� olu�turuldu.
3. **Abonelik Mimarisine Haz�rl�k (Sosyal Medya Asistan�):** Basic (Sadece WhatsApp/WAHA) ve Premium (Tam sosyal medya/Zernio) paket ayr�m� karar� al�nd�. Bu kapsamda 'Sosyal Medya Asistan�' �alteri, BotYonetimiScreen ekran�ndan s�k�lerek do�rudan SosyalMedyaScreen ekran�na ta��nd�.
4. **WAHA Temel Talimat Alan�:** BotYonetimiScreen i�erisine kilitli olmayan (Basic pakete a��k) 'Asistan Talimat� Olu�tur' metin kutusu eklendi. Buraya girilen de�er do�rudan Custom Role (�zel Karakter) olarak WAHA system_instruction'�na beslenmek �zere ba�land�.


## ?? Son Geli�tirme G�nl��� (9 A�ustos 2026)

### Yap�lan De�i�iklikler ve ��z�len Hatalar:
1. **Zernio AI Yan�t Hatas� (Bug) D�zeltildi:** `HandleIncomingMessageUseCase.ts` i�erisindeki ZernioClient fonksiyon �a�r�lar� (sendMessage, likeComment, replyToComment) d�zeltilerek `.inbox` ve `.comments` alt mod�llerine y�nlendirildi. Bu sayede AI'�n Instagram'a yan�t verememesi (TypeError) sorunu ��z�ld�.
2. **�leti�im Raporlar� Senkronizasyonu:** `InboxScreen.js`'de silinen mesajlar�n ve yorumlar�n anasayfadaki (Dashboard) `ai_communication_logs` tablosundan da e� zamanl� olarak silinmesi sa�land�.
3. **Manuel Rapor Temizleme Butonu:** Dashboard �zerindeki `CommunicationLogsTable.js` bile�eninin alt�na, eski ve tak�l� kalm�� raporlar� temizlemek i�in bir "Raporlar� Temizle" butonu eklendi. ��lemin �al��mas� i�in `useCommunicationLogs.ts` hook'una `clearLogs` fonksiyonu yaz�ld�.
4. **Supabase RLS Policy Eklendi:** `ai_communication_logs` tablosu i�in eksik olan DELETE yetkisi (Row Level Security), yeni bir SQL migration dosyas� (`20260809223300_ai_communication_logs_delete_policy.sql`) olu�turularak canl� veritaban�na push edildi.

### [11.08.2026] Bildirimler Ekran� & AI Bildirim Altyap�s� (Flow)
1. **Bildirimler UI/UX:** Glassmorphism tasar�m stili ile \BildirimlerScreen.js\ olu�turuldu ve \AppNavigator\'a eklendi.
2. **Dinamik �an �konu:** \DashboardScreen\ �st men�s�ndeki bildirim �an�, veritaban�ndan okunmam�� bildirim say�s�n� al�p k�rm�z� bir rozet g�sterecek �ekilde g�ncellendi.
3. **Ger�ek Zamanl� Silme & Okuma:** Kullan�c�lar bildirimleri okuyabilir veya ��pe at�p Supabase'den silebilirler.
4. **AI Bildirim Entegrasyonu:** Ledger taraf�ndaki yapay zeka asistan�n�n isme veya profile �zel an�nda in-app bildirim atabilmesini sa�layan veritaban� altyap�s� ve ara�lar tamamland�.


### [14.08.2026] Web ve Mobil Platform UI/UX Senkronizasyonu
1. **Mobil Aray�z Web ile E�itlendi:** Web versiyonunda bulunan ��k, cam g�r�n�ml� yatay kayd�r�labilir (horizontal) Sosyal Medya hesap kartlar�, aynen Flow mobil (React Native) uygulamas�na uyarland�.
2. **Emoji �konlar ve Glow Efekti:** Standart marka ikonlar� iptal edildi; yerine Web versiyonunda kullan�lan emojiler (??, ?? vb.) getirildi ve kart etraf�ndaki neon parlama (glow) efekti %20 oran�nda g��lendirilerek �ok daha estetik bir g�r�n�m elde edildi.
3. **Dashboard Paritesi:** Web taraf�ndaki eski paneller temizlenip, g�ncel 'Son Aktiviteler' ve '�leti�im Raporlar�' Web Dashboard'a dahil edilerek Mobil ekranla tam senkron sa�land�.

### [15.08.2026] Çapraz Platform Veritabanı Senkronizasyonu & Hata Giderimleri
1. **Ai Randevu (Web):** Ai Randevu Yönetimi ekranındaki takvim günleri yana kaydırılabilir (drag-to-scroll) hale getirildi.
2. **Ortak Veritabanı Uyumsuzluğu (406 Hatası):** Dashboard ve AI Muhasebe (Web) ekranlarında, organizasyon üyelerini çeken .single() metotları boş sonuç dönebileceği için 406 Not Acceptable hatası veriyordu. Bunlar güvenli olan .maybeSingle() ile değiştirildi ve sıfır hata (No errors) durumuna ulaşıldı.
3. **Sosyal Medya Entegrasyonu (Web):** Web versiyonundaki "Hesap Bağla" uyarı mesajı kaldırılarak, mobil versiyondaki Supabase Edge Function (zernio-client) tabanlı güvenli Instagram/Zernio yetkilendirme linki alma ve yönlendirme sistemi web versiyonuna entegre edildi.
4. **Gelen Kutusu (Web):** Gelen Kutusu (/gelen-kutusu) ekranındaki comments tablosu sorgusunda yer alan geçersiz posts ilişkisi (posts(media_urls, title)) kaldırılarak sadece .select('*') bırakıldı ve "400 Bad Request" hatası giderildi. Tüm iletişim raporları sıfır hata ile yüklenebilir hale geldi.
5. **Agent Kuralları:** Web ve Mobil projelerin kalıcı hafızasına (AGENTS.md) çapraz veritabanı etkileşimi hakkında yeni "🚨 Kritik Kural: Ortak Veritabanı Etkileşimi" kuralı işlendi.

### [18.08.2026] Zernio Private Reply (Gizli DM) 24 Saat Kural� Optimizasyonu
1. **Web ve Mobil Private Reply Senkronizasyonu:** Yorumlara DM g�nderilirken ge�mi� bir sohbet bulundu�unda sistemin standart 'send-message' y�ntemine (Instagram'�n 24 saat aktif konu�ma kural�na) tak�l�p hata vermesi sorunu ��z�ld�. Art�k her iki platformda da bir yorumdan DM butonuna bas�ld���nda ge�mi�e bak�lmaks�z�n do�rudan (24 saat kural�n� delen) 'send-private-reply' metodu tetiklenmektedir. Mobil (React Native) uygulamaya da web versiyonu ile ayn� olan sat�ri�i (inline) �zel Yan�t g�nderme yetene�i entegre edildi.

### [19.08.2026] �apraz Platform Profil & M��avir Ba�lant�s� Senkronizasyonu
1. **Flow Web ve Mobil Profil Paritesi:** Web taraf�nda (/profil) ve Mobil taraf�nda (ProfilScreen) kullan�c� profilleri tamamen e�itlendi. Her iki platforma da "�irket Tam Ad�", "Vergi Numaras� (VKN)" ve "Vergi Dairesi" alanlar� eklendi.
2. **Ortak Veritaban� (Organization Legal Profiles):** Kullan�c�n�n VKN bilgileri \profiles\ tablosu yerine, do�rudan M��avirin (Ledger) g�rebilece�i \organization_legal_profiles\ tablosuna (kullan�c�n�n \organization_id\si �zerinden) ba�land�. B�ylece Esnaf bilgilerini g�ncelledi�inde M��avirin ekran�nda an�nda g�ncelleniyor.
3. **Muhasebecim Aray�z� (Ger�ek Veri):** Hem Web hem de Mobil "Muhasebecim" ekranlar�ndaki sahte zamanlay�c�l� (mock) g�rselle�tirme kald�r�larak, sayfa y�klendi�inde \ccountant_taxpayer_links\ tablosundan kullan�c�n�n ger�ekten bir m��avire ba�l� olup olmad��� sorgulanmaya ba�land�. Ba�lant� varsa otomatik "Ba�ar�yla Ba�land�" ekran� g�steriliyor.
4. **M��avir Ba�lant�s� Tetikleyicisi (PostgreSQL Trigger):** M��avir (Ledger �zerinden) yeni bir m�kellef ba�lad���nda Esnafa otomatik anl�k bildirim f�rlatmas� i�in \ccountant_taxpayer_links\ tablosuna bir \AFTER INSERT\ PostgreSQL tetikleyicisi eklendi.
5. **Gelen Kutusu Realtime Bildirimleri:** Web taraf�nda Gelen Kutusu sayfas�n�n \
otifications\ tablosu i�in Canl� Websocket (Realtime) aboneli�i eksikti. Bu eklendi; b�ylece asistan veya tetikleyici bir bildirim g�nderdi�inde kullan�c�n�n sayfas� yenilenmeden �an ikonu ve bildirim listesi g�ncelleniyor.
6. **Yapay Zeka VKN/�sim Arama Hata ��z�m�:** \ledger-ai-chat\ Edge fonksiyonunda T�rk�e karakterleri d�n��t�ren RegExp (replace) kodlamas�nda ya�anan UTF-8 bozulmas� giderildi. Yapay zeka art�k "YILMAZ �N�AAT TAAHH�T..." gibi uzun ve T�rk�e karakterli resmi adlar� veritaban�nda do�ru bir �ekilde % wildcard'a �evirerek e�le�tirebiliyor.
### [20.08.2026] V2 DDD Tablo Temizli�i ve Gelecek G�revler
1. **Gereksiz Tablolar Temizlendi**: V1 mimarisinden kalan taxpayers, invoices, invoice_schemas, ledger_chat_history tablolar� Supabase �zerinden kal�c� olarak silindi. Storage Avatar y�klemeleri i�in eksik RLS kurallar� eklendi.
2. **BUG�N YAPILACAKLAR (Bekleyen G�revler)**:
   - **G�rev 1:** Mobil/Web aras� profil foto�raf� (Avatar) senkronizasyonunun web (FlowWeb) taraf�nda hala g�r�nt�lenememesi sorunu (URL veya CORS/RLS kaynakl� olabilir) detayl�ca incelenip ��z�lecek.
   - **G�rev 2:** Veritaban�ndaki eski test kullan�c�lar� tamamen silinip temiz kullan�c�lar olu�turulacak.
   - **G�rev 3:** Supabase �zerinde Google Login (Google ile Giri� Yap) entegrasyonu aktif edilecek ve test edilecek.

### [21.08.2026] M��avir Profil & Ba�lant� Entegrasyonu (Flow & Ledger Senkronizasyonu)
3. **Ledger Profil Ekran�:** M��avirlerin kendi profil bilgilerini (��letme Ad�, Yetkili Ki�i Ad� Soyad�, Telefon vb.) d�zenleyebilecekleri ve galeriden Profil Foto�raf� y�kleyebilecekleri (Supabase Storage 'avatars' bucket �zerinden) �zel bir '/profil' ekran� eklendi.
4. **Flow Ba�lant� Kart�:** Esnaf�n (Flow) "Muhasebecim" sayfas�nda yer alan sahte zamanlay�c�l� ba�lant� g�r�n�m� kald�r�larak ger�ek veritaban�na ba�land�. Art�k aktif bir ba�lant� varsa do�rudan m��avirin g�ncel profili, i�letme ad� ve foto�raf� "Ba�l�" rozeti ile Glassmorphism kart�nda g�sterilmektedir.

### [22.08.2026] Dashboard Yapay Zeka Veri Ba�lant�lar� ve Profil Senkronizasyonu
1. **Flow Web ve Mobil (React Native) Dashboard G�ncellemeleri:** AI Asistan g�nl�k �zet kutusundaki ve Sosyal Medya etkile�im trendindeki g�rsel ama�l� sahte veriler (mock data) kald�r�ld�.
2. **Ger�ek Veritaban� ve Zernio API Entegrasyonu:** Flow projelerinde mesaj/yorum istatistikleri ve yakla�an randevular do�rudan ilgili Supabase tablolar�na; sosyal medya etkile�im b�y�mesi ise Zernio �zerinden ger�ek verilere ba�land�.
3. **Ledger Web Profil Yedekleme (Fallback) Sistemi:** Ledger uygulamas�nda, "Profil Bilgilerim" ekran�n�n form alanlar�nda veritaban� bo� olsa dahi (authorized_person, avatar_url) Google (OAuth) session'�ndan gelen verileri (user_metadata) varsay�lan olarak g�stermesi ve d�zg�n senkronize olmas� sa�land�.


## ?? Son Gelistirme Gunlugu (24 Agustos 2026) - Multi-Tenancy & Zernio Sync Fallback Mimarisi

### Yapilan Degisiklikler ve Mimari Kararlar:
1. **Multi-Tenancy & Zernio Sync (Organizasyon Fallback Sistemi):** Kullanicilarin Zernio ile senkronize olabilmesi icin gereken organizasyon baglantisinda (organization_members), bireysel (freelancer) kullanicilarin organizasyon kaydi bulunmamasi durumunda yasanilan Organizasyon bulunamadi hatasi giderilmistir.
2. **Kural:** Zernio Edge Functions (zernio-client, vb.) cagrilirken, kullanicinin bagli oldugu bir organization_id yoksa, zorunlu olarak kullanicinin kendi benzersiz kimligi (userId) izole bir kiraci (tenant) olarak kullanilarak (fallback) Zernioya iletilecektir. Boylece coklu kiraci (multi-tenancy) izolasyonu bozulmadan bireysel hesaplar da Zernioyu sorunsuz kullanabilir.
3. **Guvenilir Oturum Okumasi (Session Destructuring):** React Native tarafinda hot-reload ve onbellek kayiplari nedeniyle olusan gecersiz oturum hatalarini onlemek icin hatali getSession okumalari iptal edilmis, yerine garanti sunan supabase.auth.getUser metodu standart kabul edilmistir.### ?? Kritik Kural: Sosyal Medya (Zernio) Mimarisi ve �oklu Hesaplar

**Zernio Profile ? Workigom Organization**

Zernio'da bir "Profile", platform (Instagram, Facebook vs.) ba��na en fazla bir hesap alabilir. Ayn� profile ikinci bir Instagram hesab� ba�lan�rsa, ilk hesab�n �zerine yazar ve ge�mi� veriler kaybolur.

Bu veri kayb�n� �nlemek ve bir Workigom i�letmesine s�n�rs�z sosyal hesap ekleme yetene�i kazand�rmak i�in mimari ��yledir:

- **Workigom Organization** � ��erisinde 1..N adet **Zernio Profile** bar�nd�r�r.
- **Zernio Profile (Slot)** � Sadece platform ba��na 1 hesab�n yerle�tirildi�i teknik bir konteynerdir (Kullan�c�ya g�sterilmez).
- **Workigom Social Account** � Organizasyon alt�ndaki t�m sosyal hesaplar�n d�z (flat) listesidir. Ger�ek ccountId de�erleri �zerinden post at�l�r ve DM yan�tlan�r.

Yeni hesap eklendi�inde (esolve_zernio_profile_for_platform RPC ile) backend ilgili platform i�in bo� bir slot/profile arar; yoksa deterministic bir isim (wg_{org_id}_01) ve Idempotency-Key ile otomatik yeni profile olu�turur.
- **Frontend UI Kural� (Web & Mobil):** Zernio'nun �oklu profil yetene�inden faydaland���m�z i�in, kullan�c� "Yeni Hesap Ba�la" listesinde daha �nce ba�lad��� bir platformu (�r. Instagram) g�rmeye devam ETMEL�D�R. Frontend'de isConnected(platform) tabanl� filtreleme YAPILMAZ. Hangi Zernio profiline eklenece�i veya yeni profil a��l�p a��lmayaca�� tamamen backend esolveProfileForPlatform() sorumlulu�undad�r.

### [27.08.2026] Mobil Platform UI/UX ve Hata Giderimi
1. **Frontend Patch:** Mobil aray�zdeki hizalama hatalar�n� ��zen yap� low reposuna sorunsuz eklendi.
2. **Dashboard Neon UI:** Flow mobil uygulamas�n�n ana sayfas�nda yer alan yatay kayd�r�labilir g�rsel alan�na alttan ta�an neon mavi (#00a2ff) bir shadow glow eklendi. overflow: hidden kullanan React Native g�r�n�mlerinde g�lgenin �al��mas� i�in d��ar�ya ikinci bir sar�c� View katman� uyguland�.
3. **Expo Native Crash ��z�m�:** xpo-image-picker SDK 50+ s�r�m�ndeki kat� JSMediaTypes casting kural�na tak�larak profil foto�raf� y�klerken uygulaman�n ��kmesi hatas� giderildi ('image' parametresi array i�erisinde 'images' olarak d�zeltildi).
4. **Ba��ml�l�k �hlali:** MuhasebecimScreen i�erisinde ge�ersiz noktalanan import dizini (../../../../../shared) onar�larak uygulaman�n derlenmesi sa�land�.

## ?? Proje Dizinleri ve Depolar (Repositories)
- **Web (Next.js):** C:\Users\roman\flowweb (GitHub: https://github.com/cicicarscom-pixel/flowweb)
- **Mobil (React Native):** C:\Users\roman\flow (GitHub: https://github.com/cicicarscom-pixel/flow)

### [28.08.2026] Web ve Mobil "Canli Test" (AI Asistan) Esitlemesi ve Edge Function Onarimi
1. **Canli Test Web Entegrasyonu:** Web (Next.js) arayuzundeki `ai-asistan/page.tsx` icerisindeki statik Canli Test tasarimi, dinamik bir chat uygulamasina donusturuldu.
2. **Edge Function (Gemini) Uyumu:** Mobil uygulamada (`usePlayground.ts`) kullanilan `gemini-chat` Supabase Edge Function API yapisi incelenerek, web tarafindaki istek yapisi da mobil ile ayni standarda (`mode: 'playground'`) getirildi.
3. **Ai Muhasebe (Ledger) Edge Function Duzeltmesi:** `gemini-chat` Edge Function'inin (`ledger` deposunda yer alan) gelen tum istekleri (mode fark etmeksizin) fatura formatinda (Ai Muhasebe) JSON olarak yanitladigi fark edildi. Fonksiyon onarilarak `mode === 'playground'` durumunda normal sohbet (chat) donecek sekilde guncellendi ve deploy edildi.
4. **Proje Hafizasi Guncellemesi:** Web ve Mobil projelerin klasor dizinleri sistem hafizasina (AGENTS.md) islendi.

### [30.08.2026] WAHA Engine Krizi & AI Business Services (Hizmet Ayarlar�) Pipeline
1. **WAHA (WhatsApp) Engine De�i�imi & �ifte Yan�t ��z�m�:**
   - WhatsApp'�n g�ncellenen DOM yap�s� sebebiyle WAHA konteynerindeki (Puppeteer tabanl�) WEBJS motorunun s�rekli ��kmesi ve QR kodun t�kanmas� sorunu te�his edildi. Motor NOWEB (Baileys tabanl�) olarak de�i�tirildi.
   - NOWEB motorunun mesajlar� �ifte i�lemesini �nlemek i�in, WAHA webhook fonksiyonunun (waha-webhook/index.ts) yaln�zca event === 'message' dinledi�i teyit edildi (mesaj ba�� tek i�leme). Ayr�ca NOWEB format�ndaki fallback'ler (payload.data?.from) koda eklendi.
   - �retim ortam�n� kirleten (Dashboard'a d��en) ko�ulsuz DEBUG_WEBHOOK loglar� silinerek veri temizli�i sa�land�.
2. **AI ��letme Hizmetleri (Business Services) Mimarisi:**
   - **Veritaban�:** Ledger deposunda yeni bir migration (20260830100000_business_services.sql) olu�turuldu. usiness_services tablosu merchant_id tenant yap�s�yla korumaya al�nd�.
   - **Web (Flowweb):** Next.js Server Components, Server Actions (src/actions/businessServices.ts) ve SSR kurallar�na (wait createClient()) uygun Client Component (HizmetAyarlariClient) entegre edildi. Flow panelinden dinamik hizmet kayd� aktif edildi.
   - **Backend/AI (Ledger):** AI Asistan�n�n hizmetleri okumas� i�in ListBusinessServicesTool.ts ger�ek tablo verilerine ba�land�.
3. **?? Kritik Mimari Kural (LLM Empty State Hallucination Korumas�):**
   - Tool'lar�n (ara�lar�n) bo� veri d�nd�rmesi durumunda LLM'in o bo�lu�u (�rn: hizmet listesi) varsay�lan verilerle (cilt bak�m�, manik�r vb.) uydurarak doldurmas�n� (hal�sinasyon) engellemek ad�na, ListBusinessServicesTool i�erisine **sistem notu** (system_note) eklendi.
   - Kural: E�er liste bo�sa, AI'a do�rudan "Sistemde hizmet yok, asla uydurma, 'hizmet bulunmamaktad�r' de" komutu data payload'�n�n i�inde system_note olarak iletilir. Bu y�ntem t�m dinamik liste �eken AI ara�lar�nda standart olarak uygulanmal�d�r.
## 🚨 Kritik Kural: Fonksiyon Sahipliği ve İsimlendirme (31.08.2026)

Her Supabase Edge Function'ın TEK bir sahibi vardır, isminden bellidir:

**ledger- öneki → Ledger'a ait, mali müşavir/muhasebe amaçlı, ASLA DOKUNULMAZ:**
| Fonksiyon | Amaç |
|---|---|
| ledger-ai-chat | Mali müşavir ↔ mükellef sohbet köprüsü (şu an client'tan çağrılmıyor, yetim) |
| ledger-process-document | Belge işleme |
| mutabakat-chat | Mutabakat sohbeti |
| ledger-generate-schema | Şema üretimi |
| ledger-isleyici-api | İşleyici API |
| ledger_mimar_google_api | Google API entegrasyonu |
| ledger-gemini-chat | Fatura/işlem fotoğrafı → JSON (eski gemini-chat'in muhasebe kısmı) |

**low- öneki veya persona-engine'e özgü isimler → Flow'a ait, sosyal medya + WhatsApp/
Instagram müşteri ilişkileri, serbestçe geliştirilebilir:**
| Fonksiyon | Amaç |
|---|---|
| flow-gemini-chat | Sosyal medya gönderi metni (caption) üretimi |
| persona-test | Canlı Test / persona önizleme (executionMode: simulation) |
| waha-webhook | WhatsApp gerçek müşteri mesajları → AIOrchestrator |
| zernio-webhook | Instagram/sosyal medya gerçek müşteri mesajları → AIOrchestrator |

KURAL: Yeni bir fonksiyon eklerken önce hangi platforma ait olduğuna karar ver, ismini
buna göre önekle (ledger- veya flow-), ve eğer ledger- ise yukarıdaki yasaklı listeye
ekle. İki platformun aynı fonksiyonu paylaşması (eski gemini-chat'in başına geldiği gibi)
KESİNLİKLE YAPILMAZ — paylaşım, bir platform için yapılan düzeltmenin diğerine yanlışlıkla
dokunulmasına yol açar.

## Phase 6 (August 31 2026)
**Note:** Drive/RAG feature development is currently an end-to-end placeholder and has been formally POSTPONED per user decision. Do not attempt to wire up actual embeddings, PGVector, or vector search logic until explicitly instructed to resume.


### Conversation Summary (31.08.2026)
- **Phase 5 (Customer CRM & Recognition)**: Identified that the AI couldn't save customer names because the DB didn't support it in the flow. Upgraded `appointments` and `customers` tables. Added returning customer recognition so AI skips asking names for known users. Built the 'M��teriler' page in Flowweb to display the CRM data.
- **Phase 6 (TAM PAKET - AI Appointment & Culture)**: Implemented a robust 13-step plan. Added an ON/OFF toggle for the appointment module to `organization_ai_settings` and Flowweb. Created the `UpdateAppointmentTool` to reschedule slots without duplicating appointments. Added automatic merchant notifications for appointment actions. Improved the prompt builder to strictly use Turkish/English cultural addressing (e.g., 'Bey', 'Han�m', 'Mr.') and ignore raw '@lid' WA IDs.
- **Troubleshooting**: Fixed a leftover syntax error (unclosed bracket) in `whatsapp-webhook/index.ts` that was breaking all edge function deployments. Fixed a Next.js server component `createClient(cookies())` type error that was causing Vercel builds to fail, and installed missing dependencies (`country-state-city`, `react-easy-crop`).
- **RAG Notice**: Documented that Drive/RAG feature development is postponed by user decision.



## 🚨 Kritik Kural: Deploy Süreci ve Yasaklı Fonksiyonlar
Deploy komutları ASLA toplu (supabase functions deploy argümansız) çalıştırılmaz, her zaman hedef fonksiyon adıyla tek tek çalıştırılır. Deploy sırasında yasaklı veya hedef dışı bir fonksiyonda hata çıkarsa, o dosyaya dokunulmaz — durum olduğu gibi raporlanır ve talimat beklenir.

| flow-reset-ai-data | Test/müşteri veri sıfırlama — sadece organization_id/profile_id/merchant_id filtresiyle çalışır, bağlantı verilerine (bot_settings, social_accounts) dokunmaz. |

### [01.09.2026] Mobil ve Web Modüllerinde Tasarım Eşitlemesi, CRM Entegrasyonu ve Bug Fix'ler
1. **Flow Mobil (React Native) - Müşteriler (CRM) Modülü:** Web tarafındaki "Müşteriler" mantığı mobil tarafa Clean Architecture ile (domain/entities/Customer, ICustomerRepository, SupabaseCustomerRepository) eklendi. Müşteriler, Supabase üzerinden customers ve ppointments join'lenerek ekranda listelendi. MusterilerScreen.js oluşturulup TabNavigator'a bağlandı.
2. **Flow Mobil - Kırık Import ve Bundle Crash Çözümleri:** WahaService.ts içindeki bozuk @infrastructure/api/supabaseClient importu düzeltilerek Metro Bundler'ın çökmesi (App.js bundling failed) giderildi. Ayrıca OAuth Redirect Uri config ayarları güncellenerek Supabase Whitelist sorunları etrafından dolaşıldı.
3. **Flow Mobil - Master AI Toggle Kaldırılması:** BotYonetimiScreen.js'deki ana AI aç/kapat şalteri UI üzerinden kaldırılarak, alt platform (WhatsApp) şalterlerinin her zaman aktif görünebilmesi sağlandı.
4. **Flow Web (Next.js) - Takvim Saat Dilimi Bug Fix:** RandevuClient.tsx'in kullandığı sayfa seviyesindeki (page.tsx) 	oday değişkeni UTC olduğu için gece saatlerinde takvimi önceki günde (ör: hala Ağustos) göstermesine sebep oluyordu. Bu, yerel saat dilimi offset'i kullanılarak düzeltildi.
5. **Flow Web - Randevu Ekranı Tasarımının Mobile Eşitlenmesi:** Web'deki iki sütunlu randevu takvimi ve yoğunluk haritası düzeni lex-direction: column ile tek sütun yapıldı. **Takvim** üstte, **Günlük Yoğunluk Haritası (Müsaitlik)** ortada ve **Randevu Listesi** en altta olacak şekilde dikey olarak sıralandı.
6. **Flow Web - Takvim Scroll UX İyileştirmeleri:** Takvim ve Yoğunluk Haritası container'larına yatay kaydırma çubuklarını gizleyen CSS sınıfları eklendi. overscroll-behavior-x: contain eklenerek sağa-sola swipe yaparken tüm ekranın kayması (swipe to go back veya page scroll) engellendi, native mobil hissi yaratıldı.
7. **Flow Web - Ülke Listesi Dropdown Renk Düzeltmesi:** Profil ekranındaki ülke, şehir, ilçe <select> etiketlerindeki <option>'ların varsayılan beyaz/açık renk arka planları #17151A olacak şekilde güncellenerek, üzerine gelen beyaz metinlerin okunamaması sorunu (koyu tema uyumsuzluğu) çözüldü.

---
## [07.09.2026] Zernio Görüntü ve Medya Senkronizasyon Debug Logu
- **Sorun:** Zernio webhook'ları üzerinden gelen mesaj ve yorumlarda (Gelen Kutusu) profil resimlerinin olmaması ve Sosyal Medya sayfasında gönderi görsellerinin "kırık resim" ikonu şeklinde çıkması.
- **Bulgular:**
  1. comment.received webhook'unda post resim linki (post.imageUrl) bulunmasına rağmen bu bilgi zernio-webhook tarafından okunup posts tablosuna aktarılmıyordu.
  2. Yorum yapan kişinin avatarı Zernio tarafından bu event'te zaten sağlanmıyor (düzeltilemez dış kısıt).
  3. message.received/sent eventlerinde mesaj gönderen profil resmi participantPicture veya sender.picture olarak geliyordu ancak veritabanındaki conversations tablosunda bunu tutacak bir participant_picture kolonu bile yoktu!
  4. zernio-client içindeki sync-posts fonksiyonu sadece **yeni** gönderileri insert yapıyor, var olan gönderilerin medya güncellemelerini es geçiyordu. Ayrıca medya linki olarak Zernio .blob linkleri (ki bunlar video olabiliyor) veya süresi dolan CDN linkleri geliyordu.
  5. sync-posts'u upsert'e çevirirken posts tablosundaki zernio_post_id kolonunda UNIQUE constraint (kısıtlaması) olmadığı için Postgres onConflict işlemini reddediyordu.
  6. .blob linkleri .mp4 gibi bir uzantı barındırmadığından lowweb tarafındaki <img src=...> etiketlerinde kırık ikon olarak görünüyordu.
- **Çözümler (Ledger reposu üzerinden):**
  1. 20260907000002_add_participant_picture_to_conversations.sql ve 20260907000003_add_unique_constraint_to_zernio_post_id.sql migration'ları eklenip canlı db'ye (
px supabase db push) basıldı.
  2. zernio-webhook güncellenerek payload.post.imageUrl okuması yapılıp posts tablosundaki media_urls alanına update atanması sağlandı. Ayrıca participant_picture okuması da eklenip conversations insert/update mantığına dâhil edildi.
  3. zernio-client/sync-posts fonksiyonu yeni gelen mappedPosts listesini tamamen upsert yapacak (varolanı ezecek) şekilde refaktör edildi. CDN bağlantıları blob'lara karşı önceliklendirildi.
  4. Yeni edge function'lar canlı ortama (
px supabase functions deploy) deploy edildi.
- **Çözümler (Flowweb reposu üzerinden):**
  1. Frontend'de sosyal-medya/posts ve gelen-kutusu sayfalarındaki resim <img> render kısımlarına bir regex eklendi: /\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i || includes('blob'). 
  2. Video ve Zernio blob linkleri artık kırık ikonlu <img> yerine native HTML5 <video src=... muted playsInline> etiketiyle render ediliyor (otomatik ilk kareyi thumbnail olarak kullanıyor) ve üzerine play ikonu yerleştiriliyor.
- **Teknik Borç (Sonraki Adımlar İçin Uyarı):** Frontend'deki regex / uzantı kontrolü Zernio'nun jenerik .blob uzantısından ötürü uzun vadede (blob bir resim postu gelirse) risklidir. En doğru yöntem posts tablosuna media_type kolonu ekleyip frontend'de buna göre render kontrolü yapmaktır (README.md'ye kaydedilmiştir).
---
## [16.09.2026] Zernio Senkronizasyon, UI Bug Fix'leri ve Veri Kaybı Önlemleri
- **Bug 1 (UI Flicker):** Sosyal Medya sayfasında (flowweb) her girişte hesap listesinin boşalıp Zernio'dan yanıt dönene kadar dönüp durması sorunu çözüldü. `useEffect` içerisinde `fetchAccounts(false)` çağrılarak yerel verinin anında render edilmesi, arka planda ise Zernio senkronizasyonunun sessizce devam etmesi sağlandı.
- **Bug 2 (Silinemeyen Bağlantılar):** Zernio'da halihazırda kopmuş (needs_reconnection=true) olan hesapların, "Yeniden Bağlan" kartlarındaki çöp kutusuna basıldığında `disconnectAccount` API'sinden dönen "404 Not Found" hatası nedeniyle yerelden silinememesi sorunu çözüldü. Artık "not found" durumunda yerel veritabanındaki kayıt güvenle siliniyor (ledger-repo / zernio-client).
- **Bug 3 (Kritik Veri Kaybı Önlemi):** `zernio-client` içindeki `sync-posts` işleminin, boş/yeni bir profile bağlandığında Zernio'dan boş liste dönmesi sonucu yerel veritabanındaki tüm eski gönderileri (sanki silinmişler gibi) kalıcı olarak silmesi engellendi. `postsList.length === 0` durumunda silme bloğu tamamen atlanarak güvenlik kemeri eklendi.
- **Bug 4 (TikTok Caption Kaybı & ID Uyuşmazlığı):** TikTok gönderilerindeki "Gönderi detayı bulunamadı" hatasını çözmek için webhook içine REST fallback'i eklendi. Ancak webhook'un döndürdüğü TikTok'a ait native ID ile Zernio'nun REST API'sindeki Mongo tabanlı ID eşleşmediği için fallback çalışmadı. Çözüm olarak `zernio-client` içine `ZERNIO_POST_PLATFORMS_RAW` logu eklendi; buradan TikTok'un gerçek native ID'sinin nasıl geldiği tespit edilip ID eşleştirme ve temizlik yapılacak.


## Session 27.09.2026 - Agent Action Log
Agent resolved multiple issues across flow and flowweb regarding appointments. Specifically:
1. Separated Note UI from Service UI in cards.
2. Fixed calendar UI not syncing month with selected date.
3. Swapped React Native modal chips for DateTimePicker in Mobile.
4. Debugged multiple JSX parsing errors related to misaligned ScrollView closures in Mobile.
5. Fixed keyboard overlay overlapping input fields in Mobile RandevuScreen.
6. Addressed 'no_overlapping_appointments' Supabase constraint by replacing flawed LIKE timestamp queries with gte/lt bounds.

### [27.09.2026] Faz 2: Ölü Kod Temizliği ve Ortak slotBusy Entegrasyonu
1. **Flow / FlowWeb Ortak Kütüphane:** Müsaitlik durumu ve saat hesaplamaları için bağımsız ve tamamen zaman dilimi uyumlu src/lib/slotBusy.ts (starts_at / ends_at çakışma tespiti) entegre edildi.
2. **Ölü Kodların Temizlenmesi (flow):** Eski WAHA tabanlı StartAppointmentFlowUseCase, ApproveAppointmentUseCase, CancelAppointmentUseCase, GetAvailableHoursUseCase ve WahaRandevuService dosyaları uygulamadan tamamen silindi ve dependency injection (container.ts) kayıtları kaldırıldı.
3. **Repository Güncellemesi (flow):** Eski string tabanlı indAvailableHours fonksiyonu silinip yerine veri tabanından starts_at, ends_at, timezone, status çeken getDayAppointmentsForCalendar eklendi.
4. **Heatmap & UI (flowweb & flow):** Web ve Mobil'deki gün içi yoğunluk haritası (isSlotBusy), yeni slotBusy.ts modülü kullanılarak string (date LIKE) aramasından aralık bazlı çakışma arayışına dönüştürüldü. Yeni Randevu Modalı (mobildeki) saatleri filtrelemek için güncellendi.
5. **Ledger Güncellemeleri:** waha-webhook v92 canlı ortamdan senkronize edildi. AI Core (ResponseGuards, claimsAction, vs.) testleri ile sisteme dahil edildi. Faz 2 temizliği doğrulandı.

