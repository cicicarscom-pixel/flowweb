import React from 'react';
import { useTranslations } from 'next-intl';

type MessagesTabProps = {
  activeTab: "mesajlar" | "yorumlar" | "degerlendirmeler" | "bildirimler";
  conversations: any[];
  dmText: string;
  getPlatformIcon: (platform: string) => React.JSX.Element;
  handleSendDM: (conv: any) => Promise<void>;
  isLoading: boolean;
  isSelectionMode: boolean;
  isSendingDM: boolean;
  locale: string;
  selectedConvId: string | null;
  selectedItems: string[];
  setDmText: React.Dispatch<React.SetStateAction<string>>;
  setSelectedConvId: React.Dispatch<React.SetStateAction<string | null>>;
  t: ReturnType<typeof useTranslations>;
  toggleSelection: (id: string) => void;
};

export function MessagesTab({ activeTab, conversations, dmText, getPlatformIcon, handleSendDM, isLoading, isSelectionMode, isSendingDM, locale, selectedConvId, selectedItems, setDmText, setSelectedConvId, t, toggleSelection }: MessagesTabProps) {
  return (
    !isLoading && activeTab === 'mesajlar' && conversations.length > 0 && (
      <div className="flex flex-col lg:flex-row gap-6 h-[600px] w-full">
        {/* Left Pane - Conversations List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 h-full">
          {conversations.map(conv => {
            const selectId = conv.zernio_conversation_id || conv.id;
            const isSelected = selectedConvId === conv.id;
            return (
              <div 
                key={conv.id}
                onClick={() => isSelectionMode ? toggleSelection(selectId) : setSelectedConvId(conv.id)}
                className={`glass flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected ? 'border-[#FF7A59] bg-[#FF7A59]/10' : 'border-dark-border bg-dark-card hover:border-dark-muted/40'
                }`}
              >
                {isSelectionMode && (
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    selectedItems.includes(selectId) ? 'bg-[#FF7A59] border-[#FF7A59] text-black' : 'border-dark-muted'
                  }`}>
                    {selectedItems.includes(selectId) && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                )}
                
                <div className="relative w-12 h-12 flex-shrink-0">
                  <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center overflow-hidden">
                    {conv.participant_picture ? (
                      <img alt="" src={conv.participant_picture} className="w-full h-full object-cover" onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.participant_name || 'U')}&background=random`;
                      }} />
                    ) : (
                      <img alt="" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conv.participant_name || 'U')}&background=random`} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-xs">
                    {getPlatformIcon(conv.platform)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-on-surface truncate pr-2">{conv.participant_name}</h3>
                    <span className="text-xs text-dark-muted flex-shrink-0">
                      {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString(locale, { hour: '2-digit', minute:'2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-[#FF7A59] font-medium' : 'text-dark-muted'}`}>
                    {conv.lastMessageSnippet}
                  </p>
                </div>
    
                {!isSelectionMode && (
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {conv.unread_count > 0 ? (
                      <div className="bg-[#FF7A59] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </div>
                    ) : (
                      <div className="w-5 h-5"></div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
    
        {/* Right Pane - Chat View */}
        <div className="w-full lg:w-2/3 flex flex-col glass rounded-xl border border-dark-border h-full overflow-hidden relative bg-[#17151A]">
           {selectedConvId ? (
             <>
               {/* Chat Header */}
               <div className="p-4 border-b border-dark-border flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {conversations.find(c => c.id === selectedConvId)?.participant_picture ? (
                       <img alt="" src={conversations.find(c => c.id === selectedConvId)?.participant_picture} className="w-full h-full object-cover" onError={(e) => {
                         e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversations.find(c => c.id === selectedConvId)?.participant_name || 'U')}&background=random`;
                       }} />
                    ) : (
                       <img alt="" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversations.find(c => c.id === selectedConvId)?.participant_name || 'U')}&background=random`} className="w-full h-full object-cover" />
                    )}
                 </div>
                 <span className="font-bold text-on-surface">
                   {conversations.find(c => c.id === selectedConvId)?.participant_name}
                 </span>
               </div>
               {/* Chat Messages */}
               <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse gap-4 custom-scrollbar">
                 {conversations.find(c => c.id === selectedConvId)?.messages
                   ?.slice()
                   .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                   .map((msg: any) => {
                     const isOutbound = msg.is_outbound || msg.direction === 'outgoing';
                     return (
                     <div key={msg.id} className={`flex max-w-[75%] ${isOutbound ? 'self-end' : 'self-start'} gap-2 items-end`}>
                       {!isOutbound && (
                         <div className="w-7 h-7 rounded-full bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center mb-1 border border-white/10">
                            {conversations.find(c => c.id === selectedConvId)?.participant_picture ? (
                              <img alt="" src={conversations.find(c => c.id === selectedConvId)?.participant_picture} className="w-full h-full object-cover" onError={(e) => {
                         e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversations.find(c => c.id === selectedConvId)?.participant_name || 'U')}&background=random`;
                       }} />
                            ) : (
                              <img alt="" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversations.find(c => c.id === selectedConvId)?.participant_name || 'U')}&background=random`} className="w-full h-full object-cover" />
                            )}
                         </div>
                       )}
                       <div className={`p-3 rounded-2xl text-sm ${isOutbound ? 'bg-[#3797F0] text-white rounded-br-sm' : 'bg-[#262626] text-white rounded-bl-sm'}`}>
                         {msg.content}
                         <div className={`text-[10px] mt-1 ${isOutbound ? 'text-blue-200/70 text-right' : 'text-gray-400'}`}>
                           {new Date(msg.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute:'2-digit' })}
                         </div>
                       </div>
                     </div>
                   )})}
               </div>
               {/* Chat Input */}
               <div className="p-3 border-t border-dark-border flex items-center gap-2 bg-[#131315]/80">
                  <input 
                    type="text" 
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendDM(conversations.find(c => c.id === selectedConvId));
                    }}
                    placeholder={t("gelenKutusuPage.messages.inputPlaceholder")}
                    className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A59] border border-transparent"
                  />
                  <button 
                    onClick={() => handleSendDM(conversations.find(c => c.id === selectedConvId))}
                    disabled={isSendingDM || !dmText.trim()}
                    className="px-5 py-3 rounded-xl bg-[#FF7A59] text-black font-semibold flex items-center justify-center disabled:opacity-50 hover:bg-[#00c0cc] transition-colors"
                  >
                    {isSendingDM ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                  </button>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-dark-muted opacity-60">
                <i className="fa-regular fa-comments text-4xl mb-4"></i>
                <p>{t("gelenKutusuPage.messages.selectConversationPrompt")}</p>
             </div>
           )}
        </div>
      </div>
    )
  );
}
