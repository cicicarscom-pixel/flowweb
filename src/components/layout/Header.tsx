"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  let pageTitle = "CYBER_CORE";
  if (pathname.includes("ai-asistan")) pageTitle = "AI Asistan";
  if (pathname.includes("ai-muhasebe")) pageTitle = "AI Muhasebe";
  if (pathname.includes("sosyal-medya")) pageTitle = "Sosyal Medya";
  if (pathname.includes("analiz")) pageTitle = "Analiz";

  return (
    <header className="bg-surface text-primary font-headline-md text-headline-md font-label-sm text-label-sm docked full-width top-0 bg-surface-container-low border-b border-outline-variant flat no shadows flex justify-between items-center w-full px-6 h-16 shrink-0 z-10 glass-card">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-headline-lg text-headline-lg font-black tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(221,183,255,0.6)] hidden md:block">
          {pageTitle}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-4 border-r border-outline-variant/30 pr-6 mr-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_5px_rgba(68,226,205,0.8)] animate-pulse"></div>
            <span className="font-code-sm text-code-sm text-secondary">SYS.ON</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">sync</span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">SYNCED</span>
          </div>
        </div>
        {/* Trailing Actions */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-variant text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-variant text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/50 ml-2 shadow-[0_0_8px_rgba(221,183,255,0.2)]">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVYqFO_sRDM7A72VhBQf3c9y-URq2n_84R3oSlOl3uhBauak5oq4NCFZGjEK0zvdNNYM6j2H10ll2xqt6p2MyFTDvHQrbFG4TCOpdCqIY7Z3Hz_3YX67I_rV1Mrip1X89qdTkfENKnkSZEu9MLNDzIiqZ4lyMMePJCghvmx4FoHqLL2tqaDh2ovx5Nph5EJ_WnIqUoo4wPbSQSL9pJyNfWWCvxsVQA7WNvQpOt5Buz35KB6SCR7D_-Ew" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
