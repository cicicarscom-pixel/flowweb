"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, Legend
} from "recharts";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// PLATFORMS: 'name' alanÃ„Â± marka adlarÃ„Â± iÃƒÂ§in literal Ã„Â°ngilizce kalÃ„Â±r (TikTok,
// Instagram, Facebook, YouTube, LinkedIn, Google Business Ã¢â‚¬â€ bunlar ÃƒÂ¶zel isim,
// dilden dile ÃƒÂ§evrilmez). Sadece 'all' (TÃƒÂ¼mÃƒÂ¼) seÃƒÂ§eneÃ„Å¸i i18n'e baÃ„Å¸lÃ„Â±dÃ„Â±r, bkz.
// getPlatformLabel().
const PLATFORMS = [
  { id: 'all', name: 'TÃƒÂ¼mÃƒÂ¼', icon: 'apps', color: '#A79E96' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#EF4444' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E8A8CD' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#FF7A59' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#ff0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0077b5' },
  { id: 'googlebusiness', name: 'Google Business', icon: 'store', color: '#34a853' }
];

// id/label ayrÃ„Â±mÃ„Â± (bkz. AICharacterPanel.tsx'teki ROLE_KEY_BY_ID notu):
// TIME_RANGES.id deÃ„Å¸erleri deÃ„Å¸iÃ…Å¸mez (state/filtre mantÃ„Â±Ã„Å¸Ã„Â± bunlara dayanÃ„Â±r),
// yalnÃ„Â±zca gÃƒÂ¶rÃƒÂ¼ntÃƒÂ¼lenen ad bu eÃ…Å¸lemeyle analizPage.timeRanges.* ÃƒÂ§evirisinden ÃƒÂ¼retilir.
const TIME_RANGE_KEY_BY_ID: Record<string, string> = {
  '7d': 'last7Days',
  '30d': 'last30Days',
  '90d': 'last90Days',
  '1y': 'last1Year',
};

const TIME_RANGES = [
  { id: '7d', name: 'Son 7 GÃƒÂ¼n', days: 7 },
  { id: '30d', name: 'Son 30 GÃƒÂ¼n', days: 30 },
  { id: '90d', name: 'Son 90 GÃƒÂ¼n', days: 90 },
  { id: '1y', name: 'Son 1 YÃ„Â±l', days: 365 }
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
    postAnalytics: [] as any[],
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        if (currentRequestId === requestRef.current) setIsLoading(false);
        return;
      }

      // Merkezi ÃƒÂ§aÃ„Å¸rÃ„Â± sarmalayÃ„Â±cÃ„Â±. Zernio zarfÃ„Â±nÃ„Â± ({success, data}) ve
      // zernio-client'Ã„Â±n "sometimes sdk wraps it in { data: ... }" davranÃ„Â±Ã…Å¸Ã„Â±nÃ„Â±
      // (bkz. fetchAnalyticsWithCache) tek noktadan aÃƒÂ§ar.
      // - TaÃ…Å¸Ã„Â±ma/altyapÃ„Â± hatasÃ„Â±nda (network, fonksiyon ÃƒÂ§aÃ„Å¸rÃ„Â±sÃ„Â± patlarsa) fÃ„Â±rlatÃ„Â±r
      //   ve tÃƒÂ¼m fetchZernioAnalytics'i durdurur Ã¢â‚¬â€ bu doÃ„Å¸ru, ÃƒÂ§ÃƒÂ¼nkÃƒÂ¼ session/aÃ„Å¸
      //   temelden bozuksa geri kalan ÃƒÂ§aÃ„Å¸rÃ„Â±lar da anlamsÃ„Â±z olur.
      // - Zernio/edge function'Ã„Â±n kendi dÃƒÂ¶ndÃƒÂ¼rdÃƒÂ¼Ã„Å¸ÃƒÂ¼ "yumuÃ…Å¸ak" hatada
      //   ({success:false, error, code} Ã¢â‚¬â€ ki bugÃƒÂ¼nkÃƒÂ¼ tasarÃ„Â±mda HTTP 200 ile
      //   geliyor) FIRLATMAZ: sadece o tek action'Ã„Â± uyarÃ„Â± olarak loglar ve boÃ…Å¸
      //   veri dÃƒÂ¶ner. BÃƒÂ¶ylece ÃƒÂ¶rn. content-decay baÃ…Å¸arÃ„Â±sÃ„Â±z olsa bile, zaten
      //   baÃ…Å¸arÃ„Â±yla gelmiÃ…Å¸ best-times/daily-metrics verisi ÃƒÂ§ÃƒÂ¶pe atÃ„Â±lmaz.
      const invokeZernio = async (action: string, payload: any): Promise<any> => {
        const { data, error } = await supabase.functions.invoke('zernio-client', {
          body: { action, payload },
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (error) {
          throw error;
        }
        if (data?.success === false) {
          console.warn(`[Zernio] "${action}" baÃ…Å¸arÃ„Â±sÃ„Â±z:`, data.error, `(${data.code})`);
          return {};
        }
        return data?.data?.data || data?.data || {};
      };

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
        postAnalytics: [] as any[],
        totalFollowers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalReach: 0,
        messagesReceived: 0,
        formatBreakdown: { video: 0, image: 0 }
      };

      // SeÃƒÂ§ili platforma gÃƒÂ¶re gereken tek platforma-ÃƒÂ¶zel ÃƒÂ§aÃ„Å¸rÃ„Â± grubu. HiÃƒÂ§biri
      // daily-metrics/best-times/vb. sonuÃƒÂ§larÃ„Â±na baÃ„Å¸Ã„Â±mlÃ„Â± deÃ„Å¸il, o yÃƒÂ¼zden
      // aÃ…Å¸aÃ„Å¸Ã„Â±daki ana Promise.all'a aynen katÃ„Â±labiliyor.
      type PlatformResult =
        | { kind: 'all'; follow: any }
        | { kind: 'instagram'; demo: any; follow: any }
        | { kind: 'youtube'; yt: any }
        | { kind: 'tiktok'; tk: any }
        | { kind: 'none' };

      const platformCall: Promise<PlatformResult> = (() => {
        if (selectedPlatform.id === 'all') {
          return invokeZernio('get-follower-stats', payloadBase).then(follow => ({ kind: 'all' as const, follow }));
        }
        if (selectedPlatform.id === 'instagram' && singleAccountId) {
          return Promise.all([
            invokeZernio('get-instagram-demographics', accountPayload),
            invokeZernio('get-instagram-follower-history', accountPayload)
          ]).then(([demo, follow]) => ({ kind: 'instagram' as const, demo, follow }));
        }
        if (selectedPlatform.id === 'youtube' && singleAccountId) {
          return invokeZernio('get-youtube-daily-views', accountPayload).then(yt => ({ kind: 'youtube' as const, yt }));
        }
        if (selectedPlatform.id === 'tiktok' && singleAccountId) {
          return invokeZernio('get-tiktok-insights', accountPayload).then(tk => ({ kind: 'tiktok' as const, tk }));
        }
        return Promise.resolve({ kind: 'none' as const });
      })();

      // Birbirinden tamamen baÃ„Å¸Ã„Â±msÃ„Â±z tÃƒÂ¼m keÃ…Å¸if ÃƒÂ§aÃ„Å¸rÃ„Â±larÃ„Â±nÃ„Â± PARALEL yÃƒÂ¼rÃƒÂ¼t.
      // Ãƒâ€“ncesinde bunlar 7-9 ayrÃ„Â± network round-trip'i olarak sÃ„Â±rayla
      // "await" ediliyordu (sayfa yÃƒÂ¼klemesini gereksiz yavaÃ…Å¸latÃ„Â±yor, ve
      // aradaki her bekleme auth/oturum zamanlama sorunlarÃ„Â±na daha aÃƒÂ§Ã„Â±k hale
      // getiriyordu). HiÃƒÂ§biri bir diÃ„Å¸erinin sonucuna ihtiyaÃƒÂ§ duymadÃ„Â±Ã„Å¸Ã„Â±ndan
      // hepsini aynÃ„Â± anda ateÃ…Å¸lemek gÃƒÂ¼venli.
      const [
        actualData,
        actualMsgs,
        actualBestTimes,
        actualFreq,
        actualDecay,
        actualPostAnalytics,
        recentPosts,
        platformResult
      ] = await Promise.all([
        invokeZernio('get-daily-metrics', payloadBase),
        invokeZernio('sync-messages', {}),
        invokeZernio('get-best-times', payloadBase),
        invokeZernio('get-posting-frequency', payloadBase),
        invokeZernio('get-content-decay', payloadBase),
        invokeZernio('get-post-analytics', payloadBase),
        supabase.from('posts').select('zernio_post_id').not('zernio_post_id', 'is', null).order('created_at', { ascending: false }).limit(1).then(r => r.data),
        platformCall
      ]);

      // get-post-timeline, keÃ…Å¸if iÃƒÂ§in gerÃƒÂ§ek bir postId'ye ihtiyaÃƒÂ§ duyuyor;
      // bu yÃƒÂ¼zden recentPosts sorgusunun (yukarÃ„Â±daki paralel grupta zaten
      // koÃ…Å¸tu) sonucunu bekleyip ayrÃ„Â±ca ÃƒÂ§aÃ„Å¸Ã„Â±rÃ„Â±yoruz.
      const recentPostId = recentPosts?.[0]?.zernio_post_id;
      const timelinePayload = recentPostId
        ? { query: { ...queryArgs, postId: recentPostId }, postId: recentPostId }
        : payloadBase;
      const actualTimeline = await invokeZernio('get-post-timeline', timelinePayload);

      // --- SonuÃƒÂ§larÃ„Â± state Ã…Å¸ekline dÃƒÂ¶k (tamamen senkron, saf eÃ…Å¸leme) ---
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

      if (actualMsgs.conversations) {
         newZernioData.messagesReceived = actualMsgs.conversations.length;
      }

      if (actualBestTimes.slots) {
         newZernioData.bestTimes = actualBestTimes.slots;
      }

      if (actualFreq.frequency) {
         newZernioData.postingFrequency = actualFreq.frequency;
      }

      if (actualDecay.buckets) {
         newZernioData.contentDecay = actualDecay.buckets;
      }

      if (actualTimeline.timeline) {
         newZernioData.postTimeline = actualTimeline;
      }
      
      if (actualPostAnalytics.posts) {
         newZernioData.postAnalytics = actualPostAnalytics.posts;
      } else if (actualPostAnalytics.data) {
         newZernioData.postAnalytics = actualPostAnalytics.data;
      } else if (Array.isArray(actualPostAnalytics)) {
         newZernioData.postAnalytics = actualPostAnalytics;
      }

      if (platformResult.kind === 'all') {
        if (platformResult.follow.accounts) {
           newZernioData.totalFollowers = platformResult.follow.accounts.reduce((sum: number, a: any) => sum + (a.currentFollowers || 0), 0);
        }
      } else if (platformResult.kind === 'instagram') {
        if (platformResult.demo.data?.[0]?.values?.[0]?.value) {
          const genderAge = platformResult.demo.data[0].values[0].value;
          const mapped = Object.keys(genderAge).map((key, index) => ({
            value: genderAge[key],
            color: ['#FF7A59', '#C2478D', '#E8A8CD', '#0077b5'][index % 4],
            name: key
          }));
          newZernioData.demographics = mapped;
        }

        if (Array.isArray(platformResult.follow.data?.[0]?.values)) {
          newZernioData.followerStats = platformResult.follow.data[0].values.map((v: any) => ({
            followers: v.value,
            date: v.end_time ? v.end_time.substring(5,10) : ''
          }));
          newZernioData.totalFollowers = newZernioData.followerStats[newZernioData.followerStats.length-1]?.followers || 0;
        }
      } else if (platformResult.kind === 'youtube') {
        if (platformResult.yt.rows) {
           newZernioData.timelineData = platformResult.yt.rows.map((r: any) => ({
             views: parseInt(r[1]),
             likes: 0,
             date: r[0]
           }));
        }
      } else if (platformResult.kind === 'tiktok') {
        if (platformResult.tk.data?.stats) {
           newZernioData.platformInsights = platformResult.tk.data.stats;
           newZernioData.totalFollowers = platformResult.tk.data.stats.follower_count;
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

  const renderPostingAnalytics = () => {
    let avgEngagementRate = "0.00";
    let bestPost: any = null;

    if (zernioData.postAnalytics && zernioData.postAnalytics.length > 0) {
      let totalEng = 0;
      let totalVws = 0;
      const sortedPosts = [...zernioData.postAnalytics].sort((a: any, b: any) => {
        const mA = a.analytics || a.metrics || a || {};
        const mB = b.analytics || b.metrics || b || {};
        const totalA = (mA.likes || 0) + (mA.comments || 0) + (mA.shares || 0) + (mA.impressions || mA.views || 0);
        const totalB = (mB.likes || 0) + (mB.comments || 0) + (mB.shares || 0) + (mB.impressions || mB.views || 0);
        return totalB - totalA;
      });

      sortedPosts.forEach((post: any) => {
         const m = post.analytics || post.metrics || post || {};
         totalEng += (m.likes || 0) + (m.comments || 0) + (m.shares || 0) + (m.saves || 0);
         totalVws += (m.impressions || m.views || 0);
      });
      
      if (totalVws > 0) {
         avgEngagementRate = ((totalEng / totalVws) * 100).toFixed(2);
      }
      
      bestPost = sortedPosts[0];
    }

    return (
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>ÄŸÅ¸â€˜Â¥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalFollowers")}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalFollowers}</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>Ã¢Â­Â</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.posting.totalReviews")}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{stats.totalReviews}</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>ÄŸÅ¸â€œÂ¢</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Toplam EriÃ…Å¸im</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{zernioData.totalReach}</p>
          </div>
          
          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>ÄŸÅ¸â€Â¥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Engagement Rate</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>{avgEngagementRate}%</p>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, opacity: 0.6 }}>ÄŸÅ¸â€˜â€˜</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>En Ã„Â°yi GÃƒÂ¶nderi</p>
            </div>
            {bestPost ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {bestPost.media_urls && bestPost.media_urls.length > 0 ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 relative bg-white/5">
                    {bestPost.media_urls[0].match(/\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i) || bestPost.media_urls[0].includes('blob') ? (
                      <video src={bestPost.media_urls[0]} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={bestPost.media_urls[0]} alt="Best post" className="w-full h-full object-cover" />
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center bg-white/5">
                     <i className="fa-solid fa-align-left text-gray-500 text-xs"></i>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: "#F6F1EC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {bestPost.content || bestPost.title || "Post"}
                  </p>
                  <a href={bestPost.platform_url || bestPost.url || "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#FF7A59", textDecoration: "none" }}>GÃƒÂ¶rÃƒÂ¼ntÃƒÂ¼le Ã¢â€ â€”</a>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Veri yok</p>
            )}
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

      {/* Area/Line Chart: Follower Evolution */}
      {zernioData.postTimeline && zernioData.postTimeline.timeline && zernioData.postTimeline.timeline.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(34,181,115,0.3)", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#22B573", fontSize: 20 }}>ÄŸÅ¸â€œË†</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC" }}>Platform BazÃ„Â±nda TakipÃƒÂ§i ArtÃ„Â±Ã…Å¸Ã„Â±</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Zaman iÃƒÂ§inde kazanÃ„Â±lan takipÃƒÂ§i (Follows) sayÃ„Â±larÃ„Â±</p>

          <div style={{ height: 250, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
               {(() => {
                 const platforms = new Set<string>();
                 const dateMap = zernioData.postTimeline.timeline.reduce((acc: any, curr: any) => {
                   if (!curr.date) return acc;
                   if (!acc[curr.date]) acc[curr.date] = { date: curr.date };
                   const plat = curr.platform || 'instagram'; // Fallback to instagram if not provided
                   platforms.add(plat);
                   acc[curr.date][plat] = (acc[curr.date][plat] || 0) + (curr.follows || 0);
                   return acc;
                 }, {});
                 const evolutionData = Object.values(dateMap).sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
                 
                 return (
                   <LineChart data={evolutionData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Legend iconType="circle" />
                     {Array.from(platforms).map((plat: string, i: number) => {
                       const platId = plat.toLowerCase() === 'google' ? 'googlebusiness' : plat.toLowerCase();
                       const platDef = PLATFORMS.find(p => p.id === platId);
                       const color = platDef ? platDef.color : ['#FF7A59', '#C2478D', '#E8A8CD', '#22B573', '#0077b5'][i % 5];
                       return (
                         <Line key={plat} type="monotone" dataKey={plat} name={platDef ? platDef.name : (plat.charAt(0).toUpperCase() + plat.slice(1))} stroke={color} strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: color }} activeDot={{ r: 6 }} />
                       );
                     })}
                   </LineChart>
                 );
               })()}
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
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>Ã„Â°ÃƒÂ§erik FormatÃ„Â± DaÃ„Å¸Ã„Â±lÃ„Â±mÃ„Â±</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Video', value: zernioData.formatBreakdown.video, color: '#FF7A59' },
                        { name: 'GÃƒÂ¶rsel', value: zernioData.formatBreakdown.image, color: '#C2478D' }
                      ].filter(d => d.value > 0)}
                      innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                    >
                      {[
                        { name: 'Video', value: zernioData.formatBreakdown.video, color: '#FF7A59' },
                        { name: 'GÃƒÂ¶rsel', value: zernioData.formatBreakdown.image, color: '#C2478D' }
                      ].filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   {(() => {
                     let videoEr = "0.0";
                     let imageEr = "0.0";
                     if (zernioData.postAnalytics) {
                       let vEng=0, vVws=0, iEng=0, iVws=0;
                       zernioData.postAnalytics.forEach((p:any) => {
                         const m = p.analytics || p.metrics || p || {};
                         const eng = (m.likes||0) + (m.comments||0) + (m.shares||0) + (m.saves||0);
                         const vws = (m.impressions||m.views||0);
                         const isVid = (p.media_urls && p.media_urls.some((u:string) => u.match(/\.(mp4|webm|mov|blob)(\?.*)?$/i) || u.includes("blob")));
                         if(isVid) { vEng+=eng; vVws+=vws; } else { iEng+=eng; iVws+=vws; }
                       });
                       if (vVws>0) videoEr = ((vEng/vVws)*100).toFixed(1);
                       if (iVws>0) imageEr = ((iEng/iVws)*100).toFixed(1);
                     }
                     return (
                       <>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                             <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF7A59" }} />
                             <span style={{ color: "#F6F1EC", fontSize: 14 }}>Video <span style={{ color: "var(--text-secondary)", fontSize: 11, marginLeft: 4 }}>({videoEr}% ER)</span></span>
                           </div>
                           <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.video}</span>
                         </div>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                             <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#C2478D" }} />
                             <span style={{ color: "#F6F1EC", fontSize: 14 }}>GÃ¶rsel <span style={{ color: "var(--text-secondary)", fontSize: 11, marginLeft: 4 }}>({imageEr}% ER)</span></span>
                           </div>
                           <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{zernioData.formatBreakdown.image}</span>
                         </div>
                       </>
                     );
                   })()}
                </div>
            </div>
          </div>
        )}

        {/* Platform Breakdown Table */}
        {zernioData.platformBreakdown.length > 0 && (
          <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", overflowX: "auto" }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>Platform KÃ„Â±rÃ„Â±lÃ„Â±mÃ„Â±</h3>
             <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                   <tr>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>Platform</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>GÃƒÂ¶nderi</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>EriÃ…Å¸im</th>
                     <th style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)", fontWeight: 600 }}>BeÃ„Å¸eni</th>
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

      {/* Platform Performance Bar Charts */}
      {zernioData.platformBreakdown.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
           <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 24 }}>Platform BazlÃ„Â± EtkileÃ…Å¸im</h3>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", height: 300, width: "100%" }}>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>GÃƒÂ¶nderi SayÃ„Â±sÃ„Â±</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="postCount" name="GÃƒÂ¶nderi SayÃ„Â±sÃ„Â±" fill="#FF7A59" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>BeÃ„Å¸eni SayÃ„Â±sÃ„Â±</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="likes" name="BeÃ„Å¸eni SayÃ„Â±sÃ„Â±" fill="#C2478D" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
             <div style={{ height: "100%" }}>
               <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, textAlign: "center" }}>EriÃ…Å¸im</h4>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={zernioData.platformBreakdown}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                     <XAxis dataKey="platform" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : ''} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                     <Tooltip content={<CustomTooltip />} />
                     <Bar dataKey="reach" name="EriÃ…Å¸im" fill="#22B573" radius={[4,4,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>
      )}
      {/* 1. Best Times Heatmap */}
      {zernioData.bestTimes.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>En Ã„Â°yi PaylaÃ…Å¸Ã„Â±m ZamanlarÃ„Â±</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>HaftanÃ„Â±n gÃƒÂ¼nleri ve saatlere gÃƒÂ¶re ortalama etkileÃ…Å¸im yoÃ„Å¸unluÃ„Å¸u</p>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 8, marginTop: 20 }}>
              {["Pzt", "Sal", "Ãƒâ€¡ar", "Per", "Cum", "Cmt", "Paz"].map(day => (
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
                          title={slot ? `Saat: ${hourIdx}:00\nEtkileÃ…Å¸im: ${slot.avg_engagement}\nGÃƒÂ¶nderi: ${slot.post_count}` : ''}
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

          {(() => {
              const sorted = [...zernioData.bestTimes].sort((a: any, b: any) => (b.avg_engagement || 0) - (a.avg_engagement || 0));
              const topSlots = sorted.slice(0, 3);
              const dayNames = ["Pzt", "Sal", "Ãƒâ€¡ar", "Per", "Cum", "Cmt", "Paz"];
              if (topSlots.length > 0) {
                return (
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 16 }}>Ã¢Â­Â</span>
                    <p style={{ color: "#F6F1EC", fontSize: 13, fontWeight: 500 }}>
                      <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>En iyi zamanlar:</span>
                      {topSlots.map((s: any) => `${dayNames[s.day_of_week]} ${s.hour.toString().padStart(2, '0')}:00`).join(', ')}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
        </div>
      )}

      {/* 2. Content Decay Area Chart */}
      {zernioData.contentDecay.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>Ã„Â°ÃƒÂ§erik Ãƒâ€“mrÃƒÂ¼ (Content Decay)</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Zaman iÃƒÂ§inde toplam etkileÃ…Å¸imin yÃƒÂ¼zde kaÃƒÂ§Ã„Â±na ulaÃ…Å¸Ã„Â±ldÃ„Â±Ã„Å¸Ã„Â±</p>
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
                <Area type="monotone" dataKey="avg_pct_of_final" name="EtkileÃ…Å¸im YÃƒÂ¼zdesi" stroke="#C2478D" strokeWidth={3} fillOpacity={1} fill="url(#colorDecay)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Posting Frequency Scatter */}
      {zernioData.postingFrequency.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>PaylaÃ…Å¸Ã„Â±m SÃ„Â±klÃ„Â±Ã„Å¸Ã„Â± vs EtkileÃ…Å¸im OranÃ„Â±</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>HaftalÃ„Â±k gÃƒÂ¶nderi sayÃ„Â±sÃ„Â±nÃ„Â±n ortalama etkileÃ…Å¸im oranÃ„Â±na etkisi</p>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" dataKey="posts_per_week" name="HaftalÃ„Â±k GÃƒÂ¶nderi" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="avg_engagement_rate" name="EtkileÃ…Å¸im OranÃ„Â± (%)" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                <ZAxis type="number" dataKey="weeks_count" range={[60, 400]} name="Hafta SayÃ„Â±sÃ„Â±" />
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
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F6F1EC", marginBottom: 4 }}>Son GÃƒÂ¶nderi EtkileÃ…Å¸im EÃ„Å¸risi</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>SeÃƒÂ§ili gÃƒÂ¶nderinin zaman iÃƒÂ§indeki performansÃ„Â±</p>
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

      {/* Top Performing Posts Table */}
      {zernioData.postAnalytics && zernioData.postAnalytics.length > 0 && (
        <div className="glass" style={{ borderRadius: 16, padding: "24px", border: "1px solid rgba(255,255,255,0.06)", marginTop: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#F6F1EC", marginBottom: 20 }}>Top Performing Posts</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "12px 8px", fontWeight: 600 }}>GÃƒÂ¶nderi</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>GÃƒÂ¶rÃƒÂ¼ntÃƒÂ¼lenme</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>EriÃ…Å¸im</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>BeÃ„Å¸eni</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>Yorum</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>PaylaÃ…Å¸Ã„Â±m</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>Kaydetme</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>TÃ„Â±klama</th>
                  <th style={{ padding: "12px 8px", fontWeight: 600, textAlign: "right" }}>ER%</th>
                </tr>
              </thead>
              <tbody>
                {[...zernioData.postAnalytics].sort((a: any, b: any) => {
                    const mA = a.analytics || a.metrics || a || {};
                    const mB = b.analytics || b.metrics || b || {};
                    const totalA = (mA.likes || 0) + (mA.comments || 0) + (mA.shares || 0) + (mA.impressions || mA.views || 0);
                    const totalB = (mB.likes || 0) + (mB.comments || 0) + (mB.shares || 0) + (mB.impressions || mB.views || 0);
                    return totalB - totalA;
                }).slice(0, 10).map((post: any, idx: number) => {
                  const metrics = post.analytics || post.metrics || post || {};
                  const views = metrics.impressions || metrics.views || 0;
                  const reach = metrics.reach || 0;
                  const likes = metrics.likes || 0;
                  const comments = metrics.comments || 0;
                  const shares = metrics.shares || 0;
                  const saves = metrics.saves || 0;
                  const clicks = metrics.clicks || 0;
                  const er = metrics.engagementRate || metrics.er || (views > 0 ? (((likes + comments + shares + saves) / views) * 100).toFixed(2) : '0.00');
                  const postName = post.content ? (post.content.substring(0, 40) + (post.content.length > 40 ? '...' : '')) : (post.title || post.id || `Post #${idx + 1}`);
                  
                  return (
                    <tr key={post.id || idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC" }}>{postName}</td>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC", textAlign: "right" }}>{views.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC", textAlign: "right" }}>{reach.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#FF7A59", textAlign: "right" }}>{likes.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#E8A8CD", textAlign: "right" }}>{comments.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC", textAlign: "right" }}>{shares.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC", textAlign: "right" }}>{saves.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#F6F1EC", textAlign: "right" }}>{clicks.toLocaleString()}</td>
                      <td style={{ padding: "12px 8px", color: "#22B573", textAlign: "right" }}>{er}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  };

  const renderInboxAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(194,71,141,0.1), rgba(194,71,141,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>ÄŸÅ¸â€œÂ¥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.messagesReceived")}</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#E8A8CD", fontFamily: "Outfit, sans-serif" }}>{zernioData.messagesReceived || stats.messagesReceived || 0}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(255,122,89,0.1), rgba(255,122,89,0.5))" }}>
          <div style={{ background: "#17151A", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>ÄŸÅ¸â€œÂ¤</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.messagesSent")}</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#FF7A59", fontFamily: "Outfit, sans-serif" }}>{stats.messagesSent || 0}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>ÄŸÅ¸â€˜ÂÃ¯Â¸Â</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>{t("analizPage.inbox.readRate")}</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#F6F1EC" }}>%84</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>Ã¢ÂÂ±Ã¯Â¸Â</span>
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
          <span style={{ fontSize: 48, filter: "drop-shadow(0 0 20px rgba(255,122,89,0.4))", marginBottom: 16 }}>ÄŸÅ¸Å¡â‚¬</span>
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
            <span style={{ fontSize: 16, color: selectedPlatform.color }}>Ã¢Ëœâ€¦</span>
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getPlatformLabel(selectedPlatform)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>Ã¢â€“Â¼</span>
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
                  <span style={{ fontSize: 16, color: p.color }}>Ã¢Ëœâ€¦</span>
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
            <span style={{ fontSize: 16, color: "var(--text-secondary)" }}>Ã¢ÂÂ±Ã¯Â¸Â</span>
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getTimeRangeLabel(selectedTimeRange)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>Ã¢â€“Â¼</span>
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



