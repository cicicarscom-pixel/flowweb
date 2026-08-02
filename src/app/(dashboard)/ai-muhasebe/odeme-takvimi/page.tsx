"use client";

import React from "react";

export default function OdemeTakvimiPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Sub-header: Controls */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded bg-surface-container hover:bg-surface-bright border border-surface-bright text-on-surface transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"></path></svg>
          </button>
          <h2 className="text-lg font-medium text-on-surface w-32 text-center">Haziran 2024</h2>
          <button className="p-2 rounded bg-surface-container hover:bg-surface-bright border border-surface-bright text-on-surface transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"></path></svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container rounded border border-surface-bright p-1">
            <button className="px-4 py-1.5 rounded text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">Bugün</button>
            <button className="px-4 py-1.5 rounded bg-surface-bright text-on-surface transition-colors text-sm font-medium shadow-sm">Ay</button>
            <button className="px-4 py-1.5 rounded text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">Hafta</button>
            <button className="px-4 py-1.5 rounded text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">Liste</button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-surface-container hover:bg-surface-bright border border-surface-bright text-on-surface transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 17H5"></path><path d="M19 7h-9"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
              <span>Ayarlar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors border border-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              <span>İşlem Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">
        <style>{`
          .calendar-cell-scroll::-webkit-scrollbar { width: 2px; }
          .calendar-cell-scroll::-webkit-scrollbar-track { background: transparent; }
          .calendar-cell-scroll::-webkit-scrollbar-thumb { background-color: #39393b; border-radius: 4px; }
        `}</style>

        {/* Calendar Headers (Gelir / Gider Legend) */}
        <div className="grid grid-cols-2 bg-surface-bright border border-surface-bright rounded-t overflow-hidden shrink-0" style={{ minWidth: '2362px' }}>
          <div className="bg-[#1a1a1c] p-2 text-[10px] font-bold text-income uppercase tracking-widest text-center border-r border-surface-bright">
            GELİR (ALACAK)
          </div>
          <div className="bg-[#1a1a1c] p-2 text-[10px] font-bold text-expense uppercase tracking-widest text-center">
            GİDER (BORÇ)
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#39393b', minWidth: '2362px', gridAutoRows: 'minmax(120px, auto)' }}>
          {/* Day 1 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">1</div>
            {/* Income Column */}
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">ABC Ltd. Şti.</span><span className="shrink-0">+1.250</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">XYZ A.Ş.</span><span className="shrink-0">+850</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Demo Ticaret</span><span className="shrink-0">+1.000</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Techno Yazılım</span><span className="shrink-0">+2.400</span></div>
            </div>
            {/* Expense Column */}
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-320</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.150</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">İnternet Sağlayıcı</span><span className="shrink-0">-150</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-780</span></div>
            </div>
          </div>
          
          {/* Day 2 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">2</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Global Danışmanlık</span><span className="shrink-0">+3.500</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Mavi Tekstil</span><span className="shrink-0">+1.200</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Yıldız Gıda</span><span className="shrink-0">+900</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Beta Yazılım</span><span className="shrink-0">+2.100</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kargo Firması</span><span className="shrink-0">-450</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-210</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Personel Yemek</span><span className="shrink-0">-600</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-950</span></div>
            </div>
          </div>

          {/* Day 3 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">3</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Delta Enerji</span><span className="shrink-0">+2.000</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Omega İnşaat</span><span className="shrink-0">+4.750</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Smart Medya</span><span className="shrink-0">+950</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Lider Otomotiv</span><span className="shrink-0">+1.300</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.200</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kargo Firması</span><span className="shrink-0">-380</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-160</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Yazılım Lisansı</span><span className="shrink-0">-920</span></div>
            </div>
          </div>

          {/* Day 4 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">4</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">ABC Ltd. Şti.</span><span className="shrink-0">+1.100</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Epsilon Tarım</span><span className="shrink-0">+800</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Data Sistem</span><span className="shrink-0">+1.450</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Netsoft</span><span className="shrink-0">+950</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Personel Maaş</span><span className="shrink-0">-25.000</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">SGK Ödemesi</span><span className="shrink-0">-4.500</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Vergi Dairesi</span><span className="shrink-0">-3.200</span></div>
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Kira Ödemesi</span><span className="shrink-0">-6.000</span></div>
            </div>
          </div>

          {/* Day 5 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">5</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Mavi Tekstil</span><span className="shrink-0">+1.600</span></div>
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Global Danışmanlık</span><span className="shrink-0">+2.500</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Akaryakıt Ltd.</span><span className="shrink-0">-1.100</span></div>
            </div>
          </div>

          {/* Day 6 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">6</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">Omega İnşaat</span><span className="shrink-0">+3.250</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Enerji A.Ş.</span><span className="shrink-0">-1.300</span></div>
            </div>
          </div>

          {/* Day 7 */}
          <div className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
            <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">7</div>
            <div className="p-2 pt-6 border-r border-surface-bright overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-income"><span className="truncate pr-1 text-[9px]">XYZ A.Ş.</span><span className="shrink-0">+1.900</span></div>
            </div>
            <div className="p-2 pt-6 overflow-y-auto calendar-cell-scroll space-y-1">
              <div className="flex justify-between text-expense"><span className="truncate pr-1 text-[9px]">Ofis Kırtasiye</span><span className="shrink-0">-260</span></div>
            </div>
          </div>

          {/* Repeated Structure for Rows 2-5 */}
          {Array.from({ length: 23 }, (_, i) => i + 8).map(day => (
            <div key={day} className="bg-[#1a1a1c] grid grid-cols-2 min-h-0 relative">
              <div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">{day}</div>
              <div className="border-r border-surface-bright"></div>
              <div></div>
            </div>
          ))}

          {/* Fillers for empty grid slots */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#1a1a1c] opacity-30 pointer-events-none"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
