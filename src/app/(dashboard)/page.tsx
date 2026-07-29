export default function DashboardHomePage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. AI Assistant Active Panel */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 neon-border-purple relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="material-symbols-outlined text-on-primary-container text-[28px]">smart_toy</span>
          </div>
          <div>
            <h2 className="text-xl font-headline-md font-bold text-primary text-glow">Yapay Zeka Asistanı</h2>
            <p className="text-sm font-body-md text-on-surface-variant">Sistem aktif ve 7/24 izlemede.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-highest px-4 py-2 rounded-full border border-primary/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
          <span className="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-full animate-pulse-glow"></span>
          <span className="text-xs font-label-sm font-bold tracking-widest text-tertiary-fixed-dim">AKTİF</span>
        </div>
      </section>

      {/* 2. Financial Summary (Gelir/Gider) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-secondary/30 neon-border-cyan flex flex-col justify-center h-32 hover:bg-surface-container/60 transition-colors group cursor-pointer">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 group-hover:text-secondary transition-colors">BU AY GELİR</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline-lg font-bold text-surface-tint">12.500</span>
            <span className="text-lg font-headline-md text-surface-tint">₺</span>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-error/30 hover:border-error/50 flex flex-col justify-center h-32 hover:bg-surface-container/60 transition-colors group cursor-pointer shadow-[0_0_10px_rgba(255,180,171,0.1)]">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 group-hover:text-error transition-colors">BU AY GİDER</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline-lg font-bold text-error">4.200</span>
            <span className="text-lg font-headline-md text-error">₺</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Social Media Accounts Analysis */}
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-headline-md font-bold text-secondary">Tüm Hesaplar (Analiz)</h3>
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-label-sm uppercase tracking-widest text-on-surface-variant">Takipçi Büyümesi</span>
              <span className="text-xs font-bold text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-1 rounded-md">+ %12.4</span>
            </div>
            {/* Mock Chart Area */}
            <div className="h-48 w-full border-b border-l border-outline-variant/30 flex items-end justify-between px-2 pb-2 relative">
              <div className="w-8 bg-primary/40 rounded-t-sm h-[40%] hover:bg-primary/80 transition-all cursor-pointer"></div>
              <div className="w-8 bg-primary/40 rounded-t-sm h-[55%] hover:bg-primary/80 transition-all cursor-pointer"></div>
              <div className="w-8 bg-primary/50 rounded-t-sm h-[45%] hover:bg-primary/80 transition-all cursor-pointer"></div>
              <div className="w-8 bg-primary/60 rounded-t-sm h-[70%] hover:bg-primary/80 transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
              <div className="w-8 bg-primary/80 rounded-t-sm h-[60%] hover:bg-primary transition-all cursor-pointer"></div>
              <div className="w-8 bg-primary rounded-t-sm h-[90%] hover:bg-primary transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>
            </div>
            <div className="flex justify-between px-2 mt-2 text-[10px] text-on-surface-variant font-code-sm">
              <span>Oca</span>
              <span>Şub</span>
              <span>Mar</span>
              <span>Nis</span>
              <span>May</span>
              <span>Haz</span>
            </div>
          </div>
        </section>

        {/* 4. Communication Reports */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-headline-md font-bold text-primary">İletişim Raporları</h3>
            <button className="text-xs text-primary hover:underline">Tümünü Gör</button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { title: "Yeni WhatsApp Mesajı", time: "10 dk önce", icon: "chat", color: "text-secondary" },
              { title: "Instagram Yorumu", time: "1 saat önce", icon: "forum", color: "text-primary" },
              { title: "Google Değerlendirmesi", time: "3 saat önce", icon: "star", color: "text-tertiary-fixed-dim" }
            ].map((report, i) => (
              <div key={i} className="glass-panel p-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 ${report.color}`}>
                  <span className="material-symbols-outlined text-[20px]">{report.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">{report.title}</h4>
                  <span className="text-[10px] font-code-sm text-on-surface-variant">{report.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
