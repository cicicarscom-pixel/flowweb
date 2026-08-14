<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI-Esnaf Ajanları İçin Karar ve Geliştirme Günlüğü

Bu dosya yapay zeka ajanlarının sistemi kodlarken uyması gereken katı kuralları ve kullanıcıdan gelen güncel kararları içerir.

## 🗓️ Temmuz 2026 - Arayüz ve UI/UX Kararları

### 1. Standartlaştırılmış Dashboard Layout (Route Groups)
**Problem:** Ayrı ayrı sayfalarda (`social-media`, `ai-asistan`, `analiz`, vb.) oluşturulan hardcoded `<nav>` ve `<header>` yapısı sayfa geçişlerinde asimetriye ve farklı sidebar görünümlerine neden oluyordu.
**Çözüm:** Tüm dashboard sayfaları `src/app/(dashboard)` klasörüne (Route Group) taşındı. `layout.tsx` ile merkezi bir yapı kuruldu.
**KURAL:** Hiçbir sayfa (page.tsx) kendi `<nav>` (sidebar) veya `<header>` elemanını oluşturmamalıdır. Sadece içeriği render etmelidir.

### 2. Menü İsimlendirme Standardı
Mobil versiyon ile birebir aynı isimler kullanılmalıdır. `Sidebar.tsx` içindeki `links` objesi SADECE şu menüleri barındırmalıdır:
- Anasayfa
- Ai Asistan
- Ai Muhasebe
- Sosyal Medya
- Analiz
**KURAL:** "New Analysis" butonu veya gereksiz İngilizce menüler sidebar'a KESİNLİKLE eklenmemelidir.

### 3. Yasaklı Metinler ve Bileşenler
Kullanıcı talebiyle aşağıdaki bileşen ve metinler sistemden kalıcı olarak çıkarılmıştır. Tekrar eklenmesi **YASAKTIR**:
- "Workigom Flow Command Center"
- "System Operational | Data Flow Nominal"
- "New Analysis" (buton)

### 4. Arka Plan Standartları
Geçmişte her sayfanın kendine has neon/cam tasarımlı karmaşık arkaplan sınıfları (`bg-surface/40`, vs.) vardı. Bu durum sayfalar arası geçişlerde bozulmalara yol açıyordu.
**KURAL:** Dashboard layout seviyesinde `bg-background text-on-background` ataması yapılmıştır. İç sayfalar ekstra arkaplan tanımlamaları (ana kapsayıcı `div` üzerinde) YAPMAMALIDIR. İhtiyaç duyulursa sadece içerik kartlarına arkaplan uygulanmalıdır.

### 5. Routing Mantığı
Navigasyonda aktif sekme (`active link`) stilini vermek için `Sidebar.tsx` içerisinde `usePathname` kullanılmıştır. Yeni eklenen sayfaların menüde aydınlanması bu standart üzerinden otomatik işler.

### 6. HTML to Next.js Entegrasyonu (Temmuz 2026 - Son Aşama)
**Karar:** 13 farklı statik HTML tasarımı (`Anasayfa`, `Ai Muhasebe` alt sayfaları, `Sosyal Medya` alt sayfaları, `Ai Asistan`, `Analiz`) mobil uygulama mimarisine (`C:\ai_esnaf`) %100 sadık kalınarak App Router yapısına dönüştürüldü.
- **Tasarım Bütünlüğü:** Tüm statik tasarımlardaki 5 farklı glow (neon parlama) ve gradient efektleri global `tailwind.config.ts` altında token'laştırıldı.
- **Alt Sayfa Navigasyonları:** Örneğin `/sosyal-medya` içindeki sekme yapıları ayrı React rotaları (`/sosyal-medya/posts`, vb.) olarak Next.js'e işlendi. Tasarımda bulunan tüm form öğeleri ve state'ler React standardında statik skeleton olarak kodlandı.
- **Sonuç:** Vercel için build alındı (0 Hata).

