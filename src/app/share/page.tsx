import Link from "next/link";
import Image from "next/image";

export default function SharePage() {
  return (
    <div className="bg-[var(--color-surface)] font-body-md text-[var(--color-on-surface)] antialiased grid-bg h-screen flex overflow-hidden">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full w-[280px] bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-md border-r border-white/5 flex flex-col py-lg z-40 hidden md:flex">
        <div className="px-md mb-xl flex items-center gap-sm">
          <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">auto_awesome</span>
          <div>
            <h1 className="font-headline-lg text-[var(--color-primary)] text-2xl font-bold tracking-tight">Creator Hub</h1>
            <p className="font-data-mono text-data-mono text-[var(--color-on-surface-variant)] text-[10px]">AI-Powered Scale</p>
          </div>
        </div>
        <div className="flex-1 px-sm space-y-2">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-body-md text-body-md">Content Lab</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent text-[var(--color-primary)] font-bold cursor-pointer" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
            <span className="font-body-md text-body-md">AI Paylaşım</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">perm_media</span>
            <span className="font-body-md text-body-md">Media Library</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="font-body-md text-body-md">Schedule</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">layers</span>
            <span className="font-body-md text-body-md">Platforms</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all duration-300 cursor-pointer" href="#">
            <span className="material-symbols-outlined">psychology</span>
            <span className="font-body-md text-body-md">AI Insights</span>
          </a>
        </div>
        <div className="px-md mt-auto pt-lg border-t border-white/5 space-y-4">
          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] text-[var(--color-on-primary)] font-label-sm text-label-sm uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_10px_rgba(0,162,255,0.3)] transition-all active:scale-95 duration-200">
            Upgrade to Pro
          </button>
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
              <span className="font-data-mono text-[12px]">Support</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 transition-all" href="#">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-data-mono text-[12px]">Logout</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[280px] h-full relative">
        {/* TopNavBar */}
        <header className="fixed top-0 w-full md:w-[calc(100%-280px)] z-50 flex justify-between items-center px-margin-desktop py-4 bg-[var(--color-surface)]/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,162,255,0.1)]">
          <div className="flex items-center gap-md">
            <div className="font-display-lg text-headline-lg-mobile text-[var(--color-primary)] bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)]">CreatorFlow AI</div>
          </div>
          <div className="hidden lg:flex items-center gap-8 font-label-sm text-label-sm uppercase tracking-wider">
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors" href="#">Dashboard</a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors" href="#">Analytics</a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors" href="#">Assets</a>
            <a className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors" href="#">Templates</a>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 rounded-full hover:bg-white/10 text-[var(--color-on-surface-variant)] transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 text-[var(--color-on-surface-variant)] transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <img 
              className="w-10 h-10 rounded-full border border-white/10 object-cover" 
              alt="Avatar placeholder" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHJkTLXiGS-7h-_aPULEmrsM5uknpBDW0KbXCShiJasNUDpHQsJ8lK53YV-2ESNhV_aKApcWI97LVRUqzut22Tj62cyl93-zq9SoEqu9xzN897pJW09nqW652Ier7gVRPkzyC4asntfLTjHj6A-9kCHlNYZGzD2lJaL90Ct8QyJwvfkWzqx5tg1zpzMI01e4H8E-TCMIJcScyUjG1ODc27h495ELPI1ztjihRQyHlCesnMVzNdhQ8lxLjHPuX_-4LV6czbN4OAkec"
            />
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 mt-[80px] p-margin-desktop overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-gutter">
            {/* Left Column: Content Creation */}
            <div className="flex-1 flex flex-col gap-md">
              {/* Intent Input */}
              <div className="glass-panel rounded-xl p-md">
                <label className="font-data-mono text-data-mono text-[var(--color-on-surface-variant)] uppercase mb-sm block">NE PAYLAŞALIM?</label>
                <textarea 
                  className="w-full bg-black/40 border-b border-white/10 rounded-t-lg p-4 text-[var(--color-on-surface)] font-body-md focus:border-[var(--color-primary)] focus:outline-none focus:ring-0 transition-colors h-32 resize-none" 
                  placeholder="Örn: Yeni yaz koleksiyonu için enerjik bir post..."
                ></textarea>
              </div>

              {/* Media Zone */}
              <div className="glass-panel rounded-xl p-xl flex flex-col items-center justify-center text-center gap-md border-t-2 border-[var(--color-primary)] border-opacity-50 relative group cursor-pointer hover:bg-white/5 transition-all">
                <div className="absolute top-4 right-4 p-2 bg-[var(--color-surface-container)] rounded-full border border-white/10 text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-tertiary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">add_photo_alternate</span>
                </div>
                <div>
                  <h3 className="font-headline-lg-mobile text-[var(--color-on-surface)] mb-2">görsel &amp; video seç yada sadece görsel üret</h3>
                  <p className="font-body-md text-[var(--color-on-surface-variant)] max-w-md mx-auto">Galeriden eklemek için dokunun veya AI'ın buraya görsel üretmesini bekleyin</p>
                </div>
              </div>

              {/* AI Content generation */}
              <div className="glass-panel rounded-xl p-md border-t-2 border-[var(--color-secondary)] border-opacity-50 flex flex-col">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-headline-lg-mobile text-[var(--color-on-surface)] flex items-center gap-2">
                    İçerik Metni
                  </h3>
                  <button className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-container)] transition-colors p-2">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>
                <div className="bg-black/20 p-md rounded-lg border border-white/5 min-h-[120px] mb-md font-body-md text-[var(--color-on-surface-variant)]">
                  Yapay zeka tarafından oluşturulan içerik metni burada görünecek. Gelişmiş dil modelleri ile hedef kitlenize uygun, etkileşimi yüksek metinler hazırlanıyor...
                </div>
                <div className="flex items-center gap-sm mb-md relative">
                  <input 
                    className="flex-1 bg-black/40 border border-white/10 rounded-full py-3 px-5 text-[var(--color-on-surface)] font-body-md focus:border-[var(--color-secondary)] focus:outline-none focus:ring-0 transition-colors pr-16" 
                    placeholder="Görsele uygun bir metin üret..." 
                    type="text"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-secondary-container)] to-[var(--color-secondary)] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_10px_rgba(182,0,248,0.3)]">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-data-mono text-[12px] cursor-pointer hover:bg-[var(--color-primary)]/20 transition-colors">#yaz</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-data-mono text-[12px] cursor-pointer hover:bg-[var(--color-primary)]/20 transition-colors">#yenisezon</span>
                  <button className="px-3 py-1 rounded-full border border-white/20 text-[var(--color-on-surface-variant)] font-data-mono text-[12px] flex items-center gap-1 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">add</span> Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Preview */}
            <div className="w-full lg:w-[420px] flex flex-col gap-md">
              {/* Profiles */}
              <div>
                <label className="font-data-mono text-data-mono text-[var(--color-on-surface-variant)] uppercase mb-2 block">profiller</label>
                <div className="glass-panel rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold font-data-mono text-[12px]">AE</div>
                    <span className="font-body-md text-[var(--color-on-surface)]">Al Esnaf Profil</span>
                  </div>
                  <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">expand_more</span>
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="font-data-mono text-data-mono text-[var(--color-on-surface-variant)] uppercase mb-2 block">Seçilen platformlarda paylaş</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel rounded-xl p-3 flex items-center justify-between glow-active bg-[var(--color-primary)]/5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <img 
                        className="w-6 h-6 rounded-md" 
                        alt="Instagram" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcWIqatYFVLUofBtNWBHlD_MwEsS9aree8nFlknXUkYtW2zQID4Dp6jhYNc9iSpy6zLfmmDIZXp_Uylc-3QEfN41aeYFCPRkhFr3qHxY2_cskWWCQIJQM8e73M2Aaq4dV4ykjGfaY1wQP1nDaDND4kWhCBtXcl-4qheIlYKFUyXl1QXQkRTpRQbq_bihHpFdteGk7Hx_-w8_-9PncXkqNwEqqsgRYjX30jAukQnlw1lswuYUs8ja2XN7A7Aa3pRBzd-v50mj-szVc"
                      />
                      <div>
                        <div className="font-body-md text-sm text-[var(--color-on-surface)] font-semibold">Instagram</div>
                        <div className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)]">@esnafgure...</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[18px]">check_circle</span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex items-center justify-between border-white/10 cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-2">
                      <img 
                        className="w-6 h-6 rounded-md" 
                        alt="WhatsApp" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuS9s9aR-QM2SOTccNji2VscnXZlYhgTtBMiSNyzUBlkTDqVlg2xNEQycyBDZLgZmPCOhBeo-qkrivVKV0_xHGTsu9or08GQPWwED1Ke6SdEy90W_JcttyFse5IUZgq4njeu-YPxN4ZL8pS6RaKzEJPNVZviGvPL58NNIqWokT9hP4l4h5ZM8dZ1lJw52tQ6LxuLE2brU1EX_PNFOAP0sDo5SnXPcLTrHIHqUyHeWVqiMvQbip6JEI0IXnWmrcacAPgfNZ3FlXcv4"
                      />
                      <div>
                        <div className="font-body-md text-sm text-[var(--color-on-surface)] font-semibold">Whatsapp</div>
                        <div className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)]">+90 551 53...</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[18px]">check_circle</span>
                  </div>
                </div>
              </div>

              {/* Platform Specific Settings */}
              <div className="glass-panel rounded-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-2">
                    <img 
                      className="w-5 h-5 rounded" 
                      alt="Instagram Small" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzYaqYilxMS24ZjOl6y5oRLgi_Nrb7-cnzYQDnfIDL-V6ioCvDX6hHQzA4YKXe0A8oAxuSPV1r60VYeRRENc4Q4EMTZcq0Ql2yZXTmO7SwWufrcjrkZpBakD0oBKR1wQJta22M7fD2g6jeEMIACHy6pwLbl_Dbc-046QcUiYuPjtQoH0-tzheJeMmAV4L5Xpaq2wNfl9lhR55awuItUJ7xYDPlTiLVKr9hAZkYk4O-ZRVq7CHSLcyneJi2QOpZ1OuSR1-NfavMz0I"
                    />
                    <span className="font-body-md text-[var(--color-on-surface)] font-semibold">Instagram</span>
                  </div>
                  <div className="flex bg-[var(--color-surface-container)] rounded-md p-1 font-data-mono text-[10px]">
                    <button className="px-2 py-1 bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] rounded shadow-sm">Feed</button>
                    <button className="px-2 py-1 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">Story</button>
                    <button className="px-2 py-1 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">Reel</button>
                    <button className="px-2 py-1 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">Carousel</button>
                  </div>
                </div>
                
                <div className="p-md space-y-md">
                  <p className="font-data-mono text-[11px] text-[var(--color-on-surface-variant)]">İçerik 24 saat sonra kaybolur. Sınırlı metin desteği.</p>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                      <input className="peer sr-only" type="checkbox"/>
                      <div className="w-5 h-5 border border-white/20 rounded peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-colors"></div>
                      <span className="material-symbols-outlined absolute text-[16px] text-[var(--color-on-primary)] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                    </div>
                    <div>
                      <div className="font-body-md text-sm text-[var(--color-on-surface)] font-semibold mb-1">AI ile üretildi olarak işaretle</div>
                      <div className="font-body-md text-[12px] text-[var(--color-on-surface-variant)] leading-relaxed">Instagram'ın AI içerik etiketini ekler. Medya tamamen veya büyük oranda AI ile oluşturulduğunda kullanın.</div>
                    </div>
                  </label>

                  <div>
                    <label className="font-data-mono text-[11px] text-[var(--color-on-surface-variant)] uppercase mb-2 block">first comment</label>
                    <div className="bg-black/30 border border-white/5 rounded-lg focus-within:border-[var(--color-primary)]/50 transition-colors">
                      <textarea className="w-full bg-transparent p-3 text-[var(--color-on-surface)] font-body-md text-sm focus:outline-none resize-none h-20" placeholder="Drop any extra context or a CTA here..."></textarea>
                      <div className="text-right p-2 font-data-mono text-[10px] text-[var(--color-on-surface-variant)]/50">0/2200</div>
                    </div>
                  </div>

                  <div>
                    <label className="font-data-mono text-[11px] text-[var(--color-on-surface-variant)] uppercase mb-2 block">custom caption</label>
                    <div className="bg-black/30 border border-white/5 rounded-lg focus-within:border-[var(--color-secondary)]/50 transition-colors">
                      <textarea className="w-full bg-transparent p-3 text-[var(--color-on-surface)] font-body-md text-sm focus:outline-none resize-none h-20" placeholder="Leave blank to use main content..."></textarea>
                      <div className="text-right p-2 font-data-mono text-[10px] text-[var(--color-on-surface-variant)]/50">0/2200</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div className="mt-auto pt-md space-y-md">
                <div>
                  <label className="font-data-mono text-data-mono text-[var(--color-on-surface-variant)] uppercase mb-2 block">yayıncılık</label>
                  <div className="flex bg-[var(--color-surface-container)] rounded-lg p-1 border border-white/5">
                    <button className="flex-1 py-2 text-center text-[var(--color-on-surface-variant)] font-body-md text-sm hover:text-[var(--color-on-surface)] transition-colors">Planlı</button>
                    <button className="flex-1 py-2 text-center bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] font-body-md text-sm rounded-md shadow-sm border border-white/10">Şimdi</button>
                  </div>
                </div>
                <div className="bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 rounded-lg p-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[18px] mt-0.5">info</span>
                  <p className="font-body-md text-[12px] text-[var(--color-on-surface-variant)]">Gönderi, seçilen tüm platformlarda anında yayınlanacaktır.</p>
                </div>
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-container)] text-white font-headline-lg-mobile text-lg flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(182,0,248,0.4)] transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[24px]">send</span>
                  Seçili Platformlarda Paylaş
                </button>
              </div>
            </div>
          </div>
          <div className="h-32"></div> {/* spacer */}
        </main>
      </div>
    </div>
  );
}
