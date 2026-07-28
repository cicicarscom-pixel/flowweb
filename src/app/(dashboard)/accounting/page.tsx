import Link from "next/link";

export default function Accounting() {
  const monthName = new Date().toLocaleString('tr-TR', { month: 'long' });
  const inc = 142500;
  const exp = 48200;
  const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

  return (
    <>

        <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-lg max-w-5xl mx-auto w-full mt-lg">
          {/* Header Section */}
          <section className="relative glass-panel rounded-2xl p-lg overflow-hidden border border-white/10">
            {/* Abstract Wave Background */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBovIMIsOMjXtGSBgitr6aMODGgRPm4-uMm1FWuh2sAI1THgTx_EYvgvUIlJ4PegsDDozcR3wH7qDpl_BLZzDlNd3mXhlT56CKHo21RFtgAA3njhvHCD4QnUSYZX8Yn6W8Ul_bodUN_zmsbWTD49-eKUIRqVaKniDZgN5nE9mWbpG_1QfLshefxRZP-Xx5wsyVWkANsmVIrqqygZd66genjnnn1r5ebus5OiuWH6t4Qrv5uEX5TA0g9YuDzxH86llVLAPTFHWcFazE")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative z-10">
              <h1 className="font-display-lg text-primary neon-text-primary text-[48px] font-bold">
                Finansal Özet
              </h1>
              <p className="font-body-md text-on-surface-variant mt-xs">
                Bu Ayki Performans ({monthName})
              </p>
            </div>
          </section>

          {/* Data Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Income Card */}
            <div className="glass-panel rounded-xl p-md flex flex-col gap-sm relative overflow-hidden group hover:glass-panel-active transition-all duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <span className="font-label-sm text-on-surface-variant tracking-widest uppercase">
                BU AY GELİR
              </span>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-on-surface text-[48px] font-bold">
                  {formatCurrency(inc).split(",")[0]}
                </span>
                <span className="font-headline-lg text-on-surface-variant text-[32px]">
                  ,{formatCurrency(inc).split(",")[1]} ₺
                </span>
              </div>
            </div>

            {/* Expense Card */}
            <div className="glass-panel rounded-xl p-md flex flex-col gap-sm relative overflow-hidden group transition-all duration-300 border border-secondary/30 hover:border-secondary hover:shadow-[0_0_15px_rgba(235,178,255,0.2)]">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
              <span className="font-label-sm text-on-surface-variant tracking-widest uppercase">
                BU AY GİDER
              </span>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-on-surface text-[48px] font-bold">
                  {formatCurrency(exp).split(",")[0]}
                </span>
                <span className="font-headline-lg text-on-surface-variant text-[32px]">
                  ,{formatCurrency(exp).split(",")[1]} ₺
                </span>
              </div>
              {/* Settings FAB on card */}
              <button className="absolute right-4 bottom-4 w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors z-10">
                <span className="material-symbols-outlined text-on-surface-variant">
                  settings
                </span>
              </button>
            </div>
          </section>

          {/* Quick Action Bar */}
          <section className="grid grid-cols-2 gap-md">
            <button className="glass-panel rounded-lg py-sm px-md flex items-center justify-center gap-sm hover:border-tertiary-fixed hover:bg-tertiary-fixed/10 transition-all duration-300 group">
              <span className="material-symbols-outlined text-tertiary-fixed group-hover:scale-110 transition-transform">
                add_circle
              </span>
              <span className="font-label-sm text-tertiary-fixed tracking-wider uppercase text-[12px] font-bold">
                GELİR GİR
              </span>
            </button>
            <button className="glass-panel rounded-lg py-sm px-md flex items-center justify-center gap-sm hover:border-secondary-fixed hover:bg-secondary-fixed/10 transition-all duration-300 group">
              <span className="material-symbols-outlined text-secondary-fixed group-hover:scale-110 transition-transform">
                do_not_disturb_on
              </span>
              <span className="font-label-sm text-secondary-fixed tracking-wider uppercase text-[12px] font-bold">
                GİDER GİR
              </span>
            </button>
          </section>

          {/* Management Shortcuts */}
          <section className="flex flex-col gap-sm">
            <button className="w-full bg-[#003659]/60 border border-primary/30 hover:border-primary hover:bg-[#003659]/80 backdrop-blur-md rounded-lg py-md px-md flex items-center justify-center gap-sm transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="material-symbols-outlined text-tertiary-fixed">
                bug_report
              </span>
              <span className="font-label-sm text-tertiary-fixed tracking-wider uppercase text-[12px] font-bold">
                [DEV] TEST BİLDİRİMİ GÖNDER
              </span>
            </button>
            <button className="w-full glass-panel hover:bg-white/10 rounded-lg py-md px-md flex items-center justify-center gap-sm transition-all duration-300">
              <span className="material-symbols-outlined text-primary-fixed-dim">
                history
              </span>
              <span className="font-label-sm text-primary-fixed-dim tracking-wider uppercase text-[12px] font-bold">
                İŞLETMEM (GEÇMİŞ DÖNEMLER)
              </span>
            </button>
            <button className="w-full glass-panel hover:bg-white/10 rounded-lg py-md px-md flex items-center justify-center gap-sm transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary">
                calendar_month
              </span>
              <span className="font-label-sm text-tertiary tracking-wider uppercase text-[12px] font-bold">
                ÖDEME TAKVİMİ
              </span>
            </button>
            <button className="w-full glass-panel hover:bg-white/10 rounded-lg py-md px-md flex items-center justify-center gap-sm transition-all duration-300">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">
                auto_awesome
              </span>
              <span className="font-label-sm text-tertiary-fixed-dim tracking-wider uppercase text-[12px] font-bold">
                AI ASİSTAN
              </span>
            </button>
          </section>
        </div>
    </>
  );
}
