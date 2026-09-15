const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const replacements = [
  ['Toplam Eri\xef\xbf\xbdim', 'Toplam Eri\u015Fim'],
  ['En \xef\xbf\xbdyi G\xef\xbf\xbdnderi', 'En \u0130yi G\u00F6nderi'],
  ['G\xef\xbf\xbdr\xef\xbf\xbdnt\xef\xbf\xbdle ?', 'G\u00F6r\u00FCnt\u00FCle \u2197'],
  ['Platform Baz\xef\xbf\xbdnda Takip\xef\xbf\xbdi Art\xef\xbf\xbd\xef\xbf\xbd\xef\xbf\xbd', 'Platform Baz\u0131nda Takip\u00E7i Art\u0131\u015F\u0131'],
  ['Zaman i\xef\xbf\xbdinde kazan\xef\xbf\xbdlan takip\xef\xbf\xbdi (Follows) say\xef\xbf\xbdlar\xef\xbf\xbd', 'Zaman i\u00E7inde kazan\u0131lan takip\u00E7i (Follows) say\u0131lar\u0131'],
  ['G\xef\xbf\xbdrsel', 'G\u00F6rsel'],
  ['G\xef\xbf\xbdnderi Say\xef\xbf\xbds\xef\xbf\xbd', 'G\u00F6nderi Say\u0131s\u0131'],
  ['Be\xef\xbf\xbceni Say\xef\xbf\xbds\xef\xbf\xbd', 'Be\u011Feni Say\u0131s\u0131'],
  ['Eri\xef\xbf\xbdim', 'Eri\u015Fim'],
  ['G\xef\xbf\xbdnderi Say\xef\xbf\xbds\xef\xbf\xbd', 'G\u00F6nderi Say\u0131s\u0131'],
  ['Be\xef\xbf\xbceni Say\xef\xbf\xbds\xef\xbf\xbd', 'Be\u011Feni Say\u0131s\u0131'],
  ['Eri\xef\xbf\xbdim', 'Eri\u015Fim'],
];

replacements.forEach(([bad, good]) => {
  content = content.split(bad).join(good);
});

// Double check if any replacement chars remain
if (content.includes('\uFFFD')) {
  console.log('WARNING: Still some \\uFFFD remaining!');
} else {
  console.log('All corrupted strings replaced!');
}

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
