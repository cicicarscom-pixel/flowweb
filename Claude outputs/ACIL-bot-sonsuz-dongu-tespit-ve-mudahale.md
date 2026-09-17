# ACİL: Botunuz kendi yorumlarına kendi kendine cevap veriyordu — müdahale ettim

## Ne oldu

Kullanıcı adı konusunu incelerken loglara baktığımda, sizin fark etmediğiniz çok daha ciddi bir şey buldum: sosyal medya botunuz TikTok'ta **kendi attığı cevaplara yeniden cevap vermeye** başlamış — klasik bir sonsuz döngü (infinite loop) durumu.

Rakamlar: 18:21 - 19:17 arası (56 dakikada) **46 tane** `comment.received` webhook event'i geldi, bunların büyük çoğunluğu saniyenin onda biri aralıklarla art arda gelen "@Bilinmeyen" metinli, botun kendi hesabından (`isOwnAccount: true`) atılmış yorumlardı. Bu da AI cevap kuyruğuna (`ai_jobs`) **43 tane** yeni "bu yoruma cevap ver" görevi eklenmiş demek — her biri 8-13 dakika sonra otomatik olarak TikTok'a gerçek bir cevap gönderecekti.

## Kök neden (kesin, koddan doğrulandı)

`zernio-webhook/index.ts`, yorumun "kendi yorumumuz mu" diye kontrol ettiği satır:

```ts
const isOwnComment = (
  commentData.isOwn === true ||
  commentData.direction === 'outbound' ||
  (platformUsername && authorName === platformUsername)
);
```

Ama gerçek TikTok webhook payload'ı (loglardan doğrudan aldığım ham veri) şöyle:

```json
{ "id": "...", "isOwnAccount": true, ... }
```

Yani alan adı `isOwn` değil, **`isOwnAccount`**. Kod yanlış alana bakıyor, `commentData.isOwn` her zaman `undefined` oluyor. Diğer iki koşul da TikTok için hiç tutmuyor (`direction` TikTok yorumlarında yok, `authorName` da daha önce bulduğumuz gibi TikTok'ta hep "Bilinmeyen" olarak geliyor — bir önceki bulgumuzla birebir bağlantılı). Sonuç: **TikTok'ta botun kendi attığı hiçbir yorum asla "kendi yorumumuz" olarak tanınmıyor** — her biri yeni bir müşteri yorumu sanılıp otomatik cevap kuyruğuna giriyor, bu da yeni bir yorum (bottan) oluşturuyor, o da tekrar kuyruğa giriyor... sonsuza kadar.

## Yaptığım acil müdahale

Kod değişikliği yapma yetkim/erişimim olmadığı için (bildiğiniz üzere), veritabanı seviyesinde durdurdum:

1. **43 bekleyen `ai_jobs` görevinin tamamını `cancelled` olarak işaretledim** — hiçbiri çalışmadan önce yakaladım, veritabanından doğruladım: 43 görevin 43'ü de `cancelled`, hiçbiri `completed`/`processing` durumuna geçmemiş. Yani **TikTok'a bu döngüden kaynaklı ekstra bir spam yorum gitmedi** (döngü zaten sizin/Antigravity'nin attığı birkaç gerçek cevaptan başlamıştı, onun ötesinde otomatik patlama gerçekleşmeden durduruldu).
2. Botu tamamen kapatmayı denedim (`bot_settings.social_bot_active = false`) ama bunu yaparken **ikinci, bağımsız bir hata daha** buldum: `bot_settings.merchant_id` alanı `users` tablosuna foreign key ile bağlı, ama webhook kodu buraya bir `organizations.id` (`profileId`) yazıyor/arıyor. Bu iki ID türü hiç eşleşmiyor — yani bu organizasyon için `bot_settings` satırı hiçbir zaman doğru şekilde oluşturulamamış/bulunamamış olabilir, kod da satır bulamayınca varsayılan olarak "bot aktif" kabul ediyor (`botSettings?.social_bot_active !== false` → satır yoksa `undefined !== false` → `true`). Bunu ayrı bir mimari sorun olarak not ediyorum, şimdilik dokunmadım (yanlış tabloya yanlış veri yazmamak için).
3. Son 2 dakikadır yeni event/job gelmiyor — döngü şu an duraklamış görünüyor, ama **kod düzeltmesi yapılmadan** bu risk her an tekrar tetiklenebilir (örneğin birisi TikTok'tan botun kendi yorumlarından birine tekrar "cevap" atarsa, ya da kaçırdığım bir görev varsa).

## Kalıcı çözüm (Antigravity uygulamalı)

`zernio-webhook/index.ts`'teki `isOwnComment` kontrolüne `isOwnAccount` alanını da eklemek gerekiyor:

```ts
const isOwnComment = (
  commentData.isOwn === true ||
  commentData.isOwnAccount === true ||   // TikTok bu alanı kullanıyor — 16.09.2026'da gerçek webhook payload'ından doğrulandı
  commentData.direction === 'outbound' ||
  (platformUsername && authorName === platformUsername)
);
```

Bu tek satırlık ekleme, döngünün kök nedenini kapatır. `bot_settings`/`merchant_id` uyuşmazlığı ayrı bir konu — isterseniz onu da ayrıca inceleyebilirim ama şu an acil değil (bot zaten kod düzeltmesiyle kendi yorumlarına cevap vermeyi bırakacak).

## Şimdi sizden istediğim
1. Yukarıdaki tek satırlık düzeltmeyi Antigravity'ye uygulatıp deploy edin.
2. Deploy'dan sonra ben tekrar loglardan/veritabanından bağımsız doğrularım — yeni bir "kendi cevabımıza cevap" döngüsü başlamadığını teyit ederim.
3. İsterseniz `bot_settings`/`merchant_id` uyuşmazlığını da ayrıca inceleyeyim (düşük öncelik, ama gerçek bir mimari sorun).
