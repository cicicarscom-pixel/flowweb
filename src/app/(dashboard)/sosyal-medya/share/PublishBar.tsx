import React from 'react';
import { useTranslations } from 'next-intl';

type PublishBarProps = {
  handleShare: () => Promise<void>;
  isSharing: boolean;
  needsInstagramCrop: boolean;
  t: ReturnType<typeof useTranslations>;
  uploadProgress: number;
};

export function PublishBar({ handleShare, isSharing, needsInstagramCrop, t, uploadProgress }: PublishBarProps) {
  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-5 bg-gradient-to-t from-[#17151A] to-transparent pointer-events-none flex justify-center z-50">
      <button 
        onClick={handleShare}
        disabled={isSharing || needsInstagramCrop}
        className={`relative overflow-hidden w-full max-w-sm py-3.5 rounded-full ${isSharing || needsInstagramCrop ? 'bg-[#2A2631] opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-[#22B573] to-[#FF7A59] hover:opacity-90'} text-[#17151A] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,181,115,0.3)] transition-opacity pointer-events-auto`}
      >
        {(isSharing || needsInstagramCrop) && (
          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#22B573] to-[#FF7A59] opacity-40 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
        )}
        <div className={`relative flex items-center gap-2 z-10 ${(isSharing || needsInstagramCrop) ? 'text-white' : 'text-[#17151A]'}`}>
          {isSharing ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>{t("sharePage.publishButton.loading", { progress: uploadProgress })}</span>
            </>
          ) : needsInstagramCrop ? (
            <>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{t("sharePage.publishButton.cropRequiredPublishButton")}</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane"></i>
              <span>{t("sharePage.publishButton.now")}</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
