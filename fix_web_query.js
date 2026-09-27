const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

c = c.replace(
  `    let query = supabase\r
      .from('appointments')\r
      .select('*')\r
      .eq('organization_id', session.user.id)\r
      .like('date', \`\${dateStr}%\`)\r
      .in('status', ['Pending', 'Approved'])\r
      .order('date', { ascending: true })`,
  `    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('organization_id', session.user.id)
      .gte('date', \`\${dateStr}T00:00:00\`)
      .lt('date', \`\${nextDayStr}T00:00:00\`)
      .in('status', ['Pending', 'Approved'])
      .order('date', { ascending: true })`
);

c = c.replace(
  `    let query = supabase\n      .from('appointments')\n      .select('*')\n      .eq('organization_id', session.user.id)\n      .like('date', \`\${dateStr}%\`)\n      .in('status', ['Pending', 'Approved'])\n      .order('date', { ascending: true })`,
  `    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('organization_id', session.user.id)
      .gte('date', \`\${dateStr}T00:00:00\`)
      .lt('date', \`\${nextDayStr}T00:00:00\`)
      .in('status', ['Pending', 'Approved'])
      .order('date', { ascending: true })`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', c, 'utf8');
