let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/page.tsx');

c = c.replace(
  "import { useRouter } from \"next/navigation\";",
  "import { useRouter } from \"next/navigation\";\nimport { todayInTimezone } from \"@/lib/dates\";"
);

const oldFinanceBlock = `        // Finance Stats (Transactions + Finance Documents)
        let inc = 0, exp = 0;
        const upcoming: any[] = [];
        const today = new Date().toISOString().split('T')[0];`;

const newFinanceBlock = `        let timezone = 'Europe/Istanbul';
        if (merchantId) {
          const { data: orgData } = await supabase.from('organizations').select('timezone').eq('owner_id', merchantId).maybeSingle();
          if (orgData?.timezone) timezone = orgData.timezone;
        }

        // Finance Stats (Transactions + Finance Documents)
        let inc = 0, exp = 0;
        const upcoming: any[] = [];
        const today = todayInTimezone(timezone);`;

c = c.replace(oldFinanceBlock, newFinanceBlock);

const oldDocDate = `                  const docDate = d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : null;`;

const newDocDate = `                  const docDate = d.created_at ? todayInTimezone(timezone, new Date(d.created_at)) : null;`;

c = c.replace(oldDocDate, newDocDate);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/page.tsx', c);
console.log("Updated page.tsx (dashboard)");
