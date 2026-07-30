"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Anasayfa", icon: "grid_view" },
    { href: "/ai-asistan", label: "Ai Asistan", icon: "smart_toy" },
    { href: "/ai-muhasebe", label: "Ai Muhasebe", icon: "account_balance_wallet" },
    { href: "/sosyal-medya", label: "Sosyal Medya", icon: "share" },
    { href: "/analiz", label: "Analiz", icon: "analytics" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0b0b1d] border-r border-[#1e2038] flex flex-col shrink-0">
      {/* Header / Logo */}
      <div className="px-6 py-6 border-b border-[#1e2038]/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <span className="material-symbols-outlined text-white text-[20px]">memory</span>
        </div>
        <div>
          <h2 className="font-bold text-[#a855f7] tracking-wider text-sm">NEURAL_NET</h2>
          <span className="text-[#94a3b8] text-[10px] tracking-widest">V.2.0.4-BETA</span>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#14b8a6]/10 to-transparent text-[#14b8a6] border-l-2 border-[#14b8a6]"
                  : "text-[#94a3b8] hover:bg-[#1e2038]/50 hover:text-white border-l-2 border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-[#1e2038]/50 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-3 text-[#94a3b8] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="text-xs font-medium">System Logs</span>
          </a>
          <a className="flex items-center gap-3 text-[#ef4444]/70 hover:text-[#ef4444] transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-xs font-medium">Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
