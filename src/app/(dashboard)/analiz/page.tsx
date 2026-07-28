import Image from "next/image";
import Link from "next/link";
import { getAnalyticsOverview } from "@/actions/insights";

export default async function InsightsPage() {
  const stats = await getAnalyticsOverview();

  return (
    <>
        {/* Scrollable Dashboard */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-8 custom-scrollbar">
          
          {/* Dashboard Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-surface)]/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
            {/* Page Tabs */}
            <div className="flex gap-2">
              <button className="bg-[var(--color-surface-container-high)] px-6 py-2.5 rounded-md text-white font-medium text-sm border border-white/10 flex items-center gap-2 shadow-sm">
                Sosyal Medya Perf.
                <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">check</span>
              </button>
              <button className="px-6 py-2.5 rounded-md text-[var(--color-on-surface-variant)] hover:text-white font-medium text-sm transition-all">
                Gelen Mesaj Analizi
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-[var(--color-surface-container)] border border-white/10 text-sm text-white rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer">
                  <option>Tüm platformlar</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none text-sm">expand_more</span>
              </div>
              <div className="relative">
                <select className="appearance-none bg-[var(--color-surface-container)] border border-white/10 text-sm text-white rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] cursor-pointer">
                  <option>Son 30 gün</option>
                  <option>Son 7 gün</option>
                  <option>Bu ay</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none text-sm">expand_more</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 rounded-xl border border-[var(--color-primary)]/30 group-hover:glow-cyan transition-all duration-500 pointer-events-none"></div>
              <p className="text-sm text-[var(--color-on-surface-variant)] font-data-mono uppercase tracking-wider mb-2">Toplam Gönderi</p>
              <p className="text-4xl font-bold text-[var(--color-primary)] font-data-mono">{stats.totalPosts}</p>
            </div>
            {/* Card 2 */}
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 rounded-xl border border-[var(--color-secondary)]/30 group-hover:glow-magenta transition-all duration-500 pointer-events-none"></div>
              <p className="text-sm text-[var(--color-on-surface-variant)] font-data-mono uppercase tracking-wider mb-2">Toplam Yorum</p>
              <p className="text-4xl font-bold text-[var(--color-secondary)] font-data-mono">{stats.totalComments}</p>
            </div>
            {/* Card 3 */}
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-sm">group</span>
                <p className="text-sm text-[var(--color-on-surface-variant)] font-data-mono uppercase tracking-wider">Toplam Takipçi</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalFollowers}</p>
            </div>
            {/* Card 4 */}
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-sm">rate_review</span>
                <p className="text-sm text-[var(--color-on-surface-variant)] font-data-mono uppercase tracking-wider">Değerlendirmeler</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.reviews}</p>
            </div>
          </div>

          {/* Main Chart Area */}
          <section className="glass-panel rounded-xl p-6 h-[400px] flex flex-col relative">
            {/* Settings FAB over chart */}
            <button className="absolute -right-4 -top-4 w-12 h-12 bg-[var(--color-surface-container-high)] rounded-full border border-white/10 flex items-center justify-center hover:bg-[var(--color-surface-bright)] transition-colors shadow-lg z-10 text-[var(--color-on-surface-variant)] hover:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Etkileşim / Gösterim</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)]">Zaman içindeki değişim grafiği</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-data-mono">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span> Views</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span> Likes</div>
              </div>
            </div>
            {/* Empty State / Placeholder */}
            <div className="flex-1 border border-white/5 rounded bg-black/50 relative flex items-center justify-center overflow-hidden">
              {/* Decorative grid lines inside chart area */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:40px_40px]"></div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-[var(--color-on-surface-variant)]/50">insights</span>
                <p className="text-[var(--color-on-surface-variant)] text-sm font-data-mono tracking-widest uppercase">Yeterli grafik verisi yok.</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]/50 font-data-mono">Veri toplanıyor...</p>
              </div>
            </div>
          </section>

          {/* Platform Overview */}
          <section className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Platformlara Genel Bakış</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Instagram */}
              <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-lg bg-[var(--color-surface-container)]/50 hover:bg-[var(--color-surface-container)] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl text-white">camera_alt</span>
                </div>
                <span className="text-sm font-bold text-white mb-1">Instagram</span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Aktif</span>
              </div>
              {/* Facebook */}
              <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-lg bg-[var(--color-surface-container)]/50 hover:bg-[var(--color-surface-container)] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl text-blue-500">facebook</span>
                </div>
                <span className="text-sm font-bold text-white mb-1">Facebook</span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Aktif</span>
              </div>
            </div>
          </section>
        </div>
    </>
  );
}
