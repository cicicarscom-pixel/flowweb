import React from 'react';
import { useTranslations } from 'next-intl';

type PinterestSettingsProps = {
  pinCustomCaption: string;
  pinLink: string;
  pinTitle: string;
  selectedPlatforms: Record<string, boolean>;
  setPinCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setPinLink: React.Dispatch<React.SetStateAction<string>>;
  setPinTitle: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
};

export function PinterestSettings({ pinCustomCaption, pinLink, pinTitle, selectedPlatforms, setPinCustomCaption, setPinLink, setPinTitle, t }: PinterestSettingsProps) {
  return (
    selectedPlatforms['pinterest'] && (
      <div className="bg-[#201D24]/30 rounded-[14px] border border-[#E60023]/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E60023] to-transparent opacity-50"></div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-brands fa-pinterest text-[#E60023]"></i>
            <span className="text-[#F6F1EC] font-semibold text-sm">Pinterest</span>
          </div>
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.pinterest.titleLabel")}</label>
          <input type="text" value={pinTitle} onChange={e => setPinTitle(e.target.value)} placeholder={t("sharePage.pinterest.titlePlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 focus:outline-none focus:border-[#E60023]/50" />
          <p className="text-[#A79E96]/50 text-[10px] mb-4">{t("sharePage.pinterest.titleHint")}</p>
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.pinterest.linkLabel")}</label>
          <input type="url" value={pinLink} onChange={e => setPinLink(e.target.value)} placeholder="https://example.com" className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 focus:outline-none focus:border-[#E60023]/50" />
          <p className="text-[#A79E96]/50 text-[10px] mb-4">{t("sharePage.pinterest.linkHint")}</p>
    
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={pinCustomCaption} onChange={e => setPinCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#E60023]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mt-1">{pinCustomCaption.length}/500</p>
        </div>
      </div>
    )
  );
}
