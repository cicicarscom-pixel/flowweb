export default function GelenKutusuPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col h-full animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">Gelen Kutusu</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Tüm platformlardan gelen mesaj ve yorumlar tek yerde.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Tümünü Okundu İşaretle
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 h-full min-h-[600px]">
        
        {/* Left Col: Chat List */}
        <div className="w-full lg:w-1/3 flex flex-col glass-panel rounded-2xl border border-outline-variant/30 overflow-hidden">
          
          <div className="flex border-b border-outline-variant/30 bg-surface-container-low">
            <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-primary border-b-2 border-primary bg-primary/5 flex justify-center items-center gap-2">
              MESAJLAR <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px]">0</span>
            </button>
            <button className="flex-1 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
              YORUMLAR
            </button>
          </div>
          
          <div className="p-4 border-b border-outline-variant/20 bg-surface-container/50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Mesaj veya kişi ara..." 
                className="w-full bg-surface-container border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4 gap-3">
             {/* We can show an empty state here or mock items if needed, but user design said "Henüz mesajlaşma bulunmuyor" in center */}
             <p className="text-center text-on-surface-variant text-sm mt-10 opacity-70">Gösterilecek mesaj yok.</p>
          </div>
        </div>

        {/* Right Col: Chat Window / Empty State */}
        <div className="hidden lg:flex flex-1 flex-col glass-panel rounded-2xl border border-outline-variant/30 items-center justify-center relative overflow-hidden group">
          
          {/* Abstract glows */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center gap-4 p-8">
            <div className="w-24 h-24 rounded-full bg-surface-container-highest/50 border border-outline-variant/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-glow"></div>
              <span className="material-symbols-outlined text-5xl text-primary opacity-80">forum</span>
            </div>
            
            <h2 className="text-2xl font-headline-md font-bold text-on-surface">Henüz Mesajlaşma Bulunmuyor</h2>
            <p className="text-sm text-on-surface-variant max-w-md">Sol taraftaki listeden bir sohbet seçerek mesajlaşmaya başlayabilir veya AI Asistan'ın otomatik yanıtlarını takip edebilirsiniz.</p>
            
            <button className="mt-4 px-6 py-3 bg-surface-container border border-outline-variant/50 rounded-xl text-sm font-bold hover:bg-surface-container-high transition-colors hover:border-primary/50 text-on-surface">
              Yeni Mesaj Oluştur
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
