"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import CropperModal from '@/components/CropperModal';
import { PLATFORM_MEDIA_RULES } from '@/lib/platformRules';
import { useDialog } from "@/components/ui/DialogProvider";
import { MediaPickerSection } from './MediaPickerSection';
import { CaptionSection } from './CaptionSection';
import { AccountSelectorSection } from './AccountSelectorSection';
import { FacebookSettings } from './FacebookSettings';
import { InstagramSettings } from './InstagramSettings';
import { LinkedinSettings } from './LinkedinSettings';
import { TwitterSettings } from './TwitterSettings';
import { TiktokSettings } from './TiktokSettings';
import { PinterestSettings } from './PinterestSettings';
import { YoutubeSettings } from './YoutubeSettings';
import { BlueskySettings } from './BlueskySettings';
import { PublishBar } from './PublishBar';

const PLATFORMS_DATA = [
  { id: "instagram", name: "Instagram", color: "#E1306C", icon: "fa-instagram" },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "fa-facebook" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", icon: "fa-linkedin" },
  { id: "twitter", name: "X", color: "#ffffff", icon: "fa-x-twitter" },
  { id: "youtube", name: "YouTube", color: "#FF0000", icon: "fa-youtube" },
  { id: "tiktok", name: "TikTok", color: "#FF7A59", icon: "fa-tiktok" },
  { id: "pinterest", name: "Pinterest", color: "#E60023", icon: "fa-pinterest" },
  // 17.09.2026: Bluesky eklendi — /sosyal-medya sayfasındaki "Yeni Hesap Bağla"
  // listesiyle aynı renk/ikon (bkz. app/(dashboard)/sosyal-medya/page.tsx).
  { id: "bluesky", name: "Bluesky", color: "#0085ff", icon: "☁️" },
];

