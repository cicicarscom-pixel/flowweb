import React from 'react';
import { useTranslations } from 'next-intl';

type AppointmentTimelineProps = {
  CARD_COLORS: { bg: string; border: string; text: string; icon: string; }[];
  actionMenuId: string | null;
  appointments: any[];
  calendars: any[];
  getServiceName: (serviceId: string) => any;
  multiCalEnabled: boolean;
  selectedDate: string;
  setActionMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  setCancelModalId: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteModalId: React.Dispatch<React.SetStateAction<string | null>>;
  t: ReturnType<typeof useTranslations>;
};

export function AppointmentTimeline({ CARD_COLORS, actionMenuId, appointments, calendars, getServiceName, multiCalEnabled, selectedDate, setActionMenuId, setCancelModalId, setDeleteModalId, t }: AppointmentTimelineProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>{t('randevuPage.timeline.title', { date: selectedDate.split('-').reverse().join('.') })}</h3>
    
      {appointments.length === 0 ? (
        <div className="glass" style={{ borderRadius: 24, padding: "40px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 48, filter: "grayscale(1) opacity(0.5)" }}>😴</span>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, marginTop: 16 }}>{t('randevuPage.timeline.empty')}</p>
        </div>
      ) : (
        appointments.map((appt: any, i: number) => {
          const palette = CARD_COLORS[i % CARD_COLORS.length];
          const d = appt.date || '';
          const rawTime = d.includes('T') ? d.split('T')[1] : d.split(' ')[1] || '';
          const timeStr = appt.starts_at ? new Date(appt.starts_at).toLocaleTimeString('tr-TR', { hour: "2-digit", minute: "2-digit", timeZone: appt.timezone ?? "Europe/Istanbul" }) : rawTime.substring(0, 5);
          const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : (appt.service_id ? getServiceName(appt.service_id) : null);
    
          return (
            <div key={appt.id} style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44, paddingTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: palette.text }}>{timeStr}</span>
                <div style={{ flex: 1, width: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginTop: 8 }} />
              </div>
              
              <div className="glass" style={{ 
                flex: 1, borderRadius: 20, padding: 16,
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${palette.border}`, borderLeft: `6px solid ${appt.status === 'Cancelled' ? '#666' : palette.text}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "transform 0.2s", cursor: "pointer",
                opacity: appt.status === 'Cancelled' ? 0.5 : 1
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {palette.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>{appt.customer_name || t('randevuPage.timeline.unnamedCustomer')}</h4>
                    <div style={{ display: "flex", gap: 8 }}>
                      {svcName && (<span style={{ fontSize: 12, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{svcName}</span>)}
                      {appt.customer_request_raw && (
                          <span style={{ fontSize: 12, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                            📝 {appt.customer_request_raw}
                          </span>
                        )}
                        {multiCalEnabled && appt.calendar_id && (
                        <span style={{ fontSize: 12, color: "#22B573", background: "rgba(34,181,115,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                          {calendars.find((c: any) => c.id === appt.calendar_id)?.name || "Takvim"}
                          </span>
                        )}
                        {appt.status === 'Cancelled' && (
                          <span style={{ fontSize: 12, color: "#9ca3af", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                            {t('randevuPage.actions.cancelledBadge')}
                          </span>
                        )}
                        {appt.status === 'Cancelled' && appt.cancel_reason && (
                          <span style={{ fontSize: 12, color: "#9ca3af", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>
                            {t('randevuPage.actions.reasonBadge')}{appt.cancel_reason}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <button onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === appt.id ? null : appt.id); }} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8 }}>
                    <span style={{ fontSize: 18 }}>⋮</span>
                  </button>
                  {actionMenuId === appt.id && (
                    <div style={{ position: "absolute", top: 40, right: 0, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 8, zIndex: 10, width: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                      {appt.status !== 'Cancelled' && (
                        <button onClick={(e) => { e.stopPropagation(); setActionMenuId(null); setCancelModalId(appt.id); }} style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", borderRadius: 8 }}>
                          {t('randevuPage.actions.cancel')}
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setActionMenuId(null); setDeleteModalId(appt.id); }} style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", color: "#EF4444", textAlign: "left", cursor: "pointer", borderRadius: 8 }}>
                        {t('randevuPage.actions.delete')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
