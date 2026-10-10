"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { todayInTimezone, monthRangeYmd } from '@/lib/dates';
import { formatMoney } from '@/lib/money';

type Row = {
  id: string;
  type: string;
  title: string | null;
  amount_minor: number;
  day: string;
  payment_status: string;
  is_overdue: boolean;
  source: string | null;
};
type Summary = { income: number; expense: number; balance: number };
type Tab = 'income' | 'expense' | 'invoices';

const EMPTY: Summary = { income: 0, expense: 0, balance: 0 };

export default function IsletmemPage() {
  const t = useTranslations();
  const locale = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, Summary>>({});
  const [tab, setTab] = useState<Tab>('income');
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        let tz = 'Europe/Istanbul';
        if (session?.user?.id) {
          const { data: org } = await supabase.from('organizations').select('timezone').eq('owner_id', session.user.id).maybeSingle();
          if (org?.timezone) tz = org.timezone;
        }
        const today = todayInTimezone(tz);
        const { to: p_to } = monthRangeYmd(today);
        const { data } = await supabase.rpc('get_payment_calendar', { p_from: '2020-01-01', p_to });
        const list: Row[] = (data || []).filter((r: Row) => r.day);
        const keys = Array.from(new Set<string>([today.slice(0, 7), ...list.map(r => r.day.slice(0, 7))]));
        keys.sort((a, b) => b.localeCompare(a));
        setRows(list);
        setMonths(keys);
        setSelected(keys[0]);
      } catch (e) {
        console.warn('Isletmem fetch error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  const loadSummary = async (ym: string): Promise<Summary> => {
    const { from: p_from, to: p_to } = monthRangeYmd(ym + '-01');
    const { data } = await supabase.rpc('get_finance_summary', { p_from, p_to });
    if (data && data.status === 'SUCCESS') {
      return { income: data.income / 100, expense: data.expense / 100, balance: (data.income - data.expense) / 100 };
    }
    return EMPTY;
  };

  const idx = selected ? months.indexOf(selected) : -1;
  const prevMonth = idx >= 0 && idx + 1 < months.length ? months[idx + 1] : null;

  useEffect(() => {
    if (!selected) return;
    const need = [selected, prevMonth].filter((m): m is string => !!m && !summaries[m]);
    if (need.length === 0) return;
    let alive = true;
    (async () => {
      const res = await Promise.all(need.map(async m => [m, await loadSummary(m).catch(() => EMPTY)] as const));
      if (alive) setSummaries(p => ({ ...p, ...Object.fromEntries(res) }));
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, prevMonth]);

  useEffect(() => { setInsight(''); }, [selected]);

  const cur = (selected && summaries[selected]) || EMPTY;
  const prev = (prevMonth && summaries[prevMonth]) || EMPTY;
  const trend = prevMonth && prev.balance !== 0 ? ((cur.balance - prev.balance) / Math.abs(prev.balance)) * 100 : null;

  const monthLabel = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const money = (n: number) => formatMoney(n, locale);

  const shown = rows.filter(r => selected && r.day.slice(0, 7) === selected).filter(r => {
    if (tab === 'income') return r.type === 'income' || r.type === 'sales';
    if (tab === 'expense') return r.type === 'expense';
    return r.source === 'invoice_scan';
  }).filter(r => !query.trim() || (r.title || '').toLowerCase().includes(query.trim().toLowerCase()));

  const statusBadge = (r: Row) => {
    if (r.payment_status === 'paid') return { cls: 'bg-[#22B573]/20 text-[#22B573]', label: t('aiMuhasebePage.isletmem.statusPaid') };
    if (r.is_overdue) return { cls: 'bg-[#EF4444]/20 text-[#EF4444]', label: t('aiMuhasebePage.isletmem.statusOverdue') };
    if (r.payment_status === 'partial') return { cls: 'bg-[#F59E0B]/20 text-[#F59E0B]', label: t('aiMuhasebePage.isletmem.statusPartial') };
    return { cls: 'bg-white/10 text-[#E8D5A3]', label: t('aiMuhasebePage.isletmem.statusPending') };
  };

  const generateInsight = async () => {
    setInsightLoading(true);
    setInsight('');
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { monthData: { income: cur.income, expense: cur.expense }, previousMonthData: { income: prev.income, expense: prev.expense } },
      });
      setInsight(!error && data?.success ? data.insight : t('aiMuhasebePage.isletmem.analysisUnavailable'));
    } catch {
      setInsight(t('aiMuhasebePage.isletmem.analysisUnavailable'));
    } finally {
      setInsightLoading(false);
    }
  };

  const tabBtn = (k: Tab, label: string) => (
    <button key={k} onClick={() => setTab(k)} className={`pb-3 text-sm font-medium transition-colors ${tab === k ? 'text-[#22B573] border-b-2 border-[#22B573]' : 'text-on-surface-variant hover:text-[#F6F1EC]'}`}>{label}</button>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" data-purpose="main-content">
      <div className="px-8 py-6 flex items-center justify-between flex-shrink-0" data-purpose="page-header">
        <div>
          <h1 className="text-2xl font-bold text-[#F6F1EC]">{t('aiMuhasebePage.isletmem.title')}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{t('aiMuhasebePage.isletmem.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6" data-purpose="dashboard-content">
        <div className="flex items-center gap-3">
          <select
            value={selected || ''}
            onChange={e => setSelected(e.target.value)}
            disabled={loading || months.length === 0}
            className="bg-[#22B573] text-[#0F1115] px-4 py-2 rounded-lg text-sm font-medium focus:outline-none"
          >
            {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
        </div>

        <div className="bg-[#2A2631] border border-[#22B573]/30 rounded-2xl p-6" data-purpose="balance-card">
          <h2 className="text-on-surface-variant text-sm font-medium tracking-wide mb-2 uppercase">{t('aiMuhasebePage.isletmem.totalBalance')}</h2>
          <div className={`text-5xl font-bold mb-4 tracking-tight ${cur.balance < 0 ? 'text-[#EF4444]' : 'text-[#22B573]'}`}>{money(cur.balance)}</div>
          {trend !== null && (
            <div className={`flex items-center gap-2 text-sm font-medium ${trend >= 0 ? 'text-[#22B573]' : 'text-[#EF4444]'}`}>
              <i className={`fa-solid ${trend >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
              <span>{t(trend >= 0 ? 'aiMuhasebePage.isletmem.trendUp' : 'aiMuhasebePage.isletmem.trendDown', { pct: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Math.abs(trend)) })}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2A2631] border border-[#3A3540] rounded-2xl p-6 flex items-center justify-between" data-purpose="income-card">
            <div>
              <h3 className="text-on-surface-variant text-sm font-medium mb-1">{t('aiMuhasebePage.isletmem.incomes')}</h3>
              <div className="text-3xl font-bold text-[#22B573]">{money(cur.income)}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#22B573]/10 flex items-center justify-center text-[#22B573]"><i className="fa-solid fa-arrow-trend-up text-xl"></i></div>
          </div>
          <div className="bg-[#2A2631] border border-[#3A3540] rounded-2xl p-6 flex items-center justify-between" data-purpose="expense-card">
            <div>
              <h3 className="text-on-surface-variant text-sm font-medium mb-1">{t('aiMuhasebePage.isletmem.expenses')}</h3>
              <div className="text-3xl font-bold text-[#EF4444]">{money(cur.expense)}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]"><i className="fa-solid fa-arrow-trend-down text-xl"></i></div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#3A3540] pt-2" data-purpose="tabs-section">
          <div className="flex items-center gap-6">
            {tabBtn('income', t('aiMuhasebePage.isletmem.incomes'))}
            {tabBtn('expense', t('aiMuhasebePage.isletmem.expenses'))}
            {tabBtn('invoices', t('aiMuhasebePage.isletmem.invoices'))}
          </div>
          <div className="flex items-center gap-3 pb-2">
            <div className="relative">
              <input value={query} onChange={e => setQuery(e.target.value)} className="bg-[#2A2631] border border-[#3A3540] rounded-lg pl-4 pr-10 py-2 text-sm text-[#F6F1EC] placeholder-[#94A3B8] focus:outline-none focus:border-[#22B573] focus:ring-1 focus:ring-[#22B573] w-64" placeholder={t('aiMuhasebePage.isletmem.searchPlaceholder')} type="text" />
              <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"></i>
            </div>
            <Link href="/ai-muhasebe/veri-girisi" className="flex items-center gap-2 px-4 py-2 bg-[#22B573]/20 border border-[#22B573]/30 text-[#22B573] rounded-lg text-sm font-medium hover:bg-[#22B573]/30 transition-colors">
              <i className="fa-solid fa-plus text-xs"></i>
              {t('aiMuhasebePage.isletmem.addNew')}
            </Link>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="bg-[#2A2631] border border-[#3A3540] rounded-2xl flex flex-col items-center justify-center py-20" data-purpose="empty-state">
            <p className="text-on-surface-variant text-sm">{loading ? t('aiMuhasebePage.isletmem.loading') : t('aiMuhasebePage.isletmem.emptyState')}</p>
          </div>
        ) : (
          <div className="bg-[#2A2631] border border-[#3A3540] rounded-2xl divide-y divide-[#3A3540]" data-purpose="records">
            {shown.map(r => {
              const b = statusBadge(r);
              return (
                <div key={r.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#F6F1EC] truncate">{r.title || '-'}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{new Date(`${r.day}T00:00:00Z`).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.cls}`}>{b.label}</span>
                    <span className={`text-sm font-bold ${r.type === 'expense' ? 'text-[#EF4444]' : 'text-[#22B573]'}`}>{money(r.amount_minor / 100)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-[#2A2631] border border-[#3A3540] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-purpose="smart-analysis">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#11241C] flex items-center justify-center text-[#22B573] shrink-0 border border-[#1A3828]"><i className="fa-solid fa-chart-line"></i></div>
            <div>
              <h3 className="text-[#22B573] font-medium text-lg mb-2">{t('aiMuhasebePage.isletmem.smartAnalysis')}</h3>
              <div className="text-on-surface-variant text-sm border-l-2 border-[#22B573] pl-3 py-0.5">
                {insightLoading ? t('aiMuhasebePage.isletmem.loading') : (insight || t('aiMuhasebePage.isletmem.analysisHint'))}
              </div>
            </div>
          </div>
          <button onClick={generateInsight} disabled={insightLoading || !selected} className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#3A3540] rounded-xl text-[#22B573] text-sm font-medium hover:bg-[#23262D] hover:border-[#22B573]/50 transition-colors disabled:opacity-50">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            {t('aiMuhasebePage.isletmem.generateAnalysis')}
          </button>
        </div>
      </div>
    </div>
  );
}
