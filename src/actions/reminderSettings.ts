'use server'

import { createClient } from '@/lib/supabase/server'

/** WhatsApp randevu hatırlatma ayarı: ince adaptör; iş kuralı veritabanındadır (get/set_reminder_settings). */
export type ReminderSettings = { enabled: boolean }
export type SetReminderResult = { ok: true; enabled: boolean } | { ok: false; reason: 'unauthorized' | 'forbidden' | 'error' }

export async function getReminderSettings(): Promise<ReminderSettings | null> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null
    const { data, error } = await supabase.rpc('get_reminder_settings')
    if (error || data?.status !== 'SUCCESS') return null
    return { enabled: !!data.enabled }
  } catch (e) {
    console.error('getReminderSettings exception:', e)
    return null
  }
}

export async function setReminderSettings(enabled: boolean): Promise<SetReminderResult> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return { ok: false, reason: 'unauthorized' }
    const { data, error } = await supabase.rpc('set_reminder_settings', { p_enabled: enabled })
    if (error) return { ok: false, reason: 'error' }
    if (data?.status === 'SUCCESS') return { ok: true, enabled: !!data.enabled }
    if (data?.status === 'FORBIDDEN') return { ok: false, reason: 'forbidden' }
    if (data?.status === 'UNAUTHORIZED') return { ok: false, reason: 'unauthorized' }
    return { ok: false, reason: 'error' }
  } catch (e) {
    console.error('setReminderSettings exception:', e)
    return { ok: false, reason: 'error' }
  }
}
