import styles from './page.module.css';

export default function OdemeTakvimiPage() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#131315] text-sm" data-purpose="main-content">
      {/* Top Header */}
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#39393b]">
        <h1 className="text-2xl font-semibold text-[#e3e2e5]">Ödeme Takvimi</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#262628] hover:bg-[#39393b] border border-[#39393b] text-[#e3e2e5] transition-colors">
            <i className="fa-solid fa-sliders w-4 h-4 text-center"></i>
            <span>Ayarlar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors border border-emerald-500/20">
            <i className="fa-solid fa-plus w-4 h-4 text-center"></i>
            <span>İşlem Ekle</span>
          </button>
        </div>
      </header>

      {/* Sub-header: Controls */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded bg-[#262628] hover:bg-[#39393b] border border-[#39393b] text-[#e3e2e5] transition-colors">
            <i className="fa-solid fa-chevron-left w-5 h-5 flex items-center justify-center"></i>
          </button>
          <h2 className="text-lg font-medium text-[#e3e2e5] w-32 text-center">Haziran 2024</h2>
          <button className="p-2 rounded bg-[#262628] hover:bg-[#39393b] border border-[#39393b] text-[#e3e2e5] transition-colors">
            <i className="fa-solid fa-chevron-right w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
        <div className="flex bg-[#262628] rounded border border-[#39393b] p-1">
          <button className="px-4 py-1.5 rounded text-[#c8c6c9] hover:text-[#e3e2e5] transition-colors text-sm font-medium">Bugün</button>
          <button className="px-4 py-1.5 rounded bg-[#39393b] text-[#e3e2e5] transition-colors text-sm font-medium shadow-sm">Ay</button>
          <button className="px-4 py-1.5 rounded text-[#c8c6c9] hover:text-[#e3e2e5] transition-colors text-sm font-medium">Hafta</button>
          <button className="px-4 py-1.5 rounded text-[#c8c6c9] hover:text-[#e3e2e5] transition-colors text-sm font-medium">Liste</button>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6">
        {/* Calendar Headers (Gelir / Gider Legend) */}
        <div className="grid grid-cols-7 gap-px bg-[#39393b] border-t border-l border-r border-[#39393b] rounded-t overflow-hidden shrink-0">
          <div className="col-span-3 bg-[#1a1a1c] p-2 text-xs font-semibold text-[#4ade80] uppercase tracking-wider text-center">
            GELİR (ALACAK)
          </div>
          <div className="col-span-4 bg-[#1a1a1c] p-2 text-xs font-semibold text-[#f87171] uppercase tracking-wider text-center border-l border-[#39393b]">
            GİDER (BORÇ)
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-[#39393b] border border-[#39393b] rounded-b overflow-hidden grid grid-cols-7 grid-rows-5 gap-px">
          {/* Row 1 */}
          {/* Day 1 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">1</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Cum</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">ABC Ltd. Şti.</span><span>+1.250</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">XYZ A.Ş.</span><span>+850</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Demo Ticaret</span><span>+1.000</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Techno Yazılım</span><span>+2.400</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Ofis Kırtasiye</span><span>-320</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Enerji A.Ş.</span><span>-1.150</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">İnternet Sağlayıcı</span><span>-150</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Akaryakıt Ltd.</span><span>-780</span></div>
            </div>
          </div>
          {/* Day 2 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">2</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Cmt</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Global Danışmanlık</span><span>+3.500</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Mavi Tekstil</span><span>+1.200</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Yıldız Gıda</span><span>+900</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Beta Yazılım</span><span>+2.100</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Kargo Firması</span><span>-450</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Ofis Kırtasiye</span><span>-210</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Personel Yemek</span><span>-600</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Akaryakıt Ltd.</span><span>-950</span></div>
            </div>
          </div>
          {/* Day 3 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">3</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Pzr</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Delta Enerji</span><span>+2.000</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Omega İnşaat</span><span>+4.750</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Smart Medya</span><span>+950</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Lider Otomotiv</span><span>+1.300</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Enerji A.Ş.</span><span>-1.200</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Kargo Firması</span><span>-380</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Ofis Kırtasiye</span><span>-160</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Yazılım Lisansı</span><span>-920</span></div>
            </div>
          </div>
          {/* Day 4 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">4</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Pzt</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">ABC Ltd. Şti.</span><span>+1.100</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Epsilon Tarım</span><span>+800</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Data Sistem</span><span>+1.450</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Netsoft</span><span>+950</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Personel Maaş</span><span>-25.000</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">SGK Ödemesi</span><span>-4.500</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Vergi Dairesi</span><span>-3.200</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Kira Ödemesi</span><span>-6.000</span></div>
            </div>
          </div>
          {/* Day 5 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">5</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Sal</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Mavi Tekstil</span><span>+1.600</span></div>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Global Danışmanlık</span><span>+2.500</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Akaryakıt Ltd.</span><span>-1.100</span></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Kargo Firması</span><span>-420</span></div>
            </div>
          </div>
          {/* Day 6 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">6</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Çar</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">Omega İnşaat</span><span>+3.250</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Enerji A.Ş.</span><span>-1.300</span></div>
            </div>
          </div>
          {/* Day 7 */}
          <div className="bg-[#1a1a1c] p-2 flex flex-col h-full overflow-hidden group hover:bg-[#202022]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-[#e3e2e5] text-base">7</span>
              <span className="text-[10px] text-[#c8c6c9] uppercase">Per</span>
            </div>
            <div className={`flex-1 overflow-y-auto ${styles.calendarCellScroll} space-y-1 pr-1`}>
              <div className="flex justify-between text-[11px] text-[#4ade80]"><span className="truncate pr-1">XYZ A.Ş.</span><span>+1.900</span></div>
              <div className="h-px bg-[#39393b] my-1"></div>
              <div className="flex justify-between text-[11px] text-[#f87171]"><span className="truncate pr-1">Ofis Kırtasiye</span><span>-260</span></div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">8</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">9</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">10</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">11</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">12</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">13</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">14</div></div>
          
          {/* Row 3 */}
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">15</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">16</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">17</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">18</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">19</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">20</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">21</div></div>
          
          {/* Row 4 */}
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">22</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">23</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">24</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">25</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">26</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">27</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">28</div></div>
          
          {/* Row 5 */}
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">29</div></div>
          <div className="bg-[#1a1a1c] p-2 h-full"><div className="font-medium text-[#e3e2e5] text-base">30</div></div>
          <div className="bg-[#1a1a1c] opacity-30 p-2 h-full pointer-events-none"></div>
          <div className="bg-[#1a1a1c] opacity-30 p-2 h-full pointer-events-none"></div>
          <div className="bg-[#1a1a1c] opacity-30 p-2 h-full pointer-events-none"></div>
          <div className="bg-[#1a1a1c] opacity-30 p-2 h-full pointer-events-none"></div>
          <div className="bg-[#1a1a1c] opacity-30 p-2 h-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
