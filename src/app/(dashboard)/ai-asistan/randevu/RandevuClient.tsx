"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAppointmentsByDate, getAvailableSlots, createAppointment } from '@/actions/appointments';

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

function ScrollableContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
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

export default function RandevuClient({ initialAppointments, services, merchantId, today, initialCalendars, multiCalendarEnabled }: { initialAppointments: any[], services: any[], merchantId: string, today: string, initialCalendars?: any[], multiCalendarEnabled?: boolean }) {
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [calendars, setCalendars] = useState(initialCalendars || []);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState({ visible: false, title: "", placeholder: "", value: "", onSave: (val: string) => {} });
  const t = useTranslations();
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const selectedDayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const param = searchParams.get("date");
    if (!param || !/^\d{4}-\d{2}-\d{2}$/.test(param)) return;
    const [y, m, d] = param.split("-").map(Number);
    setCurrentDate(new Date(y, m - 1, d));
    setSelectedDate(param);
  }, [searchParams]);

  useEffect(() => {
    selectedDayRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedDate, currentDate]);

  
  const [newAppt, setNewAppt] = useState({ name: '', phone: '', time: '', service: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`appointments-${merchantId}-${selectedDate}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `organization_id=eq.${merchantId}`,
        },
        async () => {
          const { data } = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
          setAppointments(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, merchantId, supabase]);

  // Load appointments when selected date changes (if not today)
  useEffect(() => {
    async function loadDate() {
      const { data } = await getAppointmentsByDate(selectedDate, activeCalendarId || undefined);
      setAppointments(data);
    }
    if (selectedDate !== today) {
      loadDate();
    } else {
      setAppointments(initialAppointments);
    }
  }, [selectedDate, today, initialAppointments, activeCalendarId]);

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

  const isSlotBusy = (time: string) => {
    return appointments.some(app => {
      if (app.status !== 'Pending' && app.status !== 'Approved') return false;
      const d = app.date || '';
      const t = d.includes('T') ? d.split('T')[1] : d.split(' ')[1] || '';
      return t.substring(0, 5) === time;
    });
  };

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
      serviceId: newAppt.service || null, calendarId: activeCalendarId || null,
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
    setNewAppt({ name: '', phone: '', time: '', service: '' });
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
            onClick={async () => {
              if (window.confirm('AI Hafızası (son konuşmalar) silinsin mi? Sadece sizin işletmenizin kayıtları silinir.')) {
                const { clearChatMemory } = await import('@/actions/clearChatMemory');
                const res = await clearChatMemory();
                if (res.success) {
                  alert('AI Hafızası başarıyla silindi!');
                } else {
                  alert('Hata oluştu: ' + res.error);
                }
              }
            }}
            style={{ 
              background: 'rgba(255, 59, 48, 0.15)', 
              border: '1px solid rgba(255, 59, 48, 0.3)', borderRadius: 99, padding: '10px 20px', 
              color: '#ff3b30', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            🧹 Hafızayı Sil
          </button>
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
        {multiCalendarEnabled && (
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
            <ScrollableContainer>
              {dynamicDays.map((day, i) => {
                const isActive = selectedDate === day.fullDate;
                                  return (
                    <div 
                      key={i} 
                      ref={isActive ? selectedDayRef : undefined}
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

            <div style={{ display: "flex", gap: 12 }}>
              {/* Row Labels */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.morning')}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.noon')}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>{t('randevuPage.heatmap.rowLabels.evening')}</span>
              </div>
              
              {/* Heatmap Grid */}
              <div className="hide-scroll" style={{ flex: 1, overflowX: "auto", paddingBottom: 6, overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: 11 }).map((_, col) => (
                    <div key={col} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[0, 1, 2].map(row => {
                        const slot = TIME_SLOTS[row * 11 + col];
                        if (!slot) return <div key={row} style={{ width: 44, height: 32 }} />;
                        const busy = isSlotBusy(slot.time);
                        return (
                          <div
                            key={row}
                            style={{
                              width: 44, height: 32, borderRadius: 8,
                              background: busy ? "#22B573" : "rgba(255,255,255,0.03)",
                              border: busy ? "none" : "1px solid rgba(255,255,255,0.06)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: busy ? "0 0 10px rgba(34,181,115,0.3)" : "none",
                              cursor: "pointer", transition: "all 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          >
                            <span style={{ fontSize: 10, fontWeight: 800, color: busy ? "#17151A" : "var(--text-secondary)" }}>
                              {slot.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
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
                const timeStr = appt.starts_at ? new Date(appt.starts_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: appt.timezone ?? "Europe/Istanbul" }) : rawTime.substring(0, 5);
                const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : ((appt.service_id && getServiceName(appt.service_id)) || (appt.customer_request_raw ? `📝 Not: ${appt.customer_request_raw}` : t('randevuPage.timeline.unknownService')));

                return (
                  <div key={appt.id} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44, paddingTop: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: palette.text }}>{timeStr}</span>
                      <div style={{ flex: 1, width: 2, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginTop: 8 }} />
                    </div>
                    
                    <div className="glass" style={{ 
                      flex: 1, borderRadius: 20, padding: 16,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${palette.border}`, borderLeft: `6px solid ${palette.text}`,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      transition: "transform 0.2s", cursor: "pointer"
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
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{svcName}</span>
                            {multiCalendarEnabled && appt.calendar_id && (
                              <span style={{ fontSize: 12, color: "#22B573", background: "rgba(34,181,115,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                                {calendars.find((c: any) => c.id === appt.calendar_id)?.name || "Takvim"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8 }}>
                        <span style={{ fontSize: 18 }}>⋮</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        
      </div>

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
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
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

              <div style={{ display: "flex", gap: 16 }}>
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




