export default function OdemeTakvimiPage() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in pb-20">
      
      {/* Calendar Header & Navigation */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-wide drop-shadow-md">Haziran 2024</h1>
          <button className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div className="font-label-sm text-xs text-secondary uppercase tracking-widest px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 shadow-[0_0_10px_rgba(68,226,205,0.1)]">
          Ödeme Takvimi
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-2 border-b border-secondary/30 mb-2">
        <div className="text-center font-label-sm text-xs text-on-surface-variant opacity-60 uppercase">Gün</div>
        <div className="text-center font-label-sm text-xs text-secondary tracking-widest drop-shadow-[0_0_5px_rgba(68,226,205,0.5)]">GELİR</div>
        <div className="text-center font-label-sm text-xs text-primary tracking-widest drop-shadow-[0_0_5px_rgba(221,183,255,0.5)]">GİDER</div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col gap-3">
        
        {/* Day 1 - Empty */}
        <div className="group relative grid grid-cols-[80px_1fr_1fr] gap-4 bg-surface-container/50 hover:bg-surface-container p-4 rounded-xl border border-outline-variant/20 hover:border-secondary/40 transition-all duration-300 backdrop-blur-md shadow-sm">
          <div className="flex flex-col items-center justify-center border-r border-outline-variant/20 pr-4">
            <span className="font-headline-lg text-[28px] font-bold text-secondary group-hover:drop-shadow-[0_0_8px_rgba(68,226,205,0.6)] transition-all">1</span>
            <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider">HAZ</span>
          </div>
          <div className="border-r border-outline-variant/20 pr-4 flex items-center justify-center min-h-[60px]">
            <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-outline text-[18px]">add</span>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[60px] pl-4">
            <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-outline text-[18px]">add</span>
            </div>
          </div>
        </div>

        {/* Day 2 - Has Income */}
        <div className="group relative grid grid-cols-[80px_1fr_1fr] gap-4 bg-surface-container/50 hover:bg-surface-container p-4 rounded-xl border border-secondary/30 neon-border-cyan transition-all duration-300 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center border-r border-secondary/20 pr-4">
            <span className="font-headline-lg text-[28px] font-bold text-secondary drop-shadow-[0_0_8px_rgba(68,226,205,0.6)]">2</span>
            <span className="font-code-sm text-[10px] text-secondary uppercase tracking-wider">HAZ</span>
          </div>
          <div className="border-r border-secondary/20 pr-4 flex flex-col gap-2 min-h-[60px] justify-center">
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-2 flex justify-between items-center">
              <span className="font-code-sm text-sm text-on-surface">Client Retainer</span>
              <span className="font-headline-md text-sm text-secondary">₺12,500</span>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[60px] pl-4">
            <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-outline text-[18px]">add</span>
            </div>
          </div>
        </div>

        {/* Day 3 - Has Expense */}
        <div className="group relative grid grid-cols-[80px_1fr_1fr] gap-4 bg-surface-container/50 hover:bg-surface-container p-4 rounded-xl border border-error/30 transition-all duration-300 backdrop-blur-md shadow-[0_0_10px_rgba(255,180,171,0.05)]">
          <div className="flex flex-col items-center justify-center border-r border-outline-variant/20 pr-4">
            <span className="font-headline-lg text-[28px] font-bold text-error group-hover:drop-shadow-[0_0_8px_rgba(255,180,171,0.6)] transition-all">3</span>
            <span className="font-code-sm text-[10px] text-error uppercase tracking-wider">HAZ</span>
          </div>
          <div className="border-r border-outline-variant/20 pr-4 flex items-center justify-center min-h-[60px]">
             <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-outline text-[18px]">add</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-h-[60px] justify-center pl-4">
            <div className="bg-error/10 border border-error/30 rounded-lg p-2 flex justify-between items-center">
              <span className="font-code-sm text-sm text-on-surface">Server Costs</span>
              <span className="font-headline-md text-sm text-error">-₺850</span>
            </div>
          </div>
        </div>

        {/* Render empty days 4 to 8 for preview */}
        {[4, 5, 6, 7, 8].map((day) => (
          <div key={day} className="group relative grid grid-cols-[80px_1fr_1fr] gap-4 bg-surface-container/50 hover:bg-surface-container p-4 rounded-xl border border-outline-variant/20 hover:border-secondary/40 transition-all duration-300 backdrop-blur-md shadow-sm">
            <div className="flex flex-col items-center justify-center border-r border-outline-variant/20 pr-4">
              <span className="font-headline-lg text-[28px] font-bold text-secondary group-hover:drop-shadow-[0_0_8px_rgba(68,226,205,0.6)] transition-all">{day}</span>
              <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-wider">HAZ</span>
            </div>
            <div className="border-r border-outline-variant/20 pr-4 flex items-center justify-center min-h-[60px]">
              <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
                <span className="material-symbols-outlined text-outline text-[18px]">add</span>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[60px] pl-4">
              <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
                <span className="material-symbols-outlined text-outline text-[18px]">add</span>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
