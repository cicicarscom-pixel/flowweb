"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);
  
  let pageTitle = "Anasayfa";
  if (pathname === "/") pageTitle = "Anasayfa";
  else if (pathname.includes("ai-asistan")) pageTitle = "Ai Asistan";
  else if (pathname.includes("ai-muhasebe")) {
    pageTitle = pathname.includes("odeme-takvimi") ? "Ai Muhasebe / Ödeme Takvimi" : "Ai Muhasebe";
  }
  else if (pathname.includes("sosyal-medya")) pageTitle = "Sosyal Medya";
  else if (pathname.includes("analiz")) pageTitle = "Analiz";

  return (
    <header className="glass-strong" style={{
      position: "sticky", top: 0, zIndex: 20,
      padding: "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexShrink: 0, background: "#0b0c10"
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "Outfit, sans-serif", marginBottom: 1, color: "#fff" }}>
          {pageTitle}
        </h1>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          {dateStr}
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="pill-btn" style={{ position: "relative", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}>
          🔔
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#bc13fe", position: "absolute", top: 4, right: 4, boxShadow: "0 0 6px #bc13fe" }} />
        </button>
      </div>
    </header>
  );
}
