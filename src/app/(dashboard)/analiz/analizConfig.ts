// PLATFORMS: 'name' alanı marka adları için literal İngilizce kalır (TikTok,
// Instagram, Facebook, YouTube, LinkedIn, Google Business — bunlar özel isim,
// dilden dile çevrilmez). Sadece 'all' (Tümü) seçeneği i18n'e bağlıdır, bkz.
// getPlatformLabel().
export const PLATFORMS = [
  { id: 'all', name: 'Tümü', icon: 'apps', color: '#A79E96' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#EF4444' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E8A8CD' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#FF7A59' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#ff0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0077b5' },
  { id: 'googlebusiness', name: 'Google Business', icon: 'store', color: '#34a853' }
];

// id/label ayrımı (bkz. AICharacterPanel.tsx'teki ROLE_KEY_BY_ID notu):
// TIME_RANGES.id değerleri değişmez (state/filtre mantığı bunlara dayanır),
// yalnızca görüntülenen ad bu eşlemeyle analizPage.timeRanges.* çevirisinden üretilir.
export const TIME_RANGE_KEY_BY_ID: Record<string, string> = {
  '7d': 'last7Days',
  '30d': 'last30Days',
  '90d': 'last90Days',
  '1y': 'last1Year',
};

export const TIME_RANGES = [
  { id: '7d', name: 'Son 7 Gün', days: 7 },
  { id: '30d', name: 'Son 30 Gün', days: 30 },
  { id: '90d', name: 'Son 90 Gün', days: 90 },
  { id: '1y', name: 'Son 1 Yıl', days: 365 }
];

export type Platform = typeof PLATFORMS[number];
export type TimeRange = typeof TIME_RANGES[number];
