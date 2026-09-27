const fs = require('fs');

let content = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

if (!content.includes('import { addDaysYmd }')) {
  content = content.replace('import { createClient } from "@/lib/supabase/server"', 'import { createClient } from "@/lib/supabase/server"\nimport { addDaysYmd } from "@/lib/dates"');
}

content = content.replace(
  /const nextDay = new Date\(dateStr\);\s*nextDay\.setDate\(nextDay\.getDate\(\) \+ 1\);\s*const nextDayStr = nextDay\.toISOString\(\)\.split\('T'\)\[0\];/g,
  `const nextDayStr = addDaysYmd(dateStr, 1);`
);

content = content.replace(
  /const nextDay2 = new Date\(dateStr\); nextDay2\.setDate\(nextDay2\.getDate\(\) \+ 1\); const nextDayStr = nextDay2\.toISOString\(\)\.split\('T'\)\[0\];/g,
  `const nextDayStr = addDaysYmd(dateStr, 1);`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', content, 'utf8');
