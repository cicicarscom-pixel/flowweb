'use server'
import { createClient } from '@/lib/supabase/server'

export async function resetAiData(mode: 'soft' | 'hard'): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { success: false, error: 'Oturum bulunamadı.' }

  const { data, error } = await supabase.functions.invoke('flow-reset-ai-data', { body: { mode } })
  if (error || data?.success === false) {
    return { success: false, error: error?.message || data?.error || 'Bilinmeyen hata' }
  }
  return { success: true }
}
