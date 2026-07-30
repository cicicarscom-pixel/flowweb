import Link from 'next/link';
import styles from './page.module.css';

export default function AiMuhasebePage() {
  return (
    <div className="w-full space-y-6 p-6 pb-24">
      {/* Page Title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <i className="fa-solid fa-wallet text-2xl text-primary"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Muhasebe</h1>
          <p className="text-sm text-gray-400 mt-1">Finansal durumunuzu tek ekranda yönetin.</p>
        </div>
      </div>

      {/* Hero Financial Summary Card */}
      <div className={`rounded-2xl border border-primary/30 ${styles.heroBg} p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]`}>
        <h2 className="text-3xl font-bold text-primary relative z-10 mb-2">Finansal Özet</h2>
        <p className="text-gray-400 relative z-10">Bu Ayki Performans (Temmuz)</p>
      </div>

      {/* Income & Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="rounded-xl border border-primary/40 bg-[#111827] p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-arrow-trend-up text-primary text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide mb-1 uppercase">BU AY GELİR</p>
            <p className="text-3xl font-bold text-white">0 <span className="text-xl font-normal">₺</span></p>
          </div>
        </div>
        {/* Expense Card */}
        <div className="rounded-xl border border-[#B534B2]/40 bg-[#111827] p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#B534B2]/10 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-arrow-trend-down text-[#B534B2] text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide mb-1 uppercase">BU AY GİDER</p>
            <p className="text-3xl font-bold text-white">0 <span className="text-xl font-normal">₺</span></p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="w-full py-4 rounded-xl border border-[#1F2937] bg-[#111827]/50 hover:bg-[#111827] flex items-center justify-center gap-3 transition-colors group">
          <i className="fa-solid fa-circle-plus text-primary text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-primary font-semibold tracking-wide">GELİR GİR</span>
        </button>
        <button className="w-full py-4 rounded-xl border border-[#1F2937] bg-[#111827]/50 hover:bg-[#111827] flex items-center justify-center gap-3 transition-colors group">
          <i className="fa-solid fa-circle-minus text-[#B534B2] text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-[#B534B2] font-semibold tracking-wide">GİDER GİR</span>
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-4 mt-8">
        {/* Dev Test */}
        <Link href="#" className="block rounded-xl border border-yellow-500/30 bg-[#111827] p-5 hover:bg-gray-800 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-bug text-yellow-500 text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-yellow-500 tracking-wide mb-1 uppercase">[DEV] TEST BİLDİRİMİ GÖNDER</h3>
              <p className="text-xs text-gray-400">Test amaçlı bildirim göndererek sistemi kontrol edin.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-yellow-500 transition-colors"></i>
        </Link>
        {/* History */}
        <Link href="/ai-muhasebe/isletmem" className="block rounded-xl border border-primary/30 bg-[#111827] p-5 hover:bg-gray-800 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-clock-rotate-left text-primary text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-primary tracking-wide mb-1 uppercase">İŞLETMEM (GEÇMİŞ DÖNEMLER)</h3>
              <p className="text-xs text-gray-400">Geçmiş dönemlerin gelir, gider ve finansal raporlarına erişin.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-primary transition-colors"></i>
        </Link>
        {/* Calendar */}
        <Link href="/ai-muhasebe/odeme-takvimi" className="block rounded-xl border border-green-500/30 bg-[#111827] p-5 hover:bg-gray-800 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-calendar-days text-green-400 text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-green-400 tracking-wide mb-1 uppercase">ÖDEME TAKVİMİ</h3>
              <p className="text-xs text-gray-400">Yaklaşan ödeme ve tahsilat planlarınızı görüntüleyin.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-green-400 transition-colors"></i>
        </Link>
        {/* AI Assistant */}
        <Link href="/ai-asistan" className="block rounded-xl border border-emerald-500/30 bg-[#111827] p-5 hover:bg-gray-800 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-wand-magic-sparkles text-emerald-400 text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 tracking-wide mb-1 uppercase">AI ASİSTAN</h3>
              <p className="text-xs text-gray-400">Yapay zeka asistanınızla finansal konularda destek alın.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-emerald-400 transition-colors"></i>
        </Link>
      </div>
    </div>
  );
}
