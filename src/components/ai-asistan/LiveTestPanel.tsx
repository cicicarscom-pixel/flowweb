"use client";

// Canlı Test (Live Test) chat box — extracted verbatim from page.tsx.
// Purely presentational: page.tsx owns messages/isTyping/inputValue state and
// the actual persona-test call (handleSendMessage), since that call needs
// the currently selected role/persona/tone/dials which live at the page level.
export interface ChatMessage {
  role: string;
  content: string;
}

interface LiveTestPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isSimulationActive: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  onInputFocus: () => void;
  onSend: () => void;
  onReset: () => void;
}

export default function LiveTestPanel({
  messages,
  isTyping,
  isSimulationActive,
  inputValue,
  onInputChange,
  onInputFocus,
  onSend,
  onReset,
}: LiveTestPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="glass"
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 500,
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Canlı Test</span>
          </div>
          <div
            onClick={onReset}
            style={{ cursor: "pointer", opacity: 0.6, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
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
                <span
                  style={{
                    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em", border: "1px solid rgba(255,255,255,0.05)",
                    padding: "4px 12px", borderRadius: 99,
                  }}
                >
                  SİMÜLASYON BAŞLADI
                </span>
              </div>

              {messages.map((msg, idx) =>
                msg.role === "user" ? (
                  <div key={idx} style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)", borderRadius: "16px 16px 2px 16px",
                        padding: "12px 16px", color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.5,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={idx} style={{ alignSelf: "flex-start", maxWidth: "90%" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px 16px 16px 2px", padding: "14px 16px",
                        color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ),
              )}

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
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Asistan ile konuşun..."
              onFocus={onInputFocus}
              style={{
                width: "100%", padding: "14px 48px 14px 20px", borderRadius: 99,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <div
              onClick={onSend}
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                width: 36, height: 36, borderRadius: "50%", background: "rgba(255,122,89,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                border: "1px solid rgba(255,122,89,0.3)",
              }}
            >
              <span style={{ fontSize: 16, color: "#FF7A59" }}>➤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
