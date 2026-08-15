"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [aiActive, setAiActive] = useState(true);
  const [financeStats, setFinanceStats] = useState({ income: 0, expense: 0 });
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [socialStats, setSocialStats] = useState({ followers: 0, trend: 12 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [commLogs, setCommLogs] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let merchantId = session?.user?.id || null;

        // Bot Status
        if (merchantId) {
          const { data: botData } = await supabase
            .from('bot_settings')
            .select('is_active')
            .eq('merchant_id', merchantId)
            .maybeSingle();
          if (botData) setAiActive(botData.is_active);
        }

        // Finance Stats (Transactions + Finance Documents)
        let inc = 0, exp = 0;
        let upcoming: any[] = [];
        const today = new Date().toISOString().split('T')[0];

        const { data: transactions } = await supabase.from('transactions').select('*');
        if (transactions) {
          transactions.forEach(t => {
            if (t.type === 'income') inc += Number(t.amount);
            if (t.type === 'expense') {
              exp += Number(t.amount);
              if (t.date && t.date >= today) {
                upcoming.push({ ...t, description: t.title || 'Ödeme' });
              }
            }
          });
        }

        let orgId = null;
        if (merchantId) {
          const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', merchantId).maybeSingle();
          orgId = orgMember?.organization_id;
        }

        if (orgId) {
          const { data: docs } = await supabase.from('finance_documents').select('*').eq('organization_id', orgId);
          if (docs) {
            docs.forEach(d => {
              const amt = Number(d.amount_minor) / 100;
              if (d.type === 'income' || d.type === 'sales') {
                if (d.flow_payment_status === 'paid') inc += amt;
              } else if (d.type === 'expense') {
                if (d.flow_payment_status === 'paid') {
                  exp += amt;
                } else {
                  const docDate = d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : null;
                  if (docDate && docDate >= today) {
                    upcoming.push({ id: d.id, date: docDate, amount: amt, description: d.title || 'Fatura Ödemesi', type: 'expense' });
                  }
                }
              }
            });
          }
        }

        upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setUpcomingPayments(upcoming.slice(0, 5));
        setFinanceStats({ income: inc, expense: exp });

        // Social Stats (Zernio)
        const { data: followRes, error: followErr } = await supabase.functions.invoke('zernio-client', {
          body: { action: 'get-follower-stats', payload: {} }
        });
        
        let totalFollowers = 0;
        const actualFollow = followRes?.data?.data?.data || followRes?.data?.data || {};
        if (actualFollow.accounts) {
           totalFollowers = actualFollow.accounts.reduce((sum: number, a: any) => sum + (a.currentFollowers || 0), 0);
        }
        setSocialStats(prev => ({ ...prev, followers: totalFollowers }));

        // Recent Activities (Messages & Comments)
        const [{ data: msgs }, { data: comments }] = await Promise.all([
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(5)
        ]);
        
        let merged: any[] = [];
        if (msgs) {
          merged = [...merged, ...msgs.map(m => ({
            id: 'msg_'+m.id,
            type: 'MESAJ',
            platform: 'WHATSAPP',
            name: m.sender_name || 'Müşteri',
            message: m.message_body || m.content || '',
            date: m.created_at,
            color: "#00daf3"
          }))];
        }
        if (comments) {
          merged = [...merged, ...comments.map(c => ({
            id: 'cmt_'+c.id,
            type: 'YORUM',
            platform: (c.platform || 'INSTAGRAM').toUpperCase(),
            name: c.username || 'Kullanıcı',
            message: c.text || c.content || '',
            date: c.created_at,
            color: "#ecb2ff"
          }))];
        }
        
        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivities(merged.slice(0, 3));

        // Appointments (Dummy fallback if table not ready)
        // Adjust this query based on actual schema
        const { data: appts } = await supabase.from('appointments').select('*').order('date', { ascending: true }).limit(5);
        if (appts && appts.length > 0) {
          setAppointments(appts.map(a => ({
            time: a.date ? new Date(a.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : "00:00",
            title: a.customer_name ? `${a.customer_name} - ${a.service_name || 'Randevu'}` : (a.service_name || 'Randevu'),
            color: "#00f0ff"
          })));
        } else {
          setAppointments([
            { time: "10:00", title: "Ayşe Kaya - Danışmanlık", color: "#00f0ff" },
            { time: "12:30", title: "Marka Toplantısı", color: "#bc13fe" },
          ]);
        }

        // Comm Logs
        const { data: logs } = await supabase.from('ai_communication_logs').select('*').order('created_at', { ascending: false }).limit(5);
        if (logs) {
          setCommLogs(logs);
        }

      } catch (error) {
        console.warn('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => Number(amount).toLocaleString('tr-TR');
  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(1, mins)}dk önce`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}sa önce`;
    return `${Math.floor(hrs / 24)}g önce`;
  };

  function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
    const icons: Record<string, { bg: string; label: string }> = {
      instagram: { bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", label: "IG" },
      tiktok: { bg: "#010101", label: "TK" },
      facebook: { bg: "#1877F2", label: "FB" },
      youtube: { bg: "#FF0000", label: "YT" },
      linkedin: { bg: "#0A66C2", label: "LI" },
      google: { bg: "#4285F4", label: "GB" },
      whatsapp: { bg: "#25D366", label: "WA" },
    };
    const p = icons[platform.toLowerCase()] || { bg: "#444", label: "??" };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, borderRadius: "50%", background: p.bg,
        fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0,
        fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em",
      }}>
        {p.label}
      </span>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f0ff]"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* AI Summary Bubble */}
      <div className="glass neon-cyan" style={{ borderRadius: 20, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 74, height: 74, borderRadius: 23, background: "linear-gradient(135deg,#00f0ff22,#4edea322)",
          border: "1.5px solid rgba(0,240,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden"
        }}>
          <video 
            src="/video1.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: "rgba(0,240,255,0.7)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>AI ASISTAN · GÜNLÜK ÖZET</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
            Bugün <strong style={{ color: "#00f0ff" }}>{recentActivities.length > 0 ? recentActivities.length + 12 : 47} mesaj</strong> ve <strong style={{ color: "#4edea3" }}>128 yorum</strong> otomatik yanıtlandı.
            Instagram'da yayınlanan son post <strong style={{ color: "#ffb95f" }}>%18.4</strong> etkileşim aldı — bu haftanın rekoru!
            Öğleden sonra <strong style={{ color: "#bc13fe" }}>{appointments.length} randevunuz</strong> var.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingLeft: 20, borderLeft: "1px solid rgba(255,255,255,0.1)", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: aiActive ? "#00f0ff" : "#849495", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace" }}>
            {aiActive ? "AKTİF" : "KAPALI"}
          </span>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: aiActive ? "rgba(0, 240, 255, 0.2)" : "rgba(255,255,255,0.1)", border: `1.5px solid ${aiActive ? "rgba(0, 240, 255, 0.4)" : "rgba(255,255,255,0.2)"}`, position: "relative", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 1.5, right: aiActive ? 2 : 'auto', left: !aiActive ? 2 : 'auto', boxShadow: aiActive ? "0 0 10px #00f0ff" : "none" }} />
          </div>
        </div>
      </div>

      {/* Financial Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Aylık Gelir", value: `₺${formatCurrency(financeStats.income)}`, change: "+12.4%", up: true, color: "#4edea3" },
          { label: "Aylık Gider", value: `₺${formatCurrency(financeStats.expense)}`, change: "-3.1%", up: false, color: "#ff6b6b" },
        ].map(m => (
          <div key={m.label} className="glass" style={{ borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{m.label}</p>
            <p style={{ color: m.color, fontSize: 28, fontWeight: 700, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", marginBottom: 6 }}>{m.value}</p>
            <span style={{
              fontSize: 12, fontWeight: 600, color: m.up ? "#4edea3" : "#ff6b6b",
              background: m.up ? "rgba(78,222,163,0.12)" : "rgba(255,107,107,0.12)",
              padding: "3px 8px", borderRadius: 99, fontFamily: "JetBrains Mono, monospace"
            }}>{m.change}</span>
          </div>
        ))}
      </div>

      {/* Split view: Invoice + Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Invoice Scanner */}
        <div className="glass neon-orange" style={{ borderRadius: 20, padding: "20px 22px" }}>
          <p style={{ fontSize: 12, color: "rgba(255,185,95,0.8)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14, fontFamily: "JetBrains Mono, monospace" }}>FATURA TARAYICI · SON FATURA</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 80, height: 100, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,185,95,0.2)" }}>
              <img
                src="https://images.unsplash.com/photo-1648500847390-7792256bb95a?w=80&h=100&fit=crop&auto=format"
                alt="Fatura belgesi"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: "Tedarikçi", value: "Ofis Dünyası A.Ş." },
                { label: "Tarih", value: "03.02.2026" },
                { label: "KDV", value: "%20" },
                { label: "Toplam", value: "₺4,820.00" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{r.label}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="fab" style={{ marginTop: 14, background: "rgba(255,185,95,0.12)", color: "#ffb95f", border: "1px solid rgba(255,185,95,0.25)", width: "100%", justifyContent: "center", fontSize: 13 }}>
            + Yeni Fatura Tara
          </button>
        </div>

        {/* Today's timeline */}
        <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14 }}>BUGÜNKÜ RANDEVULAR</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.length > 0 ? appointments.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: a.color, fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", width: 38, flexShrink: 0 }}>{a.time}</span>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: a.color, flexShrink: 0, opacity: 0.6 }} />
                <div>
                  <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{a.title}</p>
                </div>
              </div>
            )) : (
              <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>Bugün için planlı randevu yok.</span>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Stats (Tüm Hesaplar) */}
      <div className="glass neon-cyan" style={{ borderRadius: 20, padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,240,255,0.05), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👥</div>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Tüm Hesaplar</p>
          </div>
          <div style={{ padding: "4px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>CANLI ANALİZ</span>
          </div>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 8 }}>Toplam Takipçi Kitle</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#00f0ff", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", textShadow: "0 0 10px rgba(0,240,255,0.3)" }}>
                {socialStats.followers.toLocaleString('tr-TR')}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#4edea3" }}>
                <span style={{ fontSize: 14 }}>↑</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{socialStats.trend}%</span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 8 }}>Etkileşim Trendi</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 120, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: "82%", height: "100%", background: "linear-gradient(90deg, #00f0ff, #bc13fe)" }} />
              </div>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Yüksek</span>
            </div>
          </div>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>Son Aktiviteler</p>
          <Link href="/sosyal-medya/inbox" style={{ fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>TÜMÜNÜ GÖR</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentActivities.map(act => (
            <div key={act.id} className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, borderLeft: `3px solid ${act.color}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden" }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(act.name)}&background=random&color=fff`} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{act.name}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 11 }}>{formatRelativeTime(act.date)}</p>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 8 }}>{act.message}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${act.color}22`, color: act.color, fontWeight: 700 }}>{act.type}</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontWeight: 700 }}>{act.platform}</span>
                </div>
              </div>
              <span style={{ color: "var(--text-secondary)", opacity: 0.5, fontSize: 18 }}>›</span>
            </div>
          ))}
          {recentActivities.length === 0 && (
             <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Son aktivite bulunmuyor.</span>
          )}
        </div>
      </div>

      {/* İletişim Raporları */}
      <div>
        <p style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 16 }}>İletişim Raporları</p>
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--text-secondary)", textAlign: "left" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>İletişim Kanalı</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Tarih/Saat</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Durum</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {commLogs.map((log, i) => (
                <tr key={log.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                    <PlatformIcon platform={log.platform || 'whatsapp'} size={24} /> 
                    <span style={{ textTransform: 'capitalize' }}>{log.platform || 'WhatsApp'}</span>
                  </td>
                  <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.7)" }}>
                    {new Date(log.created_at).toLocaleDateString('tr-TR')} {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ 
                      color: log.status === 'success' ? "#4edea3" : "#ffb95f", 
                      background: log.status === 'success' ? "rgba(78,222,163,0.1)" : "rgba(255,185,95,0.1)", 
                      padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 
                    }}>
                      {log.status === 'success' ? 'Başarılı' : 'Beklemede'}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right", color: "#00f0ff", cursor: "pointer", fontWeight: 600 }}>İncele</td>
                </tr>
              ))}
              {commLogs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "16px 20px", color: "var(--text-secondary)", textAlign: "center" }}>Rapor bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
