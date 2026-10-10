import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type AccountSelectorSectionProps = {
  PLATFORMS_DATA: { id: string; name: string; color: string; icon: string; }[];
  selectedPlatforms: Record<string, boolean>;
  t: ReturnType<typeof useTranslations>;
  togglePlatform: (id: string) => void;
  zernioAccounts: any[];
};

export function AccountSelectorSection({ PLATFORMS_DATA, selectedPlatforms, t, togglePlatform, zernioAccounts }: AccountSelectorSectionProps) {
  return (
    <div className="mt-6">
      <label className="block text-[#A79E96] text-xs font-medium mb-3">{t("sharePage.accounts.label")}</label>
    
      {zernioAccounts.length === 0 ? (
        <div className="text-center p-4 bg-[#201D24]/30 rounded-lg border border-white/5">
          <p className="text-[#A79E96]/70 text-xs mb-2">{t("sharePage.accounts.noneConnected")}</p>
          <Link href="/sosyal-medya" className="text-[#22B573] text-xs font-medium">{t("sharePage.accounts.connectLink")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {zernioAccounts.map((acc, i) => {
            const platformKey = acc.platform.toLowerCase();
            const platformConfig = PLATFORMS_DATA.find(p => p.id === platformKey) || {
              id: platformKey,
              name: acc.platform,
              color: "#F6F1EC",
              icon: "fa-globe"
            };
            const isSelected = selectedPlatforms[platformKey];
            return (
              <button 
                key={acc.id || i}
                onClick={() => togglePlatform(platformKey)}
                className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                  isSelected ? 'bg-[#22B573]/10 border-[#22B573]/50 shadow-[0_0_10px_rgba(34,181,115,0.15)]' : 'bg-[#201D24]/50 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {platformConfig.icon && !platformConfig.icon.startsWith('fa-') ? (
                    <span className="text-xl shrink-0 leading-none">{platformConfig.icon}</span>
                  ) : (
                    <i className={`fa-brands ${platformConfig.icon} text-xl shrink-0`} style={{ color: platformKey === 'twitter' && !isSelected ? '#A79E96' : platformConfig.color }}></i>
                  )}
                  <div className="flex flex-col items-start overflow-hidden text-left">
                    <span className="text-[#F6F1EC] text-[12px] font-semibold truncate w-full">{platformConfig.name}</span>
                    <span className="text-[#A79E96]/60 text-[10px] truncate w-full">@{acc.username || platformKey}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#22B573] flex items-center justify-center shrink-0 ml-1">
                    <i className="fa-solid fa-check text-[10px] text-[#003824]"></i>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
