# bot_settings / organizations.id uyuşmazlığı — kök neden netleşti, çözüm önerisi hazır

## Özet (iyi haber önce)

Endişelendiğim gibi "bot kapatma düğmesi ürün genelinde bozuk" **DEĞİL**. Flowweb (hem web hem mobil) tarafı, `bot_settings` tablosuna her zaman **doğru id** ile (gerçek `auth.users.id` — `session.user.id`/`user.id`) okuyup yazıyor. Kontrol ettiğim 3 dosyanın hepsinde (`page.tsx`, `ai-asistan/page.tsx`, `aiPersonaSettings.ts`) tutarlı şekilde bu şekilde. Yani UI tarafında hiçbir hata yok, veri de bozuk değil.

**Sorun tamamen `zernio-webhook/index.ts`'te.** Orada `botSettings` sorgusu `profileId` değişkenini kullanıyor — ama bu değişken (posts/comments için doğru olan) bir **organizations.id**. `bot_settings.merchant_id` ise `auth.users.id`'ye FK'li. Organizasyon id'si ile kullanıcı id'si asla aynı değer olmadığı için (backfill migration'ı organizasyonlara `gen_random_uuid()` ile yepyeni id veriyor), webhook'un sorgusu **hiçbir zaman** eşleşen satırı bulamıyor — `botSettings` her zaman `null` dönüyor.

## Somut kanıt (veritabanından doğrudan doğruladım)

```sql
SELECT bs.merchant_id, om.organization_id, om.role
FROM bot_settings bs
LEFT JOIN organization_members om ON om.user_id = bs.merchant_id;
```

Sonuç: veritabanındaki **5 `bot_settings` satırının 5'i de** doğru şekilde bir `organization_members` kaydıyla eşleşiyor (`user_id` üzerinden), hepsi `role='owner'`. Yani veri tarafı tertemiz — **her organizasyonun tam olarak 1 sahibi var ve o sahibin `bot_settings` satırı gerçek user id'siyle mevcut.**

Sizin organizasyonunuz (`84c54c33...` / Direniş Kahvesi) için:

```json
{
  "id": "05bb1980-ee5e-4a86-83cf-a6861cbf2d06",
  "merchant_id": "a3555b70-b73f-46bc-af47-0daee20c7a13",   // gerçek user id — org id DEĞİL
  "is_active": false,           // eski "master toggle" — 01.09'da mobilden kaldırıldığı için artık okunmuyor (ölü kolon)
  "social_bot_active": true,
  "whatsapp_bot_active": true,
  "updated_at": "2026-08-29 20:08:51+00"
}
```

Yani satır var, doğru id ile, `social_bot_active: true`. Şu anda webhook bu satırı bulamadığı için `botSettings?.social_bot_active !== false` → `undefined !== false` → `true` çıkıyor — **şu anki değerle tesadüfen aynı sonuca ulaşıyor**, o yüzden görünürde bir sorun yokmuş gibi duruyor. Ama gerçek risk şu: **siz (veya bir müşteri) ileride bu şalteri panelden kapatırsanız (`social_bot_active = false` yaparsanız), webhook bunu asla göremeyecek ve bot susmayacak** — tam olarak biraz önceki sonsuz döngü krizinde denediğim ve foreign key hatasıyla başarısız olan senaryo.

## Önerdiğim düzeltme (webhook tarafında, tek noktada)

`zernio-webhook/index.ts`'te `botSettings` çekilmeden hemen önce, organizasyonun sahibinin gerçek user id'sini `organization_members`'tan çözüp, `bot_settings` sorgusunu ONUNLA yapmak:

**Şu an:**
```ts
const { data: botSettings } = await supabase
  .from('bot_settings')
  .select('social_bot_active')
  .eq('merchant_id', profileId)   // profileId = organizations.id — asla eşleşmiyor
  .single();
```

**Önerilen:**
```ts
const { data: ownerMember } = await supabase
  .from('organization_members')
  .select('user_id')
  .eq('organization_id', profileId)
  .eq('role', 'owner')
  .maybeSingle();

const { data: botSettings } = ownerMember
  ? await supabase
      .from('bot_settings')
      .select('social_bot_active')
      .eq('merchant_id', ownerMember.user_id)
      .maybeSingle()
  : { data: null };
```

(`.single()` yerine `.maybeSingle()` kullanılması da ayrı bir küçük iyileştirme — satır bulunamadığında `.single()` hata fırlatır, `.maybeSingle()` sessizce `null` döner; mevcut kodda zaten satır hiç bulunamadığı için bu fark şimdiye kadar hiç fark edilmemiş olabilir.)

## Önemli sınırlama / ileri seviye not

Bu çözüm, **her organizasyonun tek bir sahibi (owner) olduğu** varsayımına dayanıyor — ki şu an veritabanındaki 5 organizasyonun 5'i de bu şekilde (tek kullanıcı = tek organizasyon, "bireysel/freelancer fallback" mimarisi gereği). İleride gerçek çoklu-kullanıcılı (takım) organizasyonlar eklenirse, "bot ayarı" kavramının kime ait olduğu (organizasyona mı, kullanıcıya mı?) yeniden düşünülmesi gerekir — o zaman muhtemelen `bot_settings`'e gerçek bir `organization_id` kolonu eklenip diğer 9 tablo gibi organizasyon bazlı hale getirilmesi daha doğru olur. Ama **şu an için** (tek-sahipli organizasyonlar), yukarıdaki tek-sorgulu çözüm veriyi bozmadan, migration gerektirmeden sorunu tam olarak çözer.

## Sizden istediğim

1. Yukarıdaki değişikliği Antigravity'ye uygulatıp `zernio-webhook`'u deploy edin.
2. Deploy'dan sonra ben panelden `social_bot_active`'i geçici olarak `false` yapıp gerçek bir test yorumu ile ("bot artık cevap vermemeli mi?") uçtan uca doğrularım, sonra tekrar `true`'ya alırım — isterseniz bunun için de SQL üzerinden yardımcı olabilirim, sadece haber verin.
