export default function Dashboard() {
  return (
    <>


          {/* Metrics Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Metric 1: Revenue */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden neon-glow-primary group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-lg">
                <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Total AI Revenue</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
                </div>
              </div>
              <div>
                <div className="font-display-lg text-[40px] leading-[48px] font-bold text-primary-fixed-dim tracking-tight">₺142,500</div>
                <div className="flex items-center gap-xs mt-xs text-tertiary-fixed-dim">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="font-data-mono text-[12px]">+12.4% vs last week</span>
                </div>
              </div>
            </div>
            {/* Metric 2: Social Reach */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden hover:shadow-[0_0_15px_rgba(235,178,255,0.3)] hover:border-secondary transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-lg">
                <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Social Media Reach</span>
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px]">campaign</span>
                </div>
              </div>
              <div>
                <div className="font-display-lg text-[40px] leading-[48px] font-bold text-secondary-fixed-dim tracking-tight">84.2K</div>
                <div className="flex items-center gap-xs mt-xs text-tertiary-fixed-dim">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="font-data-mono text-[12px]">+5.1% vs last week</span>
                </div>
              </div>
            </div>
            {/* Metric 3: Bot Activity */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden hover:shadow-[0_0_15px_rgba(78,222,163,0.3)] hover:border-tertiary transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-lg">
                <span className="font-data-mono text-[14px] font-medium text-on-surface-variant uppercase">Bot Activity (Interactions)</span>
                <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
                </div>
              </div>
              <div>
                <div className="font-display-lg text-[40px] leading-[48px] font-bold text-tertiary-fixed-dim tracking-tight">1,204</div>
                <div className="flex items-center gap-xs mt-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">trending_flat</span>
                  <span className="font-data-mono text-[12px]">Steady volume</span>
                </div>
              </div>
            </div>
          </section>
          {/* Lower Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
            {/* Quick Actions (Spans 1 col) */}
            <section className="glass-panel rounded-xl p-md flex flex-col gap-md">
              <div className="border-b border-white/5 pb-sm">
                <h2 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-on-surface">Quick Actions</h2>
              </div>
              <div className="flex flex-col gap-sm">
                <button className="flex items-center gap-md p-sm rounded-lg border border-white/5 hover:border-primary/50 bg-white/[0.02] hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded bg-surface border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-body-md text-on-surface font-semibold">Upload Receipt</span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant uppercase">Auto-categorize via AI</span>
                  </div>
                  <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
                </button>
                <button className="flex items-center gap-md p-sm rounded-lg border border-white/5 hover:border-tertiary/50 bg-white/[0.02] hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded bg-surface border border-white/10 flex items-center justify-center group-hover:border-tertiary/50 transition-colors">
                    <span className="material-symbols-outlined text-tertiary">memory</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-body-md text-on-surface font-semibold">Check Bot Status</span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant uppercase">Review active instances</span>
                  </div>
                  <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-tertiary transition-colors">chevron_right</span>
                </button>
                <button className="flex items-center gap-md p-sm rounded-lg border border-white/5 hover:border-secondary/50 bg-white/[0.02] hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded bg-surface border border-white/10 flex items-center justify-center group-hover:border-secondary/50 transition-colors">
                    <span className="material-symbols-outlined text-secondary">sync</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-body-md text-on-surface font-semibold">Sync Social Accounts</span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant uppercase">Update data streams</span>
                  </div>
                  <span className="material-symbols-outlined ml-auto text-on-surface-variant group-hover:text-secondary transition-colors">chevron_right</span>
                </button>
              </div>
            </section>
            {/* Recent Activity Feed (Spans 2 cols) */}
            <section className="glass-panel rounded-xl p-md lg:col-span-2 flex flex-col">
              <div className="border-b border-white/5 pb-sm flex justify-between items-center mb-md">
                <h2 className="font-headline-lg text-[24px] md:text-[32px] font-semibold text-on-surface">Live Data Stream</h2>
                <span className="font-data-mono text-[12px] text-primary flex items-center gap-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  REAL-TIME
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-sm space-y-sm">
                <div className="flex gap-md p-sm hover:bg-white/[0.02] rounded-lg transition-colors border-l-2 border-primary/50">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-[16px] text-on-surface">Invoice #INV-2401 processed automatically.</p>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">JUST NOW</span>
                    </div>
                    <p className="font-data-mono text-[12px] text-on-surface-variant mt-1">Categorized under "Software Subscriptions" (Confidence: 98%)</p>
                  </div>
                </div>
                <div className="flex gap-md p-sm hover:bg-white/[0.02] rounded-lg transition-colors border-l-2 border-tertiary/50">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">forum</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-[16px] text-on-surface">Customer Inquiry handled by Support Bot.</p>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">2M AGO</span>
                    </div>
                    <p className="font-data-mono text-[12px] text-on-surface-variant mt-1">Resolved pricing question via Instagram DM. Sentiment: Positive.</p>
                  </div>
                </div>
                <div className="flex gap-md p-sm hover:bg-white/[0.02] rounded-lg transition-colors border-l-2 border-secondary/50">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-secondary text-[20px]">thumb_up</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-[16px] text-on-surface">New Campaign reached 10k impressions.</p>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">15M AGO</span>
                    </div>
                    <p className="font-data-mono text-[12px] text-on-surface-variant mt-1">Automated ad spend adjusted for optimal ROI on Twitter.</p>
                  </div>
                </div>
                <div className="flex gap-md p-sm hover:bg-white/[0.02] rounded-lg transition-colors border-l-2 border-error/50">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-body-md text-[16px] text-on-surface">Failed to sync bank feed (Ziraat Bankası).</p>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">1H AGO</span>
                    </div>
                    <p className="font-data-mono text-[12px] text-error mt-1">API timeout. Retrying automatically in 15 mins...</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
    </>
  );
}

