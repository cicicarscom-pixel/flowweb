# TikTok kullanıcı adı neden görünmüyor — ve Zernio'nun kendi panelinde neden görünüyor

## Doğrulanan gerçek: Webhook'ta kullanıcı adı YOK, ama başka bir uç noktada VAR

Zernio'nun resmi dokümantasyonunda (gönderdiğiniz PDF'in "Webhooks" bölümü, sayfa 10), siyah beyaz şöyle yazıyor:

> "TikTok supports `comment.received`, `message.received` and `message.sent` webhooks. Comment events include only the author id (no username, picture, or owner flag)."

Yani bizim webhook'umuzun aldığı `comment.received` event'i TikTok için gerçekten sadece şifreli bir `author.id` içeriyor — bu kesin, resmi kaynaktan doğrulanmış bir platform kısıtlaması, önceki cevabımda söylediğim gibi.

**Ama** sizin gönderdiğiniz ekran görüntüsü çok değerli bir ipucu verdi: Zernio'nun **kendi** paneli (zernio.com/dashboard/inbox-comments) aynı TikTok hesabı (@direnis.kahvesi) için gerçek kullanıcı adlarını ("şevâzgül", "mami", "Yusuf Sevdımbaş" vb.) gösterebiliyor. Bu, webhook'un kendisinde olmayan bilginin, **başka bir API uç noktasında** var olduğu anlamına geliyor — Zernio'nun paneli muhtemelen webhook'a değil, bu ayrı "yorumları oku" uç noktasına dayanıyor.

Dokümantasyonda bunu buldum: **`GET /v1/inbox/comments/{postId}`** ("Read comments" / "Get post comments"). Bu uç nokta zaten bizim kod tabanımızda sarmalanmış durumda — `ledger-repo/supabase/functions/shared/infrastructure/zernio/CommentApi.ts` içinde `getInboxPostComments(postId, accountId)` metodu olarak (muhtemelen daha önce başka bir amaçla eklenmiş, henüz webhook akışında kullanılmıyor).

Bu uç noktanın resmi response şeması şöyle (`from` = yorum yapan kişi):

```
comment: {
  id, message, createdTime,
  from: {
    id: string,
    name: string,
    username: string,
    picture: string,
    isOwner: boolean,
    verifiedType: string
  },
  likeCount, replyCount, platform, url, replies, ...
}
```

Yani bu uç nokta **name/username alanlarını destekliyor** — webhook'un aksine. Zernio'nun kendi panelinin gerçek isimleri göstermesi de bunu doğruluyor (TikTok'un kendi "get video comments" API'si yorumcunun display name'ini içeriyor, sadece webhook bildirimi bunu taşımıyor).

## Önerdiğim çözüm (sync-external ile aynı desen)

Webhook'ta bir yorum geldiğinde `authorName` çözülemezse (yani `author.name`/`author.username` yoksa — TikTok'ta hep böyle), `getInboxPostComments` ile o postun yorumlarını çekip, gelen `commentId` ile eşleşen yorumu bulup `from.name || from.username` değerini kullanmak.

**Önemli: Bunu "kesin doğru" diye sunmuyorum.** Daha önce method adında (`syncExternalPost` → `syncExternalPosts`) ve response şeklinde yanlış tahminde bulunup canlıda hataya sebep olduk — o yüzden bu sefer önce TEK bir gerçek API çağrısıyla doğrulamak istiyorum: yanıtın gerçekten `from.name`/`from.username` içerip içermediğini, ve hey-api sarmalayıcısının (`{data, error, response}`) burada da geçerli olup olmadığını.

## Önerdiğim ilk adım: sadece gözlem, kod değişikliği değil

Aşağıdaki gibi TEK SEFERLİK bir test çağrısını (örneğin bir Deno REPL'de ya da geçici bir log satırıyla) `zernio.comments.getInboxPostComments('7686071130758712577', '6aaa375e8d284ffb21067b10')` şeklinde çalıştırıp ham JSON yanıtını `console.log(JSON.stringify(...))` ile loglara yazdırabilir misiniz? (Post ID'yi "Haydar Baş Beyefendi" videosunun ID'si olarak verdim, hesap ID'si de aynı @direnis.kahvesi hesabı.)

Bunun sonucunu gördüğümde, gerçek alan adlarını teyit edip webhook'a doğru entegrasyonu (post content'te yaptığımız gibi) net bir şekilde yazabilirim — tahmin yürütmeden.

## Bonus not
Mesajınızda "tiktok mesajları gelen kutumuzda görülmüyor" dediniz — eğer bu DM/mesajlar (comment değil, gerçek TikTok direct message) ile ilgiliyse, bu tamamen ayrı bir konu ve dokümantasyona göre TikTok DM'leri için ayrı kısıtlamalar var (yalnızca TikTok Business hesapları, sadece AB/İsviçre/UK dışı bölgeler, ve "sadece yanıt verebilirsiniz, siz konuşma başlatamazsınız" gibi). Eğer kastettiğiniz asıl olarak yorumlardaki kullanıcı adıysa (ekran görüntüsü öyle gösteriyor), yukarıdaki plan doğru yönde. Hangisini kastettiğinizi netleştirirseniz DM tarafını da ayrıca inceleyebilirim.
