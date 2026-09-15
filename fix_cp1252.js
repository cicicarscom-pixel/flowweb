const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const mappings = {
    '\u00C4\u00B1': '\u0131', // ý
    '\u00C5\u0178': '\u015F', // þ
    '\u00C4\u0178': '\u011F', // ð
    '\u00C3\u00A7': '\u00E7', // ç
    '\u00C3\u00B6': '\u00F6', // ö
    '\u00C3\u00BC': '\u00FC', // ü
    '\u00C4\u00B0': '\u0130', // Ý
    '\u00C5\u017E': '\u015E', // Þ
    '\u00C4\u017E': '\u011E', // Ð
    '\u00C3\u0087': '\u00C7', // Ç
    '\u00C3\u0096': '\u00D6', // Ö
    '\u00C3\u009C': '\u00DC', // Ü
};

for (const [bad, good] of Object.entries(mappings)) {
    content = content.split(bad).join(good);
}

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed using cp1252 mappings');
