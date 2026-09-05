"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/actions/locale";

const LANGUAGE_OPTIONS = [
  { code: "tr", labelKey: "common.language.turkish" as const },
  { code: "en", labelKey: "common.language.english" as const },
  { code: "de", labelKey: "common.language.german" as const },
];

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (code: string) => {
    if (code === locale || isPending) return;
    startTransition(async () => {
      await setLocale(code);
      // Sunucu bileşenlerinin (layout, page'ler) yeni dille yeniden render
      // olması için router.refresh() gerekiyor — next-intl'in "without i18n
      // routing" modunda dil bir çerezde tutulduğundan URL değişmiyor.
      router.refresh();
    });
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {LANGUAGE_OPTIONS.map((opt) => {
        const active = locale === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => handleSelect(opt.code)}
            title={t(opt.labelKey)}
            disabled={isPending}
            style={{
              flex: 1,
              padding: "5px 0",
              borderRadius: 8,
              border: `1px solid ${active ? "#22B573" : "rgba(255,255,255,0.08)"}`,
              background: active ? "rgba(34,181,115,0.12)" : "rgba(255,255,255,0.03)",
              color: active ? "#22B573" : "var(--text-secondary)",
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              cursor: isPending ? "default" : "pointer",
              textTransform: "uppercase",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {opt.code}
          </button>
        );
      })}
    </div>
  );
}
