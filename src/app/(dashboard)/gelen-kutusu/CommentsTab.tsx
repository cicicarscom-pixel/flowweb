import React from 'react';
import { useTranslations } from 'next-intl';

type CommentsTabProps = {
  activeTab: "mesajlar" | "yorumlar" | "degerlendirmeler" | "bildirimler";
  getPlatformIcon: (platform: string) => React.JSX.Element;
  handleDMClick: (comment: any) => void;
  handleHideComment: (comment: any) => Promise<void>;
  handleSendReply: (comment: any) => Promise<void>;
  isLoading: boolean;
  isSelectionMode: boolean;
  isSendingReply: boolean;
  locale: string;
  postsWithComments: any[];
  replyText: string;
  replyingTo: string | null;
  selectedItems: string[];
  selectedPostId: string | null;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string | null>>;
  t: ReturnType<typeof useTranslations>;
  toggleSelection: (id: string) => void;
};

export function CommentsTab({ activeTab, getPlatformIcon, handleDMClick, handleHideComment, handleSendReply, isLoading, isSelectionMode, isSendingReply, locale, postsWithComments, replyText, replyingTo, selectedItems, selectedPostId, setReplyText, setReplyingTo, setSelectedPostId, t, toggleSelection }: CommentsTabProps) {
  return (
    !isLoading && activeTab === 'yorumlar' && postsWithComments.length > 0 && (
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
                  isSelected ? 'border-[#C2478D] bg-[#C2478D]/10' : 'border-dark-border bg-dark-card hover:border-dark-muted/40'
                }`}
              >
                <div className="relative">
                  {postGroup.postPicture ? (
                    postGroup.postPicture.match(/\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i) || postGroup.postPicture.includes('blob') ? (
                      <>
                        <video src={postGroup.postPicture} className="w-12 h-12 object-cover rounded-lg border border-white/5 flex-shrink-0" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <i className="fa-solid fa-play text-white/70 text-[10px]"></i>
                        </div>
                      </>
                    ) : (
                      <img src={postGroup.postPicture} alt="Post" className="w-12 h-12 object-cover rounded-lg border border-white/5 flex-shrink-0" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<i class="fa-regular fa-image text-dark-muted"></i>';
                        e.currentTarget.parentElement!.className = "w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center flex-shrink-0";
                      }} />
                    )
                  ) : (
                    <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center flex-shrink-0">
                      <i className="fa-regular fa-image text-dark-muted"></i>
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
                  <div className="text-xs text-dark-muted mt-1">
                    {t("gelenKutusuPage.comments.latestLabel")}: {postGroup.latestCommentAt ? new Date(postGroup.latestCommentAt).toLocaleDateString(locale) : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    
        {/* Right Pane - Thread & Reply */}
        <div className="w-full lg:w-2/3 flex flex-col glass rounded-xl border border-dark-border h-full overflow-hidden relative bg-[#17151A]">
          
          {/* Post Header */}
          {selectedPostId && (
            <div className="p-4 border-b border-dark-border flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0 relative">
                {postsWithComments.find(p => p.postId === selectedPostId)?.postPicture ? (
                  postsWithComments.find(p => p.postId === selectedPostId)!.postPicture!.match(/\.(mp4|webm|ogg|mov|blob)(\?.*)?$/i) || postsWithComments.find(p => p.postId === selectedPostId)!.postPicture!.includes('blob') ? (
                    <>
                      <video src={postsWithComments.find(p => p.postId === selectedPostId)?.postPicture} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <i className="fa-solid fa-play text-white/70 text-[10px]"></i>
                      </div>
                    </>
                  ) : (
                    <img alt="" src={postsWithComments.find(p => p.postId === selectedPostId)?.postPicture} className="w-full h-full object-cover" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<i class="fa-regular fa-image text-dark-muted"></i>';
                    }} />
                  )
                ) : (
                  <i className="fa-regular fa-image text-dark-muted"></i>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {postsWithComments.find(p => p.postId === selectedPostId)?.postContentSnippet}
                </p>
                <p className="text-xs text-dark-muted flex items-center gap-1 mt-0.5">
                  {getPlatformIcon(postsWithComments.find(p => p.postId === selectedPostId)?.platform)}
                  <span className="capitalize">{postsWithComments.find(p => p.postId === selectedPostId)?.platform || "Bilinmeyen"} Gönderisi</span>
                </p>
              </div>
            </div>
          )}
    
          {/* Thread */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            {postsWithComments.find(p => p.postId === selectedPostId)?.parentComments
              .slice()
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // newest first
              .map((parent: any) => {
                const parentId = parent.zernio_comment_id || parent.id;
                const uName = parent.author_name || parent.username || t("gelenKutusuPage.comments.fallbackUsername");
                return (
                  <div key={parent.id} className="glass rounded-xl border border-dark-border p-4 mb-2 flex flex-col gap-3">
                    {/* Parent Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {isSelectionMode && (
                          <div 
                            onClick={() => toggleSelection(parentId)}
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer mr-2 ${
                              selectedItems.includes(parentId) ? 'bg-[#C2478D] border-[#C2478D] text-white' : 'border-dark-muted'
                            }`}>
                            {selectedItems.includes(parentId) && <i className="fa-solid fa-check text-xs"></i>}
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {parent.author_picture ? (
                            <img src={parent.author_picture} alt={uName} className="w-full h-full object-cover" onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(uName)}&background=random`;
                            }} />
                          ) : (
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(uName)}&background=random`} alt={uName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-on-surface text-sm">@{uName}</span>
                            <span className="text-xs" title={parent.platform}>{getPlatformIcon(parent.platform)}</span>
                          </div>
                          <span className="text-[10px] text-dark-muted">{new Date(parent.created_at).toLocaleString(locale)}</span>
                        </div>
                      </div>
                    </div>
    
                    {/* Content */}
                    <div className="text-sm text-[#F6F1EC]">
                      {parent.displayContent}
                    </div>
    
                    {/* Actions */}
                    {!isSelectionMode && (
                      <div className="flex items-center gap-4 text-xs font-medium mt-1">
                        <button 
                          className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5"
                          onClick={() => {
                            setReplyingTo(parentId);
                            setReplyText(`@${uName} `);
                          }}
                        >
                          <i className="fa-solid fa-reply"></i> {t("gelenKutusuPage.actions.reply")}
                        </button>
                        {['facebook', 'instagram'].includes(String(parent.platform || postsWithComments.find(p => p.postId === selectedPostId)?.platform).toLowerCase()) && (
                          <button className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleDMClick(parent)}>
                            <i className="fa-solid fa-paper-plane"></i> DM
                          </button>
                        )}
                        <button className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(parent)}>
                          <i className="fa-solid fa-eye-slash"></i> {t("gelenKutusuPage.actions.hide")}
                        </button>
                      </div>
                    )}
    
                    {/* Replies */}
                    {parent.replies && parent.replies.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-dark-border flex flex-col gap-3">
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
                                        selectedItems.includes(replyId) ? 'bg-[#C2478D] border-[#C2478D] text-white' : 'border-dark-muted'
                                      }`}>
                                      {selectedItems.includes(replyId) && <i className="fa-solid fa-check text-[10px]"></i>}
                                    </div>
                                  )}
                                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {reply.author_picture ? (
                                      <img src={reply.author_picture} alt={t("gelenKutusuPage.comments.storeLabel")} className="w-full h-full object-cover" onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<i class="fa-solid fa-store text-[10px] text-dark-muted"></i>';
                                      }} />
                                    ) : (
                                      <i className="fa-solid fa-store text-[10px] text-dark-muted"></i>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold text-on-surface text-sm">{t("gelenKutusuPage.comments.storeLabel")}</span>
                                      <span className="text-xs" title={reply.platform}>{getPlatformIcon(reply.platform)}</span>
                                    </div>
                                    <span className="text-[9px] font-bold bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 rounded">{t("gelenKutusuPage.comments.youBadge")}</span>
                                  </div>
                                  <span className="text-[10px] text-dark-muted">{new Date(reply.created_at).toLocaleString(locale)}</span>
                                </div>
                              </div>
                              
                              <div className="text-sm text-[#F6F1EC]">
                                {reply.displayContent}
                              </div>
                              
                              {!isSelectionMode && (
                                <div className="flex items-center gap-4 text-[11px] font-medium mt-0.5">
                                  <button 
                                    className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5"
                                    onClick={() => {
                                      setReplyingTo(parentId);
                                      setReplyText(`@${uName} `);
                                    }}
                                  >
                                    <i className="fa-solid fa-reply"></i> {t("gelenKutusuPage.actions.reply")}
                                  </button>
                                  <button className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(reply)}>
                                    <i className="fa-solid fa-eye-slash"></i> {t("gelenKutusuPage.actions.hide")}
                                  </button>
                                  <button className="text-dark-muted hover:text-red-400 transition-colors flex items-center gap-1.5" onClick={() => handleHideComment(reply)}>
                                    <i className="fa-solid fa-trash-can"></i> {t("gelenKutusuPage.actions.delete")}
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
                          placeholder={t("gelenKutusuPage.comments.replyPlaceholder")}
                          className="flex-1 bg-[#131314] rounded-lg px-3 py-2 text-sm text-[#F6F1EC] border border-white/10 focus:border-[#C2478D] focus:outline-none"
                        />
                        <button 
                          onClick={() => handleSendReply(parent)}
                          disabled={isSendingReply || !replyText.trim()}
                          className="px-4 py-2 bg-[#C2478D] hover:bg-[#a10ce0] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
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
    )
  );
}
