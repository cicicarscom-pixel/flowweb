"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from "@/lib/supabase/client";

export default function MuhasebecimPage() {
  const t = useTranslations();
  const [step, setStep] = useState<'initial' | 'verified' | 'connected' | 'pending_confirmation'>('initial');
  const [accountantCode, setAccountantCode] = useState('');
  const [firm, setFirm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkConnection();
    // Müşavir isteği kabul/ret ettiğinde ya da bağlantıyı kestiğinde sayfa kendiliğinden güncellenir.
    // RLS: işletme yalnız kendi bağlantı olaylarını alır.
    const channel = supabase
      .channel('my-accountant-connection')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accountant_taxpayer_links' }, () => {
        checkConnection();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.rpc('get_my_accountant_connection');
      if (error) throw error;

      if (data?.status === 'active') {
        setFirm({ name: data.firm_name, connected_at: data.connected_at });
        setStep('connected');
      } else if (data?.status === 'pending_confirmation') {
        setFirm({ name: data.firm_name, requested_at: data.requested_at });
        setStep('pending_confirmation');
      } else {
        setFirm(null);
        setStep('initial');
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (accountantCode.trim().length > 0) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('resolve_accountant_code', { input_code: accountantCode.trim() });
        if (error) throw error;

        if (data?.status === 'SUCCESS') {
          setFirm({ name: data.firm_name });
          setStep('verified');
        } else if (data?.status === 'CODE_NOT_FOUND') {
          alert(t("aiMuhasebePage.muhasebecim.codeNotFound"));
        } else {
          alert(t("aiMuhasebePage.muhasebecim.actionError"));
        }
      } catch (err) {
        alert(t("aiMuhasebePage.muhasebecim.actionError"));
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(t("aiMuhasebePage.muhasebecim.enterValidCodeAlert"));
    }
  };

  const handleConnectFinal = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('request_accountant_connection', { p_code: accountantCode.trim() });
      if (error) throw error;

      if (data?.status === 'SUCCESS' || data?.status === 'REQUEST_PENDING') {
        setStep('pending_confirmation');
      } else if (data?.status === 'ALREADY_CONNECTED') {
        alert(t("aiMuhasebePage.muhasebecim.alreadyConnected"));
        checkConnection();
      } else if (data?.status === 'CODE_NOT_FOUND') {
        alert(t("aiMuhasebePage.muhasebecim.codeNotFound"));
      } else {
        alert(t("aiMuhasebePage.muhasebecim.actionError"));
      }
    } catch (err) {
      alert(t("aiMuhasebePage.muhasebecim.actionError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('cancel_accountant_request');
      if (error) throw error;
      checkConnection();
    } catch (err) {
      alert(t("aiMuhasebePage.muhasebecim.actionError"));
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm(t("aiMuhasebePage.muhasebecim.disconnectConfirm", { firm: firm?.name }))) {
      setIsLoading(true);
      try {
        const { error } = await supabase.rpc('disconnect_current_accountant', { p_reason: 'User request' });
        if (error) throw error;
        checkConnection();
      } catch (err) {
        alert(t("aiMuhasebePage.muhasebecim.actionError"));
        setIsLoading(false);
      }
    }
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

        {step === 'pending_confirmation' && (
            <div className="bg-[#1a1b22] border border-[#F59E0B]/30 rounded-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <i className="fa-solid fa-hourglass-empty text-4xl text-[#F59E0B] mb-4"></i>
              <h2 className="text-2xl font-bold text-on-surface mb-2">{t("aiMuhasebePage.muhasebecim.pendingTitle")}</h2>
              <p className="text-on-surface-variant text-sm mb-8">
                {t("aiMuhasebePage.muhasebecim.pendingDescription", { firm: firm?.name })}
              </p>
              <button
                onClick={handleCancelRequest}
                disabled={isLoading}
                className="bg-transparent border border-[#FCA5A5] text-[#FCA5A5] px-6 py-3 rounded-lg font-semibold hover:bg-[#FCA5A5]/10 transition-colors disabled:opacity-70"
              >
                {isLoading ? '...' : t("aiMuhasebePage.muhasebecim.cancelRequest")}
              </button>
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
