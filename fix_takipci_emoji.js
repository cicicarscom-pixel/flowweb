const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

content = content.replace(/>\?\?<\/span>\s*<h3 style=\{\{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" \}\}>Platform Bazýnda Takipçi Artýþý<\/h3>/g, '>\uD83D\uDCC8</span>\n            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" }}>Platform Bazýnda Takipçi Artýþý</h3>');

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed Takipci emoji');
