const f = 'C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/page.tsx';
let c = await Deno.readTextFile(f);

const target = `              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{t("aiAsistanPage.liveTest.title")}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>`;

const replacement = `              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573" }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{t("aiAsistanPage.liveTest.title")}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-300)", paddingLeft: 18 }}>Bu alan yapay zekanın ilk tepkisi içindir, hafızası yoktur. Akış testi için WhatsApp'ı kullanın.</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>`;

c = c.replace(target, replacement);

await Deno.writeTextFile(f, c);
console.log("Updated Canlı Test header");
