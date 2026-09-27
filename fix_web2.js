const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  "useState({ name: '', phone: '', time: '', service: '', calendar_id: '' })",
  "useState({ name: '', phone: '', time: '', service: '', calendar_id: '', note: '' })"
);

c = c.replace(
  "setNewAppt({ name: '', phone: '', time: '', service: '', calendar_id: '' });",
  "setNewAppt({ name: '', phone: '', time: '', service: '', calendar_id: '', note: '' });"
);

c = c.replace(
  "serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null,",
  "serviceId: newAppt.service || null, calendarId: newAppt.calendar_id || activeCalendarId || null, note: newAppt.note,"
);

c = c.replace(
  `                    </select>
                  </div>
                </div>`,
  `                    </select>
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
                </div>`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
