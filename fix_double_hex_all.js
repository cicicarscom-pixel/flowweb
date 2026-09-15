const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const mappings = {
    '\u00C4\u00B1': '\u0131',
    '\u00C3\u00A7': '\u00E7',
    '\u00C4\u00B0': '\u0130',
    '\u00C3\u00B6': '\u00F6',
    '\u00C3\u00BC': '\u00FC',
    '\u00C4\u009F': '\u011F',
    '\u00C5\u009F': '\u015F',
    '\u00C3\u0087': '\u00C7',
    '\u00C3\u0096': '\u00D6',
    '\u00C3\u009C': '\u00DC',
    '\u00C4\u009E': '\u011E',
    '\u00C5\u009E': '\u015E',
    '\u00E2\u20AC\u201D': '\u2014'
};

for (const [bad, good] of Object.entries(mappings)) {
    content = content.split(bad).join(good);
}

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed using all Hex escapes');
