import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// URL yapısını (/en/..., /de/... öneki) DEĞİŞTİRMİYORUZ — bu panel bir giriş
// gerektiren dashboard, herkese açık/SEO'ya duyarlı sayfalar değil (tek istisna
// /login, o da tek dilde kalabilir). Dil, next-intl'in "without i18n routing"
// modunda bir çerez (NEXT_LOCALE) üzerinden yönetiliyor — bkz. src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
