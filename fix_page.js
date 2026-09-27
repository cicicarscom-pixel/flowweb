const fs = require('fs');

let page = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/page.tsx', 'utf8');

// Replace the `today` line and add timezone logic
page = page.replace(
  `        const today = new Date().toISOString().split('T')[0];`,
  `        let timezone = 'Europe/Istanbul';
        if (merchantId) {
          const { data: org } = await supabase.from('organizations').select('timezone').eq('owner_id', merchantId).maybeSingle();
          if (org?.timezone) timezone = org.timezone;
        }
        const today = todayInTimezone(timezone);`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/page.tsx', page, 'utf8');
