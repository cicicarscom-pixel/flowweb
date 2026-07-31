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

