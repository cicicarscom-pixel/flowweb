"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useUnreadAppointmentCount } from "@/components/dashboard/AppointmentNotifications";
import { useProfile } from "@/providers/ProfileProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [dateStr, setDateStr] = useState("");
  const unreadCount = useUnreadAppointmentCount();
  const supabase = createClient();
  const { organization } = useProfile();

  useEffect(() => {
    // 'tr-TR' hardcode edilmişti — artık kullanıcının seçtiği/algılanan dile
    // göre (next-intl'in useLocale() ile döndürdüğü 'tr' | 'en' | 'de')
    // biçimleniyor, örn. İngilizce'de "Friday, September 5, 2026". Dil
    // değiştiğinde (bkz. LanguageSwitcher → router.refresh()) bu effect
    // yeniden çalışıp tarihi doğru dilde yeniden biçimlendirir.
    setDateStr(new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, [locale]);

  let pageTitle = t("header.titles.home");
  if (pathname === "/") pageTitle = t("header.titles.home");
  else if (pathname.includes("ai-asistan")) pageTitle = t("header.titles.aiAssistant");
  else if (pathname.includes("ai-muhasebe")) {
    pageTitle = pathname.includes("odeme-takvimi") ? t("header.titles.aiAccountingPaymentCalendar") : t("header.titles.aiAccounting");
  }
  else if (pathname.includes("sosyal-medya")) pageTitle = t("header.titles.socialMedia");
  else if (pathname.includes("analiz")) pageTitle = t("header.titles.analytics");
  else if (pathname.includes("gelen-kutusu")) pageTitle = t("header.titles.inbox");

  return (
    <header className="glass-strong" style={{
      position: "sticky", top: 0, zIndex: 20,
      padding: "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexShrink: 0, background: "#17151A"
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "Outfit, sans-serif", marginBottom: 1, color: "#fff" }}>
          {pageTitle}
        </h1>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
          {dateStr}
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button 
          onClick={() => router.push('/gelen-kutusu?tab=bildirimler')}
          className="pill-btn" 
          style={{ position: "relative", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 14 }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C2478D", position: "absolute", top: 4, right: 4, boxShadow: "0 0 6px #C2478D" }} />
          )}
        </button>
      </div>
    </header>
  );
}
