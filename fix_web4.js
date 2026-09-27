const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  /\{availableSlots\.map[\s\S]*?<\/div>\r?\n\s*<\/div>\r?\n\r?\n\s*<button/,
  `{availableSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
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

              <button`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
