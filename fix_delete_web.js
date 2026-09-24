import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

content = content.replace(
    'await client.from("calendars").delete().eq("id", cal.id);',
    'const { data } = await client.from("calendars").delete().eq("id", cal.id).select();\n                          if (!data || data.length === 0) alert("Bu takvimi silme yetkiniz yok (eski kayıt olduğu için). Lütfen Supabase panelinden silin.");'
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
console.log("Updated delete logic on Web!");
