const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const mappings = {
    '\u00C3\u2013': '\u00D6', // Ö (c3 96)
    '\u00C3\u2021': '\u00C7', // Ç (c3 87)
    '\u00C3\u0153': '\u00DC', // Ü (c3 9c)
};

for (const [bad, good] of Object.entries(mappings)) {
    content = content.split(bad).join(good);
}

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed remaining cp1252');
