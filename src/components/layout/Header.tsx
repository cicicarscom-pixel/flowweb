"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [dateStr, setDateStr] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    fetchUnreadCount();
    
    const channel = supabase.channel('header_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnreadCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', session.user.id)
      .eq('is_read', false);
    if (count !== null) setUnreadCount(count);
  };
  
  let pageTitle = "Anasayfa";
  if (pathname === "/") pageTitle = "Anasayfa";
  else if (pathname.includes("ai-asistan")) pageTitle = "Ai Asistan";
  else if (pathname.includes("ai-muhasebe")) {
    pageTitle = pathname.includes("odeme-takvimi") ? "Ai Muhasebe / Ödeme Takvimi" : "Ai Muhasebe";
  }
  else if (pathname.includes("sosyal-medya")) pageTitle = "Sosyal Medya";
  else if (pathname.includes("analiz")) pageTitle = "Analiz";
  else if (pathname.includes("gelen-kutusu")) pageTitle = "Gelen Kutusu";

  return (
    <header className="glass-strong" style={{
      position: "sticky", top: 0, zIndex: 20,
      padding: "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexShrink: 0, background: "#0b0c10"
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
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#bc13fe", position: "absolute", top: 4, right: 4, boxShadow: "0 0 6px #bc13fe" }} />
          )}
        </button>
      </div>
    </header>
  );
}
