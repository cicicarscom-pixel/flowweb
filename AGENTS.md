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
