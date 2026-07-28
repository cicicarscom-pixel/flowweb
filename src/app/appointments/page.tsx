import Link from "next/link";

export default function Appointments() {
  return (
    <div className="text-on-background font-body-md tech-grid min-h-screen overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* SideNavBar */}
      <nav className="fixed left-0 h-screen w-[280px] bg-surface/40 backdrop-blur-xl border-r border-white/5 flex flex-col py-md px-sm z-40 hidden md:flex">
        {/* Brand Header */}
        <div className="mb-xl px-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary-container p-[1px]">
            <div className="w-full h-full bg-surface-container-lowest rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "\"FILL\" 1" }}>terminal</span>
            </div>
          </div>
          <div>
            <h1 className="font-display-lg text-[32px] font-semibold text-primary tracking-tighter uppercase leading-none">NEO-FINTECH</h1>
            <p className="font-data-mono text-[14px] font-medium text-on-surface-variant text-[10px]">Operational Center</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-grow">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-data-mono text-[14px] font-medium">Command</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary font-bold border-l-2 border-primary bg-gradient-to-r from-primary/10 to-transparent hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "\"FILL\" 1" }}>calendar_today</span>
            <span className="font-data-mono text-[14px] font-medium">Appointments</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined">sync_alt</span>
            <span className="font-data-mono text-[14px] font-medium">Operations</span>
          </a>
          <Link href="/social-media" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined">share</span>
            <span className="font-data-mono text-[14px] font-medium">Social Media</span>
          </Link>
          <Link href="/accounting" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-data-mono text-[14px] font-medium">Ledger</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:text-primary hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-data-mono text-[14px] font-medium">Settings</span>
          </a>
        </div>
        
        {/* CTA Bottom */}
        <div className="mt-auto pt-md border-t border-white/5">
          <button className="w-full py-3 px-4 rounded-lg btn-primary-gradient text-on-primary-fixed font-data-mono text-[14px] font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Entry
          </button>
        </div>
      </nav>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 bg-surface/40 backdrop-blur-[20px] border-b border-white/10 flex justify-between items-center px-margin-mobile md:px-margin-desktop z-50">
        {/* Breadcrumb / Section Title */}
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="font-data-mono text-[12px] font-bold uppercase tracking-wider">/ Randevu Yönetimi</span>
        </div>
        
        {/* Product Name Center */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <span className="font-data-mono text-[12px] font-bold uppercase text-primary tracking-widest">NEO-FINTECH COMMAND</span>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative group hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input className="w-48 bg-white/5 border-none rounded-full py-1.5 pl-9 pr-4 font-data-mono text-[14px] font-medium text-on-surface focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all placeholder:text-on-surface-variant/50 outline-none" placeholder="Search appointments..." type="text"/>
          </div>
          <button className="text-on-surface-variant hover:text-secondary transition-colors relative">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </button>
          <button className="w-8 h-8 rounded-full border border-white/10 overflow-hidden hover:border-primary transition-colors focus:border-primary">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuve_sGkioOL4nmTGYBdCcRRwdT2glEqjMNn2mpwpPIbWgKGQfN36gndK4n7TOElfvC5NUWRGMxcuYnRO-kVzpN0BsDesmcfxgIeHjkL8xjJHwTzcQkeUqkHBU2G6zRei_5o2hOaX8iPV8V03x7BaOBcZHwNlypGrNh6sUWwH5VaR0n89TRWGgAxQ-Ax8yw5nKehPJ96FkuJbHRJdH6m8XaaCU0E5UHXbh9z4-Y9h5Ou2O46A4Gj5IbJGyQngrWimAbdGHEcBHMKo"/>
          </button>
        </div>
      </header>

      {/* MAIN CANVAS */}
      <main className="md:ml-[280px] pt-24 px-margin-mobile md:px-margin-desktop pb-margin-desktop min-h-screen">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-4 md:gap-0">
          <div>
            <h2 className="font-headline-lg text-[32px] font-semibold text-on-surface mb-2">Randevu Yönetimi</h2>
            <p className="text-on-surface-variant font-data-mono text-[14px] font-medium">AI-Driven Schedule Optimization</p>
          </div>
          <div className="flex gap-3">
            <button className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors font-data-mono text-[14px] font-medium text-primary">
              <span className="material-symbols-outlined text-[18px]">today</span>
              Bugün
            </button>
            <button className="btn-primary-gradient px-4 py-2 rounded-lg flex items-center gap-2 text-on-primary-fixed font-data-mono text-[14px] font-bold">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Yeni Randevu
            </button>
          </div>
        </div>

        {/* Horizontal Calendar Strip */}
        <div className="glass-panel rounded-xl p-4 mb-gutter flex items-center justify-between border-t border-primary/30">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-grow justify-center">
            {/* Days Array */}
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px]">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Pzt</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">12</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px]">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Sal</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">13</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg glass-panel-active bg-primary/10 cursor-pointer transition-colors min-w-[70px]">
              <span className="text-[12px] font-bold font-data-mono text-primary uppercase mb-1">Çar</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-primary font-bold">14</span>
              <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px]">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Per</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">15</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px]">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Cum</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">16</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px] opacity-50">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Cmt</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">17</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-colors min-w-[70px] opacity-50">
              <span className="text-[12px] font-bold font-data-mono text-on-surface-variant uppercase mb-1">Paz</span>
              <span className="text-[24px] font-semibold font-headline-lg-mobile text-on-surface">18</span>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
          {/* Main Heatmap Area (Span 2) */}
          <div className="xl:col-span-2 flex flex-col gap-gutter">
            <div className="glass-panel rounded-xl p-md flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-data-mono text-[14px] font-medium text-on-surface flex items-center gap-2 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-primary text-[18px]">grid_on</span>
                  Kapasite Matrisi
                </h3>
                <div className="flex gap-4 font-data-mono text-[12px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-tertiary/20 border border-tertiary/50"></span>
                    <span className="text-on-surface-variant">Uygun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-red-500/10 border border-red-500/30"></span>
                    <span className="text-on-surface-variant">Dolu</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Grid Container */}
              <div className="flex flex-col gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {/* Row 1: Sabah */}
                <div className="flex">
                  <div className="w-20 shrink-0 flex items-center border-r border-white/10 pr-4">
                    <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Sabah</span>
                  </div>
                  <div className="flex flex-grow ml-4 gap-2 min-w-max">
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer relative group">
                      08:00
                      <div className="absolute -top-8 bg-surface border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">Uygun</div>
                    </div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">08:30</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">09:00</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">09:30</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">10:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">10:30</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">11:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">11:30</div>
                  </div>
                </div>

                {/* Row 2: Öğle */}
                <div className="flex">
                  <div className="w-20 shrink-0 flex items-center border-r border-white/10 pr-4">
                    <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Öğle</span>
                  </div>
                  <div className="flex flex-grow ml-4 gap-2 min-w-max">
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">12:00</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">12:30</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">13:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">13:30</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">14:00</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">14:30</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">15:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">15:30</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">16:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">16:30</div>
                  </div>
                </div>

                {/* Row 3: Akşam */}
                <div className="flex">
                  <div className="w-20 shrink-0 flex items-center border-r border-white/10 pr-4">
                    <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Akşam</span>
                  </div>
                  <div className="flex flex-grow ml-4 gap-2 min-w-max">
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">17:00</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">17:30</div>
                    <div className="heatmap-slot slot-booked h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-red-400/50 cursor-not-allowed">18:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">18:30</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">19:00</div>
                    <div className="heatmap-slot slot-available h-12 w-16 rounded-md flex items-center justify-center text-xs font-data-mono text-tertiary/80 cursor-pointer">19:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Sidebar Area (Span 1) */}
          <div className="xl:col-span-1">
            <div className="glass-panel rounded-xl flex flex-col h-full border-t border-secondary/30 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-data-mono text-[14px] font-medium text-on-surface uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">list_alt</span>
                  Yaklaşan Randevular
                </h3>
                <span className="bg-secondary/20 text-secondary font-label-sm text-[12px] font-bold px-2 py-0.5 rounded">6 Aktif</span>
              </div>
              
              <div className="p-2 flex flex-col gap-2 overflow-y-auto h-[400px] xl:h-auto custom-scrollbar">
                {/* List Item 1 */}
                <div className="p-3 rounded-lg bg-surface/50 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="font-data-mono text-xs text-on-surface">AA</span>
                      </div>
                      <div>
                        <p className="font-headline-lg-mobile text-[16px] text-on-surface leading-tight">Ahmet Aslan</p>
                        <p className="font-data-mono text-[11px] text-on-surface-variant">TR-552 *** 14</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono text-[14px] font-medium text-primary font-bold">09:00</p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant uppercase">30 Dk</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs font-body-md text-[16px] text-on-surface-variant bg-white/5 px-2 py-1 rounded">Saç Kesimi</span>
                    <button className="text-primary hover:text-primary-container text-xs font-data-mono opacity-0 group-hover:opacity-100 transition-opacity">Yönet</button>
                  </div>
                </div>
                
                {/* List Item 2 */}
                <div className="p-3 rounded-lg bg-surface/50 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="font-data-mono text-xs text-on-surface">MB</span>
                      </div>
                      <div>
                        <p className="font-headline-lg-mobile text-[16px] text-on-surface leading-tight">Mehmet Bey</p>
                        <p className="font-data-mono text-[11px] text-on-surface-variant">TR-532 *** 99</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono text-[14px] font-medium text-primary font-bold">09:30</p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant uppercase">30 Dk</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs font-body-md text-[16px] text-on-surface-variant bg-white/5 px-2 py-1 rounded">Sakal Tıraşı</span>
                    <button className="text-primary hover:text-primary-container text-xs font-data-mono opacity-0 group-hover:opacity-100 transition-opacity">Yönet</button>
                  </div>
                </div>
                
                {/* List Item 3 (In Progress / Glowing) */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/30 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                      </div>
                      <div>
                        <p className="font-headline-lg-mobile text-[16px] text-on-surface leading-tight">Caner Yılmaz</p>
                        <p className="font-data-mono text-[11px] text-primary">Devam Ediyor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono text-[14px] font-medium text-primary font-bold">11:00</p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant uppercase">45 Dk</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 pl-2">
                    <div className="flex gap-1">
                      <span className="text-xs font-body-md text-[16px] text-on-surface-variant bg-white/5 px-2 py-1 rounded">Saç</span>
                      <span className="text-xs font-body-md text-[16px] text-on-surface-variant bg-white/5 px-2 py-1 rounded">Sakal</span>
                    </div>
                    <button className="text-primary hover:text-primary-container text-xs font-data-mono">Detay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

