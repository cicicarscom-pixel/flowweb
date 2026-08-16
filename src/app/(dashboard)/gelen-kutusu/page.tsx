"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GelenKutusuPage() {
  const [activeTab, setActiveTab] = useState<'mesajlar' | 'yorumlar' | 'degerlendirmeler'>('mesajlar');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const supabase = createClient();

  // Fetch Data
  const handleSendReply = async (comment: any) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Oturum bulunamadı");
      
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: { 
          action: 'reply-comment', 
          payload: { 
            userId: session.user.id,
            postId: comment.zernio_post_id,
            accountId: comment.posts?.accountId || comment.accountId,
            commentId: comment.zernio_comment_id,
            message: replyText,
            platform: comment.platform
          } 
        }
      });
      
      if (error || data?.error) {
        throw new Error(error?.message || data?.error);
      }
      
      // Optimistic UI Update (insert locally)
      const newComment = {
        id: Math.random().toString(),
        post_id: comment.post_id,
        zernio_comment_id: data?.id || data?.data?.id || `mock_${Date.now()}`,
        zernio_post_id: comment.zernio_post_id,
        content: replyText,
        username: 'Mağaza (Ben)',
        platform: comment.platform,
        created_at: new Date().toISOString(),
        liked: false,
        hidden: false,
      };
      setComments(prev => [newComment, ...prev]);

      await supabase.from('comments').insert({
        ...newComment,
        id: undefined // Let db generate uuid
      });

      alert("Yanıt başarıyla gönderildi!");
      setReplyingTo(null);
      setReplyText("");
    } catch (err: any) {
      console.error(err);
      alert("Yanıt gönderilemedi: " + err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            content,
            created_at
          )
        `)
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        const enhancedData = data.map(conv => {
          let lastMessageSnippet = 'Son mesajı görmek için dokunun';
          if (conv.messages && conv.messages.length > 0) {
            const sortedMessages = [...conv.messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            lastMessageSnippet = sortedMessages[0].content;
          }
          return { ...conv, lastMessageSnippet };
        });
        setConversations(enhancedData);
      }
    } catch (err) {
      console.warn("Conversations fetch err:", err);
    }
  };

  const CACHE_TTL_MS = 6 * 24 * 60 * 60 * 1000; // 6 gün
  
  const getCachedPictures = () => {
    try {
       const cached = localStorage.getItem('zernio_pic_cache');
       if (!cached) return {};
       const parsed = JSON.parse(cached);
       if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
          localStorage.removeItem('zernio_pic_cache');
          return {};
       }
       return parsed.data || {};
    } catch { return {}; }
  };

  const setCachedPictures = (data: any) => {
    try {
      localStorage.setItem('zernio_pic_cache', JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch {}
  };

  const fetchComments = async (phase: number = 1) => {
    try {
      if (phase === 1) {
        // Faz 1: Local DB + Önbellekteki Resimler
        const { data, error } = await supabase
          .from('comments')
          .select('*, posts(*)')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          const { data: globalLogs } = await supabase.from('ai_communication_logs')
            .select('sender_id')
            .eq('platform', 'zernio_deleted_comment');
          const globallyDeletedIds = globalLogs ? globalLogs.map(l => l.sender_id) : [];

          const cachedPics = getCachedPictures();
          const enhancedData = data
            .filter(c => !globallyDeletedIds.includes(c.zernio_comment_id))
            .map(c => ({
              ...c,
              post_picture: (c.zernio_post_id && cachedPics['post_' + c.zernio_post_id]) || c.posts?.media_urls?.[0] || null,
              author_picture: cachedPics[c.zernio_comment_id] || null
          }));
          setComments(enhancedData);
          
          // Faz 1.5'i tetikle
          setTimeout(() => fetchComments(1.5), 500);
        }
      } else if (phase === 1.5) {
        // Faz 1.5: Eksik resimleri Edge Function'dan çek ve önbellekle
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
           const { data: picData } = await supabase.functions.invoke('zernio-client', {
              body: { action: 'get-inbox-pictures', payload: { userId: session.user.id } }
           });
           if (picData?.data && Object.keys(picData.data).length > 0) {
             const newPics = picData.data;
             const currentCache = getCachedPictures();
             setCachedPictures({ ...currentCache, ...newPics });
             
             setComments(prev => prev.map(c => ({
                ...c,
                post_picture: c.post_picture || (c.zernio_post_id && newPics['post_' + c.zernio_post_id]) || null,
                author_picture: c.author_picture || newPics[c.zernio_comment_id] || null
             })));
           }
           // Faz 2'yi tetikle
           setTimeout(() => fetchComments(2), 2000);
        }
      } else if (phase === 2) {
         // Faz 2: Zernio'dan eksik yorumları eşitle (sync-comments)
         const { data: { session } } = await supabase.auth.getSession();
         if (session?.user?.id) {
            await supabase.functions.invoke('zernio-client', {
              body: { action: 'sync-comments', payload: { userId: session.user.id } }
            });
         }
      }
    } catch (err) {
      console.warn("Comments fetch err:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.warn("Reviews fetch err:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchConversations(), fetchComments(1), fetchReviews()]);
      setIsLoading(false);
    };
    loadAll();

    // Realtime Subscriptions (Döngü Korumalı)
    const convChannel = supabase.channel('web_realtime_conversations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, fetchConversations)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, (payload) => {
         setConversations(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
      })
      .subscribe();

    const msgChannel = supabase.channel('web_realtime_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchConversations)
      .subscribe();

    const commentChannel = supabase.channel('web_realtime_comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, () => fetchComments(1))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'comments' }, (payload) => {
         setComments(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'comments' }, (payload) => {
         setComments(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .subscribe();

    const reviewChannel = supabase.channel('web_realtime_reviews')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, fetchReviews)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reviews' }, (payload) => {
         setReviews(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(reviewChannel);
    };
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Seçilen ${selectedItems.length} öğeyi silmek istediğinize emin misiniz?`)) {
      try {
        if (activeTab === 'mesajlar') {
          await supabase.from('conversations').delete().in('zernio_conversation_id', selectedItems);
          await supabase.from('ai_communication_logs').delete().in('sender_id', selectedItems);
        } else if (activeTab === 'yorumlar') {
          const uuids = selectedItems.filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
          const zernioIds = selectedItems.filter(id => !uuids.includes(id));
          if (uuids.length > 0) await supabase.from('comments').delete().in('id', uuids);
          if (zernioIds.length > 0) {
            await supabase.from('comments').delete().in('zernio_comment_id', zernioIds);
            const { data: { session } } = await supabase.auth.getSession();
            await supabase.from('ai_communication_logs').insert(
              zernioIds.map(id => ({
                platform: 'zernio_deleted_comment',
                sender_id: id,
                user_message: '[DELETED]',
                merchant_id: session?.user?.id
              }))
            );
          }
        } else if (activeTab === 'degerlendirmeler') {
           await supabase.from('reviews').delete().in('id', selectedItems);
        }
      } catch (e) {
        console.warn("Delete err:", e);
      } finally {
        setIsSelectionMode(false);
        setSelectedItems([]);
      }
    }
  };

  const handleSelectAll = () => {
    let allIds: string[] = [];
    if (activeTab === 'mesajlar') {
      allIds = conversations.map(c => c.zernio_conversation_id || c.id);
    } else if (activeTab === 'yorumlar') {
      allIds = comments.map(c => c.zernio_comment_id || c.id);
    } else if (activeTab === 'degerlendirmeler') {
      allIds = reviews.map(r => r.id);
    }

    if (selectedItems.length === allIds.length && allIds.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allIds);
    }
  };


  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <i className="fa-brands fa-instagram text-[#ebb2ff]"></i>;
      case 'facebook': return <i className="fa-brands fa-facebook text-[#00f0ff]"></i>;
      case 'whatsapp': return <i className="fa-brands fa-whatsapp text-[#25D366]"></i>;
      case 'youtube': return <i className="fa-brands fa-youtube text-[#ff0000]"></i>;
      case 'linkedin': return <i className="fa-brands fa-linkedin text-[#0077b5]"></i>;
      default: return <i className="fa-solid fa-message text-gray-400"></i>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Gelen Kutusu</h1>
          <p className="text-app-muted text-sm">Tüm müşteri etkileşimlerini buradan yönetin.</p>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isSelectionMode ? (
            <>
              <span className="text-sm font-medium text-app-muted">{selectedItems.length} Seçildi</span>
              <button 
                onClick={handleSelectAll}
                className="px-4 py-2 rounded-lg bg-app-card border border-app-border text-on-surface hover:bg-app-border transition-colors text-sm font-medium flex items-center gap-2"
              >
                <i className="fa-solid fa-check-double"></i> Tümünü Seç
              </button>
              <button 
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  selectedItems.length > 0 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' 
                    : 'bg-app-card text-app-muted border border-app-border'
                }`}
              >
                <i className="fa-solid fa-trash-can"></i> Sil
              </button>
              <button 
                onClick={() => { setIsSelectionMode(false); setSelectedItems([]); }}
                className="px-4 py-2 rounded-lg bg-app-card border border-app-border text-on-surface hover:bg-app-border transition-colors text-sm font-medium"
              >
                İptal
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSelectionMode(true)}
              className="px-4 py-2 rounded-lg border border-dashed border-app-muted/40 text-app-muted hover:text-on-surface hover:border-app-muted transition-colors text-sm font-medium flex items-center gap-2"
            >
              <i className="fa-solid fa-list-check"></i> Seç
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-app-border pb-1 overflow-x-auto hide-scrollbar">
        {[
          { id: 'mesajlar', label: 'Mesajlar (DM)', count: conversations.length },
          { id: 'yorumlar', label: 'Yorumlar', count: comments.length },
          { id: 'degerlendirmeler', label: 'Değerlendirmeler', count: reviews.length },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSelectionMode(false); setSelectedItems([]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold text-sm transition-all whitespace-nowrap border-b-2 ${
                isActive 
                  ? 'bg-[#bc13fe]/10 text-white border-[#bc13fe]' 
                  : 'border-transparent text-app-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#bc13fe] text-white flex items-center justify-center text-[11px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-3 custom-scrollbar">
        
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f0ff]"></div>
          </div>
        ) : activeTab === 'mesajlar' && conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-comments text-4xl mb-4 text-[#849495]"></i>
            <p className="text-[#849495] text-sm">Henüz mesaj bulunmuyor.</p>
          </div>
        ) : activeTab === 'yorumlar' && comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-comment text-4xl mb-4 text-[#849495]"></i>
            <p className="text-[#849495] text-sm">Henüz yorum bulunmuyor.</p>
          </div>
        ) : activeTab === 'degerlendirmeler' && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-star text-4xl mb-4 text-[#849495]"></i>
            <p className="text-[#849495] text-sm">Henüz değerlendirme bulunmuyor.</p>
          </div>
        ) : null}

        {/* --- MESAJLAR TAB --- */}
        {!isLoading && activeTab === 'mesajlar' && (
          conversations.map(conv => {
            const selectId = conv.zernio_conversation_id || conv.id;
            return (
              <div 
                key={conv.id}
                onClick={() => isSelectionMode ? toggleSelection(selectId) : null}
                className={`glass flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedItems.includes(selectId) 
                    ? 'border-[#00f0ff] bg-[#00f0ff]/5' 
                    : 'border-app-border bg-app-card hover:border-app-muted/40'
                }`}
              >
                {isSelectionMode && (
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    selectedItems.includes(selectId) ? 'bg-[#00f0ff] border-[#00f0ff] text-black' : 'border-app-muted'
                  }`}>
                    {selectedItems.includes(selectId) && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                )}
                
                <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user text-app-muted"></i>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-app-bg border border-app-border flex items-center justify-center text-xs">
                    {getPlatformIcon(conv.platform)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-on-surface truncate pr-2">{conv.participant_name}</h3>
                    <span className="text-xs text-app-muted flex-shrink-0">
                      {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-[#00f0ff] font-medium' : 'text-app-muted'}`}>
                    {conv.lastMessageSnippet}
                  </p>
                </div>

                {!isSelectionMode && (
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {conv.unread_count > 0 ? (
                      <div className="bg-[#00f0ff] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </div>
                    ) : (
                      <div className="w-5 h-5"></div> /* Placeholder for alignment */
                    )}
                    <button className="text-app-muted hover:text-[#00f0ff] transition-colors">
                      <i className="fa-solid fa-reply"></i>
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* --- YORUMLAR TAB --- */}
        {!isLoading && activeTab === 'yorumlar' && (
          comments.map(comm => {
            const selectId = comm.zernio_comment_id || comm.id;
            return (
              <div 
                key={comm.id}
                onClick={() => isSelectionMode ? toggleSelection(selectId) : null}
                className={`glass flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedItems.includes(selectId) 
                    ? 'border-[#bc13fe] bg-[#bc13fe]/5' 
                    : 'border-app-border bg-app-card hover:border-app-muted/40'
                }`}
              >
                {isSelectionMode && (
                  <div className={`mt-2 w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                    selectedItems.includes(selectId) ? 'bg-[#bc13fe] border-[#bc13fe] text-white' : 'border-app-muted'
                  }`}>
                    {selectedItems.includes(selectId) && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                )}

                {comm.post_picture ? (
                  <img src={comm.post_picture} alt="Post" className="w-14 h-14 object-cover rounded-lg border border-white/5 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/5 flex-shrink-0 flex items-center justify-center">
                    <i className="fa-regular fa-image text-app-muted"></i>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {comm.author_picture ? (
                        <div className="relative">
                          <img src={comm.author_picture} alt="Author" className="w-6 h-6 rounded-full object-cover border border-white/10" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#131315] rounded-full flex items-center justify-center">
                            {getPlatformIcon(comm.platform)}
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                            <i className="fa-solid fa-user text-[10px] text-app-muted"></i>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#131315] rounded-full flex items-center justify-center">
                            {getPlatformIcon(comm.platform)}
                          </div>
                        </div>
                      )}
                      <span className="font-semibold text-on-surface text-sm truncate">@{comm.author_name || comm.username}</span>
                    </div>
                    <span className="text-xs text-app-muted whitespace-nowrap">
                      {comm.created_at ? new Date(comm.created_at).toLocaleDateString('tr-TR') : ''}
                    </span>
                  </div>
                  <p className="text-sm text-app-muted line-clamp-2 leading-relaxed">
                    {comm.content}
                  </p>
                  
                  {!isSelectionMode && (
                    <div className="mt-3 flex items-center justify-end">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setReplyingTo(comm.id); 
                          setReplyText(`@${comm.author_name || comm.username} `); 
                        }}
                        className="px-3 py-1.5 rounded bg-[#bc13fe]/10 border border-[#bc13fe]/20 text-[#bc13fe] hover:bg-[#bc13fe]/20 transition-colors text-xs font-semibold flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-reply"></i> Yanıtla
                      </button>
                    </div>
                  )}

                  {replyingTo === comm.id && (
                    <div 
                      className="mt-3 pt-3 border-t border-white/5 flex gap-2"
                      onClick={(e) => e.stopPropagation()} // prevent row selection when interacting with input
                    >
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Yanıtınızı yazın..." 
                        className="flex-1 bg-[#131314] rounded-lg px-3 py-2 text-sm text-[#e5e2e3] border border-white/10 focus:border-[#bc13fe] focus:outline-none"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSendReply(comm)}
                        disabled={isSendingReply}
                        className="px-4 py-2 bg-[#bc13fe] hover:bg-[#a10ce0] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 min-w-[80px]"
                      >
                        {isSendingReply ? <i className="fa-solid fa-spinner fa-spin"></i> : "Gönder"}
                      </button>
                      <button 
                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-[#849495] rounded-lg text-sm transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* --- DEĞERLENDİRMELER TAB --- */}
        {!isLoading && activeTab === 'degerlendirmeler' && (
          reviews.map(rev => (
            <div 
              key={rev.id}
              onClick={() => isSelectionMode ? toggleSelection(rev.id) : null}
              className={`glass flex flex-col gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                selectedItems.includes(rev.id) 
                  ? 'border-[#f59e0b] bg-[#f59e0b]/5' 
                  : 'border-app-border bg-app-card hover:border-app-muted/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isSelectionMode && (
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      selectedItems.includes(rev.id) ? 'bg-[#f59e0b] border-[#f59e0b] text-white' : 'border-app-muted'
                    }`}>
                      {selectedItems.includes(rev.id) && <i className="fa-solid fa-check text-xs"></i>}
                    </div>
                  )}
                  <h3 className="font-semibold text-on-surface">{rev.reviewer_name}</h3>
                </div>
                <span className="text-xs text-app-muted">
                  {rev.created_at ? new Date(rev.created_at).toLocaleDateString('tr-TR') : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <i key={star} className={`fa-solid fa-star text-sm ${star <= rev.rating ? 'text-[#f59e0b]' : 'text-gray-600'}`}></i>
                ))}
              </div>
              
              <p className="text-sm text-app-muted leading-relaxed">
                "{rev.content}"
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
