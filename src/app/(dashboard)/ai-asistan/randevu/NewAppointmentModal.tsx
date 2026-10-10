import React from 'react';
import { useTranslations } from 'next-intl';

type NewAppointmentModalProps = {
  availableSlots: any[];
  calendars: any[];
  handleSave: () => Promise<void>;
  isModalOpen: boolean;
  isSaving: boolean;
  newAppt: { name: string; phone: string; time: string; service: string; calendar_id: string; note: string; };
  selectedDate: string;
  services: any[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewAppt: React.Dispatch<React.SetStateAction<{ name: string; phone: string; time: string; service: string; calendar_id: string; note: string; }>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
};

export function NewAppointmentModal({ availableSlots, calendars, handleSave, isModalOpen, isSaving, newAppt, selectedDate, services, setIsModalOpen, setNewAppt, setSelectedDate, t }: NewAppointmentModalProps) {
  return (
    isModalOpen && (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
        animation: "fadeIn 0.2s ease"
      }}>
        <div className="glass" style={{
            width: 440, maxHeight: "90vh", overflowY: "auto", borderRadius: 32, padding: 32, position: "relative",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: "scale(0.75)"
          }}>
          <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, zIndex: 10, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,181,115,0.2), rgba(0,198,255,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 12 }}>
              🪄
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{t('randevuPage.modal.title')}</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>{t('randevuPage.modal.subtitle')}</p>
          </div>
    
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t("randevuPage.extra.date")}</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, marginBottom: 16 }} /></div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t('randevuPage.modal.customerNameLabel')}</label>
              <input
                type="text"
                value={newAppt.name}
                onChange={e => setNewAppt({...newAppt, name: e.target.value})}
                placeholder={t('randevuPage.modal.customerNamePlaceholder')}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t('randevuPage.modal.phoneLabel')}</label>
              <input 
                type="text" 
                value={newAppt.phone}
                onChange={e => setNewAppt({...newAppt, phone: e.target.value})}
                placeholder="+90 555 123 4567"
                style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
              />
            </div>
    
            
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t("randevuPage.extra.selectCalendar")}</label>
                <select
                  value={newAppt.calendar_id}
                  onChange={e => setNewAppt({...newAppt, calendar_id: e.target.value})}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, marginBottom: 16 }}
                >
                  <option value="">{t("randevuPage.extra.choose")}</option>
                  {calendars.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
    <div style={{ display: "flex", gap: 16 }}>
              {services.length > 0 && (
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t('randevuPage.modal.serviceTypeLabel')}</label>
                <select
                  value={newAppt.service}
                  onChange={e => setNewAppt({...newAppt, service: e.target.value, time: ''})}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                >
                  <option value="">{t('randevuPage.modal.selectPlaceholder')}</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t('randevuPage.modal.timeLabel')}</label>
                <select
                  value={newAppt.time}
                  onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                  
                >
                  <option value="">{t('randevuPage.modal.selectTimePlaceholder')}</option>
                  {availableSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t("randevuPage.extra.noteLabel")}</label>
                <textarea
                  value={newAppt.note}
                  onChange={e => setNewAppt({...newAppt, note: e.target.value})}
                  placeholder={t("randevuPage.extra.notePlaceholder")}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, minHeight: 80, resize: "vertical" }}
                />
            </div>
    
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                width: "100%", padding: "16px", borderRadius: 16, marginTop: 8,
                background: isSaving ? "rgba(34,181,115,0.5)" : "#22B573",
                color: "#17151A", fontWeight: 700, fontSize: 15, border: "none",
                cursor: isSaving ? "default" : "pointer",
                boxShadow: "0 8px 16px rgba(34,181,115,0.2)",
                transition: "transform 0.2s"
              }}
            >
              {isSaving ? t('randevuPage.modal.saving') : t('randevuPage.modal.submitButton')}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
