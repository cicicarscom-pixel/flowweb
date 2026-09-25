const file = 'C:/Users/roman/flowweb/src/app/(dashboard)/page.tsx';
let content = await Deno.readTextFile(file);

const originalDbLogic = "const { data: appts } = await supabase.from('appointments').select('*').order('date', { ascending: true }).limit(5);";

const newDbLogic = `
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);

          const { data: appts } = await supabase.from('appointments')
            .select('*')
            .eq('organization_id', merchantId)
            .gte('date', startOfDay.toISOString())
            .lte('date', endOfDay.toISOString())
            .order('date', { ascending: true })
            .limit(5);`;

content = content.replace(originalDbLogic, newDbLogic);

const originalMapLogic = "title: a.customer_name ? `${a.customer_name} - ${a.service_name || t('dashboardHome.appointments.defaultTitle')}` : (a.service_name || t('dashboardHome.appointments.defaultTitle')),";

const newMapLogic = "title: a.customer_name ? `${a.customer_name} - ${a.customer_request_raw ? `📝 Not: ${a.customer_request_raw}` : (a.service_name || t('dashboardHome.appointments.defaultTitle'))}` : (a.customer_request_raw ? `📝 Not: ${a.customer_request_raw}` : (a.service_name || t('dashboardHome.appointments.defaultTitle'))),";

content = content.replace(originalMapLogic, newMapLogic);

await Deno.writeTextFile(file, content);
console.log("Updated flowweb page.tsx!");
