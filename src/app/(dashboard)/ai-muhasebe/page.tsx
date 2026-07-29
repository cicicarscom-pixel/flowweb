"use client";

import Link from "next/link";

export default function AiMuhasebePage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in relative pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-lg backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface tracking-wide drop-shadow-md">Finansal Özet</h1>
          <p className="font-code-sm text-sm text-on-surface-variant mt-1">Gerçek zamanlı bakiye ve AI destekli nakit akışı analizi.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/ai-muhasebe/veri-girisi" className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/20 transition-all font-label-sm text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_10px_rgba(68,226,205,0.1)]">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Gelir Ekle
          </Link>
          <Link href="/ai-muhasebe/veri-girisi" className="px-4 py-2 bg-error/10 text-error border border-error/30 rounded-lg hover:bg-error/20 transition-all font-label-sm text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_10px_rgba(255,180,171,0.1)]">
            <span className="material-symbols-outlined text-[18px]">remove</span>
            Gider Ekle
          </Link>
        </div>
      </div>

      {/* Quick Actions (Tabs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/ai-muhasebe/odeme-takvimi" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-secondary/50 transition-all group">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary transition-colors">calendar_month</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Takvim</span>
        </Link>
        <Link href="/ai-muhasebe/isletmem" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">history</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Geçmiş</span>
        </Link>
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-tertiary/50 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-tertiary transition-colors">receipt_long</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Faturalar</span>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-error/50 transition-all group cursor-pointer relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_5px_rgba(255,180,171,0.8)]"></div>
          <span className="material-symbols-outlined text-3xl text-error">warning</span>
          <span className="font-label-sm text-xs text-error uppercase tracking-wider drop-shadow-sm">Yaklaşan (3)</span>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Balance & Cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-secondary/30 neon-border-cyan">
            <h3 className="font-label-sm text-sm uppercase tracking-widest text-secondary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">account_balance</span>
              Net Bakiye (30 Gün)
            </h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl lg:text-5xl font-headline-lg font-bold text-on-surface tracking-tighter drop-shadow-lg">₺ 8,300</span>
              <span className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-1 rounded-md text-xs font-bold mb-2">+12%</span>
            </div>
            
            {/* Simple Bar Chart Visual */}
            <div className="h-32 mt-6 border-b border-l border-outline-variant/30 flex items-end justify-between px-2 pb-2">
              <div className="w-1/6 bg-secondary/30 hover:bg-secondary/60 rounded-t-sm h-[30%] transition-all cursor-pointer"></div>
              <div className="w-1/6 bg-secondary/40 hover:bg-secondary/70 rounded-t-sm h-[50%] transition-all cursor-pointer"></div>
              <div className="w-1/6 bg-secondary/50 hover:bg-secondary/80 rounded-t-sm h-[40%] transition-all cursor-pointer"></div>
              <div className="w-1/6 bg-secondary/60 hover:bg-secondary/90 rounded-t-sm h-[70%] transition-all cursor-pointer shadow-[0_0_10px_rgba(68,226,205,0.3)]"></div>
              <div className="w-1/6 bg-secondary/80 hover:bg-secondary transition-all cursor-pointer shadow-[0_0_15px_rgba(68,226,205,0.4)]"></div>
              <div className="w-1/6 bg-secondary hover:bg-secondary transition-all cursor-pointer shadow-[0_0_20px_rgba(68,226,205,0.6)] h-[90%]"></div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Insights / Next Payments */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 h-full flex flex-col">
            <h3 className="font-headline-md font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">notification_important</span>
              Yaklaşan Ödemeler
            </h3>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {[
                { title: "Ofis Kirası", amount: "₺4,500", date: "Yarın", urgency: "critical" },
                { title: "İnternet Faturası", amount: "₺350", date: "3 Gün Sonra", urgency: "warning" },
                { title: "Vergi Ödemesi", amount: "₺2,100", date: "5 Gün Sonra", urgency: "normal" }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border flex justify-between items-center bg-surface-container-highest/50 hover:bg-surface-container-highest transition-colors ${
                  item.urgency === 'critical' ? 'border-error/50 shadow-[inset_0_0_10px_rgba(255,180,171,0.1)]' :
                  item.urgency === 'warning' ? 'border-tertiary/40' : 'border-outline-variant/30'
                }`}>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                    <span className={`text-xs font-code-sm ${
                      item.urgency === 'critical' ? 'text-error font-bold' : 'text-on-surface-variant'
                    }`}>{item.date}</span>
                  </div>
                  <span className="text-sm font-headline-md font-bold text-on-surface">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB - AI Assistant Trigger */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-secondary/30 blur-xl group-hover:bg-secondary/50 transition-all duration-500 animate-pulse-glow"></div>
          <button className="relative w-16 h-16 rounded-full bg-surface border border-secondary shadow-[0_0_20px_rgba(68,226,205,0.4)] flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <span className="material-symbols-outlined text-secondary text-3xl">auto_awesome</span>
          </button>
        </div>
      </div>
    </div>
  );
}
