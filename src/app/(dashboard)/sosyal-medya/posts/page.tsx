"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

const FILTER_IDS = ['all', 'scheduled', 'published', 'failed'] as const;

export default function TumGonderilerPage() {
  const t = useTranslations();
  const FILTERS = FILTER_IDS.map((id) => ({ id, label: t(`postsPage.filters.${id}`) }));
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, postId: string | null, isBulk: boolean }>({ isOpen: false, postId: null, isBulk: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let requestSeq = 0;

    const fetchLocalPosts = async () => {
      const seq = ++requestSeq;
      try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        // Eski (stale) bir yanıtın state'i ezmesini önle — sadece en son
        // başlatılan isteğin sonucu uygulanır.
        if (data && seq === requestSeq) {
          setPosts(data);
        }
      } catch (err) {
        console.warn("Posts fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const syncAndFetchPosts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          await supabase.functions.invoke('zernio-client', {
            body: { action: 'sync-posts', payload: { userId } }
          });
        }
      } catch (err) {
        console.warn("Posts sync error:", err);
      } finally {
        await fetchLocalPosts();
      }
    };

    syncAndFetchPosts();

    // Toplu silme gibi işlemler N satırı güncelleyip N ayrı postgres_changes
    // olayı üretebiliyor — bunları tek bir refetch'e birleştir.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const channel = supabase
      .channel('realtime_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => { fetchLocalPosts(); }, 300);
      })
      .subscribe();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeletePost = (id: string) => {
    setDeleteModal({ isOpen: true, postId: id, isBulk: false });
  };

  const handleBulkDelete = () => {
    if (selectedPostIds.length === 0) return;
    setDeleteModal({ isOpen: true, postId: null, isBulk: true });
  };

  const executeDelete = async (deleteFromPlatforms: boolean) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      if (deleteModal.isBulk) {
        const postsToDelete = posts.filter(p => selectedPostIds.includes(p.id) && p.zernio_post_id);
        
        for (const post of postsToDelete) {
          const { data: deleteData, error: invokeError } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'delete-post', payload: { postId: post.zernio_post_id, deleteFromPlatforms } }
          });
          if (invokeError || deleteData?.success === false) {
             console.error("Zernio bulk delete error for post", post.zernio_post_id, ":", invokeError || deleteData?.error);
          }
        }

        const { error } = await supabase
          .from('posts')
          .update({ status: 'deleted' })
          .in('id', selectedPostIds);

        if (error) {
          console.error("Bulk delete error:", error);
          alert(t("postsPage.errors.bulkDeleteFailed", { message: error.message }));
        } else {
          setPosts(prev => prev.map(p => selectedPostIds.includes(p.id) ? { ...p, status: 'deleted' } : p));
          setSelectedPostIds([]);
        }
      } else if (deleteModal.postId) {
        const post = posts.find(p => p.id === deleteModal.postId);
        if (post?.zernio_post_id) {
          const { data: deleteData, error: invokeError } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'delete-post', payload: { postId: post.zernio_post_id, deleteFromPlatforms } }
          });
          if (invokeError || deleteData?.success === false) {
             console.error("Zernio delete error:", invokeError || deleteData?.error);
          }
        }

        const { error } = await supabase
          .from('posts')
          .update({ status: 'deleted' })
          .eq('id', deleteModal.postId);

        if (error) {
          console.error("Delete error:", error);
          alert(t("postsPage.errors.deleteFailed", { message: error.message }));
        } else {
          setPosts(prev => prev.map(p => p.id === deleteModal.postId ? { ...p, status: 'deleted' } : p));
          setSelectedPostIds(prev => prev.filter(pId => pId !== deleteModal.postId));
        }
      }
    } catch (err) {
      console.error("Delete exception:", err);
      alert(t("postsPage.errors.genericError"));
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, postId: null, isBulk: false });
    }
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPostIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map(p => p.id));
    }
  };

  const filteredPosts = posts.filter(post => {
    const s = (post.status || '').toLowerCase();
    if (s === 'deleted') return false;
    if (activeFilter === 'all') return true;
    return s === activeFilter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    switch(s) {
      case 'scheduled': return '#FF7A59'; // Cyan
      case 'published': return '#C2478D'; // Magenta
      case 'failed': return '#EF4444'; // Red
      default: return '#A79E96'; // Gray
    }
  };

  const getStatusLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    switch(s) {
      case 'scheduled': return t("postsPage.status.scheduled");
      case 'published': return t("postsPage.status.published");
      case 'failed': return t("postsPage.status.failed");
      default: return t("postsPage.status.unknown");
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return t("postsPage.dateNotSpecified");
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getPreviewText = (text: string) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    }
    return text;
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    switch (p) {
      case 'instagram': return "fa-instagram";
      case 'facebook': return "fa-facebook";
      case 'whatsapp': return "fa-whatsapp";
      case 'linkedin': return "fa-linkedin";
      case 'twitter': return "fa-x-twitter";
      case 'youtube': return "fa-youtube";
      case 'tiktok': return "fa-tiktok";
      default: return "fa-circle-dot";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-on-surface">
      {/* Filters */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto hide-scrollbar shrink-0 items-center">
        <Link href="/sosyal-medya" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#A79E96] hover:text-[#F6F1EC] transition-colors mr-2 shrink-0">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => { setActiveFilter(filter.id); setSelectedPostIds([]); }}
            className={`px-4 py-2 rounded-full border text-[12px] font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter.id 
                ? 'bg-[#FF7A59]/20 border-[#FF7A59] text-[#FF7A59]' 
                : 'bg-white/5 border-white/10 text-[#A79E96] hover:text-[#F6F1EC]'
            }`}
          >
            {filter.label}
          </button>
        ))}
        {selectedPostIds.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            className="ml-auto px-4 py-2 rounded-full border border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444] text-[12px] font-bold hover:bg-[#EF4444]/30 transition-colors flex items-center gap-2"
          >
            <i className="fa-regular fa-trash-can"></i>
            {t("postsPage.bulkDeleteButton", { count: selectedPostIds.length })}
          </button>
        )}
      </div>

      {/* List (Table Layout) */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        <div style={{ width: 1090, minHeight: '100%' }} className="flex flex-col pb-20">
          
          {/* Table Header */}
          <div className="flex items-center border-b border-white/10 pb-3 pt-4 mb-2 px-5 sticky top-0 bg-[#17151A]/95 z-10 backdrop-blur-sm">
            <div style={{ width: 40 }} className="flex justify-start">
              <button onClick={toggleSelectAll} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 ? 'bg-[#FF7A59] border-[#FF7A59]' : 'border-[#A79E96]/50 bg-transparent'}`}>
                {selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 && <i className="fa-solid fa-check text-[#17151A] text-[10px]"></i>}
              </button>
            </div>
            <div style={{ width: 250 }} className="text-[#A79E96] text-[12px] font-semibold">Content</div>
            <div style={{ width: 100 }} className="text-[#A79E96] text-[12px] font-semibold text-center">Platforms</div>
            <div style={{ width: 150 }} className="text-[#A79E96] text-[12px] font-semibold text-center">Date</div>
            <div style={{ width: 120 }} className="text-[#A79E96] text-[12px] font-semibold text-center">Status</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Likes</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Cmts</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Shrs</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Saves</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Clicks</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Views</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Impr.</div>
            <div style={{ width: 40 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Reach</div>
            <div style={{ width: 70 }} className="text-[#A79E96] text-[10px] font-semibold text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59]"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((item) => {
              const statusColor = getStatusColor(item.status);
              const isScheduled = (item.status || '').toLowerCase() === 'scheduled';
              const platformsArray = Array.isArray(item.platforms) ? item.platforms : [];

              return (
                <div key={item.id} className="flex items-center border-b border-white/5 py-3 px-5 hover:bg-white/5 transition-colors" style={{ opacity: isScheduled ? 0.7 : 1 }}>
                  {/* Checkbox Placeholder */}
                  <div style={{ width: 40 }} className="flex justify-start">
                    <button onClick={() => toggleSelectPost(item.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPostIds.includes(item.id) ? 'bg-[#FF7A59] border-[#FF7A59]' : 'border-[#A79E96]/50 bg-transparent'}`}>
                      {selectedPostIds.includes(item.id) && <i className="fa-solid fa-check text-[#17151A] text-[10px]"></i>}
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ width: 250 }} className="flex items-center pr-4">
                    {item.media_urls && item.media_urls.length > 0 ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-3 shrink-0 relative">
                        {item.media_urls[0].match(/\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i) || item.media_urls[0].includes('blob') ? (
                          <>
                            <video src={item.media_urls[0]} className="w-full h-full object-cover" muted playsInline />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <i className="fa-solid fa-play text-white/70 text-[10px]"></i>
                            </div>
                          </>
                        ) : (
                          <img src={item.media_urls[0]} alt="media" className="w-full h-full object-cover" onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A79E96'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                            e.currentTarget.className = "w-6 h-6 m-2 opacity-50";
                            e.currentTarget.parentElement!.className = "w-10 h-10 rounded-md mr-3 shrink-0 flex items-center justify-center bg-white/5";
                          }} />
                        )}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md mr-3 shrink-0 flex items-center justify-center bg-white/5">
                        <i className="fa-regular fa-image text-[#A79E96]"></i>
                      </div>
                    )}
                    <span className="text-[#F6F1EC] text-[13px] font-medium line-clamp-2 leading-tight">
                      {getPreviewText(item.content || item.title)}
                    </span>
                  </div>

                  {/* Platforms */}
                  <div style={{ width: 100 }} className="flex justify-center items-center gap-1">
                    {platformsArray.map((platObj: any, idx: number) => {
                      const platName = typeof platObj === 'string' ? platObj : platObj.platform;
                      if (!platName) return null;
                      return <i key={idx} className={`fa-brands ${getPlatformIcon(platName)} text-[14px] text-[#F6F1EC]`}></i>;
                    })}
                  </div>

                  {/* Date */}
                  <div style={{ width: 150 }} className="flex justify-center items-center">
                    <span className="text-[#A79E96] text-[12px]">{formatDate(item.scheduled_for)}</span>
                  </div>

                  {/* Status */}
                  <div style={{ width: 120 }} className="flex flex-col justify-center items-center gap-1">
                    <div 
                      className="flex items-center px-2 py-1 rounded border"
                      style={{ 
                        backgroundColor: isScheduled ? 'rgba(255,122,89, 0.15)' : `${statusColor}15`,
                        borderColor: isScheduled ? 'rgba(255,122,89, 0.4)' : `${statusColor}30` 
                      }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full mr-1.5" 
                        style={{ backgroundColor: isScheduled ? '#FF7A59' : statusColor }} 
                      ></div>
                      <span 
                        style={{ color: isScheduled ? '#FF7A59' : statusColor }} 
                        className="text-[10px] font-bold"
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    {item.media_storage_source === 'supabase' && (
                      <div className="px-1.5 py-0.5 rounded bg-[#F2994A]/20 border border-[#F2994A]/40">
                         <span className="text-[#F2994A] text-[9px] font-bold">Geçici Depoda</span>
                      </div>
                    )}
                  </div>

                  {/* Metrics */}
                  {[
                    item.metrics?.likes ?? item.likes,
                    item.metrics?.comments ?? item.comments,
                    item.metrics?.shares ?? item.shares,
                    item.metrics?.saves ?? item.saves,
                    item.metrics?.clicks ?? item.clicks,
                    item.metrics?.views ?? item.views,
                    item.metrics?.impressions ?? item.impressions,
                    item.metrics?.reach ?? item.reach
                  ].map((val, idx) => (
                    <div key={idx} style={{ width: 40 }} className="flex justify-center items-center">
                      <span className="text-[#A79E96] text-[12px]">{val != null ? val : '-'}</span>
                    </div>
                  ))}

                  {/* Actions */}
                  <div style={{ width: 70 }} className="flex justify-center items-center gap-1">
                    {(item.status || '').toLowerCase() === 'failed' && (
                      <button className="w-7 h-7 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444]/30 transition-colors" title={t("postsPage.actions.retry")}>
                        <i className="fa-solid fa-rotate-right text-[12px]"></i>
                      </button>
                    )}
                    {(item.status || '').toLowerCase() === 'published' && (
                      <button className="w-7 h-7 rounded bg-[#C2478D]/10 border border-[#C2478D]/30 flex items-center justify-center text-[#C2478D] hover:bg-[#C2478D]/20 transition-colors" title={t("postsPage.actions.analyze")}>
                        <i className="fa-solid fa-cloud-arrow-down text-[12px]"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePost(item.id)}
                      className="w-7 h-7 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                      title={t("postsPage.actions.delete")}
                    >
                      <i className="fa-regular fa-trash-can text-[12px]"></i>
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 w-full">
              <i className="fa-regular fa-file-lines text-4xl text-[#A79E96] opacity-50 mb-4"></i>
              <p className="text-[#A79E96] text-sm">{t("postsPage.emptyState")}</p>
            </div>
          )}

        </div>
      </div>

      {/* Delete Modal */}
      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-[#EC4899] font-medium text-[17px] flex items-center gap-2">
                <i className="fa-regular fa-trash-can"></i> {t("postsPage.deleteModal.title")}
              </h3>
              <button 
                onClick={() => !isDeleting && setDeleteModal({ isOpen: false, postId: null, isBulk: false })}
                className="text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center rounded-full"
                disabled={isDeleting}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="px-6 pb-6 pt-2">
              <p className="text-gray-600 text-[13px] mb-4">
                {deleteModal.isBulk
                  ? t("postsPage.deleteModal.bulkDescription", { count: selectedPostIds.length })
                  : t("postsPage.deleteModal.singleDescription")}
              </p>
              
              <div className="flex flex-col gap-3">
                {/* Delete from Zernio only */}
                <button 
                  onClick={() => executeDelete(false)}
                  disabled={isDeleting}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#EC4899] transition-all flex items-start gap-4 disabled:opacity-50"
                >
                  <div className="bg-[#FDF2F8] p-2 rounded-md text-[#EC4899] shrink-0">
                    <i className="fa-regular fa-trash-can text-[15px]"></i>
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium text-[14px] mb-1">{t("postsPage.deleteModal.panelOnlyTitle")}</h4>
                    <p className="text-gray-500 text-[12px] leading-relaxed">
                      {t("postsPage.deleteModal.panelOnlyDescription")}
                    </p>
                  </div>
                </button>

                {/* Delete from platforms and Zernio */}
                <button 
                  onClick={() => executeDelete(true)}
                  disabled={isDeleting}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#EC4899] transition-all flex items-start gap-4 disabled:opacity-50"
                >
                  <div className="bg-[#FDF2F8] p-2 rounded-md text-[#EC4899] shrink-0">
                    <i className="fa-solid fa-globe text-[15px]"></i>
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium text-[14px] mb-1">{t("postsPage.deleteModal.platformsTitle")}</h4>
                    <p className="text-gray-500 text-[12px] leading-relaxed mb-2">
                      {t("postsPage.deleteModal.platformsDescription")}
                    </p>
                    <div className="flex items-start gap-2 pt-2">
                      <i className="fa-solid fa-triangle-exclamation text-[#F59E0B] text-[12px] mt-0.5 shrink-0"></i>
                      <p className="text-[#F59E0B] text-[12px] leading-relaxed">
                        {t("postsPage.deleteModal.instagramWarning")}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Social icons at the bottom left */}
              <div className="flex items-center gap-3 mt-5 ml-1 text-gray-700 text-sm">
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-tiktok"></i>
                <i className="fa-brands fa-youtube"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
