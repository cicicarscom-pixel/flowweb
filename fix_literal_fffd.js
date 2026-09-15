const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const BAD = '\u00EF\u00BF\u00BD'; // �
const replacements = [
  [`Toplam Eri${BAD}im`, 'Toplam Eri\u015Fim'],
  [`En ${BAD}yi G${BAD}nderi`, 'En \u0130yi G\u00F6nderi'],
  [`G${BAD}r${BAD}nt${BAD}le ?`, 'G\u00F6r\u00FCnt\u00FCle \u2197'],
  [`Platform Baz${BAD}nda Takip${BAD}i Art${BAD}${BAD}${BAD}`, 'Platform Baz\u0131nda Takip\u00E7i Art\u0131\u015F\u0131'],
  [`Zaman i${BAD}inde kazan${BAD}lan takip${BAD}i (Follows) say${BAD}lar${BAD}`, 'Zaman i\u00E7inde kazan\u0131lan takip\u00E7i (Follows) say\u0131lar\u0131'],
  [`G${BAD}rsel`, 'G\u00F6rsel'],
  [`G${BAD}nderi Say${BAD}s${BAD}`, 'G\u00F6nderi Say\u0131s\u0131'],
  [`Be${BAD}eni Say${BAD}s${BAD}`, 'Be\u011Feni Say\u0131s\u0131'],
  [`Eri${BAD}im`, 'Eri\u015Fim'],
];

let replacedCount = 0;
replacements.forEach(([bad, good]) => {
  if (content.includes(bad)) {
      content = content.split(bad).join(good);
      replacedCount++;
  }
});

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Replaced', replacedCount, 'occurrences of corrupted text');
