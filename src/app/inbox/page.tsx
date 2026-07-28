import Link from "next/link";
import Image from "next/image";

export default function InboxPage() {
  return (
    <div className="antialiased min-h-screen flex text-[var(--color-on-surface)]">
      {/* Main Content Area (Offset for fixed sidebar handled in layout, assuming sidebar is global. If not, this is the main wrapper) */}
      <main className="ml-0 md:ml-[280px] flex-1 flex h-screen">
        
        {/* Inbox List Column */}
        <section className="w-full md:w-[380px] border-r border-white/5 bg-[var(--color-surface)]/40 flex flex-col h-full shrink-0">
          {/* Header */}
          <div className="p-md border-b border-white/5 backdrop-blur-xl sticky top-0 z-10 bg-[var(--color-surface)]/60">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display-lg text-headline-lg-mobile text-[var(--color-on-surface)]">Inbox</h2>
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[var(--color-on-surface-variant)]">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
                <button className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-[var(--color-on-surface-variant)]">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 font-data-mono text-[10px] uppercase">
              <button className="px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30">All</button>
              <button className="px-3 py-1 rounded-full bg-white/5 text-[var(--color-on-surface-variant)] border border-white/10 hover:bg-white/10">Unread</button>
              <button className="px-3 py-1 rounded-full bg-white/5 text-[var(--color-on-surface-variant)] border border-white/10 hover:bg-white/10">AI Action</button>
            </div>
          </div>
          
          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Chat Item (Active/Unread) */}
            <div className="glass-panel p-3 rounded-lg cursor-pointer flex gap-3 neon-glow relative">
              <div className="absolute w-1 h-8 bg-[var(--color-primary)] left-0 top-1/2 -translate-y-1/2 rounded-r-sm shadow-[0_0_10px_rgba(0,162,255,0.8)]"></div>
              <div className="relative shrink-0">
                <img 
                  className="w-12 h-12 rounded-full object-cover border border-white/10" 
                  alt="A futuristic cyberpunk portrait avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-OuSV4ooBMbaje5UaELIyA7U9qCggTpH5TTf8tmvMNSNANFr7W87TOjXEvRkXtuUY4pfqAALbDeYyhiywp_wN0oUY0BtZICwMsM8PHxzBxnLPo717z0fQ8sKxTmN_2HTPV6oqHspQAK4FF3_6TNg9RirMgEnrOkUxNoX_TQu4H5VJYAFSFgwOY3Jh47sY68cdzSPLYNlfSUOGOidZ4M5xYuv4jq3Eq86Zk6E_zlnezPaDMnbi30NYfoaQXkbb8TeIilGGDezjQGg"
                />
                <div className="absolute -bottom-1 -right-1 bg-[var(--color-surface)] rounded-full p-[2px]">
                  <div className="bg-[#E1306C] w-4 h-4 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-white">photo_camera</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-headline-lg text-[14px] text-[var(--color-on-surface)] truncate font-semibold">Sarah Jenkins</span>
                  <span className="font-data-mono text-[10px] text-[var(--color-primary)]">Just now</span>
                </div>
                <p className="font-body-md text-[13px] text-[var(--color-on-surface-variant)] truncate">I'm interested in the premium AI tier. How does the pricing scale?</p>
              </div>
            </div>
            
            {/* Chat Item (Read) */}
            <div className="p-3 rounded-lg cursor-pointer flex gap-3 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
              <div className="relative shrink-0">
                <img 
                  className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale opacity-80" 
                  alt="A sleek, minimalist avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-7Cp4depXTrPUyy4Ebx9RdYbqSVcndsHgi-FqnP2lX5Ef28Zgx8E52yGyiH3G5vYAXIfsrfhrxthDrBpiIQWk8OG8Z-NCu01whzhEb6zo0ZCI7SMdKEKI9bWJn12xbb3Qab7Au6AhJ4BdcaktqjRLe2Lh_ZR-H7PNPObK4iMS2TX9gFSD7s2atrrHrKmKnF4ZN2ZuqgX_NBnAcea0bYNV7WHRgDJIUlPu_N1jg3GRo040zQuput8KaAgMN4mFT_dt0TynwPczzpk"
                />
                <div className="absolute -bottom-1 -right-1 bg-[var(--color-surface)] rounded-full p-[2px]">
                  <div className="bg-[#1DA1F2] w-4 h-4 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-white">flutter_dash</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-headline-lg text-[14px] text-[var(--color-on-surface)]/80 truncate font-semibold">Marcus_Tech</span>
                  <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)]/50">2h ago</span>
                </div>
                <p className="font-body-md text-[13px] text-[var(--color-on-surface-variant)]/70 truncate">Thanks, the automated report looks solid.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col h-full bg-[rgba(10,10,11,0.8)] relative">
          {/* Chat Header */}
          <header className="h-20 border-b border-white/5 glass-panel flex items-center justify-between px-md shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <img 
                className="w-10 h-10 rounded-full object-cover border border-[var(--color-primary)]/50 shadow-[0_0_10px_rgba(0,162,255,0.2)]" 
                alt="A futuristic cyberpunk portrait avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5ukAkdzmH8WesDdCPe_S77fnJeR9vO5OD5yRlGqx3yrH4ClzAcXLxXepP9rS2IA-nFw9dFG7aPh0jm5DmGnh0UzoqXvrt2E6VAWw6xKHqPIcVYyBfKI014088dGaHtXgzeBA86rJo_v3DM-HOrguaNnr3dnP_ZjB8bVQYb1l43edX8UfEwONZfgJ2UdVB0UfzS3zvRmie047brfpTWNVwgcGrX1mbtQVcQxrgwhZxK9s-1GY-FO17rRpDFvw846el6f0EI_9-aCE"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-lg text-body-md text-[var(--color-on-surface)] font-semibold">Sarah Jenkins</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-data-mono bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/20 uppercase tracking-wider">Instagram</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] shadow-[0_0_5px_rgba(78,222,163,0.8)]"></div>
                  <span className="font-data-mono text-[11px] text-[var(--color-on-surface-variant)]">Active Now</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-9 px-4 rounded border border-white/10 hover:bg-white/5 font-label-sm text-label-sm text-[var(--color-on-surface)] flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[16px]">person</span>
                Profile
              </button>
              <button className="h-9 w-9 rounded border border-white/10 hover:bg-white/5 text-[var(--color-on-surface)] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </header>
          
          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-md space-y-6">
            {/* Timestamp */}
            <div className="flex justify-center">
              <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)]/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">TODAY, 14:32</span>
            </div>
            
            {/* User Message (Left) */}
            <div className="flex gap-3 max-w-[80%]">
              <img 
                className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0 mt-auto" 
                alt="Avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Yx4-zeBVZLdv5taDJbdtO51esE_u4YhoLtjBNrKDsPT15tKfTynLc33P_aLqgQLneu9E8ZOhJ0kPmfdP4V3SNDPu-WaPf2V2b4beYdz4MtEn8xFfk2GDTkr7MN8OBGIichH1pL69yxudkUzwH-zh0kNqQNQjMq_JFNnyxzCbmXa5nYJYii58HQEpMEWhKeu7pA8MA_boV1jGAsX4B7i8EpbldI2B-gFa-t7NNX6dye8eT9elncnZWrOF2hpR7LyBMZw1xz-Qbw4"
              />
              <div className="flex flex-col items-start gap-1">
                <div className="glass-panel p-4 rounded-2xl rounded-bl-sm text-[var(--color-on-surface)] font-body-md text-[14px] leading-relaxed">
                  Hi! I'm interested in the premium AI tier. How does the pricing scale for high-volume transactions?
                </div>
                <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)] ml-1">14:32</span>
              </div>
            </div>
            
            {/* AI Bot Message (Right) */}
            <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-data-mono text-[10px] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded flex items-center gap-1 shadow-[0_0_8px_rgba(235,178,255,0.2)]">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                    AI RESPONSE
                  </span>
                </div>
                <div className="glass-panel magenta-glow p-4 rounded-2xl rounded-br-sm text-[var(--color-on-surface)] font-body-md text-[14px] leading-relaxed bg-[var(--color-surface-container-highest)]/60">
                  Hello Sarah! Our Premium AI tier scales dynamically. For volumes exceeding 10k transactions/mo, we shift from a flat fee to a micro-fractional model (0.002% per tx). <br/><br/>Would you like me to run a predictive cost analysis based on your current volume?
                </div>
                <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)] mr-1">14:33</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center shrink-0 border border-[var(--color-secondary)]/50 mt-auto shadow-[0_0_10px_rgba(235,178,255,0.3)]">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-[16px]">smart_toy</span>
              </div>
            </div>
            
            {/* User Message (Left) */}
            <div className="flex gap-3 max-w-[80%]">
              <img 
                className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0 mt-auto" 
                alt="Avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKWg0HXSsU2L4KgySd5LBERHxa5-MAKetn9nKs9-EluSeuJOI_C6IRnu9GKlv4NhJSsXAx8fITH0LoxHFiTQCm2YrFupMY70p2fpRt6fkkDd_qu3nSPtAskwKoDl_Yf6Ly4XlYP8JWnPKckgY4M-itpCnZp4U7pYAQnqD7Y68QN_KbrRYGYuB15efO3-VHO6YMcy5Lcf7gIZX8Ivb2B708IZRxD-WfO4gli3sgmMm9P79GB_5bdiX-tcrPdScpVeSPSBp1XC4pI8"
              />
              <div className="flex flex-col items-start gap-1">
                <div className="glass-panel p-4 rounded-2xl rounded-bl-sm text-[var(--color-on-surface)] font-body-md text-[14px] leading-relaxed">
                  Yes, that would be great. Assuming ~25k transactions.
                </div>
                <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)] ml-1">14:35</span>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-md pt-0 shrink-0 mb-4">
            <div className="glass-panel rounded-xl p-2 flex items-end gap-2 focus-within:neon-glow transition-shadow duration-300">
              <div className="flex gap-1 pb-1 shrink-0">
                <button className="h-8 w-8 rounded flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                </button>
                <button className="h-8 w-8 rounded flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                </button>
              </div>
              <textarea 
                className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--color-on-surface)] font-body-md text-[14px] resize-none py-2 px-1 placeholder:text-[var(--color-on-surface-variant)]/50 max-h-[120px] overflow-y-auto" 
                placeholder="Type a message or use '/' for AI commands..." 
                rows={1} 
                style={{ minHeight: '40px' }}
              />
              <div className="pb-1 shrink-0">
                <button className="h-9 px-4 rounded bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(0,162,255,0.4)]">
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between px-2">
              <span className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">keyboard_return</span> to send
              </span>
              <div className="flex items-center gap-2 font-data-mono text-[10px]">
                <span className="text-[var(--color-on-surface-variant)]/60">AI Auto-Reply:</span>
                <button className="w-8 h-4 bg-[var(--color-primary)] rounded-full relative shadow-[0_0_5px_rgba(0,162,255,0.5)]">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
