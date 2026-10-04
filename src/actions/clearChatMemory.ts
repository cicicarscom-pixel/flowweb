
'use server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentOrgId } from '@/lib/org'

export async function clearChatMemory(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { success: false, error: 'Oturum bulunamadı' }

  const orgId = await getCurrentOrgId(supabase)
  if (!orgId) return { success: false, error: 'İşletme bulunamadı' }

  const { error } = await supabase
    .from('ai_communication_logs')
    .delete()
    .eq('org_id', orgId)

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

