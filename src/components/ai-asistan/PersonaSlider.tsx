"use client";

// ==============================================================================
// PERSONA ENGINE — PHASE 6: persona dial slider
// ==============================================================================
// Exposes persona_intensity / humor_level / modern_adaptation (organization_
// ai_settings columns that Phase 1's schema and Phase 5's saveAiPersonaSettings
// already fully support) as real, editable sliders — before Phase 6 these
// values were only ever set implicitly, to a persona's defaults, and could
// never be tuned from the web UI.
// ==============================================================================

interface PersonaSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PersonaSlider({ label, value, onChange }: PersonaSliderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.02em" }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color: "#C2478D", fontWeight: 700 }}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#C2478D", cursor: "pointer" }}
      />
    </div>
  );
}
