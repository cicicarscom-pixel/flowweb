"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import CropperModal from '@/components/CropperModal';

const PLATFORMS_DATA = [
  { id: "instagram", name: "Instagram", color: "#E1306C", icon: "fa-instagram" },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "fa-facebook" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", icon: "fa-linkedin" },
  { id: "twitter", name: "X", color: "#ffffff", icon: "fa-x-twitter" },
  { id: "youtube", name: "YouTube", color: "#FF0000", icon: "fa-youtube" },
  { id: "tiktok", name: "TikTok", color: "#FF7A59", icon: "fa-tiktok" },
  { id: "pinterest", name: "Pinterest", color: "#E60023", icon: "fa-pinterest" },
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
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 10);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });
  const [timezone, setTimezone] = useState('Europe/Istanbul');

  const TIMEZONES = [
    { value: 'Europe/Istanbul', label: 'Europe/Istanbul (GMT+3)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (GMT+9)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10)' }
  ];

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

  // TikTok
  const [ttSaveToInbox, setTtSaveToInbox] = useState(false);
  const [ttCustomCaption, setTtCustomCaption] = useState('');

  // Pinterest
  const [pinTitle, setPinTitle] = useState('');
  const [pinLink, setPinLink] = useState('');
  const [pinCustomCaption, setPinCustomCaption] = useState('');

  // YouTube
  const [ytTitle, setYtTitle] = useState('');
  const [ytPrivacy, setYtPrivacy] = useState('public');
  const [ytCustomCaption, setYtCustomCaption] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).maybeSingle();
        const organizationId = orgMember?.organization_id || userId;

        const { data } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('profile_id', organizationId)
          .eq('status', 'active');

        const accounts = data || [];
        setZernioAccounts(accounts);
        
        const initialSelected: Record<string, boolean> = {};
        accounts.forEach((acc: any) => {
          initialSelected[acc.platform.toLowerCase()] = true;
        });
        setSelectedPlatforms(initialSelected);
      } catch(e) {
        console.warn("Failed to fetch accounts", e);
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const [tags, setTags] = useState<string[]>(['yaz', 'yenisezon']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState("");

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
      
      if (p === 'facebook') {
        platformOptions = {
          format: fbFormat,
          firstComment: fbFirstComment,
          caption: fbCustomCaption || undefined
        };
      } else if (p === 'instagram') {
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
      } else if (p === 'tiktok') {
        platformOptions = {
          saveToInboxAsDraft: ttSaveToInbox,
          caption: ttCustomCaption || undefined
        };
      } else if (p === 'pinterest') {
        platformOptions = {
          title: pinTitle || undefined,
          link: pinLink || undefined,
          caption: pinCustomCaption || undefined
        };
      } else if (p === 'youtube') {
        platformOptions = {
          title: ytTitle || undefined,
          privacyStatus: ytPrivacy,
          caption: ytCustomCaption || undefined
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

    let finalScheduledFor: string | undefined = undefined;
    if (publishMode === 'schedule') {
      try {
        const parts = scheduleDate.trim().split(' ');
        if (parts.length !== 2) throw new Error();
        const dateParts = parts[0].split('.');
        const timeParts = parts[1].split(':');
        
        // Zernio schedule format: YYYY-MM-DDTHH:mm:00 
        finalScheduledFor = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}T${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
      } catch (err) {
        return alert("Tarih formatı hatalı. Lütfen 'GÜN.AY.YIL SAAT:DAKİKA' (örn: 16.08.2026 16:26) şeklinde girin.");
      }
    }

    setIsSharing(true);
    setUploadProgress(0);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 500);

    try {
      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: {
          action: 'create-post',
          payload: {
            content: localText || prompt,
            mediaItems: localImage ? [{ url: localImage }] : [],
            platforms: platformsToShare,
            publishNow: publishMode === 'now',
            scheduledFor: finalScheduledFor,
            timezone: timezone,
          }
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        alert("Gönderi başarıyla paylaşıldı!");
        setIsSharing(false);
        setUploadProgress(0);
      }, 500);
    } catch (e: any) {
      console.error(e);
      clearInterval(progressInterval);
      setIsSharing(false);
      setUploadProgress(0);
      alert("Gönderi paylaşılırken bir hata oluştu: " + e.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-on-surface">
      <div className="h-14 flex items-center justify-between px-5 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/sosyal-medya" className="text-[#A79E96] hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Link>
          <h1 className="text-lg font-bold text-[#F6F1EC]">Paylaşım Merkezi</h1>
        </div>
        <button className="text-[#F6F1EC] hover:bg-white/10 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Input Section */}
          <div>
            <label className="block text-[#A79E96] text-xs font-medium uppercase tracking-wider mb-2 ml-1">
              Ne Paylaşalım?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Yeni yaz koleksiyonumuz için enerjik bir post..."
              className="w-full bg-[#201D24]/50 rounded-lg border border-white/10 text-[#F6F1EC] text-base p-3 min-h-[100px] focus:outline-none focus:border-white/20 resize-none"
            ></textarea>
          </div>

          {/* Central Feature: Image Container */}
          <div className="flex justify-center w-full relative">
            <div className="w-full aspect-square max-w-[350px] p-[3px] rounded-[24px] relative group overflow-hidden bg-white/5">
              {/* Fake Animated Border */}
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]" style={{
                background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #FF7A59 90%, #ffffff 100%)'
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
                  <div className="relative w-full h-full group/image">
                    {localImage.startsWith('data:video') ? (
                      <video src={localImage} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={localImage} alt="uploaded" className="w-full h-full object-contain" />
                    )}
                    {selectedPlatforms['instagram'] && !localImage.startsWith('data:video') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsCropperOpen(true); }}
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_4px_12px_rgba(225,48,108,0.4)] opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        <i className="fa-solid fa-crop-simple"></i> Kırp (Instagram 4:5)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 bg-[#FF7A59]/10 rounded-full p-4 border border-[#FF7A59]/30 border-dashed">
                      <i className="fa-regular fa-image text-4xl text-[#FF7A59]"></i>
                    </div>
                    <span className="text-[#A79E96] text-base text-center px-4 font-medium mb-1">
                      Görsel & Video Seç ya da Üret
                    </span>
                    <span className="text-[#A79E96]/60 text-xs text-center px-8">
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
              background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #C2478D 90%, #ffffff 100%)'
            }}></div>
            <div className="relative bg-[#131314] rounded-[17px] p-5 z-10">
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#F6F1EC] text-lg font-semibold">İçerik Metni</h2>
                <button 
                  onClick={() => setIsEditingCaption(!isEditingCaption)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <i className={`fa-solid ${isEditingCaption ? 'fa-check text-[#C2478D]' : 'fa-pen text-[#FF7A59]'}`}></i>
                </button>
              </div>

              <div className={`bg-[#201D24]/50 rounded-lg p-3 border ${isEditingCaption ? 'border-[#C2478D]' : 'border-white/5'} min-h-[200px] mb-4`}>
                {isEditingCaption ? (
                  <textarea
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    placeholder="Yapay zeka tarafından üretilen metin veya kendi metniniz..."
                    className="w-full h-full bg-transparent text-[#F6F1EC] text-sm leading-5 resize-none focus:outline-none min-h-[180px]"
                  ></textarea>
                ) : (
                  <p className="text-[#A79E96]/80 text-sm leading-5 whitespace-pre-wrap">
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
                  className="flex-1 bg-[#201D24] rounded-full px-4 py-2 text-[#F6F1EC] border border-[#3b494b] focus:outline-none focus:border-[#C2478D] text-sm"
                />
                <button 
                  onClick={generateCaption}
                  disabled={isGeneratingText}
                  className={`w-10 h-10 rounded-full ${isGeneratingText ? 'bg-[#C2478D]/50' : 'bg-[#C2478D] hover:bg-[#a10ce0]'} flex items-center justify-center shrink-0 transition-colors`}
                >
                  {isGeneratingText ? (
                    <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
                  ) : (
                    <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 items-center mt-2">
                {tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setLocalText(prev => prev + (prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '') + '#' + tag)} 
                    className="bg-[#FF7A59]/10 px-3 py-1 rounded-full border border-[#FF7A59]/20 text-[#FF7A59] text-xs font-medium hover:bg-[#FF7A59]/20 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
                
                {isAddingTag ? (
                  <div className="flex items-center bg-[#201D24] rounded-full px-2 py-1 border border-[#22B573]/50 shadow-[0_0_8px_rgba(34,181,115,0.2)]">
                    <span className="text-[#22B573] text-xs mr-1 font-medium">#</span>
                    <input 
                      type="text" 
                      value={newTagText}
                      onChange={e => setNewTagText(e.target.value.replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]/g, ''))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTagText.trim() && !tags.includes(newTagText.trim())) {
                            setTags(prev => [...prev, newTagText.trim()]);
                            setNewTagText("");
                            setIsAddingTag(false);
                          }
                        } else if (e.key === 'Escape') {
                          setIsAddingTag(false);
                          setNewTagText("");
                        }
                      }}
                      onBlur={() => {
                        if (newTagText.trim() && !tags.includes(newTagText.trim())) {
                          setTags(prev => [...prev, newTagText.trim()]);
                        }
                        setNewTagText("");
                        setIsAddingTag(false);
                      }}
                      autoFocus
                      className="bg-transparent text-[#F6F1EC] text-xs font-medium outline-none w-20"
                      placeholder="yaz"
                    />
                  </div>
                ) : (
                  <button onClick={() => setIsAddingTag(true)} className="px-3 py-1 flex items-center gap-1 hover:bg-white/5 rounded-full transition-colors text-[#A79E96]">
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span className="text-xs font-medium">Etiket ekle</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Profiles Section */}
          <div className="mt-6">
            <label className="block text-[#A79E96] text-xs font-medium mb-3">Bağlantılı Hesaplar (Platformlar)</label>
            
            {zernioAccounts.length === 0 ? (
              <div className="text-center p-4 bg-[#201D24]/30 rounded-lg border border-white/5">
                <p className="text-[#A79E96]/70 text-xs mb-2">Henüz bağlı bir hesap yok.</p>
                <Link href="/sosyal-medya" className="text-[#22B573] text-xs font-medium">Hesap Bağla</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {zernioAccounts.map((acc, i) => {
                  const platformKey = acc.platform.toLowerCase();
                  const platformConfig = PLATFORMS_DATA.find(p => p.id === platformKey) || {
                    id: platformKey,
                    name: acc.platform,
                    color: "#F6F1EC",
                    icon: "fa-globe"
                  };
                  const isSelected = selectedPlatforms[platformKey];
                  return (
                    <button 
                      key={acc.id || i}
                      onClick={() => togglePlatform(platformKey)}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                        isSelected ? 'bg-[#22B573]/10 border-[#22B573]/50 shadow-[0_0_10px_rgba(34,181,115,0.15)]' : 'bg-[#201D24]/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {platformConfig.icon && !platformConfig.icon.startsWith('fa-') ? (
                          <span className="text-xl shrink-0 leading-none">{platformConfig.icon}</span>
                        ) : (
                          <i className={`fa-brands ${platformConfig.icon} text-xl shrink-0`} style={{ color: platformKey === 'twitter' && !isSelected ? '#A79E96' : platformConfig.color }}></i>
                        )}
                        <div className="flex flex-col items-start overflow-hidden text-left">
                          <span className="text-[#F6F1EC] text-[12px] font-semibold truncate w-full">{platformConfig.name}</span>
                          <span className="text-[#A79E96]/60 text-[10px] truncate w-full">@{acc.account_name || platformKey}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#22B573] flex items-center justify-center shrink-0 ml-1">
                          <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Platform Specific Settings */}
          <div className="mt-6 flex flex-col gap-4">
            
            {/* Facebook */}
            {selectedPlatforms['facebook'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#1877F2]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1877F2] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-facebook text-[#1877F2]"></i>
                      <span className="text-[#F6F1EC] font-semibold text-sm">Facebook</span>
                    </div>
                    <div className="flex bg-[#201D24]/50 p-1 rounded-lg border border-white/5">
                      {['Feed', 'Story', 'Reel'].map(fmt => (
                        <button key={fmt} onClick={() => setFbFormat(fmt)} className={`px-3 py-1 rounded-md text-[10px] font-medium transition-colors ${fbFormat === fmt ? 'bg-[#1877F2] text-white' : 'text-[#A79E96]'}`}>{fmt}</button>
                      ))}
                    </div>
                  </div>
                  {fbFormat === 'Story' && <p className="text-[#A79E96]/70 text-[11px] mb-4">İçerik 24 saat sonra kaybolur. Medya gerektirir.</p>}
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">İlk Yorum (Opsiyonel)</label>
                  <textarea value={fbFirstComment} onChange={e => setFbFirstComment(e.target.value)} placeholder="İlk yoruma eklemek istediğiniz bağlantı veya notu girin..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
                  <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{fbFirstComment.length}/8000</p>
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={fbCustomCaption} onChange={e => setFbCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
                </div>
              </div>
            )}

            {/* Instagram */}
            {selectedPlatforms['instagram'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#C2478D]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C2478D] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-instagram text-[#C2478D]"></i>
                      <span className="text-[#F6F1EC] font-semibold text-sm">Instagram</span>
                    </div>
                    <div className="flex bg-[#201D24]/50 p-1 rounded-lg border border-white/5">
                      {['Feed', 'Story', 'Reel', 'Carousel'].map(fmt => (
                        <button key={fmt} onClick={() => setIgFormat(fmt)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${igFormat === fmt ? 'bg-[#C2478D] text-white' : 'text-[#A79E96]'}`}>{fmt}</button>
                      ))}
                    </div>
                  </div>
                  {igFormat === 'Story' && <p className="text-[#A79E96]/70 text-[11px] mb-4">İçerik 24 saat sonra kaybolur. Medya gerektirir.</p>}
                  <button onClick={() => setIgAiLabel(!igAiLabel)} className="flex items-start gap-2 mb-4 group text-left">
                    <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${igAiLabel ? 'bg-[#22B573] border-[#22B573]' : 'border-white/20 group-hover:border-white/40'}`}>
                      {igAiLabel && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
                    </div>
                    <div>
                      <p className="text-[#F6F1EC] text-xs font-medium">AI ile üretildi olarak işaretle</p>
                      <p className="text-[#A79E96]/60 text-[10px] mt-0.5 leading-tight">Instagram'ın AI içerik etiketini ekler. Medya tamamen veya büyük oranda AI ile oluşturulduğunda kullanın.</p>
                    </div>
                  </button>
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">İlk Yorum (Opsiyonel)</label>
                  <textarea value={igFirstComment} onChange={e => setIgFirstComment(e.target.value)} placeholder="İlk yoruma eklemek istediğiniz bağlantı veya notu girin..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#C2478D]/50"></textarea>
                  <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{igFirstComment.length}/2200</p>
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={igCustomCaption} onChange={e => setIgCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#C2478D]/50"></textarea>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {selectedPlatforms['linkedin'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#0A66C2]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0A66C2] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-linkedin text-[#0A66C2]"></i>
                    <span className="text-[#F6F1EC] font-semibold text-sm">LinkedIn</span>
                  </div>
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">İlk Yorum (Opsiyonel)</label>
                  <textarea value={liFirstComment} onChange={e => setLiFirstComment(e.target.value)} placeholder="Add a İlk Yorum (Opsiyonel) to boost engagement." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
                  <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{liFirstComment.length}/1250</p>
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={liCustomCaption} onChange={e => setLiCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
                </div>
              </div>
            )}

            {/* Twitter/X */}
            {selectedPlatforms['twitter'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-x-twitter text-white"></i>
                    <span className="text-[#F6F1EC] font-semibold text-sm">X (Twitter)</span>
                  </div>
                  <button onClick={() => setTwIsThread(!twIsThread)} className="flex items-center gap-2 mb-4 group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${twIsThread ? 'bg-[#22B573] border-[#22B573]' : 'border-white/20 group-hover:border-white/40'}`}>
                      {twIsThread && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
                    </div>
                    <span className="text-[#F6F1EC] text-xs font-medium">Zincir (Thread) oluştur</span>
                  </button>
                  {twIsThread && <p className="text-[#A79E96]/70 text-[10px] mb-4">Ana metin ilk tweet olur. Altına zincir eklenebilir.</p>}
                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={twCustomCaption} onChange={e => setTwCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-white/30"></textarea>
                </div>
              </div>
            )}

            {/* TikTok */}
            {selectedPlatforms['tiktok'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#FF7A59]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7A59] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-tiktok text-[#FF7A59]"></i>
                    <span className="text-[#F6F1EC] font-semibold text-sm">TikTok</span>
                  </div>
                  
                  <label className="flex items-start gap-3 cursor-pointer mb-4 p-3 rounded-lg border border-white/5 bg-[#201D24]/50 hover:bg-[#201D24]/80 transition-colors">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={ttSaveToInbox} 
                        onChange={(e) => setTtSaveToInbox(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-transparent text-[#FF7A59] focus:ring-0 focus:ring-offset-0"
                      />
                    </div>
                    <div>
                      <span className="block text-[#F6F1EC] text-xs font-semibold mb-1">TikTok taslaklarına kaydet</span>
                      <span className="block text-[#A79E96]/70 text-[10px] leading-relaxed">
                        Video direkt yayınlanmaz, taslak olarak yüklenir. İsterseniz TikTok üzerinden müzik ekleyip yayınlayabilirsiniz.
                      </span>
                    </div>
                  </label>

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={ttCustomCaption} onChange={e => setTtCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#FF7A59]/50"></textarea>
                  <p className="text-[#A79E96]/50 text-[10px] text-right mt-1">{ttCustomCaption.length}/2200</p>
                </div>
              </div>
            )}

            {/* Pinterest */}
            {selectedPlatforms['pinterest'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#E60023]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E60023] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-brands fa-pinterest text-[#E60023]"></i>
                    <span className="text-[#F6F1EC] font-semibold text-sm">Pinterest</span>
                  </div>

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Başlık (Opsiyonel)</label>
                  <input type="text" value={pinTitle} onChange={e => setPinTitle(e.target.value)} placeholder="Pin'iniz için özel bir başlık girin..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 focus:outline-none focus:border-[#E60023]/50" />
                  <p className="text-[#A79E96]/50 text-[10px] mb-4">Zorunlu değildir. Boş bırakılırsa ana metnin ilk satırı başlık yapılır.</p>

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Hedef Bağlantı (Opsiyonel)</label>
                  <input type="url" value={pinLink} onChange={e => setPinLink(e.target.value)} placeholder="https://example.com" className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 focus:outline-none focus:border-[#E60023]/50" />
                  <p className="text-[#A79E96]/50 text-[10px] mb-4">Pin'e tıklandığında gidilecek URL bağlantısını belirler.</p>

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Özel Açıklama (Opsiyonel)</label>
                  <textarea value={pinCustomCaption} onChange={e => setPinCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#E60023]/50"></textarea>
                  <p className="text-[#A79E96]/50 text-[10px] text-right mt-1">{pinCustomCaption.length}/500</p>
                </div>
              </div>
            )}

            {/* YouTube */}
            {selectedPlatforms['youtube'] && (
              <div className="bg-[#201D24]/30 rounded-[14px] border border-[#FF0000]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-50"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-youtube text-[#FF0000]"></i>
                      <span className="text-[#F6F1EC] font-semibold text-sm">YouTube</span>
                    </div>
                    <select value={ytPrivacy} onChange={e => setYtPrivacy(e.target.value)} className="bg-[#201D24]/50 border border-white/5 rounded text-[#F6F1EC] text-[11px] px-2 py-1 outline-none">
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">title</label>
                  <input type="text" value={ytTitle} onChange={e => setYtTitle(e.target.value)} placeholder="Video başlığı..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-4 focus:outline-none focus:border-[#FF0000]/50" />

                  <label className="block text-[#A79E96] text-xs font-medium mb-1">Video Açıklaması (Opsiyonel)</label>
                  <textarea value={ytCustomCaption} onChange={e => setYtCustomCaption(e.target.value)} placeholder="Ana metni kullanmak için boş bırakın..." className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#FF0000]/50"></textarea>
                </div>
              </div>
            )}

            {/* Publishing Settings */}
            <div className="mt-2 bg-[#201D24]/50 rounded-[14px] border border-white/5 p-4 mb-20">
              <label className="block text-[#A79E96] text-xs font-medium mb-3">yayıncılık</label>
              <div className="flex bg-[#201D24]/50 p-1 rounded-lg border border-white/5 mb-4">
                <button onClick={() => setPublishMode('schedule')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'schedule' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#A79E96] hover:text-white'}`}>Planlı</button>
                <button onClick={() => setPublishMode('now')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'now' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#A79E96] hover:text-white'}`}>Şimdi</button>
              </div>
              {publishMode === 'schedule' ? (
                <div className="bg-[#22B573]/10 border border-[#22B573]/30 rounded-lg p-3 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-calendar text-[#22B573] mt-0.5"></i>
                    <div className="w-full">
                      <span className="block text-[#F6F1EC] text-xs font-medium mb-1">Zamanlanmış Yayın (Tarih & Saat)</span>
                      <input type="text" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-transparent text-[#22B573] text-sm font-semibold outline-none w-full" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 border-t border-[#22B573]/20 pt-3">
                    <i className="fa-solid fa-earth-americas text-[#22B573] mt-0.5"></i>
                    <div className="w-full relative">
                      <span className="block text-[#F6F1EC] text-xs font-medium mb-1">Timezone</span>
                      <select value={timezone} onChange={e => setTimezone(e.target.value)} className="bg-transparent text-[#22B573] text-sm font-semibold outline-none w-full appearance-none cursor-pointer">
                        {TIMEZONES.map(tz => (
                          <option key={tz.value} value={tz.value} className="bg-[#201D24] text-[#F6F1EC]">{tz.label}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-2 top-6 text-[#22B573] pointer-events-none text-xs"></i>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#22B573]/10 border border-[#22B573]/30 rounded-lg p-3 flex items-start gap-2">
                  <i className="fa-solid fa-circle-info text-[#22B573] mt-0.5"></i>
                  <span className="text-[#22B573] text-xs font-medium leading-tight">Gönderi, seçilen tüm platformlarda anında yayınlanacaktır.</span>
                </div>
              )}
            </div>

          </div>

          {/* Publish Button Bar */}
          <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-5 bg-gradient-to-t from-[#17151A] to-transparent pointer-events-none flex justify-center z-50">
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className={`relative overflow-hidden w-full max-w-sm py-3.5 rounded-full ${isSharing ? 'bg-[#2A2631]' : 'bg-gradient-to-r from-[#22B573] to-[#FF7A59] hover:opacity-90'} text-[#17151A] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,181,115,0.3)] transition-opacity pointer-events-auto`}
            >
              {isSharing && (
                <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#22B573] to-[#FF7A59] opacity-40 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              )}
              <div className={`relative flex items-center gap-2 z-10 ${isSharing ? 'text-white' : 'text-[#17151A]'}`}>
                {isSharing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Yükleniyor... {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> 
                    <span>Şimdi Paylaş</span>
                  </>
                )}
              </div>
            </button>
          </div>
          
        </div>
      </div>
      
      {isCropperOpen && localImage && (
        <CropperModal 
          imageSrc={localImage}
          aspectRatio={4/5}
          onCancel={() => setIsCropperOpen(false)}
          onCropComplete={(croppedImage) => {
             setLocalImage(croppedImage);
             setIsCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}
