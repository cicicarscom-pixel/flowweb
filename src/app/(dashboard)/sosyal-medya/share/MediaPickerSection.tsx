import React from 'react';
import { useTranslations } from 'next-intl';

type MediaPickerSectionProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  localImage: string | null;
  needsInstagramCrop: boolean;
  selectedPlatforms: Record<string, boolean>;
  setIsCropperOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: ReturnType<typeof useTranslations>;
};

export function MediaPickerSection({ fileInputRef, handleFileSelect, localImage, needsInstagramCrop, selectedPlatforms, setIsCropperOpen, t }: MediaPickerSectionProps) {
  return (
    <div className="flex flex-col items-center w-full relative gap-2">
      <div className="w-full aspect-square max-w-[350px] p-[3px] rounded-[24px] relative group overflow-hidden bg-white/5">
        {/* Fake Animated Border */}
        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]" style={{
          background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #FF7A59 90%, #ffffff 100%)'
        }}></div>
        
        <div 
          className="absolute inset-[3px] bg-[#131314] rounded-[21px] flex items-center justify-center bg-[#2a2a2b]/50 overflow-hidden z-10 cursor-pointer hover:bg-[#2a2a2b]/70 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*,video/*" 
            onChange={handleFileSelect} 
          />
          {localImage ? (
            <div className="relative w-full h-full group/image">
              {localImage.startsWith('data:video') ? (
                <video src={localImage} controls className="w-full h-full object-contain" />
              ) : (
                <img src={localImage} alt="uploaded" className="w-full h-full object-contain" />
              )}
              {selectedPlatforms['instagram'] && !localImage.startsWith('data:video') && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsCropperOpen(true); }}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_4px_12px_rgba(225,48,108,0.4)] opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center gap-2"
                >
                  <i className="fa-solid fa-crop-simple"></i> {t("sharePage.imageContainer.cropButton")}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 bg-[#FF7A59]/10 rounded-full p-4 border border-[#FF7A59]/30 border-dashed">
                <i className="fa-regular fa-image text-4xl text-[#FF7A59]"></i>
              </div>
              <span className="text-[#A79E96] text-base text-center px-4 font-medium mb-1">
                {t("sharePage.imageContainer.selectTitle")}
              </span>
              <span className="text-[#A79E96]/60 text-xs text-center px-8">
                {t("sharePage.imageContainer.selectSubtitle")}
              </span>
            </div>
          )}
        </div>
      </div>
    
      {needsInstagramCrop && (
        <div className="mt-2 flex items-center gap-2 bg-[#E1306C]/10 border border-[#E1306C]/30 rounded-lg px-3 py-2 max-w-[350px] w-full">
          <i className="fa-solid fa-triangle-exclamation text-[#E1306C] shrink-0"></i>
          <span className="text-[#E1306C] text-xs font-medium flex-1">
            {t("sharePage.imageContainer.cropWarning")}
          </span>
          <button
            onClick={() => setIsCropperOpen(true)}
            className="bg-[#E1306C] text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-[#c72a5f] transition-colors shrink-0"
          >
            {t("sharePage.imageContainer.cropNow")}
          </button>
        </div>
      )}
    </div>
  );
}
