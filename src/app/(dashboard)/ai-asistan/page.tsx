"use client";

import React, { useState } from "react";
import Link from "next/link";

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

  const [selectedRole, setSelectedRole] = useState("Kebapçı");
  const [selectedCharacter, setSelectedCharacter] = useState("Albert Einstein");
  const [selectedTone, setSelectedTone] = useState("Standart");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const roles = [
    { id: "Kebapçı", label: "Kebapçı", icon: "🥙" },
    { id: "Berber", label: "Berber", icon: "💈" },
    { id: "Oto Tamir", label: "Oto Tamir", icon: "🔧" },
    { id: "Market", label: "Market", icon: "🛍️" },
  ];

  const characters = [
    { id: "Albert Einstein", label: "Albert Einstein", icon: "😎" },
    { id: "William Shakespeare", label: "William Shakespeare", icon: "📜" },
    { id: "Mimar Sinan", label: "Mimar Sinan", icon: "📐" },
  ];

  const tones = [
    { id: "Standart", label: "Standart", icon: "😐" },
    { id: "Komik", label: "Komik", icon: "😆" },
    { id: "Resmi", label: "Resmi", icon: "👔" },
    { id: "Samimi", label: "Samimi", icon: "🤗" },
  ];

  return (
    <div style={{ padding: "28px 32px", width: "100%", flex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Bot Karakter Yönetimi</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Yapay zekanın kişiliğini ve sınırlarını belirleyin</p>
      </div>

      {/* Top Section: Toggles, Textarea, Bağlı Servisler */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 32 }}>
        {/* Ai Asistan Main Toggle */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 10px #4edea3" }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Ai Asistan</span>
            </div>
            <Toggle on={botConfig.social} onChange={() => setBotConfig(c => ({ ...c, social: !c.social }))} />
          </div>
          
          <div className="glass" style={{ borderRadius: 16, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, color: "#25D366" }}>💬</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#e5e1e4", flex: 1 }}>WhatsApp Asistanı</span>
              <Toggle on={botConfig.whatsapp} onChange={() => setBotConfig(c => ({ ...c, whatsapp: !c.whatsapp }))} />
            </div>
          </div>
        </div>

        {/* Asistan Talimatı Oluştur */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, padding: "0 4px" }}>Asistan Talimatı Oluştur</h3>
          <div className="glass" style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <textarea
              placeholder="Örn: Sen bir berber dükkanı asistanısın, fiyat bilgisi verip randevu alırsın..."
              style={{
                width: "100%", minHeight: 80, background: "transparent", border: "none",
                color: "rgba(255,255,255,0.85)", fontSize: 14, outline: "none", resize: "none"
              }}
            />
          </div>
        </div>

        {/* Bağlı Servisler */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: -20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <span style={{ fontSize: 22, filter: "grayscale(1) brightness(1.5)", opacity: 0.8 }}>⚙️</span>
          </div>
          
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, padding: "0 4px" }}>Bağlı Servisler</h3>
          <div className="glass" style={{ borderRadius: 20, padding: "20px", border: "1px solid rgba(0,162,255,0.3)", background: "rgba(0,162,255,0.03)", display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Google Drive */}
            <div className="glass" style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 22 }}>G</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px 0" }}>Google Drive (Bilgi Bankası)</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4d4d" }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Bağlı değil</span>
                  </div>
                </div>
              </div>
              <button style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Bağla
              </button>
            </div>

            {/* WhatsApp */}
            <div className="glass" style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 22, color: "#25D366" }}>💬</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px 0" }}>WhatsApp</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4d4d" }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Bağlı değil</span>
                  </div>
                </div>
              </div>
              <button style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Bağla
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Middle Section: 2-Column Grid for AI Kişiliği and Canlı Test */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 28, alignItems: "stretch", marginBottom: 32 }}>
        
        {/* Left Column: AI Kişiliği & Advanced Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* AI Kişiliği (Purple Box) */}
          <div className="glass" style={{ 
            borderRadius: 24, 
            padding: "24px 28px", 
            border: "2px solid #bc13fe",
            boxShadow: "0 0 20px rgba(188,19,254,0.15)",
            background: "rgba(188,19,254,0.03)"
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#fff" }}>AI Kişiliği</h3>
            
            {/* İşletme Rolü */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🏢</span> İŞLETME ROLÜ
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 16px", borderRadius: 99,
                      background: selectedRole === r.id ? "rgba(188,19,254,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedRole === r.id ? "1px solid rgba(188,19,254,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedRole === r.id ? "#bc13fe" : "var(--text-secondary)",
                      fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Karakter */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🧠</span> KARAKTER
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {characters.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCharacter(c.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 16px", borderRadius: 99,
                      background: selectedCharacter === c.id ? "rgba(188,19,254,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedCharacter === c.id ? "1px solid rgba(188,19,254,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedCharacter === c.id ? "#bc13fe" : "var(--text-secondary)",
                      fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Üslup */}
            <div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🎭</span> ÜSLUP
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {tones.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTone(t.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 16px", borderRadius: 99,
                      background: selectedTone === t.id ? "rgba(188,19,254,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedTone === t.id ? "1px solid rgba(188,19,254,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedTone === t.id ? "#bc13fe" : "var(--text-secondary)",
                      fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* İleri Seviye Ayarlar Accordion Toggle */}
          <div 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="glass" 
            style={{ 
              borderRadius: 99, 
              padding: "12px 16px 12px 24px", 
              border: "2px solid #bc13fe",
              boxShadow: "0 0 20px rgba(188,19,254,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              background: "rgba(188,19,254,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#00f0ff", fontWeight: "bold", fontSize: 18 }}>{'</>'}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>İleri Seviye Ayarlar</span>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: isAdvancedOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}>
              <span style={{ color: "#fff", fontSize: 20 }}>⚙️</span>
            </div>
          </div>

          {/* System prompt card (Advanced Settings) */}
          {isAdvancedOpen && (
            <div style={{ position: "relative", marginTop: -8, animation: "fadeIn 0.3s ease" }}>
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
          )}
        </div>

        {/* Right Column: Canlı Test */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="glass" style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 500 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 8px #4edea3" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Canlı Test</span>
              </div>
              <div 
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                style={{ cursor: "pointer", opacity: 0.6, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
              >
                <span style={{ fontSize: 16, filter: "grayscale(1) brightness(2)" }}>↻</span>
              </div>
            </div>
            
            <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", padding: "20px 16px", overflowY: "auto", gap: 16 }}>
              {!isSimulationActive ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <span style={{ 
                      fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", 
                      letterSpacing: "0.1em", border: "1px solid rgba(255,255,255,0.05)",
                      padding: "4px 12px", borderRadius: 99
                    }}>SİMÜLASYON BAŞLADI</span>
                  </div>
                  
                  {/* User message */}
                  <div style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
                    <div style={{ 
                      background: "rgba(255,255,255,0.1)", borderRadius: "16px 16px 2px 16px", 
                      padding: "12px 16px", color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.5 
                    }}>
                      Merhaba, stoklarınızda mavi renk M beden kışlık mont var mı? Fiyatı nedir?
                    </div>
                  </div>

                  {/* Loading indicator */}
                  <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 99 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                  </div>

                  {/* Bot message */}
                  <div style={{ alignSelf: "flex-start", maxWidth: "90%" }}>
                    <div style={{ 
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px 16px 16px 2px", padding: "14px 16px", 
                      color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6 
                    }}>
                      Merhaba! 👋 Evet, mavi renk M beden kışlık montumuz stoklarımızda mevcuttur. 
                      Güncel fiyatımız <span style={{color: "#fff", fontWeight: 600}}>1.450 TL</span>'dir. 
                      Hemen sipariş oluşturmak isterseniz size bir bağlantı gönderebilirim. 
                      Başka yardımcı olabileceğim bir konu var mı?
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                   <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Asistan ile konuşmaya başlayın...</p>
                </div>
              )}
            </div>

            <div style={{ padding: "16px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  placeholder="Asistan ile konuşun..." 
                  onFocus={() => setIsSimulationActive(true)}
                  style={{ 
                    width: "100%", padding: "14px 48px 14px 20px", borderRadius: 99, 
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff", fontSize: 13, outline: "none"
                  }} 
                />
                <div style={{ 
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", background: "rgba(0,162,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  border: "1px solid rgba(0,162,255,0.3)"
                }}>
                  <span style={{ fontSize: 16, color: "#00a2ff" }}>➤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

        {/* Ai Randevu Yönetimi */}
        <Link href="/ai-asistan/randevu" style={{ textDecoration: 'none' }}>
          <div className="glass" style={{ 
            borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(78,222,163,0.3)",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            background: "rgba(78,222,163,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, color: "#4edea3" }}>📅</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#4edea3" }}>Ai Randevu Yönetimi</span>
            </div>
            <span style={{ color: "#4edea3", fontSize: 24, lineHeight: 1 }}>›</span>
          </div>
        </Link>

        {/* Ai İşletme Hizmetleri */}
        <Link href="/ai-asistan/isletme-hizmetleri" style={{ textDecoration: 'none' }}>
          <div className="glass" style={{ 
            borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,162,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            background: "rgba(0,162,255,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, color: "#00a2ff" }}>💼</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#00a2ff" }}>Ai İşletme Hizmetleri</span>
            </div>
            <span style={{ color: "#00a2ff", fontSize: 24, lineHeight: 1 }}>›</span>
          </div>
        </Link>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
