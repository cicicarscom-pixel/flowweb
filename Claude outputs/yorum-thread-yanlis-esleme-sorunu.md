# Yanıt (reply) yanlış yorumun altına eşleniyor — kök neden bulundu

## Özet

Bahsettiğiniz "sağa çekip dursaydı" örneğini uçtan uca doğrudan veriden izledim. **TikTok'un kendi webhook payload'ı doğru** — sorun bizim tarafımızda, hem veride hem arayüzde.

## Kanıt: TikTok'un gönderdiği ham veri baştan beri doğru

`integration.webhook_events` tablosundaki ham payload'ları sorguladım. Sizin verdiğiniz iki yanıt da (`@Bilinmeyen haklısın` ve `@Bilinmeyen aile var işte belkide düşünemedi hocam`) TikTok tarafından **doğru** `parentCommentId` ile geldi:

```json
"comment": {
  "id": "7686219732743570183",
  "text": "@Bilinmeyen haklısın",
  "isReply": true,
  "parentCommentId": "7686028842788832016"   // ✅ "Sağya çekip dursaydı..." yorumunun gerçek id'si
}
```

İkinci yanıt için de aynı `parentCommentId: "7686028842788832016"`. Yani TikTok mobilde doğru gördüğünüz şey tesadüf değil — gerçek veri hep doğruydu. Sorun bizim sistemimizin bu bilgiyi nasıl işlediğinde.

## Kök neden 1: `parentCommentId` veritabanına hiç kaydedilmiyor

`comments` tablosunun şemasını kontrol ettim — `parent_comment_id` diye bir kolon **yok** (`id, profile_id, post_id, zernio_post_id, zernio_comment_id, username, content, liked, hidden, platform, created_at, updated_at`).

`zernio-webhook/index.ts`'te (ledger-repo) şu kodu buldum:

```ts
if (commentData.parentCommentId || commentData.isReply) {
  const parentId = commentData.parentCommentId || commentData.parentId;
  if (parentId) {
    const { data: parentComment } = await supabase
      .from('comments')
      .select('author_name, username')
      .eq('zernio_comment_id', parentId)
      .single();
    const pUser = parentComment?.author_name || parentComment?.username || 'Yorum';
    finalCommentText = `↳ @${pUser}:\n${commentText}`;
  }
  ...
}
// finalCommentText metne gömülüyor, gerçek parentId hiçbir yere kaydedilmiyor
```

Yani doğru `parentCommentId` webhook'a geliyor, bir kez kullanılıp (üst yorumun kullanıcı adını bulmak için) sonra **atılıyor**. Veritabanına sadece `"↳ @isim:\n..."` diye düz metin olarak gömülüyor — geri dönüşü olmayan bir bilgi kaybı.

## Kök neden 2 (asıl gördüğünüz hata): arayüz, yanlış yorumu "ilk eşleşen" mantığıyla seçiyor

`flowweb-repo`'da `gelen-kutusu/page.tsx` dosyasında (82-118. satırlar) yanıtları üst yoruma şu şekilde eşliyor:

```ts
for (const parent of postGroup.parentComments) {
   const uName = parent.author_name || parent.username;
   if (uName && comm.content && comm.content.includes(`@${uName}`)) {
      parent.replies.push(comm);
      foundParent = true;
      break;   // ← ilk eşleşende duruyor
   }
}
```

Gerçek `parentCommentId` elde olmadığı için arayüz, "bu yanıt metninde `@kullanıcıadı` geçiyor mu" diye metin araması yapıp **ilk eşleşen** üst yorumu seçiyor. Sizin özel durumunuzda bunu doğrudan doğruladım — "Bu Alçak..." gönderisinde kullanıcı adı çözümlenemediği (TikTok kullanıcı adı özelliğini birlikte erteleme kararı aldığımız özellik) için aynı gönderide **üç ayrı, birbirinden bağımsız TikTok yorumu** aynı yer tutucu isimle (`Bilinmeyen`) kayıtlı:

| Yorum | zernio_comment_id | Tarih |
|---|---|---|
| "Sağya çekip dursaydı keşke..." (gerçek üst yorum) | 7686028842788832016 | 16.09 07:17 |
| "alçak namussuz" | 7686054588705768210 | 16.09 08:57 |
| "alçaklığın resmi" | 7686238774027666184 | 16.09 20:52 |

Yanıt metniniz `"@Bilinmeyen haklısın"` — üçü de `username: "Bilinmeyen"` olduğu için metin eşlemesi bunlardan **hangisiyle karşılaşırsa önce onu** seçiyor (bu da listenin o an hangi sırada geldiğine bağlı, garanti bir sıra yok) — sizin durumunuzda yanlış olanı (başka bir hesaptan gelen "alçaklığın resmi" yorumu) seçmiş. Yani bug'ı tetikleyen şey aslında **kullanıcı adı çözümlemesinin ertelenmiş olması** — gerçek kullanıcı adları bilinseydi bu üç yorum farklı isimlerle ayrılır, metin eşlemesi (kırılgan olsa da) muhtemelen doğru sonuca ulaşırdı. Aynı gönderide birden fazla "Bilinmeyen" yorumu olduğunda ise eşleşme artık tamamen şansa kalıyor.

## Önerilen düzeltme

1. **`comments` tablosuna `parent_comment_id text` kolonu eklensin** (migration).
2. **`zernio-webhook/index.ts`**: metne gömme mantığını koru (görüntüleme için hâlâ işe yarıyor) ama ayrıca ham `parentId`'yi yeni kolona yazsın:
   ```ts
   .insert({
     ...
     parent_comment_id: commentData.parentCommentId || commentData.parentId || null,
   })
   ```
3. **`gelen-kutusu/page.tsx`**: eşleme mantığını metin aramasından çıkarıp doğrudan id eşlemesine geçirin:
   ```ts
   const parent = postGroup.parentComments.find(p => p.zernio_comment_id === comm.parent_comment_id);
   ```
   `parent_comment_id` boşsa (eski kayıtlar veya id bulunamadıysa) mevcut metin-eşleme mantığı yedek (fallback) olarak kalabilir.
4. **Geçmiş veriyi düzeltme (opsiyonel ama ucuz)**: şu an sadece 22 "yanıt görünümlü" satır var ve `integration.webhook_events`'te 68 kayıtta gerçek `parentCommentId` mevcut — yani mevcut yanıtların doğru `parent_comment_id` değerini `zernio_comment_id` üzerinden `webhook_events`'ten geriye dönük dolduran tek seferlik bir script yazıp geçmiş kayıtları da düzeltebiliriz. İsterseniz bu backfill script'ini ben hazırlarım.

## Not

Bu, daha önce beraber ertelediğimiz "TikTok kullanıcı adı çözümlemesi" konusuyla dolaylı olarak bağlantılı — o özellik olmadan bile asıl kalıcı çözüm (gerçek `parentCommentId`'yi saklamak) yeterli, kullanıcı adı bilinmese de doğru eşleşmeyi garanti eder. Yani bu konuyu tekrar açmamıza gerek yok, sadece not düşmek istedim.

Nasıl ilerlemek istersiniz — yukarıdaki 3 maddelik düzeltmeyi (+ isterseniz backfill) Antigravity'ye uygulatalım mı?
