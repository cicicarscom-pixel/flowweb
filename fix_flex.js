import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

content = content.replace(
    'style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}',
    'style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 4 }}'
);

content = content.replace(
    'style={{ display: "flex", alignItems: "center", gap: 8 }}',
    'style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}'
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
console.log("Fixed flexWrap in flowweb RandevuClient.tsx");
