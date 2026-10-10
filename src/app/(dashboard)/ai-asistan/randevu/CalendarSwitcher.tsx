import React from 'react';
import { useTranslations } from 'next-intl';

type CalendarSwitcherProps = {
  activeCalendarId: string | null;
  calendars: any[];
  multiCalEnabled: boolean;
  selectedDate: string;
  setActiveCalendarId: React.Dispatch<React.SetStateAction<string | null>>;
  setAppointments: React.Dispatch<React.SetStateAction<any[]>>;
  setCalendars: React.Dispatch<React.SetStateAction<any[]>>;
  setIsManageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPromptConfig: React.Dispatch<React.SetStateAction<{ visible: boolean; title: string; placeholder: string; value: string; onSave: (val: string) => void; }>>;
  t: ReturnType<typeof useTranslations>;
};

export function CalendarSwitcher({ activeCalendarId, calendars, multiCalEnabled, selectedDate, setActiveCalendarId, setAppointments, setCalendars, setIsManageModalOpen, setPromptConfig, t }: CalendarSwitcherProps) {
  return (
    multiCalEnabled && (
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", paddingBottom: 8 }}>
        <button
          onClick={async () => {
            setActiveCalendarId(null);
            const { getAppointmentsByDate } = await import("@/actions/appointments");
            const res = await getAppointmentsByDate(selectedDate);
            if (res.data) setAppointments(res.data);
          }}
          style={{
            padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            background: activeCalendarId === null ? "#22B573" : "rgba(255,255,255,0.05)",
            color: activeCalendarId === null ? "#17151A" : "var(--text-secondary)",
            border: activeCalendarId === null ? "none" : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          {t("common.all")}
        </button>
        {calendars.map((cal: any) => (
          <button
            key={cal.id}
            onClick={async () => {
              setActiveCalendarId(cal.id);
              const { getAppointmentsByDate } = await import("@/actions/appointments");
              const res = await getAppointmentsByDate(selectedDate, cal.id);
              if (res.data) setAppointments(res.data);
            }}
            style={{
              padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              background: activeCalendarId === cal.id ? "#22B573" : "rgba(255,255,255,0.05)",
              color: activeCalendarId === cal.id ? "#17151A" : "var(--text-secondary)",
              border: activeCalendarId === cal.id ? "none" : "1px solid rgba(255,255,255,0.1)"
            }}
          >
            {cal.name}
          </button>
        ))}
        <button
            onClick={() => setIsManageModalOpen(true)}
            style={{
              padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px dashed #EF4444"
            }}
          >
            Düzenle
          </button>
          <button
            onClick={() => {
              setPromptConfig({
                visible: true,
                title: t("randevuPage.extra.newCalendarTitle"),
                placeholder: t("randevuPage.extra.newCalendarPlaceholder"),
                value: "",
                onSave: async (name: string) => {
                  if (name && name.trim()) {
                    const { createCalendar, getCalendars } = await import("@/actions/calendars");
                    await createCalendar(name.trim());
                    const updated = await getCalendars();
                    setCalendars(updated);
                  }
                }
              });
            }}
            style={{
              padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              background: "transparent", color: "#00c6ff", border: "1px dashed #00c6ff"
            }}
          >
            + Yeni Ekle
          </button>
      </div>
    )
  );
}
