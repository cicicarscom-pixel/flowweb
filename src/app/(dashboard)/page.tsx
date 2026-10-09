"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/org";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import AppointmentNotifications from "@/components/dashboard/AppointmentNotifications";
import { useRouter } from "next/navigation";
import { formatMoney } from '@/lib/money';
import InvoiceCard from "@/components/dashboard/InvoiceCard";
import SocialSummaryCard, { SocialAccountSummary } from "@/components/dashboard/SocialSummaryCard";
import { todayInTimezone, addDaysYmd, monthRangeYmd } from "@/lib/dates";

export default function DashboardHomePage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [aiActive, setAiActive] = useState(true);
  const [financeStats, setFinanceStats] = useState({ income: 0, expense: 0 });
  const [socialStats, setSocialStats] = useState({ followers: 0, trend: 0 });
  const [latestInvoice, setLatestInvoice] = useState<any>(null);
  const [orgTimezone, setOrgTimezone] = useState('Europe/Istanbul');
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountSummary[]>([]);
  const [hasSocialAccounts, setHasSocialAccounts] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState({ messages: 0, comments: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [totalUpcomingAppointments, setTotalUpcomingAppointments] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const merchantId = session?.user?.id || null;

        // Bot Status
        if (merchantId) {
          const { data: botData } = await supabase
            .from('bot_settings')
            .select('is_active')
            .maybeSingle();
          if (botData) setAiActive(botData.is_active);
        }

        // Finance Stats (Transactions + Finance Documents)
        let timezone = 'Europe/Istanbul';
        if (merchantId) {
          const { data: org } = await supabase.from('organizations').select('timezone').eq('owner_id', merchantId).maybeSingle();
          if (org?.timezone) timezone = org.timezone;
        }
        setOrgTimezone(timezone);
        const today = todayInTimezone(timezone);
        
        let orgId = null;
        if (merchantId) {
          const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', merchantId).limit(1).maybeSingle();
          orgId = orgMember?.organization_id;
        }

        if (orgId) {
          const { data: latestDoc } = await supabase.from('finance_documents')
            .select('*')
            .eq('organization_id', orgId)
            .is('archived_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          setLatestInvoice(latestDoc);
        }

        const { from: p_from, to: p_to } = monthRangeYmd(today);

        const { data: summaryData } = await supabase.rpc('get_finance_summary', { p_from, p_to });
        if (summaryData && summaryData.status === 'SUCCESS') {
          setFinanceStats({ income: summaryData.income / 100, expense: summaryData.expense / 100 });
        }

        // Social Stats (Zernio)
        const { data: followRes } = await supabase.functions.invoke('zernio-client', {
          body: { action: 'get-follower-stats', payload: {} }
        });
        
        let totalFollowers = 0;
        let totalTrend = 0;
        let accountsWithTrend = 0;

        // zernio-client yanıtı {success, data: <gövde>}; gövde {accounts,...}. Eski sürümler bir kat daha sarmalıyordu.
        const fb: any = (followRes as any)?.data;
        const actualFollow: any = Array.isArray(fb?.accounts) ? fb
          : Array.isArray(fb?.data?.accounts) ? fb.data
          : Array.isArray(fb?.data?.data?.accounts) ? fb.data.data
          : {};
        if (actualFollow.accounts) {
           totalFollowers = actualFollow.accounts.reduce((sum: number, a: any) => sum + (a.currentFollowers || a.followers || 0), 0);
           
           actualFollow.accounts.forEach((a: any) => {
              const t = a.followerGrowthPercentage || a.growthPercentage || a.trend || a.growth || 0;
              if (t > 0 || t < 0) {
                 totalTrend += t;
                 accountsWithTrend++;
              }
           });
        }
        
        // Use average trend if available, otherwise fallback to global actualFollow.trend or 0
        const finalTrend = accountsWithTrend > 0 
           ? Number((totalTrend / accountsWithTrend).toFixed(1)) 
           : (actualFollow.trend || actualFollow.growthPercentage || actualFollow.totalGrowth || 0);

        setSocialStats(prev => ({ ...prev, followers: totalFollowers, trend: finalTrend }));
        const hasAccounts = Array.isArray(actualFollow.accounts) && actualFollow.accounts.length > 0;
        setHasSocialAccounts(hasAccounts);
        setSocialAccounts(hasAccounts ? (actualFollow.accounts as any[]).map((a: any) => ({
          id: String(a._id || a.id || a.accountId || Math.random()),
          platform: a.platform,
          name: a.displayName || a.username || '',
          username: a.username || '',
          picture: a.profilePicture || null,
          followers: Number(a.currentFollowers || a.followers || 0),
          growth: Number(a.growthPercentage || a.followerGrowthPercentage || a.growth || 0),
        })) : []);


        // Recent Activities (Messages & Comments)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayIso = todayStart.toISOString();

        const [{ data: msgs }, { data: comments }, { count: msgCount }, { count: cmtCount }] = await Promise.all([
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', todayIso),
          supabase.from('comments').select('*', { count: 'exact', head: true }).gte('created_at', todayIso)
        ]);

        setDailyStats({ messages: msgCount || 0, comments: cmtCount || 0 });
        
        let merged: any[] = [];
        if (msgs) {
          merged = [...merged, ...msgs.map(m => ({
            id: 'msg_'+m.id,
            type: t('dashboardHome.activityTypes.message'),
            platform: 'WHATSAPP',
            name: m.sender_name || t('dashboardHome.defaults.customer'),
            message: m.message_body || m.content || '',
            date: m.created_at,
            color: "#FF7A59"
          }))];
        }
        if (comments) {
          merged = [...merged, ...comments.map(c => ({
            id: 'cmt_'+c.id,
            type: t('dashboardHome.activityTypes.comment'),
            platform: (c.platform || 'INSTAGRAM').toUpperCase(),
            name: c.username || t('dashboardHome.defaults.user'),
            message: c.text || c.content || '',
            date: c.created_at,
            color: "#E8A8CD"
          }))];
        }
        
        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivities(merged.slice(0, 3));

                  const nextDateStr = addDaysYmd(today, 1);

          const calsMap: Record<string, string> = {};
          if (merchantId) {
            const { data: cals } = await supabase.from('calendars').select('id, name');
            if (cals) cals.forEach((c: any) => calsMap[c.id] = c.name);
          }

          const { data: todayData } = await supabase.from('appointments').select('*')
            .gte('date', today).lt('date', nextDateStr)
            .in('status', ['Pending', 'Approved'])
            .order('starts_at', { ascending: true });

          const { data: upcData } = await supabase.from('appointments').select('*')
            .gte('date', nextDateStr)
            .in('status', ['Pending', 'Approved'])
            .order('starts_at', { ascending: true })
            .limit(7);

          const { count: totalUpc } = await supabase.from('appointments').select('id', { count: 'exact', head: true })
            .gte('date', nextDateStr)
            .in('status', ['Pending', 'Approved']);

          setTotalUpcomingAppointments(totalUpc || 0);

          const mapAppt = (a: any) => {
            const targetDate = a.starts_at || a.date ? new Intl.DateTimeFormat('en-CA', { timeZone: a.timezone || 'Europe/Istanbul' }).format(new Date(a.starts_at || a.date)) : null;
            return {
              id: a.id,
              targetDate,
              time: (a.starts_at || a.date) ? new Date(a.starts_at || a.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: a.timezone || 'Europe/Istanbul' }) : '00:00',
              customerName: a.customer_name || t('randevuPage.timeline.unnamedCustomer'),
              calendarName: a.calendar_id && calsMap[a.calendar_id] ? calsMap[a.calendar_id] : null,
              serviceName: a.service_name || null,
              note: a.customer_request_raw || null,
              color: '#FF7A59',
              dateText: a.starts_at || a.date
            };
          };

          setTodayAppointments((todayData || []).map(mapAppt));
          setAppointments((upcData || []).map(mapAppt));

      } catch (error) {
        console.warn('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleAiStatus = async () => {
    const newStatus = !aiActive;
    setAiActive(newStatus); // optimistic UI update
    
    const { data: { session } } = await supabase.auth.getSession();
    const orgId = session ? await getCurrentOrgId(supabase) : null;
    if (orgId) {
      await supabase
        .from('bot_settings')
        .update({ is_active: newStatus, social_bot_active: newStatus })
        .eq('org_id', orgId);
    }
  };

  const formatCurrency = (amount: number) => formatMoney(amount, locale);
  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t('dashboardHome.relativeTime.minutesAgo', { count: Math.max(1, mins) });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('dashboardHome.relativeTime.hoursAgo', { count: hrs });
    return t('dashboardHome.relativeTime.daysAgo', { count: Math.floor(hrs / 24) });
  };

  if (isLoading) {
    return (
      <div style={{ padding: "28px 32px", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A59]"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* AI Summary Bubble */}
      <div className="glass neon-cyan" style={{ borderRadius: 20, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 74, height: 74, borderRadius: 23, background: "linear-gradient(135deg,#FF7A5922,#22B57322)",
          border: "1.5px solid rgba(255,122,89,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
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
          <p style={{ fontSize: 11, color: "rgba(255,122,89,0.7)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>{t('dashboardHome.aiSummary.eyebrow')}</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
            {t.rich('dashboardHome.aiSummary.messagesComments', {
              messages: dailyStats.messages,
              comments: dailyStats.comments,
              msg: (chunks) => <strong style={{ color: "#FF7A59" }}>{chunks}</strong>,
              cmt: (chunks) => <strong style={{ color: "#22B573" }}>{chunks}</strong>,
            })}
            {hasSocialAccounts && (
              socialStats.trend > 0 ? (
                 <> {t.rich('dashboardHome.aiSummary.trendUp', {
                      trend: socialStats.trend,
                      pct: (chunks) => <strong style={{ color: "#F59E0B" }}>{chunks}</strong>,
                    })}</>
              ) : (
                 <> {t('dashboardHome.aiSummary.trendAnalyzing')}</>
              )
            )}
            {todayAppointments.length > 0 ? (
               <> {t.rich('dashboardHome.aiSummary.appointmentsToday', {
                    count: todayAppointments.length,
                    ap: (chunks) => <strong style={{ color: "#C2478D" }}>{chunks}</strong>,
                  })}</>
            ) : (
               <> {t('dashboardHome.aiSummary.noAppointmentsToday')}</>
            )}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingLeft: 20, borderLeft: "1px solid rgba(255,255,255,0.1)", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: aiActive ? "#FF7A59" : "#A79E96", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace" }}>
            {aiActive ? t('dashboardHome.aiSummary.statusActive') : t('dashboardHome.aiSummary.statusInactive')}
          </span>
          <div 
            onClick={toggleAiStatus}
            style={{ width: 44, height: 24, borderRadius: 12, background: aiActive ? "rgba(255,122,89, 0.2)" : "rgba(255,255,255,0.1)", border: `1.5px solid ${aiActive ? "rgba(255,122,89, 0.4)" : "rgba(255,255,255,0.2)"}`, position: "relative", cursor: "pointer" }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 1.5, right: aiActive ? 2 : 'auto', left: !aiActive ? 2 : 'auto', boxShadow: aiActive ? "0 0 10px #FF7A59" : "none" }} />
          </div>
        </div>
      </div>
      {/* Randevular */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                  {/* Today's Appointments */}
          <div className="glass" style={{ display: "flex", flexDirection: "column", borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14 }}>{t('dashboardAppointments.appointments.todayTitle')}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "center" }}>
              {todayAppointments.length > 0 ? todayAppointments.map((a, i) => (
                <div key={i} onClick={() => a.targetDate && router.push(`/ai-asistan/randevu?date=${a.targetDate}`)} style={{ display: "flex", gap: 12, alignItems: "center", cursor: a.targetDate ? "pointer" : "default" }}>
                  <span style={{ color: a.color, fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", width: 38, flexShrink: 0 }}>{a.time}</span>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: a.color, flexShrink: 0, opacity: 0.6 }} />
                  <div>
                      <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{a.customerName}</p>
                      {(a.calendarName || a.serviceName || a.note) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                          {a.calendarName && <span style={{ color: '#22B573', background: 'rgba(34,181,115,0.1)', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>{a.calendarName}</span>}
                          {a.serviceName && <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>🏷️ {a.serviceName}</span>}
                          {a.note && <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>📝 {a.note}</span>}
                        </div>
                      )}
                    </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{t('dashboardAppointments.appointments.todayEmpty')}</span>
                </div>
              )}
            </div>
          </div>
          {/* Upcoming Appointments */}
          <div className="glass" style={{ display: "flex", flexDirection: "column", borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14 }}>{t('dashboardAppointments.appointments.upcomingTitle')}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "center" }}>
              {appointments.length > 0 ? appointments.map((a, i) => {
                const displayTime = (new Date(a.dateText).getDate() === new Date().getDate() ? '' : new Date(a.dateText).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) + ' ') + a.time;
                return (
                <div key={i} onClick={() => a.targetDate && router.push(`/ai-asistan/randevu?date=${a.targetDate}`)} style={{ display: "flex", gap: 12, alignItems: "center", cursor: a.targetDate ? "pointer" : "default" }}>
                  <span style={{ color: a.color, fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", width: 55, flexShrink: 0, textAlign: 'right' }}>{displayTime}</span>
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: a.color, flexShrink: 0, opacity: 0.6 }} />
                  <div>
                      <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{a.customerName}</p>
                      {(a.calendarName || a.serviceName || a.note) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                          {a.calendarName && <span style={{ color: '#22B573', background: 'rgba(34,181,115,0.1)', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 500 }}>{a.calendarName}</span>}
                          {a.serviceName && <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>🏷️ {a.serviceName}</span>}
                          {a.note && <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>📝 {a.note}</span>}
                        </div>
                      )}
                    </div>
                </div>
              )}) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{t('dashboardAppointments.appointments.upcomingEmpty')}</span>
                </div>
              )}
              {totalUpcomingAppointments > appointments.length && (
                <div onClick={() => router.push(`/ai-asistan/randevu`)} style={{ marginTop: 10, textAlign: 'center', cursor: 'pointer' }}>
                  <span style={{ color: "#00F2FE", fontSize: 13, fontWeight: 500 }}>{t('dashboardAppointments.appointments.viewAll')} ({totalUpcomingAppointments})</span>
                </div>
              )}
            </div>
          </div>
      </div>
      {/* Financial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {[
          // NOT: "change"/"up" (ör. "+12.4%") alanları kaldırıldı (17.09.2026) — bunlar
          // gerçek income/expense verisine hiç bağlı olmayan sabit (hardcoded) rozetlerdi,
          // bu yüzden reset (soft/hard) sonrasında tutarlar sıfırlansa bile hiç değişmiyorlardı.
          // Kullanıcı fark etti. Gerçek ay-üstü-ay trend hesaplaması ayrı bir özellik olarak
          // ele alınana kadar rozet tamamen kaldırıldı.
          { label: t('dashboardHome.finance.monthlyIncome'), value: `${formatCurrency(financeStats.income)}`, color: "#22B573" },
          { label: t('dashboardHome.finance.monthlyExpense'), value: `${formatCurrency(financeStats.expense)}`, color: "#EF4444" },
        ].map(m => (
          <div key={m.label} className="glass" style={{ borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)", height: "100%" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{m.label}</p>
            <p style={{ color: m.color, fontSize: 28, fontWeight: 700, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>{m.value}</p>
          </div>
        ))}
      </div>
      {/* Invoice & Social */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <InvoiceCard invoice={latestInvoice} locale={locale} todayYmd={todayInTimezone(orgTimezone)} onScan={() => router.push("/ai-muhasebe/veri-girisi")} />
        {/* Social Media Stats (Tüm Hesaplar) */}
        {hasSocialAccounts ? (
          <SocialSummaryCard accounts={socialAccounts} totalFollowers={socialStats.followers} trend={socialStats.trend} locale={locale} />
        ) : (
          <div className="glass neon-cyan" style={{ display: "flex", flexDirection: "column", borderRadius: 20, padding: 24, height: "100%", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 6 }}>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>{t('dashboardHome.social.allAccounts')}</p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{t('dashboardHome.social.noAccounts')}</p>
            <Link href="/sosyal-medya" style={{ color: "#00F2FE", fontSize: 13, fontWeight: 500, marginTop: 8, display: "inline-block" }}>
              {t('dashboardHome.social.connectAccount')}
            </Link>
          </div>
        )}
      </div>
      <AppointmentNotifications locale={locale as "tr" | "en" | "de"} />
      {recentActivities.length > 0 && (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>{t('dashboardHome.recentActivities.title')}</p>
          <Link href="/sosyal-medya/inbox" style={{ fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>{t('dashboardHome.recentActivities.viewAll')}</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentActivities.map(act => (
            <div key={act.id} className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, borderLeft: `3px solid ${act.color}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden" }}>
                <img alt="" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(act.name)}&background=random&color=fff`} style={{ width: "100%", height: "100%" }} />
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
             <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{t('dashboardHome.recentActivities.empty')}</span>
          )}
        </div>
      </div>
      )}
    </div>
  );




}