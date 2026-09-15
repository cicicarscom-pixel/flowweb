const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const replacements = [
  ['ðŸ“¥', '??'],
  ['ðŸ“¤', '??'],
  ['ðŸ‘\x81ï¸\x8F', '???'],
  ['â\x8F±ï¸\x8F', '??'],
  ['ðŸš€', '??'],
  ['â˜…', '?'],
  ['â–¼', '¡'],
  // Just in case these exist with FFFD because of powershell corruption
  ['ðŸ‘\u0081\uFFFDi\uFFFD\u008F', '???'],
  ['â\u008F±\uFFFDi\uFFFD\u008F', '??']
];

let replacedCount = 0;
replacements.forEach(([bad, good]) => {
  if (content.includes(bad)) {
      content = content.split(bad).join(good);
      replacedCount++;
  }
});

// Since the FFFD version of the eye and watch emojis might be weird, let's just do a regex for anything that looks like them if needed.
// Wait, they are probably just `ðŸ‘` followed by `\x81\xEF\xBF\xBD\xEF\xBF\xBD\x8F`
content = content.replace(/ðŸ‘[\s\S]{1,6}OKUNAN/g, '???</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.readRate")}</p>');
content = content.replace(/â[\s\S]{1,6}ORT\. YANIT SÜRESÝ/g, '??</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.avgResponseLabel")}</p>');

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Replaced emojis');
