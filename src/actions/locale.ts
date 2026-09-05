'use server'

import { cookies } from 'next/headers'
import { SUPPORTED_LOCALES, LOCALE_COOKIE, type AppLocale } from '@/i18n/request'

// Kullanıcının Sidebar'daki (veya ileride Profil ekranındaki) dil seçicisinden
// çağrılır. Seçimi bir çereze yazar — next-intl'in "without i18n routing"
// modunda bu, tüm sunucu bileşenlerinin bir sonraki render'da doğru dili
// kullanmasını sağlayan tek kalıcı kayıt yeridir (URL değişmez).
export async function setLocale(locale: string): Promise<{ success: boolean; error?: string }> {
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    return { success: false, error: 'Desteklenmeyen dil.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale as AppLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 yıl — kullanıcı tekrar değiştirene kadar hatırlanır
    sameSite: 'lax',
  })

  return { success: true }
}
