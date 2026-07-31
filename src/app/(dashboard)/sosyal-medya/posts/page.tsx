"use client";

import React, { useState } from "react";
import Link from "next/link";

const FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "drafts", label: "Taslaklar" },
  { id: "scheduled", label: "Planlanan" },
  { id: "published", label: "Yayınlandı" },
  { id: "failed", label: "Hatalı" },
];

const MOCK_POSTS = [
  {
    id: "1",
    content: "Yeni yaz koleksiyonumuz mağazalarda! #moda #yaz",
    platforms: ["instagram", "facebook"],
    scheduled_for: "2026-08-01T10:00:00Z",
    status: "scheduled",
    likes: "-",
    comments: "-",
    shares: "-",
    saves: "-",
    clicks: "-",
    views: "-",
    impressions: "-",
    reach: "-",
  },
  {
    id: "2",
    content: "İndirim günleri başladı, %50'ye varan fırsatları kaçırmayın.",
    platforms: ["instagram", "twitter", "facebook"],
    scheduled_for: "2026-07-25T14:30:00Z",
    status: "published",
    likes: "1,245",
    comments: "48",
    shares: "12",
    saves: "56",
    clicks: "340",
    views: "5,400",
    impressions: "6,200",
    reach: "4,800",
  },
  {
    id: "3",
    content: "Sistemsel bir hata nedeniyle yüklenemedi.",
    platforms: ["linkedin"],
    scheduled_for: "2026-07-30T09:00:00Z",
    status: "failed",
    likes: "-",
    comments: "-",
    shares: "-",
    saves: "-",
    clicks: "-",
    views: "-",
    impressions: "-",
    reach: "-",
  }
];

export default function TumGonderilerPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPosts = MOCK_POSTS.filter((post) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "drafts") return post.status === "draft";
    if (activeFilter === "scheduled") return post.status === "scheduled";
    if (activeFilter === "published") return post.status === "published";
    if (activeFilter === "failed") return post.status === "failed";
    return true;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'YAYINLANDI';
      case 'scheduled': return 'PLANLANDI';
      case 'failed': return 'HATALI';
      case 'draft': return 'TASLAK';
      default: return status.toUpperCase();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#00f0ff'; // Cyan
      case 'scheduled': return '#bc13fe'; // Purple
      case 'failed': return '#ff0050'; // Red
      case 'draft': return '#f59e0b'; // Amber
      default: return '#849495';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-transparent relative">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUpjAKmMNnHDAuGn7KDAmiX4BVuWBLEG-5a7fHFVu_x7Jxrfh8UzY6rM-oy3AiqN0b1h6_K5iobCNsv2B4iHnz_lPjQ6QXfGvJ4UZmCcQLcr6H8o6m3I1JVFmgqk7UubXZx96-wpkV8-ScZZBzzkpl4-_WMzeHLyFljEKugxDZQXZgdkjst86sxa7hU95rBimeOBSnqHbdwH9bj_yj1tbla3T_HPG2xI6XkgTpyJRiDhmg9Po0q7NWy9DKn3JnR0b5tcpUj4Vcxr3w')",
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-transparent/80"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between h-16 px-6 border-b border-white/10 shrink-0 bg-transparent/50 backdrop-blur-md">
        <div className="flex items-center">
          <Link
            href="/sosyal-medya"
            className="text-white hover:text-[#00f0ff] transition-colors mr-4 flex items-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-white font-semibold text-lg tracking-wide">
            Tüm Gönderiler
          </h1>
        </div>
        <button className="bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30 border border-[#00f0ff]/50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Yeni Gönderi
        </button>
      </div>

      {/* Filters */}
      <div className="relative z-10 px-6 py-5 flex items-center gap-3 overflow-x-auto shrink-0 scrollbar-hide">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]"
                : "bg-white/5 border-white/10 text-[#849495] hover:bg-white/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Table Area */}
      <div className="relative z-10 flex-1 overflow-auto mx-6 mb-6 rounded-2xl border border-white/10 bg-[#131315]/80 backdrop-blur-sm">
        <div style={{ minWidth: "1400px" }} className="w-full">
          {/* Table Header */}
          <div className="flex items-center border-b border-white/10 bg-black/40 px-5 py-4">
            <div className="w-[300px] text-[#849495] text-xs font-semibold uppercase tracking-wider">İçerik</div>
            <div className="w-[120px] text-[#849495] text-xs font-semibold uppercase tracking-wider text-center">Platformlar</div>
            <div className="w-[160px] text-[#849495] text-xs font-semibold uppercase tracking-wider text-center">Tarih</div>
            <div className="w-[140px] text-[#849495] text-xs font-semibold uppercase tracking-wider text-center">Durum</div>
            <div className="w-[160px] text-[#849495] text-xs font-semibold uppercase tracking-wider">Profil</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Beğeni</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Yorum</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Paylaşım</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Kaydetme</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Tıklama</div>
            <div className="w-[70px] text-[#849495] text-[10px] font-semibold uppercase tracking-wider text-center">Görüntüleme</div>
            <div className="flex-1 text-[#849495] text-xs font-semibold uppercase tracking-wider text-right pr-4">Aksiyonlar</div>
          </div>

          {/* Table Rows */}
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center border-b border-white/5 px-5 py-4 hover:bg-white/5 transition-colors group">
                {/* İçerik */}
                <div className="w-[300px] pr-4">
                  <p className="text-[#e5e2e3] text-sm line-clamp-2">{post.content}</p>
                </div>
                {/* Platformlar */}
                <div className="w-[120px] flex justify-center items-center gap-2">
                  {post.platforms.map((p, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <i className={`fa-brands fa-${p} text-xs text-white/70`}></i>
                    </div>
                  ))}
                </div>
                {/* Tarih */}
                <div className="w-[160px] text-center">
                  <p className="text-[#b9cacb] text-sm">
                    {new Date(post.scheduled_for).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {/* Durum */}
                <div className="w-[140px] flex justify-center">
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full border"
                    style={{ 
                      backgroundColor: `${getStatusColor(post.status)}15`,
                      borderColor: `${getStatusColor(post.status)}40`
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(post.status) }}></div>
                    <span style={{ color: getStatusColor(post.status) }} className="text-xs font-bold tracking-wide">
                      {getStatusLabel(post.status)}
                    </span>
                  </div>
                </div>
                {/* Profil */}
                <div className="w-[160px] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-rose-400"></div>
                  <span className="text-[#e5e2e3] text-sm truncate">AI Esnaf Profil</span>
                </div>
                {/* Metrikler */}
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.likes}</div>
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.comments}</div>
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.shares}</div>
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.saves}</div>
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.clicks}</div>
                <div className="w-[70px] text-center text-[#849495] text-sm">{post.views}</div>
                {/* Aksiyonlar */}
                <div className="flex-1 flex justify-end pr-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {post.status === 'failed' && (
                    <button className="w-8 h-8 rounded bg-[#ff0050]/20 border border-[#ff0050]/40 flex items-center justify-center text-[#ff0050] hover:bg-[#ff0050]/30 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                    </button>
                  )}
                  {post.status === 'scheduled' && (
                    <button className="w-8 h-8 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                  <button className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[16px]">more_vert</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 w-full">
              <span className="material-symbols-outlined text-6xl text-[#849495]/30 mb-4">post_add</span>
              <p className="text-[#849495] text-lg">Bu filtreye uygun gönderi bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

