const fs = require('fs');

const file_path = 'src/app/(dashboard)/sosyal-medya/page.tsx';
let content = fs.readFileSync(file_path, 'utf8');

const startStr = '{accounts.length > 0 ? (';
let start_idx = content.indexOf(startStr);

// The block to replace ends at the matching parentheses for `accounts.length > 0 ? (...) : (...)`
// To be safe, I'll use a precise regex or index logic.
const endStr = `            <p className="text-[#A79E96] text-sm">{t("sosyalMedyaPage.noConnectedAccounts")}</p>
          </div>
        )}`;
let end_idx = content.indexOf(endStr) + endStr.length;

const new_block = `        {(() => {
          const needsReconnectionAccounts = accounts.filter(a => a.needs_reconnection);
          const healthyAccounts = accounts.filter(a => !a.needs_reconnection);

          return (
            <>
              {needsReconnectionAccounts.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FF7A59", marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    {t("sosyalMedyaPage.status.needsReconnectionTitle")}
                  </h3>
                  <ScrollableContainer>
                    {needsReconnectionAccounts.map(acc => {
                      const p = getPlatformInfo(acc.platform);
                      return (
                        <div
                          key={acc.id}
                          className="glass platform-card"
                          style={{
                            minWidth: 220,
                            minHeight: 200,
                            flex: "0 0 auto",
                            borderRadius: 20, padding: "16px",
                            border: \`1px solid \${p.glow.replace("0.3","0.35")}\`,
                            boxShadow: \`0 0 24px \${p.glow}\`,
                            userSelect: "none",
                            opacity: 0.8
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 14,
                              background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 18,
                              boxShadow: \`0 0 16px \${p.glow}\`,
                            }}>
                              {p.icon}
                            </div>
                            <div style={{
                              padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                              background: "rgba(255,122,89,0.15)",
                              color: "#FF7A59",
                              border: "1px solid rgba(255,122,89,0.3)",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <i className="fa-solid fa-triangle-exclamation"></i> {t("sosyalMedyaPage.status.needsReconnection")}
                            </div>
                          </div>
                          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, color: "#F6F1EC" }}>
                            {p.name}
                          </p>
                          <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, color: p.id.includes('tiktok') ? '#69C9D0' : (p.color || "#22B573") }} className="truncate">
                            {acc.username && acc.username !== p.name && acc.username !== 'unknown'
                              ? (acc.username.startsWith('@') ? acc.username : \`@\${acc.username}\`)
                              : \`@\${p.name.toLowerCase()}\${t("sosyalMedyaPage.accountSuffix")}\`}
                          </p>
                          <p style={{ color: "#FF7A59", fontSize: 12, marginBottom: 14 }}>
                            {t("sosyalMedyaPage.status.connectionLost")}
                          </p>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="pill-btn" style={{ flex: 1, justifyContent: "center", background: "rgba(255,122,89,0.1)", color: "#FF7A59", border: "1px solid rgba(255,122,89,0.2)", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                              onClick={(e) => { e.stopPropagation(); handleConnectZernio(acc.platform) }}
                            >
                              <i className="fa-solid fa-plug"></i> {t("sosyalMedyaPage.reconnectButton")}
                            </button>
                            <button className="pill-btn" style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                              onClick={(e) => { e.stopPropagation(); handleDisconnect(acc.zernio_account_id) }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </ScrollableContainer>
                </div>
              )}

              {healthyAccounts.length > 0 ? (
                <ScrollableContainer>
                  {healthyAccounts.map(acc => {
                    const p = getPlatformInfo(acc.platform);
                    return (
                      <div
                        key={acc.id}
                        className="glass platform-card"
                        style={{
                          minWidth: 220,
                          minHeight: 200,
                          flex: "0 0 auto",
                          borderRadius: 20, padding: "16px",
                          border: \`1px solid \${p.glow.replace("0.3","0.35")}\`,
                          boxShadow: \`0 0 24px \${p.glow}\`,
                          userSelect: "none"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 14,
                            background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18,
                            boxShadow: \`0 0 16px \${p.glow}\`,
                          }}>
                            {p.icon}
                          </div>
                          <div style={{
                            padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                            background: "rgba(34,181,115,0.15)",
                            color: "#22B573",
                            border: "1px solid rgba(34,181,115,0.3)",
                            display: "flex", alignItems: "center", gap: 4,
                          }}>
                            ? {t("sosyalMedyaPage.status.connected")}
                          </div>
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, color: "#F6F1EC" }}>
                          {p.name}
                        </p>
                        <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, color: p.id.includes('tiktok') ? '#69C9D0' : (p.color || "#22B573") }} className="truncate">
                          {acc.username && acc.username !== p.name && acc.username !== 'unknown'
                            ? (acc.username.startsWith('@') ? acc.username : \`@\${acc.username}\`)
                            : \`@\${p.name.toLowerCase()}\${t("sosyalMedyaPage.accountSuffix")}\`}
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 14 }}>
                          {t("sosyalMedyaPage.status.activeAndSynced")}
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="pill-btn" style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                            onClick={(e) => { e.stopPropagation(); handleDisconnect(acc.zernio_account_id) }}
                          >
                            {t("sosyalMedyaPage.disconnectButton")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </ScrollableContainer>
              ) : (
                needsReconnectionAccounts.length === 0 && (
                  <div className="glass flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 text-center">
                    <i className="fa-solid fa-link-slash text-4xl text-[#A79E96] opacity-50 mb-4"></i>
                    <p className="text-[#A79E96] text-sm">{t("sosyalMedyaPage.noConnectedAccounts")}</p>
                  </div>
                )
              )}
            </>
          );
        })()}`;

content = content.substring(0, start_idx) + new_block + content.substring(end_idx);
fs.writeFileSync(file_path, content);
console.log("Done page.tsx");
