"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PLATFORMS_DATA = [
  { id: "facebook", name: "Facebook", color: "#1877F2", glow: "rgba(24,119,242,0.3)", icon: "👥" },
  { id: "instagram", name: "Instagram", color: "#E1306C", glow: "rgba(225,48,108,0.3)", icon: "📸" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", glow: "rgba(10,102,194,0.3)", icon: "💼" },
  { id: "twitter", name: "X", color: "#ffffff", glow: "rgba(255,255,255,0.3)", icon: "✖️" },
  { id: "tiktok", name: "TikTok", color: "#010101", glow: "rgba(105,201,208,0.3)", icon: "🎵" },
  { id: "youtube", name: "YouTube", color: "#FF0000", glow: "rgba(255,0,0,0.3)", icon: "▶️" },
  { id: "pinterest", name: "Pinterest", color: "#E60023", glow: "rgba(230,0,35,0.3)", icon: "📌" },
  { id: "googlebusiness", name: "Google Business", color: "#4285F4", glow: "rgba(66,133,244,0.3)", icon: "🏢" },
  { id: "reddit", name: "Reddit", color: "#FF4500", glow: "rgba(255,69,0,0.3)", icon: "🤖" },
  { id: "telegram", name: "Telegram", color: "#2AABEE", glow: "rgba(42,171,238,0.3)", icon: "✈️" },
  { id: "bluesky", name: "Bluesky", color: "#0085ff", glow: "rgba(0,133,255,0.3)", icon: "☁️" },
  { id: "threads", name: "Threads", color: "#ffffff", glow: "rgba(255,255,255,0.3)", icon: "🧵" },
  { id: "snapchat", name: "Snapchat", color: "#fffc00", glow: "rgba(255,252,0,0.3)", icon: "👻" },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", glow: "rgba(37,211,102,0.3)", icon: "💬" },
  { id: "discord", name: "Discord", color: "#5865F2", glow: "rgba(88,101,242,0.3)", icon: "👾" },
  { id: "meta_ads", name: "Meta Ads", color: "#0668E1", glow: "rgba(6,104,225,0.3)", icon: "📈", isAd: true },
  { id: "google_ads", name: "Google Ads", color: "#EA4335", glow: "rgba(234,67,53,0.3)", icon: "📊", isAd: true },
  { id: "linkedin_ads", name: "LinkedIn Ads", color: "#0A66C2", glow: "rgba(10,102,194,0.3)", icon: "💼", isAd: true },
  { id: "tiktok_ads", name: "TikTok Ads", color: "#010101", glow: "rgba(255,255,255,0.3)", icon: "📱", isAd: true },
  { id: "pinterest_ads", name: "Pinterest Ads", color: "#E60023", glow: "rgba(230,0,35,0.3)", icon: "📌", isAd: true },
  { id: "x_ads", name: "X Ads", color: "#ffffff", glow: "rgba(255,255,255,0.3)", icon: "✖️", isAd: true },
];

function ScrollableContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ 
        display: "flex", overflowX: "auto", gap: 16, paddingBottom: 16, 
        cursor: isDown ? "grabbing" : "grab",
        scrollbarWidth: "none", msOverflowStyle: "none"
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
      {children}
    </div>
  );
}

