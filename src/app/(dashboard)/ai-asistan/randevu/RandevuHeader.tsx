import React from 'react';
import { useTranslations } from 'next-intl';

type RandevuHeaderProps = {
  handleNextMonth: () => void;
  handlePrevMonth: () => void;
  monthYearStr: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: ReturnType<typeof useTranslations>;
};

export function RandevuHeader({ handleNextMonth, handlePrevMonth, monthYearStr, setIsModalOpen, t }: RandevuHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(34,181,115,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(34,181,115,0.3)" }}>
          <span style={{ fontSize: 20 }}>📅</span>
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>{t('randevuPage.header.title')}</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, marginTop: 4 }}>{t('randevuPage.header.subtitle')}</p>
        </div>
      </div>
    
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 16px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handlePrevMonth} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18, padding: 4 }}>&lsaquo;</button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", minWidth: 90, textAlign: "center" }}>{monthYearStr}</span>
          <button onClick={handleNextMonth} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 18, padding: 4 }}>&rsaquo;</button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: "linear-gradient(135deg, #22B573, #00c6ff)", 
            border: "none", borderRadius: 99, padding: "10px 20px", 
            color: "#17151A", fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 0 20px rgba(34,181,115,0.4)",
            display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <span>+</span> {t('randevuPage.header.addAppointmentButton')}
        </button>
      </div>
    </div>
  );
}
