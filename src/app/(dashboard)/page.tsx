import Link from 'next/link';

export default function DashboardHomePage() {
 return (
 <div className="flex-1 overflow-y-auto p-8 pt-4">
 {/* Top Row: Summary Cards */}
 <div className="grid grid-cols-4 gap-6 mb-6">
 {/* Card 1 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding flex flex-col justify-between h-32 hover:bg-surface-container-high transition-colors cursor-pointer group">
 <div className="flex items-start justify-between">
 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
 <span className="material-symbols-outlined">chat</span>
 </div>
 <div className="text-right">
 <div className="font-label-md text-label-md text-on-surface-variant mb-1">Yeni Mesaj</div>
 <div className="font-display-lg text-display-lg text-on-surface leading-none">12</div>
 </div>
 </div>
 <div className="flex justify-between items-end border-t border-outline-variant/10 pt-3 mt-3">
 <span className="font-body-sm text-body-sm text-on-surface-variant">Son 24 saatte</span>
 <span className="font-label-sm text-label-sm text-on-surface hover:underline">Mesajları Gör</span>
 </div>
 </div>
 
 {/* Card 2 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding flex flex-col justify-between h-32 hover:bg-surface-container-high transition-colors cursor-pointer group">
 <div className="flex items-start justify-between">
 <div className="w-10 h-10 rounded-lg -primary/10 flex items-center justify-center -primary group-hover:-primary/20 transition-colors">
 <span className="material-symbols-outlined">forum</span>
 </div>
 <div className="text-right">
 <div className="font-label-md text-label-md text-on-surface-variant mb-1">Bekleyen Yanıt</div>
 <div className="font-display-lg text-display-lg text-on-surface leading-none">8</div>
 </div>
 </div>
 <div className="flex justify-between items-end border-t border-outline-variant/10 pt-3 mt-3">
 <span className="font-body-sm text-body-sm text-on-surface-variant">Yanıt bekleyen</span>
 <span className="font-label-sm text-label-sm text-on-surface hover:underline">Yanıtları Gör</span>
 </div>
 </div>
 
 {/* Card 3 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding flex flex-col justify-between h-32 hover:bg-surface-container-high transition-colors cursor-pointer group">
 <div className="flex items-start justify-between">
 <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
 <span className="material-symbols-outlined">account_balance_wallet</span>
 </div>
 <div className="text-right flex flex-col items-end">
 <div className="flex items-center gap-2 mb-1">
 <div className="font-label-md text-label-md text-on-surface-variant">Bu Ay Net</div>
 <span className="text-secondary text-xs flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> %18,5</span>
 </div>
 <div className="font-display-lg text-display-lg text-secondary leading-none">12.450 <span className="text-xl font-normal">₺</span></div>
 </div>
 </div>
 <div className="flex justify-between items-end border-t border-outline-variant/10 pt-3 mt-3">
 <span className="font-body-sm text-body-sm text-on-surface-variant">Gelir - Gider</span>
 <span className="font-label-sm text-label-sm text-on-surface hover:underline">Raporu Gör</span>
 </div>
 </div>
 
 {/* Card 4 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding flex flex-col justify-between h-32 hover:bg-surface-container-high transition-colors cursor-pointer group">
 <div className="flex items-start justify-between">
 <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary/20 transition-colors">
 <span className="material-symbols-outlined">event</span>
 </div>
 <div className="text-right">
 <div className="font-label-md text-label-md text-on-surface-variant mb-1">Yaklaşan Ödeme</div>
 <div className="font-display-lg text-display-lg text-on-surface leading-none">3</div>
 </div>
 </div>
 <div className="flex justify-between items-end border-t border-outline-variant/10 pt-3 mt-3">
 <span className="font-body-sm text-body-sm text-on-surface-variant">7 gün içinde</span>
 <span className="font-label-sm text-label-sm text-on-surface hover:underline">Ödemeleri Gör</span>
 </div>
 </div>
 </div>

 {/* Second Row: AI Summary & Quick Actions */}
 <div className="grid grid-cols-12 gap-6 mb-6">
 {/* AI Summary (7 cols) */}
 <div className="col-span-7 bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding">
 <div className="flex justify-between items-center mb-6">
 <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
 <span className="material-symbols-outlined">auto_awesome</span>
 Günlük AI Özeti
 </div>
 <button className="flex items-center gap-1 text-on-surface-variant text-body-sm border border-outline-variant/20 rounded px-3 py-1.5 hover:bg-surface-variant/20">
 Bugün <span className="material-symbols-outlined text-[16px]">expand_more</span>
 </button>
 </div>
 <div className="mb-6">
 <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Merhaba Volkan! 👋</h2>
 <p className="font-body-md text-body-md text-on-surface-variant">İşletmeniz için bugün öne çıkanlar.</p>
 </div>
 <div className="flex flex-col gap-4">
 {/* AI Item 1 */}
 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors group">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
 <span className="material-symbols-outlined text-[20px]">chat</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface">24 yeni mesaj aldınız</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">8 tanesi yanıt bekliyor.</div>
 </div>
 </div>
 <button className="px-4 py-1.5 border border-primary/30 rounded-full text-primary font-label-sm text-label-sm hover:bg-primary/10 transition-colors">Mesajlara Git</button>
 </div>
 {/* AI Item 2 */}
 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors group border-t border-outline-variant/5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
 <span className="material-symbols-outlined text-[20px]">trending_up</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface">Bugünkü tahmini satış</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">3.240 ₺ · Dün'e göre %12 artış bekleniyor.</div>
 </div>
 </div>
 <button className="px-4 py-1.5 border border-secondary/30 rounded-full text-secondary font-label-sm text-label-sm hover:bg-secondary/10 transition-colors">Detayları Gör</button>
 </div>
 {/* AI Item 3 */}
 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors group border-t border-outline-variant/5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
 <span className="material-symbols-outlined text-[20px]">schedule</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface">3 ödeme yaklaşıyor</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Toplam <span className="font-semibold text-on-surface">8.750 ₺</span> tutarında ödeme bulunuyor.</div>
 </div>
 </div>
 <button className="px-4 py-1.5 border border-tertiary/30 rounded-full text-tertiary font-label-sm text-label-sm hover:bg-tertiary/10 transition-colors">Ödemeleri Gör</button>
 </div>
 {/* AI Item 4 */}
 <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors group border-t border-outline-variant/5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full -primary/10 flex items-center justify-center -primary">
 <span className="material-symbols-outlined text-[20px]">check_circle</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface">Sosyal medyada etkileşim artıyor</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Instagram etkileşiminiz %24 arttı.</div>
 </div>
 </div>
 <button className="px-4 py-1.5 border -primary/30 rounded-full -primary font-label-sm text-label-sm hover:-primary/10 transition-colors">Analize Git</button>
 </div>
 </div>
 </div>
 
 {/* Quick Actions (5 cols) */}
 <div className="col-span-5 bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding">
 <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface mb-6">
 <span className="material-symbols-outlined text-primary">bolt</span>
 Hızlı İşlemler
 </div>
 <div className="flex flex-col gap-3">
 <button className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/10 transition-colors text-left group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded -primary/10 flex items-center justify-center -primary">
 <span className="material-symbols-outlined text-[18px]">add_comment</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Yeni Mesaj Gönder</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">AI asistan ile yeni sohbet başlat</div>
 </div>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
 </button>
 <button className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/10 transition-colors text-left group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
 <span className="material-symbols-outlined text-[18px]">share</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Paylaşım Oluştur</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Sosyal medyada içerik paylaş</div>
 </div>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
 </button>
 <button className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/10 transition-colors text-left group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
 <span className="material-symbols-outlined text-[18px]">receipt_long</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Fatura Oluştur</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Yeni fatura oluştur ve gönder</div>
 </div>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
 </button>
 <button className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/10 transition-colors text-left group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
 <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Gelir Ekle</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Yeni gelir kaydı oluştur</div>
 </div>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
 </button>
 <button className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/10 transition-colors text-left group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded bg-error/10 flex items-center justify-center text-error">
 <span className="material-symbols-outlined text-[18px]">close</span>
 </div>
 <div>
 <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Gider Ekle</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Yeni gider kaydı oluştur</div>
 </div>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
 </button>
 </div>
 </div>
 </div>

 {/* Bottom Row: Social & Finance */}
 <div className="grid grid-cols-12 gap-6 pb-8">
 {/* Sosyal Medya Performansı (7 cols) */}
 <div className="col-span-7 bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding">
 <div className="flex justify-between items-center mb-6">
 <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
 <span className="material-symbols-outlined text-on-surface-variant">share</span> Sosyal Medya Performansı
 </div>
 <button className="flex items-center gap-1 text-on-surface-variant text-body-sm border border-outline-variant/20 rounded px-2 py-1 hover:bg-surface-variant/20">
 Bu Ay <span className="material-symbols-outlined text-[16px]">expand_more</span>
 </button>
 </div>
 <div className="flex flex-col gap-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 w-1/4">
 <div className="w-8 h-8 rounded-full bg-gradient-to-tr -tertiary -tertiary -primary flex items-center justify-center text-on-surface">
 <span className="material-symbols-outlined text-[16px]">photo_camera</span>
 </div>
 <span className="font-label-md text-label-md text-on-surface">Instagram</span>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface">12.450</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Takipçi</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-secondary flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> %4,2</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Etkileşim</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface">8.450</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Etkileşim</div>
 </div>
 </div>
 <div className="flex items-center justify-between border-t border-outline-variant/5 pt-4">
 <div className="flex items-center gap-3 w-1/4">
 <div className="w-8 h-8 rounded-full -primary flex items-center justify-center text-on-surface">
 <span className="font-bold">f</span>
 </div>
 <span className="font-label-md text-label-md text-on-surface">Facebook</span>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface">3.200</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Takipçi</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-secondary flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> %1,8</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Etkileşim</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface">1.250</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Etkileşim</div>
 </div>
 </div>
 <div className="flex items-center justify-between border-t border-outline-variant/5 pt-4">
 <div className="flex items-center gap-3 w-1/4">
 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center -primary font-bold">
 <span className="bg-clip-text text-transparent bg-gradient-to-r -primary -tertiary -tertiary">G</span>
 </div>
 <span className="font-label-md text-label-md text-on-surface">Google</span>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface">428</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Yorum</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-on-surface flex items-center gap-1">4,8 <span className="-tertiary text-xs">★★★★★</span></div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Değerlendirme</div>
 </div>
 <div className="w-1/4">
 <div className="font-label-md text-label-md text-secondary flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> %12</div>
 <div className="font-body-sm text-body-sm text-on-surface-variant">Görünürlük</div>
 </div>
 </div>
 </div>
 </div>
 
 {/* Finans Trendi (5 cols) */}
 <div className="col-span-5 bg-surface-container border border-outline-variant/10 rounded-xl p-card-padding">
 <div className="flex justify-between items-center mb-6">
 <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
 <span className="material-symbols-outlined text-secondary">trending_up</span> Finans Trendi
 </div>
 <button className="flex items-center gap-1 text-on-surface-variant text-body-sm border border-outline-variant/20 rounded px-2 py-1 hover:bg-surface-variant/20">
 Bu Ay <span className="material-symbols-outlined text-[16px]">expand_more</span>
 </button>
 </div>
 <div className="flex gap-8 mb-6">
 <div className="flex-1">
 <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">Toplam Gelir</div>
 <div className="flex items-end gap-3 mb-4">
 <div className="font-headline-md text-headline-md text-on-surface">18.750 ₺</div>
 <div className="font-label-md text-label-md text-secondary flex items-center mb-1"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> %18,5</div>
 </div>
 <div className="h-12 w-full flex items-end gap-1">
 <div className="w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/50 rounded-b opacity-20 relative">
 <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 30">
 <path d="M0,25 L10,20 L20,28 L30,15 L40,18 L50,10 L60,15 L70,5 L80,12 L90,2 L100,8" fill="none" stroke="#4edea3" strokeWidth="2"></path>
 </svg>
 </div>
 </div>
 </div>
 <div className="flex-1 border-l border-outline-variant/10 pl-8">
 <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">Toplam Gider</div>
 <div className="flex items-end gap-3 mb-4">
 <div className="font-headline-md text-headline-md text-on-surface">6.300 ₺</div>
 <div className="font-label-md text-label-md text-error flex items-center mb-1"><span className="material-symbols-outlined text-[14px]">arrow_downward</span> %6,3</div>
 </div>
 <div className="h-12 w-full flex items-end gap-1">
 <div className="w-full h-full bg-gradient-to-r from-error/0 via-error/20 to-error/50 rounded-b opacity-20 relative">
 <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 30">
 <path d="M0,15 L10,12 L20,20 L30,10 L40,18 L50,15 L60,25 L70,18 L80,22 L90,10 L100,15" fill="none" stroke="#ffb4ab" strokeWidth="2"></path>
 </svg>
 </div>
 </div>
 </div>
 </div>
 <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-3 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="font-label-md text-label-md text-on-surface">Net Kazanç:</span>
 <span className="font-headline-sm text-headline-sm text-secondary">12.450 ₺</span>
 </div>
 <span className="font-label-md text-label-md text-secondary flex items-center"><span className="material-symbols-outlined text-[14px]">arrow_upward</span> %24,6</span>
 </div>
 </div>
 </div>
 </div>
 );
}