export default function SosyalMedyaPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    
    const accountId = searchParams.get('accountId') || hashParams.get('accountId');
    const errorParam = searchParams.get('error') || hashParams.get('error');
    const errorMessage = searchParams.get('error_message') || hashParams.get('error_message') || searchParams.get('error_description') || hashParams.get('error_description');

    if (errorParam || errorMessage) {
       const displayError = errorMessage ? decodeURIComponent(errorMessage.replace(/\+/g, ' ')) : errorParam;
       alert("Bağlantı sırasında bir hata oluştu: " + displayError);
       window.history.replaceState({}, '', window.location.pathname);
    } else if (accountId) {
      fetchAccounts(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      fetchAccounts();
    }

    // Web Focus Radar: Kullanıcı tarayıcı sekmesine döndüğünde Zernio hesaplarını anlık sync et
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAccounts(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchAccounts = async (syncWithZernio = false) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) { setIsLoading(false); return; }

      const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).maybeSingle();
      const organizationId = orgMember?.organization_id || userId;

      if (syncWithZernio) {
        await supabase.functions.invoke('zernio-client', {
          body: { action: 'sync-accounts', payload: { userId, organizationId } }
        });
      }

      const { data } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('profile_id', organizationId)
        .eq('status', 'active');

      if (data) {
        setAccounts(data);
      }
    } catch (err) {
      console.warn("Error fetching accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectZernio = async (platformId: string) => {
    setIsConnecting(platformId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error("Oturum bulunamadı");
      
      const { data: orgMember } = await supabase.from('organization_members').select('organization_id, organizations(name)').eq('user_id', userId).maybeSingle();
      const organizationId = orgMember?.organization_id || userId;
      const organizationName = (orgMember?.organizations as any)?.name || 'Bireysel Hesap';

      const redirectUrl = window.location.origin + '/sosyal-medya'; 
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: { action: 'get-connect-url', payload: { platform: platformId, redirectUrl, organizationId, organizationName, userId, profileId: organizationId } }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.data?.authUrl) {
        window.location.href = data.data.authUrl;
      }
    } catch (err: any) {
      console.warn("Error connecting account:", err);
      alert(`Hesap bağlama linki alınırken bir hata oluştu: ${err.message || err}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm("Bu hesabın bağlantısını kesmek istediğinize emin misiniz?")) return;
    
    try {
      setAccounts(prev => prev.filter(acc => acc.zernio_account_id !== accountId));
      
      await supabase.functions.invoke('zernio-client', {
        body: { action: 'disconnect-account', payload: { accountId } }
      });
      await supabase.from('social_accounts').update({ status: 'inactive' }).eq('zernio_account_id', accountId);
      
      fetchAccounts();
    } catch (err) {
      console.warn("Error disconnecting account:", err);
      alert("Bağlantı kesilirken bir hata oluştu.");
    }
  };

  const getPlatformInfo = (platformId: string) => {
    const id = platformId.toLowerCase();
    // try to match with generic names (e.g. google -> googlebusiness)
    const normalizedId = id.includes('google') ? 'googlebusiness' : id;
    return PLATFORMS_DATA.find(p => p.id === normalizedId) || {
      id: platformId, name: platformId, color: '#FF7A59', glow: 'rgba(255,122,89,0.3)', icon: '📱'
    };
  };

  const availablePlatforms = PLATFORMS_DATA;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      {/* 2'li Hızlı Erişim Butonları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/sosyal-medya/posts" className="group glass p-6 rounded-2xl border border-dark-border hover:border-[#FF7A59]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(255,122,89,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#FF7A59]/10 flex items-center justify-center border border-[#FF7A59]/30 group-hover:border-[#FF7A59]/60 transition-colors shadow-[0_0_15px_rgba(255,122,89,0.2)]">
            <i className="fa-solid fa-layer-group text-[#FF7A59] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Tüm Gönderiler</h3>
            <p className="text-xs text-dark-muted font-jetbrains">Yayın akışınızı yönetin</p>
          </div>
        </Link>

        <Link href="/sosyal-medya/share" className="group glass p-6 rounded-2xl border border-dark-border hover:border-[#22B573]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(34,181,115,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#22B573]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#22B573]/10 flex items-center justify-center border border-[#22B573]/30 group-hover:border-[#22B573]/60 transition-colors shadow-[0_0_15px_rgba(34,181,115,0.2)]">
            <i className="fa-solid fa-paper-plane text-[#22B573] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Paylaşım Merkezi</h3>
            <p className="text-xs text-dark-muted font-jetbrains">Oluşturduğunuz içeriği paylaşın</p>
          </div>
        </Link>
      </div>

      {/* Eklediğiniz Hesaplarınız (Bağlı Olanlar) */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#F6F1EC" }}>Eklediğiniz Hesaplarınız</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tüm kanallarınızı tek merkezden yönetin</p>
          </div>
          <button 
            onClick={() => fetchAccounts(true)}
            className="fab flex items-center gap-2 px-4 py-2" 
            style={{ background: "linear-gradient(135deg,rgba(255,122,89,0.15),rgba(34,181,115,0.15))", color: "#FF7A59", border: "1.5px solid rgba(255,122,89,0.3)", borderRadius: 99, fontSize: 14, fontWeight: 600 }}
          >
            <i className={`fa-solid fa-rotate ${isLoading ? 'animate-spin' : ''}`}></i> Senkronize Et
          </button>
        </div>

        {accounts.length > 0 ? (
          <ScrollableContainer>
            {accounts.map(acc => {
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
                    border: `1px solid ${p.glow.replace("0.3","0.35")}`,
                    boxShadow: `0 0 24px ${p.glow}`,
                    userSelect: "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 14,
                      background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                      boxShadow: `0 0 16px ${p.glow}`,
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
                      ✓ Bağlı
                    </div>
                  </div>

                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, color: "#F6F1EC" }}>
                    {p.name}
                  </p>
                  <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, color: p.id.includes('tiktok') ? '#69C9D0' : (p.color || "#22B573") }} className="truncate">
                    {acc.account_name && acc.account_name !== p.name && acc.account_name !== 'unknown' 
                      ? (acc.account_name.startsWith('@') ? acc.account_name : `@${acc.account_name}`) 
                      : `@${p.name.toLowerCase()}_hesabi`}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 14 }}>
                    Aktif ve eşzamanlı
                  </p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="pill-btn" style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                      onClick={(e) => { e.stopPropagation(); handleDisconnect(acc.zernio_account_id) }}
                    >
                      Bağlantıyı Kes
                    </button>
                  </div>
                </div>
              );
            })}
          </ScrollableContainer>
        ) : (
          <div className="glass flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 text-center">
            <i className="fa-solid fa-link-slash text-4xl text-[#A79E96] opacity-50 mb-4"></i>
            <p className="text-[#A79E96] text-sm">Bağlı sosyal medya hesabınız bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Hesabınızı Ekleyin (Boşta Olanlar) */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#F6F1EC" }}>Yeni Hesap Bağla</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Diğer platformlardaki kitlelerinize ulaşın</p>
        
        {availablePlatforms.length > 0 ? (
          <ScrollableContainer>
            {availablePlatforms.map(p => (
              <div
                key={p.id}
                className="glass platform-card"
                style={{
                  minWidth: 220,
                  flex: "0 0 auto",
                  borderRadius: 20, padding: "16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  userSelect: "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: p.id === "instagram" ? "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" : p.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {p.icon}
                  </div>
                </div>

                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#F6F1EC" }}>{p.name}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 12 }}>
                  Henüz bağlanmadı
                </p>

                <button 
                  onClick={() => handleConnectZernio(p.id)}
                  disabled={isConnecting === p.id}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `${p.glow.replace("0.3","0.12")}`, color: p.id.includes('tiktok') ? '#69C9D0' : p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, fontSize: 12, padding: "8px", borderRadius: 8, fontWeight: 600, opacity: isConnecting === p.id ? 0.5 : 1, cursor: isConnecting === p.id ? 'not-allowed' : 'pointer' }}
                >
                  {isConnecting === p.id ? "Bağlanıyor..." : "Hesap Bağla"}
                </button>
              </div>
            ))}
          </ScrollableContainer>
        ) : (
          <p className="text-sm text-[#A79E96]">Tüm popüler platformları bağladınız!</p>
        )}
      </div>

    </div>
  );
}

