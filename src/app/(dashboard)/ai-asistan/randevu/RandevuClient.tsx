"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAppointmentsByDate, getAvailableSlots, createAppointment, cancelAppointment, deleteAppointment, getDaySchedule, createCalendarBlock, deleteCalendarBlock } from '@/actions/appointments';
import { dateFromYmd } from '@/lib/dates';

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h < 24; h++) {
    ['00', '30'].forEach(m => {
      slots.push({ time: `${String(h).padStart(2, '0')}:${m}` });
    });
  }
  slots.push({ time: '00:00' });
  return slots;
})();

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
  const [promptConfig, setPromptConfig] = useState({ visible: false, title: "", placeholder: "", value: "", onSave: (val: string) => {} });
  const t = useTranslations();
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
  const [reserveDurationType, setReserveDurationType] = useState<any>('single');
  const [reserveReason, setReserveReason] = useState('meeting');
  const [reserveNote, setReserveNote] = useState('');
  const [reserveError, setReserveError] = useState('');
  const [reserveConflicts, setReserveConflicts] = useState<any[]>([]);
  const [popover, setPopover] = useState<any>(null);
  const [popoverError, setPopoverError] = useState('');

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
      alert(t('randevuPage.actions.genericError'));
    } else if (data?.status === 'ALREADY_CANCELLED') {
      alert(t('randevuPage.actions.alreadyCancelled'));
    } else if (data?.status === 'NOT_FOUND') {
      alert(t('randevuPage.actions.notFound'));
    }
    
    setCancelModalId(null);
    setCancelReason("");
    if (data?.status === 'SUCCESS') alert(t('randevuPage.actions.cancelSuccess'));
    
    const refresh = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
    setAppointments(refresh.data);
  };

  const handleDeleteAppointment = async (id: string) => {
    setIsActionLoading(true);
    const { data, error } = await deleteAppointment(id);
    setIsActionLoading(false);
    
    if (error || data?.status === 'UNAUTHORIZED') {
      alert(t('randevuPage.actions.genericError'));
    } else if (data?.status === 'NOT_FOUND') {
      alert(t('randevuPage.actions.notFound'));
    }
    
    setDeleteModalId(null);
    if (data?.status === 'SUCCESS') alert(t('randevuPage.actions.deleteSuccess'));
    
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
      alert(t('randevuPage.alerts.missingFields'));
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
      alert(t('randevuPage.alerts.saveFailed', { error: res.error }));
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

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Multi-Calendar Chip Bar (Phase 3) */}
        {multiCalEnabled && (
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
              {t("common.all") || "Tümü"}
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
                    title: "Yeni Takvim",
                    placeholder: "Yeni takvim/personel adını girin",
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
        )}

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
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setMenuConfig({
                                    visible: true,
                                    x: rect.left,
                                    y: rect.bottom,
                                    options: [
                                      { label: t('randevu.block.createAppointment'), onClick: () => { setNewAppt(prev => ({ ...prev, time: slotTime, calendar_id: activeCalendarId || prev.calendar_id })); setIsModalOpen(true); } },
                                      { label: t('randevu.block.reserve'), onClick: () => { setReserveModal({ visible: true, time: slotTime, endTime: add30Mins(slotTime) }); setReserveError(''); setReserveConflicts([]); setReserveDurationType('single'); setReserveScope(activeCalendarId ? 'doctor' : 'clinic'); } }
                                    ]
                                  });
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
                                            if (res.error || res.data?.status !== 'SUCCESS') alert(t('musteriler.error'));
                                            else {
                                              const refreshed = await getDaySchedule(selectedDate, activeCalendarId || undefined);
                                              setDaySchedule(refreshed.data || []);
                                            }
                                      }, destructive: true }
                                    ]
                                  });
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

        {/* Timeline */}
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
      {isModalOpen && (
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
                <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Tarih</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, marginBottom: 16 }} /></div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>{t('randevuPage.modal.customerNameLabel')}</label>
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Takvim Seçiniz</label>
                  <select
                    value={newAppt.calendar_id}
                    onChange={e => setNewAppt({...newAppt, calendar_id: e.target.value})}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, marginBottom: 16 }}
                  >
                    <option value="">Seçiniz</option>
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Açıklama / Not</label>
                  <textarea
                    value={newAppt.note}
                    onChange={e => setNewAppt({...newAppt, note: e.target.value})}
                    placeholder="AI asistana verilen notlar gibi... (Örn: Dolgum düştü dolgu yaptırmak istiyorum)"
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
      )}

      

              {reserveModal.visible && (
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
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Kapsam</span>
                {activeCalendarId ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setReserveScope('doctor')} style={{ flex: 1, padding: 8, background: reserveScope === 'doctor' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>{activeCalendarId ? calendars.find(c => c.id === activeCalendarId)?.name || 'Seçili doktor' : 'Seçili doktor'}</button>
                    <button onClick={() => setReserveScope('clinic')} style={{ flex: 1, padding: 8, background: reserveScope === 'clinic' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>Tüm klinik</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={reserveScope} onChange={e => setReserveScope(e.target.value)} style={{ flex: 1, padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }}>
                      <option value="clinic">Tüm klinik</option>
                      {calendars.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Süre</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setReserveDurationType('single'); setReserveModal((p: any) => ({...p, endTime: add30Mins(p.time)})); }} style={{ flex: 1, padding: 8, background: reserveDurationType === 'single' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>Tek slot</button>
                  <button onClick={() => setReserveDurationType('range')} style={{ flex: 1, padding: 8, background: reserveDurationType === 'range' ? '#22B573' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: 6 }}>Başlangıç-bitiş</button>
                </div>
              </div>

              {reserveDurationType === 'range' && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Başlangıç</span>
                    <input type="time" step="1800" value={reserveModal.time} onChange={e => { const v = e.target.value; setReserveModal((p: any) => ({...p, time: v, endTime: add30Mins(v)})); }} style={{ padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Bitiş</span>
                    <input type="time" step="1800" value={reserveModal.endTime} onChange={e => setReserveModal((p: any) => ({...p, endTime: e.target.value}))} style={{ padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 }} />
                  </div>
                </div>
              )}

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
        )}

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
                        if (confirm(`'${cal.name}' silinecek. Emin misiniz?`)) {
                          const { createClient } = await import("@/lib/supabase/client");
                          const client = createClient();
                          const { data } = await client.from("calendars").update({ is_active: false }).eq("id", cal.id).select();
                          if (!data || data.length === 0) alert("Bu takvimi silme yetkiniz yok (eski kayıt olduğu için). Lütfen Supabase panelinden silin.");
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

      <div style={{ display: menuConfig?.visible ? 'block' : 'none' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: 99998 }} onClick={() => setMenuConfig({ ...menuConfig, visible: false })} />
        <div style={{
          position: 'fixed',
          left: menuConfig?.x || 0,
          top: (menuConfig?.y || 0) + 8,
          zIndex: 99999,
          background: '#1A181C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          minWidth: 160,
          animation: 'fadeIn 0.15s ease'
        }}>
          {menuConfig?.options?.map((opt: any, i: number) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setMenuConfig({ ...menuConfig, visible: false });
                opt.onClick();
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: i < menuConfig.options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                color: opt.destructive ? '#ef4444' : '#fff',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
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




