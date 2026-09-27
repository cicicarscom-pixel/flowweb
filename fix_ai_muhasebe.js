const fs = require('fs');

let content = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/page.tsx', 'utf8');

if (!content.includes('import { todayInTimezone }')) {
  content = content.replace('import { createClient } from "@/lib/supabase/client";', 'import { createClient } from "@/lib/supabase/client";\nimport { todayInTimezone } from "@/lib/dates";');
}

content = content.replace(
  `        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];`,
  `        let tz = 'Europe/Istanbul';
        if (userId) {
          const { data: org } = await supabase.from('organizations').select('timezone').eq('owner_id', userId).maybeSingle();
          if (org?.timezone) tz = org.timezone;
        }
        const startOfMonth = \`\${todayInTimezone(tz).slice(0, 7)}-01\`;`
);

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/page.tsx', content, 'utf8');
