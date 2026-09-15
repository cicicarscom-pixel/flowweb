const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

content = content.replace(/>\?\?<\/span>\s*<p style=\{\{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" \}\}>Toplam Eriþim<\/p>/g, '>\uD83D\uDCC8</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Eriþim</p>');

content = content.replace(/>\?\?<\/span>\s*<p style=\{\{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" \}\}>En Ýyi Gönderi<\/p>/g, '>\uD83D\uDC51</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ýyi Gönderi</p>');

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Fixed last two');
