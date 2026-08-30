"use client";

// Single selectable card inside PersonaCarousel — visually matches PillGroup's
// buttons (same pill styling as roles/tones) but kept as its own component
// per the plan's component breakdown, since this is the one that will grow
// (avatar image instead of emoji, short_bio tooltip, category badge) as more
// personas are added, unlike the plain-label role/tone pills.
interface PersonaCardProps {
  label: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
  title?: string;
}

export default function PersonaCard({ label, icon, selected, onSelect, title }: PersonaCardProps) {
  return (
    <button
      onClick={onSelect}
      title={title}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", borderRadius: 99,
        background: selected ? "rgba(194,71,141,0.15)" : "rgba(255,255,255,0.03)",
        border: selected ? "1px solid rgba(194,71,141,0.4)" : "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer", color: selected ? "#C2478D" : "var(--text-secondary)",
        fontSize: 14, fontWeight: 500, transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}
