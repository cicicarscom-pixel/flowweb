import React from 'react';
import { useTranslations } from 'next-intl';

type BlueskySettingsProps = {
  bskyCustomCaption: string;
  bskyIsThread: boolean;
  selectedPlatforms: Record<string, boolean>;
  setBskyCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setBskyIsThread: React.Dispatch<React.SetStateAction<boolean>>;
  t: ReturnType<typeof useTranslations>;
};

export function BlueskySettings({ bskyCustomCaption, bskyIsThread, selectedPlatforms, setBskyCustomCaption, setBskyIsThread, t }: BlueskySettingsProps) {
  return (
    selectedPlatforms['bluesky'] && (
      <div className="bg-[#201D24]/30 rounded-[14px] border border-[#0085ff]/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0085ff] to-transparent opacity-50"></div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg leading-none">☁️</span>
            <span className="text-[#F6F1EC] font-semibold text-sm">Bluesky</span>
          </div>
          <button onClick={() => setBskyIsThread(!bskyIsThread)} className="flex items-center gap-2 mb-4 group">
            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${bskyIsThread ? 'bg-[#22B573] border-[#22B573]' : 'border-white/20 group-hover:border-white/40'}`}>
              {bskyIsThread && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
            </div>
            <span className="text-[#F6F1EC] text-xs font-medium">{t("sharePage.bluesky.threadToggle")}</span>
          </button>
          {bskyIsThread && <p className="text-[#A79E96]/70 text-[10px] mb-4">{t("sharePage.bluesky.threadDescription")}</p>}
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={bskyCustomCaption} onChange={e => setBskyCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#0085ff]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mt-1">{bskyCustomCaption.length}/300</p>
        </div>
      </div>
    )
  );
}
