const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

// Fix 1: svcName
c = c.replace(
  /const svcName = appt\.services\?\.length > 0 \? appt\.services\.join\(' \+ '\) : \(\(appt\.service_id && getServiceName\(appt\.service_id\)\) \|\| \(appt\.customer_request_raw \? `📝 Not: \$\{appt\.customer_request_raw\}` : t\('randevuPage\.timeline\.unknownService'\)\)\);/,
  "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : (appt.service_id ? getServiceName(appt.service_id) : null);"
);
// Some files had `?? Not: ...` due to emojis being garbled. Let's use a generic replace:
c = c.replace(
  /const svcName = appt\.services\?\.length > 0 \? appt\.services\.join\(' \+ '\) : \(\(appt\.service_id && getServiceName\(appt\.service_id\)\) \|\| \(appt\.customer_request_raw \? `[^`]+` : t\('randevuPage\.timeline\.unknownService'\)\)\);/,
  "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : (appt.service_id ? getServiceName(appt.service_id) : null);"
);

// Fix 2: conditionally render svcName badge and fix the note text
c = c.replace(
  /<span style=\{\{ fontSize: 12, color: "var\(--text-secondary\)", background: "rgba\(255,255,255,0\.05\)", padding: "2px 8px", borderRadius: 99 \}\}>\{svcName\}<\/span>/,
  `{svcName && (<span style={{ fontSize: 12, color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 99 }}>{svcName}</span>)}`
);

c = c.replace(
  /Not: \{appt\.customer_request_raw\}/g,
  `📝 {appt.customer_request_raw}`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c, 'utf8');
