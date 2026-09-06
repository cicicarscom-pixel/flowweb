"use client";

// ==============================================================================
// PERSONA ENGINE — PHASE 6: AI Kişiliği panel
// ==============================================================================
// The purple "AI Kişiliği" box from page.tsx, extracted and wired to real
// persona data. Role and tone stay hardcoded pill lists (never modeled in the
// DB — they are per-business labels, not personas); only the KARAKTER section
// now comes from ai_personas via PersonaCarousel. The three dial sliders only
// render once a real persona is selected — "Standart" has no dials to tune.
// ==============================================================================

import { useTranslations } from "next-intl";
import { PillItem } from "./PillGroup";
import RoleCarousel from "./RoleCarousel";
import ToneCarousel from "./ToneCarousel";
import PersonaCarousel from "./PersonaCarousel";
import PersonaSlider from "./PersonaSlider";
import type { PublicPersona } from "@/actions/personas";

// id/label ayrımı (i18n Faz 2): `id` değerleri organization_ai_settings.business_role
// / .tone kayıtlarıyla birebir eşleştiği ve mobil (flow-repo) tarafında da aynen
// kullanıldığı için KESİNLİKLE DEĞİŞTİRİLMEZ (bkz. ROLES/TONES sabitlerindeki
// notlar). Sadece kullanıcıya GÖSTERİLEN `label`, aşağıdaki id→i18n-key
// eşlemesiyle `personas.roles.*` / `personas.tones.*` çevirilerinden üretilir.
// Yeni bir rol/üslup eklerken: id'yi ROLES/TONES'e ekle, buraya bir anahtar
// ekle, messages/{tr,en,de}.json'daki personas.roles/tones'a çeviriyi ekle.
const ROLE_KEY_BY_ID: Record<string, string> = {
  "Kebapçı": "kebapci",
  "Berber": "berber",
  "Oto Tamir": "otoTamir",
  "Market": "market",
  "Bayan Giyim": "bayanGiyim",
  "Çiçekçi": "cicekci",
  "Diş Kliniği": "disKlinigi",
  "Giyim Mağazası": "giyimMagazasi",
  "Kurumsal Şirket": "kurumsalSirket",
  "Muayenehane": "muayenehane",
  "Pet Shop": "petShop",
  "Restoran": "restoran",
  "Telefon Tamiri": "telefonTamiri",
  "Unlu Mamüller": "unluMamuller",
  "Veteriner": "veteriner",
};

const TONE_KEY_BY_ID: Record<string, string> = {
  "Standart": "standart",
  "Komik": "komik",
  "Resmi": "resmi",
  "Samimi": "samimi",
  "Neşeli": "neseli",
  "Sakin": "sakin",
  "Dedikoducu": "dedikoducu",
  "Huysuz": "huysuz",
  "Sinirli": "sinirli",
};

// İşletme Rolü: hâlâ hardcoded (ai_personas gibi bir tabloya modellenmiyor —
// bkz. dosya başındaki not), ama artık her rol kendi görseliyle KARAKTER
// bölümüyle aynı kart dilini paylaşıyor (RoleCarousel + PersonaCard compact).
// id değerleri, mevcut organization_ai_settings.business_role kayıtlarıyla
// birebir eşleşmesi için DEĞİŞTİRİLMEDİ (ör. "Kebapçı") — sadece 11 yeni
// sektör eklendi ve tamamına public/ai-asistan/roles/ altında bir görsel
// bağlandı.
const ROLES: (PillItem & { avatarUrl: string })[] = [
  { id: "Kebapçı", label: "Kebapçı", icon: "🥙", avatarUrl: "/ai-asistan/roles/kebapci.png" },
  { id: "Berber", label: "Berber", icon: "💈", avatarUrl: "/ai-asistan/roles/berber.png" },
  { id: "Oto Tamir", label: "Oto Tamir", icon: "🔧", avatarUrl: "/ai-asistan/roles/oto-tamir.png" },
  { id: "Market", label: "Market", icon: "🛍️", avatarUrl: "/ai-asistan/roles/market.png" },
  { id: "Bayan Giyim", label: "Bayan Giyim", icon: "👗", avatarUrl: "/ai-asistan/roles/bayan-giyim.png" },
  { id: "Çiçekçi", label: "Çiçekçi", icon: "💐", avatarUrl: "/ai-asistan/roles/cicekci.png" },
  { id: "Diş Kliniği", label: "Diş Kliniği", icon: "🦷", avatarUrl: "/ai-asistan/roles/dis-klinigi.png" },
  { id: "Giyim Mağazası", label: "Giyim Mağazası", icon: "👕", avatarUrl: "/ai-asistan/roles/giyim-magazasi.png" },
  { id: "Kurumsal Şirket", label: "Kurumsal Şirket", icon: "🏢", avatarUrl: "/ai-asistan/roles/kurumsal-sirket.png" },
  { id: "Muayenehane", label: "Muayenehane", icon: "🩺", avatarUrl: "/ai-asistan/roles/muayenehane.png" },
  { id: "Pet Shop", label: "Pet Shop", icon: "🐾", avatarUrl: "/ai-asistan/roles/pet-shop.png" },
  { id: "Restoran", label: "Restoran", icon: "🍽️", avatarUrl: "/ai-asistan/roles/restoran.png" },
  { id: "Telefon Tamiri", label: "Telefon Tamiri", icon: "📱", avatarUrl: "/ai-asistan/roles/telefon-tamiri.png" },
  { id: "Unlu Mamüller", label: "Unlu Mamüller", icon: "🥐", avatarUrl: "/ai-asistan/roles/unlu-mamuller.png" },
  { id: "Veteriner", label: "Veteriner", icon: "🐶", avatarUrl: "/ai-asistan/roles/veteriner.png" },
];

