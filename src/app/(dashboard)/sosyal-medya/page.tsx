"use client";

import React, { useState } from "react";

const platforms = [
  { id: "facebook", name: "Facebook", color: "#1877F2", glow: "rgba(24,119,242,0.3)", icon: "👥", followers: "5.2K", connected: true, avatar: null },
  { id: "instagram", name: "Instagram", color: "#E1306C", glow: "rgba(225,48,108,0.3)", icon: "📸", followers: "12.4K", connected: true, avatar: "https://images.unsplash.com/photo-1758520145147-c30bc656f314?w=40&h=40&fit=crop&auto=format" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", glow: "rgba(10,102,194,0.3)", icon: "💼", followers: "2.8K", connected: false, avatar: null },
  { id: "tiktok", name: "TikTok", color: "#010101", glow: "rgba(105,201,208,0.3)", icon: "🎵", followers: "8.9K", connected: true, avatar: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=40&h=40&fit=crop&auto=format" },
  { id: "youtube", name: "YouTube", color: "#FF0000", glow: "rgba(255,0,0,0.3)", icon: "▶️", followers: "3.1K", connected: true, avatar: null },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", glow: "rgba(37,211,102,0.3)", icon: "💬", followers: "—", connected: true, avatar: null },
  { id: "google", name: "Google Business", color: "#4285F4", glow: "rgba(66,133,244,0.3)", icon: "🏢", followers: "—", connected: false, avatar: null },
];

export default function SosyalMedyaPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map(p => [p.id, p.connected]))
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Hesabınızı Ekleyin (Bağlı Olmayanlar) */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Hesabınızı Ekleyin</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Bağlamak istediğiniz hesapları seçin</p>
        
        <div style={{ display: "flex", overflowX: "auto", gap: 16, paddingBottom: 16 }}>
          {platforms.filter(p => !connected[p.id]).map(p => (
            <div
              key={p.id}
              className="glass platform-card"
              style={{
                minWidth: 260,
                flex: "0 0 auto",
                borderRadius: 20, padding: "22px",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "none",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                  boxShadow: "none",
                }}>
                  {p.icon}
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: "rgba(255,255,255,0.07)",
                  color: "var(--text-muted)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  ○ Bağlı Değil
                </div>
              </div>

              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: "Outfit, sans-serif" }}>{p.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 14 }}>
                Henüz bağlanmadı
              </p>

              <button className="fab" style={{ width: "100%", justifyContent: "center", background: `${p.glow.replace("0.3","0.12")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, fontSize: 13 }}
                onClick={() => setConnected(c => ({ ...c, [p.id]: true }))}
              >
                + Hesap Bağla
              </button>
            </div>
          ))}
        </div>
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

        <div style={{ display: "flex", overflowX: "auto", gap: 16, paddingBottom: 16 }}>
          {platforms.filter(p => connected[p.id]).map(p => (
            <div
              key={p.id}
              className="glass platform-card"
              style={{
                minWidth: 260,
                flex: "0 0 auto",
                borderRadius: 20, padding: "22px",
                border: `1px solid ${p.glow.replace("0.3","0.35")}`,
                boxShadow: `0 0 24px ${p.glow}`,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
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

              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: "Outfit, sans-serif" }}>{p.name}</p>
              {p.followers !== "—" ? (
                <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 14, fontFamily: "JetBrains Mono, monospace" }}>
                  {p.followers} takipçi
                </p>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 14 }}>Bağlı</p>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onClick={() => setConnected(c => ({ ...c, [p.id]: false }))}
                >
                  Ayır
                </button>
                <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: `${p.glow.replace("0.3","0.15")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}` }}>
                  Yönet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
