let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/page.tsx');

c = c.replace(
`  // Bugünün tarihini YYYY-MM-DD formatında al (Yerel Saat Dilimine Göre)
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(now.getTime() - offsetMs)
  const today = localDate.toISOString().split('T')[0]

  let businessServices = []
  try {
    businessServices = await getBusinessServices(session.user.id)
  } catch (error) {
    console.error('getBusinessServices Error:', error)
    // Hata durumunda bo? liste ile devam ediyoruz ki sayfa ??kmesin
  }

  const { data: org } = await supabase.from("organizations").select("multi_calendar_enabled").eq("owner_id", session.user.id).single();`,
`  const { data: org } = await supabase.from("organizations").select("multi_calendar_enabled, timezone").eq("owner_id", session.user.id).single();
  const timezone = org?.timezone || 'Europe/Istanbul';
  const { todayInTimezone } = await import('@/lib/dates');
  const today = todayInTimezone(timezone);

  let businessServices = [];
  try {
    businessServices = await getBusinessServices(session.user.id);
  } catch (error) {
    console.error('getBusinessServices Error:', error);
  }`
);

// Fallback if the characters like '?' are messed up by powershell
const c2 = c.replace(
  /\/\/ Bug[\s\S]*?\.single\(\);/,
  `const { data: org } = await supabase.from("organizations").select("multi_calendar_enabled, timezone").eq("owner_id", session.user.id).single();
  const timezone = org?.timezone || 'Europe/Istanbul';
  const { todayInTimezone } = await import('@/lib/dates');
  const today = todayInTimezone(timezone);

  let businessServices = [];
  try {
    businessServices = await getBusinessServices(session.user.id);
  } catch (error) {
    console.error('getBusinessServices Error:', error);
  }`
);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/page.tsx', c2);
console.log("Updated page.tsx");
