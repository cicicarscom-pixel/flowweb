export default function IsletmemPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">İşletmem (Geçmiş)</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Tüm geçmiş finansal hareketleriniz ve faturalarınız.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">TOPLAM BAKİYE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline-lg font-bold text-on-surface">124.500</span>
            <span className="text-lg font-headline-md text-on-surface">₺</span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-secondary/20 hover:border-secondary/50 neon-border-cyan transition-colors">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block text-secondary">TOPLAM GELİR</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline-lg font-bold text-secondary">158.200</span>
            <span className="text-lg font-headline-md text-secondary">₺</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-error/20 hover:border-error/50 transition-colors shadow-[0_0_10px_rgba(255,180,171,0.05)]">
          <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block text-error">TOPLAM GİDER</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline-lg font-bold text-error">33.700</span>
            <span className="text-lg font-headline-md text-error">₺</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col h-[500px]">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low">
          <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-primary border-b-2 border-primary bg-primary/5">
            TÜMÜ
          </button>
          <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
            GELİRLER
          </button>
          <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
            GİDERLER
          </button>
          <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
            FATURALAR
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-3">
          {[
            { title: "Proje Ödemesi (A Firması)", date: "15 Haz 2024", type: "income", amount: "+₺12.500" },
            { title: "Elektrik Faturası", date: "14 Haz 2024", type: "expense", amount: "-₺450" },
            { title: "Danışmanlık Geliri", date: "12 Haz 2024", type: "income", amount: "+₺3.200" },
            { title: "Ofis Kirası", date: "10 Haz 2024", type: "expense", amount: "-₺4.500" },
            { title: "Yazılım Lisansları", date: "05 Haz 2024", type: "expense", amount: "-₺1.200" },
            { title: "Yeni Müşteri Kapora", date: "01 Haz 2024", type: "income", amount: "+₺5.000" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                  item.type === 'income' ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-error/10 border-error/30 text-error'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {item.type === 'income' ? 'arrow_downward' : 'arrow_upward'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</h4>
                  <span className="text-xs font-code-sm text-on-surface-variant">{item.date}</span>
                </div>
              </div>
              <span className={`text-lg font-headline-md font-bold ${
                item.type === 'income' ? 'text-secondary' : 'text-error'
              }`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
