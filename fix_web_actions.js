const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

c = c.replace(
  /export async function getAppointmentsByDate\(dateStr: string, calendarId\?: string\) \{\r?\n  const supabase = await createClient\(\)\r?\n  const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\)\r?\n  if \(!session\) return \{ data: \[\], error: 'Unauthorized' \}\r?\n\r?\n  let query = supabase\r?\n    \.from\('appointments'\)\r?\n    \.select\('\*'\)\r?\n    \.eq\('organization_id', session\.user\.id\)\r?\n    \.like\('date', `\$\{dateStr\}%`\)/,
  `export async function getAppointmentsByDate(dateStr: string, calendarId?: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('organization_id', session.user.id)
    .gte('date', \`\${dateStr}T00:00:00\`)
    .lt('date', \`\${nextDayStr}T00:00:00\`)`
);

c = c.replace(
  /export async function findAvailableHours\(dateStr: string, serviceId: string, calendarId\?: string\) \{\r?\n  const supabase = await createClient\(\)\r?\n  const \{ data: \{ session \} \} = await supabase\.auth\.getSession\(\)\r?\n  if \(!session\) return \{ data: \[\], error: 'Unauthorized' \}\r?\n\r?\n  let query = supabase\r?\n    \.from\('appointments'\)\r?\n    \.select\('date'\)\r?\n    \.eq\('organization_id', session\.user\.id\)\r?\n    \.like\('date', `\$\{dateStr\}%`\)/,
  `export async function findAvailableHours(dateStr: string, serviceId: string, calendarId?: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  let query = supabase
    .from('appointments')
    .select('date')
    .eq('organization_id', session.user.id)
    .gte('date', \`\${dateStr}T00:00:00\`)
    .lt('date', \`\${nextDayStr}T00:00:00\`)`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', c, 'utf8');
