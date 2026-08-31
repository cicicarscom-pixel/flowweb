'use server'

// ==============================================================================
// PERSONA ENGINE — PHASE 5: Web Settings Save Refactor
// ==============================================================================
// Guardrail #2 (locked plan): the client NEVER builds or saves a final,
// merged prompt string. It only saves the merchant's RAW selections
// (persona, business role, tone, dials, custom instruction) to
// organization_ai_settings — rendering that into an actual prompt happens
// server-side, in PersonaService → PersonaPromptBuilder (Phase 2/3), never
// here and never in the browser.
//
// This replaces src/app/(dashboard)/ai-asistan/page.tsx's old handleSave(),
// which wrote a hand-assembled system_prompt string (plus tone/role/
// character columns) directly to bot_settings. That write is now GONE —
// bot_settings.system_prompt is untouched from this point forward (the
// column itself stays, per guardrail #6, as PromptBuilder's legacy fallback
// for merchants who never touch the new persona settings).
// ==============================================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface SaveAiPersonaSettingsInput {
  characterSlug: string | null // null = "Standart" — see plan §1.3, NOT a row in ai_personas
  businessRole: string | null
  tone: string | null
  customInstruction: string | null
  personaIntensity?: number
  humorLevel?: number
  modernAdaptation?: number
  appointmentModuleEnabled?: boolean
}

export interface SaveAiPersonaSettingsResult {
  success: boolean
  error?: string
  personaId?: string | null
}

export async function saveAiPersonaSettings(
  input: SaveAiPersonaSettingsInput,
): Promise<SaveAiPersonaSettingsResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    let personaId: string | null = null
    let personaDefaults = { persona_intensity: 50, humor_level: 30, modern_adaptation: 70 }

    if (input.characterSlug) {
      // See lib/supabase/admin.ts for why this one lookup needs the
      // service-role client (ai_personas rows are still 'draft' pre-Phase-7).
      const admin = createAdminClient()
      const { data: persona, error: personaError } = await admin
        .from('ai_personas')
        .select('id, default_persona_intensity, default_humor_level, default_modern_adaptation')
        .eq('slug', input.characterSlug)
        .maybeSingle()

      if (personaError || !persona) {
        return { success: false, error: `Persona '${input.characterSlug}' not found: ${personaError?.message}` }
      }

      personaId = persona.id
      personaDefaults = {
        persona_intensity: persona.default_persona_intensity,
        humor_level: persona.default_humor_level,
        modern_adaptation: persona.default_modern_adaptation,
      }
    }

    // Written with the NORMAL, RLS-respecting client (not the admin client) —
    // organization_ai_settings' own RLS policy already restricts writes to
    // `auth.uid() = merchant_id`, so this can never touch another merchant's row.
    const { error } = await supabase.from('organization_ai_settings').upsert(
      {
        merchant_id: user.id,
        persona_id: personaId,
        business_role: input.businessRole,
        tone: input.tone,
        persona_intensity: input.personaIntensity ?? personaDefaults.persona_intensity,
        humor_level: input.humorLevel ?? personaDefaults.humor_level,
        modern_adaptation: input.modernAdaptation ?? personaDefaults.modern_adaptation,
        custom_instruction: input.customInstruction,
        appointment_module_enabled: input.appointmentModuleEnabled ?? true,
        assistant_enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'merchant_id' },
    )

    if (error) {
      console.error('[saveAiPersonaSettings] upsert failed:', error.message)
      return { success: false, error: `DB Error: ${error.message}` }
    }

    return { success: true, personaId }
  } catch (e: any) {
    console.error('[saveAiPersonaSettings] Unhandled error:', e)
    return { success: false, error: `Unhandled Exception: ${e.message || String(e)}` }
  }
}

export interface AiPersonaSettings {
  characterSlug: string | null
  businessRole: string | null
  tone: string | null
  customInstruction: string | null
  personaIntensity: number
  humorLevel: number
  modernAdaptation: number
  appointmentModuleEnabled: boolean
}

// Paired "load" action — mirrors saveAiPersonaSettings' need for admin-level
// resolution: organization_ai_settings.persona_id is a UUID a merchant CAN
// read (it's their own row), but resolving that UUID back to a slug/name for
// display requires reading ai_personas, which is still RLS-gated to
// status='published' rows the merchant's own client can't see pre-Phase-7.
export async function getAiPersonaSettings(): Promise<AiPersonaSettings | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: settings } = await supabase
    .from('organization_ai_settings')
    .select('*')
    .eq('merchant_id', user.id)
    .maybeSingle()

  if (!settings) return null

  let characterSlug: string | null = null
  if (settings.persona_id) {
    const admin = createAdminClient()
    const { data: persona } = await admin
      .from('ai_personas')
      .select('slug')
      .eq('id', settings.persona_id)
      .maybeSingle()
    characterSlug = persona?.slug ?? null
  }

  return {
    characterSlug,
    businessRole: settings.business_role,
    tone: settings.tone,
    customInstruction: settings.custom_instruction,
    personaIntensity: settings.persona_intensity,
    humorLevel: settings.humor_level,
    modernAdaptation: settings.modern_adaptation,
    appointmentModuleEnabled: settings.appointment_module_enabled ?? true,
  }
}
