'use server'

import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

// WAHA işlemleri sunucu tarafındaki `waha-session` Edge Function'ı üzerinden yapılır. WAHA adresi ve yönetici anahtarı
// bu depoda TUTULMAZ. Oturum adı sunucuda JWT'den (kullanıcı kimliği) çözülür; istemci oturum adı gönderemez.

type WahaResult = { success: boolean; data?: any; error?: string }

async function callWaha(body: Record<string, unknown>, fallbackKey: string): Promise<WahaResult> {
  const t = await getTranslations()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: t('common.serverErrors.sessionNotFound') }

  try {
    const { data, error } = await supabase.functions.invoke('waha-session', { body })
    if (error) {
      let code = ''
      try { code = (await (error as any).context?.json?.())?.error || '' } catch { /* gövde okunamadı */ }
      if (code === 'BOT_NOT_SETUP' && body.action === 'status') return { success: true, data: null }
      if (code === 'ACCOUNT_NOT_ACTIVE') return { success: false, error: t('common.serverErrors.wahaAccountNotActive') }
      return { success: false, error: t(fallbackKey) }
    }
    if (data?.success === false) {
      if (data.error === 'BOT_NOT_SETUP' && body.action === 'status') return { success: true, data: null }
      if (data.error === 'ACCOUNT_NOT_ACTIVE') return { success: false, error: t('common.serverErrors.wahaAccountNotActive') }
      return { success: false, error: t(fallbackKey) }
    }
    return { success: true, data: data?.data ?? null }
  } catch (error: any) {
    console.error('waha-session Error:', error)
    return { success: false, error: error.message }
  }
}

export async function getWahaStatus() {
  return callWaha({ action: 'status' }, 'common.serverErrors.wahaSessionInfoUnavailable')
}

export async function startWahaSession() {
  return callWaha({ action: 'start' }, 'common.serverErrors.wahaStartFailed')
}

export async function getWahaQrCode() {
  return callWaha({ action: 'qr' }, 'common.serverErrors.wahaQrFailed')
}

export async function getWahaPairingCode(phoneNumber: string) {
  return callWaha({ action: 'pairing-code', phoneNumber }, 'common.serverErrors.wahaPairingCodeFailed')
}
