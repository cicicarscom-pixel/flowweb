import * as fs from 'fs';

// 1. Fix Web
let webContent = fs.readFileSync('src/actions/calendars.ts', 'utf8');
webContent = webContent.replace(
    '.order("created_at", { ascending: true });',
    '.eq("merchant_id", session.user.id)\n      .order("created_at", { ascending: true });'
);
fs.writeFileSync('src/actions/calendars.ts', webContent, 'utf8');
console.log("Updated flowweb");

// 2. Fix Mobile
let mobileContent = fs.readFileSync('../flow/src/modules/randevu/infrastructure/repositories/SupabaseCalendarRepository.ts', 'utf8');
mobileContent = mobileContent.replace(
    '.select(\'*\')\n      .order(\'created_at\', { ascending: true });',
    '.select(\'*\')\n      .eq(\'merchant_id\', session.user.id)\n      .order(\'created_at\', { ascending: true });'
);
fs.writeFileSync('../flow/src/modules/randevu/infrastructure/repositories/SupabaseCalendarRepository.ts', mobileContent, 'utf8');
console.log("Updated flow");
