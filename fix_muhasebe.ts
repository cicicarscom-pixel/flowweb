let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/page.tsx');

c = c.replace(
  "import { createClient } from \"@/lib/supabase/client\";",
  "import { createClient } from \"@/lib/supabase/client\";\nimport { todayInTimezone } from \"@/lib/dates\";"
);

const oldCode = `        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];`;

const newCode = `        let timezone = 'Europe/Istanbul';
        if (userId) {
          const { data: orgData } = await supabase.from('organizations').select('timezone').eq('owner_id', userId).maybeSingle();
          if (orgData?.timezone) timezone = orgData.timezone;
        }

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfMonth = todayInTimezone(timezone, firstDay);`;

c = c.replace(oldCode, newCode);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/page.tsx', c);
console.log("Updated ai-muhasebe/page.tsx");