### 7. Layout ve Ölçeklendirme Kuralları (Temmuz 2026)
**Karar:** `globals.css` içerisinde bulunan `html { font-size: 14px; }` küçültme (zoom) ayarı **tamamen silinmiştir** ve tekrar eklenmemelidir. Ekranların (örneğin Ai Muhasebe) sağ tarafında boşluk kalmasını engellemek için `layout.tsx` içerisindeki ana taşıyıcı `div` nesnesi `w-full` sınıfı ile tam genişliğe zorlanmıştır. Bütün yeni alt sayfalar `flex-1` veya `w-full` kurallarına uymalıdır.

### 8. Header ve Sidebar Minimalizmi
**KURAL:** Sidebar ve Header bileşenlerinde gereksiz logolar ("Neural Net", mor çip ikonu vb.), bildirim metinleri ("SYS.ON", "sync", "SYNCED" gibi sistem statüleri) kesinlikle **kullanılmamalıdır.** Tasarım tamamen sade (minimalist), siyah zemin (`#0b0c10`) ve koyu gri (`#1d1e24`) kombinasyonları üzerinde şekillendirilmelidir.

### 9. Ai Asistan Sihirli Kasa (Vault) Standardı
**KURAL:** Ai Asistan sayfası statik bir ayarlar sayfası değil, etkileşimli bir **"Sihirli Kasa"** (Magic Panel) konseptine sahiptir. Kapak açılma animasyonları, duman (steam) parçacıkları, `vibrating` efektleri, `brushed-metal` CSS dokusu ve WebGL (Shader) altyapısı mevcuttur. Bu sayfaya yapılacak yeni bir eklenti veya değişiklik, kesinlikle bu kasa `z-index` hiyerarşisine ve `isPointerEventsNone` state kurallarına sadık kalınarak yapılmalıdır. Alt planda siyah ve kapağı taklit eden koyu gölgeler (`background-color: rgba(24, 24, 27, 0.9)`) **kullanılmamalıdır**, saydam bırakılmalıdır.

### 10. Animasyon ve Neon Efekt Kuralları (Ağustos 2026)
**KURAL:** Magic Container (Ai Asistan sihirli çerçevesi) etrafına eklenen yörünge tabanlı dönen ışık (offset-path veya conic-gradient) animasyonları, hız dengesizlikleri ve köşelerde kopma sorunlarına sebep olduğundan tamamen iptal edilmiştir. Gelecekte herhangi bir bileşene ""Neon Aura"" ekleneceği zaman hareketli parçalar (dönen top vs.) YERİNE, bileşenin ""border"" ve ""box-shadow"" özelliklerini (@keyframes ile) yavaş yavaş değiştirerek nefes alma (breathing) veya renk geçişi (color shifting) yapan tasarımlar tercih edilmelidir.

### 11. Ai Asistan Sihirli Kasa İptali ve Yeni Layout (Ağustos 2026)
**KURAL:** Kullanıcı talebi üzerine 'Sihirli Kasa (Magic Vault)' konsepti tamamen İPTAL EDİLMİŞTİR (Madde 9 geçersizdir). Yeni tasarımda grid yapısı (yan yana dizilim) kullanılmamalıdır. Bunun yerine 'WhatsApp Asistanı (Şalter)', 'Asistan Talimatı', 'İleri Seviye Ayarlar' ve 'AI Kişiliği' bileşenleri sayfada tam genişlikte, dikey olarak alt alta (stack) sıralanmalıdır.


### 12. Web ve Mobil Platform UI/UX Senkronizasyonu (Ağustos 2026)
**KURAL:** Web ve Mobil (React Native) platformları arasında tam bir görsel ve işlevsel bütünlük sağlanmıştır. Web tarafındaki Dashboard modülleri (Son Aktiviteler, İletişim Raporları, Tüm Hesaplar) aynen mobil tasarıma da eklenmiştir. Ayrıca Mobil taraftaki Sosyal Medya kartları, Web tarafındaki gibi yatay kaydırılabilir (Horizontal ScrollView), cam efektli (glassmorphism), parlak (glow), 140px genişliğinde ve Emoji ikon (👥, 📸 vb.) kullanan şık kartlara dönüştürülmüştür. Bu görsel eşitlik yeni eklenecek sayfalarda da korunmalıdır.
