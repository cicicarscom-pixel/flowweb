const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

c = c.replace('date: string', 'date: string\n  note?: string');
c = c.replace("booking_token: crypto.randomUUID(),", "booking_token: crypto.randomUUID(),\n      customer_request_raw: input.note || null,");

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', c, 'utf8');
