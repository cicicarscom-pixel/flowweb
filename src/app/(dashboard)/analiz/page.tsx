"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { createClient } from "@/lib/supabase/client";

const PLATFORMS = [
  { id: 'all', name: 'Tümü', icon: 'apps', color: '#849495' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#ff0050' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#ebb2ff' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#00f0ff' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#ff0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0077b5' },
  { id: 'googlebusiness', name: 'Google Business', icon: 'store', color: '#34a853' }
];

const TIME_RANGES = [
  { id: '7d', name: 'Son 7 Gün', days: 7 },
  { id: '30d', name: 'Son 30 Gün', days: 30 },
  { id: '90d', name: 'Son 90 Gün', days: 90 },
  { id: '1y', name: 'Son 1 Yıl', days: 365 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong" style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,10,12,0.9)", backdropFilter: "blur(12px)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 8, fontFamily: "JetBrains Mono, monospace" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color || p.payload?.color }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color || p.payload?.color, fontFamily: "JetBrains Mono, monospace" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'posting' | 'inbox'>('posting');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[1]);

  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);

  const supabase = createClient();

  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalReviews: 0,
    messagesReceived: 0,
    messagesSent: 0
  });

  const [zernioData, setZernioData] = useState({
    timelineData: [] as any[],
    timelineDataLikes: [] as any[],
    demographics: [] as any[],
    followerStats: [] as any[],
    platformInsights: null as any,
    totalFollowers: 0,
    totalPosts: 0,
    totalComments: 0,
    messagesReceived: 0
  });

  const fetchInternalStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).maybeSingle();
      const orgId = orgMember?.organization_id;
      if (!orgId) return;

      // Notice we are treating profile_id as the tenant ID for now, 
      // which aligns with Phase 9 requirements until a full column rename happens.
      const [{ count: postsCount }, { count: commentsCount }, { count: reviewsCount }, { count: msgsInCount }, { count: msgsOutCount }, { data: accountsData }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('profile_id', orgId),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('profile_id', orgId),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('profile_id', orgId),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('profile_id', orgId).eq('direction', 'incoming'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('profile_id', orgId).eq('direction', 'outgoing'),
        supabase.schema('integration').from('social_accounts').select('zernio_account_id, platform').eq('organization_id', orgId)
      ]);

      setStats({
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
        totalReviews: reviewsCount || 0,
        messagesReceived: msgsInCount || 0,
        messagesSent: msgsOutCount || 0
      });
      
      if (accountsData) {
        setSocialAccounts(accountsData);
      }
    } catch (err) {
      console.warn('Error fetching internal stats:', err);
    }
  };

  const fetchZernioAnalytics = async () => {
    setIsLoading(true);

    try {
      const targetAccounts = selectedPlatform.id === 'all' 
        ? socialAccounts 
        : socialAccounts.filter(a => a.platform.toLowerCase() === selectedPlatform.id || (selectedPlatform.id === 'googlebusiness' && a.platform.toLowerCase() === 'google'));

      const _toDate = new Date().toISOString().split('T')[0];
      const _fromDate = new Date(Date.now() - (selectedTimeRange.days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let queryArgs: any = { fromDate: _fromDate, toDate: _toDate };
      if (selectedPlatform.id !== 'all') {
         queryArgs.platform = selectedPlatform.id === 'googlebusiness' ? 'google' : selectedPlatform.id;
      }
      
      const payloadBase = { query: queryArgs };
      const singleAccountId = targetAccounts && targetAccounts.length > 0 ? targetAccounts[0].zernio_account_id : undefined;
      const accountPayload = { query: { accountId: singleAccountId, fromDate: _fromDate, toDate: _toDate } };

      let newZernioData = {
        timelineData: [] as any[],
        timelineDataLikes: [] as any[],
        demographics: [] as any[],
        followerStats: [] as any[],
        platformInsights: null,
        totalFollowers: 0,
        totalPosts: 0,
        totalComments: 0,
        messagesReceived: 0
      };

      // Daily Metrics
      const { data: dailyRes } = await supabase.functions.invoke('zernio-client', {
        body: { action: 'get-daily-metrics', payload: payloadBase }
      });
      const actualData = dailyRes?.data?.data?.data || dailyRes?.data?.data || {};
      
      if (actualData.dailyData) {
         let mappedTimeline = actualData.dailyData.map((d: any) => ({
           views: d.metrics?.impressions || 0,
           likes: d.metrics?.likes || 0,
           date: d.date ? d.date.substring(5,10) : ''
         }));
         
         if (mappedTimeline.length === 1) {
           mappedTimeline.unshift({ views: 0, likes: 0, date: '' });
         }
         
         newZernioData.timelineData = mappedTimeline;
      }

      if (actualData.platformBreakdown) {
         newZernioData.totalPosts = actualData.platformBreakdown.reduce((sum: number, p: any) => sum + (p.postCount || 0), 0);
         newZernioData.totalComments = actualData.platformBreakdown.reduce((sum: number, p: any) => sum + (p.comments || 0), 0);
      }

      // Sync Messages
      const { data: msgsRes } = await supabase.functions.invoke('zernio-client', {
        body: { action: 'sync-messages', payload: {} }
      });
      if (msgsRes?.data?.conversations) {
         newZernioData.messagesReceived = msgsRes.data.conversations.length;
      }

      if (selectedPlatform.id === 'all') {
        const { data: followRes } = await supabase.functions.invoke('zernio-client', {
          body: { action: 'get-follower-stats', payload: payloadBase }
        });
        const actualFollow = followRes?.data?.data?.data || followRes?.data?.data || {};
        if (actualFollow.accounts) {
           newZernioData.totalFollowers = actualFollow.accounts.reduce((sum: number, a: any) => sum + (a.currentFollowers || 0), 0);
        }
      } else if (selectedPlatform.id === 'instagram') {
        if (singleAccountId) {
          const { data: demoRes } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'get-instagram-demographics', payload: accountPayload }
          });
          
          const actualDemo = demoRes?.data?.data?.data || demoRes?.data?.data || {};
          if (actualDemo.data?.[0]?.values) {
            const genderAge = actualDemo.data[0].values[0].value;
            const mapped = Object.keys(genderAge).map((key, index) => ({
              value: genderAge[key],
              color: ['#00f0ff', '#bc13fe', '#ebb2ff', '#0077b5'][index % 4],
              name: key
            }));
            newZernioData.demographics = mapped;
          }

          const { data: followRes } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'get-instagram-follower-history', payload: accountPayload }
          });
          const actualFollow = followRes?.data?.data?.data || followRes?.data?.data || {};
          if (actualFollow.data?.[0]?.values) {
            newZernioData.followerStats = actualFollow.data[0].values.map((v: any) => ({
              followers: v.value,
              date: v.end_time ? v.end_time.substring(5,10) : ''
            }));
            newZernioData.totalFollowers = newZernioData.followerStats[newZernioData.followerStats.length-1]?.followers || 0;
          }
        }
      } else if (selectedPlatform.id === 'youtube') {
        if (singleAccountId) {
          const { data: ytRes } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'get-youtube-daily-views', payload: accountPayload }
          });
          const actualYt = ytRes?.data?.data?.data || ytRes?.data?.data || {};
          if (actualYt.rows) {
             newZernioData.timelineData = actualYt.rows.map((r: any) => ({
               views: parseInt(r[1]),
               likes: 0,
               date: r[0]
             }));
          }
        }
      } else if (selectedPlatform.id === 'tiktok') {
        if (singleAccountId) {
          const { data: tkRes } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'get-tiktok-insights', payload: accountPayload }
          });
          const actualTk = tkRes?.data?.data?.data || tkRes?.data?.data || {};
          if (actualTk.data?.stats) {
             newZernioData.platformInsights = actualTk.data.stats;
             newZernioData.totalFollowers = actualTk.data.stats.follower_count;
          }
        }
      }
      
      setZernioData(newZernioData);
    } catch (error) {
      console.warn('Error fetching Zernio analytics', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternalStats();
  }, []);

  useEffect(() => {
    if (socialAccounts.length > 0) {
      fetchZernioAnalytics();
    } else if (selectedPlatform.id === 'all') { // first load fallback
      fetchZernioAnalytics();
    }
  }, [selectedPlatform, selectedTimeRange, socialAccounts]);

  const renderPostingAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(0,240,255,0.1), rgba(0,240,255,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>TOPLAM GÖNDERİ</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#00f0ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalPosts || stats.totalPosts || 0}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(188,19,254,0.1), rgba(188,19,254,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>TOPLAM YORUM</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#ebb2ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalComments || stats.totalComments || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👥</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>TOPLAM TAKİPÇİ</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>{zernioData.totalFollowers}</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>📝</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>DEĞERLENDİRMELER</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>{stats.totalReviews}</p>
        </div>
      </div>

      {/* Line Chart: Engagement / Impressions */}
      <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3", marginBottom: 4 }}>Etkileşim ve Gösterim</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Seçili dönemdeki görüntülenme ve beğeni değişimi</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00f0ff" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Görüntülenme</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#bc13fe" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Beğeni</span>
            </div>
          </div>
        </div>

        <div style={{ height: 300, width: "100%" }}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f0ff]"></div>
            </div>
          ) : zernioData.timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={zernioData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" name="Görüntülenme" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: "#00f0ff", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="likes" name="Beğeni" stroke="#bc13fe" strokeWidth={3} dot={{ r: 4, fill: "#bc13fe", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
               <p className="text-[#849495] text-sm">Grafik verisi bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Area Chart: Follower Growth */}
      {zernioData.followerStats.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(78,222,163,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#4edea3", fontSize: 20 }}>📈</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3" }}>Takipçi Büyümesi</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Seçili dönemdeki net takipçi değişimi</p>

          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={zernioData.followerStats}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4edea3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="followers" name="Takipçi" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pie Chart: Demographics */}
      {selectedPlatform.id === 'instagram' && zernioData.demographics.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3", marginBottom: 24 }}>Demografi Analizi</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={zernioData.demographics}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {zernioData.demographics.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {zernioData.demographics.map((d: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: d.color }} />
                    <span style={{ color: "#e5e2e3", fontSize: 14 }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInboxAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(188,19,254,0.1), rgba(188,19,254,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>ALINAN MESAJ</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#ebb2ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.messagesReceived || stats.messagesReceived || 0}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(0,240,255,0.1), rgba(0,240,255,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📤</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>GÖNDERİLEN MESAJ</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#00f0ff", fontFamily: "Outfit, sans-serif" }}>{stats.messagesSent || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👁️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>OKUNAN</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>%84</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>⏱️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>ORT. YANIT SÜRESİ</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>1.2 dk</p>
        </div>
      </div>

      {/* Response Time Analysis Card */}
      <div className="glass" style={{ borderRadius: 20, padding: "32px 24px", border: "1px solid rgba(0,240,255,0.3)", textAlign: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e5e2e3", marginBottom: 8 }}>Yanıt Süresi Analizi</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 32 }}>Mesajlara ilk dönüş hızı, müşteri memnuniyeti için kritiktir.</p>
        
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 0 20px rgba(0,240,255,0.4))", marginBottom: 16 }}>🚀</span>
          <p style={{ color: "#00f0ff", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" }}>HARİKA HIZ</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#e5e2e3" }}>Analitik & İstatistikler</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tüm sosyal medya kanallarınızın performansını detaylı inceleyin</p>
      </div>

      {/* Top Tabs */}
      <div className="glass" style={{ display: "flex", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('posting')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'posting' ? "rgba(0,240,255,0.15)" : "transparent",
            border: activeTab === 'posting' ? "1px solid rgba(0,240,255,0.3)" : "1px solid transparent",
            color: activeTab === 'posting' ? "#00f0ff" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Gönderi Analizi
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'inbox' ? "rgba(188,19,254,0.15)" : "transparent",
            border: activeTab === 'inbox' ? "1px solid rgba(188,19,254,0.3)" : "1px solid transparent",
            color: activeTab === 'inbox' ? "#ebb2ff" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Gelen Kutusu Analizi
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
        
        {/* Platform Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => { setIsPlatformMenuOpen(!isPlatformMenuOpen); setIsTimeMenuOpen(false); }}
            className="glass" 
            style={{ 
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", minWidth: 200
            }}
          >
            <span style={{ fontSize: 16, color: selectedPlatform.color }}>★</span>
            <span style={{ color: "#e5e2e3", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{selectedPlatform.name}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isPlatformMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", left: 0, marginTop: 8, width: 220,
              borderRadius: 12, padding: 8, border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {PLATFORMS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p); setIsPlatformMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedPlatform.id === p.id ? "rgba(0,240,255,0.1)" : "transparent"
                  }}
                >
                  <span style={{ fontSize: 16, color: p.color }}>★</span>
                  <span style={{ color: selectedPlatform.id === p.id ? "#00f0ff" : "#e5e2e3", fontSize: 13, fontWeight: selectedPlatform.id === p.id ? 700 : 500 }}>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => { setIsTimeMenuOpen(!isTimeMenuOpen); setIsPlatformMenuOpen(false); }}
            className="glass" 
            style={{ 
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", minWidth: 160
            }}
          >
            <span style={{ fontSize: 16, color: "var(--text-secondary)" }}>⏱️</span>
            <span style={{ color: "#e5e2e3", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{selectedTimeRange.name}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isTimeMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", right: 0, marginTop: 8, width: 160,
              borderRadius: 12, padding: 8, border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {TIME_RANGES.map(tr => (
                <div 
                  key={tr.id}
                  onClick={() => { setSelectedTimeRange(tr); setIsTimeMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedTimeRange.id === tr.id ? "rgba(0,240,255,0.1)" : "transparent"
                  }}
                >
                  <span style={{ color: selectedTimeRange.id === tr.id ? "#00f0ff" : "#e5e2e3", fontSize: 13, fontWeight: selectedTimeRange.id === tr.id ? 700 : 500 }}>{tr.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area Based on Tabs */}
      <div style={{ flex: 1 }}>
        {activeTab === 'posting' ? renderPostingAnalytics() : renderInboxAnalytics()}
      </div>

    </div>
  );
}
