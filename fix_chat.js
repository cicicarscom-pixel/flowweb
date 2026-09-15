const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/page.tsx', 'utf8');
content = content.replace(
  '<div style={{ textAlign: "center", marginBottom: 8 }}>',
  '<div style={{ textAlign: "center", marginBottom: 8, marginTop: "auto" }}>'
);
fs.writeFileSync('src/app/(dashboard)/ai-asistan/page.tsx', content);
console.log("Done");
