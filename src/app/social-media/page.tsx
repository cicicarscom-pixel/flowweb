import Link from "next/link";

export default function SocialMedia() {
  return (
    <div className="flex h-screen overflow-hidden font-body-md bg-background text-on-background w-full relative">
      {/* SideNavBar (Shared Component) */}
      <nav className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container-lowest/80 backdrop-blur-md border-r border-white/5 flex-col py-lg px-md gap-md z-40 hidden md:flex">
        <div className="font-headline-lg text-primary-fixed-dim mb-8">
          <span className="block text-[32px] font-semibold tracking-tight">AI-ESNAF</span>
          <span className="font-data-mono text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Command Center</span>
        </div>
        
        <button className="bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary-container font-data-mono text-[12px] font-bold py-3 px-4 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.3)] transition-all mb-4 text-left w-full uppercase">
          New Analysis
        </button>
        
        <div className="flex-1 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors p-3 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/accounting" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors p-3 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>AI Accounting</span>
          </Link>
          <Link href="/bot-management" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors p-3 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="material-symbols-outlined">smart_toy</span>
            <span>Bot Management</span>
          </Link>
          <a href="#" className="relative flex items-center gap-sm text-primary-fixed-dim before:absolute before:left-0 before:h-8 before:w-1 before:bg-primary before:shadow-[0_0_15px_rgba(0,162,255,0.8)] bg-gradient-to-r from-primary/10 to-transparent p-3 rounded scale-[1.02]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "\"FILL\" 1" }}>share</span>
            <span className="font-bold">Social Media</span>
          </a>
          <a href="#" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors p-3 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Appointments</span>
          </a>
          <a href="#" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors p-3 rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </div>
        
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-white/5">
          <a href="#" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface p-2 rounded">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-data-mono text-[12px] font-bold">Help</span>
          </a>
          <a href="#" className="flex items-center gap-sm text-on-surface-variant hover:text-on-surface p-2 rounded">
            <span className="material-symbols-outlined text-sm">contact_support</span>
            <span className="font-data-mono text-[12px] font-bold">Support</span>
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-[280px] h-full overflow-y-auto grid-bg relative">
        {/* Subtle Glow Effect Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto space-y-lg relative z-10">
          {/* Header */}
          <header className="mb-md mt-md md:mt-0">
            <h1 className="font-display-lg text-[48px] font-bold text-on-surface">Social Media</h1>
            <p className="font-data-mono text-[14px] font-medium text-on-surface-variant mt-2">Manage your digital presence and AI automation.</p>
          </header>
          
          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <button className="glass-panel p-md rounded-xl flex items-center gap-4 hover:border-secondary-fixed-dim hover:shadow-[0_0_15px_rgba(235,178,255,0.2)] transition-all group text-left">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed-dim group-hover:bg-secondary-container/40 transition-colors">
                <span className="material-symbols-outlined">auto_fix_high</span>
              </div>
              <div>
                <span className="font-data-mono text-[12px] font-bold text-on-surface-variant block mb-1">Post Production</span>
                <span className="font-bold text-[16px] text-on-surface block">Digital Assistant</span>
              </div>
            </button>
            <button className="glass-panel p-md rounded-xl flex items-center gap-4 hover:border-secondary-fixed-dim hover:shadow-[0_0_15px_rgba(235,178,255,0.2)] transition-all group text-left">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors">
                <span className="material-symbols-outlined">grid_view</span>
              </div>
              <div>
                <span className="font-data-mono text-[12px] font-bold text-on-surface-variant block mb-1">Library</span>
                <span className="font-bold text-[16px] text-on-surface block">All Posts</span>
              </div>
            </button>
            <button className="glass-panel p-md rounded-xl flex items-center gap-4 hover:border-secondary-fixed-dim hover:shadow-[0_0_15px_rgba(235,178,255,0.2)] transition-all group text-left">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors">
                <span className="material-symbols-outlined">inbox</span>
              </div>
              <div>
                <span className="font-data-mono text-[12px] font-bold text-on-surface-variant block mb-1">Messages</span>
                <span className="font-bold text-[16px] text-on-surface block">Inbox</span>
              </div>
            </button>
            <button className="glass-panel p-md rounded-xl flex items-center gap-4 hover:border-secondary-fixed-dim hover:shadow-[0_0_15px_rgba(235,178,255,0.2)] transition-all group text-left">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors">
                <span className="material-symbols-outlined">bar_chart</span>
              </div>
              <div>
                <span className="font-data-mono text-[12px] font-bold text-on-surface-variant block mb-1">Performance</span>
                <span className="font-bold text-[16px] text-on-surface block">Analytics</span>
              </div>
            </button>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Left Column: Control Panel & Connections */}
            <div className="lg:col-span-2 space-y-gutter">
              {/* Global AI Control Panel */}
              <section className="glass-panel rounded-xl p-md lg:p-lg border-t border-t-magenta-accent relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-magenta-accent/5 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md relative z-10">
                  <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-magenta-accent text-[24px]">smart_toy</span>
                      <h2 className="font-headline-lg-mobile text-[24px] font-semibold text-on-surface">Global AI Assistant</h2>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-[16px]">Let AI respond to DMs and comments automatically across all connected platforms based on your business profile.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-4 md:mt-0">
                    <input defaultChecked className="sr-only switch-input" type="checkbox" />
                    <div className="switch-bg w-14 h-7 bg-surface-variant rounded-full peer peer-focus:outline-none pulse-magenta transition-colors duration-300">
                      <div className="switch-handle absolute top-[2px] left-[2px] bg-white rounded-full h-6 w-6 transition-transform duration-300 shadow-md"></div>
                    </div>
                    <span className="ml-3 font-data-mono text-[12px] font-bold text-secondary-fixed-dim uppercase tracking-wider">Active</span>
                  </label>
                </div>
              </section>
              
              {/* Account Connection Grid */}
              <section className="glass-panel rounded-xl p-md">
                <h3 className="font-headline-lg-mobile text-[24px] font-semibold mb-md text-on-surface border-b border-white/5 pb-4">Connect Platforms</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {/* Platform Icons */}
                  <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-primary-fixed-dim hover:bg-primary-container/10 transition-all group">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary-fixed-dim">thumb_up</span>
                    <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Facebook</span>
                  </button>
                  <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-secondary-fixed-dim hover:bg-secondary-container/10 transition-all group">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-secondary-fixed-dim">photo_camera</span>
                    <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Instagram</span>
                  </button>
                  <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-primary-fixed-dim hover:bg-primary-container/10 transition-all group">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary-fixed-dim">work</span>
                    <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">LinkedIn</span>
                  </button>
                  <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-on-surface hover:bg-white/10 transition-all group">
                    <span className="font-headline-lg-mobile text-[24px] font-bold text-on-surface-variant group-hover:text-on-surface leading-none">X</span>
                    <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Twitter</span>
                  </button>
                  <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-error hover:bg-error-container/20 transition-all group">
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-error">play_arrow</span>
                    <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">YouTube</span>
                  </button>
                </div>
              </section>
            </div>
            
            {/* Right Column: Connected Accounts List */}
            <div className="lg:col-span-1">
              <section className="glass-panel rounded-xl flex flex-col h-full min-h-[400px]">
                <div className="p-md border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-headline-lg-mobile text-[24px] font-semibold text-on-surface">Active Connections</h3>
                  <button className="text-secondary-fixed-dim hover:text-white transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">sync</span>
                    <span className="font-data-mono text-[12px] font-bold uppercase">Sync</span>
                  </button>
                </div>
                <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                  {/* List Item 1 */}
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuCW1nBMMwV-JRSljXCI_CyW_KWO148ZzqvqxaZeLOk_1RyQEIKFM-cvRP9vcJZ4U3SBLfmOXAW4rj_KXNdu2446p-QC7SWDxjaVU863zaFNInKFjklAGebonfeFaSahMNdQ5_2aoXHxE5L-PaOwlt4-0vZcKCUGtCyJr_acai0gt9jKxVAUQ5TUMgYoSQeBked5LU705qUcWCDX1zhJNZw1m8SL0rcmkHie0iUvgq8mrTR3wMny8pHB7rbwMsCxf89ySGQ9-m5uq6E\")" }}></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary-container rounded-full flex items-center justify-center border border-surface">
                        <span className="material-symbols-outlined text-[10px] text-white">photo_camera</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-data-mono text-[12px] font-bold text-on-surface truncate">@flow_esnaf</p>
                      <p className="text-[11px] text-on-surface-variant">Instagram</p>
                    </div>
                    <button className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-[18px]">link_off</span>
                    </button>
                  </div>
                  
                  {/* List Item 2 */}
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuAp2acqtW6VgusP6BXibjdFk38BVNMTX5ri8I00mejdUPr0Jx_smwd4VA1e01RzZqCrxeKiUxP4bq99zjPNZdRkxyFQ5vobyZOGBBXmb4YXuPNW70iZu00viqM1f_oeTOflrL-tA1wSyD5DLmKZ9eDFkIgYnxn0FDFH1rEIXTt2MCXATssTUcVjcMn4Jbc0ARZq6gzGkfsgJs8MhPODyocZ0i3FE8uQXbg4-U_osAXzyNt_xUxUfQd2armOlVu-V7Dun-_takkFk6w\")" }}></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface-bright rounded-full flex items-center justify-center border border-surface">
                        <span className="font-bold text-[8px] text-white">X</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-data-mono text-[12px] font-bold text-on-surface truncate">@flow_ai</p>
                      <p className="text-[11px] text-on-surface-variant">X (Twitter)</p>
                    </div>
                    <button className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-[18px]">link_off</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

