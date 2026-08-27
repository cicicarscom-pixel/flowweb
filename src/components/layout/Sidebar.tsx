"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
    const pathname = usePathname();
  const router = useRouter();
  
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  const [userName, setUserName] = useState("Kullanıcı");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1758520145147-c30bc656f314?w=36&h=36&fit=crop&auto=format");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("authorized_person, business_name, avatar_url")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          const metadata = session.user.user_metadata;
          const googleName = metadata?.full_name || metadata?.name;
          setUserName(profile.authorized_person || profile.business_name || googleName || "Kullanıcı");
          let av = profile.avatar_url;
          if (av && av.startsWith('file://')) {
            av = null;
          } else if (av && !av.startsWith('http')) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(av);
            av = data.publicUrl;
          }

          if (av) {
            setAvatar(av);
          } else {
            setAvatar('https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.business_name || 'Esnaf') + '&background=00daf3&color=fff');
          }
        }
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    { href: "/", label: "Anasayfa", icon: "⬡", color: "#FF7A59" },
    { href: "/ai-asistan", label: "Ai Asistan", icon: "◉", color: "#FF7A59" },
    { href: "/ai-muhasebe", label: "Ai Muhasebe", icon: "▤", color: "#F59E0B" },
    { href: "/sosyal-medya", label: "Sosyal Medya", icon: "◎", color: "#C2478D" },
    { href: "/gelen-kutusu", label: "Gelen Kutusu", icon: "📥", color: "#EF4444" },
    { href: "/analiz", label: "Analiz", icon: "◈", color: "#22B573" },
  ];

  return (
    <aside className="glass-strong" style={{
      width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", zIndex: 10, position: "relative",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
          <img src="/logo.png" alt="Workigom Flow" style={{ height: 43, width: "auto", objectFit: "contain" }} />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const color = item.color;
          
          let bgRgb = "255,122,89";
          if (color === "#C2478D") bgRgb = "194,71,141";
          if (color === "#22B573") bgRgb = "34,181,115";
          if (color === "#FF7A59") bgRgb = "255,122,89";
          if (color === "#F59E0B") bgRgb = "245,158,11";
          if (color === "#EF4444") bgRgb = "239,68,68";

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 12, cursor: "pointer", border: "none",
                background: active ? `rgba(${bgRgb},0.1)` : "transparent",
                color: active ? color : "var(--text-secondary)",
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: active ? 600 : 400,
                textAlign: "left", transition: "all 0.2s",
                boxShadow: active ? `inset 3px 0 0 ${color}` : "none",
                textDecoration: "none"
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.5, color: active ? color : "inherit" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{ padding: "14px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/profil" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
            <img
              src={avatar}
              alt="Kullanıcı profili"
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", border: "1.5px solid rgba(255,122,89,0.2)" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</p>
              <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Pro Plan</p>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B573", boxShadow: "0 0 8px #22B573", flexShrink: 0 }} />
          </div>
        </Link>

        <button 
          onClick={handleLogout}
          style={{
            width: "100%", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "rgba(239,68,68, 0.05)", border: "1px solid rgba(239,68,68, 0.2)",
            borderRadius: 8, color: "#EF4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>⏻</span> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}



