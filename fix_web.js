const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  /<div style=\{\{ display: "flex", gap: 16 \}\}>\s*<div style=\{\{ flex: 1 \}\}>\s*<label[^>]*>\{t\('randevuPage\.modal\.serviceTypeLabel'\)\}<\/label>\s*<select[\s\S]*?<\/select>\s*<\/div>/,
  `{services.length > 0 && (
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
              )}`
);

// We need to add the newAppt.note state
c = c.replace(
  "service: '', time: ''",
  "service: '', time: '', note: ''"
);
c = c.replace(
  "service: string, time: string",
  "service: string, time: string, note: string"
);

// We need to add the note parameter to createAppointment call
c = c.replace(
  "serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null,\n        date: dateStr",
  "serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null,\n        date: dateStr,\n        note: newAppt.note"
);

// Add the "Açıklama" UI just below "Saat"
c = c.replace(
  `                </div>
              </div>

              <button
                onClick={async () => {`,
  `                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, paddingLeft: 4 }}>Açıklama / Not</label>
                <textarea
                  value={newAppt.note || ''}
                  onChange={e => setNewAppt({...newAppt, note: e.target.value})}
                  placeholder="AI asistana verilen notlar gibi... (Örn: Dolgum düştü dolgu yaptırmak istiyorum)"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 16, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", outline: "none", fontSize: 14, minHeight: 80, resize: "vertical" }}
                />
              </div>

              <button
                onClick={async () => {`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
