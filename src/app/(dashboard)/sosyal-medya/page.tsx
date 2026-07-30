import Link from 'next/link';
import styles from './page.module.css';

export default function SosyalMedyaPage() {
  return (
    <div className="flex-1 p-8 min-h-screen bg-[#070714] text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Greeting */}
          <section data-purpose="greeting">
            <h1 className="text-3xl font-bold mb-2">Merhaba Ahmet! 👋</h1>
            <p className="text-[#94a3b8] text-sm">Yapay zeka destekli asistanınız ile bugün ne yapmak istersiniz?</p>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-purpose="quick-actions">
            <Link href="/sosyal-medya/create-post" className="flex items-center justify-center gap-2 bg-slate-900/50 border border-[#1e2038] hover:border-purple-500/50 p-4 rounded-xl transition-all">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-medium text-green-400">Gönderi Oluştur</span>
            </Link>
            <Link href="/sosyal-medya/posts" className="flex items-center justify-center gap-2 bg-slate-900/50 border border-[#1e2038] hover:border-blue-500/50 p-4 rounded-xl transition-all">
              <span className="text-lg">📂</span>
              <span className="text-sm font-medium text-emerald-400">Tüm Gönderiler</span>
            </Link>
            <Link href="/sosyal-medya/inbox" className="flex items-center justify-center gap-2 bg-slate-900/50 border border-[#1e2038] hover:border-purple-500/50 p-4 rounded-xl transition-all">
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium text-emerald-400">Gelen Kutusu</span>
            </Link>
          </section>

          {/* AI Assistant Toggle */}
          <section className="bg-slate-900/40 border border-[#1e2038] p-6 rounded-2xl flex items-center justify-between" data-purpose="ai-toggle-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.04l.547-.547c.633-.633.989-1.491.989-2.387V19c0 .11.044.214.122.289l.548.547M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <div>
                <h3 className="font-semibold">Sosyal Medya Asistanı</h3>
                <p className="text-xs text-gray-500">Yapay zeka DM ve yorumlara yanıt versin</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" type="checkbox" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </section>

          {/* Featured Banners */}
          <section className="space-y-4" data-purpose="banners">
            <div className={`${styles.gradientBorderTeal} p-6 rounded-2xl flex items-center justify-between cursor-pointer group hover:opacity-90 transition-opacity`}>
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                <span className="text-lg font-bold tracking-[0.2em] text-teal-400">SOSYAL MEDYA ANALİZ</span>
              </div>
              <svg className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            
            <div className={`${styles.gradientBorderPurple} ${styles.neonGlowPurple} p-6 rounded-2xl flex items-center justify-between cursor-pointer group hover:opacity-90 transition-opacity`}>
              <div className="flex items-center gap-4">
                <span className="text-xl">✨ 🌌</span>
                <span className="text-lg font-bold tracking-[0.2em] text-purple-400 uppercase">Paylaşım Merkezi</span>
              </div>
              <svg className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
          </section>

          {/* Account Connection Section */}
          <section data-purpose="connect-accounts">
            <h3 className="text-xl font-bold mb-6">Hesabınızı Ekleyin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {/* FB */}
              <div className="bg-slate-900/30 border border-[#1e2038] p-5 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                </div>
                <span className="text-xs font-medium text-gray-300">Facebook</span>
                <button className="w-full py-1.5 border border-slate-700 hover:border-blue-500 rounded-lg text-[11px] font-semibold text-emerald-400 transition-colors">Bağla</button>
              </div>
              {/* IG */}
              <div className="bg-slate-900/30 border border-[#1e2038] p-5 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 rounded-full flex items-center justify-center border border-white/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect height="20" rx="5" ry="5" strokeWidth="2" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" strokeWidth="2"></path></svg>
                </div>
                <span className="text-xs font-medium text-gray-300">Instagram</span>
                <button className="w-full py-1.5 border border-slate-700 hover:border-pink-500 rounded-lg text-[11px] font-semibold text-emerald-400 transition-colors">Bağla</button>
              </div>
              {/* LI */}
              <div className="bg-slate-900/30 border border-[#1e2038] p-5 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
                </div>
                <span className="text-xs font-medium text-gray-300">LinkedIn</span>
                <button className="w-full py-1.5 border border-slate-700 hover:border-blue-400 rounded-lg text-[11px] font-semibold text-emerald-400 transition-colors">Bağla</button>
              </div>
              {/* X */}
              <div className="bg-slate-900/30 border border-[#1e2038] p-5 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-slate-700">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>
                <span className="text-xs font-medium text-gray-300">X</span>
                <button className="w-full py-1.5 border border-slate-700 hover:border-slate-500 rounded-lg text-[11px] font-semibold text-emerald-400 transition-colors">Bağla</button>
              </div>
              {/* TT */}
              <div className="bg-slate-900/30 border border-[#1e2038] p-5 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-slate-700">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1 .05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4z"></path></svg>
                </div>
                <span className="text-xs font-medium text-gray-300">TikTok</span>
                <button className="w-full py-1.5 border border-slate-700 hover:border-slate-500 rounded-lg text-[11px] font-semibold text-emerald-400 transition-colors">Bağla</button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Content Area (Stats & Accounts) */}
        <div className="w-full md:w-80 space-y-6">
          
          {/* Managed Accounts */}
          <section className="bg-slate-900/30 border border-[#1e2038] rounded-2xl p-6" data-purpose="managed-accounts">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-semibold">Eklediğiniz Hesaplarınız</h4>
              <button className="text-[10px] text-gray-500 hover:text-white uppercase font-bold bg-slate-800/50 px-2.5 py-1 rounded transition-colors">Tümünü Yönet</button>
            </div>
            <div className="space-y-4">
              {/* Account Item 1 */}
              <div className="flex items-center justify-between bg-slate-800/20 p-3 rounded-xl border border-[#1e2038]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-orange-400 to-purple-600 p-[1px]">
                    <div className="bg-slate-900 w-full h-full rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect height="20" rx="5" ry="5" strokeWidth="1.5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" strokeWidth="1.5"></path></svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold">@workigom.com.tr</p>
                    <p className="text-[10px] text-gray-500">Instagram Business</p>
                    <p className="text-[10px] text-green-500 font-medium">Aktif</p>
                  </div>
                </div>
                <button className="text-[9px] font-bold text-red-500 px-2 py-1 bg-red-500/10 rounded transition-colors hover:bg-red-500/20">KALDIR</button>
              </div>
              
              {/* Account Item 2 */}
              <div className="flex items-center justify-between bg-slate-800/20 p-3 rounded-xl border border-[#1e2038]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-slate-700">
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold">@workigom_com</p>
                    <p className="text-[10px] text-gray-500">X (Twitter)</p>
                    <p className="text-[10px] text-green-500 font-medium">Aktif</p>
                  </div>
                </div>
                <button className="text-[9px] font-bold text-red-500 px-2 py-1 bg-red-500/10 rounded transition-colors hover:bg-red-500/20">KALDIR</button>
              </div>
            </div>
          </section>

          {/* Sync Card */}
          <section className="bg-slate-900/30 border border-[#1e2038] rounded-2xl p-6 flex flex-col items-center text-center" data-purpose="sync-card">
            <div className="w-12 h-12 rounded-full border-2 border-teal-500 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </div>
            <h4 className="font-bold mb-2">Senkronize Et</h4>
            <p className="text-[11px] text-gray-400 mb-6">Tüm hesaplarınızı senkronize ederek en güncel verilere ulaşın.</p>
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 transition-all">Senkronize Et</button>
          </section>

          {/* Usage Summary */}
          <section className="bg-slate-900/30 border border-[#1e2038] rounded-2xl p-6" data-purpose="usage-summary">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-semibold">AI Kullanım Özeti</h4>
              <div className="relative">
                <button className="text-[10px] text-gray-400 bg-slate-800/50 px-2 py-1 rounded flex items-center gap-1 border border-slate-700 hover:text-white transition-colors">
                  Bu Ay <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path></svg>
                  </div>
                  <span className="text-xs text-gray-400">Gönderi</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-emerald-400">24</span>
                  <svg className="w-16 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 100 30">
                    <path d="M0 20 Q 25 10 50 15 T 100 5" strokeLinecap="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              
              {/* Stat 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <span className="text-xs text-gray-400">Etkileşim</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-blue-400">352</span>
                  <svg className="w-16 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 100 30">
                    <path d="M0 25 Q 15 20 30 25 T 60 10 T 100 20" strokeLinecap="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              
              {/* Stat 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <span className="text-xs text-gray-400">Yanıtlanan DM</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-purple-400">128</span>
                  <svg className="w-16 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 100 30">
                    <path d="M0 10 Q 20 20 40 10 T 80 15 T 100 5" strokeLinecap="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <a className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 bg-blue-400/5 py-2.5 rounded-xl border border-blue-400/20 hover:bg-blue-400/10 transition-colors" href="#">
              Detaylı Analiz Raporu <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
