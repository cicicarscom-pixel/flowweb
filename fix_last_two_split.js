const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

const t1 = '??</span>\r\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Eriþim</p>';
const t2 = '\uD83D\uDCC8</span>\r\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Eriþim</p>';

const e1 = '??</span>\r\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ýyi Gönderi</p>';
const e2 = '\uD83D\uDC51</span>\r\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ýyi Gönderi</p>';

content = content.split(t1).join(t2);
content = content.split(e1).join(e2);

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Split and joined with rn');
