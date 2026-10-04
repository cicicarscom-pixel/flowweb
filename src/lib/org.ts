import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * İşletme kimliği (organizations.id). Veritabanında çözülür (current_org_id()); oturum/kullanıcı kimliğinden
 * türetilmez ve istemciden gönderilmez (AGENTS.md §3 kural 2).
 */
export async function getCurrentOrgId(supabase: SupabaseClient): Promise<string | null> {
  const { data, error } = await supabase.rpc('current_org_id')
  if (error) {
    console.error('[getCurrentOrgId]', error.message)
    return null
  }
  return (data as string | null) ?? null
}
