"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CreatePostPage() {
  const [postText, setPostText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sosyal-medya" className="w-10 h-10 rounded-xl glass border border-app-border flex items-center justify-center text-app-muted hover:text-on-surface transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-on-surface mb-1">Gönderi Oluştur</h1>
            <p className="text-app-muted text-sm">AI destekli içerik oluşturun, düzenleyin ve paylaşın.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg glass border border-app-border text-app-muted hover:text-on-surface transition-colors text-sm font-medium flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left"></i> Geçmiş
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Sol Kolon: Oluşturma Akışı */}
        <div className="space-y-6">
          
          {/* Platform Seçimi */}
          <section className="glass rounded-2xl p-6 border border-app-border">
            <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#bc13fe]/20 text-[#bc13fe] flex items-center justify-center text-xs">1</span>
              Platform Seçimi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "instagram", name: "Instagram", icon: "fa-instagram", color: "#E1306C" },
                { id: "facebook", name: "Facebook", icon: "fa-facebook", color: "#1877F2" },
                { id: "whatsapp", name: "WhatsApp", icon: "fa-whatsapp", color: "#25D366" },
                { id: "linkedin", name: "LinkedIn", icon: "fa-linkedin", color: "#0A66C2" },
              ].map(p => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button 
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      isSelected 
                        ? `bg-[${p.color}]/10 border-[${p.color}]/50 shadow-[0_0_15px_rgba(0,0,0,0.1)]` 
                        : 'bg-app-bg/50 border-app-border hover:border-app-muted'
                    }`}
                    style={isSelected ? { borderColor: p.color, backgroundColor: `${p.color}15`, boxShadow: `0 0 15px ${p.color}30` } : {}}
                  >
                    <i className={`fa-brands ${p.icon} text-2xl`} style={{ color: p.color }}></i>
                    <span className="text-xs font-medium text-on-surface">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Medya */}
          <section className="glass rounded-2xl p-6 border border-app-border">
            <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#bc13fe]/20 text-[#bc13fe] flex items-center justify-center text-xs">2</span>
              Medya (Görsel/Video)
            </h2>
            <div className="w-full h-[200px] rounded-xl border-2 border-dashed border-app-muted/30 bg-app-bg/30 flex flex-col items-center justify-center cursor-pointer hover:bg-app-bg/50 hover:border-[#00f0ff]/50 transition-all group">
              <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
              </div>
              <p className="font-semibold text-on-surface mb-1">Görsel veya Video Yükle</p>
              <p className="text-xs text-app-muted">Sürükleyip bırakın veya seçmek için tıklayın</p>
            </div>
          </section>

          {/* Metin */}
          <section className="glass rounded-2xl p-6 border border-app-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#bc13fe]/20 text-[#bc13fe] flex items-center justify-center text-xs">3</span>
                Gönderi Metni
              </h2>
              <button className="text-[#bc13fe] hover:text-[#bc13fe]/80 text-sm font-medium flex items-center gap-1">
                <i className="fa-solid fa-wand-magic-sparkles"></i> AI ile Yaz
              </button>
            </div>
            <textarea 
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-[150px] bg-app-bg border border-app-border rounded-xl p-4 text-on-surface placeholder-app-muted focus:outline-none focus:border-[#bc13fe]/50 focus:ring-1 focus:ring-[#bc13fe]/50 resize-none"
              placeholder="Takipçilerinize ne söylemek istersiniz?"
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-app-border hover:bg-white/5 flex items-center justify-center text-app-muted hover:text-on-surface transition-colors">
                  <i className="fa-regular fa-face-smile"></i>
                </button>
                <button className="w-8 h-8 rounded-lg border border-app-border hover:bg-white/5 flex items-center justify-center text-app-muted hover:text-on-surface transition-colors">
                  <i className="fa-solid fa-hashtag"></i>
                </button>
              </div>
              <span className="text-xs text-app-muted">{postText.length} / 2200</span>
            </div>
          </section>

        </div>

        {/* Sağ Kolon: Önizleme & Paylaşım */}
        <div className="space-y-6">
          
          {/* Önizleme */}
          <section className="glass rounded-2xl p-6 border border-app-border">
            <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#bc13fe]/20 text-[#bc13fe] flex items-center justify-center text-xs">4</span>
              Önizleme
            </h2>
            
            {/* Sahte Instagram Gönderisi */}
            <div className="bg-[#0b0c10] border border-app-border rounded-xl overflow-hidden shadow-2xl">
              <div className="p-3 flex items-center gap-3 border-b border-app-border/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] to-[#bc1888] p-[2px]">
                  <div className="w-full h-full rounded-full bg-black"></div>
                </div>
                <div className="font-semibold text-xs text-white">sizin_sayfaniz</div>
              </div>
              <div className="aspect-square bg-app-bg/50 flex items-center justify-center text-app-muted">
                <i className="fa-regular fa-image text-4xl"></i>
              </div>
              <div className="p-3">
                <div className="flex gap-4 mb-2 text-white">
                  <i className="fa-regular fa-heart text-xl"></i>
                  <i className="fa-regular fa-comment text-xl"></i>
                  <i className="fa-regular fa-paper-plane text-xl"></i>
                </div>
                <p className="text-xs text-white line-clamp-3">
                  <span className="font-bold mr-1">sizin_sayfaniz</span>
                  {postText || "Gönderi metniniz burada görünecek..."}
                </p>
              </div>
            </div>
          </section>

          {/* Yayınlama */}
          <section className="glass rounded-2xl p-6 border border-app-border">
            <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#bc13fe]/20 text-[#bc13fe] flex items-center justify-center text-xs">5</span>
              Yayınlama
            </h2>
            
            <div className="flex gap-2 mb-4 p-1 bg-app-bg rounded-lg border border-app-border">
              <button className="flex-1 py-2 text-xs font-semibold rounded-md bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">Hemen Paylaş</button>
              <button className="flex-1 py-2 text-xs font-semibold rounded-md text-app-muted hover:text-on-surface">Planla</button>
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#bc13fe] to-[#8000ff] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(188,19,254,0.4)]">
              Seçili Platformlarda Paylaş
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
