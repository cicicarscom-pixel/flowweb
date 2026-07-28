'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Anasayfa', href: '/', icon: 'home' },
    { name: 'Ai Asistan', href: '/ai-asistan', icon: 'memory' },
    { name: 'Ai Muhasebe', href: '/accounting', icon: 'account_balance_wallet' },
    { name: 'Sosyal Medya', href: '/social-media', icon: 'share' },
    { name: 'Analiz', href: '/analiz', icon: 'bar_chart' },
  ];

  return (
    <aside className="hidden md:flex flex-col bg-surface-container-lowest/80 backdrop-blur-md fixed left-0 top-0 h-screen w-[280px] border-r border-white/5 py-lg px-md gap-md z-40">
      <div className="flex items-center justify-center mb-lg w-full">
        <img src="/logo.png" alt="Workigom Flow" className="h-[72px] w-auto object-contain drop-shadow-[0_0_10px_rgba(0,162,255,0.15)]" />
      </div>
      <nav className="flex-1 flex flex-col gap-xs overflow-y-auto pr-sm">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-sm py-sm px-sm rounded-lg group transition-colors ${
                isActive 
                  ? 'text-primary-fixed-dim bg-gradient-to-r from-primary/10 to-transparent rounded-r-lg' 
                  : 'sidebar-item-hover text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <div className="absolute left-[-24px] h-8 w-1 bg-primary shadow-[0_0_15px_rgba(0,162,255,0.8)] rounded-r-full"></div>
              )}
              <span className={`material-symbols-outlined transition-colors ${isActive ? '' : 'group-hover:text-primary-fixed-dim'}`}>
                {link.icon}
              </span>
              <span className="font-data-mono text-data-mono uppercase">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-md border-t border-white/5 flex flex-col gap-xs">
        <Link className="sidebar-item-hover flex items-center gap-sm text-on-surface-variant hover:text-on-surface py-sm px-sm rounded-lg group transition-colors" href="#">
          <span className="material-symbols-outlined group-hover:text-primary-fixed-dim transition-colors">help</span>
          <span className="font-data-mono text-data-mono uppercase">Help</span>
        </Link>
        <a className="sidebar-item-hover flex items-center gap-sm text-on-surface-variant hover:text-on-surface py-sm px-sm rounded-lg group transition-colors" href="#">
          <span className="material-symbols-outlined group-hover:text-primary-fixed-dim transition-colors">contact_support</span>
          <span className="font-data-mono text-data-mono uppercase">Support</span>
        </a>
      </div>
    </aside>
  );
}
