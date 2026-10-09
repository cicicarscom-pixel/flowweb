// next-intl (ICU MessageFormat) kaçış denetimi: bir kesme işareti hemen ardından "{" gelirse ya da
// "}" hemen ardından kesme gelirse ICU bunu "alıntı" sayar ve parametre DEĞİŞTİRİLMEZ
// ("'{name}'" ekranda "{name}" olarak görünür). Parametreyi tırnak içinde göstermek için "''{name}''" yazılır.
// Kullanım: node scripts/ci/check-icu.mjs <messages-klasörü> <dil1> <dil2> ...
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir, ...langs] = process.argv.slice(2);
if (!dir || langs.length === 0) {
  console.error('Kullanım: node scripts/ci/check-icu.mjs <klasör> <dil...>');
  process.exit(2);
}

const bad = [];
const walk = (node, path, lang) => {
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k, lang);
  } else if (typeof node === 'string') {
    if (/(?<!')'\{/.test(node) || /\}'(?!')/.test(node)) bad.push(`${lang}: ${path}: ${node.slice(0, 80)}`);
  }
};
for (const lang of langs) walk(JSON.parse(readFileSync(join(dir, `${lang}.json`), 'utf8')), '', lang);

if (bad.length) {
  console.error('HATA: ICU kaçış sorunu ("\'{" ya da "}\'" yerine "\'\'{...}\'\'" kullanın):');
  for (const b of bad) console.error('  ' + b);
  process.exit(1);
}
console.log('OK: ICU mesajlarında kesme işareti kaçış sorunu yok');
