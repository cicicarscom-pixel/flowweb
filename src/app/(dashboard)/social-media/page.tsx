import Link from "next/link";
import { getSocialAccounts } from "@/actions/social";

export default async function SocialMedia() {
  const accounts = await getSocialAccounts() || [];

  return (
    <>

        <div className="flex-1 p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                <div className="flex justify-between items-start">
                  <span className="font-data-mono text-[12px] text-on-surface-variant uppercase tracking-wider">Total Reach</span>
                  <span className="material-symbols-outlined text-primary">visibility</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-[32px] font-bold text-on-surface">45.2K</span>
                  <span className="font-data-mono text-[11px] text-primary bg-primary/10 px-1.5 rounded">+12%</span>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-xl group-hover:bg-secondary-container/20 transition-all"></div>
                <div className="flex justify-between items-start">
                  <span className="font-data-mono text-[12px] text-on-surface-variant uppercase tracking-wider">Engagement Rate</span>
                  <span className="material-symbols-outlined text-secondary-container">favorite</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-[32px] font-bold text-on-surface">4.8%</span>
                  <span className="font-data-mono text-[11px] text-primary bg-primary/10 px-1.5 rounded">+0.5%</span>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary-container/10 rounded-full blur-xl group-hover:bg-tertiary-container/20 transition-all"></div>
                <div className="flex justify-between items-start">
                  <span className="font-data-mono text-[12px] text-on-surface-variant uppercase tracking-wider">AI Content Gen</span>
                  <span className="material-symbols-outlined text-tertiary-container">auto_awesome</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display-lg text-[32px] font-bold text-on-surface">12</span>
                  <span className="font-data-mono text-[11px] text-on-surface-variant">posts this week</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: AI Assistant Settings & Connections */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* AI Social Media Assistant Settings */}
                <section className="glass-panel rounded-xl p-md relative overflow-hidden border border-secondary-fixed-dim/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed-dim/5 to-transparent pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center border border-secondary-container/50 shadow-[0_0_15px_rgba(232,222,248,0.1)]">
                        <span className="material-symbols-outlined text-secondary-container text-[28px]">robot_2</span>
                      </div>
                      <div>
                        <h2 className="font-headline-lg-mobile text-[24px] font-bold text-on-surface flex items-center gap-2">
                          Sosyal Medya Asistan
                          <span className="material-symbols-outlined text-secondary-fixed-dim text-[16px]" style={{ fontVariationSettings: "\"FILL\" 1" }}>verified</span>
                        </h2>
                        <p className="font-body-md text-[14px] text-on-surface-variant">Zernio altyapsyla otomatik yant ve ynetim.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-4 border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-body-md font-semibold text-on-surface text-[15px]">Oto-Yant Sistemi</h4>
                      <p className="font-body-md text-[13px] text-on-surface-variant mt-1">Gelen yorumlara ve DM'lere yapay zeka ile otomatik yant verin.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only switch-input" type="checkbox" />
                      <div className="switch-bg w-14 h-7 bg-surface-variant rounded-full peer peer-focus:outline-none pulse-magenta transition-colors duration-300">
                        <div className="switch-handle absolute top-[2px] left-[2px] bg-white rounded-full h-6 w-6 transition-transform duration-300 shadow-md"></div>
                      </div>
                      <span className="ml-3 font-data-mono text-[12px] font-bold text-secondary-fixed-dim uppercase tracking-wider">Active</span>
                    </label>
                  </div>
                </section>
                
                {/* Account Connection Grid */}
                <section className="glass-panel rounded-xl p-md">
                  <h3 className="font-headline-lg-mobile text-[24px] font-semibold mb-md text-on-surface border-b border-white/5 pb-4">Connect Platforms</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {/* Platform Icons */}
                    <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-primary-fixed-dim hover:bg-primary-container/10 transition-all group">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary-fixed-dim">thumb_up</span>
                      <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Facebook</span>
                    </button>
                    <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-secondary-fixed-dim hover:bg-secondary-container/10 transition-all group">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-secondary-fixed-dim">photo_camera</span>
                      <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Instagram</span>
                    </button>
                    <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-primary-fixed-dim hover:bg-primary-container/10 transition-all group">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary-fixed-dim">work</span>
                      <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">LinkedIn</span>
                    </button>
                    <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-on-surface hover:bg-white/10 transition-all group">
                      <span className="font-headline-lg-mobile text-[24px] font-bold text-on-surface-variant group-hover:text-on-surface leading-none">X</span>
                      <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">Twitter</span>
                    </button>
                    <button className="aspect-square rounded-xl bg-surface-container-high border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-error hover:bg-error-container/20 transition-all group">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-error">play_arrow</span>
                      <span className="font-data-mono text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface">YouTube</span>
                    </button>
                  </div>
                </section>
              </div>
              
              {/* Right Column: Connected Accounts List */}
              <div className="lg:col-span-1">
                <section className="glass-panel rounded-xl flex flex-col h-full min-h-[400px]">
                  <div className="p-md border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-headline-lg-mobile text-[24px] font-semibold text-on-surface">Active Connections</h3>
                    <button className="text-secondary-fixed-dim hover:text-white transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">sync</span>
                      <span className="font-data-mono text-[12px] font-bold uppercase">Sync</span>
                    </button>
                  </div>
                  <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                    
                    {accounts.length === 0 ? (
                      <div className="text-center p-4 text-on-surface-variant font-body-md text-sm">
                        Bağlı platform bulunamadı.
                      </div>
                    ) : (
                      accounts.map((acc: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuCW1nBMMwV-JRSljXCI_CyW_KWO148ZzqvqxaZeLOk_1RyQEIKFM-cvRP9vcJZ4U3SBLfmOXAW4rj_KXNdu2446p-QC7SWDxjaVU863zaFNInKFjklAGebonfeFaSahMNdQ5_2aoXHxE5L-PaOwlt4-0vZcKCUGtCyJr_acai0gt9jKxVAUQ5TUMgYoSQeBked5LU705qUcWCDX1zhJNZw1m8SL0rcmkHie0iUvgq8mrTR3wMny8pHB7rbwMsCxf89ySGQ9-m5uq6E\")" }}></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary-container rounded-full flex items-center justify-center border border-surface">
                              <span className="material-symbols-outlined text-[10px] text-white">photo_camera</span>
                            </div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-data-mono text-[12px] font-bold text-on-surface truncate">{acc.username || acc.platform_user_id || 'Bilinmiyor'}</p>
                            <p className="text-[11px] text-on-surface-variant capitalize">{acc.platform}</p>
                          </div>
                          <button className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined text-[18px]">link_off</span>
                          </button>
                        </div>
                      ))
                    )}
                    
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
