'use client'

import { useActionState, useState } from 'react'
import { authenticate } from '@/actions/auth'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await authenticate(formData)
      if (res && !res.success) {
        return { message: res.message }
      }
      return { message: '' }
    },
    { message: '' }
  )

  return (
    <div className="min-h-screen bg-[#141319] text-white selection:bg-[#00A2FF]/30 selection:text-white font-sans flex overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00A2FF]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-[#B600F8]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Left Column (Visuals) */}
      <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-6 xl:p-12 overflow-y-auto border-r border-white/5 bg-[#0A0D14]/50 backdrop-blur-md">
        <div className="flex items-center gap-2 animate-fade-in-right">
          <img src="/logo.png" alt="Workigom Flow" className="h-12 xl:h-20 w-auto object-contain" />
        </div>

        <div className="relative z-10 my-auto py-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-4 xl:mb-8">
            <h1 className="text-[28px] xl:text-[42px] font-extrabold leading-tight mb-2 xl:mb-4 tracking-tight">
              İşletmenizin <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A2FF] to-[#B600F8]">sinir merkezi.</span>
            </h1>
            <p className="text-[#8E95B3] text-[13px] xl:text-[16px] max-w-[400px] leading-relaxed">
              Tüm operasyonlarınızı, görevlerinizi ve iş akışlarınızı tek bir noktadan yönetin.
            </p>
          </div>

          {/* Abstract floating UI representation */}
          <div className="w-full h-[150px] xl:h-[250px] relative mt-6 xl:mt-12 perspective-1000 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00A2FF]/10 to-transparent border border-white/10 rounded-2xl transform rotate-x-12 rotate-y-[-12deg] shadow-2xl overflow-hidden flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="w-24 h-4 bg-white/10 rounded-full animate-pulse"></div>
                <div className="w-12 h-4 bg-[#00A2FF]/30 rounded-full"></div>
              </div>
              <div className="flex-1 flex gap-4 items-end">
                <div className="w-1/4 h-[40%] bg-gradient-to-t from-[#00A2FF]/20 to-[#00A2FF]/60 rounded-t-md relative group"><div className="absolute inset-x-0 top-0 border-t-2 border-[#00A2FF]"></div></div>
                <div className="w-1/4 h-[70%] bg-gradient-to-t from-[#00A2FF]/20 to-[#00A2FF]/60 rounded-t-md relative"><div className="absolute inset-x-0 top-0 border-t-2 border-[#00A2FF]"></div></div>
                <div className="w-1/4 h-[50%] bg-gradient-to-t from-[#00A2FF]/20 to-[#00A2FF]/60 rounded-t-md relative"><div className="absolute inset-x-0 top-0 border-t-2 border-[#00A2FF]"></div></div>
                <div className="w-1/4 h-[90%] bg-gradient-to-t from-[#00A2FF]/20 to-[#00A2FF]/80 rounded-t-md relative shadow-[0_0_20px_rgba(0,162,255,0.4)]"><div className="absolute inset-x-0 top-0 border-t-2 border-[#00A2FF] shadow-[0_0_10px_#00A2FF]"></div></div>
              </div>
            </div>
            
            <div className="absolute -right-8 top-12 w-[180px] bg-[#0A0D14]/90 backdrop-blur-xl border border-[#00A2FF]/30 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-full bg-[#B600F8]/20 flex items-center justify-center border border-[#B600F8]/30">
                <span className="material-symbols-outlined text-[#B600F8] text-[20px]">bolt</span>
              </div>
              <div>
                <div className="text-white text-[12px] font-bold">Yeni Görev</div>
                <div className="text-[#00A2FF] text-[14px] font-black">Atandı</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[#8E95B3] text-[12px]">
          © {new Date().getFullYear()} Workigom Inc. Tüm hakları saklıdır.
        </div>
      </div>

      {/* Right Column (Login Form) */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-[420px] animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12">
            <img src="/logo.png" alt="Workigom Flow" className="h-24 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-[28px] font-extrabold text-white mb-2">
              {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Hesap Oluşturun'}
            </h2>
            <p className="text-[#8E95B3] text-[14px]">
              {mode === 'login' ? 'İş akışlarınıza ulaşmak için giriş yapın.' : 'Workigom Flow dünyasına katılın.'}
            </p>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-3 bg-white text-[#07090E] font-bold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-6 relative overflow-hidden group">
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="relative z-10">Google ile {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-in-out]"></div>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-[#8E95B3] text-[12px] font-medium uppercase tracking-wider">veya e-posta ile</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="mode" value={mode} />

            {state?.message && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-[13px] font-medium text-center">
                {state.message}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-300">E-posta Adresi</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="ornek@sirket.com" 
                className="w-full bg-[#0D1017] border border-[#232B45] text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#00A2FF] focus:ring-1 focus:ring-[#00A2FF]/50 transition-all placeholder-[#8E95B3]/50"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold text-gray-300">Şifre</label>
                {mode === 'login' && (
                  <a href="#" className="text-[12px] text-[#00A2FF] hover:text-white transition-colors font-medium">Şifremi unuttum</a>
                )}
              </div>
              <input 
                type="password" 
                name="password"
                required
                placeholder="••••••••" 
                className="w-full bg-[#0D1017] border border-[#232B45] text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#00A2FF] focus:ring-1 focus:ring-[#00A2FF]/50 transition-all placeholder-[#8E95B3]/50"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full text-center bg-gradient-to-r from-[#00A2FF] to-[#B600F8] text-white font-bold py-3.5 px-4 rounded-xl mt-2 hover:shadow-[0_0_20px_rgba(0,162,255,0.4)] transition-all hover:scale-[1.02] relative overflow-hidden group ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10">
                {isPending ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
              </span>
              {!isPending && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-[150%] group-hover:animate-[shine_1.5s_ease-in-out]"
                ></div>
              )}
            </button>
          </form>

          <p className="text-center text-[14px] text-[#8E95B3] mt-8">
            {mode === 'login' ? 'Henüz hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            {' '}
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-white font-bold hover:text-[#00A2FF] transition-colors"
            >
              {mode === 'login' ? 'Ücretsiz Hesap Oluştur' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { transform: translateX(200%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  )
}
