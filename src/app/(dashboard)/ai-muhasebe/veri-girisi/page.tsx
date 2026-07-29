export default function AiVeriGirisiPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col h-full animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">AI Veri Girişi</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Yapay zekaya söyleyin, o kaydetsin.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
        {/* Left Col: Upload & Suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-dashed border-secondary/50 hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-3 h-48 bg-surface-container-highest/20 group">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary text-2xl">cloud_upload</span>
            </div>
            <div>
              <span className="font-bold text-sm text-on-surface block">Fatura veya Fiş Yükle</span>
              <span className="text-xs text-on-surface-variant">PNG, JPG, PDF (Max 5MB)</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex-1">
            <h3 className="font-headline-md font-bold text-on-surface mb-4">Örnek Komutlar</h3>
            <div className="flex flex-col gap-3">
              {[
                "Bugün 1200 TL ofis masrafı yaptım.",
                "Ahmet Bey'den 5000 TL kapora aldım.",
                "Elektrik faturası 450 TL geldi, kaydet.",
                "Geçen ayın kira ödemesini tamamladım."
              ].map((cmd, i) => (
                <button key={i} className="text-left text-sm font-body-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high p-3 rounded-xl border border-outline-variant/20 hover:border-primary/50 hover:text-primary transition-all">
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Chat Interface */}
        <div className="lg:col-span-2 flex flex-col glass-panel rounded-2xl border border-primary/30 neon-border-purple overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container/50 backdrop-blur-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
            </div>
            <div>
              <h3 className="font-headline-md font-bold text-on-surface">CYBER_ACCOUNTANT</h3>
              <span className="text-[10px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-0.5 rounded-full font-bold">DİNLEMEDE</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            {/* AI Welcome Message */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              <div className="bg-surface-container-highest p-4 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm text-sm text-on-surface w-fit">
                Merhaba! Ben AI Muhasebe Asistanınız. Yeni bir gelir veya gider kaydetmek için bana detayları yazabilir ya da soldaki alandan fiş/fatura fotoğrafı yükleyebilirsiniz. Nasıl yardımcı olabilirim?
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container/30">
            <div className="relative flex items-center">
              <button className="absolute left-3 w-8 h-8 rounded-full text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <input 
                type="text" 
                placeholder="Örn: Yemek için 300 TL harcadım..." 
                className="w-full bg-surface-container border border-outline-variant/50 rounded-full pl-12 pr-14 py-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors shadow-inner"
              />
              <button className="absolute right-2 w-10 h-10 rounded-full bg-primary text-on-primary-container flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
