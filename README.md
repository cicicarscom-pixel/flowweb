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
