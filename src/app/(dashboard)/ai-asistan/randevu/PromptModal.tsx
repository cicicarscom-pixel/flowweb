import React from 'react';

type PromptModalProps = {
  promptConfig: { visible: boolean; title: string; placeholder: string; value: string; onSave: (val: string) => void; };
  setPromptConfig: React.Dispatch<React.SetStateAction<{ visible: boolean; title: string; placeholder: string; value: string; onSave: (val: string) => void; }>>;
};

export function PromptModal({ promptConfig, setPromptConfig }: PromptModalProps) {
  return (
    promptConfig.visible && (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        animation: "fadeIn 0.2s ease"
      }}>
        <div className="glass" style={{
          width: 400, borderRadius: 24, padding: 32, position: "relative",
          border: "1px solid rgba(255,255,255,0.1)", background: "#201D24",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)"
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 20px 0" }}>{promptConfig.title}</h2>
          <input 
            type="text" 
            autoFocus
            value={promptConfig.value}
            onChange={(e) => setPromptConfig({...promptConfig, value: e.target.value})}
            placeholder={promptConfig.placeholder}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 14 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <button 
              onClick={() => setPromptConfig({...promptConfig, visible: false})}
              style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "10px 16px" }}
            >
              İptal
            </button>
            <button 
              onClick={() => {
                promptConfig.onSave(promptConfig.value);
                setPromptConfig({...promptConfig, visible: false});
              }}
              style={{ background: "#22B573", border: "none", color: "#17151A", fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "10px 24px", borderRadius: 8 }}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    )
  );
}
