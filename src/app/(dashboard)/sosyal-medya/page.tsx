import Link from "next/link";

export default function SosyalMedyaPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      
      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-primary text-glow">Sosyal Medya Yönetimi</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Tüm dijital varlıklarınızı tek merkezden AI ile yönetin.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30">
          <span className="font-label-sm text-sm font-bold text-on-surface">Oto-Paylaşım (AI)</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer toggle-checkbox" defaultChecked />
            <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all toggle-label shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
          </label>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/sosyal-medya/create-post" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-primary/50 transition-all group cursor-pointer text-center">
          <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">add_box</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Gönderi Oluştur</span>
        </Link>
        <Link href="/sosyal-medya/posts" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-secondary/50 transition-all group cursor-pointer text-center">
          <span className="material-symbols-outlined text-3xl text-secondary group-hover:scale-110 transition-transform">view_list</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Tüm Gönderiler</span>
        </Link>
        <Link href="/sosyal-medya/inbox" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-tertiary/50 transition-all group cursor-pointer text-center relative">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_5px_rgba(255,180,171,0.8)]"></div>
          <span className="material-symbols-outlined text-3xl text-tertiary group-hover:scale-110 transition-transform">forum</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Gelen Kutusu</span>
        </Link>
        <Link href="/sosyal-medya/share" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high hover:border-primary-container/50 transition-all group cursor-pointer text-center">
          <span className="material-symbols-outlined text-3xl text-primary-container group-hover:scale-110 transition-transform">hub</span>
          <span className="font-label-sm text-xs text-on-surface-variant group-hover:text-on-surface uppercase tracking-wider">Paylaşım Mrk.</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Connected Accounts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-headline-md font-bold text-on-surface">Bağlı Hesaplar</h2>
          
          <div className="flex flex-col gap-3">
            <div className="glass-panel p-4 rounded-xl border border-secondary/30 neon-border-cyan flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">@guzellik_salonu_ist</h3>
                  <span className="text-xs text-on-surface-variant">Instagram Business</span>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-error/50 text-error rounded-lg text-xs hover:bg-error/10 transition-colors">Ayır</button>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2]">
                  <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Güzellik Salonu İstanbul</h3>
                  <span className="text-xs text-on-surface-variant">Facebook Sayfası</span>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-error/50 text-error rounded-lg text-xs hover:bg-error/10 transition-colors">Ayır</button>
            </div>
            
            <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-tertiary/50 transition-colors flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EA4335]/20 flex items-center justify-center text-[#EA4335]">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">İstanbul Merkez Şube</h3>
                  <span className="text-xs text-on-surface-variant">Google Business Profile</span>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-error/50 text-error rounded-lg text-xs hover:bg-error/10 transition-colors">Ayır</button>
            </div>
          </div>
        </div>

        {/* Add Account Grid */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-headline-md font-bold text-on-surface">Yeni Hesap Ekle</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">photo_camera</span>
              </div>
              <span className="text-xs font-bold text-on-surface">Instagram</span>
            </button>
            
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-[#1877F2]/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">thumb_up</span>
              </div>
              <span className="text-xs font-bold text-on-surface">Facebook</span>
            </button>
            
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-[#0077B5]/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-[#0077B5]/10 flex items-center justify-center text-[#0077B5] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">work</span>
              </div>
              <span className="text-xs font-bold text-on-surface">LinkedIn</span>
            </button>
            
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-[#FF0000]/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">play_circle</span>
              </div>
              <span className="text-xs font-bold text-on-surface">YouTube</span>
            </button>
            
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-[#000000]/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </div>
              <span className="text-xs font-bold text-on-surface">X (Twitter)</span>
            </button>
            
            <button className="glass-panel p-4 rounded-xl border border-outline-variant/30 hover:border-[#00F2FE]/50 transition-colors flex flex-col items-center justify-center gap-2 text-center group bg-surface-container-highest/20 hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-[#00F2FE]/10 flex items-center justify-center text-[#00F2FE] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">music_note</span>
              </div>
              <span className="text-xs font-bold text-on-surface">TikTok</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
