"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

const platforms = [
  { id: "facebook", name: "Facebook", color: "#1877F2", glow: "rgba(24,119,242,0.3)", icon: "👥", followers: "5.2K", connected: true, avatar: null },
  { id: "instagram", name: "Instagram", color: "#E1306C", glow: "rgba(225,48,108,0.3)", icon: "📸", followers: "12.4K", connected: true, avatar: "https://images.unsplash.com/photo-1758520145147-c30bc656f314?w=40&h=40&fit=crop&auto=format" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", glow: "rgba(10,102,194,0.3)", icon: "💼", followers: "2.8K", connected: false, avatar: null },
  { id: "tiktok", name: "TikTok", color: "#010101", glow: "rgba(105,201,208,0.3)", icon: "🎵", followers: "8.9K", connected: true, avatar: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=40&h=40&fit=crop&auto=format" },
  { id: "youtube", name: "YouTube", color: "#FF0000", glow: "rgba(255,0,0,0.3)", icon: "▶️", followers: "3.1K", connected: true, avatar: null },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", glow: "rgba(37,211,102,0.3)", icon: "💬", followers: "—", connected: true, avatar: null },
  { id: "google", name: "Google Business", color: "#4285F4", glow: "rgba(66,133,244,0.3)", icon: "🏢", followers: "—", connected: false, avatar: null },
];

function ScrollableContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ 
        display: "flex", overflowX: "auto", gap: 16, paddingBottom: 16, 
        cursor: isDown ? "grabbing" : "grab",
        scrollbarWidth: "none", msOverflowStyle: "none"
      }}
    >
      {/* Hide scrollbar with inline styles for webkit */}
      <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
      {children}
    </div>
  );
}

