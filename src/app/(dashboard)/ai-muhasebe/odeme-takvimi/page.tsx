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
 <button className="flex items-center gap-2 px-4 py-2 rounded -secondary hover:bg-emerald-700 text-on-surface font-medium transition-colors border -secondary/20">
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

 {/* Calendar Grid */}
 <div className="flex-1 border border-t-0 border-surface-bright rounded-b overflow-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#39393b', minWidth: '1200px', gridAutoRows: '216px' }}>
 {/* Day 1 */}
 <div className="bg-surface-container relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col h-full">
 <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">1</div>
 </div>
 
 {/* Day 2 */}
 <div className="bg-surface-container relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col h-full">
 <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">2</div>
 <div className="flex justify-between items-center rounded border border-[#003B15]/60 bg-outline-variant/50 px-1.5 py-1 shrink-0">
 <span className="truncate pr-2 text-[10px] text-on-surface font-medium">Delta E...</span>
 <span className="shrink-0 text-[10px] -secondary font-bold">+2,500</span>
 </div>
 </div>

 {/* Day 3 */}
 <div className="bg-surface-container relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col h-full">
 <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">3</div>
 </div>

 {/* Day 4 */}
 <div className="bg-surface-container relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col h-full">
 <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">4</div>
 <div className="flex justify-between items-center rounded border border-rose-900/60 bg-rose-950/40 px-1.5 py-1 shrink-0">
 <span className="truncate pr-2 text-[10px] text-on-surface font-medium">Office ...</span>
 <span className="shrink-0 text-[10px] text-[#FFB4AB] font-bold">-5,000</span>
 </div>
 </div>

 {/* Fill the rest of the days to show the layout */}
 {Array.from({ length: 26 }, (_, i) => i + 5).map(day => (
 <div key={day} className="bg-surface-container relative p-2 pt-8 overflow-y-auto calendar-cell-scroll space-y-1.5 flex flex-col h-full">
 <div className="absolute top-2 right-3 z-10 text-xs font-bold text-gray-300">{day}</div>
 </div>
 ))}

 {/* Fillers for empty grid slots */}
 {Array.from({ length: 5 }).map((_, i) => (
 <div key={`empty-${i}`} className="bg-surface-container opacity-30 pointer-events-none h-full"></div>
 ))}
 </div>
 </div>
 </div>
 );
}
