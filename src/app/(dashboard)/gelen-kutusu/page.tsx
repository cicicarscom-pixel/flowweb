"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useDialog } from "@/components/ui/DialogProvider";
import { useLatest } from "@/lib/useLatest";
import { InboxHeader } from './InboxHeader';
import { MessagesTab } from './MessagesTab';
import { CommentsTab } from './CommentsTab';
import { ReviewsTab } from './ReviewsTab';
import { NotificationsTab } from './NotificationsTab';

function GelenKutusuContent() {
  const router = useRouter();
  const t = useTranslations();
  const dialog = useDialog();
  const locale = useLocale();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'mesajlar' | 'yorumlar' | 'degerlendirmeler' | 'bildirimler'>('mesajlar');
  
  useEffect(() => {
    if (tabParam && ['mesajlar', 'yorumlar', 'degerlendirmeler', 'bildirimler'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [dmText, setDmText] = useState("");
  const [isSendingDM, setIsSendingDM] = useState(false);

  
  const [conversations, setConversations] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
     const initOrg = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
           const { data } = await supabase.from('organization_members').select('organization_id').eq('user_id', session.user.id).limit(1);
           if (data?.[0]?.organization_id) {
              setOrganizationId(data[0].organization_id);
           } else {
              setIsLoading(false);
           }
        } else {
           setIsLoading(false);
        }
     };
     initOrg();
  }, [supabase]);

  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());

  useEffect(() => {
     if (!organizationId) return;
     const fetchConnectedPlatforms = async () => {
        const { data } = await supabase
           .schema('integration')
           .from('social_accounts')
           .select('platform')
           .eq('organization_id', organizationId)
           .eq('is_active', true)
           .eq('needs_reconnection', false);
        setConnectedPlatforms(new Set((data || []).map((r: any) => r.platform?.toLowerCase())));
     };
     fetchConnectedPlatforms();
  }, [organizationId, supabase]);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [privateReplyModal, setPrivateReplyModal] = useState<any>(null);
  const [privateReplyText, setPrivateReplyText] = useState("");
  const [isSendingPrivateReply, setIsSendingPrivateReply] = useState(false);

  const visibleComments = React.useMemo(() => {
    return comments.filter(c => {
       if (c.hidden) return false;
       if (c.posts?.status === 'deleted') return false;
       if (connectedPlatforms.size > 0 && !connectedPlatforms.has(c.platform?.toLowerCase())) return false;
       return true;
    });
  }, [comments, connectedPlatforms]);

  const postsWithComments = React.useMemo(() => {
    if (!visibleComments || visibleComments.length === 0) return [];
    
    const postMap = new Map<string, any>();
    
    visibleComments.forEach(comm => {
      const pId = comm.zernio_post_id || comm.post_id || 'unknown';
      if (!postMap.has(pId)) {
        let snippet = comm.posts?.content || t("gelenKutusuPage.comments.postDetailNotFound");
        if (snippet && snippet !== t("gelenKutusuPage.comments.postDetailNotFound")) {
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

    visibleComments.forEach(comm => {
      const pId = comm.zernio_post_id || comm.post_id || 'unknown';
      const postGroup = postMap.get(pId);
      
      const isReply = comm.content?.includes('↳ @Yorum:') || comm.content?.startsWith('↳ @Yorum:');
      const isBusiness = comm.author_name === 'Mağaza (Ben)' || comm.username === 'Mağaza (Ben)' || comm.is_outbound || isReply;
      comm.isBusiness = isBusiness;
      
      if (!isBusiness) {
         comm.replies = [];
         postGroup.parentComments.push(comm);
      }
    });

    visibleComments.forEach(comm => {
      if (comm.isBusiness) {
         const pId = comm.zernio_post_id || comm.post_id || 'unknown';
         const postGroup = postMap.get(pId);
         let foundParent = false;
         
         // 1. Önce doğrudan ID ile eşleştir (en güvenilir yol)
         if (comm.parent_comment_id) {
            const exactParent = postGroup.parentComments.find((p: any) => p.zernio_comment_id === comm.parent_comment_id);
            if (exactParent) {
               // İsme duyarlı prefix'i de temizle (örn: ↳ @İsim:\n )
               comm.displayContent = comm.content.replace(/^↳\s*@[^:]+:\s*\n?/, '').trim();
               exactParent.replies.push(comm);
               foundParent = true;
            }
         }

         // 2. Eğer ID eşleşmesi bulunamazsa (eski kayıtlar), metin aramasına geri dön
         if (!foundParent) {
            for (const parent of postGroup.parentComments) {
               const uName = parent.author_name || parent.username;
               if (uName && comm.content && comm.content.includes(`@${uName}`)) {
                  comm.displayContent = comm.content.replace(/^↳\s*@[^:]+:\s*\n?/, '').trim();
                  parent.replies.push(comm);
                  foundParent = true;
                  break;
               }
            }
         }
         if (!foundParent) {
            comm.displayContent = comm.content?.replace(/^↳\s*@[^:]+:\s*\n?/, '').trim();
            comm.replies = [];
            postGroup.parentComments.push(comm);
         }
      } else {
         comm.displayContent = comm.content;
      }
    });
    
    return Array.from(postMap.values()).sort((a, b) => new Date(b.latestCommentAt).getTime() - new Date(a.latestCommentAt).getTime());
  }, [visibleComments, t]);

  useEffect(() => {
    if (activeTab === 'yorumlar' && postsWithComments.length > 0 && !selectedPostId) {
      setSelectedPostId(postsWithComments[0].postId);
    }
  }, [activeTab, postsWithComments, selectedPostId]);

  // Fetch Data
  
  const handleSendDM = async (conv: any) => {
    if (!conv || !dmText.trim()) return;
    setIsSendingDM(true);
    try {
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: {
          action: 'send-message',
          payload: {
            organizationId,
            conversationId: conv.zernio_conversation_id || conv.id,
            accountId: conv.accountId,
            message: dmText,
            platform: conv.platform
          }
        }
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      
      const newMsg = {
        id: Math.random().toString(),
        conversation_id: conv.id,
        zernio_message_id: 'mock_' + Date.now(),
        content: dmText,
        is_outbound: true,
        created_at: new Date().toISOString(),
      };
      
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, messages: [...(c.messages || []), newMsg] } : c));
      setDmText("");
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSendingDM(false);
    }
  };

  const handleHideComment = async (comment: any) => {
    try {
      setComments(prev => prev.filter(c => c.id !== comment.id));
      await supabase.from('comments').update({ hidden: true }).eq('id', comment.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDMClick = (comment: any) => {
    // ALWAYS open the private reply modal for comments, 
    // because standard DMs (conversations) may fail if the user hasn't messaged in 24 hours.
    setPrivateReplyModal(comment);
    setPrivateReplyText("");
  };

  const handleSendPrivateReply = async () => {
    if (!privateReplyModal || !privateReplyText.trim()) return;
    setIsSendingPrivateReply(true);
    try {
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: {
          action: 'send-private-reply',
          payload: {
            organizationId,
            accountId: privateReplyModal.posts?.accountId || privateReplyModal.accountId,
            postId: privateReplyModal.zernio_post_id,
            commentId: privateReplyModal.zernio_comment_id,
            message: privateReplyText,
            platform: privateReplyModal.platform
          }
        }
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      
      setPrivateReplyModal(null);
      setPrivateReplyText("");
      dialog.alert(t("gelenKutusuPage.privateReply.successAlert"));
    } catch (e: any) {
      console.error(e);
      let errorMsg = e.message;
      try {
        if (typeof errorMsg === 'string' && (errorMsg.includes('already been sent') || errorMsg.includes('Activity already replied to'))) {
          errorMsg = t("gelenKutusuPage.privateReply.alreadyRepliedError");
        } else {
           const parsed = JSON.parse(errorMsg);
           if (parsed.error && typeof parsed.error === 'string' && (parsed.error.includes('already been sent') || parsed.error.includes('Activity already replied to'))) {
               errorMsg = t("gelenKutusuPage.privateReply.alreadyRepliedError");
           }
        }
      } catch {}
      dialog.alert(t("gelenKutusuPage.privateReply.errorAlertPrefix") + errorMsg);
    } finally {
      setIsSendingPrivateReply(false);
    }
  };

  const handleSendReply = async (comment: any) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error(t("gelenKutusuPage.alerts.noSession"));
      
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: { 
          action: 'reply-comment', 
          payload: { 
            organizationId,
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
        
      const returnedCommentId = data?.commentId || data?.data?.commentId || data?.id || data?.data?.id || `mock_${Date.now()}`;
        
      let finalContent = replyText;
      const uName = comment.author_name || comment.username || t("gelenKutusuPage.comments.fallbackReplyAuthor");
      if (!finalContent.includes(`@${uName}`)) {
          finalContent = `@${uName} ${finalContent}`;
      }
      
      const newComment = {
        id: Math.random().toString(),
        post_id: comment.post_id,
        zernio_comment_id: returnedCommentId,
        zernio_post_id: comment.zernio_post_id,
        parent_comment_id: comment.zernio_comment_id,
        content: finalContent,
        username: 'Mağaza (Ben)',
        author_name: 'Mağaza (Ben)',
        platform: comment.platform,
        created_at: new Date().toISOString(),
        is_outbound: true,
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
      if (err.message?.includes('Missing accountId for reply-comment')) {
        dialog.alert(t("gelenKutusuPage.alerts.replyNoAccount", { platform: comment.platform }));
      } else {
        dialog.alert(t("gelenKutusuPage.alerts.replyFailed", { message: err.message }));
      }
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
          messages (*)
        `)
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        const cachedPics = getCachedPictures();
        const enhancedData = data.map(conv => {
          let lastMessageSnippet = t("gelenKutusuPage.messages.tapToSeeLastMessage");
          if (conv.messages && conv.messages.length > 0) {
            const sortedMessages = [...conv.messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            lastMessageSnippet = sortedMessages[0].content;
          }
          return { 
              ...conv, 
              lastMessageSnippet,
              participant_picture: conv.participant_picture || cachedPics[conv.zernio_conversation_id] || cachedPics[conv.id] || null
          };
        });
        setConversations(enhancedData);
      }
    } catch (err) {
      console.warn("Conversations fetch err:", err);
    }
  };

  const getCachedPictures = () => {
    try {
      const cached = localStorage.getItem('zernio_pic_cache_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 3600000) {
          return parsed.data;
        }
      }
    } catch {}
    return {};
  };

  const setCachedPictures = (data: any) => {
    try {
      localStorage.setItem('zernio_pic_cache_v2', JSON.stringify({
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
              author_picture: cachedPics[c.zernio_comment_id] || cachedPics[c.id] || null
          }));
          setComments(enhancedData);
          
          // Faz 1.5'i tetikle
          setTimeout(() => fetchComments(1.5), 500);
        }
      } else if (phase === 1.5) {
        // Faz 1.5: Eksik resimleri Edge Function'dan çek ve önbellekle
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (organizationId || userId) {
           const { data: picData } = await supabase.functions.invoke('zernio-client', {
              body: { action: 'get-inbox-pictures', payload: { organizationId, userId } }
           });
           
           const extractedPics = picData?.data?.pictures || picData?.pictures;
           if (extractedPics && Object.keys(extractedPics).length > 0) {
             const newPics = extractedPics;
             const currentCache = getCachedPictures();
             setCachedPictures({ ...currentCache, ...newPics });
             
             setComments(prev => prev.map(c => ({
                ...c,
                post_picture: c.post_picture || (c.zernio_post_id && newPics['post_' + c.zernio_post_id]) || null,
                author_picture: c.author_picture || newPics[c.zernio_comment_id] || newPics[c.id] || null
             })));
             
             setConversations(prev => prev.map(conv => ({
                ...conv,
                participant_picture: conv.participant_picture || newPics[conv.zernio_conversation_id] || newPics[conv.id] || null
             })));
           }
           // Faz 2'yi tetikle
           setTimeout(() => fetchComments(2), 2000);
        }
      } else if (phase === 2) {
         // Faz 2: Zernio'dan eksik yorumları eşitle (sync-comments)
         if (organizationId) {
            await supabase.functions.invoke('zernio-client', {
              body: { action: 'sync-comments', payload: { organizationId } }
            });
         }
      }
    } catch (err) {
      console.warn("Comments fetch err:", err);
    }
  };


    const [notifError, setNotifError] = useState<string | null>(null);

    const [markingAll, setMarkingAll] = useState(false);
    const markAllAsRead = async () => {
      try {
        setMarkingAll(true);
        setNotifError(null);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;
        
        const unread = notifications.filter(n => !n.is_read);
        if (unread.length === 0) return;

        const normalIds = unread.filter(n => !n.is_broadcast).map(n => n.id);
        const broadcastIds = unread.filter(n => n.is_broadcast).map(n => n.id);

        if (normalIds.length > 0) {
          const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', normalIds);
          if (error) throw error;
        }

        if (broadcastIds.length > 0) {
          const payload = broadcastIds.map(bId => ({ user_id: session.user.id, broadcast_id: bId }));
          const { error } = await supabase.from('broadcast_reads').upsert(payload, { onConflict: 'user_id, broadcast_id' });
          if (error) throw error;
        }

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        window.dispatchEvent(new Event('appointment-notifications-changed'));
      } catch {
        setNotifError(t('gelenKutusuPage.notifications.markAllError'));
      } finally {
        setMarkingAll(false);
      }
    };
    
    const fetchNotifications = async () => {
      try {
        setNotifError(null);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase.from('notifications').select('*');
        if (error) throw error;
        const regularNotifs = data || [];

        const { data: profileData } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).limit(1);
        const userType = profileData?.[0]?.user_type || 'business';

        const { data: broadcasts, error: bError } = await supabase.from('broadcast_notifications').select('*').in('target', ['all', userType]);
        if (bError) throw bError;

        const { data: reads, error: rError } = await supabase.from('broadcast_reads').select('broadcast_id').eq('user_id', session.user.id);
        if (rError) throw rError;
        
        const readSet = new Set(reads?.map(r => r.broadcast_id) || []);
        
        const broadcastNotifs = (broadcasts || []).map(b => ({
           id: b.id,
           is_broadcast: true,
           title: b.title,
           message: b.message,
           created_at: b.created_at,
           is_read: readSet.has(b.id)
        }));
        
        const combined = [...regularNotifs, ...broadcastNotifs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNotifications(combined);
      } catch (err: any) {
        setNotifError(err?.message || JSON.stringify(err));
        setNotifications([]);
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

  const fetchConversationsRef = useLatest(fetchConversations);
  const fetchCommentsRef = useLatest(fetchComments);
  const fetchNotificationsRef = useLatest(fetchNotifications);
  const fetchReviewsRef = useLatest(fetchReviews);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      const promises = [fetchNotificationsRef.current()];
      if (organizationId) {
        promises.push(fetchConversationsRef.current(), fetchCommentsRef.current(1), fetchReviewsRef.current());
      }
      await Promise.all(promises);
      setIsLoading(false);
    };
    loadAll();

    const channels: any[] = [];

    // Realtime Subscriptions (Döngü Korumalı)
    if (organizationId) {
      const convChannel = supabase.channel('web_realtime_conversations')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, () => fetchConversationsRef.current())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, (payload) => {
           setConversations(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
        })
        .subscribe();
      channels.push(convChannel);

      const msgChannel = supabase.channel('web_realtime_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchConversationsRef.current())
        .subscribe();
      channels.push(msgChannel);

      const commentChannel = supabase.channel('web_realtime_comments')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, () => fetchCommentsRef.current(1))
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'comments' }, (payload) => {
           setComments(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'comments' }, (payload) => {
           setComments(prev => prev.filter(c => c.id !== payload.old.id));
        })
        .subscribe();
      channels.push(commentChannel);

      const reviewChannel = supabase.channel('web_realtime_reviews')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, () => fetchReviewsRef.current())
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reviews' }, (payload) => {
           setReviews(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
        })
        .subscribe();
      channels.push(reviewChannel);
    }

    const notifChannel = supabase.channel('web_realtime_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotificationsRef.current())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'broadcast_notifications' }, () => fetchNotificationsRef.current())
      .subscribe();
    channels.push(notifChannel);

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [organizationId, supabase, fetchCommentsRef, fetchConversationsRef, fetchNotificationsRef, fetchReviewsRef]);

  useEffect(() => {
    // Auto-read removed as per requirement
      }, [activeTab, notifications, organizationId]);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if ((await dialog.confirm(t("gelenKutusuPage.messages.confirmDeleteSelected", { count: selectedItems.length }), { danger: true }))) {
      try {
        if (activeTab === 'mesajlar') {
          const uuids = selectedItems.filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
          const zernioIds = selectedItems.filter(id => !uuids.includes(id));
          if (uuids.length > 0) {
            await supabase.from('conversations').delete().in('id', uuids);
            await supabase.from('ai_communication_logs').delete().in('sender_id', uuids);
          }
          if (zernioIds.length > 0) {
            await supabase.from('conversations').delete().in('zernio_conversation_id', zernioIds);
            await supabase.from('ai_communication_logs').delete().in('sender_id', zernioIds);
          }
          setConversations(prev => prev.filter(c => !uuids.includes(c.id) && !zernioIds.includes(c.zernio_conversation_id)));
        } else if (activeTab === 'yorumlar') {
          const uuids = selectedItems.filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
          const zernioIds = selectedItems.filter(id => !uuids.includes(id));
          if (uuids.length > 0) await supabase.from('comments').delete().in('id', uuids);
          if (zernioIds.length > 0) {
            await supabase.from('comments').delete().in('zernio_comment_id', zernioIds);
            // İşletme kimliği (org_id) veritabanında DEFAULT current_org_id() ile çözülür; istemci göndermez.
            await supabase.from('ai_communication_logs').insert(
              zernioIds.map(id => ({
                platform: 'zernio_deleted_comment',
                sender_id: id,
                user_message: '[DELETED]'
              }))
            );
          }
          setComments(prev => prev.filter(c => !uuids.includes(c.id) && !zernioIds.includes(c.zernio_comment_id)));
        } else if (activeTab === 'degerlendirmeler') {
           await supabase.from('reviews').delete().in('id', selectedItems);
           setReviews(prev => prev.filter(r => !selectedItems.includes(r.id)));
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
      case 'instagram': return <i className="fa-brands fa-instagram text-[#E8A8CD]"></i>;
      case 'facebook': return <i className="fa-brands fa-facebook text-[#FF7A59]"></i>;
      case 'whatsapp': return <i className="fa-brands fa-whatsapp text-[#25D366]"></i>;
      case 'youtube': return <i className="fa-brands fa-youtube text-[#ff0000]"></i>;
      case 'linkedin': return <i className="fa-brands fa-linkedin text-[#0077b5]"></i>;
      case 'tiktok': return <i className="fa-brands fa-tiktok text-[#69C9D0]"></i>;
      default: return <i className="fa-solid fa-message text-gray-400"></i>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 lg:p-8">
      {/* Tabs & Action Buttons */}
      <InboxHeader activeTab={activeTab} conversations={conversations} handleDeleteSelected={handleDeleteSelected} handleSelectAll={handleSelectAll} isSelectionMode={isSelectionMode} notifications={notifications} reviews={reviews} router={router} selectedItems={selectedItems} setIsSelectionMode={setIsSelectionMode} setSelectedItems={setSelectedItems} t={t} visibleComments={visibleComments} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-3 custom-scrollbar">
        
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59]"></div>
          </div>
        ) : activeTab === 'mesajlar' && conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-comments text-4xl mb-4 text-[#A79E96]"></i>
            <p className="text-[#A79E96] text-sm">{t("gelenKutusuPage.messages.empty")}</p>
          </div>
        ) : activeTab === 'yorumlar' && visibleComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-comment text-4xl mb-4 text-[#A79E96]"></i>
            <p className="text-[#A79E96] text-sm">{t("gelenKutusuPage.comments.empty")}</p>
          </div>
        ) : activeTab === 'degerlendirmeler' && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-60">
            <i className="fa-regular fa-star text-4xl mb-4 text-[#A79E96]"></i>
            <p className="text-[#A79E96] text-sm">{t("gelenKutusuPage.reviews.empty")}</p>
          </div>
        ) : null}

        
        {/* --- MESAJLAR TAB --- */}
        <MessagesTab activeTab={activeTab} conversations={conversations} dmText={dmText} getPlatformIcon={getPlatformIcon} handleSendDM={handleSendDM} isLoading={isLoading} isSelectionMode={isSelectionMode} isSendingDM={isSendingDM} locale={locale} selectedConvId={selectedConvId} selectedItems={selectedItems} setDmText={setDmText} setSelectedConvId={setSelectedConvId} t={t} toggleSelection={toggleSelection} />
        

        {/* --- YORUMLAR TAB --- */}
        <CommentsTab activeTab={activeTab} getPlatformIcon={getPlatformIcon} handleDMClick={handleDMClick} handleHideComment={handleHideComment} handleSendReply={handleSendReply} isLoading={isLoading} isSelectionMode={isSelectionMode} isSendingReply={isSendingReply} locale={locale} postsWithComments={postsWithComments} replyText={replyText} replyingTo={replyingTo} selectedItems={selectedItems} selectedPostId={selectedPostId} setReplyText={setReplyText} setReplyingTo={setReplyingTo} setSelectedPostId={setSelectedPostId} t={t} toggleSelection={toggleSelection} />

        {/* --- DEĞERLENDİRMELER TAB --- */}
        <ReviewsTab activeTab={activeTab} isLoading={isLoading} isSelectionMode={isSelectionMode} locale={locale} reviews={reviews} selectedItems={selectedItems} toggleSelection={toggleSelection} />

        {/* --- BILDIRIMLER TAB --- */}
        {activeTab === 'bildirimler' && notifications.some(n => !n.is_read) && (
          <div className="flex justify-end mb-4">
            <button 
              onClick={markAllAsRead}
              disabled={markingAll}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ color: "#FF7A59", border: "1px solid rgba(255,122,89,0.25)", background: "rgba(255,122,89,0.1)", opacity: markingAll ? 0.5 : 1 }}
            >
              {t('gelenKutusuPage.notifications.markAllRead')}
            </button>
          </div>
        )}
          {notifError && activeTab === 'bildirimler' && <div className="p-4 mb-4 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">{notifError}</div>}
        <NotificationsTab activeTab={activeTab} isLoading={isLoading} locale={locale} notifications={notifications} router={router} setNotifications={setNotifications} supabase={supabase} t={t} />

        {privateReplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1c1b1d] rounded-2xl w-[90%] max-w-md p-6 border border-white/10 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">{t("gelenKutusuPage.privateReply.title")}</h3>
              <p className="text-sm text-dark-muted mb-4">
                {t("gelenKutusuPage.privateReply.description", { name: privateReplyModal.author_name || privateReplyModal.username })}
              </p>
              <textarea
                value={privateReplyText}
                onChange={(e) => setPrivateReplyText(e.target.value)}
                className="w-full h-24 bg-[#131315] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#C2478D] resize-none mb-4 custom-scrollbar"
                placeholder={t("gelenKutusuPage.privateReply.placeholder")}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPrivateReplyModal(null)}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {t("gelenKutusuPage.actions.cancel")}
                </button>
                <button
                  onClick={handleSendPrivateReply}
                  disabled={isSendingPrivateReply || !privateReplyText.trim()}
                  className="px-4 py-2 rounded-lg font-medium text-sm bg-[#C2478D] text-white hover:bg-[#a10ce0] disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSendingPrivateReply ? <i className="fa-solid fa-spinner fa-spin"></i> : null}
                  {t("gelenKutusuPage.actions.send")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}








export default function GelenKutusuPage() {
  return (
    <Suspense fallback={null}>
      <GelenKutusuContent />
    </Suspense>
  );
}
