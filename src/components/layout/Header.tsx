"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/providers/ProfileProvider";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [dateStr, setDateStr] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();
  const { organization } = useProfile();

  useEffect(() => {
    fetchUnreadCount();

    let channel = supabase.channel('header_notifications');
    
    if (organization?.id) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `profile_id=eq.${organization.id}` }, () => {
        fetchUnreadCount();
      });
    }

    channel = channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'broadcast_notifications' }, () => {
      fetchUnreadCount();
    }).subscribe();

    window.addEventListener('refresh_unread_count', fetchUnreadCount);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('refresh_unread_count', fetchUnreadCount);
    };
  }, [organization, locale]);

  useEffect(() => {
    // 'tr-TR' hardcode edilmişti — artık kullanıcının seçtiği/algılanan dile
    // göre (next-intl'in useLocale() ile döndürdüğü 'tr' | 'en' | 'de')
    // biçimleniyor, örn. İngilizce'de "Friday, September 5, 2026". Dil
    // değiştiğinde (bkz. LanguageSwitcher → router.refresh()) bu effect
    // yeniden çalışıp tarihi doğru dilde yeniden biçimlendirir.
    setDateStr(new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, [locale]);

  const fetchUnreadCount = async () => {
    let regularCount = 0;
    
    // 1. Fetch normal notifications (organization scoped) if org exists
    if (organization?.id) {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', organization.id)
        .eq('is_read', false);
      regularCount = count || 0;
    }

    // 2. Fetch broadcast notifications (user scoped)
    const { data: { session } } = await supabase.auth.getSession();
    let broadcastUnreadCount = 0;
    
    if (session?.user) {
      const { data: profileData } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).limit(1);
      const userType = profileData?.[0]?.user_type || 'business';

      const { count: totalBroadcasts } = await supabase
        .from('broadcast_notifications')
        .select('id', { count: 'exact', head: true })
        .in('target', ['all', userType]);

      const { count: readBroadcasts } = await supabase
        .from('broadcast_reads')
        .select('broadcast_id', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      broadcastUnreadCount = Math.max(0, (totalBroadcasts || 0) - (readBroadcasts || 0));
    }
    
    setUnreadCount(regularCount + broadcastUnreadCount);
  };
  
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
