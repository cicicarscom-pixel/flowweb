const fs = require('fs');

let html = `
<div class="flex-1 flex flex-col h-full bg-[#0e0e10] overflow-hidden text-white">
<!-- Top Header -->
<header class="h-20 flex items-center justify-between px-8 border-b border-surface-container-high bg-surface-container-lowest flex-shrink-0">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
<span class="material-symbols-outlined text-xl">magic_button</span>
</div>
<div>
<h1 class="text-xl font-bold text-white leading-tight">AI Paylaşım</h1>
<p class="text-sm text-gray-400">AI destekli içerik oluşturun, düzenleyin ve seçtiğiniz platformlarda paylaşın.</p>
</div>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-container-highest text-gray-300 hover:bg-surface-container hover:text-white transition-colors text-sm font-medium">
<span class="material-symbols-outlined">history</span>
<span>Geçmiş</span>
</button>
<button class="w-10 h-10 rounded-lg border border-surface-container-highest flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
<button class="w-10 h-10 rounded-lg border border-surface-container-highest flex items-center justify-center text-gray-400 hover:text-white hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined">help</span>
</button>
</div>
</header>
<!-- Content Scrollable Area -->
<div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
<div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
<!-- Left Column: Creation Flow -->
<div class="space-y-6">
<!-- Step 1 -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<div class="flex items-center gap-2 mb-4">
<h2 class="text-sm font-bold text-white tracking-wide uppercase">1. NE PAYLAŞALIM?</h2>
<span class="material-symbols-outlined text-gray-500 text-sm">help</span>
</div>
<textarea class="w-full bg-surface-container border border-surface-container-highest rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow resize-none" placeholder="Örn: Yeni yaz koleksiyonumuz için enerjik bir post..." rows={3}></textarea>
</section>
<!-- Step 2 -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<h2 class="text-sm font-bold text-white tracking-wide uppercase mb-4">2. GÖRSEL &amp; VİDEO</h2>
<div class="relative w-full h-[240px] bg-surface-container/50 border border-dashed border-[#353538] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container/80 transition-colors group">
<div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-gray-400 hover:text-white z-10">
<span class="material-symbols-outlined text-sm">settings</span>
</div>
<div class="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
<div class="relative">
<span class="material-symbols-outlined text-3xl">image</span>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-[#0e0e10] border-2 border-surface-container-lowest">
<span class="material-symbols-outlined text-[10px]">add</span>
</div>
</div>
</div>
<h3 class="text-base font-semibold text-white mb-2">Görsel &amp; video seç ya da sadece görsel üret</h3>
<p class="text-sm text-gray-400 text-center max-w-sm">Galerinden eklemek için dokunun veya AI'ın benzersiz görsel üretmesini bekleyin.</p>
</div>
</section>
<!-- Step 3 -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<div class="flex items-center justify-between mb-4">
<h2 class="text-sm font-bold text-white tracking-wide uppercase">3. İÇERİK METNİ</h2>
<button class="text-primary-400 hover:text-primary-300 transition-colors">
<span class="material-symbols-outlined">edit</span>
</button>
</div>
<div class="bg-surface-container border border-surface-container-highest rounded-lg p-4 mb-4 min-h-[120px]">
<p class="text-sm text-gray-300 leading-relaxed">
                Yapay zeka tarafından oluşturulan içerik metni burada görünecek. Gelişmiş dil modelleri ile hedef kitlenize uygun, etkileşimi yüksek metinler hazırlanıyor...
              </p>
</div>
<div class="relative flex items-center gap-3">
<input class="flex-1 bg-surface-container border border-surface-container-highest rounded-full py-3 px-5 text-sm text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="Görselle uyumlu bir metin üret..." type="text" />
<button class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-500 transition-colors flex-shrink-0 glow-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]">
<span class="material-symbols-outlined">magic_button</span>
</button>
</div>
<div class="flex flex-wrap items-center gap-2 mt-4">
<span class="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">#yaz</span>
<span class="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">#yenisezon</span>
<button class="px-3 py-1.5 rounded-full border border-dashed border-gray-600 text-gray-400 text-xs font-medium hover:text-white hover:border-gray-400 transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">add</span> Etiket ekle
              </button>
</div>
</section>
<!-- Step 4 -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<h2 class="text-sm font-bold text-white tracking-wide uppercase mb-6">4. GÖNDERİ AYARLARI</h2>
<!-- Account Selection -->
<div class="mb-6">
<label class="block text-xs font-medium text-gray-400 mb-2">Profil / Hesap</label>
<div class="relative">
<button class="w-full flex items-center justify-between bg-surface-container border border-surface-container-highest rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500">
<div class="flex items-center gap-3">
<img alt="Profile" class="w-6 h-6 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH_ka25kuypvedDP_EzrGvo567hkykIE61gJdOp7tyYDZNq7J0pcBjgPENXQx3iNASw76nSf_3wGdXAtzTz84C58gg4mUsw4eDr7Pjw11yrCCIxdyQo7N8xZi8RTpN5AJNB7IklEVF0tvXYHG8lPvELV4zjo-thOgJ4_bj9ROt_I2mu_WEBPK6Eb7n1A20lR9N2q5LOXFWs1c7QBTz0imsg0DTu5F7Eecdy03PDyS22MAZ0zlV3rwu" />
<span>AI Esnaf Profil</span>
</div>
<span class="material-symbols-outlined text-gray-500 text-sm">expand_more</span>
</button>
</div>
</div>
<!-- Platform Selection -->
<div class="mb-6">
<label class="block text-xs font-medium text-gray-400 mb-2">Seçilen platformlarda paylaş</label>
<div class="grid grid-cols-2 gap-4">
<label class="flex items-center gap-3 bg-surface-container border border-primary-500/50 rounded-lg p-3 cursor-pointer">
<div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white">
<span class="material-symbols-outlined">photo_camera</span>
</div>
<div class="flex-1 min-w-0">
<p class="text-sm font-medium text-white truncate">Instagram</p>
<p class="text-[10px] text-gray-500 truncate">@ai.esnaf.profil</p>
</div>
<div class="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-surface-lowest flex-shrink-0">
<span class="material-symbols-outlined text-xs">check</span>
</div>
</label>
<label class="flex items-center gap-3 bg-surface-container border border-surface-container-highest rounded-lg p-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
<div class="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white">
<span class="material-symbols-outlined">chat</span>
</div>
<div class="flex-1 min-w-0">
<p class="text-sm font-medium text-white truncate">Whatsapp</p>
<p class="text-[10px] text-gray-500 truncate">+90 555 123 45 67</p>
</div>
<div class="w-5 h-5 rounded-full border border-gray-600 flex-shrink-0"></div>
</label>
</div>
</div>
<!-- Platform Specific Options (Instagram) -->
<div class="border-t border-surface-container-high pt-6">
<div class="flex items-center gap-2 mb-4">
<div class="w-5 h-5 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white">
<span class="material-symbols-outlined text-[10px]">photo_camera</span>
</div>
<h3 class="text-sm font-medium text-white">Instagram</h3>
</div>
<!-- Post Types Tabs -->
<div class="flex p-1 bg-surface-container-low rounded-lg mb-4">
<button class="flex-1 py-1.5 text-xs font-medium text-white bg-surface-container-highest rounded-md shadow-sm">Feed</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Story</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Reel</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Carousel</button>
</div>
<p class="text-[11px] text-gray-500 mb-6">İçerik 24 saat sonra kaybolur. Sınırlandırma detayı.</p>
<!-- AI Label Toggle -->
<div class="flex items-start gap-3 mb-6">
<input class="mt-1 w-4 h-4 rounded border-gray-600 bg-surface-container text-primary-500 focus:ring-primary-500 focus:ring-offset-surface-lowest" id="ai-label" type="checkbox" />
<div>
<label class="text-sm font-medium text-white cursor-pointer" htmlFor="ai-label">AI ile üretildi olarak işaretle</label>
<p class="text-xs text-gray-400 mt-1">Instagram'ın AI içerik etiketleme ilkelerine uygun olarak bu içeriğin AI ile oluşturulduğunu belirtir.</p>
</div>
</div>
<!-- First Comment -->
<div class="mb-4">
<label class="block text-xs font-medium text-gray-400 mb-2">İlk yorum (isteğe bağlı)</label>
<div class="relative">
<textarea class="w-full bg-surface-container border border-surface-container-highest rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none" placeholder="Örn: Yazın enerjisini birlikte yaşayalım! ☀️" rows={2}></textarea>
<span class="absolute bottom-2 right-3 text-[10px] text-gray-500">0/2200</span>
</div>
</div>
<!-- Caption -->
<div class="mb-4">
<label class="block text-xs font-medium text-gray-400 mb-2">Alt yazı (caption)</label>
<div class="relative">
<textarea class="w-full bg-surface-container border border-surface-container-highest rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none" placeholder="İsteğe bağlı... (Leave blank to use main content)" rows={3}></textarea>
<span class="absolute bottom-2 right-3 text-[10px] text-gray-500">0/2200</span>
</div>
</div>
<!-- Location -->
<div>
<label class="block text-xs font-medium text-gray-400 mb-2">Konum ekle (isteğe bağlı)</label>
<div class="relative">
<input class="w-full bg-surface-container border border-surface-container-highest rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" placeholder="Konum seçin..." type="text" />
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[16px]">expand_more</span>
</div>
</div>
</div>
</section>
</div>
<!-- Right Column: Preview & Publish -->
<div class="space-y-6">
<!-- Step 5: Preview Panel -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<h2 class="text-sm font-bold text-white tracking-wide uppercase mb-4">5. ÖNİZLEME</h2>
<div class="flex p-1 bg-surface-container rounded-lg mb-6">
<button class="flex-1 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md shadow-sm">Feed</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Story</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Reel</button>
<button class="flex-1 py-1.5 text-xs font-medium text-gray-400 hover:text-white">Carousel</button>
</div>
<!-- Fake Instagram Post -->
<div class="bg-black border border-surface-container-high rounded-xl overflow-hidden max-w-[320px] mx-auto">
<!-- Post Header -->
<div class="flex items-center justify-between p-3">
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
<img alt="Profile" class="w-full h-full rounded-full border border-black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfeEfU0YIy0WSnYgBqMbEDUbotJ0-CZypClnAWUIYnip2sDVCAwtDK-GiasJT_4tgjpJYP1QXWZS5i8L8Yx06by6Rvq1jx3FZXKTz7M4ppxTY_87hjvonXom97T0DEA156G9zZwem20CRj4zE1wWoSB_MGo2IVG86G5BFrxJkNYJi4GT8HrpqKLznY07Zd_WywS_h28rKVhNnMkfy-urQNSbOo65GrQG4-t3yU15R22ynojwAft2Xd" />
</div>
<div>
<p class="text-xs font-bold text-white leading-tight">ai.esnaf.profil</p>
<p class="text-[10px] text-gray-400">İstanbul, Türkiye</p>
</div>
</div>
<span class="material-symbols-outlined text-white text-[18px]">more_vert</span>
</div>
<!-- Post Image -->
<div class="aspect-square bg-surface-container">
<img alt="Post Preview" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhHj0ckuQIh-Q-YI12q4MkcvOPILIRGads_W7V-IpqiDQ_0OvVH_i8TN-ctSU5gbha17MEg44eNWUsUuJVT3ut_thWpu3bw31FePIyGAGgKk4O4CMwZeXZq46yaVOqS8H2LT_0AUUkxJvT2LL6V48Kli6yaf6r5XlHHh7GMl7Mg9hC9PKCSNkob0BoD5tCpJbdHDGvQkqjFgKr9vdC4JvrAe0uVkzSrmHcMbiV7gNIMvx3KMCvnN6z" />
</div>
<!-- Post Actions -->
<div class="p-3">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-red-500 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
<span class="material-symbols-outlined text-white text-xl">chat</span>
<span class="material-symbols-outlined text-white text-xl">send</span>
</div>
<div class="flex gap-1">
<div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
<div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
<div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
<div class="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
</div>
<span class="material-symbols-outlined text-white text-xl">bookmark</span>
</div>
<!-- Post Caption -->
<div class="text-sm">
<p class="text-white"><span class="font-bold mr-1">ai.esnaf.profil</span>☀️ Yaz koleksiyonumuz ile enerjinizi yansıtın! ☀️</p>
<p class="text-white mt-1">Renkli, rahat ve şık parçalar sizi bekliyor. Bu yaz stilinizle fark yaratın.</p>
<p class="text-blue-400 mt-2 text-xs">#yaz #yenisezon #koleksiyon #stil</p>
</div>
</div>
</div>
</section>
<!-- Step 6: Publishing -->
<section class="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6">
<h2 class="text-sm font-bold text-white tracking-wide uppercase mb-6">6. YAYINCILIK</h2>
<!-- Publish Type Toggle -->
<div class="flex p-1 bg-surface-container rounded-lg mb-6">
<button class="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-white border border-primary-500 bg-primary-900/20 rounded-md">
<span class="material-symbols-outlined text-[16px] text-primary-400">schedule</span> Planlı
              </button>
<button class="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-400 hover:text-white">
<span class="material-symbols-outlined text-[16px]">bolt</span> Şimdi
              </button>
</div>
<!-- Date/Time Inputs -->
<div class="space-y-4 mb-6">
<div>
<label class="block text-xs font-medium text-gray-400 mb-1.5">Tarih</label>
<div class="relative">
<input class="w-full bg-surface-container border border-surface-container-highest rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer" readOnly type="text" value="22 Mayıs 2024" />
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">calendar_month</span>
</div>
</div>
<div>
<label class="block text-xs font-medium text-gray-400 mb-1.5">Saat</label>
<div class="relative">
<input class="w-full bg-surface-container border border-surface-container-highest rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer" readOnly type="text" value="14:30" />
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">schedule</span>
</div>
</div>
<div>
<label class="block text-xs font-medium text-gray-400 mb-1.5">Zaman dilimi</label>
<div class="relative">
<select class="w-full bg-surface-container border border-surface-container-highest rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none">
<option>Europe/Istanbul (GMT +03:00)</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none text-[18px]">expand_more</span>
</div>
</div>
</div>
<!-- Info Notice -->
<div class="flex gap-3 bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6">
<span class="material-symbols-outlined text-secondary mt-0.5 text-[18px]">info</span>
<p class="text-xs text-gray-300 leading-relaxed">Gönderi, seçilen tüm platformlarda planlanan tarihte yayınlanacaktır.</p>
</div>
<!-- Main Action Button -->
<button class="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-primary-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-[18px]">send</span> Seçili Platformlarda Paylaş
            </button>
<!-- Summary Section -->
<div class="mt-8">
<h3 class="text-sm font-bold text-white mb-4">Gönderi Özeti</h3>
<div class="space-y-3">
<div class="flex justify-between items-center text-sm">
<span class="text-gray-400">Platformlar</span>
<span class="text-white font-medium">2 platform</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-gray-400">Format</span>
<span class="text-white font-medium">Feed</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-gray-400">Planlanma</span>
<span class="text-white font-medium">22 May 2024 14:30</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-gray-400">Tahmini Erişim</span>
<span class="text-white font-medium">1.2K - 2.4K</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-gray-400">Tahmini Etkileşim</span>
<span class="text-white font-medium">120 - 250</span>
</div>
</div>
</div>
</section>
<!-- AI Suggestion Box -->
<div class="bg-primary-900/20 border border-primary-500/30 rounded-xl p-5 relative overflow-hidden">
<!-- Decorative background glow -->
<div class="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 blur-xl rounded-full"></div>
<div class="relative z-10 flex items-start gap-3">
<span class="material-symbols-outlined text-primary-400 mt-1">magic_button</span>
<div>
<h4 class="text-sm font-bold text-primary-100 mb-1">AI Önerisi</h4>
<p class="text-xs text-primary-200/80 leading-relaxed">
                   Gönderiniz için en iyi etkileşim zamanı Cuma günü 18:00 - 20:00 arasıdır.
                 </p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
`;

// Convert class to className
html = html.replace(/class=/g, 'className=');

// Form for Next.js Component
const component = `import React from 'react';

export default function SharePage() {
  return (
    ${html}
  );
}
`;

fs.writeFileSync('c:/Users/roman/flowweb/src/app/(dashboard)/sosyal-medya/share/page.tsx', component);
console.log("Successfully generated SharePage.");
