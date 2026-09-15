const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const replacements1254 = [
  ['\u011F\u0178\u201C\u00A5', '\uD83D\uDCE5'],
  ['\u011F\u0178\u201C\u00A4', '\uD83D\uDCE4'],
  ['\u00E2\u02DC\u2026', '\u2605'],
  ['\u00E2\u2013\u00BC', '\u25BC'],
  ['\u011F\u0178\u0161\u20AC', '\uD83D\uDE80'],
  ['\u011F\u0178\u2018\u0081\u00EF\u00B8\u008F', '\uD83D\uDC41\uFE0F'],
  ['\u00E2\u008F\u00B1\u00EF\u00B8\u008F', '\u23F1\uFE0F']
];

let replacedCount = 0;
replacements1254.forEach(([bad, good]) => {
  if (content.includes(bad)) {
      content = content.split(bad).join(good);
      replacedCount++;
  }
});

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Replaced', replacedCount, 'emojis using pure hex');
