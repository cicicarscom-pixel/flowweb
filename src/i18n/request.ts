import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

// Desteklenen diller. Yeni bir dil eklerken: (1) buraya kod eklenir,
// (2) ../../messages altına {kod}.json eklenir. Kullanıcıya gösterilen
// isimler common.json > language.* içindedir.
export const SUPPORTED_LOCALES = ["tr", "en", "de"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

// Bu bir Türkiye merkezli işletme paneli olarak başladı ve mevcut içeriğin
// büyük çoğunluğu henüz sadece Türkçe (bkz. flowweb i18n denetimi,
// flow/README.md [05.09.2026]) — o yüzden hiçbir sinyal yokken 'tr'ye
// düşüyoruz, 'en'e değil. Çeviri kapsamı genişledikçe bu tekrar
// değerlendirilebilir.
export const DEFAULT_LOCALE: AppLocale = "tr";

// Kullanıcının Ayarlar/Profil'den (veya Sidebar'daki hızlı seçiciden) manuel
// olarak seçtiği dili hatırlamak için kullanılan çerez adı.
export const LOCALE_COOKIE = "NEXT_LOCALE";

function isSupportedLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

// "en-US,en;q=0.9,tr;q=0.8" gibi bir Accept-Language başlığından, desteklenen
// dillerden tarayıcının en çok tercih ettiğini bulur.
function detectFromAcceptLanguage(acceptLanguage: string | null): AppLocale | null {
  if (!acceptLanguage) return null;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  const match = preferred.find((lang) => isSupportedLocale(lang));
  return match ? (match as AppLocale) : null;
}

// Bir isteğin dilini çözer: (1) kullanıcı daha önce manuel seçim yaptıysa
// (çerezde saklanır) o tercih her zaman kazanır; (2) yoksa tarayıcının
// Accept-Language başlığına göre otomatik algılama yapılır; (3) o da yoksa
// varsayılan dile düşülür. Sunucu bileşenlerinde (request.ts) ve
// istemci tarafındaki dil değiştirme server action'ında (../actions/locale.ts)
// aynı mantığın tekrarlanmaması için tek yerden yönetiliyor.
export async function resolveLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const detected = detectFromAcceptLanguage(headerStore.get("accept-language"));
  return detected ?? DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
