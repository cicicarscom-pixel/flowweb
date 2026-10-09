'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const t = useTranslations('verifyEmailPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // If we have an email in URL (after signup redirect)
    const queryEmail = searchParams.get('email');
    if (queryEmail) {
      setEmail(queryEmail);
    }

    // Try to get current user if they happen to have a session (e.g. from guard redirect)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? null);
        if (user.email_confirmed_at) {
          router.push('/');
        }
      } else if (!queryEmail) {
        router.push('/login');
      }
    });

    // Listen for auth state changes (when they click the link in their email)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase, searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    setMessage('');
    setIsError(false);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://flow.workigom.com'}/auth/callback`
      }
    });

    if (error) {
      setIsError(true);
      const rateLimited = error.status === 429 || error.code === 'over_email_send_rate_limit';
      setMessage(rateLimited ? t('rateLimited') : t('resendError', { message: error.message }));
    } else {
      // Supabase, hesap zaten doğrulanmışsa da (hesap sızdırmamak için) başarılı döner;
      // bu yüzden mesaj iki durumu da kapsar.
      setMessage(t('resent'));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }

    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white p-4 font-sans">
      <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-xl p-8 border border-white/10 text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-regular fa-envelope text-3xl"></i>
        </div>

        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

        <p className="text-gray-300 mb-8 leading-relaxed">
          {email ? <span className="font-semibold text-white block mb-2">{email}</span> : null}
          {t('sent')}
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {resending ? t('resending') : cooldown > 0 ? t('resendIn', { seconds: cooldown }) : t('resend')}
          </button>

          {message && (
            <p className={`text-sm mt-4 ${isError ? 'text-red-400' : 'text-blue-400'}`}>{message}</p>
          )}

          <button
            onClick={() => router.push('/login')}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2"
          >
            {t('backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
