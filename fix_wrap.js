import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

content = content.replace(
    '<div style={{ display: "flex", alignItems: "center", gap: 12, overflowX: "auto", paddingBottom: 8 }} className="hide-scroll">',
    '<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", paddingBottom: 8 }}>'
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
console.log("Fixed flexWrap instead of overflowX");
