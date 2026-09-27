const fs = require('fs');
let c = fs.readFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', 'utf8');

c = c.replace(
  `    let query = supabase\r
      .from('appointments')\r
      .select('date')\r
      .eq('organization_id', session.user.id)\r
      .like('date', \`\${dateStr}%\`)\r
      .in('status', ['Pending', 'Approved'])`,
  `    const nextDay2 = new Date(dateStr);
    nextDay2.setDate(nextDay2.getDate() + 1);
    const nextDayStr2 = nextDay2.toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('date')
      .eq('organization_id', session.user.id)
      .gte('date', \`\${dateStr}T00:00:00\`)
      .lt('date', \`\${nextDayStr2}T00:00:00\`)
      .in('status', ['Pending', 'Approved'])`
);

c = c.replace(
  `    let query = supabase\n      .from('appointments')\n      .select('date')\n      .eq('organization_id', session.user.id)\n      .like('date', \`\${dateStr}%\`)\n      .in('status', ['Pending', 'Approved'])`,
  `    const nextDay2 = new Date(dateStr);
    nextDay2.setDate(nextDay2.getDate() + 1);
    const nextDayStr2 = nextDay2.toISOString().split('T')[0];

    let query = supabase
      .from('appointments')
      .select('date')
      .eq('organization_id', session.user.id)
      .gte('date', \`\${dateStr}T00:00:00\`)
      .lt('date', \`\${nextDayStr2}T00:00:00\`)
      .in('status', ['Pending', 'Approved'])`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/actions/appointments.ts', c, 'utf8');
