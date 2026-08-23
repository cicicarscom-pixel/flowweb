"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PLATFORMS_DATA = [
  { id: "facebook", name: "Facebook", color: "#1877F2", glow: "rgba(24,119,242,0.3)", icon: "👥" },
  { id: "instagram", name: "Instagram", color: "#E1306C", glow: "rgba(225,48,108,0.3)", icon: "📸" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", glow: "rgba(10,102,194,0.3)", icon: "💼" },
  { id: "tiktok", name: "TikTok", color: "#010101", glow: "rgba(105,201,208,0.3)", icon: "🎵" },
  { id: "youtube", name: "YouTube", color: "#FF0000", glow: "rgba(255,0,0,0.3)", icon: "▶️" },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", glow: "rgba(37,211,102,0.3)", icon: "💬" },
  { id: "googlebusiness", name: "Google Business", color: "#4285F4", glow: "rgba(66,133,244,0.3)", icon: "🏢" },
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
    const errorParam = searchParams.get('error') || hashParams.get('error') || searchParams.get('error_description') || hashParams.get('error_description');

    if (errorParam) {
       alert("Bağlantı sırasında bir hata oluştu: " + errorParam);
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
      const organizationId = orgMember?.organization_id;
      if (!organizationId) { setIsLoading(false); return; }

      if (syncWithZernio) {
        await supabase.functions.invoke('zernio-client', {
          body: { action: 'sync-accounts', payload: { organizationId } }
        });
      }

      const { data } = await supabase
        .schema('integration')
        .from('social_accounts')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true);

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
      await supabase.schema('integration').from('social_accounts').update({ is_active: false }).eq('zernio_account_id', accountId);
      
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
      id: platformId, name: platformId, color: '#00f0ff', glow: 'rgba(0,240,255,0.3)', icon: '📱'
    };
  };

  const connectedPlatformIds = accounts.map(a => {
    const id = a.platform.toLowerCase();
    return id.includes('google') ? 'googlebusiness' : id;
  });

  const availablePlatforms = PLATFORMS_DATA.filter(p => !connectedPlatformIds.includes(p.id));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200 }}>
      {/* 2'li Hızlı Erişim Butonları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/sosyal-medya/posts" className="group glass p-6 rounded-2xl border border-app-border hover:border-[#00f0ff]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/30 group-hover:border-[#00f0ff]/60 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <i className="fa-solid fa-layer-group text-[#00f0ff] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Tüm Gönderiler</h3>
            <p className="text-xs text-app-muted font-jetbrains">Yayın akışınızı yönetin</p>
          </div>
        </Link>

        <Link href="/sosyal-medya/share" className="group glass p-6 rounded-2xl border border-app-border hover:border-[#4edea3]/50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 hover:scale-[1.02] shadow-none hover:shadow-[0_0_30px_rgba(78,222,163,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 rounded-full bg-[#4edea3]/10 flex items-center justify-center border border-[#4edea3]/30 group-hover:border-[#4edea3]/60 transition-colors shadow-[0_0_15px_rgba(78,222,163,0.2)]">
            <i className="fa-solid fa-paper-plane text-[#4edea3] text-2xl"></i>
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-lg font-bold text-on-surface mb-1 font-outfit">Paylaşım Merkezi</h3>
            <p className="text-xs text-app-muted font-jetbrains">Oluşturduğunuz içeriği paylaşın</p>
          </div>
        </Link>
      </div>

      {/* Eklediğiniz Hesaplarınız (Bağlı Olanlar) */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#e5e2e3" }}>Eklediğiniz Hesaplarınız</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tüm kanallarınızı tek merkezden yönetin</p>
          </div>
          <button 
            onClick={() => fetchAccounts(true)}
            className="fab flex items-center gap-2 px-4 py-2" 
            style={{ background: "linear-gradient(135deg,rgba(0,240,255,0.15),rgba(78,222,163,0.15))", color: "#00f0ff", border: "1.5px solid rgba(0,240,255,0.3)", borderRadius: 99, fontSize: 14, fontWeight: 600 }}
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
                      background: "rgba(78,222,163,0.15)",
                      color: "#4edea3",
                      border: "1px solid rgba(78,222,163,0.3)",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      ✓ Bağlı
                    </div>
                  </div>

                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#e5e2e3" }} className="truncate">
                    {acc.username ? `@${acc.username}` : (acc.display_name || p.name)}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 12 }}>
                    Aktif ve eşzamanlı
                  </p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="pill-btn" style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.08)", padding: "6px", borderRadius: 8 }}
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
            <i className="fa-solid fa-link-slash text-4xl text-[#849495] opacity-50 mb-4"></i>
            <p className="text-[#849495] text-sm">Bağlı sosyal medya hesabınız bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Hesabınızı Ekleyin (Boşta Olanlar) */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#e5e2e3" }}>Yeni Hesap Bağla</h2>
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

                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#e5e2e3" }}>{p.name}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 12 }}>
                  Henüz bağlanmadı
                </p>

                <button 
                  onClick={() => handleConnectZernio(p.id)}
                  disabled={isConnecting === p.id}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `${p.glow.replace("0.3","0.12")}`, color: p.color, border: `1px solid ${p.glow.replace("0.3","0.3")}`, fontSize: 12, padding: "8px", borderRadius: 8, fontWeight: 600, opacity: isConnecting === p.id ? 0.5 : 1, cursor: isConnecting === p.id ? 'not-allowed' : 'pointer' }}
                >
                  {isConnecting === p.id ? "Bağlanıyor..." : "Hesap Bağla"}
                </button>
              </div>
            ))}
          </ScrollableContainer>
        ) : (
          <p className="text-sm text-[#849495]">Tüm popüler platformları bağladınız!</p>
        )}
      </div>

    </div>
  );
}
