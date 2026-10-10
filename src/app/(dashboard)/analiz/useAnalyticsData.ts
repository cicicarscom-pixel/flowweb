"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { todayInTimezone } from "@/lib/dates";
import type { Platform, TimeRange } from "./analizConfig";

export type InternalStats = {
  totalPosts: number;
  totalComments: number;
  totalReviews: number;
  messagesReceived: number;
  messagesSent: number;
};

export type ZernioData = {
  timelineData: any[];
  timelineDataLikes: any[];
  demographics: any[];
  followerStats: any[];
  platformInsights: any;
  platformBreakdown: any[];
  bestTimes: any[];
  contentDecay: any[];
  postingFrequency: any[];
  engagementOverTime: any[];
  postAnalytics: any[];
  totalFollowers: number;
  totalPosts: number;
  totalComments: number;
  totalReach: number;
  messagesReceived: number;
  formatBreakdown: { video: number; image: number };
  inboxVolume: any;
  inboxPerformance: any;
};

/**
 * Analiz sayfasının veri katmanı: kendi veritabanı sayaçları + Zernio analitikleri.
 * (page.tsx'ten birebir taşındı; davranış değişmedi.)
 */
export function useAnalyticsData(selectedPlatform: Platform, selectedTimeRange: TimeRange) {
  const [isLoading, setIsLoading] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);

  const supabase = createClient();

  const [stats, setStats] = useState<InternalStats>({
    totalPosts: 0,
    totalComments: 0,
    totalReviews: 0,
    messagesReceived: 0,
    messagesSent: 0
  });

  const [zernioData, setZernioData] = useState<ZernioData>({
    timelineData: [] as any[],
    timelineDataLikes: [] as any[],
    demographics: [] as any[],
    followerStats: [] as any[],
    platformInsights: null as any,
    platformBreakdown: [] as any[],
    bestTimes: [] as any[],
    contentDecay: [] as any[],
    postingFrequency: [] as any[],
    engagementOverTime: [] as any[],
    postAnalytics: [] as any[],
    totalFollowers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalReach: 0,
    messagesReceived: 0,
    formatBreakdown: { video: 0, image: 0 },
    inboxVolume: null as any,
    inboxPerformance: null as any
  });

  const requestRef = useRef(0);

  const fetchInternalStats = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).limit(1).maybeSingle();
      const orgId = orgMember?.organization_id;
      if (!orgId) return;

      let qPosts = supabase.from('posts').select('media_urls').eq('profile_id', orgId);
      let qComments = supabase.from('comments').select('*', { count: 'exact', head: true }).eq('profile_id', orgId);
      let qReviews = supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('profile_id', orgId);
      
      if (selectedPlatform.id !== 'all') {
         const pName = selectedPlatform.id === 'googlebusiness' ? 'google' : selectedPlatform.id;
         // posts tablosunda tekil 'platform' sütunu yok; 'platforms' dizi sütunu var (400 hatası veriyordu)
         qPosts = qPosts.contains('platforms', [selectedPlatform.id]);
         qComments = qComments.eq('platform', pName);
         qReviews = qReviews.eq('platform', pName);
      }

      const [{ data: postsData }, { count: commentsCount }, { count: reviewsCount }, { count: msgsInCount }, { count: msgsOutCount }, { data: accountsData }] = await Promise.all([
        qPosts,
        qComments,
        qReviews,
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
        messagesReceived: selectedPlatform.id === 'all' ? (msgsInCount || 0) : 0, // Fallback if no specific platform data for messages
        messagesSent: selectedPlatform.id === 'all' ? (msgsOutCount || 0) : 0
      });
      
      setZernioData(prev => ({ ...prev, formatBreakdown: { video: videoCount, image: imageCount } }));

      if (accountsData) {
        setSocialAccounts(accountsData);
      }
    } catch (err) {
      console.warn('Error fetching internal stats:', err);
    }
  }, [selectedPlatform.id, supabase]);

  const fetchZernioAnalytics = useCallback(async () => {
    const currentRequestId = ++requestRef.current;
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        if (currentRequestId === requestRef.current) setIsLoading(false);
        return;
      }

      // Merkezi çağrı sarmalayıcı. Zernio zarfını ({success, data}) ve
      // zernio-client'ın "sometimes sdk wraps it in { data: ... }" davranışını
      // (bkz. fetchAnalyticsWithCache) tek noktadan açar.
      // - Taşıma/altyapı hatasında (network, fonksiyon çağrısı patlarsa) fırlatır
      //   ve tüm fetchZernioAnalytics'i durdurur — bu doğru, çünkü session/ağ
      //   temelden bozuksa geri kalan çağrılar da anlamsız olur.
      // - Zernio/edge function'ın kendi döndürdüğü "yumuşak" hatada
      //   ({success:false, error, code} — ki bugünkü tasarımda HTTP 200 ile
      //   geliyor) FIRLATMAZ: sadece o tek action'ı uyarı olarak loglar ve boş
      //   veri döner. Böylece örn. content-decay başarısız olsa bile, zaten
      //   başarıyla gelmiş best-times/daily-metrics verisi çöpe atılmaz.
      const invokeZernio = async (action: string, payload: any): Promise<any> => {
        const { data, error } = await supabase.functions.invoke('zernio-client', {
          body: { action, payload },
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (error) {
          throw error;
        }
        if (data?.success === false) {
          console.warn(`[Zernio] "${action}" başarısız:`, data.error, `(${data.code})`);
          return {};
        }
        return data?.data?.data || data?.data || {};
      };

      const targetAccounts = selectedPlatform.id === 'all'
        ? socialAccounts
        : socialAccounts.filter(a => a.platform.toLowerCase() === selectedPlatform.id || (selectedPlatform.id === 'googlebusiness' && a.platform.toLowerCase() === 'google'));

      let timezone = 'Europe/Istanbul';
      if (session?.user?.id) {
        const { data: orgData } = await supabase.from('organizations').select('timezone').eq('owner_id', session?.user?.id).maybeSingle();
        if (orgData?.timezone) timezone = orgData.timezone;
      }
      
      const _toDate = todayInTimezone(timezone);
      const fromDateObj = new Date(Date.now() - (selectedTimeRange.days || 30) * 24 * 60 * 60 * 1000);
      const _fromDate = todayInTimezone(timezone, fromDateObj);

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
        engagementOverTime: [] as any[],
        postAnalytics: [] as any[],
        totalFollowers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalReach: 0,
        messagesReceived: 0,
        formatBreakdown: { video: 0, image: 0 },
        inboxVolume: null as any,
        inboxPerformance: null as any
      };

      // Seçili platforma göre gereken tek platforma-özel çağrı grubu. Hiçbiri
      // daily-metrics/best-times/vb. sonuçlarına bağımlı değil, o yüzden
      // aşağıdaki ana Promise.all'a aynen katılabiliyor.
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

      // Birbirinden tamamen bağımsız tüm keşif çağrılarını PARALEL yürüt.
      // Öncesinde bunlar 7-9 ayrı network round-trip'i olarak sırayla
      // "await" ediliyordu (sayfa yüklemesini gereksiz yavaşlatıyor, ve
      // aradaki her bekleme auth/oturum zamanlama sorunlarına daha açık hale
      // getiriyordu). Hiçbiri bir diğerinin sonucuna ihtiyaç duymadığından
      // hepsini aynı anda ateşlemek güvenli.
      const [
        actualData,
        actualMsgs,
        actualBestTimes,
        actualFreq,
        actualDecay,
        actualPostAnalytics,
        actualInboxVolume,
        actualInboxPerformance,
        actualEngagementOverTime,
        platformResult
      ] = await Promise.all([
        invokeZernio('get-daily-metrics', payloadBase),
        invokeZernio('sync-messages', {}),
        invokeZernio('get-best-times', payloadBase),
        invokeZernio('get-posting-frequency', payloadBase),
        invokeZernio('get-content-decay', payloadBase),
        invokeZernio('get-post-analytics', payloadBase),
        invokeZernio('get-inbox-volume', payloadBase).catch(() => ({})),
        invokeZernio('get-inbox-performance', payloadBase).catch(() => ({})),
        // 18.09.2026: "Engagement over time" kartı eskiden get-post-timeline
        // ile SADECE en son atılan tek gönderinin günlük etkileşim geçmişini
        // çekiyordu — Zernio'nun kendi panelindeki aynı isimli grafik ise
        // hesabın TAMAMININ 30 günlük etkileşim trendini gösteriyor. Kullanıcı
        // bu ikisini karşılaştırıp bizim tarafta "veri yok" sandı (bkz. README).
        // Zernio SDK tip tanımına göre attribution:'received', "buckets the
        // per-day increase in engagement by the day it actually arrived
        // (engagement-over-time)" — yani Zernio'nun kendi grafiğinin ürettiği
        // veriyle birebir aynı hesaplama. Artık bu kart da get-daily-metrics'i
        // attribution:'received' ile çağırıyor; tek gönderiye değil hesabın
        // tamamına bakıyor.
        invokeZernio('get-daily-metrics', { query: { ...queryArgs, attribution: 'received' } }),
        platformCall
      ]);

      // --- Sonuçları state şekline dök (tamamen senkron, saf eşleme) ---
      if (actualData.dailyData) {
         const mappedTimeline = actualData.dailyData.map((d: any) => ({
           views: d.metrics?.impressions || 0,
           likes: d.metrics?.likes || 0,
           reach: d.metrics?.reach || 0,
           clicks: d.metrics?.clicks || 0,
           shares: d.metrics?.shares || 0,
           saves: d.metrics?.saves || 0,
           comments: d.metrics?.comments || 0,
           follows: d.metrics?.followers || d.metrics?.follows || d.metrics?.newFollowers || 0,
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

      if (actualEngagementOverTime.dailyData) {
         newZernioData.engagementOverTime = actualEngagementOverTime.dailyData.map((d: any) => ({
           date: d.date ? d.date.substring(5, 10) : '',
           views: d.metrics?.views || d.metrics?.impressions || 0,
           likes: d.metrics?.likes || 0,
           comments: d.metrics?.comments || 0,
           shares: d.metrics?.shares || 0,
           saves: d.metrics?.saves || 0,
           clicks: d.metrics?.clicks || 0,
           reach: d.metrics?.reach || 0,
           impressions: d.metrics?.impressions || 0,
         }));
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

      newZernioData.inboxVolume = actualInboxVolume;
      newZernioData.inboxPerformance = actualInboxPerformance;

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
  }, [selectedPlatform.id, selectedTimeRange.days, socialAccounts, supabase]);

  useEffect(() => {
    fetchInternalStats();
  }, [fetchInternalStats]);

  useEffect(() => {
    if (socialAccounts.length > 0) {
      fetchZernioAnalytics();
    }
  }, [fetchZernioAnalytics, socialAccounts.length]);

  return { isLoading, stats, zernioData };
}
