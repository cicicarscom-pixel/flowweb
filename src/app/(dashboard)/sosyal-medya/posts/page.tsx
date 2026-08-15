"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'scheduled', label: 'Planlanan' },
  { id: 'published', label: 'Yayınlanan' },
  { id: 'failed', label: 'Hatalı' }
];

const MOCK_POSTS = [
  {
    id: "1",
    content: "Yeni yaz koleksiyonumuz mağazalarda! #moda #yaz",
    platforms: ["instagram", "facebook"],
    scheduled_for: "2026-08-01T10:00:00Z",
    status: "scheduled",
    media_urls: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop"],
    metrics: { likes: "-", comments: "-", shares: "-", saves: "-", clicks: "-", views: "-", impressions: "-", reach: "-" }
  },
  {
    id: "2",
    content: "İndirim günleri başladı, %50'ye varan fırsatları kaçırmayın.",
    platforms: ["instagram", "whatsapp"],
    scheduled_for: "2026-07-25T14:30:00Z",
    status: "published",
    media_urls: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop"],
    metrics: { likes: "1200", comments: "48", shares: "12", saves: "89", clicks: "340", views: "4500", impressions: "5200", reach: "4100" }
  },
  {
    id: "3",
    content: "Sistemsel bir hata nedeniyle yüklenemedi.",
    platforms: ["linkedin"],
    scheduled_for: "2026-07-30T09:00:00Z",
    status: "failed",
    media_urls: [],
    metrics: { likes: "-", comments: "-", shares: "-", saves: "-", clicks: "-", views: "-", impressions: "-", reach: "-" }
  }
];

export default function TumGonderilerPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPosts = MOCK_POSTS.filter(post => {
    if (activeFilter === 'all') return true;
    return post.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return '#00f0ff'; // Cyan
      case 'published': return '#bc13fe'; // Magenta
      case 'failed': return '#ff0050'; // Red
      default: return '#849495'; // Gray
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Planlandı';
      case 'published': return 'Yayınlandı';
      case 'failed': return 'Hatalı';
      default: return 'Bilinmiyor';
    }
  };

  const formatDate = (isoString: string) => {
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
    switch (platform) {
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
      <div className="px-5 py-4 flex gap-2 overflow-x-auto hide-scrollbar shrink-0">
        <Link href="/sosyal-medya" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#849495] hover:text-[#e5e2e3] transition-colors mr-2 shrink-0">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        {FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full border text-[12px] font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter.id 
                ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' 
                : 'bg-white/5 border-white/10 text-[#849495] hover:text-[#e5e2e3]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* List (Table Layout) */}
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        <div style={{ width: 1410, minHeight: '100%' }} className="flex flex-col pb-20">
          
          {/* Table Header */}
          <div className="flex items-center border-b border-white/10 pb-3 pt-4 mb-2 px-5 sticky top-0 bg-[#0A0A0B]/95 z-10 backdrop-blur-sm">
            <div style={{ width: 40 }}></div>
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((item) => {
              const statusColor = getStatusColor(item.status);
              const isScheduled = item.status === 'scheduled';

              return (
                <div key={item.id} className="flex items-center border-b border-white/5 py-3 px-5 hover:bg-white/5 transition-colors" style={{ opacity: isScheduled ? 0.7 : 1 }}>
                  {/* Checkbox Placeholder */}
                  <div style={{ width: 40 }} className="flex justify-start">
                    <div className="w-4 h-4 rounded border border-[#849495]/50 bg-transparent"></div>
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
                      {getPreviewText(item.content)}
                    </span>
                  </div>

                  {/* Platforms */}
                  <div style={{ width: 100 }} className="flex justify-center items-center gap-1">
                    {item.platforms.map((plat, idx) => (
                      <i key={idx} className={`fa-brands ${getPlatformIcon(plat)} text-[14px] text-[#e5e2e3]`}></i>
                    ))}
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
                    item.metrics.likes,
                    item.metrics.comments,
                    item.metrics.shares,
                    item.metrics.saves,
                    item.metrics.clicks,
                    item.metrics.views,
                    item.metrics.impressions,
                    item.metrics.reach
                  ].map((val, idx) => (
                    <div key={idx} style={{ width: 60 }} className="flex justify-center items-center">
                      <span className="text-[#849495] text-[12px]">{val}</span>
                    </div>
                  ))}

                  {/* Actions */}
                  <div style={{ width: 80 }} className="flex justify-center items-center">
                    {item.status === 'failed' && (
                      <button className="w-7 h-7 rounded bg-[#ff0050]/20 border border-[#ff0050]/40 flex items-center justify-center text-[#ff0050] hover:bg-[#ff0050]/30 transition-colors">
                        <i className="fa-solid fa-rotate-right text-[12px]"></i>
                      </button>
                    )}
                    {item.status === 'scheduled' && (
                      <button className="w-7 h-7 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-colors">
                        <i className="fa-regular fa-trash-can text-[12px]"></i>
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button className="w-7 h-7 rounded bg-[#bc13fe]/10 border border-[#bc13fe]/30 flex items-center justify-center text-[#bc13fe] hover:bg-[#bc13fe]/20 transition-colors">
                        <i className="fa-solid fa-cloud-arrow-down text-[12px]"></i>
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 w-full">
              <i className="fa-regular fa-file-lines text-[48px] text-[#849495] opacity-50 mb-4"></i>
              <span className="text-[#849495] text-[14px]">Bu duruma ait gönderi bulunamadı.</span>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
