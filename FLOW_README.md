# FLOW Command Center - Proje Yapılandırması ve Mimari Rehberi

## 🏗️ Proje Mimarisi (Next.js App Router)

Projemiz Next.js App Router mimarisi üzerine kuruludur ve **Route Groups** özelliği kullanılarak yapılandırılmıştır.

### 📂 Dizin Yapısı

```
src/
├── app/
│   ├── (dashboard)/            # Dashboard layout'unu (Sidebar & Header) paylaşan sayfalar
│   │   ├── layout.tsx          # Ana Dashboard Layout'u (Tüm sayfaları sarmalar)
│   │   ├── page.tsx            # Anasayfa (Dashboard)
│   │   ├── ai-asistan/         # Ai Asistan
│   │   ├── analiz/             # Analiz
│   │   ├── ai-muhasebe/        # Ai Muhasebe (Ana Özet)
│   │   │   ├── isletmem/       # Geçmiş
│   │   │   ├── odeme-takvimi/  # Takvim
│   │   │   └── veri-girisi/    # Gelir/Gider Girişi
│   │   └── sosyal-medya/       # Sosyal Medya Genel Bakış
│   │       ├── create-post/    # Gönderi Oluştur
│   │       ├── inbox/          # Gelen Kutusu
│   │       ├── posts/          # Tüm Gönderiler
│   │       └── share/          # Paylaşım Merkezi
│   └── login/                  # Dashboard dışı, bağımsız sayfalar (Auth)
├── components/
│   ├── Header.tsx              # Standart Üst Menü
│   └── Sidebar.tsx             # Standart Sol Menü
```

## 🎨 UI/UX Tasarım Standartları

### 1. Dashboard Layout Sistemi
Tüm dashboard sayfaları `src/app/(dashboard)/layout.tsx` tarafından yönetilir.
- **Sidebar (`Sidebar.tsx`)**: Sol tarafta `w-[280px]` sabit genişlikte.
- **Header (`Header.tsx`)**: Üst tarafta `h-16` sabit yükseklikte.
- **Main İçerik**: `md:ml-[280px]` (Mobilde menü gizlenir, masaüstünde sol menü kadar boşluk bırakılır). Ekstra `flex-1 overflow-y-auto` kullanılarak kendi içinde kaydırılabilir (Scroll) yapıya sahiptir.

### 2. Arka Plan ve Renkler (CSS Değişkenleri)
Sayfaların tamamı `layout.tsx` tarafından ortak bir şekilde şekillenir.
`bg-background` ve `text-on-background` global olarak atanmıştır. Hiçbir alt sayfada, `div` seviyesinde genel arka plan rengi atanmamalı veya Layout kodları (nav/header) tekrar edilmemelidir.

### 3. Sidebar Menü İsimlendirmeleri
Menüler mobille birebir aynı standarttadır:
- Anasayfa
- Ai Asistan
- Ai Muhasebe
- Sosyal Medya
- Analiz

### 4. Kaldırılan Öğeler
- "Workigom Flow Command Center" ve "System Operational | Data Flow Nominal" yazıları ana şablonlara dahil edilmez, kaldırılmıştır.
- "New Analysis" butonu kullanımdan kaldırılmıştır.

## 🚀 Geliştirme Süreci (Yeni Sayfa Ekleme)
Yeni bir dashboard sayfası eklenirken:
1. `src/app/(dashboard)/yeni-sayfa/page.tsx` yolunda oluşturulur.
2. SADECE iç `main` içeriği (`<div className="flex-1 p-4...">`) döndürülür (`return`).
3. ASLA `<nav>` veya `<header>` eklenmez. Bu işlemi `layout.tsx` zaten yapmaktadır.
4. Menüye eklenecekse, `src/components/Sidebar.tsx` içindeki `links` array'ine yeni öğe tanımlanır.
