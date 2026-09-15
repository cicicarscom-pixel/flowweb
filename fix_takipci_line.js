const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');
let lines = content.split('\n');

lines[587] = lines[587].replace('??', '\uD83D\uDCC8');

content = lines.join('\n');
fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed Takipci emoji by line');
