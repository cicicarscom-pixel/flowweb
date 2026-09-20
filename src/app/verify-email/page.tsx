'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get current user's email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? null);
        if (user.email_confirmed_at) {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    });

    // Listen for auth state changes (when they click the link in their email)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setMessage('');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setMessage('Bağlantı gönderilirken bir hata oluştu: ' + error.message);
    } else {
      setMessage('Doğrulama bağlantısı tekrar gönderildi.');
    }
    
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white p-4 font-sans">
      <div className="max-w-md w-full bg-[#1E293B] rounded-2xl shadow-xl p-8 border border-white/10 text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-regular fa-envelope text-3xl"></i>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">E-postanızı Doğrulayın</h1>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {email ? <span className="font-semibold text-white block mb-2">{email}</span> : null}
          E-posta adresinize bir doğrulama linki gönderdik. Devam etmek için lütfen e-postanızı onaylayın.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {resending ? 'Gönderiliyor...' : 'Tekrar Gönder'}
          </button>
          
          {message && (
            <p className="text-sm text-blue-400 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
