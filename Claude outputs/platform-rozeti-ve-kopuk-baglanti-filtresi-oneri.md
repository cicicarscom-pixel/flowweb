# Öneri: yorum bazlı platform rozeti + kopuk bağlantıların yorumlarını gizleme

İstediğiniz iki şeyi inceledim, `gelen-kutusu/page.tsx`'te tam nereye ekleneceğini bulup somut kod önerisi hazırladım.

## 1. Her yoruma kendi platform rozeti

İyi haber: `getPlatformIcon(platform)` fonksiyonu zaten var (satır 577-587, tiktok/instagram/facebook/whatsapp/youtube/linkedin hepsi tanımlı) ve her yorum objesi (`comm.platform`) zaten kendi gerçek platformunu taşıyor — az önce bulduğumuz "Arif Akar" örneğinde olduğu gibi, aynı gönderi altında farklı platformlardan yorumlar karışabiliyor (satır 980'de de `parent.platform` zaten ayrı ayrı okunuyor, sadece görünür bir rozet olarak kullanılmıyor).

Sadece üst yorum başlığına (satır 956-959) rozeti eklemek yeterli:

```tsx
// Şu an (956-959. satırlar):
<div className="flex flex-col">
  <span className="font-semibold text-on-surface text-sm">@{uName}</span>
  <span className="text-[10px] text-dark-muted">{new Date(parent.created_at).toLocaleString(locale)}</span>
</div>

// Önerilen:
<div className="flex flex-col">
  <div className="flex items-center gap-1.5">
    <span className="font-semibold text-on-surface text-sm">@{uName}</span>
    <span className="text-xs" title={parent.platform}>{getPlatformIcon(parent.platform)}</span>
  </div>
  <span className="text-[10px] text-dark-muted">{new Date(parent.created_at).toLocaleString(locale)}</span>
</div>
```

(İsterseniz aynısını yanıt satırlarına da — 1019-1022 civarı — ekleyebiliriz, ama yanıtlar zaten hep bizim/bota ait olduğundan önceliği düşük.)

## 2. Bağlantısı kopuk platformların yorumlarını gizleme

Şu an `gelen-kutusu/page.tsx` hangi platformların bağlı/aktif olduğunu hiç bilmiyor — sadece `organizationId`'yi çekiyor (satır 25-38). Bunun için iki adım gerekiyor:

**a) Bağlı platformları çek** (organizationId set edildikten sonra, aynı `useEffect`'e veya ayrı bir tane):

```tsx
const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());

useEffect(() => {
   if (!organizationId) return;
   const fetchConnectedPlatforms = async () => {
      const { data } = await supabase
         .schema('integration')
         .from('social_accounts')
         .select('platform')
         .eq('organization_id', organizationId)
         .eq('is_active', true)
         .eq('needs_reconnection', false);
      setConnectedPlatforms(new Set((data || []).map((r: any) => r.platform?.toLowerCase())));
   };
   fetchConnectedPlatforms();
}, [organizationId]);
```

**b) `postsWithComments` memo'sundaki ilk filtreye ekleyin** (şu an satır 53'te `comments.filter(c => !c.hidden)` var):

```tsx
// Şu an:
comments.filter(c => !c.hidden).forEach(comm => { ... });

// Önerilen:
comments
  .filter(c => !c.hidden)
  .filter(c => connectedPlatforms.size === 0 || connectedPlatforms.has(c.platform?.toLowerCase()))
  .forEach(comm => { ... });
```

(`connectedPlatforms.size === 0` kontrolü, sayfa ilk açıldığında/veri henüz gelmeden tüm yorumların bir anlığına kaybolmasını önlüyor — bağlı platform listesi boşsa filtre devre dışı kalır.)

Bunu `postsWithComments`'ın kendi `useMemo` bağımlılık dizisine (`[comments, connectedPlatforms, t]` gibi) de eklemeniz gerekecek, şu an muhtemelen sadece `[comments, ...]` var — kontrol edip ekleyin.

**Davranış:** Bu değişiklikle, bir platformun bağlantısı koptuğunda (`needs_reconnection=true` olduğunda) o platformdaki yorumlar (üst yorum + varsa altındaki yanıtlar dahil) Gelen Kutusu'ndan **tamamen kaybolacak** — tam istediğiniz gibi, sadece yanıt butonu pasifleşmeyecek. Bağlantı yeniden kurulduğunda (`needs_reconnection=false` olunca) otomatik olarak geri görünecekler (veri silinmiyor, sadece görünürlük filtreleniyor).

## Not

Bu değişiklik, bir önceki mesajımda bahsettiğim "Missing accountId" sessiz hatasını da dolaylı olarak hafifletir — artık zaten bağlı olmayan bir platformun yorumu hiç görünmeyeceği için, o yoruma "yanıtla" deneyip sessizce başarısız olma ihtimali de ortadan kalkar. Yine de o hatanın kendisini (görünür bir uyarı eksikliği) ayrıca düzeltmenizi öneririm — iki platform da bağlıyken farklı bir sebeple (örn. Zernio API geçici hatası) yanıt başarısız olursa kullanıcı yine sessiz kalır.

Bu iki değişikliği ve bir önceki mesajdaki **acil** `HandleIncomingMessageUseCase.ts` düzeltmesini Antigravity'ye iletebilirsiniz. Öncelik sıralaması: (1) otomatik bot yanıtı acil, (2) platform rozeti + kopuk bağlantı filtresi normal öncelik.
