import React from 'react';
import { useTranslations } from 'next-intl';

type YoutubeSettingsProps = {
  selectedPlatforms: Record<string, boolean>;
  setYtCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setYtPrivacy: React.Dispatch<React.SetStateAction<string>>;
  setYtTitle: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
  ytCustomCaption: string;
  ytPrivacy: string;
  ytTitle: string;
};

export function YoutubeSettings({ selectedPlatforms, setYtCustomCaption, setYtPrivacy, setYtTitle, t, ytCustomCaption, ytPrivacy, ytTitle }: YoutubeSettingsProps) {
  return (
    selectedPlatforms['youtube'] && (
      <div className="bg-[#201D24]/30 rounded-[14px] border border-[#FF0000]/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-50"></div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-youtube text-[#FF0000]"></i>
              <span className="text-[#F6F1EC] font-semibold text-sm">YouTube</span>
            </div>
            <select value={ytPrivacy} onChange={e => setYtPrivacy(e.target.value)} className="bg-[#201D24]/50 border border-white/5 rounded text-[#F6F1EC] text-[11px] px-2 py-1 outline-none">
              <option value="public">{t("sharePage.youtube.privacyPublic")}</option>
              <option value="unlisted">{t("sharePage.youtube.privacyUnlisted")}</option>
              <option value="private">{t("sharePage.youtube.privacyPrivate")}</option>
            </select>
          </div>
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.youtube.titleLabel")}</label>
          <input type="text" value={ytTitle} onChange={e => setYtTitle(e.target.value)} placeholder={t("sharePage.youtube.titlePlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-4 focus:outline-none focus:border-[#FF0000]/50" />
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.youtube.descriptionLabel")}</label>
          <textarea value={ytCustomCaption} onChange={e => setYtCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#FF0000]/50"></textarea>
        </div>
      </div>
    )
  );
}
