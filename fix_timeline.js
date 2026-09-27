const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

c = c.replace(
  `                              {multiCalendarEnabled && appt.calendar_id && (`,
  `                              {appt.customer_request_raw && (
                                <span style={{ fontSize: 12, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                                  📝 {appt.customer_request_raw}
                                </span>
                              )}
                              {multiCalendarEnabled && appt.calendar_id && (`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
