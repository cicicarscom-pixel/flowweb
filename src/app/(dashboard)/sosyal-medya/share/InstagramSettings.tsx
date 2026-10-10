import React from 'react';
import { useTranslations } from 'next-intl';

type InstagramSettingsProps = {
  igAiLabel: boolean;
  igCustomCaption: string;
  igFirstComment: string;
  igFormat: string;
  selectedPlatforms: Record<string, boolean>;
  setIgAiLabel: React.Dispatch<React.SetStateAction<boolean>>;
  setIgCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setIgFirstComment: React.Dispatch<React.SetStateAction<string>>;
  setIgFormat: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
};

export function InstagramSettings({ igAiLabel, igCustomCaption, igFirstComment, igFormat, selectedPlatforms, setIgAiLabel, setIgCustomCaption, setIgFirstComment, setIgFormat, t }: InstagramSettingsProps) {
  return (
    selectedPlatforms['instagram'] && (
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
          {igFormat === 'Story' && <p className="text-[#A79E96]/70 text-[11px] mb-4">{t("sharePage.platforms.storyWarning")}</p>}
          <button onClick={() => setIgAiLabel(!igAiLabel)} className="flex items-start gap-2 mb-4 group text-left">
            <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${igAiLabel ? 'bg-[#22B573] border-[#22B573]' : 'border-white/20 group-hover:border-white/40'}`}>
              {igAiLabel && <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>}
            </div>
            <div>
              <p className="text-[#F6F1EC] text-xs font-medium">{t("sharePage.instagram.aiLabelTitle")}</p>
              <p className="text-[#A79E96]/60 text-[10px] mt-0.5 leading-tight">{t("sharePage.instagram.aiLabelDescription")}</p>
            </div>
          </button>
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.firstCommentLabel")}</label>
          <textarea value={igFirstComment} onChange={e => setIgFirstComment(e.target.value)} placeholder={t("sharePage.platforms.firstCommentPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#C2478D]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{igFirstComment.length}/2200</p>
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={igCustomCaption} onChange={e => setIgCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#C2478D]/50"></textarea>
        </div>
      </div>
    )
  );
}
