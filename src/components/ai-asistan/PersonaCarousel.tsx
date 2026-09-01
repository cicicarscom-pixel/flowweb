"use client";

// ==============================================================================
// PERSONA ENGINE — v2: Persona Carousel (portrait card grid)
// ==============================================================================
// Same data contract as before (personas fetched server-side via
// src/actions/personas.ts's getPublishedPersonas(), "Standart" rendered first
// as a permanent, non-fetched card) — only the visual layout changed, from a
// wrapping row of small pill buttons to a horizontally scrollable row of
// portrait cards (see PersonaCard.tsx).
//
// Each card gets a distinct neon accent color from ACCENT_COLORS, cycling by
// position. Colors are purely a visual grouping device (not stored per
// persona in the DB) — there's no schema dependency here, so adding/removing
// personas never requires touching this palette.
// ==============================================================================

import PersonaCard from "./PersonaCard";
import type { PublicPersona } from "@/actions/personas";

const ACCENT_COLORS = [
  "#C2478D", // pink/magenta
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#22C55E", // green
  "#F97316", // orange
  "#14B8A6", // teal
  "#EF4444", // red
  "#EAB308", // yellow
  "#6366F1", // indigo
  "#06B6D4", // cyan
  "#F43F5E", // rose
  "#84CC16", // lime
  "#D946EF", // fuchsia
  "#0EA5E9", // sky
];

const STANDART_COLOR = "#9CA3AF"; // neutral gray — "no persona" is deliberately not part of the color cycle

interface PersonaCarouselProps {
  personas: PublicPersona[];
  loading: boolean;
  selectedSlug: string | null; // null = "Standart"
  onSelect: (persona: PublicPersona | null) => void;
}

export default function PersonaCarousel({ personas, loading, selectedSlug, onSelect }: PersonaCarouselProps) {
  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 10 }}>
      <PersonaCard
        label="Standart"
        icon="🤖"
        description="Kişilik uygulanmaz, varsayılan ayarlarla konuşur."
        accentColor={STANDART_COLOR}
        selected={selectedSlug === null}
        onSelect={() => onSelect(null)}
        title="Kişilik uygulanmaz — asistan mevcut varsayılan/eski ayarlarınızla konuşur"
      />

      {loading && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", padding: "0 8px", alignSelf: "center" }}>
          Karakterler yükleniyor...
        </span>
      )}

      {!loading && personas.length === 0 && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", padding: "0 8px", alignSelf: "center" }}>
          Şu an seçilebilecek yayınlanmış bir karakter yok.
        </span>
      )}

      {personas.map((p, i) => (
        <PersonaCard
          key={p.slug}
          label={p.name}
          icon={p.icon ?? "🎭"}
          avatarUrl={p.avatarUrl}
          description={p.shortBio}
          accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          selected={selectedSlug === p.slug}
          onSelect={() => onSelect(p)}
          title={p.shortBio ?? undefined}
        />
      ))}
    </div>
  );
}
