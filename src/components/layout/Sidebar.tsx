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
    <aside className="w-64 h-screen bg-[#0b0c10] border-r border-[#2d3748] flex flex-col shrink-0">
      {/* Header / Logo */}
      <div className="h-16 px-6 border-b border-[#2d3748] flex items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Workigom Flow" className="h-11 object-contain" />
        </Link>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#1d1e24] text-white"
                  : "text-[#94a3b8] hover:text-white hover:bg-[#14151a]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-[#2d3748] flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-3 text-[#94a3b8] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="text-xs font-medium">System Logs</span>
          </a>
          <Link className="flex items-center gap-3 text-[#94a3b8] hover:text-red-400 transition-colors" href="/login">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-xs font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
