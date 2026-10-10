import React from 'react';
import { useTranslations } from 'next-intl';

type FacebookSettingsProps = {
  fbCustomCaption: string;
  fbFirstComment: string;
  fbFormat: string;
  selectedPlatforms: Record<string, boolean>;
  setFbCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setFbFirstComment: React.Dispatch<React.SetStateAction<string>>;
  setFbFormat: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
};

export function FacebookSettings({ fbCustomCaption, fbFirstComment, fbFormat, selectedPlatforms, setFbCustomCaption, setFbFirstComment, setFbFormat, t }: FacebookSettingsProps) {
  return (
    selectedPlatforms['facebook'] && (
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
          {fbFormat === 'Story' && <p className="text-[#A79E96]/70 text-[11px] mb-4">{t("sharePage.platforms.storyWarning")}</p>}
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.firstCommentLabel")}</label>
          <textarea value={fbFirstComment} onChange={e => setFbFirstComment(e.target.value)} placeholder={t("sharePage.platforms.firstCommentPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{fbFirstComment.length}/8000</p>
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={fbCustomCaption} onChange={e => setFbCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#1877F2]/50"></textarea>
        </div>
      </div>
    )
  );
}
