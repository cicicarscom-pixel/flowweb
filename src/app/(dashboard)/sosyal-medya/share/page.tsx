"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [zernioAccounts, setZernioAccounts] = useState<any[]>([]);

  // Publishing Mode
  const [publishMode, setPublishMode] = useState('now'); 
  const [scheduleDate, setScheduleDate] = useState('04.07.2026 14:00');

  // Facebook
  const [fbFormat, setFbFormat] = useState('Feed');
  const [fbFirstComment, setFbFirstComment] = useState('');
  const [fbCustomCaption, setFbCustomCaption] = useState('');

  // Instagram
  const [igFormat, setIgFormat] = useState('Feed');
  const [igAiLabel, setIgAiLabel] = useState(false);
  const [igFirstComment, setIgFirstComment] = useState('');
  const [igCustomCaption, setIgCustomCaption] = useState('');

  // LinkedIn
  const [liFirstComment, setLiFirstComment] = useState('');
  const [liCustomCaption, setLiCustomCaption] = useState('');

  // Twitter/X
  const [twIsThread, setTwIsThread] = useState(false);
  const [twCustomCaption, setTwCustomCaption] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        try {
          const { data: accData } = await supabase.functions.invoke('zernio-client', {
            body: { action: 'sync-accounts', payload: { userId: user.id } }
          });
          const accounts = accData?.data?.accounts || [];
          setZernioAccounts(accounts);
          
          const initialSelected: Record<string, boolean> = {};
          accounts.forEach((acc: any) => {
            initialSelected[acc.platform.toLowerCase()] = true;
          });
          setSelectedPlatforms(initialSelected);
        } catch(e) {
          console.warn("Failed to fetch accounts", e);
        }
      }
    };
    fetchAccounts();
  }, []);

  const generateCaption = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingText(true);
    try {
      const isBase64 = localImage?.startsWith('data:image');
      const base64Data = isBase64 ? localImage?.split(',')[1] : undefined;
      const mimeType = isBase64 ? localImage?.match(/data:(.*?);/)?.[1] : undefined;
      
      const wantsImageEdit = aiPrompt.toLowerCase().match(/resm|görsel|düzenle|çiz|ekle|değiştir|yap/i);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          prompt: wantsImageEdit 
            ? `Şu anki görseli kullanarak şu kullanıcı talimatına göre yeni bir görsel üret/düzenle: ${aiPrompt}`
            : `SADECE bir sosyal medya gönderi metni (caption) üret. KESİNLİKLE yeni bir görsel üretme (imagePrompt boş kalsın). Eğer sana bir görsel verildiyse o görseli analiz et ve şu kullanıcı talimatına göre metin yaz: ${aiPrompt}`,
          image: isBase64 ? base64Data : undefined,
          mimeType: isBase64 ? mimeType : undefined,
          mode: 'social'
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error);
      }

      if (data?.generatedImage) {
        setLocalImage(`data:image/jpeg;base64,${data.generatedImage}`);
      }
      
      if (data?.text) {
        setLocalText(data.text);
        setIsEditingCaption(true);
      }
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async () => {
    if (!localText.trim() && !prompt.trim()) {
      return alert("Lütfen paylaşılacak bir metin girin.");
    }
    
    const platformsToShare = Object.keys(selectedPlatforms).filter(p => selectedPlatforms[p]).map(p => {
      const acc = zernioAccounts.find((a: any) => a.platform.toLowerCase() === p);
      if (!acc) return null;
      
      let platformOptions: any = {};
      
      if (p === 'instagram') {
        platformOptions = {
          contentType: igFormat.toLowerCase(),
          aiGenerated: igAiLabel,
          firstComment: igFirstComment,
          caption: igCustomCaption || undefined
        };
      } else if (p === 'linkedin') {
        platformOptions = {
          firstComment: liFirstComment,
          caption: liCustomCaption || undefined
        };
      } else if (p === 'twitter') {
        platformOptions = {
          isThread: twIsThread,
          caption: twCustomCaption || undefined
        };
      }

      return { 
        platform: p, 
        accountId: acc._id || acc.id || acc.uuid || acc.zernio_account_id,
        platformSpecificData: Object.keys(platformOptions).length > 0 ? platformOptions : undefined
      };
    }).filter(Boolean);

    if (platformsToShare.length === 0) {
      return alert("Lütfen en az bir platform seçin.");
    }

    setIsSharing(true);
    try {
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: {
          action: 'create-post',
          payload: {
            content: localText || prompt,
            mediaItems: localImage ? [{ url: localImage }] : [],
            platforms: platformsToShare,
            publishNow: publishMode === 'now',
            scheduledFor: publishMode === 'schedule' ? new Date(scheduleDate).toISOString() : undefined,
          }
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error);
      }

      alert("Gönderi başarıyla paylaşıldı!");
    } catch (e: any) {
      console.error(e);
      alert("Gönderi paylaşılırken bir hata oluştu: " + e.message);
    } finally {
      setIsSharing(false);
    }
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
              
              <div 
                className="absolute inset-[3px] bg-[#131314] rounded-[21px] flex items-center justify-center bg-[#2a2a2b]/50 overflow-hidden z-10 cursor-pointer hover:bg-[#2a2a2b]/70 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*,video/*" 
                  onChange={handleFileSelect} 
                />
                {localImage ? (
                  <img src={localImage} alt="uploaded" className="w-full h-full object-contain" />
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
                <button 
                  onClick={generateCaption}
                  disabled={isGeneratingText}
                  className={`w-10 h-10 rounded-full ${isGeneratingText ? 'bg-[#bc13fe]/50' : 'bg-[#bc13fe] hover:bg-[#a10ce0]'} flex items-center justify-center shrink-0 transition-colors`}
                >
                  {isGeneratingText ? (
                    <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
                  ) : (
                    <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                  )}
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
              {zernioAccounts.map((acc, i) => {
                const platformKey = acc.platform.toLowerCase();
                const platformConfig = PLATFORMS_DATA.find(p => p.id === platformKey) || {
                  id: platformKey,
                  name: acc.platform,
                  color: "#e5e2e3",
                  icon: "fa-globe"
                };
                const isSelected = selectedPlatforms[platformKey];
                return (
                  <button 
                    key={acc.id || i}
                    onClick={() => togglePlatform(platformKey)}
                    className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                      isSelected ? 'bg-[#4edea3]/10 border-[#4edea3]/50' : 'bg-[#1c1b1c]/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <i className={`fa-brands ${platformConfig.icon} text-base shrink-0`} style={{ color: platformKey === 'twitter' && !isSelected ? '#b9cacb' : platformConfig.color }}></i>
                      <div className="flex flex-col items-start overflow-hidden text-left">
                        <span className="text-[#e5e2e3] text-[10px] font-medium truncate w-full">{platformConfig.name}</span>
                        <span className="text-[#b9cacb]/60 text-[8px] truncate w-full">@{acc.account_name || platformKey}</span>
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

          {/* Platform Specific Settings */}
          <div className="mt-6 flex flex-col gap-4">
            
            {/* Facebook */}
            {selectedPlatforms['facebook'] && (
              <div className="bg-[#1c1b1c]/30 rounded-[14px] border border-[#1877F2]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1877F2] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-facebook text-[#1877F2]"></i>
                      <span className="text-[#e5e2e3] font-semibold text-sm">Facebook</span>
                    </div>
                    <div className="flex bg-[#0e0e0f]/50 p-1 rounded-lg border border-white/5">
                      {['Feed', 'Story', 'Reel'].map(fmt => (
                        <button key={fmt} onClick={() => setFbFormat(fmt)} className={`px-3 py-1 rounded-md text-[10px] font-medium transition-colors ${fbFormat === fmt ? 'bg-[#1877F2] text-white' : 'text-[#b9cacb]'}`}>{fmt}</button>
                      ))}
                    </div>
                  </div>
                  {fbFormat === 'Story' && <p className="text-[#b9cacb]/70 text-[11px] mb-4">İçerik 24 saat sonra kaybolur. Medya gerektirir.</p>}
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">first comment</label>
                  <textarea value={fbFirstComment} onChange={e => setFbFirstComment(e.target.value)} placeholder="Drop any extra context or a CTA here." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
                  <p className="text-[#b9cacb]/50 text-[10px] text-right mb-4">{fbFirstComment.length}/8000</p>
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">custom caption</label>
                  <textarea value={fbCustomCaption} onChange={e => setFbCustomCaption(e.target.value)} placeholder="Leave blank to use main content..." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
                </div>
              </div>
            )}

            {/* Instagram */}
            {selectedPlatforms['instagram'] && (
              <div className="bg-[#1c1b1c]/30 rounded-[14px] border border-[#bc13fe]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#bc13fe] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-instagram text-[#bc13fe]"></i>
                      <span className="text-[#e5e2e3] font-semibold text-sm">Instagram</span>
                    </div>
                    <div className="flex bg-[#0e0e0f]/50 p-1 rounded-lg border border-white/5">
                      {['Feed', 'Story', 'Reel', 'Carousel'].map(fmt => (
                        <button key={fmt} onClick={() => setIgFormat(fmt)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${igFormat === fmt ? 'bg-[#bc13fe] text-white' : 'text-[#b9cacb]'}`}>{fmt}</button>
                      ))}
                    </div>
                  </div>
                  {igFormat === 'Story' && <p className="text-[#b9cacb]/70 text-[11px] mb-4">İçerik 24 saat sonra kaybolur. Medya gerektirir.</p>}
                  <button onClick={() => setIgAiLabel(!igAiLabel)} className="flex items-start gap-2 mb-4 group text-left">
                    <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${igAiLabel ? 'bg-[#4edea3] border-[#4edea3]' : 'border-white/20 group-hover:border-white/40'}`}>
                      {igAiLabel && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
                    </div>
                    <div>
                      <p className="text-[#e5e2e3] text-xs font-medium">AI ile üretildi olarak işaretle</p>
                      <p className="text-[#b9cacb]/60 text-[10px] mt-0.5 leading-tight">Instagram'ın AI içerik etiketini ekler. Medya tamamen veya büyük oranda AI ile oluşturulduğunda kullanın.</p>
                    </div>
                  </button>
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">first comment</label>
                  <textarea value={igFirstComment} onChange={e => setIgFirstComment(e.target.value)} placeholder="Drop any extra context or a CTA here." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#bc13fe]/50"></textarea>
                  <p className="text-[#b9cacb]/50 text-[10px] text-right mb-4">{igFirstComment.length}/2200</p>
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">custom caption</label>
                  <textarea value={igCustomCaption} onChange={e => setIgCustomCaption(e.target.value)} placeholder="Leave blank to use main content..." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#bc13fe]/50"></textarea>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {selectedPlatforms['linkedin'] && (
              <div className="bg-[#1c1b1c]/30 rounded-[14px] border border-[#0A66C2]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0A66C2] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-linkedin text-[#0A66C2]"></i>
                    <span className="text-[#e5e2e3] font-semibold text-sm">LinkedIn</span>
                  </div>
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">first comment</label>
                  <textarea value={liFirstComment} onChange={e => setLiFirstComment(e.target.value)} placeholder="Add a first comment to boost engagement." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
                  <p className="text-[#b9cacb]/50 text-[10px] text-right mb-4">{liFirstComment.length}/1250</p>
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">custom caption</label>
                  <textarea value={liCustomCaption} onChange={e => setLiCustomCaption(e.target.value)} placeholder="Leave blank to use main content..." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
                </div>
              </div>
            )}

            {/* Twitter/X */}
            {selectedPlatforms['twitter'] && (
              <div className="bg-[#1c1b1c]/30 rounded-[14px] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-x-twitter text-white"></i>
                    <span className="text-[#e5e2e3] font-semibold text-sm">X (Twitter)</span>
                  </div>
                  <button onClick={() => setTwIsThread(!twIsThread)} className="flex items-center gap-2 mb-4 group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${twIsThread ? 'bg-[#4edea3] border-[#4edea3]' : 'border-white/20 group-hover:border-white/40'}`}>
                      {twIsThread && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
                    </div>
                    <span className="text-[#e5e2e3] text-xs font-medium">Create a thread</span>
                  </button>
                  {twIsThread && <p className="text-[#b9cacb]/70 text-[10px] mb-4">Main content + media become tweet 1. Add more below.</p>}
                  <label className="block text-[#b9cacb] text-xs font-medium mb-1">custom caption</label>
                  <textarea value={twCustomCaption} onChange={e => setTwCustomCaption(e.target.value)} placeholder="Leave blank to use main content..." className="w-full bg-[#0e0e0f]/50 border border-white/5 rounded-lg text-[#e5e2e3] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-white/30"></textarea>
                </div>
              </div>
            )}

            {/* Publishing Settings */}
            <div className="mt-2 bg-[#1c1b1c]/50 rounded-[14px] border border-white/5 p-4 mb-20">
              <label className="block text-[#b9cacb] text-xs font-medium mb-3">yayıncılık</label>
              <div className="flex bg-[#0e0e0f]/50 p-1 rounded-lg border border-white/5 mb-4">
                <button onClick={() => setPublishMode('schedule')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'schedule' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#b9cacb] hover:text-white'}`}>Planlı</button>
                <button onClick={() => setPublishMode('now')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'now' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#b9cacb] hover:text-white'}`}>Şimdi</button>
              </div>
              {publishMode === 'schedule' ? (
                <div className="bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-lg p-3 flex items-start gap-2">
                  <i className="fa-solid fa-calendar text-[#4edea3] mt-0.5"></i>
                  <div className="w-full">
                    <span className="block text-[#e5e2e3] text-xs font-medium mb-1">Zamanlanmış Yayın</span>
                    <input type="text" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-transparent text-[#4edea3] text-sm font-semibold outline-none w-full" />
                  </div>
                </div>
              ) : (
                <div className="bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-lg p-3 flex items-start gap-2">
                  <i className="fa-solid fa-circle-info text-[#4edea3] mt-0.5"></i>
                  <span className="text-[#4edea3] text-xs font-medium leading-tight">Gönderi, seçilen tüm platformlarda anında yayınlanacaktır.</span>
                </div>
              )}
            </div>

          </div>

          {/* Publish Button Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-5 bg-gradient-to-t from-[#0A0A0B] to-transparent pointer-events-none flex justify-center z-50">
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className={`w-full max-w-sm py-3.5 rounded-full ${isSharing ? 'bg-gray-500' : 'bg-gradient-to-r from-[#4edea3] to-[#00f0ff] hover:opacity-90'} text-[#0A0A0B] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(78,222,163,0.3)] transition-opacity pointer-events-auto`}
            >
              {isSharing ? (
                 <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                 <i className="fa-solid fa-paper-plane"></i> 
              )}
              {isSharing ? 'Paylaşılıyor...' : 'Şimdi Paylaş'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
