"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { saveAiPersonaSettings, getAiPersonaSettings } from "@/actions/aiPersonaSettings";
import { getWahaStatus, startWahaSession, getWahaQrCode, getWahaPairingCode } from "@/actions/waha";

// Persona Engine (Phase 5): today's UI still shows a fixed 3-character list
// (Phase 6 replaces this with a real carousel fetched from ai_personas), but
// saving/loading now goes through organization_ai_settings by slug instead
// of writing a hand-built system_prompt string into bot_settings. This map
// is the ONLY place that ties the UI's display labels to the seeded
// ai_personas.slug values (see ledger/scripts/personas/*.json) — Phase 6
// removes it entirely once personas are fetched, not hardcoded.
const CHARACTER_SLUGS: Record<string, string> = {
  "Albert Einstein": "einstein",
  "William Shakespeare": "shakespeare",
};
const SLUG_TO_CHARACTER: Record<string, string> = Object.fromEntries(
  Object.entries(CHARACTER_SLUGS).map(([label, slug]) => [slug, label])
);

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: on ? "#22B573" : "rgba(255,255,255,0.1)",
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
  const supabase = createClient();
  const [botConfig, setBotConfig] = useState({
    whatsapp: false,
    social: false,
    autoReply: true,
    smartRouting: false,
  });
  const [customInstruction, setCustomInstruction] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [wahaStatus, setWahaStatus] = useState<any>(null);
  const [wahaQrCode, setWahaQrCode] = useState<string | null>(null);
  const [wahaPhone, setWahaPhone] = useState("");
  const [wahaPairingCode, setWahaPairingCode] = useState<string | null>(null);
  const [wahaLoading, setWahaLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // bot_settings still drives the channel toggles below (whatsapp/social
    // active) — untouched by the Persona Engine. Its system_prompt/tone/
    // role/character columns are no longer read here (see Phase 5 note on
    // handleSave below) — they stay in the table only as PromptBuilder's
    // legacy fallback for merchants who never touch these new settings.
    const { data: botData } = await supabase
      .from('bot_settings')
      .select('whatsapp_bot_active, is_active, system_prompt')
      .eq('merchant_id', session.user.id)
      .maybeSingle();

    if (botData) {
      setBotConfig(prev => ({
        ...prev,
        whatsapp: !!botData.whatsapp_bot_active,
        social: !!botData.is_active,
      }));
      // Shown read-only in "İleri Seviye Ayarlar" as a reference to what's
      // currently live as fallback — see the caption next to that textarea.
      if (botData.system_prompt) setSystemPrompt(botData.system_prompt);
    }

    // Persona Engine (Phase 5): the merchant's actual saved persona/dial
    // selections now live in organization_ai_settings, not bot_settings.
    const aiSettings = await getAiPersonaSettings();
    if (aiSettings) {
      if (aiSettings.businessRole) setSelectedRole(aiSettings.businessRole);
      if (aiSettings.tone) setSelectedTone(aiSettings.tone);
      if (aiSettings.customInstruction) setCustomInstruction(aiSettings.customInstruction);
      if (aiSettings.characterSlug && SLUG_TO_CHARACTER[aiSettings.characterSlug]) {
        setSelectedCharacter(SLUG_TO_CHARACTER[aiSettings.characterSlug]);
      }
    }

    const wahaRes = await getWahaStatus();
    if (wahaRes.success && wahaRes.data) {
      setWahaStatus(wahaRes.data.status);
      if (wahaRes.data.me) {
        setWahaPhone(wahaRes.data.me.id.split('@')[0]);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Persona Engine (Phase 5, guardrail #2): this client no longer builds
      // or saves any merged prompt string. It only sends the raw selections
      // — organization_ai_settings.persona_id (resolved server-side from
      // this slug) is what PersonaService/PersonaPromptBuilder render into
      // an actual prompt, on the server, at message time (Phase 2/3).
      // bot_settings.system_prompt/tone/role/character are no longer
      // written from this screen at all.
      const characterSlug = CHARACTER_SLUGS[selectedCharacter] ?? null;

      const result = await saveAiPersonaSettings({
        characterSlug,
        businessRole: selectedRole,
        tone: selectedTone,
        customInstruction,
      });

      if (!result.success) {
        alert(`Ayarlar kaydedilemedi: ${result.error ?? 'Bilinmeyen hata'}`);
        return;
      }

      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error(error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Poll WAHA status when QR is showing or status is not yet WORKING
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (wahaQrCode || wahaPairingCode || (wahaStatus && wahaStatus !== 'WORKING' && wahaStatus !== 'STOPPED')) {
      interval = setInterval(async () => {
        const wahaRes = await getWahaStatus();
        if (wahaRes.success && wahaRes.data) {
          if (wahaRes.data.status !== wahaStatus) {
            setWahaStatus(wahaRes.data.status);
          }
          if (wahaRes.data.status === 'WORKING') {
            setWahaQrCode(null);
            setWahaPairingCode(null);
            if (wahaRes.data.me) {
              setWahaPhone(wahaRes.data.me.id.split('@')[0]);
            }
          }
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [wahaQrCode, wahaPairingCode, wahaStatus]);

  const handleToggle = async (key: 'social' | 'whatsapp', newValue: boolean) => {
    setBotConfig(c => ({ ...c, [key]: newValue }));
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const updateData: any = {};
    if (key === 'social') {
      updateData.is_active = newValue;
      updateData.social_bot_active = newValue;
    }
    if (key === 'whatsapp') updateData.whatsapp_bot_active = newValue;

    // Check if row exists
    const { data: existingData } = await supabase
      .from('bot_settings')
      .select('id')
      .eq('merchant_id', session.user.id)
      .limit(1);

    if (existingData && existingData.length > 0) {
      await supabase.from('bot_settings').update(updateData).eq('merchant_id', session.user.id);
    } else {
      await supabase.from('bot_settings').insert([{ merchant_id: session.user.id, ...updateData }]);
    }
  };

  const handleWahaConnect = async () => {
    setWahaLoading(true);
    setWahaQrCode(null);
    setWahaPairingCode(null);
    
    const startRes = await startWahaSession();
    if (!startRes.success) {
      alert(startRes.error);
      setWahaLoading(false);
      return;
    }
    
    setTimeout(async () => {
      const qrRes = await getWahaQrCode();
      if (qrRes.success && qrRes.data) {
        setWahaQrCode(qrRes.data.data || qrRes.data);
      } else {
        alert("QR alınamadı: " + (qrRes.error || ""));
      }
      setWahaLoading(false);
    }, 2000);
  };

  const handleGetPairingCode = async () => {
    if (!wahaPhone.trim()) {
      alert('Lütfen telefon numaranızı girin (Örn: 90532...)');
      return;
    }
    setWahaLoading(true);
    setWahaPairingCode(null);
    
    const pairingRes = await getWahaPairingCode(wahaPhone.trim());
    if (pairingRes.success && pairingRes.data) {
      setWahaPairingCode(pairingRes.data.code);
    } else {
      alert("Kod alınamadı: " + (pairingRes.error || ""));
    }
    setWahaLoading(false);
  };

  
  const [systemPrompt, setSystemPrompt] = useState(`Sen workigomFlow işletmesinin AI asistanısın. Müşterilere samimi, profesyonel ve yardımsever bir şekilde yanıt verirsin.

Müşteri soruları için: fiyat, ürün, stok, kargo bilgileri hakkında yönlendirme yaparsın.
Eğer bir konuyu çözemiyorsan, insan temsilcisine yönlendirirsin.

Ton: Samimi ama profesyonel. Kısa ve net cevaplar ver.`);

  const [selectedRole, setSelectedRole] = useState("Kebapçı");
  const [selectedCharacter, setSelectedCharacter] = useState("Albert Einstein");
  const [selectedTone, setSelectedTone] = useState("Standart");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setIsSimulationActive(true);
    const newMessages = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Persona Engine (Phase 4/5): Canlı Test artık gerçek
      // PromptBuilder/AIOrchestrator/ToolRegistry pipeline'ını
      // executionMode "simulation" ile çalıştıran persona-test fonksiyonunu
      // kullanıyor — gemini-chat'e ve elle birleştirilmiş bir system prompt
      // string'ine artık hiç gerek yok. Henüz KAYDEDİLMEMİŞ seçimler
      // (selectedRole/selectedCharacter/selectedTone/customInstruction)
      // doğrudan gönderiliyor, böylece kullanıcı "Kaydet"e basmadan önce
      // önizleme yapabiliyor — bu, Faz 5'in DoD'sinin ("Canlı Test'te
      // görülenle birebir aynı yanıt") tam olarak dayandığı mekanizma.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessages(prev => [...prev, { role: 'bot', content: 'Oturum bulunamadı, lütfen tekrar giriş yapın.' }]);
        return;
      }

      const { data, error } = await supabase.functions.invoke('persona-test', {
        body: {
          merchantId: session.user.id,
          testMessage: inputValue.trim(),
          personaSlug: CHARACTER_SLUGS[selectedCharacter] ?? null,
          businessRole: selectedRole,
          tone: selectedTone,
          customInstruction: customInstruction,
        }
      });

      if (error || data?.error) {
        setMessages(prev => [...prev, { role: 'bot', content: `Hata: ${error?.message || data?.error || 'Bilinmeyen Hata'}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: data?.text || "Cevap alınamadı." }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sistem hatası oluştu.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const roles = [
    { id: "Kebapçı", label: "Kebapçı", icon: "🥙" },
    { id: "Berber", label: "Berber", icon: "💈" },
    { id: "Oto Tamir", label: "Oto Tamir", icon: "🔧" },
    { id: "Market", label: "Market", icon: "🛍️" },
  ];

  const characters = [
    { id: "Albert Einstein", label: "Albert Einstein", icon: "😎" },
    { id: "William Shakespeare", label: "William Shakespeare", icon: "📜" },
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




        {/* Bağlı Servisler */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: -20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <span style={{ fontSize: 22, filter: "grayscale(1) brightness(1.5)", opacity: 0.8 }}>⚙️</span>
          </div>
          
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, padding: "0 4px" }}>Bağlı Servisler</h3>
          <div className="glass" style={{ borderRadius: 20, padding: "20px", border: "1px solid rgba(255,122,89,0.3)", background: "rgba(255,122,89,0.03)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Google Drive */}
              <div className="glass" style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 22 }}>G</span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px 0" }}>Google Drive (Bilgi Bankası)</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Bağlı değil</span>
                    </div>
                  </div>
                </div>
                <button style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Bağla
                </button>
              </div>

              {/* WhatsApp */}
              <div className="glass" style={{ borderRadius: 16, padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <i className="fa-brands fa-whatsapp" style={{ fontSize: 24, color: "#25D366" }}></i>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: "0 0 4px 0" }}>WhatsApp</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: wahaStatus === 'WORKING' ? "#22B573" : "#EF4444" }} />
                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                          {wahaStatus === 'WORKING' ? 'Bağlı' : (wahaStatus === 'STARTING' ? 'Başlatılıyor' : 'Bağlı değil')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {wahaStatus !== 'WORKING' ? (
                    <button 
                      onClick={handleWahaConnect}
                      disabled={wahaLoading}
                      style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 99, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: wahaLoading ? "not-allowed" : "pointer", opacity: wahaLoading ? 0.7 : 1 }}>
                      {wahaLoading ? 'İşleniyor...' : 'Bağla'}
                    </button>
                  ) : (
                    <button 
                      onClick={handleWahaConnect}
                      disabled={wahaLoading}
                      style={{ background: "rgba(34,181,115,0.2)", border: "1px solid rgba(34,181,115,0.4)", borderRadius: 99, padding: "6px 16px", color: "#22B573", fontSize: 12, fontWeight: 600, cursor: wahaLoading ? "not-allowed" : "pointer" }}>
                      {wahaLoading ? 'İşleniyor...' : 'Yenile'}
                    </button>
                  )}
                </div>
                
                {/* QR and Pairing section */}
                {wahaQrCode && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 12, padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                    <p style={{ fontSize: 13, color: "#fff", textAlign: "center" }}>WhatsApp'ı açın, Bağlı Cihazlar'dan QR kodu taratın</p>
                    <img src={wahaQrCode.startsWith('data:image') ? wahaQrCode : `data:image/png;base64,${wahaQrCode}`} style={{ width: 200, height: 200, borderRadius: 8 }} alt="WAHA QR" />
                    
                    <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
                    <p style={{ fontSize: 13, color: "#fff", textAlign: "center" }}>Veya numara ile bağlanın</p>
                    <div style={{ display: "flex", gap: 8, width: "100%" }}>
                      <input 
                        type="text" 
                        value={wahaPhone} 
                        onChange={e => setWahaPhone(e.target.value)} 
                        placeholder="Örn: 90532..."
                        style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 13 }}
                      />
                      <button 
                        onClick={handleGetPairingCode}
                        disabled={wahaLoading}
                        style={{ padding: "8px 16px", borderRadius: 8, background: "#22B573", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: wahaLoading ? "not-allowed" : "pointer" }}
                      >
                        Kod Al
                      </button>
                    </div>
                    {wahaPairingCode && (
                      <div style={{ marginTop: 8, padding: 12, background: "rgba(34,181,115,0.1)", border: "1px solid rgba(34,181,115,0.3)", borderRadius: 8, width: "100%", textAlign: "center" }}>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>WhatsApp Bildirimini Onaylayıp Bu Kodu Girin:</p>
                        <p style={{ fontSize: 24, fontWeight: 700, color: "#22B573", letterSpacing: 4 }}>{wahaPairingCode}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Asistanı Toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
              <div className="glass" style={{ width: "50%", minWidth: 300, borderRadius: 16, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: 22, color: "#25D366" }}></i>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#e5e1e4", flex: 1 }}>WhatsApp Asistanı</span>
                  <Toggle on={botConfig.whatsapp} onChange={() => handleToggle('whatsapp', !botConfig.whatsapp)} />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Middle Section: 2-Column Grid for AI Kişiliği and Canlı Test */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 28, alignItems: "stretch", marginBottom: 32 }}>
        
        {/* Left Column: AI Kişiliği & Advanced Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* AI Kişiliği (Purple Box) */}
          <div className="glass" style={{ 
            borderRadius: 24, 
            padding: "24px 28px", 
            border: "2px solid #C2478D",
            boxShadow: "0 0 20px rgba(194,71,141,0.15)",
            background: "rgba(194,71,141,0.03)"
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
                      background: selectedRole === r.id ? "rgba(194,71,141,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedRole === r.id ? "1px solid rgba(194,71,141,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedRole === r.id ? "#C2478D" : "var(--text-secondary)",
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
                      background: selectedCharacter === c.id ? "rgba(194,71,141,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedCharacter === c.id ? "1px solid rgba(194,71,141,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedCharacter === c.id ? "#C2478D" : "var(--text-secondary)",
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
                      background: selectedTone === t.id ? "rgba(194,71,141,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedTone === t.id ? "1px solid rgba(194,71,141,0.4)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", color: selectedTone === t.id ? "#C2478D" : "var(--text-secondary)",
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
              border: "2px solid #C2478D",
              boxShadow: "0 0 20px rgba(194,71,141,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              background: "rgba(194,71,141,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#FF7A59", fontWeight: "bold", fontSize: 18 }}>{'</>'}</span>
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
              <div style={{ position: "absolute", inset: -1, borderRadius: 22, background: "radial-gradient(ellipse at 50% 0%, rgba(255,122,89,0.25) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
              <div className="glass" style={{
                borderRadius: 20, padding: "22px", position: "relative",
                border: "1.5px solid rgba(255,122,89,0.5)",
                boxShadow: "0 0 40px rgba(255,122,89,0.1), inset 0 0 20px rgba(255,122,89,0.03)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#FF7A59", fontWeight: 600, letterSpacing: "0.08em", fontFamily: "JetBrains Mono, monospace" }}>SİSTEM TALİMATI · BAĞLAM PENCERESI</p>
                  <span style={{ fontSize: 11, color: "rgba(255,122,89,0.6)", fontFamily: "JetBrains Mono, monospace" }}>{systemPrompt.length} token</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10, lineHeight: 1.5 }}>
                  Bu alan artık kaydedilmiyor — yukarıdaki Karakter/Ton/Rol seçimleri ve "Asistan Talimatı Oluştur" kutusu kullanılıyor. Burada gördüğünüz metin, hiç persona seçmemiş eski hesaplar için hâlâ geçerli olan önceki yapılandırmanızın salt okunur bir yansımasıdır.
                </p>
                <textarea
                  value={systemPrompt}
                  readOnly
                  style={{
                    width: "100%", minHeight: 200, background: "rgba(255,122,89,0.04)",
                    border: "1px solid rgba(255,122,89,0.15)", borderRadius: 12,
                    padding: "14px", color: "rgba(255,255,255,0.55)", fontSize: 13,
                    lineHeight: 1.7, resize: "vertical", outline: "none",
                    fontFamily: "Inter, sans-serif", cursor: "default",
                  }}
                />

              </div>
            </div>
          )}

          {/* Asistan Talimatı Oluştur */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, padding: "0 4px" }}>Asistan Talimatı Oluştur</h3>
            <div className="glass" style={{ 
              borderRadius: 24, 
              padding: "16px", 
              background: "rgba(194,71,141,0.03)", 
              border: "2px solid #C2478D",
              boxShadow: "0 0 20px rgba(194,71,141,0.15)"
            }}>
              <textarea
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Örn: Sen bir berber dükkanı asistanısın, fiyat bilgisi verip randevu alırsın..."
                className="focus:outline-none focus:ring-0 focus:border-transparent"
                style={{
                  width: "100%", minHeight: 110, background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.85)", fontSize: 14, outline: "none", resize: "none",
                  boxShadow: "none"
                }}
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
            background: "linear-gradient(135deg, #C2478D 0%, #FF7A59 100%)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16, 
            padding: "16px", 
            color: "#fff", 
            fontSize: 16, 
            fontWeight: 600,
            letterSpacing: "0.02em",
            cursor: isSaving ? "not-allowed" : "pointer", 
            opacity: isSaving ? 0.7 : 1,
            boxShadow: "0 0 20px rgba(194,71,141,0.25)", 
            marginTop: 8
          }}>
            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>

        {/* Right Column: Canlı Test */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="glass" style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 500 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
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
              {!isSimulationActive && messages.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                   <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Asistan ile konuşmaya başlayın...</p>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <span style={{ 
                      fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", 
                      letterSpacing: "0.1em", border: "1px solid rgba(255,255,255,0.05)",
                      padding: "4px 12px", borderRadius: 99
                    }}>SİMÜLASYON BAŞLADI</span>
                  </div>
                  
                  {messages.map((msg, idx) => (
                    msg.role === 'user' ? (
                      <div key={idx} style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
                        <div style={{ 
                          background: "rgba(255,255,255,0.1)", borderRadius: "16px 16px 2px 16px", 
                          padding: "12px 16px", color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.5 
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div key={idx} style={{ alignSelf: "flex-start", maxWidth: "90%" }}>
                        <div style={{ 
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px 16px 16px 2px", padding: "14px 16px", 
                          color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6 
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  ))}

                  {isTyping && (
                    <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 99 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ padding: "16px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Asistan ile konuşun..." 
                  onFocus={() => setIsSimulationActive(true)}
                  style={{ 
                    width: "100%", padding: "14px 48px 14px 20px", borderRadius: 99, 
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff", fontSize: 13, outline: "none"
                  }} 
                />
                <div 
                  onClick={handleSendMessage}
                  style={{ 
                  position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", background: "rgba(255,122,89,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  border: "1px solid rgba(255,122,89,0.3)"
                }}>
                  <span style={{ fontSize: 16, color: "#FF7A59" }}>➤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>


        {/* Ai Randevu Yönetimi */}
        <Link href="/ai-asistan/randevu" style={{ textDecoration: 'none' }}>
          <div className="glass" style={{ 
            borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(34,181,115,0.3)",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            background: "rgba(34,181,115,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, color: "#22B573" }}>📅</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#22B573" }}>Ai Randevu Yönetimi</span>
            </div>
            <span style={{ color: "#22B573", fontSize: 24, lineHeight: 1 }}>›</span>
          </div>
        </Link>

        {/* Ai İşletme Hizmetleri */}
        <Link href="/ai-asistan/isletme-hizmetleri" style={{ textDecoration: 'none' }}>
          <div className="glass" style={{ 
            borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,122,89,0.3)",
            display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            background: "rgba(255,122,89,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, color: "#FF7A59" }}>💼</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#FF7A59" }}>Ai İşletme Hizmetleri</span>
            </div>
            <span style={{ color: "#FF7A59", fontSize: 24, lineHeight: 1 }}>›</span>
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
