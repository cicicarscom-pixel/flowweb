const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const replacements = [
  ['\u00F0\u0178\u201C\u00A5', '??'], // ðŸ“¥
  ['\u00F0\u0178\u201C\u00A4', '??'], // ðŸ“¤
  ['\u00E2\u02DC\u2026', '?'],       // â˜…
  ['\u00E2\u2013\u00BC', '¡'],       // â–¼
  ['\u00F0\u0178\u0161\u20AC', '??'], // ðŸš€
  ['\u00F0\u0178\u2018\u0081\u00EF\u00B8\u008F', '???'], // ðŸ‘ 
  ['\u00E2\u008F\u00B1\u00EF\u00B8\u008F', '??']      // â ±
];

let replacedCount = 0;
replacements.forEach(([bad, good]) => {
  if (content.includes(bad)) {
      content = content.split(bad).join(good);
      replacedCount++;
  }
});

// If the eye or watch is partially mangled (like \u011f instead of \u00f0) due to previous tries, let's also do a generic regex.
// Wait! Earlier I printed the bytes of the eye in the file:
// [ '11f', '178', '2018', '81', 'ef', 'b8', '8f' ] => \u011f\u0178\u2018\x81\u00ef\u00b8\x8f !
// Why \u011f (ð)? Because \u00F0 (?) wasn't present, it was ð!
// Ah! In Turkish Windows-1254, `f0` is `ð`!
// Yes! The file was decoded as Windows-1254 (Turkish ANSI), not Windows-1252!
// In Windows-1254:
// `f0` = `ð` (\u011F)
// `9f` = `Ÿ` (\u0178)
// `91` = `‘` (\u2018)
// `e2` = `â` (\u00E2)
// `96` = `–` (\u2013)
// `bc` = `¼` (\u00BC)
// `98` = `˜` (\u02DC)
// `85` = `…` (\u2026)

const replacements1254 = [
  ['\u011F\u0178\u201C\u00A5', '??'],
  ['\u011F\u0178\u201C\u00A4', '??'],
  ['\u011F\u0178\u0161\u20AC', '??'],
  ['\u011F\u0178\u2018\u0081\u00EF\u00B8\u008F', '???']
];

replacements1254.forEach(([bad, good]) => {
  if (content.includes(bad)) {
      content = content.split(bad).join(good);
      replacedCount++;
  }
});

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Replaced', replacedCount, 'emojis');
