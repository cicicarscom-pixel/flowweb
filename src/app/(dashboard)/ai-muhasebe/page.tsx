import Link from 'next/link';
import styles from './page.module.css';

export default function AiMuhasebePage() {
 return (
 <div className="w-full space-y-6 p-6 pb-24">
 {/* Page Title */}
 <div className="flex items-center gap-4 mb-8">
 <div className="w-12 h-12 rounded-xl -primary/10 flex items-center justify-center">
 <i className="fa-solid fa-wallet text-2xl text-primary"></i>
 </div>
 <div>
 <h1 className="text-2xl font-bold text-on-surface">AI Muhasebe</h1>
 <p className="text-sm text-on-surface-variant mt-1">Finansal durumunuzu tek ekranda yönetin.</p>
 </div>
 </div>

 {/* Hero Financial Summary Card */}
 <div className={`rounded-2xl border border-primary/30 ${styles.heroBg} p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]`}>
 <h2 className="text-3xl font-bold text-primary relative z-10 mb-2">Finansal Özet</h2>
 <p className="text-on-surface-variant relative z-10">Bu Ayki Performans (Temmuz)</p>
 </div>

 {/* Income & Expense Stats */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Income Card */}
 <div className="rounded-xl border border-primary/40 bg-surface-container p-6 flex items-center gap-6">
 <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
 <i className="fa-solid fa-arrow-trend-up text-primary text-xl"></i>
 </div>
 <div>
 <p className="text-sm font-medium text-on-surface-variant tracking-wide mb-1 uppercase">BU AY GELİR</p>
 <p className="text-3xl font-bold text-on-surface">0 <span className="text-xl font-normal">₺</span></p>
 </div>
 </div>
 {/* Expense Card */}
 <div className="rounded-xl border border-[#B534B2]/40 bg-surface-container p-6 flex items-center gap-6">
 <div className="w-14 h-14 rounded-full bg-[#B534B2]/10 flex items-center justify-center flex-shrink-0">
 <i className="fa-solid fa-arrow-trend-down text-[#B534B2] text-xl"></i>
 </div>
 <div>
 <p className="text-sm font-medium text-on-surface-variant tracking-wide mb-1 uppercase">BU AY GİDER</p>
 <p className="text-3xl font-bold text-on-surface">0 <span className="text-xl font-normal">₺</span></p>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <Link href="/ai-muhasebe/veri-girisi?type=gelir" className="w-full py-4 rounded-xl border border-[#1F2937] bg-surface-container/50 hover:bg-surface-container flex items-center justify-center gap-3 transition-colors group">
 <i className="fa-solid fa-circle-plus text-primary text-xl group-hover:scale-110 transition-transform"></i>
 <span className="text-primary font-semibold tracking-wide">GELİR GİR</span>
 </Link>
 <Link href="/ai-muhasebe/veri-girisi?type=gider" className="w-full py-4 rounded-xl border border-[#1F2937] bg-surface-container/50 hover:bg-surface-container flex items-center justify-center gap-3 transition-colors group">
 <i className="fa-solid fa-circle-minus text-[#B534B2] text-xl group-hover:scale-110 transition-transform"></i>
 <span className="text-[#B534B2] font-semibold tracking-wide">GİDER GİR</span>
 </Link>
 </div>

 {/* List Items */}
 <div className="space-y-4 mt-8">
 {/* Dev Test */}
 <Link href="#" className="block rounded-xl border -tertiary/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
 <div className="flex items-center gap-4">
 <i className="fa-solid fa-bug -tertiary text-xl w-6 text-center"></i>
 <div>
 <h3 className="text-sm font-semibold -tertiary tracking-wide mb-1 uppercase">[DEV] TEST BİLDİRİMİ GÖNDER</h3>
 <p className="text-xs text-on-surface-variant">Test amaçlı bildirim göndererek sistemi kontrol edin.</p>
 </div>
 </div>
 <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:-tertiary transition-colors"></i>
 </Link>
 {/* History */}
 <Link href="/ai-muhasebe/isletmem" className="block rounded-xl border border-primary/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
 <div className="flex items-center gap-4">
 <i className="fa-solid fa-clock-rotate-left text-primary text-xl w-6 text-center"></i>
 <div>
 <h3 className="text-sm font-semibold text-primary tracking-wide mb-1 uppercase">İŞLETMEM (GEÇMİŞ DÖNEMLER)</h3>
 <p className="text-xs text-on-surface-variant">Geçmiş dönemlerin gelir, gider ve finansal raporlarına erişin.</p>
 </div>
 </div>
 <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:text-primary transition-colors"></i>
 </Link>
 {/* Calendar */}
 <Link href="/ai-muhasebe/odeme-takvimi" className="block rounded-xl border -secondary/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
 <div className="flex items-center gap-4">
 <i className="fa-solid fa-calendar-days -secondary text-xl w-6 text-center"></i>
 <div>
 <h3 className="text-sm font-semibold -secondary tracking-wide mb-1 uppercase">ÖDEME TAKVİMİ</h3>
 <p className="text-xs text-on-surface-variant">Yaklaşan ödeme ve tahsilat planlarınızı görüntüleyin.</p>
 </div>
 </div>
 <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:-secondary transition-colors"></i>
 </Link>
 {/* AI Assistant */}
 <Link href="/ai-muhasebe/veri-girisi?type=asistan" className="block rounded-xl border -secondary/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
 <div className="flex items-center gap-4">
 <i className="fa-solid fa-wand-magic-sparkles -secondary text-xl w-6 text-center"></i>
 <div>
 <h3 className="text-sm font-semibold -secondary tracking-wide mb-1 uppercase">AI ASİSTAN</h3>
 <p className="text-xs text-on-surface-variant">Yapay zeka asistanınızla finansal konularda destek alın.</p>
 </div>
 </div>
 <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:-secondary transition-colors"></i>
 </Link>
 </div>
 </div>
 );
}
