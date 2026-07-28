'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBotSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('bot_settings').select('*').single()
  
  if (error) {
    console.error('Error fetching bot settings:', error)
    return null
  }
  return data
}

export async function updateBotSettings(formData: FormData) {
  const supabase = await createClient()
  
  const auto_reply_enabled = formData.get('auto_reply_enabled') === 'on'
  const tone = formData.get('tone') as string
  const custom_instruction = formData.get('custom_instruction') as string
  
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { success: false, message: 'Unauthorized' }

  // Update logic (Upsert into bot_settings)
  const { error } = await supabase.from('bot_settings').upsert({
    user_id: user.user.id,
    auto_reply_enabled,
    tone,
    custom_instruction,
    updated_at: new Date().toISOString()
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/bot-management')
  return { success: true }
}
