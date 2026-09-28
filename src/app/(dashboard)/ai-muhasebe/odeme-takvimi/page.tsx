"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { todayInTimezone } from "@/lib/dates";

interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  amount_minor: number;
  currency_code: string;
  day: string;
  due_date: string | null;
  date: string;
  payment_status: "paid" | "pending" | "partial";
  is_overdue: boolean;
  source: string;
  document_id: string | null;
  category: string | null;
}

export default function OdemeTakvimiScreen() {
  const t = useTranslations();
  const supabase = createClient();

  const locale = "tr-TR"; 
  const formatCurrency = (amountMinor: number) => {
    return new Intl.NumberFormat(locale, { style: "currency", currency: "TRY" }).format(amountMinor / 100);
  };

  const todayStr = todayInTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date(todayStr);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const todayRowRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    setIsLoading(true);
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const p_from = new Date(y, m, 1).toISOString().split("T")[0];
    const p_to = new Date(y, m + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase.rpc("get_payment_calendar", { p_from, p_to });
    if (!error && data) {
      setTransactions(data as Transaction[]);
    } else {
      console.error(error);
      setTransactions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  useEffect(() => {
    if (!isLoading && todayRowRef.current) {
      todayRowRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isLoading]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.rpc("set_transaction_payment_status", { p_id: id, p_status: status });
    if (!error) {
      loadData();
    }
    setActiveMenu(null);
  };

  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.day]) acc[t.day] = [];
    acc[t.day].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  let summaryInc = 0, summaryExp = 0, summaryOverdueCount = 0, summaryOverdueAmount = 0;
  transactions.forEach(t => {
    if (t.type === "income") summaryInc += t.amount_minor;
    if (t.type === "expense") summaryExp += t.amount_minor;
    if (t.is_overdue) {
      summaryOverdueCount++;
      summaryOverdueAmount += t.amount_minor;
    }
  });
  const summaryNet = summaryInc - summaryExp;

  const monthName = currentDate.toLocaleString(locale, { month: "long", year: "numeric" });

  const renderStatus = (tx: Transaction) => {
    if (tx.payment_status === "paid") return <span className="px-2 py-0.5 rounded text-[10px] bg-[#3ccf8e]/10 text-[#3ccf8e] uppercase border border-[#3ccf8e]/20">{t("aiMuhasebePage.odemeTakvimi.statusPaid") || "Ödendi"}</span>;
    if (tx.is_overdue) return <span className="px-2 py-0.5 rounded text-[10px] bg-[#ff7b7b]/10 text-[#ff7b7b] uppercase border border-[#ff7b7b]/20">{t("aiMuhasebePage.odemeTakvimi.statusOverdue") || "Gecikti"}</span>;
    if (tx.payment_status === "partial") return <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 uppercase border border-yellow-500/20">{t("aiMuhasebePage.odemeTakvimi.statusPartial") || "Kısmi"}</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 uppercase border border-yellow-500/20">{t("aiMuhasebePage.odemeTakvimi.statusPending") || "Bekliyor"}</span>;
  };

  const renderTransaction = (tx: Transaction) => (
    <div key={tx.id} className="relative h-[34px] flex items-center justify-between px-2 rounded hover:bg-white/5 border border-transparent hover:border-white/10 group/item cursor-pointer" onClick={() => setActiveMenu(activeMenu === tx.id ? null : tx.id)}>
      <div className="flex items-center gap-2 overflow-hidden">
        {renderStatus(tx)}
        <span className="text-sm truncate text-on-surface/90">{tx.title}</span>
      </div>
      <span className={`text-sm font-medium whitespace-nowrap ${tx.type === 'income' ? 'text-[#3ccf8e]' : 'text-[#ff7b7b]'}`}>
        {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount_minor)}
      </span>
      
      {activeMenu === tx.id && (
        <div className="absolute top-8 right-0 z-10 bg-[#1c1b1d] border border-outline-variant/30 rounded-lg shadow-xl p-1 min-w-[150px]">
          <button onClick={(e) => { e.stopPropagation(); setStatus(tx.id, "paid"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 text-[#3ccf8e] rounded">
            {t("aiMuhasebePage.odemeTakvimi.markPaid") || "Ödendi"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setStatus(tx.id, "pending"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 text-yellow-500 rounded">
            {t("aiMuhasebePage.odemeTakvimi.markPending") || "Bekliyor"}
          </button>
        </div>
      )}
    </div>
  );

  const renderDayRows = () => {
    const rows = [];
    let emptyStreakStart = -1;

    const pushEmptyStreak = (end: number) => {
      if (emptyStreakStart === -1) return;
      const startStr = emptyStreakStart;
      const endStr = end;
      const label = startStr === endStr ? `${startStr} ${currentDate.toLocaleString(locale, { month: 'short' })}` : `${startStr}-${endStr} ${currentDate.toLocaleString(locale, { month: 'short' })} · ${t("aiMuhasebePage.odemeTakvimi.noRecords") || "kayıt yok"}`;
      
      rows.push(
        <div key={`empty-${startStr}`} className="flex items-center justify-center py-2 text-xs text-on-surface-variant/40 bg-surface-container/20 rounded-md my-1">
          {label}
        </div>
      );
      emptyStreakStart = -1;
    };

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = dayStr === todayStr;
      const hasRecords = grouped[dayStr] && grouped[dayStr].length > 0;

      if (!hasRecords && !isToday) {
        if (emptyStreakStart === -1) emptyStreakStart = d;
        continue;
      }

      pushEmptyStreak(d - 1);

      const dayDate = new Date(y, m, d);
      const dayName = dayDate.toLocaleString(locale, { weekday: "long" });
      const incomes = grouped[dayStr]?.filter(t => t.type === "income") || [];
      const expenses = grouped[dayStr]?.filter(t => t.type === "expense") || [];
      const dayInc = incomes.reduce((sum, t) => sum + t.amount_minor, 0);
      const dayExp = expenses.reduce((sum, t) => sum + t.amount_minor, 0);
      const dayNet = dayInc - dayExp;
      
      const isExpanded = expandedDays[dayStr];
      const visibleInc = isExpanded ? incomes : incomes.slice(0, 3);
      const visibleExp = isExpanded ? expenses : expenses.slice(0, 3);

      rows.push(
        <div key={dayStr} ref={isToday ? todayRowRef : null} className={`grid grid-cols-[112px_1fr_1fr_150px] min-h-[80px] bg-surface-container/50 border rounded-xl overflow-hidden mb-2 transition-all ${isToday ? 'border-[#FF7A59]/50 shadow-[0_0_15px_rgba(255,122,89,0.1)]' : 'border-outline-variant/20'}`}>
          <div className="flex flex-col items-center justify-center border-r border-outline-variant/20 p-2">
            {isToday && <span className="text-[10px] font-bold text-[#FF7A59] mb-1">{t("aiMuhasebePage.odemeTakvimi.today") || "BUGÜN"}</span>}
            <span className={`font-mono text-2xl font-bold ${isToday ? 'text-[#FF7A59]' : 'text-on-surface'}`}>{d}</span>
            <span className="text-xs text-on-surface-variant capitalize">{dayName}</span>
          </div>

          <div className="border-r border-outline-variant/20 p-2 flex flex-col gap-1 relative group">
            {visibleInc.map(renderTransaction)}
            {incomes.length > 3 && (
              <button onClick={() => setExpandedDays(p => ({ ...p, [dayStr]: !isExpanded }))} className="text-xs text-secondary mt-1 hover:underline">
                {isExpanded ? t("aiMuhasebePage.odemeTakvimi.showLess") || "Daha az" : (t("aiMuhasebePage.odemeTakvimi.moreRecords", { count: incomes.length - 3 }) || `+${incomes.length - 3} kayıt daha`)}
              </button>
            )}
            <Link href={`/ai-muhasebe/veri-girisi?type=gelir&date=${dayStr}`} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-[#3ccf8e]/20 text-[#3ccf8e] text-xs px-2 py-1 rounded transition-opacity">
              {t("aiMuhasebePage.odemeTakvimi.addIncome") || "+ Gelir"}
            </Link>
          </div>

          <div className="border-r border-outline-variant/20 p-2 flex flex-col gap-1 relative group">
            {visibleExp.map(renderTransaction)}
            {expenses.length > 3 && (
              <button onClick={() => setExpandedDays(p => ({ ...p, [dayStr]: !isExpanded }))} className="text-xs text-secondary mt-1 hover:underline">
                {isExpanded ? t("aiMuhasebePage.odemeTakvimi.showLess") || "Daha az" : (t("aiMuhasebePage.odemeTakvimi.moreRecords", { count: expenses.length - 3 }) || `+${expenses.length - 3} kayıt daha`)}
              </button>
            )}
            <Link href={`/ai-muhasebe/veri-girisi?type=gider&date=${dayStr}`} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-[#ff7b7b]/20 text-[#ff7b7b] text-xs px-2 py-1 rounded transition-opacity">
              {t("aiMuhasebePage.odemeTakvimi.addExpense") || "+ Gider"}
            </Link>
          </div>

          <div className="flex items-center justify-center p-4">
            <span className={`font-mono text-base font-bold ${dayNet > 0 ? 'text-[#3ccf8e]' : dayNet < 0 ? 'text-[#ff7b7b]' : 'text-on-surface-variant'}`}>
              {dayNet > 0 ? "+" : dayNet < 0 ? "−" : ""}{formatCurrency(Math.abs(dayNet))}
            </span>
          </div>
        </div>
      );
    }
    pushEmptyStreak(daysInMonth);
    return rows;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#17151A] p-6 custom-scrollbar overflow-y-auto">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/ai-muhasebe" className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <button onClick={() => setCurrentDate(new Date(y, m - 1, 1))} className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="text-xl text-white font-medium capitalize">{monthName}</h1>
          <button onClick={() => setCurrentDate(new Date(y, m + 1, 1))} className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <div className="px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full uppercase tracking-wide">
          Gündem
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container/30 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant uppercase">{t("aiMuhasebePage.odemeTakvimi.summaryIncome") || "Gelir"}</span>
          <span className="text-lg text-[#3ccf8e] font-medium">{formatCurrency(summaryInc)}</span>
        </div>
        <div className="bg-surface-container/30 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant uppercase">{t("aiMuhasebePage.odemeTakvimi.summaryExpense") || "Gider"}</span>
          <span className="text-lg text-[#ff7b7b] font-medium">{formatCurrency(summaryExp)}</span>
        </div>
        <div className="bg-surface-container/30 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant uppercase">{t("aiMuhasebePage.odemeTakvimi.summaryNet") || "Net"}</span>
          <span className={`text-lg font-medium ${summaryNet >= 0 ? 'text-white' : 'text-[#ff7b7b]'}`}>{summaryNet > 0 ? '+' : ''}{formatCurrency(summaryNet)}</span>
        </div>
        <div className="bg-[#ff7b7b]/10 border border-[#ff7b7b]/30 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-[#ff7b7b] uppercase">{t("aiMuhasebePage.odemeTakvimi.summaryOverdue") || "Geciken"} ({summaryOverdueCount})</span>
          <span className="text-lg text-[#ff7b7b] font-medium">{formatCurrency(summaryOverdueAmount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-[112px_1fr_1fr_150px] gap-0 px-4 py-2 border-b border-outline-variant/30 mb-2">
        <div className="text-center text-xs text-on-surface-variant uppercase">{t("aiMuhasebePage.odemeTakvimi.day") || "GÜN"}</div>
        <div className="text-left text-xs text-on-surface-variant uppercase pl-2">{t("aiMuhasebePage.odemeTakvimi.incomes") || "GELİRLER"}</div>
        <div className="text-left text-xs text-on-surface-variant uppercase pl-2">{t("aiMuhasebePage.odemeTakvimi.expenses") || "GİDERLER"}</div>
        <div className="text-center text-xs text-on-surface-variant uppercase">{t("aiMuhasebePage.odemeTakvimi.net") || "NET"}</div>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
             {[1,2,3,4,5].map(i => <div key={i} className="h-[80px] bg-white/5 rounded-xl border border-outline-variant/20"></div>)}
          </div>
        ) : (
          renderDayRows()
        )}
      </div>
    </div>
  );
}
