const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

c = c.replace(
  /\.like\('date', `\$\{dateStr\}%`\)/g,
  `.gte('date', \`\${dateStr}T00:00:00\`).lt('date', \`\${nextDayStr}T00:00:00\`)`
);

// We need to inject `nextDayStr` before `let query = supabase` inside `getAvailableSlots`
// Since I can't easily match without regex, let's just do:
c = c.replace(
  /let query = supabase\s*\.from\('appointments'\)\s*\.select\('date'\)/,
  `const nextDay2 = new Date(dateStr); nextDay2.setDate(nextDay2.getDate() + 1); const nextDayStr = nextDay2.toISOString().split('T')[0];\n  let query = supabase\n    .from('appointments')\n    .select('date')`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', c, 'utf8');
