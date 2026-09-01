"use client";

// ==============================================================================
// PERSONA ENGINE — v2: Portrait-style persona card
// ==============================================================================
// Replaces the old pill-button look (emoji + label in a small rounded chip)
// with a taller card: a circular portrait (avatar_url image, falling back to
// the emoji icon when no image has been uploaded yet) ringed in a per-card
// accent color, the persona's name in bold, and its short_bio underneath.
// Accent color is assigned by the parent (PersonaCarousel) so this component
// stays a pure presentational card — it has no opinion on the palette.
// ==============================================================================
interface PersonaCardProps {
  label: string;
  icon: string;
  avatarUrl?: string | null;
  description?: string | null;
  accentColor: string;
  selected: boolean;
  onSelect: () => void;
  title?: string;
}

export default function PersonaCard({
  label,
  icon,
  avatarUrl,
  description,
  accentColor,
  selected,
  onSelect,
  title,
}: PersonaCardProps) {
  return (
    <button
      onClick={onSelect}
      title={title}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 168,
        flexShrink: 0,
        padding: "22px 14px 18px",
        borderRadius: 22,
        background: selected ? `${accentColor}1F` : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${selected ? accentColor : "rgba(255,255,255,0.08)"}`,
        boxShadow: selected ? `0 0 24px ${accentColor}66` : "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "50%",
          border: `2.5px solid ${accentColor}`,
          boxShadow: `0 0 18px ${accentColor}80`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.05)",
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 38 }}>{icon}</span>
        )}
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.25,
          marginBottom: description ? 6 : 0,
        }}
      >
        {label}
      </span>

      {description && (
        <span
          style={{
            fontSize: 11.5,
            color: "var(--text-secondary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </span>
      )}
    </button>
  );
}
