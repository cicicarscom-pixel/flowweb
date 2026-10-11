"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAppointmentsByDate, getAvailableSlots, createAppointment, cancelAppointment, deleteAppointment, getDaySchedule } from '@/actions/appointments';
import { dateFromYmd } from '@/lib/dates';
import { useDialog } from "@/components/ui/DialogProvider";
import { RandevuHeader } from './RandevuHeader';
import { CalendarSwitcher } from './CalendarSwitcher';
import { WeekCalendarCard } from './WeekCalendarCard';
import { AppointmentTimeline } from './AppointmentTimeline';
import { NewAppointmentModal } from './NewAppointmentModal';
import { ReserveModal } from './ReserveModal';
import { ManageCalendarsModal } from './ManageCalendarsModal';
import { PromptModal } from './PromptModal';
import { ContextMenu } from './ContextMenu';

const CARD_COLORS = [
  { bg: 'rgba(34,181,115,0.1)', border: 'rgba(34,181,115,0.3)', text: '#22B573', icon: '✂️' },
  { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', icon: '✨' },
  { bg: 'rgba(192,193,255,0.1)', border: 'rgba(192,193,255,0.3)', text: '#c0c1ff', icon: '🌿' },
  { bg: 'rgba(255,122,89,0.1)', border: 'rgba(255,122,89,0.3)', text: '#FF7A59', icon: '🖌️' },
];

function ScrollableContainer({ children, innerRef }: { children: React.ReactNode, innerRef?: React.RefObject<HTMLDivElement | null> }) {
  const localRef = useRef<HTMLDivElement>(null);
  const containerRef = innerRef || localRef;
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      

      
        <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div 
        ref={containerRef}
        className="hide-scroll"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          display: "flex", overflowX: "auto", gap: 12, paddingBottom: 8, paddingLeft: 10, paddingRight: 10, 
          cursor: isDown ? "grabbing" : "grab",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
          userSelect: "none"
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function RandevuClient({ initialAppointments, services, orgId, today, initialCalendars, multiCalendarEnabled }: { initialAppointments: any[], services: any[], orgId: string | null, today: string, initialCalendars?: any[], multiCalendarEnabled?: boolean }) {
  const [multiCalEnabled, setMultiCalEnabled] = useState(multiCalendarEnabled || false);
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [calendars, setCalendars] = useState(initialCalendars || []);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState<{ visible: boolean; title: string; placeholder: string; value: string; onSave: (val: string) => void }>({ visible: false, title: "", placeholder: "", value: "", onSave: () => {} });
  const t = useTranslations();
  const dialog = useDialog();
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!orgId) return;
    const sub = supabase.channel("org_changes_randevu")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "organizations", filter: `id=eq.${orgId}` }, (payload) => {
        if (payload.new && typeof payload.new.multi_calendar_enabled === "boolean") {
          setMultiCalEnabled(payload.new.multi_calendar_enabled);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [supabase, orgId]);

  const initialDateFromParam = () => {
    const p = searchParams.get("date");
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) {
      return p;
    }
    return today;
  };
  
  const [selectedDate, setSelectedDate] = useState(initialDateFromParam);
  const [currentDate, setCurrentDate] = useState(() => dateFromYmd(initialDateFromParam()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const [daySchedule, setDaySchedule] = useState<any[]>([]);
  const [reserveModal, setReserveModal] = useState<any>({ visible: false, time: '', endTime: '' });
  const [reserveScope, setReserveScope] = useState<any>('clinic');
  const [reserveReason, setReserveReason] = useState('meeting');
  const [reserveNote, setReserveNote] = useState('');
  const [reserveError, setReserveError] = useState('');
  const [reserveConflicts, setReserveConflicts] = useState<any[]>([]);

  const add30Mins = (t: string) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const d = new Date(); d.setHours(h, m + 30, 0);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    getDaySchedule(selectedDate, activeCalendarId || undefined).then(res => {
      setDaySchedule(res.data || []);
    });
  }, [selectedDate, activeCalendarId, appointments]);
  
  const selectedDayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const param = searchParams.get("date");
    if (!param || !/^\d{4}-\d{2}-\d{2}$/.test(param)) return;
    setCurrentDate(dateFromYmd(param));
    setSelectedDate(param);
  }, [searchParams]);

  useEffect(() => {
    const d = dateFromYmd(selectedDate);
    setCurrentDate(prev => {
      if (d.getMonth() !== prev.getMonth() || d.getFullYear() !== prev.getFullYear()) {
        return d;
      }
      return prev;
    });
  }, [selectedDate]);

  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedDayRef.current && stripRef.current) {
      requestAnimationFrame(() => {
        if (!selectedDayRef.current || !stripRef.current) return;
        const container = stripRef.current;
        const target = selectedDayRef.current;
        const containerCenter = container.offsetWidth / 2;
        const targetCenter = target.offsetLeft + target.offsetWidth / 2;
        container.scrollTo({
          left: targetCenter - containerCenter,
          behavior: "smooth"
        });
      });
    }
  }, [selectedDate, currentDate]);

  
  const [newAppt, setNewAppt] = useState({ name: '', phone: '', time: '', service: '', calendar_id: '', note: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [menuConfig, setMenuConfig] = useState<any>({ visible: false, x: 0, y: 0, options: [] });

  // Close menus on click outside
  useEffect(() => {
    const handleGlobalClick = () => setActionMenuId(null);
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setActionMenuId(null); };
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleCancelAppointment = async (id: string, reason: string) => {
    setIsActionLoading(true);
    const { data, error } = await cancelAppointment(id, reason);
    setIsActionLoading(false);
    
    if (error || data?.status === 'UNAUTHORIZED') {
      dialog.alert(t('randevuPage.actions.genericError'));
    } else if (data?.status === 'ALREADY_CANCELLED') {
      dialog.alert(t('randevuPage.actions.alreadyCancelled'));
    } else if (data?.status === 'NOT_FOUND') {
      dialog.alert(t('randevuPage.actions.notFound'));
    }
    
    setCancelModalId(null);
    setCancelReason("");
    if (data?.status === 'SUCCESS') dialog.alert(t('randevuPage.actions.cancelSuccess'));
    
    const refresh = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
    setAppointments(refresh.data);
  };

  const handleDeleteAppointment = async (id: string) => {
    setIsActionLoading(true);
    const { data, error } = await deleteAppointment(id);
    setIsActionLoading(false);
    
    if (error || data?.status === 'UNAUTHORIZED') {
      dialog.alert(t('randevuPage.actions.genericError'));
    } else if (data?.status === 'NOT_FOUND') {
      dialog.alert(t('randevuPage.actions.notFound'));
    }
    
    setDeleteModalId(null);
    if (data?.status === 'SUCCESS') dialog.alert(t('randevuPage.actions.deleteSuccess'));
    
    const refresh = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
    setAppointments(refresh.data);
  };


  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`appointments-${orgId}-${selectedDate}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `org_id=eq.${orgId}`,
        },
        async () => {
          const { data } = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
          setAppointments(data);
          const sched = await getDaySchedule(selectedDate, activeCalendarId || undefined);
          setDaySchedule(sched.data || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, orgId, supabase, activeCalendarId]);

    // Load appointments when selected date or active calendar changes
  useEffect(() => {
    let mounted = true;
    async function loadDate() {
      const { data } = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
      if (mounted) setAppointments(data || []);
    }
    loadDate();
    return () => { mounted = false; };
  }, [selectedDate, activeCalendarId]);

  // Load available slots when service changes in modal
  useEffect(() => {
    if (isModalOpen) {
      getAvailableSlots(selectedDate, newAppt.service).then(res => {
        if (res.data) setAvailableSlots(res.data);
      });
    }
  }, [isModalOpen, newAppt.service, selectedDate]);

  const dynamicDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    const days = [];
    const trDays = [
      t('randevuPage.calendar.days.sun'),
      t('randevuPage.calendar.days.mon'),
      t('randevuPage.calendar.days.tue'),
      t('randevuPage.calendar.days.wed'),
      t('randevuPage.calendar.days.thu'),
      t('randevuPage.calendar.days.fri'),
      t('randevuPage.calendar.days.sat'),
    ];

    for (let i = 1; i <= numDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        name: trDays[d.getDay()],
        date: String(i).padStart(2, '0'),
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    return days;
  }, [currentDate, t]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = [
    t('randevuPage.calendar.months.jan'),
    t('randevuPage.calendar.months.feb'),
    t('randevuPage.calendar.months.mar'),
    t('randevuPage.calendar.months.apr'),
    t('randevuPage.calendar.months.may'),
    t('randevuPage.calendar.months.jun'),
    t('randevuPage.calendar.months.jul'),
    t('randevuPage.calendar.months.aug'),
    t('randevuPage.calendar.months.sep'),
    t('randevuPage.calendar.months.oct'),
    t('randevuPage.calendar.months.nov'),
    t('randevuPage.calendar.months.dec'),
  ];
  const monthYearStr = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const handleSave = async () => {
    if (!newAppt.time || !newAppt.phone) {
      dialog.alert(t('randevuPage.alerts.missingFields'));
      return;
    }
    setIsSaving(true);
    const dateStr = `${selectedDate}T${newAppt.time}:00`;
    
    const res = await createAppointment({
      customerName: newAppt.name,
      customerPhone: newAppt.phone,
      serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null, note: newAppt.note,
      date: dateStr
    });
    
    if (res.error) {
      dialog.alert(t('randevuPage.alerts.saveFailed', { error: res.error }));
      setIsSaving(false);
      return;
    }
    
    const { data } = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
    setAppointments(data);
    
    setIsModalOpen(false);
    setNewAppt({ name: '', phone: '', time: '', service: '', calendar_id: '', note: '' });
    setIsSaving(false);
  };

  const getServiceName = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    return s ? s.name : null;
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
      {/* Header */}
      <RandevuHeader handleNextMonth={handleNextMonth} handlePrevMonth={handlePrevMonth} monthYearStr={monthYearStr} setIsModalOpen={setIsModalOpen} t={t} />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Multi-Calendar Chip Bar (Phase 3) */}
        <CalendarSwitcher activeCalendarId={activeCalendarId} calendars={calendars} multiCalEnabled={multiCalEnabled} selectedDate={selectedDate} setActiveCalendarId={setActiveCalendarId} setAppointments={setAppointments} setCalendars={setCalendars} setIsManageModalOpen={setIsManageModalOpen} setPromptConfig={setPromptConfig} t={t} />

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Calendar Strip */}
          <div style={{ position: "relative" }}>
            <ScrollableContainer innerRef={stripRef}>
              {dynamicDays.map((day, i) => {
                const isActive = selectedDate === day.fullDate;
                                  return (
                    <div 
                      key={i} 
                      ref={(el) => { if (isActive) selectedDayRef.current = el; }}
                      onClick={() => setSelectedDate(day.fullDate)}
                    style={{ 
                      minWidth: 64, height: 80, borderRadius: 20,
                      background: isActive ? "linear-gradient(135deg, #22B573 0%, #00c6ff 100%)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "none" : "1px solid rgba(255,255,255,0.05)",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: isActive ? "0 8px 16px rgba(34,181,115,0.3)" : "none",
                      transform: isActive ? "translateY(-4px)" : "none"
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#17151A" : "var(--text-secondary)", marginBottom: 4 }}>{day.name}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: isActive ? "#17151A" : "#fff" }}>{day.date}</span>
                  </div>
                );
              })}
            </ScrollableContainer>
          </div>

          {/* Right Column (Heatmap) */}
        <WeekCalendarCard activeCalendarId={activeCalendarId} add30Mins={add30Mins} daySchedule={daySchedule} dialog={dialog} selectedDate={selectedDate} setDaySchedule={setDaySchedule} setIsModalOpen={setIsModalOpen} setMenuConfig={setMenuConfig} setNewAppt={setNewAppt} setReserveConflicts={setReserveConflicts} setReserveError={setReserveError} setReserveModal={setReserveModal} setReserveScope={setReserveScope} t={t} />

        {/* Timeline */}
          <AppointmentTimeline CARD_COLORS={CARD_COLORS} actionMenuId={actionMenuId} appointments={appointments} calendars={calendars} getServiceName={getServiceName} multiCalEnabled={multiCalEnabled} selectedDate={selectedDate} setActionMenuId={setActionMenuId} setCancelModalId={setCancelModalId} setDeleteModalId={setDeleteModalId} t={t} />
        </div>

        
      </div>

      
      {/* Modals for actions */}
      {(() => {
        const apptToCancel = cancelModalId ? appointments.find(a => a.id === cancelModalId) : null;
        return cancelModalId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass" style={{ width: 400, background: "rgba(30,30,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{t('randevuPage.actions.cancelTitle')}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 16 }}>
              {apptToCancel?.customer_name || t('randevuPage.timeline.unnamedCustomer')} <br/>
              {apptToCancel?.starts_at ? new Date(apptToCancel.starts_at).toLocaleString('tr-TR', { timeZone: apptToCancel.timezone ?? "Europe/Istanbul" }) : ''}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{t('randevuPage.actions.reasonLabel')}</label>
              <input type="text" value={cancelReason} onChange={e => setCancelReason(e.target.value)} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none", fontSize: 14 }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setCancelModalId(null); setCancelReason(""); }} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{t('randevuPage.actions.back')}</button>
              <button onClick={() => handleCancelAppointment(cancelModalId, cancelReason)} disabled={isActionLoading} style={{ flex: 1, padding: 14, borderRadius: 12, background: "#EF4444", border: "none", color: "#fff", fontWeight: 600, cursor: isActionLoading ? "not-allowed" : "pointer", opacity: isActionLoading ? 0.7 : 1 }}>{t('randevuPage.actions.submit')}</button>
            </div>
          </div>
        </div>
      );
      })()}

      {deleteModalId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass" style={{ width: 400, background: "rgba(30,30,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>{t('randevuPage.actions.deleteTitle')}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>{t('randevuPage.actions.deleteWarning')}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteModalId(null)} style={{ flex: 1, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{t('randevuPage.actions.back')}</button>
              <button onClick={() => handleDeleteAppointment(deleteModalId)} disabled={isActionLoading} style={{ flex: 1, padding: 14, borderRadius: 12, background: "#EF4444", border: "none", color: "#fff", fontWeight: 600, cursor: isActionLoading ? "not-allowed" : "pointer", opacity: isActionLoading ? 0.7 : 1 }}>{t('randevuPage.actions.delete')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Cute Modal */}
      <NewAppointmentModal availableSlots={availableSlots} calendars={calendars} handleSave={handleSave} isModalOpen={isModalOpen} isSaving={isSaving} newAppt={newAppt} selectedDate={selectedDate} services={services} setIsModalOpen={setIsModalOpen} setNewAppt={setNewAppt} setSelectedDate={setSelectedDate} t={t} />

      

              <ReserveModal activeCalendarId={activeCalendarId} add30Mins={add30Mins} calendars={calendars} isSaving={isSaving} reserveConflicts={reserveConflicts} reserveError={reserveError} reserveModal={reserveModal} reserveNote={reserveNote} reserveReason={reserveReason} reserveScope={reserveScope} selectedDate={selectedDate} setDaySchedule={setDaySchedule} setIsSaving={setIsSaving} setReserveConflicts={setReserveConflicts} setReserveError={setReserveError} setReserveModal={setReserveModal} setReserveNote={setReserveNote} setReserveReason={setReserveReason} setReserveScope={setReserveScope} t={t} />

{/* Manage Calendars Modal */}
      <ManageCalendarsModal calendars={calendars} dialog={dialog} isManageModalOpen={isManageModalOpen} setCalendars={setCalendars} setIsManageModalOpen={setIsManageModalOpen} setPromptConfig={setPromptConfig} t={t} />

      {/* Custom Prompt Modal */}
      <PromptModal promptConfig={promptConfig} setPromptConfig={setPromptConfig} />

      <ContextMenu menuConfig={menuConfig} setMenuConfig={setMenuConfig} />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Hide scrollbar for neatness */
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}} />
    </div>
  );
}




