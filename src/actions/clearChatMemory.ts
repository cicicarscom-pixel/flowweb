
'use server'
import { createClient } from '@/lib/supabase/server'

export async function clearChatMemory(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { success: false, error: 'Oturum bulunamadı' }

  const { error } = await supabase
    .from('ai_communication_logs')
    .delete()
    .eq('merchant_id', session.user.id)

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

