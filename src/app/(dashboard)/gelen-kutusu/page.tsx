"use client";

import React, { useState } from 'react';

// --- DUMMY DATA ---
const DUMMY_CONVERSATIONS = [
  {
    id: "conv-1",
    participant_name: "Ahmet Yılmaz",
    platform: "instagram",
    lastMessageSnippet: "Fiyat bilgisi alabilir miyim?",
    updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread_count: 2,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
  },
  {
    id: "conv-2",
    participant_name: "Ayşe Demir",
    platform: "facebook",
    lastMessageSnippet: "Randevumu iptal etmek istiyorum.",
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread_count: 0,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: "conv-3",
    participant_name: "Can Kaya",
    platform: "whatsapp",
    lastMessageSnippet: "Konum atar mısınız?",
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread_count: 1,
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop"
  }
];

const DUMMY_COMMENTS = [
  {
    id: "comm-1",
    username: "mehmet_can",
    platform: "instagram",
    content: "Harika görünüyor! Ellerinize sağlık.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    post_image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=100&h=100&fit=crop"
  },
  {
    id: "comm-2",
    username: "zeynep.beauty",
    platform: "facebook",
    content: "Kullandığınız ürünlerin markası nedir?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    post_image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=100&h=100&fit=crop"
  }
];

const DUMMY_REVIEWS = [
  {
    id: "rev-1",
    reviewer_name: "Selin Şahin",
    rating: 5,
    content: "Çok memnun kaldım, herkese tavsiye ederim. İlgi ve alaka süperdi.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "rev-2",
    reviewer_name: "Burak Yılmaz",
    rating: 4,
    content: "Genel olarak iyiydi fakat biraz beklemek zorunda kaldım.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  }
];

export default function GelenKutusuPage() {
  const [activeTab, setActiveTab] = useState<'mesajlar' | 'yorumlar' | 'degerlendirmeler'>('mesajlar');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Seçilen ${selectedItems.length} öğeyi silmek istediğinize emin misiniz?`)) {
      // Dummy silme işlemi
      setIsSelectionMode(false);
      setSelectedItems([]);
      alert("Seçilen öğeler silindi (Simülasyon).");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <i className="fa-brands fa-instagram text-[#ebb2ff]"></i>;
      case 'facebook': return <i className="fa-brands fa-facebook text-[#00f0ff]"></i>;
      case 'whatsapp': return <i className="fa-brands fa-whatsapp text-[#25D366]"></i>;
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
          { id: 'mesajlar', label: 'Mesajlar', icon: 'fa-regular fa-comment-dots', color: '#00f0ff' },
          { id: 'yorumlar', label: 'Yorumlar', icon: 'fa-regular fa-comment', color: '#bc13fe' },
          { id: 'degerlendirmeler', label: 'Değerlendirmeler', icon: 'fa-regular fa-star', color: '#f59e0b' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsSelectionMode(false); setSelectedItems([]); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-app-card text-on-surface border-t border-l border-r border-app-border relative after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-app-bg' 
                  : 'text-app-muted hover:text-on-surface hover:bg-white/5'
              }`}
              style={isActive ? { borderTopColor: tab.color } : {}}
            >
              <i className={`${tab.icon}`} style={{ color: isActive ? tab.color : 'inherit' }}></i>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-3">
        
        {/* --- MESAJLAR TAB --- */}
        {activeTab === 'mesajlar' && (
          DUMMY_CONVERSATIONS.map(conv => (
            <div 
              key={conv.id}
              onClick={() => isSelectionMode ? toggleSelection(conv.id) : null}
              className={`glass flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                selectedItems.includes(conv.id) 
                  ? 'border-[#00f0ff] bg-[#00f0ff]/5' 
                  : 'border-app-border bg-app-card hover:border-app-muted/40'
              }`}
            >
              {isSelectionMode && (
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  selectedItems.includes(conv.id) ? 'bg-[#00f0ff] border-[#00f0ff] text-black' : 'border-app-muted'
                }`}>
                  {selectedItems.includes(conv.id) && <i className="fa-solid fa-check text-xs"></i>}
                </div>
              )}
              
              <div className="relative w-12 h-12 flex-shrink-0">
                <img src={conv.avatar} alt={conv.participant_name} className="w-full h-full object-cover rounded-full border border-white/10" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-app-bg border border-app-border flex items-center justify-center text-xs">
                  {getPlatformIcon(conv.platform)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-on-surface truncate pr-2">{conv.participant_name}</h3>
                  <span className="text-xs text-app-muted flex-shrink-0">
                    {new Date(conv.updated_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}
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
          ))
        )}

        {/* --- YORUMLAR TAB --- */}
        {activeTab === 'yorumlar' && (
          DUMMY_COMMENTS.map(comm => (
            <div 
              key={comm.id}
              onClick={() => isSelectionMode ? toggleSelection(comm.id) : null}
              className={`glass flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                selectedItems.includes(comm.id) 
                  ? 'border-[#bc13fe] bg-[#bc13fe]/5' 
                  : 'border-app-border bg-app-card hover:border-app-muted/40'
              }`}
            >
               {isSelectionMode && (
                <div className={`mt-2 w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${
                  selectedItems.includes(comm.id) ? 'bg-[#bc13fe] border-[#bc13fe] text-white' : 'border-app-muted'
                }`}>
                  {selectedItems.includes(comm.id) && <i className="fa-solid fa-check text-xs"></i>}
                </div>
              )}

              <img src={comm.post_image} alt="Post" className="w-14 h-14 object-cover rounded-lg border border-white/5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {getPlatformIcon(comm.platform)}
                    <span className="font-semibold text-on-surface text-sm truncate">@{comm.username}</span>
                  </div>
                  <span className="text-xs text-app-muted whitespace-nowrap">
                    {new Date(comm.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-app-muted line-clamp-2 leading-relaxed">
                  {comm.content}
                </p>
                
                {!isSelectionMode && (
                  <div className="mt-3 flex items-center justify-end">
                    <button className="px-3 py-1.5 rounded bg-[#bc13fe]/10 border border-[#bc13fe]/20 text-[#bc13fe] hover:bg-[#bc13fe]/20 transition-colors text-xs font-semibold flex items-center gap-1.5">
                      <i className="fa-regular fa-comment-dots"></i> Yorumları Gör
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* --- DEĞERLENDİRMELER TAB --- */}
        {activeTab === 'degerlendirmeler' && (
          DUMMY_REVIEWS.map(rev => (
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
                  {new Date(rev.created_at).toLocaleDateString('tr-TR')}
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
