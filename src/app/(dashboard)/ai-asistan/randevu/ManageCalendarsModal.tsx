import React from 'react';
import { useTranslations } from 'next-intl';
import type { DialogApi } from '../../../../components/ui/DialogProvider';

type ManageCalendarsModalProps = {
  calendars: any[];
  dialog: DialogApi;
  isManageModalOpen: boolean;
  setCalendars: React.Dispatch<React.SetStateAction<any[]>>;
  setIsManageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPromptConfig: React.Dispatch<React.SetStateAction<{ visible: boolean; title: string; placeholder: string; value: string; onSave: (val: string) => void; }>>;
  t: ReturnType<typeof useTranslations>;
};

export function ManageCalendarsModal({ calendars, dialog, isManageModalOpen, setCalendars, setIsManageModalOpen, setPromptConfig, t }: ManageCalendarsModalProps) {
  return (
    isManageModalOpen && (
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
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{t("randevuPage.extra.manageTitle")}</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>{t("randevuPage.extra.manageSub")}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto" }}>
            {calendars.length === 0 && (
              <div style={{ color: "#756D66", fontSize: 14, textAlign: "center", padding: "20px 0" }}>{t("randevuPage.extra.noCalendars")}</div>
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
                        title: t("randevuPage.extra.editCalendarTitle"),
                        placeholder: t("randevuPage.extra.editCalendarPlaceholder"),
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
                      if ((await dialog.confirm(t("randevuPage.extra.confirmDelete", { name: cal.name }), { danger: true }))) {
                        const { createClient } = await import("@/lib/supabase/client");
                        const client = createClient();
                        const { data } = await client.from("calendars").update({ is_active: false }).eq("id", cal.id).select();
                        if (!data || data.length === 0) dialog.alert(t("randevuPage.extra.noDeletePermission"));
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
    )
  );
}
