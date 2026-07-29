export default function PaylasimMerkeziPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col h-full animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">Paylaşım Merkezi</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Hazırlanan içeriği inceleyin, platformları seçin ve paylaşın.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Left Col: Content Preview */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                Görsel
              </h3>
              <button className="text-xs flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[14px]">edit</span> Düzenle
              </button>
            </div>
            
            <div className="w-full aspect-square bg-surface-container rounded-xl border border-outline-variant/50 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9A9E] to-[#FECFEF] opacity-80 mix-blend-overlay"></div>
              {/* Mock Image Content */}
              <div className="relative z-10 flex flex-col items-center text-center p-8">
                 <h2 className="text-white text-3xl font-black tracking-tighter drop-shadow-md">YAZ<br/>KAMPANYASI</h2>
                 <p className="text-white font-bold mt-4 drop-shadow-md">%50 İNDİRİM</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">text_snippet</span>
                Metin İçeriği
              </h3>
            </div>
            
            <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/50 text-sm text-on-surface">
              Yaz sıcaklarına ferah bir mola! ☀️ Yeni koleksiyonumuzla yaza hazır mısın? Arkadaşını etiketle, sürprizleri kaçırma! 👇 #YazGeldi #Kampanya #Fırsat
            </div>
          </div>
        </div>

        {/* Right Col: Publish Settings */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-primary/30 neon-border-purple flex flex-col gap-6 h-full">
            
            <div>
              <h3 className="font-headline-md font-bold text-on-surface mb-4">Paylaşılacak Platformlar</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors border-primary bg-primary/10 text-primary">
                  <input type="checkbox" className="sr-only" defaultChecked />
                  <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                  <span className="text-[10px] font-bold">Instagram</span>
                </label>
                <label className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary">
                  <input type="checkbox" className="sr-only" />
                  <span className="material-symbols-outlined text-[24px]">thumb_up</span>
                  <span className="text-[10px] font-bold">Facebook</span>
                </label>
                <label className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary">
                  <input type="checkbox" className="sr-only" />
                  <span className="material-symbols-outlined text-[24px]">work</span>
                  <span className="text-[10px] font-bold">LinkedIn</span>
                </label>
                <label className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors border-outline-variant/50 text-on-surface-variant hover:border-primary/50 hover:text-primary">
                  <input type="checkbox" className="sr-only" />
                  <span className="material-symbols-outlined text-[24px]">close</span>
                  <span className="text-[10px] font-bold">X (Twitter)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-headline-md font-bold text-on-surface mb-4">Hesap Seçimi</h3>
              <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors">
                <option>@guzellik_salonu_ist (Instagram Business)</option>
                <option>Tüm Instagram Hesapları (2)</option>
              </select>
            </div>

            <div>
              <h3 className="font-headline-md font-bold text-on-surface mb-4">Gönderi Tipi</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="postType" className="accent-primary" defaultChecked />
                  <span className="text-sm text-on-surface">Feed (Akış)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="postType" className="accent-primary" />
                  <span className="text-sm text-on-surface">Story (Hikaye)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="postType" className="accent-primary" />
                  <span className="text-sm text-on-surface">Reels</span>
                </label>
              </div>
            </div>
            
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button className="w-full py-4 bg-primary text-on-primary-container font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-transform flex justify-center items-center gap-2">
                <span className="material-symbols-outlined">send</span>
                Hemen Paylaş
              </button>
              <button className="w-full py-4 bg-surface-container border border-outline-variant/50 text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                İleri Tarihe Planla
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