// Üslup: mevcut 4 tanesi aynen korundu (organization_ai_settings.tone
// kayıtlarıyla uyum için id'ler değişmedi), üzerine 5 yeni mizaç eklendi.
// Görseli olmayanlar (Standart/Komik/Resmi/Samimi) emoji ile kalıyor —
// "Standart" için robot emojisi, tıpkı KARAKTER'deki Standart kartı gibi.
const TONES: (PillItem & { avatarUrl?: string })[] = [
  { id: "Standart", label: "Standart", icon: "🤖" },
  { id: "Komik", label: "Komik", icon: "😆" },
  { id: "Resmi", label: "Resmi", icon: "👔" },
  { id: "Samimi", label: "Samimi", icon: "🤗" },
  { id: "Neşeli", label: "Neşeli", icon: "😄", avatarUrl: "/ai-asistan/tones/neseli.png" },
  { id: "Sakin", label: "Sakin", icon: "😌", avatarUrl: "/ai-asistan/tones/sakin.png" },
  { id: "Dedikoducu", label: "Dedikoducu", icon: "🗣️", avatarUrl: "/ai-asistan/tones/dedikoducu.png" },
  { id: "Huysuz", label: "Huysuz", icon: "😤", avatarUrl: "/ai-asistan/tones/huysuz.png" },
  { id: "Sinirli", label: "Sinirli", icon: "😠", avatarUrl: "/ai-asistan/tones/sinirli.png" },
];

interface AICharacterPanelProps {
  selectedRole: string;
  onSelectRole: (id: string) => void;

  personas: PublicPersona[];
  personasLoading: boolean;
  selectedPersonaSlug: string | null;
  onSelectPersona: (persona: PublicPersona | null) => void;

  selectedTone: string;
  onSelectTone: (id: string) => void;

  personaIntensity: number;
  onPersonaIntensityChange: (v: number) => void;
  humorLevel: number;
  onHumorLevelChange: (v: number) => void;
  modernAdaptation: number;
  onModernAdaptationChange: (v: number) => void;
}

export default function AICharacterPanel(props: AICharacterPanelProps) {
  const t = useTranslations();
  const showDials = props.selectedPersonaSlug !== null;

  // `id` sabit kalır (DB'ye yazılan değer); yalnızca render için çevrilmiş
  // `label` üretilir — bkz. dosya başındaki ROLE_KEY_BY_ID/TONE_KEY_BY_ID notu.
  const translatedRoles = ROLES.map((r) => ({
    ...r,
    label: t(`personas.roles.${ROLE_KEY_BY_ID[r.id]}`),
  }));
  const translatedTones = TONES.map((tn) => ({
    ...tn,
    label: t(`personas.tones.${TONE_KEY_BY_ID[tn.id]}`),
  }));

  return (
    <div
      className="glass"
      style={{
        borderRadius: 24,
        padding: "24px 28px",
        border: "2px solid #C2478D",
        boxShadow: "0 0 20px rgba(194,71,141,0.15)",
        background: "rgba(194,71,141,0.03)",
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#fff" }}>{t("personas.sectionLabels.aiPersonality")}</h3>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🏢</span> {t("personas.sectionLabels.businessRole")}
        </p>
        <RoleCarousel roles={translatedRoles} selectedId={props.selectedRole} onSelect={props.onSelectRole} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🧠</span> {t("personas.sectionLabels.character")}
        </p>
        <PersonaCarousel
          personas={props.personas}
          loading={props.personasLoading}
          selectedSlug={props.selectedPersonaSlug}
          onSelect={props.onSelectPersona}
        />
      </div>

      <div style={{ marginBottom: showDials ? 24 : 0 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🎭</span> {t("personas.sectionLabels.tone")}
        </p>
        <ToneCarousel tones={translatedTones} selectedId={props.selectedTone} onSelect={props.onSelectTone} />
      </div>

      {showDials && (
        <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🎚️</span> {t("personas.sectionLabels.characterSettings")}
          </p>
          <PersonaSlider label={t("personas.sliders.characterIntensity")} value={props.personaIntensity} onChange={props.onPersonaIntensityChange} />
          <PersonaSlider label={t("personas.sliders.humorLevel")} value={props.humorLevel} onChange={props.onHumorLevelChange} />
          <PersonaSlider label={t("personas.sliders.modernAdaptation")} value={props.modernAdaptation} onChange={props.onModernAdaptationChange} />
        </div>
      )}
    </div>
  );
}
