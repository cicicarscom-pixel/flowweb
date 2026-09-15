const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');
let lines = content.split('\n');

lines[487] = lines[487].replace('??', '\uD83D\uDCC8');
lines[503] = lines[503].replace('??', '\uD83D\uDC51');

content = lines.join('\n');
fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed by line index');
