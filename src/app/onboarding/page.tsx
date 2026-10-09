'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const t = useTranslations('onboardingPage');
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    businessName: ''
  });

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (!user.email_confirmed_at) {
        router.push('/verify-email');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (profile?.onboarding_completed) {
        router.push('/');
        return;
      }

      setEmail(user.email || '');
      
      // Check if logged in via Google and has pre-filled name
      const isGoogle = user.app_metadata?.provider === 'google';
      setIsGoogleLogin(isGoogle);
      
      setForm(prev => ({
        ...prev,
        fullName: profile?.full_name || ''
      }));
      
      setLoading(false);
    }
    
    loadUser();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: rpcError } = await supabase.rpc('complete_onboarding', {
      p_full_name: form.fullName,
      p_phone: form.phone,
      p_business_name: form.businessName
    });

    if (rpcError) {
      setError(t('saveError', { message: rpcError.message }));
      setSubmitting(false);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white p-4 font-sans">
      <div className="max-w-sm w-full bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-white/10">
        <h1 className="text-xl font-bold mb-1">{t('title')}</h1>
        <p className="text-gray-400 mb-4 text-xs">
          {t('subtitle')}
        </p>

        {isGoogleLogin && form.fullName && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-2.5 rounded-xl mb-4 text-xs flex items-start gap-2">
            <i className="fa-brands fa-google mt-0.5"></i>
            <p>{t('googleNotice')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">{t('fullName')}</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={t('fullNamePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">{t('phone')}</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">{t('businessName')}</label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={e => setForm({...form, businessName: e.target.value})}
              className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={t('businessNamePlaceholder')}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors mt-4"
          >
            {submitting ? t('saving') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
