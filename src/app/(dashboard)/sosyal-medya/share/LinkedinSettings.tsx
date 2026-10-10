import React from 'react';
import { useTranslations } from 'next-intl';

type LinkedinSettingsProps = {
  liCustomCaption: string;
  liFirstComment: string;
  selectedPlatforms: Record<string, boolean>;
  setLiCustomCaption: React.Dispatch<React.SetStateAction<string>>;
  setLiFirstComment: React.Dispatch<React.SetStateAction<string>>;
  t: ReturnType<typeof useTranslations>;
};

export function LinkedinSettings({ liCustomCaption, liFirstComment, selectedPlatforms, setLiCustomCaption, setLiFirstComment, t }: LinkedinSettingsProps) {
  return (
    selectedPlatforms['linkedin'] && (
      <div className="bg-[#201D24]/30 rounded-[14px] border border-[#0A66C2]/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0A66C2] to-transparent opacity-50"></div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-brands fa-linkedin text-[#0A66C2]"></i>
            <span className="text-[#F6F1EC] font-semibold text-sm">LinkedIn</span>
          </div>
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.firstCommentLabel")}</label>
          <textarea value={liFirstComment} onChange={e => setLiFirstComment(e.target.value)} placeholder={t("sharePage.linkedin.firstCommentPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 mb-1 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
          <p className="text-[#A79E96]/50 text-[10px] text-right mb-4">{liFirstComment.length}/1250</p>
          <label className="block text-[#A79E96] text-xs font-medium mb-1">{t("sharePage.platforms.customCaptionLabel")}</label>
          <textarea value={liCustomCaption} onChange={e => setLiCustomCaption(e.target.value)} placeholder={t("sharePage.platforms.customCaptionPlaceholder")} className="w-full bg-[#201D24]/50 border border-white/5 rounded-lg text-[#F6F1EC] text-sm px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:border-[#0A66C2]/50"></textarea>
        </div>
      </div>
    )
  );
}
