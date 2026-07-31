const fs = require('fs');

let content = fs.readFileSync('c:/Users/roman/flowweb/src/app/(dashboard)/sosyal-medya/share/page.tsx', 'utf8');

// Replace HTML comments
content = content.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

fs.writeFileSync('c:/Users/roman/flowweb/src/app/(dashboard)/sosyal-medya/share/page.tsx', content);
console.log("Successfully fixed comments.");
