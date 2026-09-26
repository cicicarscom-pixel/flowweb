let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/analiz/page.tsx');

c = c.replace(
  /const _toDate = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\r?\n\s*const _fromDate = new Date\(Date\.now\(\) - \(selectedTimeRange\.days \|\| 30\) \* 24 \* 60 \* 60 \* 1000\)\.toISOString\(\)\.split\('T'\)\[0\];/,
  `let timezone = 'Europe/Istanbul';
      if (merchantId) {
        const { data: orgData } = await supabase.from('organizations').select('timezone').eq('owner_id', merchantId).maybeSingle();
        if (orgData?.timezone) timezone = orgData.timezone;
      }
      
      const _toDate = todayInTimezone(timezone);
      const fromDateObj = new Date(Date.now() - (selectedTimeRange.days || 30) * 24 * 60 * 60 * 1000);
      const _fromDate = todayInTimezone(timezone, fromDateObj);`
);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/analiz/page.tsx', c);
console.log("Updated analiz/page.tsx 3");
