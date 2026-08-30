"use client";

// ==============================================================================
// PERSONA ENGINE — PHASE 6: Persona Carousel
// ==============================================================================
// Replaces the old hardcoded `characters` array (Einstein/Shakespeare/Mimar
// Sinan baked into page.tsx). Personas are fetched server-side (see
// src/actions/personas.ts's getPublishedPersonas()) and passed in as props —
// this component never fetches on its own, so there is exactly one place
// (page.tsx's fetchSettings) that decides when the list is (re)loaded.
//
// Only status='published' personas can ever appear in `personas` — that's
// enforced by RLS on ai_personas itself (getPublishedPersonas can't see
// drafts even if it tried), not by anything in this component. "Standart"
// (persona_id = null, see plan §1.3) is always rendered first as a special,
// permanent card that is not part of the fetched list.
//
// Category filter (plan: "Kategori filtresi persona sayısı arttıkça
// eklenir") is deliberately NOT built yet — `category` is already carried on
// PublicPersona for when persona count actually warrants it.
// ==============================================================================

import PersonaCard from "./PersonaCard";
import type { PublicPersona } from "@/actions/personas";

interface PersonaCarouselProps {
  personas: PublicPersona[];
  loading: boolean;
  selectedSlug: string | null; // null = "Standart"
  onSelect: (persona: PublicPersona | null) => void;
}

export default function PersonaCarousel({ personas, loading, selectedSlug, onSelect }: PersonaCarouselProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <PersonaCard
        label="Standart"
        icon="🤖"
        selected={selectedSlug === null}
        onSelect={() => onSelect(null)}
        title="Kişilik uygulanmaz — asistan mevcut varsayılan/eski ayarlarınızla konuşur"
      />

      {loading && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", padding: "0 8px" }}>
          Karakterler yükleniyor...
        </span>
      )}

      {!loading && personas.length === 0 && (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", padding: "0 8px" }}>
          Şu an seçilebilecek yayınlanmış bir karakter yok.
        </span>
      )}

      {personas.map((p) => (
        <PersonaCard
          key={p.slug}
          label={p.name}
          icon={p.icon ?? "🎭"}
          selected={selectedSlug === p.slug}
          onSelect={() => onSelect(p)}
          title={p.shortBio ?? undefined}
        />
      ))}
    </div>
  );
}
