"use client";

import React, { useState } from "react";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: on ? "#4edea3" : "rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", cursor: "pointer",
        padding: 3, transition: "background 0.3s",
      }}
    >
      <div
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff",
          transform: on ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.3s",
          boxShadow: on ? "0 0 10px rgba(0,0,0,0.2)" : "none",
        }}
      />
    </div>
  );
}

export default function BotScreen() {
  const [botConfig, setBotConfig] = useState({
    whatsapp: true,
    social: true,
    autoReply: true,
    smartRouting: false,
  });
  
  const [systemPrompt, setSystemPrompt] = useState(`Sen workigomFlow işletmesinin AI asistanısın. Müşterilere samimi, profesyonel ve yardımsever bir şekilde yanıt verirsin.

Müşteri soruları için: fiyat, ürün, stok, kargo bilgileri hakkında yönlendirme yaparsın.
Eğer bir konuyu çözemiyorsan, insan temsilcisine yönlendirirsin.

Ton: Samimi ama profesyonel. Kısa ve net cevaplar ver.`);

  const [activePreset, setActivePreset] = useState("customer");
  const presets = [
    { id: "customer", label: "Müşteri Hizmetleri", icon: "🎯" },
    { id: "sales", label: "Satış Asistanı", icon: "💰" },
    { id: "support", label: "Teknik Destek", icon: "🔧" },
    { id: "custom", label: "Özel Rol", icon: "⚙️" },
  ];

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Bot Karakter Yönetimi</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Yapay zekanın kişiliğini ve sınırlarını belirleyin</p>
      </div>

      {/* Platform toggles */}
      <div className="glass" style={{ borderRadius: 18, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16 }}>BOT AKTIFLIK</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { key: "whatsapp" as const, label: "WhatsApp Botu", icon: "💬", color: "#25D366" },
            { key: "social" as const, label: "Sosyal Medya Botu", icon: "📱", color: "#bc13fe" },
            { key: "autoReply" as const, label: "Oto Yanıt", icon: "⚡", color: "#00f0ff" },
            { key: "smartRouting" as const, label: "Akıllı Yönlendirme", icon: "🔀", color: "#ffb95f" },
          ].map(item => (
            <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: botConfig[item.key] ? "#fff" : "var(--text-secondary)" }}>{item.label}</p>
                </div>
              </div>
              <Toggle on={botConfig[item.key]} onChange={() => setBotConfig(c => ({ ...c, [item.key]: !c[item.key] }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Role presets */}
      <div className="glass" style={{ borderRadius: 18, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>HAZIR ROLLER</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePreset(p.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 12,
                background: activePreset === p.id ? "rgba(0,240,255,0.1)" : "rgba(255,255,255,0.02)",
                border: activePreset === p.id ? "1px solid rgba(0,240,255,0.3)" : "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer", color: activePreset === p.id ? "#fff" : "var(--text-secondary)",
                fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif",
              }}
            >
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              {p.label}
              {activePreset === p.id && <span style={{ marginLeft: "auto", color: "#00f0ff", fontSize: 12 }}>●</span>}
            </button>
          ))}
        </div>
      </div>

      {/* System prompt card with cyan aura */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: -1, borderRadius: 22, background: "radial-gradient(ellipse at 50% 0%, rgba(0,162,255,0.25) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
        <div className="glass" style={{
          borderRadius: 20, padding: "22px", position: "relative",
          border: "1.5px solid rgba(0,162,255,0.5)",
          boxShadow: "0 0 40px rgba(0,162,255,0.1), inset 0 0 20px rgba(0,162,255,0.03)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: "#00a2ff", fontWeight: 600, letterSpacing: "0.08em", fontFamily: "JetBrains Mono, monospace" }}>SİSTEM TALİMATI · BAĞLAM PENCERESI</p>
            <span style={{ fontSize: 11, color: "rgba(0,162,255,0.6)", fontFamily: "JetBrains Mono, monospace" }}>{systemPrompt.length} token</span>
          </div>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            style={{
              width: "100%", minHeight: 200, background: "rgba(0,162,255,0.04)",
              border: "1px solid rgba(0,162,255,0.15)", borderRadius: 12,
              padding: "14px", color: "rgba(255,255,255,0.85)", fontSize: 13,
              lineHeight: 1.7, resize: "vertical", outline: "none",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="fab" style={{ background: "linear-gradient(135deg,rgba(0,162,255,0.2),rgba(0,240,255,0.2))", color: "#00f0ff", border: "1.5px solid rgba(0,240,255,0.3)", fontSize: 13 }}>
              🤖 AI ile Optimize Et
            </button>
            <button className="fab" style={{ background: "rgba(78,222,163,0.12)", color: "#4edea3", border: "1.5px solid rgba(78,222,163,0.3)", fontSize: 13 }}>
              ✓ Kaydet
            </button>
          </div>
        </div>
      </div>

      {/* Bot performance */}
      <div className="glass" style={{ borderRadius: 18, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14 }}>BOT PERFORMANSI · BUGÜN</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { label: "Otonom Yanıt", value: "94%", color: "#4edea3" },
            { label: "Yönlendirilen", value: "47", color: "#ffb95f" },
            { label: "Ort. Yanıt Süresi", value: "0.8s", color: "#00f0ff" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: "14px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Outfit, sans-serif" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
