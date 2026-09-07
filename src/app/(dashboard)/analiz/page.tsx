"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, Legend
} from "recharts";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// PLATFORMS: 'name' alanı marka adları için literal İngilizce kalır (TikTok,
// Instagram, Facebook, YouTube, LinkedIn, Google Business — bunlar özel isim,
// dilden dile çevrilmez). Sadece 'all' (Tümü) seçeneği i18n'e bağlıdır, bkz.
// getPlatformLabel().
const PLATFORMS = [
  { id: 'all', name: 'Tümü', icon: 'apps', color: '#A79E96' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#EF4444' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E8A8CD' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#FF7A59' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#ff0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0077b5' },
  { id: 'googlebusiness', name: 'Google Business', icon: 'store', color: '#34a853' }
];

// id/label ayrımı (bkz. AICharacterPanel.tsx'teki ROLE_KEY_BY_ID notu):
// TIME_RANGES.id değerleri değişmez (state/filtre mantığı bunlara dayanır),
// yalnızca görüntülenen ad bu eşlemeyle analizPage.timeRanges.* çevirisinden üretilir.
const TIME_RANGE_KEY_BY_ID: Record<string, string> = {
  '7d': 'last7Days',
  '30d': 'last30Days',
  '90d': 'last90Days',
  '1y': 'last1Year',
};

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
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color || p.payload?.color || p.fill }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color || p.payload?.color || p.fill, fontFamily: "JetBrains Mono, monospace" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsScreen() {
  const t = useTranslations();
  const getPlatformLabel = (p: typeof PLATFORMS[number]) =>
    p.id === 'all' ? t('analizPage.platforms.all') : p.name;
  const getTimeRangeLabel = (tr: typeof TIME_RANGES[number]) =>
    t(`analizPage.timeRanges.${TIME_RANGE_KEY_BY_ID[tr.id]}`);

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
    platformBreakdown: [] as any[],
    bestTimes: [] as any[],
    contentDecay: [] as any[],
    postingFrequency: [] as any[],
    postTimeline: null as any,
    totalFollowers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalReach: 0,
    messagesReceived: 0,
    formatBreakdown: { video: 0, image: 0 }
  });

  const [chartMetric, setChartMetric] = useState('views');
  const [postTimelineMetric, setPostTimelineMetric] = useState('views');
  const requestRef = useRef(0);

  const fetchInternalStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).maybeSingle();
      const orgId = orgMember?.organization_id;
      if (!orgId) return;

      const [{ data: postsData }, { count: commentsCount }, { count: reviewsCount }, { count: msgsInCount }, { count: msgsOutCount }, { data: accountsData }] = await Promise.all([
        supabase.from('posts').select('media_urls').eq('profile_id', orgId),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('profile_id', orgId),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('profile_id', orgId),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('profile_id', orgId).eq('direction', 'incoming'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('profile_id', orgId).eq('direction', 'outgoing'),
        supabase.schema('integration').from('social_accounts').select('zernio_account_id, platform').eq('organization_id', orgId)
      ]);

      let videoCount = 0;
      let imageCount = 0;
      if (postsData) {
        postsData.forEach((post: any) => {
          if (post.media_urls && post.media_urls.length > 0) {
            const ext = post.media_urls[0].split('.').pop()?.toLowerCase();
            if (['mp4', 'webm', 'ogg', 'mov', 'blob'].includes(ext)) {
              videoCount++;
            } else {
              imageCount++;
            }
          } else {
             imageCount++; // Fallback
          }
        });
      }

      setStats({
        totalPosts: postsData?.length || 0,
        totalComments: commentsCount || 0,
        totalReviews: reviewsCount || 0,
        messagesReceived: msgsInCount || 0,
        messagesSent: msgsOutCount || 0
      });
      
      setZernioData(prev => ({ ...prev, formatBreakdown: { video: videoCount, image: imageCount } }));

      if (accountsData) {
        setSocialAccounts(accountsData);
      }
    } catch (err) {
      console.warn('Error fetching internal stats:', err);
    }
  };

  const fetchZernioAnalytics = async () => {
    const currentRequestId = ++requestRef.current;
    setIsLoading(true);

    try {
      const targetAccounts = selectedPlatform.id === 'all' 
        ? socialAccounts 
        : socialAccounts.filter(a => a.platform.toLowerCase() === selectedPlatform.id || (selectedPlatform.id === 'googlebusiness' && a.platform.toLowerCase() === 'google'));

      const _toDate = new Date().toISOString().split('T')[0];
      const _fromDate = new Date(Date.now() - (selectedTimeRange.days || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const queryArgs: any = { fromDate: _fromDate, toDate: _toDate };
      if (selectedPlatform.id !== 'all') {
         queryArgs.platform = selectedPlatform.id === 'googlebusiness' ? 'google' : selectedPlatform.id;
      }
      
      const payloadBase = { query: queryArgs };
      const singleAccountId = targetAccounts && targetAccounts.length > 0 ? targetAccounts[0].zernio_account_id : undefined;
      const accountPayload = { query: { accountId: singleAccountId, fromDate: _fromDate, toDate: _toDate } };

      const newZernioData = {
        timelineData: [] as any[],
        timelineDataLikes: [] as any[],
        demographics: [] as any[],
        followerStats: [] as any[],
        platformInsights: null as any,
        platformBreakdown: [] as any[],
        bestTimes: [] as any[],
        contentDecay: [] as any[],
        postingFrequency: [] as any[],
        postTimeline: null as any,
        totalFollowers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalReach: 0,
        messagesReceived: 0,
        formatBreakdown: { video: 0, image: 0 }
      };

      // Daily Metrics
      const { data: dailyRes } = await supabase.functions.invoke('zernio-client', {
        body: { action: 'get-daily-metrics', payload: payloadBase }
      });
      const actualData = dailyRes?.data?.data?.data || dailyRes?.data?.data || {};
      
      if (actualData.dailyData) {
         const mappedTimeline = actualData.dailyData.map((d: any) => ({
           views: d.metrics?.impressions || 0,
           likes: d.metrics?.likes || 0,
           reach: d.metrics?.reach || 0,
           clicks: d.metrics?.clicks || 0,
           shares: d.metrics?.shares || 0,
           saves: d.metrics?.saves || 0,
           comments: d.metrics?.comments || 0,
           date: d.date ? d.date.substring(5,10) : ''
         }));
         
         if (mappedTimeline.length === 1) {
           mappedTimeline.unshift({ views: 0, likes: 0, reach: 0, clicks: 0, shares: 0, saves: 0, comments: 0, date: '' });
         }
         
         newZernioData.timelineData = mappedTimeline;
      }

      if (actualData.platformBreakdown) {
         newZernioData.platformBreakdown = actualData.platformBreakdown;
         newZernioData.totalPosts = actualData.platformBreakdown.reduce((sum: number, p: any) => sum + (p.postCount || 0), 0);
         newZernioData.totalComments = actualData.platformBreakdown.reduce((sum: number, p: any) => sum + (p.comments || 0), 0);
         newZernioData.totalReach = actualData.platformBreakdown.reduce((sum: number, p: any) => sum + (p.reach || 0), 0);
      }

      // Sync Messages
      const { data: msgsRes } = await supabase.functions.invoke('zernio-client', {
        body: { action: 'sync-messages', payload: {} }
      });
      if (msgsRes?.data?.conversations) {
         newZernioData.messagesReceived = msgsRes.data.conversations.length;
      }

      // Phase 1 Discovery Calls (to cache data in db)
      const { data: bestTimesRes } = await supabase.functions.invoke('zernio-client', { body: { action: 'get-best-times', payload: payloadBase } });
      const { data: freqRes } = await supabase.functions.invoke('zernio-client', { body: { action: 'get-posting-frequency', payload: payloadBase } });
      const { data: decayRes } = await supabase.functions.invoke('zernio-client', { body: { action: 'get-content-decay', payload: payloadBase } });
      
      // Fetch a real postId for the timeline discovery
      const { data: recentPosts } = await supabase.from('posts').select('zernio_post_id').not('zernio_post_id', 'is', null).order('created_at', { ascending: false }).limit(1);
      const recentPostId = recentPosts?.[0]?.zernio_post_id;
      const timelinePayload = recentPostId 
        ? { query: { ...queryArgs, postId: recentPostId }, postId: recentPostId } 
        : payloadBase;
        
      const { data: timelineRes } = await supabase.functions.invoke('zernio-client', { body: { action: 'get-post-timeline', payload: timelinePayload } });
      
      // Store Phase 1 API responses in state
      const actualBestTimes = bestTimesRes?.data?.data?.data || bestTimesRes?.data?.data || {};
      if (actualBestTimes.slots) {
         newZernioData.bestTimes = actualBestTimes.slots;
      }
      
      const actualFreq = freqRes?.data?.data?.data || freqRes?.data?.data || {};
      if (actualFreq.frequency) {
         newZernioData.postingFrequency = actualFreq.frequency;
      }
      
      const actualDecay = decayRes?.data?.data?.data || decayRes?.data?.data || {};
      if (actualDecay.buckets) {
         newZernioData.contentDecay = actualDecay.buckets;
      }
      
      const actualTimeline = timelineRes?.data?.data?.data || timelineRes?.data?.data || {};
      if (actualTimeline.timeline) {
         newZernioData.postTimeline = actualTimeline;
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
          if (actualDemo.data?.[0]?.values?.[0]?.value) {
            const genderAge = actualDemo.data[0].values[0].value;
            const mapped = Object.keys(genderAge).map((key, index) => ({
              value: genderAge[key],
              color: ['#FF7A59', '#C2478D', '#E8A8CD', '#0077b5'][index % 4],
              name: key
            }));
            newZernioData.demographics = mapped;
          }

          const { data: followRes } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'get-instagram-follower-history', payload: accountPayload }
          });
          const actualFollow = followRes?.data?.data?.data || followRes?.data?.data || {};
          if (Array.isArray(actualFollow.data?.[0]?.values)) {
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
      
      if (currentRequestId === requestRef.current) {
        setZernioData(prev => ({ ...newZernioData, formatBreakdown: prev.formatBreakdown }));
      }
    } catch (error) {
      if (currentRequestId === requestRef.current) {
        console.warn('Error fetching Zernio analytics', error);
      }
    } finally {
      if (currentRequestId === requestRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInternalStats();
  }, []);

  useEffect(() => {
    if (socialAccounts.length > 0) {
      fetchZernioAnalytics();
    }
  }, [selectedPlatform, selectedTimeRange, socialAccounts]);

  const renderPostingAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(255,122,89,0.1), rgba(255,122,89,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>{t("analizPage.posting.totalPosts")}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#FF7A59", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalPosts || stats.totalPosts || 0}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(194,71,141,0.1), rgba(194,71,141,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>{t("analizPage.posting.totalComments")}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#E8A8CD", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalComments || stats.totalComments || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👥</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalFollowers")}</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalFollowers}</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>📝</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalReviews")}</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{stats.totalReviews}</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>📡</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam Erişim</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalReach}</p>
        </div>
      </div>

      {/* Line Chart: Engagement / Impressions */}
      <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>{t("analizPage.posting.engagement.title")}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>{t("analizPage.posting.engagement.subtitle")}</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
             {['views', 'likes', 'comments', 'shares', 'saves', 'clicks', 'reach'].map(metric => (
                <button
                   key={metric}
                   onClick={() => setChartMetric(metric)}
                   style={{
                     padding: "6px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontWeight: 600,
                     background: chartMetric === metric ? "rgba(255,122,89,0.15)" : "transparent",
                     border: chartMetric === metric ? "1px solid #FF7A59" : "1px solid rgba(255,255,255,0.1)",
                     color: chartMetric === metric ? "#FF7A59" : "var(--text-secondary)",
                     transition: "all 0.2s"
                   }}
                >
                  {metric.toUpperCase()}
                </button>
             ))}
          </div>
        </div>

        <div style={{ height: 300, width: "100%" }}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59]"></div>
            </div>
          ) : zernioData.timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={zernioData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey={chartMetric} name={chartMetric.toUpperCase()} stroke="#FF7A59" strokeWidth={3} dot={{ r: 4, fill: "#FF7A59", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
               <p className="text-[#A79E96] text-sm">{t("analizPage.posting.engagement.noData")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Area Chart: Follower Growth */}
      {zernioData.followerStats.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(34,181,115,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#22B573", fontSize: 20 }}>📈</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" }}>{t("analizPage.posting.followerGrowth.title")}</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>{t("analizPage.posting.followerGrowth.subtitle")}</p>

          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={zernioData.followerStats}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22B573" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22B573" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="followers" name={t("analizPage.posting.followerGrowth.followers")} stroke="#22B573" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pie Chart: Demographics */}
      {selectedPlatform.id === 'instagram' && zernioData.demographics.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>{t("analizPage.posting.demographics.title")}</h3>
          
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
                    <span style={{ color: "#F6F1EC", fontSize: 14 }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Format Breakdown & Platform Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Content Format Breakdown */}
        {(zernioData.formatBreakdown.video > 0 || zernioData.formatBreakdown.image > 0) && (
          <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>İçerik Formatı Dağılımı</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Video', value: zernioData.formatBreakdown.video, color: '#FF7A59' },
                        { name: 'Görsel', value: zernioData.formatBreakdown.image, color: '#C2478D' }
                      ].filter(d => d.value > 0)}
                      innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                    >
                      {[
                        { name: 'Video', value: zernioData.formatBreakdown.video, color: '#FF7A59' },
                        { name: 'Görsel', value: zernioData.formatBreakdown.image, color: '#C2478D' }
                      ].filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                     <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#FF7A59' }} />
                     <span style={{ color: "#F6F1EC", fontSize: 14 }}>Video</span>
                   </div>
                   <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.video}</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                     <div style={{ width: 12, height: 12, borderRadius: "50%", background: '#C2478D' }} />
                     <span style={{ color: "#F6F1EC", fontSize: 14 }}>Görsel</span>
                   </div>
                   <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.image}</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Breakdown Table */}
        {zernioData.platformBreakdown.length > 0 && (
          <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>Platform Kırılımı</h3>
             <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                   <tr>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>Platform</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>Gönderi</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>Erişim</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>Beğeni</th>
                   </tr>
                </thead>
                <tbody>
                   {zernioData.platformBreakdown.map((p: any, i: number) => (
                      <tr key={i}>
                         <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC", textTransform: "capitalize" }}>{p.platform}</td>
                         <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC" }}>{p.postCount || 0}</td>
                         <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC" }}>{p.reach || 0}</td>
                         <td style={{ padding: "12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#F6F1EC" }}>{p.likes || 0}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Platform Performance Bar Chart */}
      {zernioData.platformBreakdown.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
           <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>Platform Bazlı Etkileşim</h3>
           <div style={{ height: 300, width: "100%" }}>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zernioData.platformBreakdown}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                   <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} />
                   <Bar dataKey="postCount" name="Gönderi Sayısı" fill="#FF7A59" radius={[4,4,0,0]} />
                   <Bar dataKey="likes" name="Beğeni Sayısı" fill="#C2478D" radius={[4,4,0,0]} />
                   <Bar dataKey="reach" name="Erişim" fill="#22B573" radius={[4,4,0,0]} />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      )}
      {/* 1. Best Times Heatmap */}
      {zernioData.bestTimes.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>En İyi Paylaşım Zamanları</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Haftanın günleri ve saatlere göre ortalama etkileşim yoğunluğu</p>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 8, marginTop: 20 }}>
              {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(day => (
                <div key={day} style={{ height: 28, display: "flex", alignItems: "center", color: "var(--text-secondary)", fontSize: 12 }}>{day}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflowX: "auto" }}>
              <div style={{ display: "flex", marginBottom: 4 }}>
                {Array.from({length: 24}).map((_, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", color: "var(--text-secondary)", fontSize: 10, minWidth: 20 }}>{i}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateRows: "repeat(7, 28px)", gap: 2 }}>
                {(() => {
                  const maxEngagement = Math.max(...zernioData.bestTimes.map((s: any) => s.avg_engagement || 0), 1);
                  return Array.from({length: 7}).map((_, dayIdx) => (
                    <div key={dayIdx} style={{ display: "flex", gap: 2 }}>
                      {Array.from({length: 24}).map((_, hourIdx) => {
                        const slot = zernioData.bestTimes.find((s: any) => s.day_of_week === dayIdx && s.hour === hourIdx);
                        const intensity = slot ? Math.max(0.1, (slot.avg_engagement || 0) / maxEngagement) : 0;
                        return (
                        <div 
                          key={hourIdx} 
                          title={slot ? `Saat: ${hourIdx}:00\nEtkileşim: ${slot.avg_engagement}\nGönderi: ${slot.post_count}` : ''}
                          style={{
                            flex: 1,
                            minWidth: 20,
                            borderRadius: 4,
                            backgroundColor: slot ? `rgba(255, 122, 89, ${intensity})` : "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.02)",
                            cursor: slot ? "pointer" : "default"
                          }} 
                        />
                      )
                    })}
                  </div>
                ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Content Decay Area Chart */}
      {zernioData.contentDecay.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>İçerik Ömrü (Content Decay)</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Zaman içinde toplam etkileşimin yüzde kaçına ulaşıldığı</p>
          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...zernioData.contentDecay].sort((a: any, b: any) => a.bucket_order - b.bucket_order)}>
                <defs>
                  <linearGradient id="colorDecay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C2478D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C2478D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="bucket_label" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `%${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="avg_pct_of_final" name="Etkileşim Yüzdesi" stroke="#C2478D" strokeWidth={3} fillOpacity={1} fill="url(#colorDecay)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Posting Frequency Scatter */}
      {zernioData.postingFrequency.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>Paylaşım Sıklığı vs Etkileşim Oranı</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Haftalık gönderi sayısının ortalama etkileşim oranına etkisi</p>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" dataKey="posts_per_week" name="Haftalık Gönderi" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="avg_engagement_rate" name="Etkileşim Oranı (%)" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                <ZAxis type="number" dataKey="weeks_count" range={[60, 400]} name="Hafta Sayısı" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Legend iconType="circle" />
                {Array.from(new Set(zernioData.postingFrequency.map((f: any) => f.platform))).map((platform: string) => {
                  const platId = platform.toLowerCase() === 'google' ? 'googlebusiness' : platform.toLowerCase();
                  const platDef = PLATFORMS.find(p => p.id === platId);
                  const color = platDef ? platDef.color : "#FF7A59";
                  const data = zernioData.postingFrequency.filter((f: any) => f.platform === platform);
                  return (
                    <Scatter key={platform} name={platDef ? platDef.name : platform} data={data} fill={color} />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. Post Timeline (Single Post Performance) */}
      {zernioData.postTimeline && zernioData.postTimeline.timeline && zernioData.postTimeline.timeline.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>Son Gönderi Etkileşim Eğrisi</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Seçili gönderinin zaman içindeki performansı</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
               {['views', 'likes', 'comments', 'shares', 'saves', 'clicks', 'reach', 'impressions'].map(metric => (
                  <button
                     key={metric}
                     onClick={() => setPostTimelineMetric(metric)}
                     style={{
                       padding: "6px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontWeight: 600,
                       background: postTimelineMetric === metric ? "rgba(34,181,115,0.15)" : "transparent",
                       border: postTimelineMetric === metric ? "1px solid #22B573" : "1px solid rgba(255,255,255,0.1)",
                       color: postTimelineMetric === metric ? "#22B573" : "var(--text-secondary)",
                       transition: "all 0.2s"
                     }}
                  >
                    {metric.toUpperCase()}
                  </button>
               ))}
            </div>
          </div>

          <div style={{ height: 300, width: "100%" }}>
             <ResponsiveContainer width="100%" height="100%">
               {(() => {
                 const aggTimeline = Object.values(zernioData.postTimeline.timeline.reduce((acc: any, curr: any) => {
                   if (!acc[curr.date]) {
                     acc[curr.date] = { ...curr };
                   } else {
                     ['views', 'likes', 'comments', 'shares', 'saves', 'clicks', 'reach', 'impressions', 'follows'].forEach(m => {
                       acc[curr.date][m] = (acc[curr.date][m] || 0) + (curr[m] || 0);
                     });
                   }
                   return acc;
                 }, {})).sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
                 
                 return (
                   <LineChart data={aggTimeline}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Line type="monotone" dataKey={postTimelineMetric} name={postTimelineMetric.toUpperCase()} stroke="#22B573" strokeWidth={3} dot={{ r: 4, fill: "#22B573", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                   </LineChart>
                 );
               })()}
             </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );

  const renderInboxAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(194,71,141,0.1), rgba(194,71,141,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.messagesReceived")}</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#E8A8CD", fontFamily: "Outfit, sans-serif" }}>{zernioData.messagesReceived || stats.messagesReceived || 0}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(255,122,89,0.1), rgba(255,122,89,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📤</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.messagesSent")}</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#FF7A59", fontFamily: "Outfit, sans-serif" }}>{stats.messagesSent || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👁️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.readRate")}</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>%84</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>⏱️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.avgResponseLabel")}</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{t("analizPage.inbox.avgResponseValue")}</p>
        </div>
      </div>

      {/* Response Time Analysis Card */}
      <div className="glass" style={{ borderRadius: 20, padding: "32px 24px", border: "1px solid rgba(255,122,89,0.3)", textAlign: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F6F1EC", marginBottom: 8 }}>{t("analizPage.inbox.responseTimeAnalysis.title")}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 32 }}>{t("analizPage.inbox.responseTimeAnalysis.subtitle")}</p>

        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 0 20px rgba(255,122,89,0.4))", marginBottom: 16 }}>🚀</span>
          <p style={{ color: "#FF7A59", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" }}>{t("analizPage.inbox.responseTimeAnalysis.greatSpeed")}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#F6F1EC" }}>{t("analizPage.header.title")}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("analizPage.header.subtitle")}</p>
      </div>

      {/* Top Tabs */}
      <div className="glass" style={{ display: "flex", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('posting')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'posting' ? "rgba(255,122,89,0.15)" : "transparent",
            border: activeTab === 'posting' ? "1px solid rgba(255,122,89,0.3)" : "1px solid transparent",
            color: activeTab === 'posting' ? "#FF7A59" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          {t("analizPage.tabs.posting")}
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'inbox' ? "rgba(194,71,141,0.15)" : "transparent",
            border: activeTab === 'inbox' ? "1px solid rgba(194,71,141,0.3)" : "1px solid transparent",
            color: activeTab === 'inbox' ? "#E8A8CD" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          {t("analizPage.tabs.inbox")}
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
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getPlatformLabel(selectedPlatform)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isPlatformMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", left: 0, marginTop: 8, width: 220,
              borderRadius: 12, padding: 8, border: "1px solid rgba(255,122,89,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {PLATFORMS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p); setIsPlatformMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedPlatform.id === p.id ? "rgba(255,122,89,0.1)" : "transparent"
                  }}
                >
                  <span style={{ fontSize: 16, color: p.color }}>★</span>
                  <span style={{ color: selectedPlatform.id === p.id ? "#FF7A59" : "#F6F1EC", fontSize: 13, fontWeight: selectedPlatform.id === p.id ? 700 : 500 }}>{getPlatformLabel(p)}</span>
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
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getTimeRangeLabel(selectedTimeRange)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isTimeMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", right: 0, marginTop: 8, width: 160,
              borderRadius: 12, padding: 8, border: "1px solid rgba(255,122,89,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {TIME_RANGES.map(tr => (
                <div 
                  key={tr.id}
                  onClick={() => { setSelectedTimeRange(tr); setIsTimeMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedTimeRange.id === tr.id ? "rgba(255,122,89,0.1)" : "transparent"
                  }}
                >
                  <span style={{ color: selectedTimeRange.id === tr.id ? "#FF7A59" : "#F6F1EC", fontSize: 13, fontWeight: selectedTimeRange.id === tr.id ? 700 : 500 }}>{getTimeRangeLabel(tr)}</span>
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
