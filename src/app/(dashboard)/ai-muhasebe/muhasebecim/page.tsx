"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/client";

export default function MuhasebecimPage() {
  const [step, setStep] = useState<'initial' | 'verified' | 'connected'>('initial');
  const [accountantCode, setAccountantCode] = useState('');
  const [firm, setFirm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: orgMember } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (orgMember?.organization_id) {
        const { data: link } = await supabase
          .from('accountant_taxpayer_links')
          .select('accounting_firm_id')
          .eq('taxpayer_organization_id', orgMember.organization_id)
          .eq('status', 'active')
          .maybeSingle();

        if (link?.accounting_firm_id) {
          const { data: firmInfo } = await supabase
            .from('accounting_firms')
            .select('firm_name')
            .eq('id', link.accounting_firm_id)
            .maybeSingle();

          if (firmInfo) {
            setFirm({
              name: firmInfo.firm_name,
              location: '-',
              rating: 5.0,
              activeTaxpayers: 'Çok sayıda'
            });
            setStep('connected');
          }
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    if (accountantCode.trim().length > 0) {
      setIsLoading(true);
      // Simulate API verification
      setTimeout(() => {
        setFirm({
          name: 'Akbulut Mali Müşavirlik',
          location: 'İstanbul / Başakşehir',
          rating: 4.9,
          activeTaxpayers: 120
        });
        setIsLoading(false);
        setStep('verified');
      }, 800);
    } else {
      alert('Lütfen geçerli bir muhasebeci kodu girin.');
    }
  };

  const handleConnectFinal = () => {
    setIsLoading(true);
    // Simulate final connection
    setTimeout(() => {
      setIsLoading(false);
      setStep('connected');
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/ai-muhasebe" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
          <i className="fa-solid fa-arrow-left text-on-surface-variant"></i>
        </Link>
        <div className="w-12 h-12 rounded-xl bg-[#00daf3]/10 flex items-center justify-center">
          <i className="fa-solid fa-key text-[#00daf3] text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Muhasebecim</h1>
          <p className="text-sm text-on-surface-variant mt-1">Muhasebecinizle bağlantı kurun</p>
        </div>
      </div>

      <div className="bg-surface-container border border-white/5 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg shadow-black/20">
        
        {/* Unconnected State */}
        {step !== 'connected' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-on-surface mb-2">Müşavirinize Bağlanın</h2>
              <p className="text-on-surface-variant text-sm">
                Verilerinizi güvenli bir şekilde paylaşarak finansal süreçlerinizi hızlandırın.
              </p>
            </div>

            <div className="bg-[#1a1b22] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-key text-[#00daf3]"></i>
                <h3 className="text-lg font-medium text-on-surface">Muhasebeci Kodunu Gir</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                Muhasebecinizin size verdiği davet kodunu girerek hesabınızı bağlayın.
              </p>
              
              <div className="flex gap-4">
                <input 
                  type="text"
                  placeholder="Örn: ABC-12345"
                  className={`flex-1 bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface outline-none focus:border-[#00daf3] uppercase transition-colors ${step === 'verified' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={accountantCode}
                  onChange={(e) => setAccountantCode(e.target.value.toUpperCase())}
                  disabled={step !== 'initial'}
                />
                {step === 'initial' && (
                  <button 
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="bg-[#00daf3] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00daf3]/90 transition-colors disabled:opacity-70 whitespace-nowrap"
                  >
                    {isLoading ? 'Bekleyin...' : 'Doğrula'}
                  </button>
                )}
              </div>
            </div>

            {/* Share Code Card */}
            <div className="bg-[#1a1b22] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-share-nodes text-[#00daf3]"></i>
                <h3 className="text-lg font-medium text-on-surface">Kendi Kodunu Paylaş</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                Muhasebeciniz sizi platforma davet etmek isterse aşağıdaki kodu onunla paylaşın. Muhasebecim beni eklesin.
              </p>
              
              <div className="flex justify-between items-center bg-[#0e0e11] border border-white/5 rounded-lg px-5 py-4">
                <span className="text-xl font-bold tracking-widest text-[#00daf3]">WG-73492</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('WG-73492');
                    alert('Kopyalandı: Kimlik kodunuz panoya kopyalandı.');
                  }}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  <i className="fa-regular fa-copy text-xl"></i>
                </button>
              </div>
            </div>

            {step === 'verified' && firm && (
              <div className="bg-[#1a1b22] border border-[#4edea3]/30 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-[#4edea3] mb-6">
                  <i className="fa-solid fa-circle-check"></i>
                  <span className="font-medium">Kod doğrulandı</span>
                </div>
                
                <h3 className="text-xl font-bold text-on-surface mb-1">{firm.name}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{firm.location}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-[#ffb95f]/10 text-[#ffb95f] px-3 py-1 rounded-full text-sm">
                    <i className="fa-solid fa-star"></i>
                    <span>{firm.rating}</span>
                  </div>
                  <span className="text-on-surface-variant text-sm">{firm.activeTaxpayers} aktif mükellef</span>
                </div>
                
                <div className="border-t border-white/10 pt-6 mb-6">
                  <h4 className="text-sm font-medium text-on-surface mb-4">Bu muhasebeciye bağlanırsanız;</h4>
                  <ul className="space-y-3">
                    {['Faturalar paylaşılır', 'Gelir gider aktarılır', 'Evrak talepleri alınır', 'AI Muhasebe birlikte çalışır'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <i className="fa-solid fa-check text-[#4edea3]"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={handleConnectFinal}
                  disabled={isLoading}
                  className="w-full bg-[#4edea3] text-black py-4 rounded-xl font-bold hover:bg-[#4edea3]/90 transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Bağlanıyor...' : 'Bağlan'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Connected State */}
        {step === 'connected' && (
          <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-[#4edea3]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-check text-5xl text-[#4edea3]"></i>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Başarıyla Bağlandı!</h2>
            <p className="text-on-surface-variant mb-8 max-w-sm mx-auto">
              Artık {firm?.name} ile verileriniz güvenli bir şekilde senkronize edilecektir.
            </p>
            <Link 
              href="/ai-muhasebe"
              className="inline-block bg-white/10 text-on-surface hover:bg-white/20 transition-colors px-8 py-3 rounded-xl font-medium"
            >
              Muhasebe Paneline Dön
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
