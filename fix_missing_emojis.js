const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/analiz/page.tsx', 'utf8');

content = content.replace(
  /<span style={{ fontSize: 16, opacity: 0\.6 }}>\?\?<\/span>\s*<p style={{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" }}>\{t\("analizPage\.posting\.totalFollowers"\)\}<\/p>/g,
  '<span style={{ fontSize: 16, opacity: 0.6 }}>\uD83D\uDC65</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalFollowers")}</p>'
);

content = content.replace(
  /<span style={{ fontSize: 16, opacity: 0\.6 }}>\?<\/span>\s*<p style={{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" }}>\{t\("analizPage\.posting\.totalReviews"\)\}<\/p>/g,
  '<span style={{ fontSize: 16, opacity: 0.6 }}>\u2B50</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalReviews")}</p>'
);

content = content.replace(
  /<span style={{ fontSize: 16, opacity: 0\.6 }}>\?\?<\/span>\s*<p style={{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" }}>Toplam Eriþim<\/p>/g,
  '<span style={{ fontSize: 16, opacity: 0.6 }}>\uD83D\uDCC8</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Eriþim</p>'
);

content = content.replace(
  /<span style={{ fontSize: 16, opacity: 0\.6 }}>\?\?<\/span>\s*<p style={{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" }}>Engagement Rate<\/p>/g,
  '<span style={{ fontSize: 16, opacity: 0.6 }}>\uD83D\uDD25</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Engagement Rate</p>'
);

content = content.replace(
  /<span style={{ fontSize: 16, opacity: 0\.6 }}>\?\?<\/span>\s*<p style={{ color: "var\(--text-secondary\)", fontSize: 12, fontWeight: 600, letterSpacing: "0\.06em" }}>En Ýyi Gönderi<\/p>/g,
  '<span style={{ fontSize: 16, opacity: 0.6 }}>\uD83D\uDC51</span>\n              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ýyi Gönderi</p>'
);

fs.writeFileSync('src/app/(dashboard)/analiz/page.tsx', content, 'utf8');
console.log('Replaced missing emojis');
