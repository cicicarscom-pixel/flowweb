import Image from "next/image";
import Link from "next/link";
import { createPost } from "@/actions/social";
import { redirect } from "next/navigation";

export default function SharePage() {
  async function handleCreatePost(formData: FormData) {
    'use server';
    formData.set('platforms', JSON.stringify(['instagram', 'facebook', 'twitter']));
    await createPost(formData);
    redirect('/posts');
  }

  return (
    <>

        <form action={handleCreatePost} className="w-full max-w-4xl p-md md:p-lg lg:p-xl space-y-xl flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left Column: Composer */}
            <div className="lg:col-span-7 space-y-md">
              {/* Media Section */}
              <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline-lg-mobile text-[18px] font-semibold flex items-center gap-2">Medya <span className="text-[var(--color-error)]">*</span></h3>
                  <div className="absolute top-4 right-4 p-2 bg-[var(--color-surface-container)] rounded-full border border-white/10 text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </div>
                </div>
                <div className="w-full h-64 border-2 border-dashed border-[var(--color-primary)]/30 rounded-xl bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors flex flex-col items-center justify-center cursor-pointer group-hover:border-[var(--color-primary)]/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-tertiary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">add_photo_alternate</span>
                  </div>
                  <p className="font-body-md text-sm text-[var(--color-on-surface)] font-semibold">Tıkla veya sürükle bırak</p>
                  <p className="font-data-mono text-[10px] text-[var(--color-on-surface-variant)] mt-1">JPG, PNG, MP4 (Max 10MB)</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[var(--color-on-surface)] font-body-md text-sm">
                    <span className="material-symbols-outlined text-[var(--color-secondary)]">auto_awesome</span>
                    AI Görsel Üret
                  </button>
                  <button type="button" className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-[var(--color-on-surface)] font-body-md text-sm">
                    <span className="material-symbols-outlined text-[var(--color-tertiary)]">photo_library</span>
                    Kütüphaneden Seç
                  </button>
                </div>
              </div>

              {/* Text Content */}
              <div className="glass-panel rounded-2xl flex flex-col overflow-hidden group">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <h3 className="font-headline-lg-mobile text-[18px] font-semibold">Metin</h3>
                  <div className="flex gap-2">
                    <button type="button" className="w-8 h-8 rounded bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">format_bold</span>
                    </button>
                    <button type="button" className="w-8 h-8 rounded bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">format_italic</span>
                    </button>
                    <button type="button" className="w-8 h-8 rounded bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">tag</span>
                    </button>
                    <button type="button" className="w-8 h-8 rounded bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 relative">
                  <textarea 
                    name="content"
                    className="w-full h-40 bg-transparent border-none text-[var(--color-on-surface)] font-body-md text-[15px] focus:outline-none focus:ring-0 resize-none leading-relaxed placeholder:text-[var(--color-on-surface-variant)]/40" 
                    placeholder="Bir şeyler yaz..."
                  ></textarea>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button type="button" className="px-3 py-1.5 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] font-data-mono text-[10px] hover:text-white transition-colors">0 / 2200</button>
                  </div>
                </div>
                <div className="p-3 border-t border-white/5 bg-[var(--color-surface-container-lowest)]/50">
                  <div className="relative">
                    <input 
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-12 py-2.5 text-sm font-body-md text-[var(--color-on-surface)] focus:border-[var(--color-secondary)] focus:outline-none transition-colors" 
                      placeholder="AI ile metin üret..." 
                      type="text"
                    />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-secondary-container)] to-[var(--color-secondary)] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[0_0_10px_rgba(182,0,248,0.3)]">
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Settings & Publishing */}
            <div className="lg:col-span-5 space-y-md flex flex-col h-full">
              
              {/* Publishing */}
              <div className="mt-auto pt-md space-y-md">
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary-container)] text-white font-headline-lg-mobile text-lg flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(182,0,248,0.4)] transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[24px]">send</span>
                  Seçili Platformlarda Paylaş
                </button>
              </div>
            </div>
          </div>
          <div className="h-32"></div> {/* spacer */}
        </form>
    </>
  );
}
