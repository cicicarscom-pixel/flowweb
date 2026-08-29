import { createClient } from '@supabase/supabase-js'

// ==============================================================================
// PERSONA ENGINE — PHASE 5: service-role Supabase client
// ==============================================================================
// SERVER-ONLY. Never import this from a Client Component ("use client") —
// the service role key must never reach the browser bundle. This file has
// no "use client"/"use server" directive itself; it is only ever imported
// from src/actions/aiPersonaSettings.ts, which IS a server action module.
//
// Why this exists: ai_personas rows are still status='draft' until Phase 7's
// compliance tests pass (guardrail #9 — locked). RLS on ai_personas only
// lets `authenticated` read status='published' rows (see the Phase 1
// migration), so the normal cookie-authenticated server client (lib/supabase
// /server.ts) cannot resolve a persona by slug yet. This client is used for
// EXACTLY that one narrow, specific lookup — never to bypass RLS on
// organization_ai_settings, which is still written with the normal,
// RLS-respecting client so a merchant can only ever touch their own row.
// ==============================================================================

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set in this environment. ' +
      'This is a separate env var from anything in the ledger repo — it must ' +
      'be added to flowweb\'s own hosting environment (e.g. Vercel project settings).'
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
