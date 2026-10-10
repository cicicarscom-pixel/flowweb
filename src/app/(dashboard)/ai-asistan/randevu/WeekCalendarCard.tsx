import React from 'react';
import { deleteCalendarBlock, getDaySchedule } from '@/actions/appointments';
import { useTranslations } from 'next-intl';
import type { DialogApi } from '../../../../components/ui/DialogProvider';

type WeekCalendarCardProps = {
  activeCalendarId: string | null;
  add30Mins: (t: string) => string;
  daySchedule: any[];
  dialog: DialogApi;
  selectedDate: string;
  setDaySchedule: React.Dispatch<React.SetStateAction<any[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuConfig: React.Dispatch<any>;
  setNewAppt: React.Dispatch<React.SetStateAction<{ name: string; phone: string; time: string; service: string; calendar_id: string; note: string; }>>;
  setReserveConflicts: React.Dispatch<React.SetStateAction<any[]>>;
  setReserveDurationType: React.Dispatch<any>;
  setReserveError: React.Dispatch<React.SetStateAction<string>>;
  setReserveModal: React.Dispatch<any>;
  setReserveScope: React.Dispatch<any>;
  t: ReturnType<typeof useTranslations>;
};

export function WeekCalendarCard({ activeCalendarId, add30Mins, daySchedule, dialog, selectedDate, setDaySchedule, setIsModalOpen, setMenuConfig, setNewAppt, setReserveConflicts, setReserveDurationType, setReserveError, setReserveModal, setReserveScope, t }: WeekCalendarCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="glass" style={{ borderRadius: 24, padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{t('randevuPage.heatmap.title')}</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>{t('randevuPage.heatmap.legendBusy')}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "transparent", border: "1px solid var(--text-secondary)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>{t('randevuPage.heatmap.legendFree')}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const firstFree = daySchedule.find(s => s.status === 'free');
            const start = firstFree?.local_time || '09:00';
            setReserveModal({ visible: true, time: start, endTime: add30Mins(start) });
            setReserveError('');
            setReserveConflicts([]);
            setReserveDurationType('range');
            setReserveScope(activeCalendarId ? 'doctor' : 'clinic');
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          {t('randevu.block.reserveButton')}
        </button>
    
        
        {/* Heatmap Grid */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {/* Row Labels */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.morning')}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.noon')}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.evening')}</span>
          </div>
          
          <div className="hide-scroll" style={{ flex: 1, overflowX: "auto", paddingBottom: 6, overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {(() => {
                const uniqueTimes = Array.from(new Set(daySchedule.map(s => s.local_time))).sort();
                const morningSlots = uniqueTimes.filter(t => t < '13:00' && t >= '00:01');
                const noonSlots = uniqueTimes.filter(t => t >= '13:00' && t < '18:30');
                const eveningSlots = uniqueTimes.filter(t => t >= '18:30' || t === '00:00');
                const maxCols = Math.max(morningSlots.length, noonSlots.length, eveningSlots.length);
                
                return Array.from({ length: maxCols }).map((_, col) => (
                  <div key={col} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[0, 1, 2].map(row => {
                      const slotTime = row === 0 ? morningSlots[col] : row === 1 ? noonSlots[col] : eveningSlots[col];
                      if (!slotTime) return <div key={row} style={{ width: 48, height: 40 }} />;
                      
                      const slots = daySchedule.filter(s => s.local_time === slotTime);
                      let status = 'free';
                      const badge: string | null = null;
                      let bId = '', bReason = '', bNote = '';
    
                      if (activeCalendarId) {
                        status = slots[0]?.status || 'free';
                        bId = slots[0]?.block_id; bReason = slots[0]?.block_reason; bNote = slots[0]?.block_note;
                      } else {
                        if (slots.some(s => s.status === 'booked')) status = 'booked';
                          else if (slots.every(s => s.status === 'blocked')) status = 'blocked';
                          else if (slots.some(s => s.status === 'free')) status = 'free';
                          else if (slots.every(s => s.status === 'past')) status = 'past';
                          else status = 'booked';
                        
                        const blockedSlot = slots.find(s => s.status === 'blocked');
                        if (blockedSlot) { bId = blockedSlot.block_id; bReason = blockedSlot.block_reason; bNote = blockedSlot.block_note; }
                      }
    
    
                      let bg = "rgba(255,255,255,0.03)", border = "1px solid rgba(255,255,255,0.06)", color = "var(--text-secondary)", opacity = 1;
                      if (status === 'booked') { bg = "#22B573"; border = "none"; color = "#17151A"; }
                      else if (status === 'blocked') { bg = "rgba(255,255,255,0.05)"; border = "1px dashed rgba(255,255,255,0.3)"; color = "var(--text-secondary)"; }
                      else if (status === 'past') { opacity = 0.3; }
    
                      return (
                        <button
                          key={row}
                          onClick={(e) => {
                            if (status === 'free' || (status === 'booked' && !activeCalendarId)) {
                              // Boş saate tıklamak doğrudan "Yeni Randevu" formunu açar (saat seçili gelir).
                              setNewAppt(prev => ({ ...prev, time: slotTime, calendar_id: activeCalendarId || prev.calendar_id }));
                              setIsModalOpen(true);
                            } else if (status === 'blocked') {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuConfig({
                                visible: true,
                                x: rect.left,
                                y: rect.bottom,
                                options: [
                                  { label: `${bReason}${bNote ? ' - ' + bNote : ''}`, onClick: () => {} },
                                  { label: t('randevu.block.removeReservation'), onClick: async () => {
                                      const res = await deleteCalendarBlock(bId);
                                        if (res.error || res.data?.status !== 'SUCCESS') dialog.alert(t('musteriler.error'));
                                        else {
                                          const refreshed = await getDaySchedule(selectedDate, activeCalendarId || undefined);
                                          setDaySchedule(refreshed.data || []);
                                        }
                                  }, destructive: true }
                                ]
                              });
                            } else if (status === 'past') {
                              dialog.alert(t('randevu.block.slotPast'));
                            }
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          style={{
                            position: "relative",
                            width: 52, minWidth: 52, flexShrink: 0, height: 40, borderRadius: 8, padding: 0,
                            background: bg,
                            border: border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: status !== 'free' ? "0 0 10px rgba(34,181,115,0.3)" : "none",
                            cursor: "pointer", transition: "all 0.2s", opacity
                          }}
                        >
                          {status === 'blocked' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                                  <span style={{ fontSize: 12, fontWeight: 800, color }}>{slotTime}</span>
                                  <span style={{ fontSize: 10, fontWeight: 500, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {bReason === 'meeting' ? t('randevu.block.reasonMeeting') : bReason === 'leave' ? t('randevu.block.reasonLeave') : bReason === 'break' ? t('randevu.block.reasonBreak') : t('randevu.block.reasonOther')}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ fontSize: 12, fontWeight: 800, color, textAlign: 'center', lineHeight: 1 }}>{slotTime}</span>
                              )}
                          {badge && (
                            <div style={{ position: 'absolute', top: -4, right: -4, background: '#22B573', padding: '2px 4px', borderRadius: 4, fontSize: 8, color: '#fff', fontWeight: 'bold' }}>
                              {badge}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: 24, padding: "16px", background: "rgba(255,122,89,0.05)", borderRadius: 16, border: "1px dashed rgba(255,122,89,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>
            {t('randevuPage.heatmap.tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
