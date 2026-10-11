import React from 'react';
import { createCalendarBlock, getDaySchedule } from '@/actions/appointments';
import { useTranslations } from 'next-intl';

type ReserveModalProps = {
  activeCalendarId: string | null;
  add30Mins: (t: string) => string;
  calendars: any[];
  isSaving: boolean;
  reserveConflicts: any[];
  reserveError: string;
  reserveModal: any;
  reserveNote: string;
  reserveReason: string;
  reserveScope: any;
  selectedDate: string;
  setDaySchedule: React.Dispatch<React.SetStateAction<any[]>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setReserveConflicts: React.Dispatch<React.SetStateAction<any[]>>;
  setReserveError: React.Dispatch<React.SetStateAction<string>>;
  setReserveModal: React.Dispatch<any>;
  setReserveNote: React.Dispatch<React.SetStateAction<string>>;
  setReserveReason: React.Dispatch<React.SetStateAction<string>>;
  setReserveScope: React.Dispatch<any>;
  t: ReturnType<typeof useTranslations>;
};

export function ReserveModal({ activeCalendarId, add30Mins, calendars, isSaving, reserveConflicts, reserveError, reserveModal, reserveNote, reserveReason, reserveScope, selectedDate, setDaySchedule, setIsSaving, setReserveConflicts, setReserveError, setReserveModal, setReserveNote, setReserveReason, setReserveScope, t }: ReserveModalProps) {
  return (
    reserveModal.visible && (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
    <div style={{ background: '#1c1b1d', border: '1px solid rgba(255,255,255,0.1)', padding: 24, borderRadius: 16, width: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <h3 style={{ color: '#fff', margin: 0 }}>{t('randevu.block.title')}</h3>
    
    {reserveError && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: 8, borderRadius: 6, fontSize: 13 }}>{reserveError}</div>}
    {reserveConflicts.length > 0 && (
      <div style={{ background: 'rgba(245,158,11,0.1)', padding: 12, borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
        <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>{t('randevu.block.conflicts')}</span>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {reserveConflicts.map((c: any) => (
            <div key={c.id} style={{ color: '#fff', fontSize: 12 }}>
              • {c.customer_name} · {c.local_time?.substring(0,5)} · {c.calendar_name}
            </div>
          ))}
        </div>
      </div>
    )}
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t("randevuPage.extra.scope")}</span>
      {activeCalendarId ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setReserveScope('doctor')} style={{ flex: 1, padding: 8, background: reserveScope === 'doctor' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{activeCalendarId ? calendars.find(c => c.id === activeCalendarId)?.name || t("randevuPage.extra.selectedDoctor") : t("randevuPage.extra.selectedDoctor")}</button>
          <button onClick={() => setReserveScope('clinic')} style={{ flex: 1, padding: 8, background: reserveScope === 'clinic' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{t("randevuPage.extra.wholeClinic")}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={reserveScope} onChange={e => setReserveScope(e.target.value)} style={{ flex: 1, padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }}>
            <option value="clinic">{t("randevuPage.extra.wholeClinic")}</option>
            {calendars.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
    </div>
    
    <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t("randevuPage.extra.start")}</span>
          <input type="time" step="1800" value={reserveModal.time} onChange={e => { const v = e.target.value; setReserveModal((p: any) => ({...p, time: v, endTime: p.endTime > v ? p.endTime : add30Mins(v)})); }} style={{ padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t("randevuPage.extra.end")}</span>
          <input type="time" step="1800" value={reserveModal.endTime} onChange={e => setReserveModal((p: any) => ({...p, endTime: e.target.value}))} style={{ padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
        </div>
    </div>
    
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => setReserveReason('meeting')} style={{ flex: 1, padding: 8, background: reserveReason === 'meeting' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{t('randevu.block.reasonMeeting')}</button>
      <button onClick={() => setReserveReason('leave')} style={{ flex: 1, padding: 8, background: reserveReason === 'leave' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{t('randevu.block.reasonLeave')}</button>
      <button onClick={() => setReserveReason('break')} style={{ flex: 1, padding: 8, background: reserveReason === 'break' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{t('randevu.block.reasonBreak')}</button>
      <button onClick={() => setReserveReason('other')} style={{ flex: 1, padding: 8, background: reserveReason === 'other' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{t('randevu.block.reasonOther')}</button>
    </div>
    <input value={reserveNote} onChange={e => setReserveNote(e.target.value)} placeholder={t('randevu.block.note')} style={{ padding: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
      <button onClick={() => setReserveModal({ visible: false, time: '', endTime: '' })} style={{ padding: '10px 16px', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>{t('common.cancel')}</button>
      <button disabled={isSaving} onClick={async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
          setReserveError(''); setReserveConflicts([]);
          const blockCalId = reserveScope === 'clinic' ? null : (activeCalendarId || reserveScope);
          const res = await createCalendarBlock(blockCalId, `${selectedDate}T${reserveModal.time}:00`, `${selectedDate}T${reserveModal.endTime}:00`, reserveReason, reserveNote);
          
          if (res.data?.status === 'SUCCESS') {
            setReserveModal({ visible: false, time: '', endTime: '' });
            const refreshed = await getDaySchedule(selectedDate, activeCalendarId || undefined);
            setDaySchedule(refreshed.data || []);
          } else if (res.data?.status === 'CONFLICTS_WITH_APPOINTMENTS') {
            setReserveConflicts(res.data.appointments || []);
          } else if (res.data?.status === 'INVALID_RANGE') {
            setReserveError(t('randevu.block.invalidRange'));
          } else if (res.data?.status === 'ALREADY_BLOCKED') {
            setReserveError(t('randevu.block.alreadyBlocked'));
          } else {
            setReserveError(t('musteriler.error'));
          }
        } finally {
          setIsSaving(false);
        }
      }} style={{ padding: '10px 16px', background: '#22B573', color: '#17151A', border: 'none', borderRadius: 8, fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>{t('randevu.block.save')}</button>
    </div>
    </div>
    </div>
    )
  );
}
