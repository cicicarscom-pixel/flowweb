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
            .select(`
              name,
              accounting_firm_members (
                profiles (
                  authorized_person,
                  avatar_url,
                  phone,
                  email
                )
              )
            `)
            .eq('id', link.accounting_firm_id)
            .maybeSingle();

          if (firmInfo) {
            let accountantProfile = null;
            if (firmInfo.accounting_firm_members && firmInfo.accounting_firm_members.length > 0) {
              // Extract the first member's profile
              const member = Array.isArray(firmInfo.accounting_firm_members) ? firmInfo.accounting_firm_members[0] : firmInfo.accounting_firm_members;
              if (member && member.profiles) {
                 accountantProfile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
              }
            }

            setFirm({
              name: firmInfo.name || 'Müşaviriniz',
              authorized_person: accountantProfile?.authorized_person || 'Müşavir Temsilcisi',
              avatar_url: accountantProfile?.avatar_url || null,
              phone: accountantProfile?.phone || '-',
              email: accountantProfile?.email || '-'
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
          name: 'Örnek Mali Müşavirlik',
          authorized_person: 'Örnek Müşavir',
          avatar_url: null,
          phone: '-',
          email: '-'
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
                
                <div className="border-t border-white/10 pt-6 mb-6 mt-4">
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
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
            
            <div className="w-full bg-gradient-to-b from-[#1a1b22] to-[#0e0e11] border border-[#4edea3]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(78,222,163,0.1)] relative overflow-hidden text-center mt-4">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4edea3] to-transparent opacity-50"></div>
              
              <div className="inline-flex items-center gap-2 bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></div>
                Bağlı
              </div>

              {firm?.avatar_url ? (
                <img src={firm.avatar_url} alt="Muhasebeci Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-[#4edea3]/50 shadow-[0_0_15px_rgba(78,222,163,0.2)]" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-white/10 flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-user-tie text-3xl text-on-surface-variant"></i>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-1">{firm?.name}</h2>
              <p className="text-[#4edea3] font-medium mb-6">{firm?.authorized_person}</p>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6 mt-2">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Telefon Numarası</p>
                  <p className="text-sm text-white font-medium">{firm?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">E-posta Adresi</p>
                  <p className="text-sm text-white font-medium">{firm?.email || '-'}</p>
                </div>
              </div>

            </div>

            <p className="text-sm text-on-surface-variant mt-8 text-center max-w-md mx-auto">
              Hesabınız başarıyla bağlandı. Tüm evrak, fatura ve finansal verileriniz güvenli bir şekilde müşavirinizle senkronize edilmektedir.
            </p>

            <Link 
              href="/ai-muhasebe"
              className="mt-6 inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-colors px-6 py-3 rounded-xl font-medium"
            >
              <i className="fa-solid fa-arrow-left"></i> Muhasebe Paneline Dön
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}
