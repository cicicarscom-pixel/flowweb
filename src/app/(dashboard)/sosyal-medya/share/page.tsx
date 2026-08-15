"use client";

import React, { useState } from "react";
import Link from "next/link";

const PLATFORMS_DATA = [
  { id: "instagram", name: "Instagram", color: "#E1306C", icon: "fa-instagram" },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "fa-facebook" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", icon: "fa-linkedin" },
  { id: "twitter", name: "X", color: "#ffffff", icon: "fa-x-twitter" },
  { id: "youtube", name: "YouTube", color: "#FF0000", icon: "fa-youtube" },
  { id: "tiktok", name: "TikTok", color: "#00f0ff", icon: "fa-tiktok" },
];

export default function SharePage() {
  const [prompt, setPrompt] = useState("");
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localText, setLocalText] = useState("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({
    instagram: true,
    facebook: false,
    youtube: false,
  });

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-on-surface">
      <div className="h-14 flex items-center justify-between px-5 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/sosyal-medya" className="text-[#849495] hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Link>
          <h1 className="text-lg font-bold text-[#e5e2e3]">Paylaşım Merkezi</h1>
        </div>
        <button className="text-[#e5e2e3] hover:bg-white/10 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Input Section */}
          <div>
            <label className="block text-[#b9cacb] text-xs font-medium uppercase tracking-wider mb-2 ml-1">
              Ne Paylaşalım?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Yeni yaz koleksiyonumuz için enerjik bir post..."
              className="w-full bg-[#1c1b1c]/50 rounded-lg border border-white/10 text-[#e5e2e3] text-base p-3 min-h-[100px] focus:outline-none focus:border-white/20 resize-none"
            ></textarea>
          </div>

          {/* Central Feature: Image Container */}
          <div className="flex justify-center w-full relative">
            <div className="w-full aspect-square max-w-[350px] p-[3px] rounded-[24px] relative group overflow-hidden bg-white/5">
              {/* Fake Animated Border */}
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]" style={{
                background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #00f0ff 90%, #ffffff 100%)'
              }}></div>
              
              <div className="absolute inset-[3px] bg-[#131314] rounded-[21px] flex items-center justify-center bg-[#2a2a2b]/50 overflow-hidden z-10 cursor-pointer hover:bg-[#2a2a2b]/70 transition-colors">
                {localImage ? (
                  <img src={localImage} alt="uploaded" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 bg-[#00f0ff]/10 rounded-full p-4 border border-[#00f0ff]/30 border-dashed">
                      <i className="fa-regular fa-image text-4xl text-[#00f0ff]"></i>
                    </div>
                    <span className="text-[#b9cacb] text-base text-center px-4 font-medium mb-1">
                      Görsel & Video Seç ya da Üret
                    </span>
                    <span className="text-[#b9cacb]/60 text-xs text-center px-8">
                      Galerinizden eklemek için dokunun.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Caption Editor */}
          <div className="w-full p-[3px] rounded-[20px] relative overflow-hidden bg-white/5">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]" style={{
              background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #bc13fe 90%, #ffffff 100%)'
            }}></div>
            <div className="relative bg-[#131314] rounded-[17px] p-5 z-10">
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#e5e2e3] text-lg font-semibold">İçerik Metni</h2>
                <button 
                  onClick={() => setIsEditingCaption(!isEditingCaption)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <i className={`fa-solid ${isEditingCaption ? 'fa-check text-[#bc13fe]' : 'fa-pen text-[#00f0ff]'}`}></i>
                </button>
              </div>

              <div className={`bg-[#0e0e0f]/50 rounded-lg p-3 border ${isEditingCaption ? 'border-[#bc13fe]' : 'border-white/5'} min-h-[200px] mb-4`}>
                {isEditingCaption ? (
                  <textarea
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    placeholder="Yapay zeka tarafından üretilen metin veya kendi metniniz..."
                    className="w-full h-full bg-transparent text-[#e5e2e3] text-sm leading-5 resize-none focus:outline-none min-h-[180px]"
                  ></textarea>
                ) : (
                  <p className="text-[#b9cacb]/80 text-sm leading-5 whitespace-pre-wrap">
                    {localText || "Yapay zeka tarafından oluşturulan içerik metni burada görünecek. Gelişmiş dil modelleri ile hedef kitlenize uygun metinler hazırlanıyor..."}
                  </p>
                )}
              </div>

              {/* AI Chat Input for Caption */}
              <div className="flex items-center mb-4 gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Görselle uyumlu bir metin üret..."
                  className="flex-1 bg-[#1c1b1c] rounded-full px-4 py-2 text-[#e5e2e3] border border-[#3b494b] focus:outline-none focus:border-[#bc13fe] text-sm"
                />
                <button className="w-10 h-10 rounded-full bg-[#bc13fe] flex items-center justify-center shrink-0 hover:bg-[#a10ce0] transition-colors">
                  <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-medium">#yaz</span>
                <span className="bg-[#00f0ff]/10 px-3 py-1 rounded-full border border-[#00f0ff]/20 text-[#00f0ff] text-xs font-medium">#yenisezon</span>
                <button className="px-3 py-1 flex items-center gap-1 hover:bg-white/5 rounded-full transition-colors text-[#b9cacb]">
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span className="text-xs font-medium">Etiket ekle</span>
                </button>
              </div>

            </div>
          </div>

          {/* Profiles Section */}
          <div className="mt-6">
            <label className="block text-[#b9cacb] text-xs font-medium mb-3">profiller</label>
            <button className="w-full flex items-center justify-between bg-[#1c1b1c]/50 rounded-lg border border-white/5 p-4 mb-4 hover:bg-[#1c1b1c] transition-colors">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ffb95f] mr-3"></div>
                <span className="text-[#e5e2e3] text-sm">AI Esnaf Profil</span>
              </div>
              <i className="fa-solid fa-chevron-down text-[#b9cacb]"></i>
            </button>

            <label className="block text-[#b9cacb] text-xs font-medium mb-3">Seçilen platformlarda paylaş</label>
            <div className="grid grid-cols-3 gap-3">
              {PLATFORMS_DATA.map((acc) => {
                const isSelected = selectedPlatforms[acc.id];
                return (
                  <button 
                    key={acc.id}
                    onClick={() => togglePlatform(acc.id)}
                    className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                      isSelected ? 'bg-[#4edea3]/10 border-[#4edea3]/50' : 'bg-[#1c1b1c]/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <i className={`fa-brands ${acc.icon} text-base shrink-0`} style={{ color: acc.id === 'twitter' && !isSelected ? '#b9cacb' : acc.color }}></i>
                      <div className="flex flex-col items-start overflow-hidden text-left">
                        <span className="text-[#e5e2e3] text-[10px] font-medium truncate w-full">{acc.name}</span>
                        <span className="text-[#b9cacb]/60 text-[8px] truncate w-full">@hesap</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#4edea3] flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-check text-[8px] text-[#003824]"></i>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Publish Button Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-5 bg-gradient-to-t from-[#0A0A0B] to-transparent pointer-events-none flex justify-center z-50">
            <button className="w-full max-w-sm py-3.5 rounded-full bg-gradient-to-r from-[#4edea3] to-[#00f0ff] text-[#0A0A0B] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(78,222,163,0.3)] hover:opacity-90 transition-opacity pointer-events-auto">
              <i className="fa-solid fa-paper-plane"></i> Şimdi Paylaş
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
