"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GelenKutusuPage() {
  const [activeTab, setActiveTab] = useState<'mesajlar' | 'yorumlar' | 'degerlendirmeler'>('mesajlar');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const postsWithComments = React.useMemo(() => {
    if (!comments || comments.length === 0) return [];
    
    const postMap = new Map<string, any>();
    
    comments.filter(c => !c.hidden).forEach(comm => {
      const pId = comm.zernio_post_id || comm.post_id || 'unknown';
      if (!postMap.has(pId)) {
        let snippet = comm.posts?.content || 'Gönderi detayı bulunamadı.';
        if (snippet && snippet !== 'Gönderi detayı bulunamadı.') {
           const sentences = snippet.match(/[^.!?]+[.!?]+/g);
           if (sentences && sentences.length > 0) {
               snippet = sentences.slice(0, 3).join('').trim();
           } else {
               snippet = snippet.slice(0, 100) + '...';
           }
        }

        postMap.set(pId, {
          postId: pId,
          postPicture: comm.post_picture,
          platform: comm.platform,
          postContentSnippet: snippet,
          latestCommentAt: comm.created_at || new Date().toISOString(),
          parentComments: []
        });
      }
      
      const postGroup = postMap.get(pId);
      if (comm.created_at && new Date(comm.created_at).getTime() > new Date(postGroup.latestCommentAt).getTime()) {
        postGroup.latestCommentAt = comm.created_at;
      }
    });

    comments.filter(c => !c.hidden).forEach(comm => {
      const pId = comm.zernio_post_id || comm.post_id || 'unknown';
      const postGroup = postMap.get(pId);
      const isBusiness = comm.author_name === 'Mağaza (Ben)' || comm.username === 'Mağaza (Ben)' || comm.is_outbound;
      comm.isBusiness = isBusiness;
      
      if (!isBusiness) {
         comm.replies = [];
         postGroup.parentComments.push(comm);
      }
    });

    comments.filter(c => !c.hidden).forEach(comm => {
      if (comm.isBusiness) {
         const pId = comm.zernio_post_id || comm.post_id || 'unknown';
         const postGroup = postMap.get(pId);
         let foundParent = false;
         for (const parent of postGroup.parentComments) {
            const uName = parent.author_name || parent.username;
            if (uName && comm.content && comm.content.includes(`@${uName}`)) {
               parent.replies.push(comm);
               foundParent = true;
               break;
            }
         }
         if (!foundParent) {
            comm.replies = [];
            postGroup.parentComments.push(comm);
         }
      }
    });
    
    return Array.from(postMap.values()).sort((a, b) => new Date(b.latestCommentAt).getTime() - new Date(a.latestCommentAt).getTime());
  }, [comments]);

  useEffect(() => {
    if (activeTab === 'yorumlar' && postsWithComments.length > 0 && !selectedPostId) {
      setSelectedPostId(postsWithComments[0].postId);
    }
  }, [activeTab, postsWithComments, selectedPostId]);

  const supabase = createClient();

  // Fetch Data
  const handleHideComment = async (comment: any) => {
    try {
      setComments(prev => prev.filter(c => c.id !== comment.id));
      await supabase.from('comments').update({ hidden: true }).eq('id', comment.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDMClick = (username: string) => {
    const conv = conversations.find(c => c.participant_name?.toLowerCase() === username?.toLowerCase());
    if (conv) {
      setActiveTab('mesajlar');
    } else {
      alert("Bu kullanıcı ile aktif bir DM geçmişi bulunamadı. (Sadece size mesaj atanlara DM gönderebilirsiniz).");
    }
  };

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

      setReplyingTo(null);
      setReplyText("");
    } catch (err: any) {
      console.error(err);
      // alert("Yanıt gönderilemedi: " + err.message);
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
        {!isLoading && activeTab === 'yorumlar' && postsWithComments.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6 h-[600px] w-full">
            {/* Left Pane - Posts List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
              {postsWithComments.map(postGroup => {
                const isSelected = selectedPostId === postGroup.postId;
                return (
                  <div
                    key={postGroup.postId}
                    onClick={() => setSelectedPostId(postGroup.postId)}
                    className={`glass flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected ? 'border-[#bc13fe] bg-[#bc13fe]/10' : 'border-app-border bg-app-card hover:border-app-muted/40'
                    }`}
                  >
                    <div className="relative">
                      {postGroup.postPicture ? (
                        <img src={postGroup.postPicture} alt="Post" className="w-12 h-12 object-cover rounded-lg border border-white/5 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center flex-shrink-0">
                          <i className="fa-regular fa-image text-app-muted"></i>
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#131315] rounded-full flex items-center justify-center border border-white/10 text-[10px]">
                        {getPlatformIcon(postGroup.platform)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-on-surface line-clamp-3">
                        {postGroup.postContentSnippet}
                      </div>
                      <div className="text-xs text-app-muted mt-1">
                        Son: {postGroup.latestCommentAt ? new Date(postGroup.latestCommentAt).toLocaleDateString('tr-TR') : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Pane - Thread & Reply */}
            <div className="w-full lg:w-2/3 flex flex-col glass rounded-xl border border-app-border h-full overflow-hidden relative">
              {/* Thread */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                {postsWithComments.find(p => p.postId === selectedPostId)?.parentComments
                  .slice()
                  .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // newest first
                  .map((parent: any) => {
                    const parentId = parent.zernio_comment_id || parent.id;
                    const uName = parent.author_name || parent.username;
                    return (
                      <div key={parent.id} className="glass rounded-xl border border-app-border p-4 flex flex-col gap-3">
                        {/* Parent Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {isSelectionMode && (
                              <div 
                                onClick={() => toggleSelection(parentId)}
                                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer mr-2 ${
                                  selectedItems.includes(parentId) ? 'bg-[#bc13fe] border-[#bc13fe] text-white' : 'border-app-muted'
                                }`}>
                                {selectedItems.includes(parentId) && <i className="fa-solid fa-check text-xs"></i>}
                              </div>
                            )}
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {parent.author_picture ? (
                                <img src={parent.author_picture} alt={uName} className="w-full h-full object-cover" />
                              ) : (
                                <i className="fa-solid fa-user text-app-muted"></i>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface text-sm">@{uName}</span>
                              <span className="text-[10px] text-app-muted">{new Date(parent.created_at).toLocaleString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-sm text-[#e5e2e3]">
                          {parent.content}
                        </div>

                        {/* Actions */}
                        {!isSelectionMode && (
                          <div className="flex items-center gap-4 text-xs font-medium mt-1">
                            <button 
                              className="text-app-muted hover:text-white transition-colors flex items-center gap-1.5"
                              onClick={() => {
                                setReplyingTo(parentId);
                                setReplyText(`@${uName} `);
                              }}
                            >
                              <i className="fa-solid fa-reply"></i> Yanıtla
                            </button>
                            <button className="text-app-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleDMClick(uName)}>
                              <i className="fa-solid fa-paper-plane"></i> DM
                            </button>
                            <button className="text-app-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(parent)}>
                              <i className="fa-solid fa-eye-slash"></i> Gizle
                            </button>
                          </div>
                        )}

                        {/* Replies */}
                        {parent.replies && parent.replies.length > 0 && (
                          <div className="mt-2 pl-4 border-l-2 border-app-border flex flex-col gap-3">
                            {parent.replies.map((reply: any) => {
                              const replyId = reply.zernio_comment_id || reply.id;
                              return (
                                <div key={reply.id} className="flex flex-col gap-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                      {isSelectionMode && (
                                        <div 
                                          onClick={() => toggleSelection(replyId)}
                                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors cursor-pointer mr-2 ${
                                            selectedItems.includes(replyId) ? 'bg-[#bc13fe] border-[#bc13fe] text-white' : 'border-app-muted'
                                          }`}>
                                          {selectedItems.includes(replyId) && <i className="fa-solid fa-check text-[10px]"></i>}
                                        </div>
                                      )}
                                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {reply.author_picture ? (
                                          <img src={reply.author_picture} alt="Mağaza" className="w-full h-full object-cover" />
                                        ) : (
                                          <i className="fa-solid fa-store text-[10px] text-app-muted"></i>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-on-surface text-sm">Mağaza</span>
                                        <span className="text-[9px] font-bold bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 rounded">Sen</span>
                                      </div>
                                      <span className="text-[10px] text-app-muted">{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-sm text-[#e5e2e3]">
                                    {reply.content}
                                  </div>
                                  
                                  {!isSelectionMode && (
                                    <div className="flex items-center gap-4 text-[11px] font-medium mt-0.5">
                                      <button 
                                        className="text-app-muted hover:text-white transition-colors flex items-center gap-1.5"
                                        onClick={() => {
                                          setReplyingTo(parentId);
                                          setReplyText(`@${uName} `);
                                        }}
                                      >
                                        <i className="fa-solid fa-reply"></i> Yanıtla
                                      </button>
                                      <button className="text-app-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(reply)}>
                                        <i className="fa-solid fa-eye-slash"></i> Gizle
                                      </button>
                                      <button className="text-app-muted hover:text-red-400 transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(reply)}>
                                        <i className="fa-solid fa-trash-can"></i> Sil
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Inline Reply Input */}
                        {replyingTo === parentId && (
                          <div className="mt-2 flex gap-2">
                            <input 
                              type="text" 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(parent);
                              }}
                              autoFocus
                              placeholder="Yanıtlama için yazın..." 
                              className="flex-1 bg-[#131314] rounded-lg px-3 py-2 text-sm text-[#e5e2e3] border border-white/10 focus:border-[#bc13fe] focus:outline-none"
                            />
                            <button 
                              onClick={() => handleSendReply(parent)}
                              disabled={isSendingReply || !replyText.trim()}
                              className="px-4 py-2 bg-[#bc13fe] hover:bg-[#a10ce0] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                              {isSendingReply ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>

            </div>
          </div>
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
