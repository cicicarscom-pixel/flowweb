import React from 'react';
import { useTranslations } from 'next-intl';

type CaptionSectionProps = {
  aiPrompt: string;
  generateCaption: () => Promise<void>;
  isAddingTag: boolean;
  isEditingCaption: boolean;
  isGeneratingText: boolean;
  localImage: string | null;
  localText: string;
  newTagText: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  setIsAddingTag: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingCaption: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalText: React.Dispatch<React.SetStateAction<string>>;
  setNewTagText: React.Dispatch<React.SetStateAction<string>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  t: ReturnType<typeof useTranslations>;
  tags: string[];
};

export function CaptionSection({ aiPrompt, generateCaption, isAddingTag, isEditingCaption, isGeneratingText, localImage, localText, newTagText, setAiPrompt, setIsAddingTag, setIsEditingCaption, setLocalText, setNewTagText, setTags, t, tags }: CaptionSectionProps) {
  return (
    <div className="w-full p-[3px] rounded-[20px] relative overflow-hidden bg-white/5">
      <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]" style={{
        background: 'linear-gradient(to bottom right, transparent 0%, transparent 40%, #C2478D 90%, #ffffff 100%)'
      }}></div>
      <div className="relative bg-[#131314] rounded-[17px] p-5 z-10">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#F6F1EC] text-lg font-semibold">{t("sharePage.captionEditor.title")}</h2>
          <button 
            onClick={() => setIsEditingCaption(!isEditingCaption)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <i className={`fa-solid ${isEditingCaption ? 'fa-check text-[#C2478D]' : 'fa-pen text-[#FF7A59]'}`}></i>
          </button>
        </div>
    
        <div className={`bg-[#201D24]/50 rounded-lg p-3 border ${isEditingCaption ? 'border-[#C2478D]' : 'border-white/5'} min-h-[200px] mb-4`}>
          {isEditingCaption ? (
            <textarea
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              placeholder={t("sharePage.captionEditor.editPlaceholder")}
              className="w-full h-full bg-transparent text-[#F6F1EC] text-sm leading-5 resize-none focus:outline-none min-h-[180px]"
            ></textarea>
          ) : (
            <p className="text-[#A79E96]/80 text-sm leading-5 whitespace-pre-wrap">
              {localText || t("sharePage.captionEditor.emptyPreview")}
            </p>
          )}
        </div>
    
        {/* AI Chat Input for Caption */}
        <div className="flex items-center mb-4 gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t("sharePage.captionEditor.aiPromptPlaceholder")}
            className="flex-1 bg-[#201D24] rounded-full px-4 py-2 text-[#F6F1EC] border border-[#3b494b] focus:outline-none focus:border-[#C2478D] text-sm"
          />
          <button 
            onClick={generateCaption}
            disabled={isGeneratingText}
            className={`w-10 h-10 rounded-full ${isGeneratingText ? 'bg-[#C2478D]/50' : 'bg-[#C2478D] hover:bg-[#a10ce0]'} flex items-center justify-center shrink-0 transition-colors`}
          >
            {isGeneratingText ? (
              <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles text-white"></i>
            )}
          </button>
        </div>
        <p
          data-testid="ai-caption-note"
          className={`text-[11px] leading-4 mb-4 ${localImage?.startsWith('data:video') ? 'text-[#F5A524] font-semibold' : 'text-[#A79E96]/80'}`}
        >
          {t("sharePage.captionEditor.aiCaptionNote")}
        </p>
    
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {tags.map(tag => (
            <button 
              key={tag} 
              onClick={() => setLocalText(prev => prev + (prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '') + '#' + tag)} 
              className="bg-[#FF7A59]/10 px-3 py-1 rounded-full border border-[#FF7A59]/20 text-[#FF7A59] text-xs font-medium hover:bg-[#FF7A59]/20 transition-colors"
            >
              #{tag}
            </button>
          ))}
          
          {isAddingTag ? (
            <div className="flex items-center bg-[#201D24] rounded-full px-2 py-1 border border-[#22B573]/50 shadow-[0_0_8px_rgba(34,181,115,0.2)]">
              <span className="text-[#22B573] text-xs mr-1 font-medium">#</span>
              <input 
                type="text" 
                value={newTagText}
                onChange={e => setNewTagText(e.target.value.replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]/g, ''))}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTagText.trim() && !tags.includes(newTagText.trim())) {
                      setTags(prev => [...prev, newTagText.trim()]);
                      setNewTagText("");
                      setIsAddingTag(false);
                    }
                  } else if (e.key === 'Escape') {
                    setIsAddingTag(false);
                    setNewTagText("");
                  }
                }}
                onBlur={() => {
                  if (newTagText.trim() && !tags.includes(newTagText.trim())) {
                    setTags(prev => [...prev, newTagText.trim()]);
                  }
                  setNewTagText("");
                  setIsAddingTag(false);
                }}
                autoFocus
                className="bg-transparent text-[#F6F1EC] text-xs font-medium outline-none w-20"
                placeholder="yaz"
              />
            </div>
          ) : (
            <button onClick={() => setIsAddingTag(true)} className="px-3 py-1 flex items-center gap-1 hover:bg-white/5 rounded-full transition-colors text-[#A79E96]">
              <i className="fa-solid fa-plus text-xs"></i>
              <span className="text-xs font-medium">{t("sharePage.captionEditor.addTagButton")}</span>
            </button>
          )}
        </div>
    
      </div>
    </div>
  );
}
