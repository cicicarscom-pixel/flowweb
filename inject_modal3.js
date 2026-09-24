import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

const modals = `

      {/* Manage Calendars Modal */}
      {isManageModalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
          animation: "fadeIn 0.2s ease"
        }}>
          <div className="glass" style={{
            width: 440, borderRadius: 32, padding: 32, position: "relative",
            border: "1px solid rgba(255,255,255,0.1)", background: "#201D24",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <button 
              onClick={() => setIsManageModalOpen(false)}
              style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Takvim / Personel Yönetimi</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Personellerinizi düzenleyin veya silin.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto" }}>
              {calendars.length === 0 && (
                <div style={{ color: "#756D66", fontSize: 14, textAlign: "center", padding: "20px 0" }}>Henüz takvim eklenmemiş.</div>
              )}
              {calendars.map((cal: any) => (
                <div key={cal.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#fff", fontSize: 15, fontWeight: 500 }}>{cal.name}</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button 
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#22B573" }}
                      onClick={() => {
                        setPromptConfig({
                          visible: true,
                          title: "Takvimi Düzenle",
                          placeholder: "Yeni takvim adı",
                          value: cal.name,
                          onSave: async (newName: string) => {
                            if (newName && newName.trim()) {
                              const { updateCalendar, getCalendars } = await import("@/actions/calendars");
                              await updateCalendar(cal.id, { name: newName.trim() });
                              const updated = await getCalendars();
                              setCalendars(updated);
                            }
                          }
                        });
                      }}
                    >
                      ✎
                    </button>
                    <button 
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#EF4444" }}
                      onClick={async () => {
                        if (confirm(\`'\${cal.name}' silinecek. Emin misiniz?\`)) {
                          const { supabase } = await import("@/shared");
                          const client = await supabase();
                          await client.from("calendars").delete().eq("id", cal.id);
                          const { getCalendars } = await import("@/actions/calendars");
                          const updated = await getCalendars();
                          setCalendars(updated);
                        }
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Modal */}
      {promptConfig.visible && (
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
      )}

      <style dangerouslySetInnerHTML={{__html: \``;

if (!content.includes('Manage Calendars Modal')) {
    content = content.replace('<style dangerouslySetInnerHTML={{__html: `', modals);
    fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
    console.log("Injected modal successfully!");
}
