const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf-8');

// The scale part
let topIdx = c.indexOf('<div className="glass" style={{');
if (topIdx !== -1) {
    let animIdx = c.indexOf('animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"', topIdx);
    if (animIdx !== -1) {
        c = c.substring(0, animIdx) + 'animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",\n              transform: "scale(0.75)"' + c.substring(animIdx + 'animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"'.length);
    }
}

// The calendar dropdown
let phoneLabelIdx = c.indexOf('placeholder="+90 555 123 4567"');
if (phoneLabelIdx !== -1) {
    let divEndIdx = c.indexOf('</div>', phoneLabelIdx) + '</div>'.length;
    let nextDivIdx = c.indexOf('<div style={{ display: "flex", gap: 16 }}>', divEndIdx);
    
    if (nextDivIdx !== -1) {
        let calendarSelectHtml = `
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
`;
        c = c.substring(0, nextDivIdx) + calendarSelectHtml + c.substring(nextDivIdx);
    }
}

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c);
console.log("Success Web Scale & Calendar");
