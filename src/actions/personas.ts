'use server'

// ==============================================================================
// PERSONA ENGINE — PHASE 6: published persona catalog (read-only)
// ==============================================================================
// Powers the web carousel (src/components/ai-asistan/PersonaCarousel.tsx).
// Uses the NORMAL, RLS-respecting client — no admin client needed here, unlike
// aiPersonaSettings.ts's slug/id lookups. ai_personas' own RLS policy
// ("Published personas are readable by authenticated users") already lets any
// authenticated merchant read status='published' rows directly, so this never
// touches admin.ts / SUPABASE_SERVICE_ROLE_KEY. Draft/testing/archived
// personas are invisible here by construction (guardrail #9) — there is
// nothing this action can do to leak an unpublished persona into the picker.
// ==============================================================================

import { createClient } from '@/lib/supabase/server'

export interface PublicPersona {
  id: string
  slug: string
  name: string
  icon: string | null
  category: string | null
  shortBio: string | null
  defaultPersonaIntensity: number
  defaultHumorLevel: number
  defaultModernAdaptation: number
}

export async function getPublishedPersonas(): Promise<PublicPersona[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ai_personas')
    .select(
      'id, slug, name, icon, category, short_bio, default_persona_intensity, default_humor_level, default_modern_adaptation',
    )
    .eq('status', 'published')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    // Fails soft: an empty carousel (just "Standart") is the safe default,
    // never a page-breaking error — this list is never on the critical path
    // for an existing merchant's already-saved settings (see getAiPersonaSettings).
    console.error('[getPublishedPersonas] failed:', error.message)
    return []
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    icon: p.icon,
    category: p.category,
    shortBio: p.short_bio,
    defaultPersonaIntensity: p.default_persona_intensity,
    defaultHumorLevel: p.default_humor_level,
    defaultModernAdaptation: p.default_modern_adaptation,
  }))
}
