"use client";

// Legacy "İleri Seviye Ayarlar" accordion — extracted verbatim from page.tsx.
// Read-only display of bot_settings.system_prompt (Phase 5's legacy fallback,
// see fetchSettings in page.tsx); this screen has never written to it since
// Phase 5 and Phase 6 doesn't change that.
interface AdvancedPersonaSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  systemPrompt: string;
}

export default function AdvancedPersonaSettings({ isOpen, onToggle, systemPrompt }: AdvancedPersonaSettingsProps) {
  return (
    <>
      <div
        onClick={onToggle}
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
          <span style={{ color: "#FF7A59", fontWeight: "bold", fontSize: 18 }}>{"</>"}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>İleri Seviye Ayarlar</span>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <span style={{ color: "#fff", fontSize: 20 }}>⚙️</span>
        </div>
      </div>

      {isOpen && (
        <div style={{ position: "relative", marginTop: -8, animation: "fadeIn 0.3s ease" }}>
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 22,
              background: "radial-gradient(ellipse at 50% 0%, rgba(255,122,89,0.25) 0%, transparent 70%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          <div
            className="glass"
            style={{
              borderRadius: 20,
              padding: "22px",
              position: "relative",
              border: "1.5px solid rgba(255,122,89,0.5)",
              boxShadow: "0 0 40px rgba(255,122,89,0.1), inset 0 0 20px rgba(255,122,89,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 12, color: "#FF7A59", fontWeight: 600, letterSpacing: "0.08em", fontFamily: "JetBrains Mono, monospace" }}>
                SİSTEM TALİMATI · BAĞLAM PENCERESI
              </p>
              <span style={{ fontSize: 11, color: "rgba(255,122,89,0.6)", fontFamily: "JetBrains Mono, monospace" }}>
                {systemPrompt.length} token
              </span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10, lineHeight: 1.5 }}>
              Bu alan artık kaydedilmiyor — yukarıdaki Karakter/Ton/Rol seçimleri ve &quot;Asistan Talimatı
              Oluştur&quot; kutusu kullanılıyor. Burada gördüğünüz metin, hiç persona seçmemiş eski hesaplar için
              hâlâ geçerli olan önceki yapılandırmanızın salt okunur bir yansımasıdır.
            </p>
            <textarea
              value={systemPrompt}
              readOnly
              style={{
                width: "100%",
                minHeight: 200,
                background: "rgba(255,122,89,0.04)",
                border: "1px solid rgba(255,122,89,0.15)",
                borderRadius: 12,
                padding: "14px",
                color: "rgba(255,255,255,0.55)",
                fontSize: 13,
                lineHeight: 1.7,
                resize: "vertical",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                cursor: "default",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
