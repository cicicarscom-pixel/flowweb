"use client";

import React, { useState } from "react";
import Link from "next/link";

const MOCK_POSTS = [
  {
    id: "1",
    content: "Yeni yaz koleksiyonumuz mağazalarda! #moda #yaz",
    platforms: ["instagram", "facebook"],
    scheduled_for: "2026-08-01T10:00:00Z",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop",
    metrics: { likes: "-", comments: "-" }
  },
  {
    id: "2",
    content: "İndirim günleri başladı, %50'ye varan fırsatları kaçırmayın.",
    platforms: ["instagram", "whatsapp"],
    scheduled_for: "2026-07-25T14:30:00Z",
    status: "published",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop",
    metrics: { likes: "1.2K", comments: "48" }
  },
  {
    id: "3",
    content: "Sistemsel bir hata nedeniyle yüklenemedi.",
    platforms: ["linkedin"],
    scheduled_for: "2026-07-30T09:00:00Z",
    status: "failed",
    image: null,
    metrics: { likes: "-", comments: "-" }
  }
];

export default function TumGonderilerPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPosts = MOCK_POSTS.filter((post) => {
    if (activeFilter === "all") return true;
    return post.status === activeFilter;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published': return { label: 'Yayınlandı', color: '#00f0ff', bg: 'rgba(0, 240, 255, 0.1)' };
      case 'scheduled': return { label: 'Planlandı', color: '#bc13fe', bg: 'rgba(188, 19, 254, 0.1)' };
      case 'failed': return { label: 'Hata', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { label: status, color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return { icon: "fa-instagram", color: "#E1306C" };
      case 'facebook': return { icon: "fa-facebook", color: "#1877F2" };
      case 'whatsapp': return { icon: "fa-whatsapp", color: "#25D366" };
      case 'linkedin': return { icon: "fa-linkedin", color: "#0A66C2" };
      default: return { icon: "fa-circle-dot", color: "#9ca3af" };
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sosyal-medya" className="w-10 h-10 rounded-xl glass border border-app-border flex items-center justify-center text-app-muted hover:text-on-surface transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface mb-1">Tüm Gönderiler</h1>
            <p className="text-app-muted text-sm">Yayınlanmış, planlanmış ve taslak gönderileriniz.</p>
          </div>
        </div>
        <Link href="/sosyal-medya/create-post" className="px-5 py-2.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20 transition-all font-semibold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <i className="fa-solid fa-plus"></i> Yeni Gönderi
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {[
          { id: "all", label: "Tümü" },
          { id: "published", label: "Yayınlananlar" },
          { id: "scheduled", label: "Planlananlar" },
          { id: "failed", label: "Hatalılar" },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.id 
                ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                : 'glass border-app-border text-app-muted hover:text-on-surface'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => {
            const statusConf = getStatusConfig(post.status);
            return (
              <div key={post.id} className="glass p-4 rounded-2xl border border-app-border hover:border-app-muted/40 transition-colors flex gap-5">
                {/* Görsel */}
                <div className="w-24 h-24 rounded-xl bg-app-bg border border-app-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {post.image ? (
                    <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                  ) : (
                    <i className="fa-regular fa-image text-3xl text-app-muted/30"></i>
                  )}
                </div>
                
                {/* Detaylar */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex gap-1.5">
                        {post.platforms.map(p => {
                          const pIcon = getPlatformIcon(p);
                          return (
                            <div key={p} className="w-6 h-6 rounded-full bg-app-bg border border-app-border flex items-center justify-center">
                              <i className={`fa-brands ${pIcon.icon} text-xs`} style={{ color: pIcon.color }}></i>
                            </div>
                          );
                        })}
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border flex items-center gap-1.5"
                        style={{ backgroundColor: statusConf.bg, color: statusConf.color, borderColor: `${statusConf.color}40` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConf.color }}></div>
                        {statusConf.label}
                      </div>
                    </div>
                    <p className="text-sm text-on-surface line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-app-muted">
                      <i className="fa-regular fa-calendar mr-1"></i>
                      {new Date(post.scheduled_for).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {post.status === 'published' && (
                      <div className="flex items-center gap-4 text-xs text-app-muted">
                        <span className="flex items-center gap-1"><i className="fa-solid fa-heart text-gray-500"></i> {post.metrics.likes}</span>
                        <span className="flex items-center gap-1"><i className="fa-solid fa-comment text-gray-500"></i> {post.metrics.comments}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aksiyon */}
                <div className="flex flex-col justify-between items-end pl-2 border-l border-app-border/50">
                  <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-app-muted transition-colors">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  {post.status === 'failed' && (
                    <button className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-app-card border border-app-border flex items-center justify-center mb-4 text-app-muted">
              <i className="fa-solid fa-inbox text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Gönderi Bulunamadı</h3>
            <p className="text-app-muted text-sm max-w-sm">Seçili filtreye uygun herhangi bir gönderi bulunmuyor. Yeni bir tane oluşturmaya ne dersiniz?</p>
          </div>
        )}
      </div>
    </div>
  );
}
