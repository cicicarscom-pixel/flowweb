"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ 
        display: "flex", overflowX: "auto", gap: 12, paddingBottom: 8, paddingLeft: 10, paddingRight: 10, 
        cursor: isDown ? "grabbing" : "grab",
        scrollbarWidth: "none", msOverflowStyle: "none"
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
      {children}
    </div>
  );
}

export default function RandevuClient({ initialAppointments, services, merchantId, today }: { initialAppointments: any[], services: any[], merchantId: string, today: string }) {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
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
          const { data } = await getAppointmentsByDate(selectedDate);
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
      const { data } = await getAppointmentsByDate(selectedDate);
      setAppointments(data);
    }
    if (selectedDate !== today) {
      loadDate();
    } else {
      setAppointments(initialAppointments);
    }
  }, [selectedDate, today, initialAppointments]);

  // Load available slots when service changes in modal
  useEffect(() => {
    if (isModalOpen && newAppt.service) {
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
    const trDays = ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    for (let i = 1; i <= numDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        name: trDays[d.getDay()],
        date: String(i).padStart(2, '0'),
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    return days;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
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
    if (!newAppt.service || !newAppt.time || !newAppt.phone) {
      alert("Hizmet, saat ve telefon zorunludur.");
      return;
    }
    setIsSaving(true);
    const dateStr = `${selectedDate}T${newAppt.time}:00`;
    
    const res = await createAppointment({
      customerName: newAppt.name,
      customerPhone: newAppt.phone,
      serviceId: newAppt.service,
      date: dateStr
    });
    
    if (res.error) {
      alert("Randevu kaydedilemedi: " + res.error);
      setIsSaving(false);
      return;
    }
    
    const { data } = await getAppointmentsByDate(selectedDate);
    setAppointments(data);
    
    setIsModalOpen(false);
    setNewAppt({ name: '', phone: '', time: '', service: '' });
    setIsSaving(false);
  };

  const getServiceName = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    return s ? s.name : 'Bilinmeyen Hizmet';
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
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Ai Randevu Yönetimi</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, marginTop: 4 }}>Tüm randevularınız sevimli asistanınızın kontrolünde! ✨</p>
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
            <span>+</span> Yeni Randevu Ekle
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        
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

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>📅 {selectedDate.split('-').reverse().join('.')} Randevuları</h3>
            
            {appointments.length === 0 ? (
              <div className="glass" style={{ borderRadius: 24, padding: "40px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 48, filter: "grayscale(1) opacity(0.5)" }}>😴</span>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, marginTop: 16 }}>Bugün için henüz planlanmış bir randevu yok.</p>
              </div>
            ) : (
              appointments.map((appt: any, i: number) => {
                const palette = CARD_COLORS[i % CARD_COLORS.length];
                const d = appt.date || '';
                const t = d.includes('T') ? d.split('T')[1] : d.split(' ')[1] || '';
                const timeStr = t.substring(0, 5);
                const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : getServiceName(appt.service_id);

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
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>{appt.customer_name || 'İsimsiz'}</h4>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{svcName}</span>
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

        {/* Right Column (Heatmap) */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="glass" style={{ borderRadius: 24, padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>📊 Günlük Yoğunluk Haritası</h3>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>DOLU</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "transparent", border: "1px solid var(--text-secondary)" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>BOŞ</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {/* Row Labels */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", paddingBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>SABAH</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>ÖĞLE</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>AKŞAM</span>
              </div>
              
              {/* Heatmap Grid */}
              <div style={{ flex: 1, overflowX: "auto", paddingBottom: 6 }}>
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
                Ai asistanınız, bu takvimi dikkate alarak müşterilerinizle yazışır ve boş saatlerinize otomatik randevu planlar.
              </p>
            </div>
            
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
            width: 440, borderRadius: 32, padding: 32, position: "relative",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,181,115,0.2), rgba(0,198,255,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 12 }}>
                🪄
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Yeni Randevu Ekle</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0 0" }}>Manuel olarak takvime bir kayıt girin</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Müşteri Adı</label>
                <input 
                  type="text" 
                  value={newAppt.name}
                  onChange={e => setNewAppt({...newAppt, name: e.target.value})}
                  placeholder="Örn: Ahmet Yılmaz"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Telefon Numarası</label>
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Hizmet Türü</label>
                  <select
                    value={newAppt.service}
                    onChange={e => setNewAppt({...newAppt, service: e.target.value, time: ''})}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                  >
                    <option value="">Seçiniz...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Saat</label>
                  <select
                    value={newAppt.time}
                    onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                    disabled={!newAppt.service}
                  >
                    <option value="">Saat Seçiniz...</option>
                    {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
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
                {isSaving ? "Kaydediliyor..." : "Sihirli Takvime Ekle ✨"}
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
