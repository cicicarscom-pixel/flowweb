"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Homepage", icon: "grid_view" },
    { href: "/ai-asistan", label: "AI Assistant", icon: "smart_toy" },
    { href: "/ai-muhasebe", label: "AI Accounting", icon: "account_balance_wallet" },
    { href: "/sosyal-medya", label: "Social Media", icon: "share" },
    { href: "/analiz", label: "Analysis", icon: "analytics" },
  ];

  return (
    <aside className="bg-surface-container text-primary font-label-sm text-label-sm font-headline-md text-headline-md docked left h-screen w-64 bg-surface-container-low border-r border-outline-variant flat no shadows flex flex-col h-full py-container-padding hidden md:flex shrink-0">
      {/* Header */}
      <div className="px-6 pb-6 border-b border-outline-variant/30 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_15px_rgba(221,183,255,0.4)]">
          <span className="material-symbols-outlined text-on-primary-container">memory</span>
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">NEURAL_NET</h2>
          <span className="font-code-sm text-code-sm text-on-surface-variant">V.2.0.4-BETA</span>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 custom-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-element-gap px-4 py-3 transition-all duration-200 active:translate-x-1 mx-2 rounded-r-lg ${
                isActive
                  ? "bg-surface-bright text-secondary border-l-4 border-secondary shadow-[0_0_15px_rgba(68,226,205,0.2)]"
                  : "text-on-surface-variant opacity-70 hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA & Footer */}
      <div className="px-6 pt-4 border-t border-outline-variant/30 flex flex-col gap-4">
        <button className="w-full py-2 px-4 bg-primary-container text-on-primary-container font-label-sm text-label-sm rounded-lg hover:bg-primary transition-colors duration-300 shadow-[0_0_10px_rgba(221,183,255,0.3)]">
          UPGRADE PROTOCOL
        </button>
        <div className="flex flex-col gap-1 mt-2">
          <a className="flex items-center gap-3 text-on-surface-variant opacity-70 hover:text-primary transition-colors py-2" href="#">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="font-code-sm text-code-sm">System Logs</span>
          </a>
          <a className="flex items-center gap-3 text-error opacity-70 hover:opacity-100 transition-opacity py-2" href="#">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-code-sm text-code-sm">Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
