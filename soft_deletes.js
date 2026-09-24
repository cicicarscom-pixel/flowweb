import * as fs from 'fs';

// 1. FLOWWEB - getCalendars
let webActions = fs.readFileSync('src/actions/calendars.ts', 'utf8');
webActions = webActions.replace(
    '.eq("merchant_id", session.user.id)',
    '.eq("merchant_id", session.user.id)\n      .eq("is_active", true)'
);
fs.writeFileSync('src/actions/calendars.ts', webActions, 'utf8');

// 2. FLOWWEB - deleteCalendar
let webClient = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');
webClient = webClient.replace(
    'const { data } = await client.from("calendars").delete().eq("id", cal.id).select();',
    'const { data } = await client.from("calendars").update({ is_active: false }).eq("id", cal.id).select();'
);
fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', webClient, 'utf8');


// 3. FLOW - deleteCalendar
let mobileRepo = fs.readFileSync('../flow/src/modules/randevu/infrastructure/repositories/SupabaseCalendarRepository.ts', 'utf8');
mobileRepo = mobileRepo.replace(
    '.delete()\n      .eq(\'id\', id)',
    '.update({ is_active: false })\n      .eq(\'id\', id)'
);
fs.writeFileSync('../flow/src/modules/randevu/infrastructure/repositories/SupabaseCalendarRepository.ts', mobileRepo, 'utf8');

console.log("Applied soft-deletes everywhere!");
