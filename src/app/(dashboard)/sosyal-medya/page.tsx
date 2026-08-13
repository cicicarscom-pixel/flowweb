"use client";

import React, { useState } from "react";

const platforms = [
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "📘" },
  { id: "instagram", name: "Instagram", color: "#E1306C", icon: "📸" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", icon: "💼" },
  { id: "x", name: "X", color: "#ffffff", icon: "✖️" },
  { id: "tiktok", name: "TikTok", color: "#010101", icon: "🎵" },
];

export default function SosyalMedyaPage() {
  // Mock data for connected accounts
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: "instagram",
      platform: "Instagram",
      username: "@workigom.co...",
      status: "Aktif",
      color: "#bc13fe", // Pink/purple glow
      icon: "📸",
    }
  ]);

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      
      {/* Hesabınızı Ekleyin */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Hesabınızı Ekleyin</h2>
        
        <div className="glass" style={{ 
          borderRadius: 24, padding: "28px 24px", 
          border: "1px solid rgba(0,240,255,0.15)", background: "rgba(255,255,255,0.02)",
          display: "flex", gap: 32, overflowX: "auto"
        }}>
          {platforms.map(p => (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", minWidth: 72 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                color: p.color
              }}>
                {p.icon}
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eklediğiniz Hesaplarınız */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Eklediğiniz Hesaplarınız</h2>
          <button style={{ 
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(0,240,255,0.05)", border: "1px solid rgba(0,240,255,0.3)",
            borderRadius: 99, padding: "8px 16px", color: "#00f0ff", fontSize: 14, fontWeight: 600,
            cursor: "pointer"
          }}>
            <span style={{ fontSize: 16 }}>🔄</span> Senkronize Et
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {connectedAccounts.map(acc => (
            <div key={acc.id} className="glass" style={{
              borderRadius: 24, padding: "40px 24px 32px",
              border: "1px solid rgba(0,240,255,0.15)", background: "rgba(255,255,255,0.02)",
              display: "flex", flexDirection: "column", alignItems: "center", position: "relative"
            }}>
              
              {/* Gear Icon */}
              <div style={{
                position: "absolute", top: 16, right: 16,
                width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                backdropFilter: "blur(4px)"
              }}>
                <span style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>⚙️</span>
              </div>

              {/* Glowing Avatar */}
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                border: `3px solid ${acc.color}`, boxShadow: `0 0 24px ${acc.color}40, inset 0 0 24px ${acc.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48,
                marginBottom: 24, background: "rgba(255,255,255,0.03)"
              }}>
                {acc.icon}
              </div>

              {/* Info */}
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 6 }}>{acc.username}</p>
              <p style={{ fontSize: 14, color: "#4edea3", fontWeight: 600, marginBottom: 24 }}>{acc.status}</p>

              {/* Action */}
              <button style={{
                background: "rgba(255,50,100,0.08)", border: "1px solid rgba(255,50,100,0.4)",
                color: "#ff3264", borderRadius: 99, padding: "10px 40px", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                KALDIR
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
