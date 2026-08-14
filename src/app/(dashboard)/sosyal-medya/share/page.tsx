"use client";

import React from "react";
import Link from "next/link";

export default function SharePage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sosyal-medya" className="w-10 h-10 rounded-xl glass border border-app-border flex items-center justify-center text-app-muted hover:text-on-surface transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface mb-1">Paylaşım Merkezi</h1>
            <p className="text-app-muted text-sm">Tüm sosyal medya kanallarınızın etkileşim analizleri ve raporları.</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg glass border border-app-border text-on-surface hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2">
          <i className="fa-solid fa-download"></i> Rapor İndir
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-6">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Toplam Takipçi", value: "24.6K", change: "+12%", up: true, icon: "fa-users", color: "#4edea3" },
            { title: "Gönderi Etkileşimi", value: "8.2K", change: "+5.4%", up: true, icon: "fa-heart", color: "#bc13fe" },
            { title: "Profil Ziyareti", value: "14.1K", change: "-2.1%", up: false, icon: "fa-eye", color: "#00f0ff" },
            { title: "Yeni Gönderiler", value: "24", change: "+8", up: true, icon: "fa-layer-group", color: "#f59e0b" },
          ].map((stat, idx) => (
            <div key={idx} className="glass p-5 rounded-2xl border border-app-border flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-app-bg border border-app-border" style={{ color: stat.color }}>
                  <i className={`fa-solid ${stat.icon} text-lg`}></i>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <i className={`fa-solid ${stat.up ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} mr-1`}></i>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface mb-1">{stat.value}</p>
                <p className="text-sm text-app-muted">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 glass p-6 rounded-2xl border border-app-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">Etkileşim Analizi</h3>
              <select className="bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none">
                <option>Son 7 Gün</option>
                <option>Son 30 Gün</option>
                <option>Bu Yıl</option>
              </select>
            </div>
            
            <div className="h-[250px] w-full flex items-end justify-between gap-2 border-b border-app-border/50 pb-2 relative">
              {/* Sahte Grafik (Barlar) */}
              {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                <div key={i} className="w-full flex justify-center group relative">
                  <div 
                    className="w-[60%] rounded-t-sm bg-gradient-to-t from-[#bc13fe]/20 to-[#00f0ff] opacity-80 group-hover:opacity-100 transition-all cursor-pointer relative" 
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-app-card border border-app-border px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}K
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                <span key={i} className="text-xs text-app-muted w-full text-center">{day}</span>
              ))}
            </div>
          </div>

          {/* Platform Dağılımı */}
          <div className="glass p-6 rounded-2xl border border-app-border flex flex-col">
            <h3 className="text-lg font-bold text-on-surface mb-6">Platform Performansı</h3>
            <div className="flex-1 flex flex-col gap-5 justify-center">
              {[
                { name: "Instagram", percent: 65, color: "#E1306C" },
                { name: "Facebook", percent: 20, color: "#1877F2" },
                { name: "TikTok", percent: 10, color: "#00f0ff" },
                { name: "LinkedIn", percent: 5, color: "#0A66C2" },
              ].map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-on-surface">{p.name}</span>
                    <span className="text-xs font-bold" style={{ color: p.color }}>%{p.percent}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-app-bg overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.percent}%`, backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}80` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Top Posts */}
        <div className="glass p-6 rounded-2xl border border-app-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-on-surface">En Çok Etkileşim Alan Gönderiler</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 rounded-xl border border-app-border bg-app-bg/30 flex items-center gap-4 hover:border-app-muted/50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop&random=${item}`} alt="Post" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    <i className="fa-brands fa-instagram text-[#E1306C] text-xs"></i>
                    <i className="fa-brands fa-facebook text-[#1877F2] text-xs"></i>
                  </div>
                  <p className="text-xs text-on-surface line-clamp-1 mb-2">Kampanya başladı! Hemen ziyaret edin...</p>
                  <div className="flex items-center gap-3 text-xs text-app-muted font-bold">
                    <span className="text-[#00f0ff]"><i className="fa-solid fa-heart mr-1"></i> 1.2K</span>
                    <span className="text-[#bc13fe]"><i className="fa-solid fa-comment mr-1"></i> 340</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
