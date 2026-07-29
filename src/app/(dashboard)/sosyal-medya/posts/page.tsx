export default function TumGonderilerPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col h-full animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">Tüm Gönderiler</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Geçmiş ve gelecek tüm içeriklerinizi tek ekrandan yönetin.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Gönderi ara..." 
              className="bg-surface-container border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors w-64"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          </div>
          <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filtrele
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col h-[700px]">
        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low overflow-x-auto custom-scrollbar">
          <button className="px-6 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-primary border-b-2 border-primary bg-primary/5 whitespace-nowrap">
            TÜMÜ (124)
          </button>
          <button className="px-6 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap flex items-center gap-2">
            PLANLANAN <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded-full text-[10px]">12</span>
          </button>
          <button className="px-6 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap">
            YAYINLANAN
          </button>
          <button className="px-6 py-4 text-center font-label-sm text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap flex items-center gap-2">
            HATALI <span className="bg-error/20 text-error px-2 py-0.5 rounded-full text-[10px]">2</span>
          </button>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant/20 bg-surface-container-highest/30">
          <div className="col-span-5 md:col-span-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">İçerik</div>
          <div className="col-span-3 md:col-span-2 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider hidden md:block">Platform</div>
          <div className="col-span-4 md:col-span-3 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Durum & Tarih</div>
          <div className="col-span-3 md:col-span-3 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider text-right">İşlem</div>
        </div>

        {/* Post List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {[
            { text: "Yaz Kampanyası Başladı! %50'ye varan indirimleri kaçırmayın...", platform: "Instagram", status: "Planlanan", date: "Yarın, 14:00", img: true, type: "scheduled" },
            { text: "Yeni koleksiyonumuz mağazalarda. Keşfetmek için profildeki linke tıkla.", platform: "Facebook", status: "Yayınlandı", date: "Bugün, 09:30", img: true, type: "published" },
            { text: "Sektör raporumuzu yayınladık. İncelemek ister misiniz?", platform: "LinkedIn", status: "Hatalı", date: "Dün, 16:00", error: "Token expired", img: false, type: "error" },
            { text: "Hafta sonu sürprizine hazır mısınız? Takipte kalın!", platform: "X (Twitter)", status: "Yayınlandı", date: "12 Haz, 10:00", img: false, type: "published" },
            { text: "Müşteri memnuniyeti anketimiz sonuçlandı. Katılan herkese teşekkürler.", platform: "Instagram", status: "Yayınlandı", date: "10 Haz, 18:30", img: true, type: "published" },
          ].map((post, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant/10 hover:bg-surface-container transition-colors items-center group">
              
              {/* Content Col */}
              <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg border border-outline-variant/30 shrink-0 flex items-center justify-center bg-surface-container-highest overflow-hidden ${!post.img ? 'opacity-50' : ''}`}>
                  {post.img ? (
                     <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">text_snippet</span>
                  )}
                </div>
                <p className="text-sm text-on-surface line-clamp-2 pr-2">{post.text}</p>
              </div>
              
              {/* Platform Col */}
              <div className="col-span-3 md:col-span-2 hidden md:flex items-center gap-2">
                {post.platform === "Instagram" && <div className="w-6 h-6 rounded-md bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]"><span className="material-symbols-outlined text-[14px]">photo_camera</span></div>}
                {post.platform === "Facebook" && <div className="w-6 h-6 rounded-md bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2]"><span className="material-symbols-outlined text-[14px]">thumb_up</span></div>}
                {post.platform === "LinkedIn" && <div className="w-6 h-6 rounded-md bg-[#0077B5]/20 flex items-center justify-center text-[#0077B5]"><span className="material-symbols-outlined text-[14px]">work</span></div>}
                {post.platform === "X (Twitter)" && <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white"><span className="material-symbols-outlined text-[14px]">close</span></div>}
                <span className="text-xs text-on-surface-variant font-bold">{post.platform}</span>
              </div>
              
              {/* Status Col */}
              <div className="col-span-4 md:col-span-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  {post.type === 'scheduled' && <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_5px_rgba(68,226,205,0.8)]"></span>}
                  {post.type === 'published' && <span className="w-2 h-2 rounded-full bg-outline"></span>}
                  {post.type === 'error' && <span className="w-2 h-2 rounded-full bg-error shadow-[0_0_5px_rgba(255,180,171,0.8)]"></span>}
                  
                  <span className={`text-xs font-bold ${
                    post.type === 'scheduled' ? 'text-secondary' :
                    post.type === 'error' ? 'text-error' : 'text-on-surface-variant'
                  }`}>{post.status}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/70 font-code-sm">{post.date}</span>
                {post.error && <span className="text-[9px] text-error mt-0.5">{post.error}</span>}
              </div>
              
              {/* Actions Col */}
              <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-primary/20 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center border border-outline-variant/30 hover:border-primary/50">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors flex items-center justify-center border border-outline-variant/30 hover:border-error/50">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant transition-colors flex items-center justify-center border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[16px]">more_vert</span>
                </button>
              </div>
            </div>
          ))}
          
          {/* Pagination (Mock) */}
          <div className="mt-auto p-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
            <span className="text-xs text-on-surface-variant font-code-sm">Toplam 124 kayıttan 1-5 arası gösteriliyor</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-md bg-surface-container border border-outline-variant/30 flex items-center justify-center opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-md bg-primary text-on-primary-container flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                1
              </button>
              <button className="w-8 h-8 rounded-md bg-surface-container border border-outline-variant/30 hover:bg-surface-container-high transition-colors flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-md bg-surface-container border border-outline-variant/30 hover:bg-surface-container-high transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
