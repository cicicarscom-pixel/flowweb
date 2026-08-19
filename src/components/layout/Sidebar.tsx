"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Anasayfa", icon: "⬡", color: "#00f0ff" },
    { href: "/ai-asistan", label: "Ai Asistan", icon: "◉", color: "#00a2ff" },
    { href: "/ai-muhasebe", label: "Ai Muhasebe", icon: "▤", color: "#ffb95f" },
    { href: "/sosyal-medya", label: "Sosyal Medya", icon: "◎", color: "#bc13fe" },
    { href: "/gelen-kutusu", label: "Gelen Kutusu", icon: "📥", color: "#ff4d4d" },
    { href: "/analiz", label: "Analiz", icon: "◈", color: "#4edea3" },
  ];

  return (
    <aside className="glass-strong" style={{
      width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", zIndex: 10, position: "relative",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
          <img src="/logo.png" alt="Workigom Flow" style={{ height: 43, width: "auto", objectFit: "contain" }} />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const color = item.color;
          
          let bgRgb = "0,240,255";
          if (color === "#bc13fe") bgRgb = "188,19,254";
          if (color === "#4edea3") bgRgb = "78,222,163";
          if (color === "#00a2ff") bgRgb = "0,162,255";
          if (color === "#ffb95f") bgRgb = "255,185,95";
          if (color === "#ff4d4d") bgRgb = "255,77,77";

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 12, cursor: "pointer", border: "none",
                background: active ? `rgba(${bgRgb},0.1)` : "transparent",
                color: active ? color : "var(--text-secondary)",
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
                textAlign: "left", transition: "all 0.2s",
                boxShadow: active ? `inset 3px 0 0 ${color}` : "none",
                textDecoration: "none"
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.5, color: active ? color : "inherit" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{ padding: "14px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/profil" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
            <img
              src="https://images.unsplash.com/photo-1758520145147-c30bc656f314?w=36&h=36&fit=crop&auto=format"
              alt="Kullanıcı profili"
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", border: "1.5px solid rgba(0,240,255,0.2)" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ahmet Yılmaz</p>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Pro Plan</p>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 8px #4edea3", flexShrink: 0 }} />
          </div>
        </Link>

        <button 
          style={{
            width: "100%", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "rgba(255, 77, 77, 0.05)", border: "1px solid rgba(255, 77, 77, 0.2)",
            borderRadius: 8, color: "#ff4d4d", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>⏻</span> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