export default function SharePage() {
  const t = useTranslations();
  const dialog = useDialog();
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

  // Bluesky
  // 17.09.2026: Zernio'nun kendi "Create Post" panelinde Bluesky için "thread"
  // ve "custom caption" (300 karakter) alanları görüldü, fakat flowweb'de bu
  // platform hiç işlenmiyordu. Alan adları (isThread/caption) Zernio API'de
  // resmi olarak doğrulanmadı; codebase'deki Twitter/X entegrasyonuyla aynı
  // adlandırma (isThread, caption) kullanıldı çünkü Zernio panelindeki UI
  // birebir aynı (thread toggle + custom caption). zernio-client zaten
  // platformSpecificData'yı platform bağımsız, olduğu gibi SDK'ya geçiriyor
  // (bkz. ledger-repo/supabase/functions/zernio-client/index.ts, ~satır 874),
  // bu yüzden burada yalnızca frontend eksikti. Zernio'dan hata dönerse bu
  // alan adları önce kontrol edilmeli.
  const [bskyIsThread, setBskyIsThread] = useState(false);
  const [bskyCustomCaption, setBskyCustomCaption] = useState('');

  // UI State
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isImageCropped, setIsImageCropped] = useState(false);
  
  const accountsRef = useRef<any[] | null>(null);
  const applyHandoffRef = useRef<(() => Promise<void>) | null>(null);

  const needsInstagramCrop = !!(localImage && !localImage.startsWith('data:video') && selectedPlatforms['instagram'] && !isImageCropped);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      try {
        const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', userId).limit(1).maybeSingle();
        const organizationId = orgMember?.organization_id || userId;

        const { data } = await supabase
          .schema('integration')
          .from('social_accounts')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('is_active', true);

        const accounts = data || [];
        setZernioAccounts(accounts);
        
        const initialSelected: Record<string, boolean> = {};
        accounts.forEach((acc: any) => {
          initialSelected[acc.platform.toLowerCase()] = true;
        });
        setSelectedPlatforms(initialSelected);

        // Flow AI'dan gelen video/paylaşım işi varsa uygula (hesaplar yüklendikten sonra)
        accountsRef.current = accounts;
        await applyHandoffRef.current?.();

      } catch(e) {
        console.warn("Failed to fetch accounts", e);
      }
    };
    fetchAccounts();
  }, [supabase]);

  const generateCaption = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingText(true);
    try {
      const isBase64 = localImage?.startsWith('data:image');
      const base64Data = isBase64 ? localImage?.split(',')[1] : undefined;
      const mimeType = isBase64 ? localImage?.match(/data:(.*?);/)?.[1] : undefined;
      
      // Tek metin servisi (flow-caption, JWT'li): persona tonu + platform kuralları + günlük sınır sunucuda uygulanır.
      // Mobil AI Üretim ile aynı servis ve aynı kurallar. Video gönderilmez (AI metni ürün fotoğrafı/reklam içindir).
      const selectedNames = Object.keys(selectedPlatforms).filter((p) => selectedPlatforms[p]);
      const { data, error } = await supabase.functions.invoke('flow-caption', {
        body: {
          brief: aiPrompt,
          platforms: selectedNames,
          media: isBase64 ? base64Data : undefined,
          mimeType: isBase64 ? mimeType : undefined
        }
      });

      if (error || data?.error) {
        let code: string | undefined = data?.error;
        if (error) {
          try { code = (await (error as any).context?.json?.())?.error; } catch { /* gövde okunamadı */ }
        }
        if (code === 'DAILY_LIMIT') {
          dialog.alert(t("sharePage.errors.captionLimit"));
          return;
        }
        throw new Error(error?.message || data?.error);
      }

      if (data?.text) {
        setLocalText(data.text);
        setIsEditingCaption(true);
      }
    } catch (err: any) {
      dialog.alert(t("sharePage.errors.captionGenerationFailed", { message: err.message }));
    } finally {
      setIsGeneratingText(false);
    }
  };

  const [mediaDurationSec, setMediaDurationSec] = useState(0);

  const loadMediaFile = (file: File, options?: { skipDurationFilter?: boolean }) => {
    setIsImageCropped(false);
    
    const isVideo = file.type.startsWith('video/');
    if (isVideo) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        setMediaDurationSec(duration);
        
        if (options?.skipDurationFilter) return;

        const uncheckedPlatforms: string[] = [];
        const updatedPlatforms = { ...selectedPlatforms };
        for (const platform of Object.keys(updatedPlatforms)) {
          if (updatedPlatforms[platform]) {
            const rule = PLATFORM_MEDIA_RULES[platform.toLowerCase()];
            if (rule && rule.maxDurationSec && duration > rule.maxDurationSec) {
              updatedPlatforms[platform] = false;
              uncheckedPlatforms.push(platform);
            }
          }
        }
        if (uncheckedPlatforms.length > 0) {
          setSelectedPlatforms(updatedPlatforms);
          dialog.alert(t("sharePage.errors.videoRemovedIntro", { seconds: Math.round(duration) }) + "\n\n" +
            uncheckedPlatforms.map(p => t("sharePage.errors.videoRemovedItem", { platform: p.charAt(0).toUpperCase() + p.slice(1), max: PLATFORM_MEDIA_RULES[p.toLowerCase()].maxDurationSec })).join('\n'));
        }
      };
      videoElement.src = URL.createObjectURL(file);
    } else {
      setMediaDurationSec(0);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Flow AI → Paylaşım Merkezi devri: sayfa açılırken VE sayfa açıkken yeni iş gelirse çalışır.
  applyHandoffRef.current = async () => {
    const accounts = accountsRef.current;
    if (!accounts) return; // hesaplar yüklenince fetchAccounts tekrar çağırır
    const { flowAiShareHandoff } = await import('@/lib/flowAiShareHandoff');
    const job = flowAiShareHandoff.takeJob();
    const file = flowAiShareHandoff.getFile();
    if (!job || !file) return;
    loadMediaFile(file, { skipDurationFilter: true });
    setLocalText(job.caption || '');

    const newSelected: Record<string, boolean> = {};
    accounts.forEach((acc: any) => {
      const p = acc.platform.toLowerCase();
      newSelected[p] = job.platforms.includes(p);
    });
    setSelectedPlatforms(newSelected);

    if (job.scheduledLocal) {
      setPublishMode('schedule');
      // convert YYYY-MM-DD HH:mm to DD.MM.YYYY HH:mm
      const [dateStr, timeStr] = job.scheduledLocal.split(' ');
      if (dateStr && timeStr) {
        const [y, m, d] = dateStr.split('-');
        setScheduleDate(`${d}.${m}.${y} ${timeStr}`);
      }
      if (job.timezone) {
        setTimezone(job.timezone);
      }
    } else {
      setPublishMode('now');
    }
  };

  useEffect(() => {
    let off: (() => void) | null = null;
    let alive = true;
    import('@/lib/flowAiShareHandoff').then(({ flowAiShareHandoff }) => {
      if (alive) off = flowAiShareHandoff.subscribe(() => { applyHandoffRef.current?.(); });
    });
    return () => { alive = false; off?.(); };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadMediaFile(file);
    }
  };
  
  const [tags, setTags] = useState<string[]>(['yaz', 'yenisezon']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState("");

  const togglePlatform = (id: string) => {
    const isCurrentlySelected = selectedPlatforms[id];
    
    if (!isCurrentlySelected && localImage?.startsWith('data:video') && mediaDurationSec > 0) {
      const rule = PLATFORM_MEDIA_RULES[id.toLowerCase()];
      if (rule && rule.maxDurationSec && mediaDurationSec > rule.maxDurationSec) {
        dialog.alert(t("sharePage.errors.platformMaxDuration", { platform: id.charAt(0).toUpperCase() + id.slice(1), max: rule.maxDurationSec, actual: Math.round(mediaDurationSec) }));
        return;
      }
    }
    
    setSelectedPlatforms(prev => ({ ...prev, [id]: !prev[id] }));
  };


  const handleShare = async () => {
    // Erken çıkışlarda Flow AI panelinin "paylaşılıyor" durumunda takılı kalmaması için sonucu panele bildir.
    const bail = async (message: string) => {
      dialog.alert(message);
      const { flowAiShareHandoff } = await import('@/lib/flowAiShareHandoff');
      if (flowAiShareHandoff.takeConfirmedRun()) {
        window.dispatchEvent(new CustomEvent('flowai:share-result', { detail: { ok: false, message } }));
      }
    };
    if (needsInstagramCrop) {
      return bail(t("sharePage.imageContainer.cropWarning"));
    }
    if (!localText.trim()) {
      return bail(t("sharePage.errors.noText"));
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
      } else if (p === 'bluesky') {
        platformOptions = {
          isThread: bskyIsThread,
          caption: bskyCustomCaption || undefined
        };
      }

      return { 
        platform: p, 
        accountId: acc._id || acc.id || acc.uuid || acc.zernio_account_id,
        platformSpecificData: Object.keys(platformOptions).length > 0 ? platformOptions : undefined
      };
    }).filter(Boolean);

    if (platformsToShare.length === 0) {
      return bail(t("sharePage.errors.noPlatform"));
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
      } catch {
        return bail(t("sharePage.errors.invalidDateFormat"));
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
      let finalMediaItems: any[] = [];
      if (localImage) {
        if (localImage.startsWith('data:')) {
          const res = await fetch(localImage);
          const blob = await res.blob();
          
          // Get user id for nested folder
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error("No session");
          
          // Medya türü blob'dan okunur: video, görsel gibi .jpg/image/jpeg DAMGALANMAZ (aksi halde YouTube gibi
          // platformlar "video gerekli" hatası verir). Yalnız görseller sıkıştırılır.
          const mime = blob.type || 'application/octet-stream';
          const isVideoBlob = mime.startsWith('video/');
          let uploadBody: Blob | File = blob;
          let uploadMime = mime;
          let ext = isVideoBlob ? (mime.split('/')[1] || 'mp4').split(';')[0].replace('quicktime', 'mov') : 'jpg';
          if (!isVideoBlob) {
            const file = new File([blob], "image.jpg", { type: mime });
            const { compressImage } = await import('@/lib/imageCompress');
            uploadBody = await compressImage(file);
            uploadMime = 'image/jpeg';
            ext = 'jpg';
          }

          const fileName = `${session.user.id}/post-${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

          const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, uploadBody, {
            cacheControl: '3600',
            upsert: false,
            contentType: uploadMime
          });

          if (uploadError) throw new Error("Storage Upload Error: " + uploadError.message);

          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          finalMediaItems = [{ url: publicUrlData.publicUrl, type: isVideoBlob ? 'video' : 'image', mimeType: uploadMime }];
        } else {
          finalMediaItems = [{ url: localImage }];
        }
      }

      const { data, error } = await supabase.functions.invoke('zernio-client', {
        body: {
          action: 'create-post',
          payload: {
            content: localText,
            mediaItems: finalMediaItems,
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
      
      setTimeout(async () => {
        const { flowAiShareHandoff } = await import('@/lib/flowAiShareHandoff');
        dialog.alert(t("sharePage.success.published"));
        if (flowAiShareHandoff.takeConfirmedRun()) {
          window.dispatchEvent(new CustomEvent('flowai:share-result', { detail: { ok: true, message: t("sharePage.success.published") } }));
        }
        setIsSharing(false);
        setUploadProgress(0);
      }, 500);
    } catch (e: any) {
      console.error(e);
      clearInterval(progressInterval);
      setIsSharing(false);
      setUploadProgress(0);
      dialog.alert(t("sharePage.errors.publishFailed", { message: e.message }));
      const { flowAiShareHandoff } = await import('@/lib/flowAiShareHandoff');
      if (flowAiShareHandoff.takeConfirmedRun()) {
        window.dispatchEvent(new CustomEvent('flowai:share-result', { detail: { ok: false, message: e.message } }));
      }
    }
  };

  const shareRef = useRef(handleShare);
  shareRef.current = handleShare;

  useEffect(() => {
    let active = true;
    const register = async () => {
      const { flowAiShareHandoff } = await import('@/lib/flowAiShareHandoff');
      if (!active) return;
      const ready = !!localImage && !!localText && Object.values(selectedPlatforms).some(Boolean) && !isSharing;
      flowAiShareHandoff.registerPage({ ready, share: () => shareRef.current() });
    };
    register();
    return () => {
      active = false;
      import('@/lib/flowAiShareHandoff').then(({ flowAiShareHandoff }) => flowAiShareHandoff.unregisterPage());
    };
  }, [localImage, localText, selectedPlatforms, isSharing]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-on-surface">
      <div className="h-14 flex items-center justify-between px-5 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/sosyal-medya" className="text-[#A79E96] hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Link>
          <h1 className="text-lg font-bold text-[#F6F1EC]">{t("sharePage.header.title")}</h1>
        </div>
        <button className="text-[#F6F1EC] hover:bg-white/10 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Central Feature: Image Container */}
          <MediaPickerSection fileInputRef={fileInputRef} handleFileSelect={handleFileSelect} localImage={localImage} needsInstagramCrop={needsInstagramCrop} selectedPlatforms={selectedPlatforms} setIsCropperOpen={setIsCropperOpen} t={t} />

          {/* Caption Editor */}
          <CaptionSection aiPrompt={aiPrompt} generateCaption={generateCaption} isAddingTag={isAddingTag} isEditingCaption={isEditingCaption} isGeneratingText={isGeneratingText} localImage={localImage} localText={localText} newTagText={newTagText} setAiPrompt={setAiPrompt} setIsAddingTag={setIsAddingTag} setIsEditingCaption={setIsEditingCaption} setLocalText={setLocalText} setNewTagText={setNewTagText} setTags={setTags} t={t} tags={tags} />

          {/* Profiles Section */}
          <AccountSelectorSection PLATFORMS_DATA={PLATFORMS_DATA} selectedPlatforms={selectedPlatforms} t={t} togglePlatform={togglePlatform} zernioAccounts={zernioAccounts} />

          {/* Platform Specific Settings */}
          <div className="mt-6 flex flex-col gap-4">
            
            {/* Facebook */}
            <FacebookSettings fbCustomCaption={fbCustomCaption} fbFirstComment={fbFirstComment} fbFormat={fbFormat} selectedPlatforms={selectedPlatforms} setFbCustomCaption={setFbCustomCaption} setFbFirstComment={setFbFirstComment} setFbFormat={setFbFormat} t={t} />

            {/* Instagram */}
            <InstagramSettings igAiLabel={igAiLabel} igCustomCaption={igCustomCaption} igFirstComment={igFirstComment} igFormat={igFormat} selectedPlatforms={selectedPlatforms} setIgAiLabel={setIgAiLabel} setIgCustomCaption={setIgCustomCaption} setIgFirstComment={setIgFirstComment} setIgFormat={setIgFormat} t={t} />

            {/* LinkedIn */}
            <LinkedinSettings liCustomCaption={liCustomCaption} liFirstComment={liFirstComment} selectedPlatforms={selectedPlatforms} setLiCustomCaption={setLiCustomCaption} setLiFirstComment={setLiFirstComment} t={t} />

            {/* Twitter/X */}
            <TwitterSettings selectedPlatforms={selectedPlatforms} setTwCustomCaption={setTwCustomCaption} setTwIsThread={setTwIsThread} t={t} twCustomCaption={twCustomCaption} twIsThread={twIsThread} />

            {/* TikTok */}
            <TiktokSettings selectedPlatforms={selectedPlatforms} setTtCustomCaption={setTtCustomCaption} setTtSaveToInbox={setTtSaveToInbox} t={t} ttCustomCaption={ttCustomCaption} ttSaveToInbox={ttSaveToInbox} />

            {/* Pinterest */}
            <PinterestSettings pinCustomCaption={pinCustomCaption} pinLink={pinLink} pinTitle={pinTitle} selectedPlatforms={selectedPlatforms} setPinCustomCaption={setPinCustomCaption} setPinLink={setPinLink} setPinTitle={setPinTitle} t={t} />

            {/* YouTube */}
            <YoutubeSettings selectedPlatforms={selectedPlatforms} setYtCustomCaption={setYtCustomCaption} setYtPrivacy={setYtPrivacy} setYtTitle={setYtTitle} t={t} ytCustomCaption={ytCustomCaption} ytPrivacy={ytPrivacy} ytTitle={ytTitle} />

            {/* Bluesky */}
            <BlueskySettings bskyCustomCaption={bskyCustomCaption} bskyIsThread={bskyIsThread} selectedPlatforms={selectedPlatforms} setBskyCustomCaption={setBskyCustomCaption} setBskyIsThread={setBskyIsThread} t={t} />

            {/* Publishing Settings */}
            <div className="mt-2 bg-[#201D24]/50 rounded-[14px] border border-white/5 p-4 mb-20">
              <label className="block text-[#A79E96] text-xs font-medium mb-3">{t("sharePage.publishing.label")}</label>
              <div className="flex bg-[#201D24]/50 p-1 rounded-lg border border-white/5 mb-4">
                <button onClick={() => setPublishMode('schedule')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'schedule' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#A79E96] hover:text-white'}`}>{t("sharePage.publishing.scheduledTab")}</button>
                <button onClick={() => setPublishMode('now')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${publishMode === 'now' ? 'bg-[#2a2a2b] text-white shadow-sm' : 'text-[#A79E96] hover:text-white'}`}>{t("sharePage.publishing.nowTab")}</button>
              </div>
              {publishMode === 'schedule' ? (
                <div className="bg-[#22B573]/10 border border-[#22B573]/30 rounded-lg p-3 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-calendar text-[#22B573] mt-0.5"></i>
                    <div className="w-full">
                      <span className="block text-[#F6F1EC] text-xs font-medium mb-1">{t("sharePage.publishing.scheduledDateTimeLabel")}</span>
                      <input type="text" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="bg-transparent text-[#22B573] text-sm font-semibold outline-none w-full" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 border-t border-[#22B573]/20 pt-3">
                    <i className="fa-solid fa-earth-americas text-[#22B573] mt-0.5"></i>
                    <div className="w-full relative">
                      <span className="block text-[#F6F1EC] text-xs font-medium mb-1">{t("sharePage.publishing.timezoneLabel")}</span>
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
                  <span className="text-[#22B573] text-xs font-medium leading-tight">{t("sharePage.publishing.nowInfo")}</span>
                </div>
              )}
            </div>

          </div>

          {/* Publish Button Bar */}
          <PublishBar handleShare={handleShare} isSharing={isSharing} needsInstagramCrop={needsInstagramCrop} t={t} uploadProgress={uploadProgress} />
          
        </div>
      </div>
      
      {isCropperOpen && localImage && (
        <CropperModal 
          imageSrc={localImage}
          aspectRatio={4/5}
          onCancel={() => setIsCropperOpen(false)}
          onCropComplete={(croppedImage) => {
             setLocalImage(croppedImage);
             setIsImageCropped(true);
             setIsCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}
