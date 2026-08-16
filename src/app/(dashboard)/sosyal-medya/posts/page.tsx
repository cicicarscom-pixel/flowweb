"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'scheduled', label: 'Planlanan' },
  { id: 'published', label: 'Yayınlanan' },
  { id: 'failed', label: 'Hatalı' }
];

export default function TumGonderilerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (userId) {
          // Sync posts from Zernio first to make sure we have the latest scheduled/published posts
          await supabase.functions.invoke('zernio-client', {
            body: { action: 'sync-posts', payload: { userId } }
          });
        }

        const { data } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setPosts(data);
        }
      } catch (err) {
        console.warn("Posts fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('realtime_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) return;
    const deleteFromPlatforms = window.confirm("Bu gönderi sosyal medya platformlarından (Facebook vb.) da KALICI OLARAK silinsin mi?\n\nTamam: Platformlardan da sil.\nİptal: Sadece panelden sil (Platformda yayınlanmaya devam eder).");

    try {
      const post = posts.find(p => p.id === id);
      if (post?.zernio_post_id) {
        const { error: invokeError } = await supabase.functions.invoke('zernio-client', {
          body: { action: 'delete-post', postId: post.zernio_post_id, deleteFromPlatforms }
        });
        if (invokeError) {
           console.error("Zernio delete error:", invokeError);
           // Hata olsa bile yerel olarak silelim mi? Evet devam edelim.
        }
      }

      const { error } = await supabase
        .from('posts')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) {
        console.error("Delete error:", error);
        alert("Gönderi silinirken hata oluştu: " + error.message);
      } else {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'deleted' } : p));
        setSelectedPostIds(prev => prev.filter(pId => pId !== id));
      }
    } catch (err) {
      console.error("Delete exception:", err);
      alert("Gönderi silinemedi.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPostIds.length === 0) return;
    if (!window.confirm(`${selectedPostIds.length} gönderiyi silmek istediğinize emin misiniz?`)) return;
    const deleteFromPlatforms = window.confirm("Seçili gönderiler sosyal medya platformlarından (Facebook vb.) da KALICI OLARAK silinsin mi?\n\nTamam: Platformlardan da sil.\nİptal: Sadece panelden sil (Platformlarda yayınlanmaya devam eder).");

    try {
      const postsToDelete = posts.filter(p => selectedPostIds.includes(p.id) && p.zernio_post_id);
      
      // Her biri için API çağrısı yap (Sırayla yapalım, asenkron çok fazla istek atıp patlatmayalım)
      for (const post of postsToDelete) {
        await supabase.functions.invoke('zernio-client', {
          body: { action: 'delete-post', postId: post.zernio_post_id, deleteFromPlatforms }
        });
      }

      const { error } = await supabase
        .from('posts')
        .update({ status: 'deleted' })
        .in('id', selectedPostIds);

      if (error) {
        console.error("Bulk delete error:", error);
        alert("Gönderiler silinirken hata oluştu: " + error.message);
      } else {
        setPosts(prev => prev.map(p => selectedPostIds.includes(p.id) ? { ...p, status: 'deleted' } : p));
        setSelectedPostIds([]);
      }
    } catch (err) {
      console.error("Bulk delete exception:", err);
      alert("Gönderiler silinemedi.");
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
      case 'scheduled': return '#00f0ff'; // Cyan
      case 'published': return '#bc13fe'; // Magenta
      case 'failed': return '#ff0050'; // Red
      default: return '#849495'; // Gray
    }
  };

  const getStatusLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    switch(s) {
      case 'scheduled': return 'Planlandı';
      case 'published': return 'Yayınlandı';
      case 'failed': return 'Hatalı';
      default: return 'Bilinmiyor';
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return 'Belirtilmedi';
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
        <Link href="/sosyal-medya" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#849495] hover:text-[#e5e2e3] transition-colors mr-2 shrink-0">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => { setActiveFilter(filter.id); setSelectedPostIds([]); }}
            className={`px-4 py-2 rounded-full border text-[12px] font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter.id 
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' 
                : 'bg-white/5 border-white/10 text-[#849495] hover:text-[#e5e2e3]'
            }`}
          >
            {filter.label}
          </button>
        ))}
        {selectedPostIds.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            className="ml-auto px-4 py-2 rounded-full border border-[#ff0050] bg-[#ff0050]/20 text-[#ff0050] text-[12px] font-bold hover:bg-[#ff0050]/30 transition-colors flex items-center gap-2"
          >
            <i className="fa-regular fa-trash-can"></i>
            {selectedPostIds.length} Seçiliyi Sil
          </button>
        )}
      </div>

      {/* List (Table Layout) */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        <div style={{ width: 1410, minHeight: '100%' }} className="flex flex-col pb-20">
          
          {/* Table Header */}
          <div className="flex items-center border-b border-white/10 pb-3 pt-4 mb-2 px-5 sticky top-0 bg-[#0A0A0B]/95 z-10 backdrop-blur-sm">
            <div style={{ width: 40 }} className="flex justify-start">
              <button onClick={toggleSelectAll} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-[#849495]/50 bg-transparent'}`}>
                {selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 && <i className="fa-solid fa-check text-[#0A0A0B] text-[10px]"></i>}
              </button>
            </div>
            <div style={{ width: 250 }} className="text-[#849495] text-[12px] font-semibold">Content</div>
            <div style={{ width: 100 }} className="text-[#849495] text-[12px] font-semibold text-center">Platforms</div>
            <div style={{ width: 150 }} className="text-[#849495] text-[12px] font-semibold text-center">Date</div>
            <div style={{ width: 120 }} className="text-[#849495] text-[12px] font-semibold text-center">Status</div>
            <div style={{ width: 150 }} className="text-[#849495] text-[12px] font-semibold">Profile</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Likes</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Cmts</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Shrs</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Saves</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Clicks</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Views</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Impr.</div>
            <div style={{ width: 60 }} className="text-[#849495] text-[10px] font-semibold text-center">Reach</div>
            <div style={{ width: 80 }} className="text-[#849495] text-[10px] font-semibold text-center">Actions</div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f0ff]"></div>
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
                    <button onClick={() => toggleSelectPost(item.id)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPostIds.includes(item.id) ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-[#849495]/50 bg-transparent'}`}>
                      {selectedPostIds.includes(item.id) && <i className="fa-solid fa-check text-[#0A0A0B] text-[10px]"></i>}
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ width: 250 }} className="flex items-center pr-4">
                    {item.media_urls && item.media_urls.length > 0 ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-3 shrink-0">
                        <img src={item.media_urls[0]} alt="media" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md mr-3 shrink-0 flex items-center justify-center bg-white/5">
                        <i className="fa-regular fa-image text-[#849495]"></i>
                      </div>
                    )}
                    <span className="text-[#e5e2e3] text-[13px] font-medium line-clamp-2 leading-tight">
                      {getPreviewText(item.content || item.title)}
                    </span>
                  </div>

                  {/* Platforms */}
                  <div style={{ width: 100 }} className="flex justify-center items-center gap-1">
                    {platformsArray.map((platObj: any, idx: number) => {
                      const platName = typeof platObj === 'string' ? platObj : platObj.platform;
                      if (!platName) return null;
                      return <i key={idx} className={`fa-brands ${getPlatformIcon(platName)} text-[14px] text-[#e5e2e3]`}></i>;
                    })}
                  </div>

                  {/* Date */}
                  <div style={{ width: 150 }} className="flex justify-center items-center">
                    <span className="text-[#b9cacb] text-[12px]">{formatDate(item.scheduled_for)}</span>
                  </div>

                  {/* Status */}
                  <div style={{ width: 120 }} className="flex justify-center items-center">
                    <div 
                      className="flex items-center px-2 py-1 rounded border"
                      style={{ 
                        backgroundColor: isScheduled ? 'rgba(0, 240, 255, 0.15)' : `${statusColor}15`,
                        borderColor: isScheduled ? 'rgba(0, 240, 255, 0.4)' : `${statusColor}30` 
                      }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full mr-1.5" 
                        style={{ backgroundColor: isScheduled ? '#00f0ff' : statusColor }} 
                      ></div>
                      <span 
                        style={{ color: isScheduled ? '#00f0ff' : statusColor }} 
                        className="text-[10px] font-bold"
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>

                  {/* Profile */}
                  <div style={{ width: 150 }} className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] mr-2 shrink-0"></div>
                    <span className="text-[#e5e2e3] text-[12px] truncate">AI Esnaf Profil</span>
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
                    <div key={idx} style={{ width: 60 }} className="flex justify-center items-center">
                      <span className="text-[#849495] text-[12px]">{val != null ? val : '-'}</span>
                    </div>
                  ))}

                  {/* Actions */}
                  <div style={{ width: 80 }} className="flex justify-center items-center gap-1">
                    {(item.status || '').toLowerCase() === 'failed' && (
                      <button className="w-7 h-7 rounded bg-[#ff0050]/20 border border-[#ff0050]/40 flex items-center justify-center text-[#ff0050] hover:bg-[#ff0050]/30 transition-colors" title="Yeniden Dene">
                        <i className="fa-solid fa-rotate-right text-[12px]"></i>
                      </button>
                    )}
                    {(item.status || '').toLowerCase() === 'published' && (
                      <button className="w-7 h-7 rounded bg-[#bc13fe]/10 border border-[#bc13fe]/30 flex items-center justify-center text-[#bc13fe] hover:bg-[#bc13fe]/20 transition-colors" title="Analiz">
                        <i className="fa-solid fa-cloud-arrow-down text-[12px]"></i>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeletePost(item.id)}
                      className="w-7 h-7 rounded bg-[#ff0050]/10 border border-[#ff0050]/30 flex items-center justify-center text-[#ff0050] hover:bg-[#ff0050]/20 transition-colors"
                      title="Sil"
                    >
                      <i className="fa-regular fa-trash-can text-[12px]"></i>
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 w-full">
              <i className="fa-regular fa-file-lines text-4xl text-[#849495] opacity-50 mb-4"></i>
              <p className="text-[#849495] text-sm">Bu duruma ait gönderi bulunamadı.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
