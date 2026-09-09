"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function OdemeTakvimiPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const supabase = createClient();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (data) {
          setTransactions(data);
        }
      } catch (err) {
        console.warn('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) => Number(amount).toLocaleString(locale);

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  
  // Group transactions by day
  const transactionsByDay = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date || t.created_at);
      return tDate.getDate() === day && tDate.getMonth() === month && tDate.getFullYear() === year;
    });
    
    return {
      day,
      incomes: dayTransactions.filter(t => t.type === 'income' || t.type === 'sales'),
      expenses: dayTransactions.filter(t => t.type === 'expense' || t.type === 'ALIS')
    };
  });

  const monthName = currentDate.toLocaleString(locale, { month: 'long', year: 'numeric' });
  const shortMonth = currentDate.toLocaleString(locale, { month: 'short' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#17151A] p-6 pb-20 custom-scrollbar">
      
      {/* Calendar Header & Navigation */}
      <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 shadow-lg backdrop-blur-sm mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/ai-muhasebe" className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <button onClick={prevMonth} className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-wide drop-shadow-md capitalize">{monthName}</h1>
          <button onClick={nextMonth} className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
        <div className="font-label-sm text-xs text-secondary uppercase tracking-widest px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 shadow-[0_0_10px_rgba(68,226,205,0.1)]">
          {t("aiMuhasebePage.odemeTakvimi.title") || "Ödeme Takvimi"}
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-2 border-b border-secondary/30 mb-4 shrink-0">
        <div className="text-center font-label-sm text-xs text-on-surface-variant opacity-60 uppercase">{t("aiMuhasebePage.odemeTakvimi.day") || "GÜN"}</div>
        <div className="text-center font-label-sm text-xs text-secondary tracking-widest drop-shadow-[0_0_5px_rgba(68,226,205,0.5)] uppercase">{t("aiMuhasebePage.odemeTakvimi.incomes") || "GELİR"}</div>
        <div className="text-center font-label-sm text-xs text-[#EF4444] tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] uppercase">{t("aiMuhasebePage.odemeTakvimi.expenses") || "GİDER"}</div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
             {[1,2,3,4,5].map(i => <div key={i} className="h-[92px] bg-white/5 rounded-xl border border-outline-variant/20"></div>)}
          </div>
        ) : (
          transactionsByDay.map(({ day, incomes, expenses }) => {
            const hasIncome = incomes.length > 0;
            const hasExpense = expenses.length > 0;

            return (
              <div 
                key={day} 
                className={`group relative grid grid-cols-[80px_1fr_1fr] gap-4 bg-surface-container/50 hover:bg-surface-container p-4 rounded-xl border transition-all duration-300 backdrop-blur-md shadow-sm ${
                  hasIncome && hasExpense ? 'border-secondary/30 neon-border-cyan' : 
                  hasIncome ? 'border-secondary/30' : 
                  hasExpense ? 'border-[#EF4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.05)]' : 
                  'border-outline-variant/20 hover:border-secondary/40'
                }`}
              >
                <div className={`flex flex-col items-center justify-center border-r pr-4 transition-all ${hasIncome ? 'border-secondary/20' : hasExpense ? 'border-[#EF4444]/20' : 'border-outline-variant/20'}`}>
                  <span className={`font-headline-lg text-[28px] font-bold ${hasIncome ? 'text-secondary drop-shadow-[0_0_8px_rgba(68,226,205,0.6)]' : hasExpense ? 'text-[#EF4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-on-surface-variant group-hover:text-secondary group-hover:drop-shadow-[0_0_8px_rgba(68,226,205,0.6)]'}`}>
                    {day}
                  </span>
                  <span className={`font-code-sm text-[10px] uppercase tracking-wider ${hasIncome ? 'text-secondary' : hasExpense ? 'text-[#EF4444]' : 'text-on-surface-variant'}`}>
                    {shortMonth}
                  </span>
                </div>
                
                {/* Incomes Column */}
                <div className={`border-r pr-4 flex flex-col gap-2 min-h-[60px] justify-center ${hasIncome || hasExpense ? (hasIncome ? 'border-secondary/20' : 'border-[#EF4444]/20') : 'border-outline-variant/20'}`}>
                  {hasIncome ? (
                    incomes.map(item => (
                      <div key={item.id} className="bg-secondary/10 border border-secondary/30 rounded-lg p-2 flex justify-between items-center">
                        <span className="font-code-sm text-sm text-on-surface truncate pr-2">{item.title || item.name || t("aiMuhasebePage.odemeTakvimi.incomeTransaction") || "Gelir İşlemi"}</span>
                        <span className="font-headline-md text-sm text-secondary shrink-0">+₺{formatCurrency(item.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
                      <span className="material-symbols-outlined text-outline text-[18px]">add</span>
                    </div>
                  )}
                </div>

                {/* Expenses Column */}
                <div className="flex flex-col gap-2 min-h-[60px] justify-center pl-4">
                  {hasExpense ? (
                    expenses.map(item => (
                      <div key={item.id} className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-2 flex justify-between items-center">
                        <span className="font-code-sm text-sm text-on-surface truncate pr-2">{item.title || item.name || t("aiMuhasebePage.odemeTakvimi.expenseTransaction") || "Gider İşlemi"}</span>
                        <span className="font-headline-md text-sm text-[#EF4444] shrink-0">-₺{formatCurrency(item.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full rounded-md bg-surface-container-highest/30 border border-dashed border-outline-variant/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-surface-container-highest">
                      <span className="material-symbols-outlined text-outline text-[18px]">add</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
