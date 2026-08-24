"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function OdemeTakvimiPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTransactions = async () => {
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

  const formatCurrency = (amount: number) => Number(amount).toLocaleString('tr-TR');

  // Filter and split
  const incomes = transactions.filter(t => t.type === 'income' || t.type === 'sales');
  const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'ALIS');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#17151A] p-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <Link href="/ai-muhasebe" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#A79E96] hover:text-[#F6F1EC] transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-wide">Ödeme Takvimi</h1>
          <p className="text-sm text-on-surface-variant">Gelir ve gider işlemleriniz</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Income Column */}
        <div className="flex-1 flex flex-col bg-surface-container/30 border border-[#22B573]/20 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#22B573]/20 bg-[#22B573]/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#22B573]/20 flex items-center justify-center">
                <i className="fa-solid fa-arrow-trend-up text-[#22B573]"></i>
              </div>
              <h2 className="text-[#22B573] font-bold text-lg tracking-wide uppercase">Gelirler</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-[96px] bg-white/5 rounded-xl"></div>)}
              </div>
            ) : incomes.length > 0 ? (
              incomes.map(item => (
                <div key={item.id} className="h-[96px] flex rounded-xl border border-[#22B573]/10 bg-surface-container/50 hover:bg-[#22B573]/5 transition-colors overflow-hidden">
                  <div className="w-24 border-r border-[#22B573]/10 flex flex-col items-center justify-center shrink-0 bg-[#22B573]/5">
                    <span className="text-[#22B573] font-bold text-2xl">
                      {new Date(item.date || item.created_at).getDate().toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#22B573]/70 text-xs font-semibold uppercase">
                      {new Date(item.date || item.created_at).toLocaleString('tr-TR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <h3 className="text-on-surface font-semibold truncate mb-1">{item.title || item.name || 'Gelir İşlemi'}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[#22B573] font-bold text-lg">+₺{formatCurrency(item.amount)}</span>
                      <span className="text-xs px-2 py-1 rounded bg-[#22B573]/10 text-[#22B573] border border-[#22B573]/20">
                        {item.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50">
                <i className="fa-solid fa-money-bill-wave text-4xl mb-3"></i>
                <p>Gelir kaydı bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Column */}
        <div className="flex-1 flex flex-col bg-surface-container/30 border border-[#EF4444]/20 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#EF4444]/20 bg-[#EF4444]/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                <i className="fa-solid fa-arrow-trend-down text-[#EF4444]"></i>
              </div>
              <h2 className="text-[#EF4444] font-bold text-lg tracking-wide uppercase">Giderler</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-[96px] bg-white/5 rounded-xl"></div>)}
              </div>
            ) : expenses.length > 0 ? (
              expenses.map(item => (
                <div key={item.id} className="h-[96px] flex rounded-xl border border-[#EF4444]/10 bg-surface-container/50 hover:bg-[#EF4444]/5 transition-colors overflow-hidden">
                  <div className="w-24 border-r border-[#EF4444]/10 flex flex-col items-center justify-center shrink-0 bg-[#EF4444]/5">
                    <span className="text-[#EF4444] font-bold text-2xl">
                      {new Date(item.date || item.created_at).getDate().toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#EF4444]/70 text-xs font-semibold uppercase">
                      {new Date(item.date || item.created_at).toLocaleString('tr-TR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <h3 className="text-on-surface font-semibold truncate mb-1">{item.title || item.name || 'Gider İşlemi'}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[#EF4444] font-bold text-lg">-₺{formatCurrency(item.amount)}</span>
                      <span className="text-xs px-2 py-1 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                        {item.status === 'completed' ? 'Ödendi' : 'Ödenecek'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50">
                <i className="fa-solid fa-file-invoice text-4xl mb-3"></i>
                <p>Gider kaydı bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