export default function SosyalMedyaPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map(p => [p.id, p.connected]))
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* 3'lü Hızlı Erişim Butonları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/sosyal-medya/create-post" className="group glass p-6 rounded-2xl border border-app-border hover:border-[#bc13fe]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(188,19,254,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#bc13fe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#bc13fe]/10 flex items-center justify-center border border-[#bc13fe]/30 group-hover:border-[#bc13fe]/60 transition-colors shadow-[0_0_15px_rgba(188,19,254,0.2)]">
            <i className="fa-solid fa-pen-nib text-[#bc13fe] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Gönderi Oluştur</h3>
            <p className="text-xs text-app-muted font-jetbrains">Yeni içerik planlayın</p>
          </div>
        </Link>
        
        <Link href="/sosyal-medya/posts" className="group glass p-6 rounded-2xl border border-app-border hover:border-[#00f0ff]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/30 group-hover:border-[#00f0ff]/60 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <i className="fa-solid fa-layer-group text-[#00f0ff] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Tüm Gönderiler</h3>
            <p className="text-xs text-app-muted font-jetbrains">Yayın akışınızı yönetin</p>
          </div>
        </Link>

        <Link href="/sosyal-medya/share" className="group glass p-6 rounded-2xl border border-app-border hover:border-[#4edea3]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(78,222,163,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#4edea3]/10 flex items-center justify-center border border-[#4edea3]/30 group-hover:border-[#4edea3]/60 transition-colors shadow-[0_0_15px_rgba(78,222,163,0.2)]">
            <i className="fa-solid fa-chart-pie text-[#4edea3] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Paylaşım Merkezi</h3>
            <p className="text-xs text-app-muted font-jetbrains">İstatistik ve raporlar</p>
          </div>
        </Link>
      </div>

      {/* Hesabınızı Ekleyin (Tüm Hesaplar) */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Hesabınızı Ekleyin</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Bağlamak istediğiniz hesapları seçin</p>
        
        <ScrollableContainer>
          {platforms.map(p => (
            <div
              key={p.id}
              className="glass platform-card"
              style={{
                minWidth: 220,
                flex: "0 0 auto",
                borderRadius: 20, padding: "16px",
                border: `1px solid ${connected[p.id] ? p.glow.replace("0.3","0.35") : "rgba(255,255,255,0.06)"}`,
                boxShadow: connected[p.id] ? `0 0 24px ${p.glow}` : "none",
                userSelect: "none"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                  boxShadow: connected[p.id] ? `0 0 16px ${p.glow}` : "none",
                }}>
                  {p.icon}
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: connected[p.id] ? "rgba(78,222,163,0.15)" : "rgba(255,255,255,0.07)",
                  color: connected[p.id] ? "#4edea3" : "var(--text-muted)",
                  border: `1px solid ${connected[p.id] ? "rgba(78,222,163,0.3)" : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {connected[p.id] ? <>✓ Bağlı</> : <>○ Bağlı Değil</>}
                </div>
              </div>

              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: "Outfit, sans-serif" }}>{p.name}</p>
              {connected[p.id] && p.followers !== "—" && (
                <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12, fontFamily: "JetBrains Mono, monospace" }}>
                  {p.followers} takipçi
                </p>
              )}
              {(!connected[p.id] || p.followers === "—") && (
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 12 }}>
                  {connected[p.id] ? "Bağlı" : "Henüz bağlanmadı"}
                </p>
              )}

              {connected[p.id] ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px" }}
                    onClick={(e) => { e.stopPropagation(); setConnected(c => ({ ...c, [p.id]: false })) }}
                  >
                    Ayır
                  </button>
                  <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: `${p.glow.replace("0.3","0.15")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, padding: "6px" }}>
                    Yönet
                  </button>
                </div>
              ) : (
                <button className="fab" style={{ width: "100%", justifyContent: "center", background: `${p.glow.replace("0.3","0.12")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, fontSize: 12, padding: "8px" }}
                  onClick={(e) => { e.stopPropagation(); setConnected(c => ({ ...c, [p.id]: true })) }}
                >
                  + Hesap Bağla
                </button>
              )}
            </div>
          ))}
        </ScrollableContainer>
      </div>

      {/* Eklediğiniz Hesaplarınız (Bağlı Olanlar) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Eklediğiniz Hesaplarınız</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tüm kanallarınızı tek merkezden yönetin</p>
          </div>
          <button className="fab" style={{ background: "linear-gradient(135deg,rgba(0,240,255,0.15),rgba(78,222,163,0.15))", color: "#00f0ff", border: "1.5px solid rgba(0,240,255,0.3)" }}>
            🔄 Senkronize Et
          </button>
        </div>

        <ScrollableContainer>
          {platforms.filter(p => connected[p.id]).map(p => (
            <div
              key={p.id}
              className="glass platform-card"
              style={{
                minWidth: 220,
                flex: "0 0 auto",
                borderRadius: 20, padding: "16px",
                border: `1px solid ${p.glow.replace("0.3","0.35")}`,
                boxShadow: `0 0 24px ${p.glow}`,
                userSelect: "none"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 14,
                  background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                  boxShadow: `0 0 16px ${p.glow}`,
                }}>
                  {p.icon}
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: "rgba(78,222,163,0.15)",
                  color: "#4edea3",
                  border: "1px solid rgba(78,222,163,0.3)",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  ✓ Bağlı
                </div>
              </div>

              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: "Outfit, sans-serif" }}>{p.name}</p>
              {p.followers !== "—" ? (
                <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12, fontFamily: "JetBrains Mono, monospace" }}>
                  {p.followers} takipçi
                </p>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 12 }}>Bağlı</p>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px" }}
                  onClick={(e) => { e.stopPropagation(); setConnected(c => ({ ...c, [p.id]: false })) }}
                >
                  Ayır
                </button>
                <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: `${p.glow.replace("0.3","0.15")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, padding: "6px" }}>
                  Yönet
                </button>
              </div>
            </div>
          ))}
        </ScrollableContainer>
      </div>
    </div>
  );
}
