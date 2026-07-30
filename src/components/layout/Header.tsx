"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  let pageTitle = "Homepage";
  if (pathname === "/") pageTitle = "Homepage";
  if (pathname.includes("ai-asistan")) pageTitle = "Ai Asistan";
  if (pathname.includes("ai-muhasebe")) pageTitle = "Ai Muhasebe";
  if (pathname.includes("sosyal-medya")) pageTitle = "Sosyal Medya";
  if (pathname.includes("analiz")) pageTitle = "Analiz";

  return (
    <header className="h-16 w-full flex items-center justify-between px-8 border-b border-[#2d3748] bg-[#0b0c10] flex-shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[#94a3b8] hover:text-white transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-xl font-bold tracking-wide text-white hidden md:block">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center gap-6">
        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-[#1d1e24] transition-colors border border-transparent hover:border-[#2d3748]">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-[#1d1e24] transition-colors border border-transparent hover:border-[#2d3748]">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2d3748] ml-2">
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
