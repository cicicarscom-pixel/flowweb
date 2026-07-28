import Link from "next/link";
import Image from "next/image";

export default function PostsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-body-md antialiased overflow-x-hidden selection:bg-[var(--color-primary)]/30 selection:text-[var(--color-primary)]">
      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col">
        {/* TopNavBar (Web) */}
        <header className="hidden md:flex fixed top-0 w-[calc(100%-280px)] z-50 justify-between items-center px-margin-desktop h-16 bg-[var(--color-surface)]/40 backdrop-blur-xl border-b border-white/5 flat no shadows">
          <div className="flex items-center gap-md">
            {/* Search bar placeholder */}
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
              <input className="bg-white/5 border-b border-white/10 text-[var(--color-on-surface)] pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/10 transition-all font-data-mono text-data-mono rounded-t-DEFAULT" placeholder="Search FLOW..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-xl h-full">
            <nav className="flex h-full">
              <a className="flex flex-col justify-center px-sm h-full font-data-mono text-label-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-200" href="#">Analytics</a>
              <a className="flex flex-col justify-center px-sm h-full font-data-mono text-label-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-200" href="#">Calendar</a>
              <a className="flex flex-col justify-center px-sm h-full font-data-mono text-label-sm uppercase tracking-wider text-[var(--color-primary)] font-bold border-b-2 border-[var(--color-primary)] pb-1" href="#">Templates</a>
              <a className="flex flex-col justify-center px-sm h-full font-data-mono text-label-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors duration-200" href="#">Assets</a>
            </nav>
            <div className="flex items-center gap-md">
              <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors scale-102 hover:glow-primary"><span className="material-symbols-outlined">notifications</span></button>
              <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors scale-102 hover:glow-primary"><span className="material-symbols-outlined">settings</span></button>
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-variant)] overflow-hidden border border-white/10">
                <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXXwXhm0ofSmgwBri9Ebmtshh60aNJtX8eQW9yt4LcrTAUfP4iL8ttwEmIdiTt-N2wiXIuHWPcYMdNuI5zwCvSjCd4r75dx8BuRzHyNdh1WjNmFLfuJX4LLlBmUKFHngRFKjHAOhwi5TUABUbFyhnLvq1AUU1nvqm_04jfzr_Yvj5uzwlXwjS7cLKm8aamKe-e3Evc58EQE9inulOeav8ApKO11DsvzGA60CcdyydHPxRNJPoqroBXhyGx1ifUviGKgMTry-utaJY"/>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-24 px-margin-mobile md:px-margin-desktop pb-xl flex-1 flex flex-col gap-lg max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
            <div className="flex items-center gap-sm">
              <a className="md:hidden text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors" href="#"><span className="material-symbols-outlined text-[28px]">arrow_back</span></a>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[var(--color-on-surface)]">Tüm Gönderiler</h2>
            </div>
            <button className="btn-primary flex items-center gap-xs px-md py-sm rounded-lg font-label-sm text-label-sm font-bold uppercase tracking-wider w-full md:w-auto justify-center">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Yeni Gönderi Oluştur
            </button>
          </div>

          {/* Navigation Tabs (Tümü, Planlanan, Yayınlanan, Hatalı) */}
          <div className="flex overflow-x-auto pb-2 border-b border-white/10 gap-md hide-scrollbar">
            <button className="px-md py-sm rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)] text-[var(--color-primary)] font-data-mono text-data-mono whitespace-nowrap transition-colors">Tümü</button>
            <button className="px-md py-sm rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 font-data-mono text-data-mono whitespace-nowrap transition-colors">Planlanan</button>
            <button className="px-md py-sm rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 font-data-mono text-data-mono whitespace-nowrap transition-colors">Yayınlanan</button>
            <button className="px-md py-sm rounded-full text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-white/5 font-data-mono text-data-mono whitespace-nowrap transition-colors">Hatalı</button>
          </div>

          {/* Content Area: Filters & Grid */}
          <div className="flex flex-col gap-md">
            {/* Filters Bar */}
            <div className="glass-panel p-sm rounded-xl flex flex-col md:flex-row gap-sm justify-between items-center">
              <div className="flex items-center gap-sm w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">search</span>
                  <input className="w-full bg-white/5 border-b border-white/10 text-[var(--color-on-surface)] pl-10 pr-4 py-2 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/10 transition-all font-data-mono text-data-mono rounded-t-DEFAULT" placeholder="İçerik ara..." type="text"/>
                </div>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
              <div className="flex items-center gap-sm w-full md:w-auto justify-end text-[var(--color-on-surface-variant)] font-data-mono text-data-mono text-sm">
                <span>Platformlar:</span>
                <span className="p-1 rounded bg-white/5 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </span>
                <span className="p-1 rounded bg-white/5 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </span>
              </div>
            </div>

            {/* Bento Grid for Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {/* Post Card 1: Published */}
              <div className="glass-panel rounded-xl overflow-hidden flex flex-col group">
                <div className="h-32 bg-[var(--color-surface-container-highest)] relative border-b border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent mix-blend-overlay"></div>
                  <img 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
                    alt="A stylized 3D render of a futuristic neon city skyline at night" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgAleqsAy2cth9pGCM1ZdkAW9ZCsH2EUQuQXYf9G5EVIe9AdjPbFpMyZ_apkouPgpbrGfLgh4Q6L3m5muE_onR3YlnWAlmDQcEhAS9yu1Jyk9mEIm4Bw4nC14i4fZN4hKAwlT3zdl7Q5NFKnSRIXdyL9SHfHP8hhPLTQjQXt_SMFl43R-NzxGmwtXKdG4BSy3fOyjOQPE7vu7Jwf8SpcJhqgbKYvXBMIJDyy-8LE7oTn57Bxuxb7eD2MGScoKAVku_yOFCXDWa2R4"
                  />
                  <div className="absolute top-sm right-sm flex gap-xs">
                    <span className="px-2 py-1 rounded-md bg-[var(--color-tertiary-container)]/80 backdrop-blur-sm text-[var(--color-on-tertiary-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      Yayınlanan
                    </span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1 gap-sm">
                  <p className="font-body-md text-body-md text-[var(--color-on-surface)] line-clamp-2">Yeni YZ analiz aracımızla kampanyalarınızı %40 daha verimli yönetin. Detaylar linkte! 🚀 #AI #Marketing</p>
                  <div className="mt-auto pt-sm border-t border-white/5 flex flex-col gap-sm">
                    <div className="flex justify-between items-center font-data-mono text-label-sm text-[var(--color-on-surface-variant)]">
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> 12 Eki 2023, 14:30</div>
                      <div className="flex gap-1">
                        <svg className="w-4 h-4 fill-[var(--color-primary)]" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded border border-white/10 text-[var(--color-on-surface)] hover:bg-white/5 font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">visibility</span> İncele
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Card 2: Planned */}
              <div className="glass-panel rounded-xl overflow-hidden flex flex-col group border-t-2 border-t-[var(--color-secondary-container)]">
                <div className="h-32 bg-[var(--color-surface-container-highest)] relative border-b border-white/5 overflow-hidden flex items-center justify-center p-md">
                  <p className="font-body-md text-[var(--color-on-surface-variant)] italic text-center line-clamp-3">"Veri, yeni petroldür ancak rafine edilmezse bir işe yaramaz. - FLOW Insights Raporu"</p>
                  <div className="absolute top-sm right-sm flex gap-xs">
                    <span className="px-2 py-1 rounded-md bg-[var(--color-secondary-container)]/80 backdrop-blur-sm text-[var(--color-on-secondary-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      Planlanan
                    </span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1 gap-sm">
                  <p className="font-body-md text-body-md text-[var(--color-on-surface)] line-clamp-2">Haftalık motivasyon ve içgörü sözü. Görsel tasarımı eklenecek.</p>
                  <div className="mt-auto pt-sm border-t border-white/5 flex flex-col gap-sm">
                    <div className="flex justify-between items-center font-data-mono text-label-sm text-[var(--color-on-surface-variant)]">
                      <div className="flex items-center gap-1 text-[var(--color-secondary)]"><span className="material-symbols-outlined text-[14px]">calendar_today</span> 15 Eki 2023, 09:00</div>
                      <div className="flex gap-1">
                        <svg className="w-4 h-4 fill-[var(--color-surface-variant)]" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded border border-white/10 text-[var(--color-on-surface)] hover:bg-white/5 font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">edit</span> Düzenle
                      </button>
                      <button className="flex-1 py-2 rounded btn-secondary font-label-sm uppercase tracking-wider flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">send</span> Şimdi Yayınla
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Card 3: Failed */}
              <div className="glass-panel rounded-xl overflow-hidden flex flex-col group border-t-2 border-t-[var(--color-error)]">
                <div className="h-32 bg-[var(--color-surface-container-highest)] relative border-b border-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--color-error)]/10 mix-blend-overlay"></div>
                  <img 
                    className="w-full h-full object-cover opacity-50 grayscale" 
                    alt="A dark, abstract digital dashboard interface showing an error state" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU-l5SL-tZfuEJN7yPw3-iQGjm0Ebph1DpV5ePO8sZ5Uc59Qv0T1w-6bCMwJoxuD8Bgp-v0QK1Nejaw9sF-HeH_aMDA6Xx3iswGcBAlKsU7seMRhhn672savNQWkEKteE97YC7SGCbjFhx1hmwHrDcEY1mw9SSUMKrCO9qFI6O_zXWVDfRjOPKRn2-EGUF4BYRf4uERoCX-Vgjc4_NNdrJ16MIAFon0rXXo-7_UBsRKS6ksQ5n0lFIlG_4xSHRNgF0MSrmbAt5aAU"
                  />
                  <div className="absolute top-sm right-sm flex gap-xs">
                    <span className="px-2 py-1 rounded-md bg-[var(--color-error-container)]/90 backdrop-blur-sm text-[var(--color-on-error-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">error</span>
                      Hatalı
                    </span>
                  </div>
                </div>
                <div className="p-md flex flex-col flex-1 gap-sm">
                  <p className="font-body-md text-body-md text-[var(--color-on-surface)] line-clamp-2">Q3 Finansal Rapor Özeti: Karlılık %12 arttı. Görseller ekte.</p>
                  <p className="font-data-mono text-xs text-[var(--color-error)] mt-1 flex items-start gap-1"><span className="material-symbols-outlined text-[14px]">warning</span> API Bağlantı Hatası: Token expired.</p>
                  <div className="mt-auto pt-sm border-t border-white/5 flex flex-col gap-sm">
                    <div className="flex justify-between items-center font-data-mono text-label-sm text-[var(--color-on-surface-variant)]">
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> 10 Eki 2023, 10:00</div>
                      <div className="flex gap-1">
                        <svg className="w-4 h-4 fill-[var(--color-surface-variant)]" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded border border-white/10 text-[var(--color-on-surface)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] hover:border-[var(--color-error)]/50 font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">delete</span> Sil
                      </button>
                      <button className="flex-1 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--color-on-surface)] font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">refresh</span> Tekrar Dene
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
