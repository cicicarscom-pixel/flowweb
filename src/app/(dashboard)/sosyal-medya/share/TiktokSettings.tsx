import React from 'react';
import { useTranslations } from 'next-intl';

type TiktokSettingsProps = {
  selectedPlatforms: Record<string, boolean>;
  setTtCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setTtSaveToInbox: React.Dispatch<React.SetStateAction<boolean>>;
  t: ReturnType<typeof useTranslations>;
  ttCustomCaption: string;
  ttSaveToInbox: boolean;
};

export function TiktokSettings({ selectedPlatforms, setTtCustomCaption, setTtSaveToInbox, t, ttCustomCaption, ttSaveToInbox }: TiktokSettingsProps) {
  return (
    selectedPlatforms['tiktok'] && (
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
              <span className="block text-[#F6F1EC] text-xs font-semibold mb-1">{t("sharePage.tiktok.saveToInboxTitle")}</span>
              <span className="block text-[#A79E96]/70 text-[10px] leading-relaxed">
                {t("sharePage.tiktok.saveToInboxDescription")}
              </span>
            </div>
          </label>
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={ttCustomCaption} onChange={e => setTtCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#FF7A59]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mt-1">{ttCustomCaption.length}/2200</p>
        </div>
      </div>
    )
  );
}
