const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf-8');

// 1. Add calendar_id to newAppt state
c = c.replace(
  "const [newAppt, setNewAppt] = useState({ name: '', phone: '', time: '', service: '' });",
  "const [newAppt, setNewAppt] = useState({ name: '', phone: '', time: '', service: '', calendar_id: '' });"
);

c = c.replace(
  "setNewAppt({ name: '', phone: '', time: '', service: '' });",
  "setNewAppt({ name: '', phone: '', time: '', service: '', calendar_id: '' });"
);

// 2. Modify createAppointment call
c = c.replace(
  "serviceId: newAppt.service || null, calendarId: activeCalendarId || null,",
  "serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null,"
);

// 3. Add scale to the modal, and also inject the calendar select HTML
const oldModalTop = `            <div className="glass" style={{
              width: 440, maxHeight: "90vh", overflowY: "auto", borderRadius: 32, padding: 32, position: "relative",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>`;

const newModalTop = `            <div className="glass" style={{
              width: 440, maxHeight: "90vh", overflowY: "auto", borderRadius: 32, padding: 32, position: "relative",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "scale(0.75)"
            }}>`;
c = c.replace(oldModalTop, newModalTop);

// 4. Inject the Calendar Select in the form.
// In the current form, we have:
/*
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
*/

const oldPhoneEnd = `                  />
                </div>
                
                <div style={{ display: "flex", gap: 16 }}>`;

const newPhoneEndWithCalendar = `                  />
                </div>
                
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Takvim Seçiniz</label>
                  <select
                    value={newAppt.calendar_id}
                    onChange={e => setNewAppt({...newAppt, calendar_id: e.target.value})}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14 }}
                  >
                    <option value="">Seçiniz</option>
                    {calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 16 }}>`;

c = c.replace(oldPhoneEnd, newPhoneEndWithCalendar);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c);
console.log("Success Web");
