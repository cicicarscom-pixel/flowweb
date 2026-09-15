const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const mappings = {
    '\u00C4\u00B1': 'ý',
    '\u00C3\u00A7': 'ç',
    '\u00C4\u00B0': 'Ý',
    '\u00C3\u00B6': 'ö',
    '\u00C3\u00BC': 'ü',
    '\u00C4\u009F': 'ð',
    '\u00C5\u009F': 'þ',
    '\u00C3\u0087': 'Ç',
    '\u00C3\u0096': 'Ö',
    '\u00C3\u009C': 'Ü',
    '\u00C4\u009E': 'Ð',
    '\u00C5\u009E': 'Þ',
    '\u00E2\u2014\u20AC': '—',
    '\u00E2\u20AC\u201D': '—'
};

for (const [bad, good] of Object.entries(mappings)) {
    content = content.split(bad).join(good);
}

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed using Hex escapes');
