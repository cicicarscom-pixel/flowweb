"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { createClient } from "@/lib/supabase/client";

export default function AiMuhasebePage() {
  const [stats, setStats] = useState({ income: 0, expense: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

        let totalIncome = 0;
        let totalExpense = 0;

        // Fetch transactions for this month
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .gte('date', startOfMonth);

        if (transactions) {
          transactions.forEach(t => {
            if (t.type === 'income') totalIncome += Number(t.amount);
            if (t.type === 'expense') totalExpense += Number(t.amount);
          });
        }

        // Fetch finance_documents for this month
        if (userId) {
          const { data: orgMember } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', userId)
            .maybeSingle();

          if (orgMember?.organization_id) {
            const { data: docs } = await supabase
              .from('finance_documents')
              .select('*')
              .eq('organization_id', orgMember.organization_id)
              .gte('created_at', startOfMonth);

            if (docs) {
              docs.forEach(d => {
                const amt = Number(d.amount_minor) / 100;
                if (d.type === 'income' || d.type === 'sales') {
                  if (d.flow_payment_status === 'paid') totalIncome += amt;
                } else if (d.type === 'expense') {
                  if (d.flow_payment_status === 'paid') totalExpense += amt;
                }
              });
            }
          }
        }

        setStats({ income: totalIncome, expense: totalExpense });
      } catch (e) {
        console.warn('Muhasebe page fetch error', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return Number(amount).toLocaleString('tr-TR');
  };

  return (
    <div className="w-full space-y-6 p-6 pb-24">
      {/* Page Title */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <i className="fa-solid fa-wallet text-2xl text-primary"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">AI Muhasebe</h1>
          <p className="text-sm text-on-surface-variant mt-1">Finansal durumunuzu tek ekranda yönetin.</p>
        </div>
      </div>

      {/* Hero Financial Summary Card */}
      <div className={`rounded-2xl border border-primary/30 ${styles.heroBg} p-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]`}>
        <h2 className="text-3xl font-bold text-primary relative z-10 mb-2">Finansal Özet</h2>
        <p className="text-on-surface-variant relative z-10">Bu Ayki Performans</p>
      </div>

      {/* Income & Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="rounded-xl border border-primary/40 bg-surface-container p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-arrow-trend-up text-primary text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant tracking-wide mb-1 uppercase">BU AY GELİR</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-on-surface">{formatCurrency(stats.income)} <span className="text-xl font-normal">₺</span></p>
            )}
          </div>
        </div>
        {/* Expense Card */}
        <div className="rounded-xl border border-[#B534B2]/40 bg-surface-container p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#B534B2]/10 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-arrow-trend-down text-[#B534B2] text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant tracking-wide mb-1 uppercase">BU AY GİDER</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-on-surface">{formatCurrency(stats.expense)} <span className="text-xl font-normal">₺</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/ai-muhasebe/veri-girisi?type=gelir" className="w-full py-4 rounded-xl border border-[#1F2937] bg-surface-container/50 hover:bg-surface-container flex items-center justify-center gap-3 transition-colors group">
          <i className="fa-solid fa-circle-plus text-primary text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-primary font-semibold tracking-wide">GELİR GİR</span>
        </Link>
        <Link href="/ai-muhasebe/veri-girisi?type=gider" className="w-full py-4 rounded-xl border border-[#1F2937] bg-surface-container/50 hover:bg-surface-container flex items-center justify-center gap-3 transition-colors group">
          <i className="fa-solid fa-circle-minus text-[#B534B2] text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-[#B534B2] font-semibold tracking-wide">GİDER GİR</span>
        </Link>
      </div>

      {/* List Items */}
      <div className="space-y-4 mt-8">
        <Link href="/ai-muhasebe/isletmem" className="block rounded-xl border border-primary/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-clock-rotate-left text-primary text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-primary tracking-wide mb-1 uppercase">İŞLETMEM (GEÇMİŞ DÖNEMLER)</h3>
              <p className="text-xs text-on-surface-variant">Geçmiş dönemlerin gelir, gider ve finansal raporlarına erişin.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:text-primary transition-colors"></i>
        </Link>

        <Link href="/ai-muhasebe/odeme-takvimi" className="block rounded-xl border border-[#ecb2ff]/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-calendar-days text-[#ecb2ff] text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-[#ecb2ff] tracking-wide mb-1 uppercase">ÖDEME TAKVİMİ</h3>
              <p className="text-xs text-on-surface-variant">Yaklaşan ödeme ve tahsilat planlarınızı görüntüleyin.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:text-[#ecb2ff] transition-colors"></i>
        </Link>

        <Link href="/ai-muhasebe/veri-girisi?type=asistan" className="block rounded-xl border border-[#ecb2ff]/30 bg-surface-container p-5 hover:bg-surface-container-high transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-wand-magic-sparkles text-[#ecb2ff] text-xl w-6 text-center"></i>
            <div>
              <h3 className="text-sm font-semibold text-[#ecb2ff] tracking-wide mb-1 uppercase">AI ASİSTAN</h3>
              <p className="text-xs text-on-surface-variant">Yapay zeka asistanınızla finansal konularda destek alın.</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-on-surface-variant group-hover:text-[#ecb2ff] transition-colors"></i>
        </Link>
      </div>
    </div>
  );
}
