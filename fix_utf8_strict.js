const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const replacements = [
  ['Toplam Eri\uFFFDim', 'Toplam Eri\u015Fim'],
  ['En \uFFFDi G\uFFFDnderi', 'En \u0130yi G\u00F6nderi'],
  ['G\uFFFDr\uFFFDnt\uFFFDle ?', 'G\u00F6r\u00FCnt\u00FCle \u2197'],
  ['Platform Baz\uFFFDnda Takip\uFFFDi Art\uFFFD\uFFFD\uFFFD', 'Platform Baz\u0131nda Takip\u00E7i Art\u0131\u015F\u0131'],
  ['Zaman i\uFFFDinde kazan\uFFFDlan takip\uFFFDi (Follows) say\uFFFDlar\uFFFD', 'Zaman i\u00E7inde kazan\u0131lan takip\u00E7i (Follows) say\u0131lar\u0131'],
  ['G\uFFFDrsel', 'G\u00F6rsel'],
  ['G\uFFFDnderi Say\uFFFDs\uFFFD', 'G\u00F6nderi Say\u0131s\u0131'],
  ['Be\uFFFDeni Say\uFFFDs\uFFFD', 'Be\u011Feni Say\u0131s\u0131'],
  ['Eri\uFFFDim', 'Eri\u015Fim'],
];

replacements.forEach(([bad, good]) => {
  content = content.split(bad).join(good);
});

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed FFFD using hex escapes');
