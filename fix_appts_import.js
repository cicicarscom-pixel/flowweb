const fs = require('fs');
let content = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

if (!content.includes('addDaysYmd')) {
  // Wait, the error is TS2304: Cannot find name 'addDaysYmd'. So it wasn't imported.
}
content = "import { addDaysYmd } from '@/lib/dates';\n" + content;
fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', content, 'utf8');
