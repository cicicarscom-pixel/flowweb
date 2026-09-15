const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');
content = content.replace(
    /match\(\/\.\(mp4\|webm\|ogg\|mov\|blob\)\(\?\.\*\)\?\$\/i\)/g,
    'match(/\\\\.(mp4|webm|ogg|mov|blob)(\\\\?.*)?$/i)'
);
content = content.replace(
    /match\(\/\.\(mp4\|webm\|mov\|blob\)\(\?\.\*\)\?\$\/i\)/g,
    'match(/\\\\.(mp4|webm|mov|blob)(\\\\?.*)?$/i)'
);
fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed regex');
