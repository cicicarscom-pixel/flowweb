"use client";

import React, { useState, useMemo, useEffect } from 'react';

const TIME_SLOTS = (() => {
  const slots = [];
  const fullSlots = new Set(['09:00', '09:30', '11:00', '13:00', '13:30', '16:00']);
  for (let h = 8; h < 24; h++) {
    ['00', '30'].forEach(m => {
      const time = `${String(h).padStart(2, '0')}:${m}`;
      slots.push({ time, full: fullSlots.has(time) });
    });
  }
  slots.push({ time: '00:00', full: false });
  return slots;
})();

const CARD_COLORS = [
  { bg: 'rgba(78,222,163,0.1)', border: 'rgba(78,222,163,0.3)', text: '#4edea3', icon: '✂️' },
  { bg: 'rgba(255,185,95,0.1)', border: 'rgba(255,185,95,0.3)', text: '#ffb95f', icon: '✨' },
  { bg: 'rgba(192,193,255,0.1)', border: 'rgba(192,193,255,0.3)', text: '#c0c1ff', icon: '🌿' },
  { bg: 'rgba(0,162,255,0.1)', border: 'rgba(0,162,255,0.3)', text: '#00a2ff', icon: '🖌️' },
];

export default function RandevuPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newAppt, setNewAppt] = useState({ name: '', phone: '', time: '10:00', service: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, []);

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

  // Fake appointments for presentation
  const [appointments, setAppointments] = useState([
    { id: 1, customerName: 'Ayşe Yılmaz', time: '10:00', service: 'Cilt Bakımı' },
    { id: 2, customerName: 'Mehmet Kaya', time: '13:30', service: 'Saç Kesimi' },
    { id: 3, customerName: 'Zeynep Demir', time: '16:00', service: 'Manikür & Pedikür' },
  ]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const monthYearStr = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const isSlotBusy = (time: string) => TIME_SLOTS.find(s => s.time === time)?.full || false;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setAppointments([...appointments, {
        id: Math.random(),
        customerName: newAppt.name || 'Yeni Müşteri',
        time: newAppt.time,
        service: newAppt.service || 'Genel Hizmet'
      }].sort((a,b) => a.time.localeCompare(b.time)));
      setIsModalOpen(false);
      setNewAppt({ name: '', phone: '', time: '10:00', service: '' });
      setIsSaving(false);
    }, 800);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(78,222,163,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(78,222,163,0.3)" }}>
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
              background: "linear-gradient(135deg, #4edea3, #00c6ff)", 
              border: "none", borderRadius: 99, padding: "10px 20px", 
              color: "#0b0c10", fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: "0 0 20px rgba(78,222,163,0.4)",
              display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <span>✨</span>
            Yeni Randevu
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 28, alignItems: "start" }}>
        
        {/* Left Column (Calendar & Appointments) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Calendar Strip */}
          <div className="glass" style={{ borderRadius: 24, padding: "20px 10px", border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 12, paddingBottom: 8, paddingLeft: 10, paddingRight: 10 }}>
              {dynamicDays.map((day, i) => {
                const isActive = selectedDate === day.fullDate;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(day.fullDate)}
                    style={{
                      flex: "0 0 auto",
                      width: 56, height: 72, borderRadius: 18,
                      background: isActive ? "linear-gradient(135deg, #4edea3 0%, #00c6ff 100%)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "none" : "1px solid rgba(255,255,255,0.05)",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s",
                      boxShadow: isActive ? "0 8px 16px rgba(78,222,163,0.3)" : "none",
                      transform: isActive ? "translateY(-4px)" : "none"
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#0b0c10" : "var(--text-secondary)", marginBottom: 4 }}>{day.name}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: isActive ? "#0b0c10" : "#fff" }}>{day.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>🗓️ {selectedDate.split('-').reverse().join('.')} Randevuları</h3>
            
            {appointments.length === 0 ? (
              <div className="glass" style={{ borderRadius: 24, padding: "40px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 48, filter: "grayscale(1) opacity(0.5)" }}>😴</span>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, marginTop: 16 }}>Bugün için henüz planlanmış bir randevu yok.</p>
              </div>
            ) : (
              appointments.map((appt, i) => {
                const palette = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <div key={appt.id} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44, paddingTop: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: palette.text }}>{appt.time}</span>
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
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>{appt.customerName}</h4>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{appt.service}</span>
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
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4edea3", boxShadow: "0 0 8px #4edea3" }} />
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
                              background: busy ? "#4edea3" : "rgba(255,255,255,0.03)",
                              border: busy ? "none" : "1px solid rgba(255,255,255,0.06)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: busy ? "0 0 10px rgba(78,222,163,0.3)" : "none",
                              cursor: "pointer", transition: "all 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          >
                            <span style={{ fontSize: 10, fontWeight: 800, color: busy ? "#0b0c10" : "var(--text-secondary)" }}>
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
            
            <div style={{ marginTop: 24, padding: "16px", background: "rgba(0,162,255,0.05)", borderRadius: 16, border: "1px dashed rgba(0,162,255,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
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
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(78,222,163,0.2), rgba(0,198,255,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 12 }}>
                🧸
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Saat</label>
                  <input 
                    type="time" 
                    value={newAppt.time}
                    onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Hizmet Türü</label>
                  <input 
                    type="text" 
                    value={newAppt.service}
                    onChange={e => setNewAppt({...newAppt, service: e.target.value})}
                    placeholder="Genel Bakım"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  width: "100%", padding: "16px", borderRadius: 16, marginTop: 8,
                  background: isSaving ? "rgba(78,222,163,0.5)" : "#4edea3",
                  color: "#0b0c10", fontWeight: 700, fontSize: 15, border: "none",
                  cursor: isSaving ? "default" : "pointer",
                  boxShadow: "0 8px 16px rgba(78,222,163,0.2)",
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
