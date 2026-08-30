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

import PillGroup, { PillItem } from "./PillGroup";
import PersonaCarousel from "./PersonaCarousel";
import PersonaSlider from "./PersonaSlider";
import type { PublicPersona } from "@/actions/personas";

const ROLES: PillItem[] = [
  { id: "Kebapçı", label: "Kebapçı", icon: "🥙" },
  { id: "Berber", label: "Berber", icon: "💈" },
  { id: "Oto Tamir", label: "Oto Tamir", icon: "🔧" },
  { id: "Market", label: "Market", icon: "🛍️" },
];

const TONES: PillItem[] = [
  { id: "Standart", label: "Standart", icon: "😐" },
  { id: "Komik", label: "Komik", icon: "😆" },
  { id: "Resmi", label: "Resmi", icon: "👔" },
  { id: "Samimi", label: "Samimi", icon: "🤗" },
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
  const showDials = props.selectedPersonaSlug !== null;

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
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#fff" }}>AI Kişiliği</h3>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🏢</span> İŞLETME ROLÜ
        </p>
        <PillGroup items={ROLES} selectedId={props.selectedRole} onSelect={props.onSelectRole} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🧠</span> KARAKTER
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
          <span>🎭</span> ÜSLUP
        </p>
        <PillGroup items={TONES} selectedId={props.selectedTone} onSelect={props.onSelectTone} />
      </div>

      {showDials && (
        <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🎚️</span> KARAKTER AYARLARI
          </p>
          <PersonaSlider label="Karakter Yoğunluğu" value={props.personaIntensity} onChange={props.onPersonaIntensityChange} />
          <PersonaSlider label="Mizah Seviyesi" value={props.humorLevel} onChange={props.onHumorLevelChange} />
          <PersonaSlider label="Modern Uyarlama" value={props.modernAdaptation} onChange={props.onModernAdaptationChange} />
        </div>
      )}
    </div>
  );
}
