import Image from "next/image";
import Link from "next/link";
import { getPosts, deletePost } from "@/actions/social";

export default async function PostsPage() {
  const posts = await getPosts() || [];

  return (
    <>
          <div className="max-w-7xl mx-auto space-y-md">
            
            {/* Header / Filter Row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-sm mb-lg">
              <div>
                <h1 className="font-display-lg text-[40px] font-bold text-[var(--color-on-surface)] leading-none mb-1">Content Manager</h1>
                <p className="font-data-mono text-[var(--color-on-surface-variant)] uppercase tracking-widest text-[12px]">All Social Posts & Campaigns</p>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 p-1 bg-black/20 rounded-lg self-start md:self-auto border border-white/5">
                <button className="px-4 py-2 rounded-md bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] font-label-sm text-label-sm font-bold shadow-sm">All</button>
                <button className="px-4 py-2 rounded-md text-[var(--color-on-surface-variant)] hover:bg-white/5 font-label-sm text-label-sm transition-colors">Published</button>
                <button className="px-4 py-2 rounded-md text-[var(--color-on-surface-variant)] hover:bg-white/5 font-label-sm text-label-sm transition-colors">Scheduled</button>
                <button className="px-4 py-2 rounded-md text-[var(--color-on-surface-variant)] hover:bg-white/5 font-label-sm text-label-sm transition-colors flex items-center gap-1">
                  Drafts
                  <span className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-[10px] px-1.5 rounded-sm">3</span>
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              
              {posts.length === 0 ? (
                <div className="col-span-full p-8 text-center text-on-surface-variant font-data-mono">
                  Hiç gönderi bulunamadı.
                </div>
              ) : (
                posts.map((post: any, idx: number) => {
                  const isPublished = post.status === 'published';
                  const isScheduled = post.status === 'scheduled';
                  const isFailed = post.status === 'failed';

                  return (
                    <div key={idx} className={`glass-panel rounded-xl overflow-hidden flex flex-col group border-t-2 ${isPublished ? 'border-t-[var(--color-primary)]' : isScheduled ? 'border-t-[var(--color-secondary-container)]' : 'border-t-[var(--color-error)]'}`}>
                      {/* Image Area */}
                      <div className="h-32 bg-[var(--color-surface-container-highest)] relative border-b border-white/5 overflow-hidden">
                        <img 
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isFailed ? 'opacity-50 grayscale' : 'opacity-80'}`} 
                          alt="Post preview" 
                          src={post.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBovIMIsOMjXtGSBgitr6aMODGgRPm4-uMm1FWuh2sAI1THgTx_EYvgvUIlJ4PegsDDozcR3wH7qDpl_BLZzDlNd3mXhlT56CKHo21RFtgAA3njhvHCD4QnUSYZX8Yn6W8Ul_bodUN_zmsbWTD49-eKUIRqVaKniDZgN5nE9mWbpG_1QfLshefxRZP-Xx5wsyVWkANsmVIrqqygZd66genjnnn1r5ebus5OiuWH6t4Qrv5uEX5TA0g9YuDzxH86llVLAPTFHWcFazE"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 to-transparent"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-sm right-sm flex gap-xs">
                          {isPublished && (
                            <span className="px-2 py-1 rounded-md bg-[var(--color-primary-container)]/80 backdrop-blur-sm text-[var(--color-on-primary-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Yayında
                            </span>
                          )}
                          {isScheduled && (
                            <span className="px-2 py-1 rounded-md bg-[var(--color-secondary-container)]/80 backdrop-blur-sm text-[var(--color-on-secondary-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                              Planlanan
                            </span>
                          )}
                          {isFailed && (
                            <span className="px-2 py-1 rounded-md bg-[var(--color-error-container)]/90 backdrop-blur-sm text-[var(--color-on-error-container)] font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">error</span>
                              Hatalı
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-md flex flex-col flex-1 gap-sm relative bg-[var(--color-surface)]">
                        <p className="font-body-md text-body-md text-[var(--color-on-surface)] line-clamp-3 leading-relaxed">{post.content}</p>
                        
                        {/* Metrics or Actions */}
                        <div className="mt-auto pt-sm border-t border-white/5 flex flex-col gap-sm">
                          <div className="flex justify-between items-center font-data-mono text-label-sm text-[var(--color-on-surface-variant)]">
                            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(post.created_at || post.scheduled_for).toLocaleDateString('tr-TR')}</div>
                            <div className="flex gap-1">
                              <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                            </div>
                          </div>
                          
                          {/* Buttons Based on Status */}
                          {isPublished ? (
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-label-sm uppercase tracking-wider hover:bg-[var(--color-primary)]/20 transition-colors flex items-center justify-center gap-1 border border-[var(--color-primary)]/30">
                                <span className="material-symbols-outlined text-[16px]">bar_chart</span> Analiz
                              </button>
                              <button className="flex-1 py-2 rounded border border-white/10 text-[var(--color-on-surface)] hover:bg-white/5 font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">visibility</span> İncele
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <form action={async () => {
                                'use server';
                                await deletePost(post.id);
                              }} className="flex-1">
                                <button type="submit" className="w-full py-2 rounded border border-white/10 text-[var(--color-on-surface)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] hover:border-[var(--color-error)]/50 font-label-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">delete</span> Sil
                                </button>
                              </form>
                              <button className="flex-1 py-2 rounded btn-secondary font-label-sm uppercase tracking-wider flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">send</span> Şimdi Yayınla
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
            </div>
          </div>
    </>
  );
}
