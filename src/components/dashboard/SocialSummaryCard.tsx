"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Anasayfa "Tüm Hesaplar" kartı: toplam takipçi + değişim, platform dağılım çubuğu ve hesap listesi.
// Veri: zernio-client get-follower-stats (hesap başına currentFollowers / growthPercentage).

export type SocialAccountSummary = {
  id: string;
  platform: string;
  name: string;
  username: string;
  picture: string | null;
  followers: number;
  growth: number;
};

const PLATFORMS: Record<string, { icon: string; color: string; label: string }> = {
  facebook: { icon: "fa-brands fa-facebook-f", color: "#1877F2", label: "Facebook" },
  instagram: { icon: "fa-brands fa-instagram", color: "#E1306C", label: "Instagram" },
  youtube: { icon: "fa-brands fa-youtube", color: "#FF0000", label: "YouTube" },
  linkedin: { icon: "fa-brands fa-linkedin-in", color: "#0A66C2", label: "LinkedIn" },
  tiktok: { icon: "fa-brands fa-tiktok", color: "#69C9D0", label: "TikTok" },
  twitter: { icon: "fa-brands fa-x-twitter", color: "#E7E9EA", label: "X" },
  threads: { icon: "fa-brands fa-threads", color: "#B0B0B0", label: "Threads" },
  pinterest: { icon: "fa-brands fa-pinterest-p", color: "#E60023", label: "Pinterest" },
  telegram: { icon: "fa-brands fa-telegram", color: "#2AABEE", label: "Telegram" },
  whatsapp: { icon: "fa-brands fa-whatsapp", color: "#25D366", label: "WhatsApp" },
};
const FALLBACK = { icon: "fa-solid fa-globe", color: "#A5B4FC", label: "" };
const metaOf = (p: string) => PLATFORMS[String(p || "").toLowerCase()] || FALLBACK;

const GREEN = "#22C55E";
const RED = "#EF4444";

function Trend({ value, noChange, size = 12 }: { value: number; noChange: string; size?: number }) {
  if (!value) return <span style={{ color: "var(--text-secondary)", fontSize: size }}>{noChange}</span>;
  const up = value > 0;
  return (
    <span style={{ color: up ? GREEN : RED, fontSize: size, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 3 }}>
      <i className={`fa-solid ${up ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}`} style={{ fontSize: size - 1 }}></i>
      {Math.abs(value)}%
    </span>
  );
}

export default function SocialSummaryCard({ accounts, totalFollowers, trend, locale }: { accounts: SocialAccountSummary[]; totalFollowers: number; trend: number; locale: string }) {
  const t = useTranslations("dashboardHome.social");
  const nf = (n: number) => Number(n || 0).toLocaleString(locale);
  const sorted = [...accounts].sort((a, b) => b.followers - a.followers);
  const sum = sorted.reduce((s, a) => s + a.followers, 0) || 1;
  const shown = sorted.slice(0, 5);

  return (
    <div className="glass neon-cyan" style={{ display: "flex", flexDirection: "column", borderRadius: 20, padding: 24, position: "relative", overflow: "hidden", height: "100%" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 0% 0%, rgba(165,180,252,0.10), transparent 60%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(165,180,252,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A5B4FC" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>{t("allAccounts")}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 11 }}>{t("accountsConnected", { n: sorted.length })}</div>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: "rgba(34,197,94,0.12)", color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.06em" }}>
          <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
          {t("liveAnalysis")}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ color: "var(--text-secondary)", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase" }}>{t("totalFollowers")}</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#FF7A59", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1, textShadow: "0 0 14px rgba(255,122,89,0.3)" }}>{nf(totalFollowers)}</div>
        </div>
        <div style={{ textAlign: "right", paddingBottom: 6 }}>
          <div style={{ color: "var(--text-secondary)", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 2 }}>{t("change")}</div>
          <Trend value={trend} noChange={t("noChange")} size={15} />
        </div>
      </div>

      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2, margin: "14px 0 6px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
        {sorted.map((a) => (
          <div key={a.id} title={`${metaOf(a.platform).label} ${nf(a.followers)}`} style={{ flex: Math.max(a.followers / sum, 0.04), background: metaOf(a.platform).color }} />
        ))}
      </div>

      <div style={{ position: "relative", flex: 1 }}>
        {shown.map((a, i) => {
          const m = metaOf(a.platform);
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
                {a.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.picture} alt="" referrerPolicy="no-referrer" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", background: "rgba(255,255,255,0.06)" }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${m.color}22`, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={m.icon}></i>
                  </div>
                )}
                <span style={{ position: "absolute", right: -3, bottom: -3, width: 18, height: 18, borderRadius: "50%", background: m.color, color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #1a1722" }}>
                  <i className={m.icon}></i>
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name || a.username || m.label}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.label}{a.username ? ` · @${a.username}` : ""}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{nf(a.followers)}</div>
                <Trend value={a.growth} noChange={t("followersShort")} size={11} />
              </div>
            </div>
          );
        })}
        {sorted.length > shown.length && <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 11 }}>+{sorted.length - shown.length}</div>}
      </div>

      <Link href="/analiz" style={{ marginTop: 14, padding: "11px 14px", borderRadius: 12, background: "rgba(165,180,252,0.12)", border: "1px solid rgba(165,180,252,0.3)", color: "#C7D2FE", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative" }}>
        {t("viewAnalysis")} <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}
