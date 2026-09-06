"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from "@/lib/supabase/client";

export default function MuhasebecimPage() {
  const t = useTranslations();
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
              name: firmInfo.name || t("aiMuhasebePage.muhasebecim.defaultFirmName"),
              authorized_person: accountantProfile?.authorized_person || t("aiMuhasebePage.muhasebecim.defaultRepresentative"),
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
          name: t("aiMuhasebePage.muhasebecim.sampleFirmName"),
          authorized_person: t("aiMuhasebePage.muhasebecim.sampleAccountantName"),
          avatar_url: null,
          phone: '-',
          email: '-'
        });
        setIsLoading(false);
        setStep('verified');
      }, 800);
    } else {
      alert(t("aiMuhasebePage.muhasebecim.enterValidCodeAlert"));
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
        <div className="w-12 h-12 rounded-xl bg-[#FF7A59]/10 flex items-center justify-center">
          <i className="fa-solid fa-key text-[#FF7A59] text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t("aiMuhasebePage.muhasebecim.title")}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t("aiMuhasebePage.muhasebecim.subtitle")}</p>
        </div>
      </div>

      <div className="bg-surface-container border border-white/5 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg shadow-black/20">
        
        {/* Unconnected State */}
        {step !== 'connected' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-on-surface mb-2">{t("aiMuhasebePage.muhasebecim.connectToAdvisor")}</h2>
              <p className="text-on-surface-variant text-sm">
                {t("aiMuhasebePage.muhasebecim.connectToAdvisorDescription")}
              </p>
            </div>

            <div className="bg-[#1a1b22] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-key text-[#FF7A59]"></i>
                <h3 className="text-lg font-medium text-on-surface">{t("aiMuhasebePage.muhasebecim.enterAccountantCode")}</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                {t("aiMuhasebePage.muhasebecim.enterAccountantCodeDescription")}
              </p>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder={t("aiMuhasebePage.muhasebecim.codePlaceholder")}
                  className={`flex-1 bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface outline-none focus:border-[#FF7A59] uppercase transition-colors ${step === 'verified' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={accountantCode}
                  onChange={(e) => setAccountantCode(e.target.value.toUpperCase())}
                  disabled={step !== 'initial'}
                />
                {step === 'initial' && (
                  <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="bg-[#FF7A59] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#FF7A59]/90 transition-colors disabled:opacity-70 whitespace-nowrap"
                  >
                    {isLoading ? t("aiMuhasebePage.muhasebecim.pleaseWait") : t("aiMuhasebePage.muhasebecim.verify")}
                  </button>
                )}
              </div>
            </div>

            {/* Share Code Card */}
            <div className="bg-[#1a1b22] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-share-nodes text-[#FF7A59]"></i>
                <h3 className="text-lg font-medium text-on-surface">{t("aiMuhasebePage.muhasebecim.shareYourCode")}</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                {t("aiMuhasebePage.muhasebecim.shareYourCodeDescription")}
              </p>

              <div className="flex justify-between items-center bg-[#0e0e11] border border-white/5 rounded-lg px-5 py-4">
                <span className="text-xl font-bold tracking-widest text-[#FF7A59]">WG-73492</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('WG-73492');
                    alert(t("aiMuhasebePage.muhasebecim.copiedAlert"));
                  }}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  <i className="fa-regular fa-copy text-xl"></i>
                </button>
              </div>
            </div>

            {step === 'verified' && firm && (
              <div className="bg-[#1a1b22] border border-[#22B573]/30 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-[#22B573] mb-6">
                  <i className="fa-solid fa-circle-check"></i>
                  <span className="font-medium">{t("aiMuhasebePage.muhasebecim.codeVerified")}</span>
                </div>

                <h3 className="text-xl font-bold text-on-surface mb-1">{firm.name}</h3>

                <div className="border-t border-white/10 pt-6 mb-6 mt-4">
                  <h4 className="text-sm font-medium text-on-surface mb-4">{t("aiMuhasebePage.muhasebecim.connectFeaturesIntro")}</h4>
                  <ul className="space-y-3">
                    {[
                      t("aiMuhasebePage.muhasebecim.features.invoicesShared"),
                      t("aiMuhasebePage.muhasebecim.features.incomeExpenseTransferred"),
                      t("aiMuhasebePage.muhasebecim.features.documentRequestsReceived"),
                      t("aiMuhasebePage.muhasebecim.features.aiAccountingWorksTogether"),
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                        <i className="fa-solid fa-check text-[#22B573]"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleConnectFinal}
                  disabled={isLoading}
                  className="w-full bg-[#22B573] text-black py-4 rounded-xl font-bold hover:bg-[#22B573]/90 transition-colors disabled:opacity-70"
                >
                  {isLoading ? t("aiMuhasebePage.muhasebecim.connecting") : t("aiMuhasebePage.muhasebecim.connect")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Connected State */}
        {step === 'connected' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
            
            <div className="w-full bg-gradient-to-b from-[#1a1b22] to-[#0e0e11] border border-[#22B573]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(34,181,115,0.1)] relative overflow-hidden text-center mt-4">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22B573] to-transparent opacity-50"></div>
              
              <div className="inline-flex items-center gap-2 bg-[#22B573]/10 border border-[#22B573]/30 text-[#22B573] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-[#22B573] animate-pulse"></div>
                {t("aiMuhasebePage.muhasebecim.connected")}
              </div>

              {firm?.avatar_url ? (
                <img src={firm.avatar_url} alt={t("aiMuhasebePage.muhasebecim.accountantAvatarAlt")} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-[#22B573]/50 shadow-[0_0_15px_rgba(34,181,115,0.2)]" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface-container border-2 border-white/10 flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-user-tie text-3xl text-on-surface-variant"></i>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-1">{firm?.name}</h2>
              <p className="text-[#22B573] font-medium mb-6">{firm?.authorized_person}</p>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6 mt-2">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">{t("aiMuhasebePage.muhasebecim.phoneNumber")}</p>
                  <p className="text-sm text-white font-medium">{firm?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">{t("aiMuhasebePage.muhasebecim.emailAddress")}</p>
                  <p className="text-sm text-white font-medium">{firm?.email || '-'}</p>
                </div>
              </div>

            </div>

            <p className="text-sm text-on-surface-variant mt-8 text-center max-w-md mx-auto">
              {t("aiMuhasebePage.muhasebecim.connectedSuccessMessage")}
            </p>

            <Link
              href="/ai-muhasebe"
              className="mt-6 inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-colors px-6 py-3 rounded-xl font-medium"
            >
              <i className="fa-solid fa-arrow-left"></i> {t("aiMuhasebePage.muhasebecim.backToAccountingPanel")}
            </Link>

          </div>
        )}
      </div>
    </div>
  );
}
