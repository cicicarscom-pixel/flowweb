const fs = require('fs');
let content = fs.readFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/analiz/page.tsx', 'utf8');

content = content.replace(/if \(merchantId\)/g, 'if (session?.user?.id)');
content = content.replace(/owner_id', merchantId\)/g, "owner_id', session?.user?.id)");

fs.writeFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
