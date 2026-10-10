import React from 'react';
import { useTranslations } from 'next-intl';

type TwitterSettingsProps = {
  selectedPlatforms: Record<string, boolean>;
  setTwCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setTwIsThread: React.Dispatch<React.SetStateAction<boolean>>;
  t: ReturnType<typeof useTranslations>;
  twCustomCaption: string;
  twIsThread: boolean;
};

export function TwitterSettings({ selectedPlatforms, setTwCustomCaption, setTwIsThread, t, twCustomCaption, twIsThread }: TwitterSettingsProps) {
  return (
    selectedPlatforms['twitter'] && (
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
            <span className="text-[#F6F1EC] text-xs font-medium">{t("sharePage.twitter.threadToggle")}</span>
          </button>
          {twIsThread && <p className="text-[#A79E96]/70 text-[10px] mb-4">{t("sharePage.twitter.threadDescription")}</p>}
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={twCustomCaption} onChange={e => setTwCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-white/30"></textarea>
        </div>
      </div>
    )
  );
}
