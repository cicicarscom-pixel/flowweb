# Test sonucunu doğrudan veritabanından kontrol ettim — kısmi ilerleme var ama yeni (farklı) bir sorun bulundu

## Özet

`analytics.syncExternalPosts` düzeltmesi **doğru deploy edilmiş durumda** (v83, kodu tek tek doğruladım — namespace, response parsing, hepsi tam yazdığımız gibi). Yani bir önceki "yanlış metod adı" sorunu artık yok.

Ama attığınız iki test yorumu ("rahmetli" ve "Allah rahmet eylesin", ekran görüntüsünde gördüğünüz ikisi) hâlâ "Gönderi detayı bulunamadı" gösteriyor. Bunun nedenini veritabanından doğrudan izledim ve **farklı, yeni bir hata** buldum:

## Yeni bulgu: Post kaydı DB'ye hiç yazılmıyor (ve hata sessizce yutuluyor)

Webhook kodu şu akışı izliyor: yorum geldiğinde, önce o TikTok postu için local `posts` tablosunda bir kayıt arıyor. Bulamazsa (native paylaşım olduğu için bulamıyor), `sync-external` ile içeriği çekiyor (bu kısım artık doğru çalışıyor), sonra bu içerikle birlikte yeni bir "post" satırı oluşturmaya (upsert) çalışıyor.

İşte tam burada satır kayboluyor: **upsert komutu veritabanına hiç ulaşmıyor / başarısız oluyor, ama kod bu hatayı kontrol etmeden geçiyor:**

```ts
const { data: newPost, error: stubError } = await supabase
  .from('posts')
  .upsert({ ... }, { onConflict: 'zernio_post_id' })
  .select('id')
  .single();
if (newPost) internalPostId = newPost.id;
// ⚠️ stubError HİÇBİR ZAMAN kontrol edilmiyor / loglanmıyor
```

Doğrudan veritabanını sorgulayarak doğruladım: her iki test yorumu için de `posts` tablosunda o TikTok gönderisine ait **hiçbir satır yok**. Yorum kendisi başarıyla kaydedilmiş (comments tablosunda var), ama `post_id` alanı boş kalmış — bu yüzden arayüz "Gönderi detayı bulunamadı" gösteriyor.

Aynı isteği (aynı profil, aynı post ID) ben doğrudan SQL ile denediğimde **sorunsuz çalıştı** — yani veritabanı tarafında bir kısıtlama/izin engeli yok. Bu, sorunun Supabase'in REST katmanında (PostgREST) olduğunu düşündürüyor — en olası ihtimal, geçen hafta (7 Eylül) eklenen `zernio_post_id` üzerindeki unique constraint'in şema önbelleğine (schema cache) hâlâ yansımamış olması. Bunun standart çözümü olan şema önbelleği yenileme komutunu (`NOTIFY pgrst, 'reload schema'`) benim tarafımdan çalıştırdım — bu güvenli, veri değiştirmeyen bir komut.

**Ama bunu kesin çözüm olarak sunmuyorum** — sadece en olası ihtimali giderdim. Gerçek nedeni kesin olarak göremedim çünkü kod hatayı hiç loglamıyor.

## Önerdiğim küçük ek düzeltme (görünürlük için)

`ledger-repo/supabase/functions/zernio-webhook/index.ts` içinde, `comment.created`/`comment.received` case'inde, stub post oluşturma bloğunda:

**Şu an:**
```ts
          if (!localPostData) {
            const { data: newPost, error: stubError } = await supabase
              .from('posts')
              .upsert({
                profile_id: profileId,
                zernio_post_id: actualPostId,
                content: postContent || '',
                media_urls: postImageUrl ? [postImageUrl] : [],
                status: 'published',
                platforms: [platform || 'unknown'],
                scheduled_for: new Date().toISOString()
              }, { onConflict: 'zernio_post_id' })
              .select('id')
              .single();
            if (newPost) internalPostId = newPost.id;
          } else if (localPostData && !localPostData.content && postContent) {
            await supabase.from('posts').update({ content: postContent }).eq('id', internalPostId);
          }
```

**Olacak** (tek fark: `stubError` artık loglanıyor):
```ts
          if (!localPostData) {
            const { data: newPost, error: stubError } = await supabase
              .from('posts')
              .upsert({
                profile_id: profileId,
                zernio_post_id: actualPostId,
                content: postContent || '',
                media_urls: postImageUrl ? [postImageUrl] : [],
                status: 'published',
                platforms: [platform || 'unknown'],
                scheduled_for: new Date().toISOString()
              }, { onConflict: 'zernio_post_id' })
              .select('id')
              .single();
            if (newPost) {
              internalPostId = newPost.id;
            } else if (stubError) {
              // Bu satır olmadan post oluşturma hataları tamamen sessiz kalıyordu —
              // 16.09.2026'daki testte tam olarak bu yüzden kök nedeni göremedik.
              console.error(`[webhook] Post stub oluşturulamadı. zernio_post_id=${actualPostId} error=`, JSON.stringify(stubError));
            }
          } else if (localPostData && !localPostData.content && postContent) {
            const { error: updateErr } = await supabase.from('posts').update({ content: postContent }).eq('id', internalPostId);
            if (updateErr) {
              console.error(`[webhook] Post content güncellenemedi. id=${internalPostId} error=`, JSON.stringify(updateErr));
            }
          }
```

Bu, sorunu ÇÖZMÜYOR (o yüzden test etmeden "tamam" demiyorum) — sadece bir dahaki test başarısız olursa gerçek Postgres/PostgREST hata mesajını loglardan görebilmemizi sağlıyor. Şu anki haliyle hata tamamen karanlıkta.

## Şimdi yapmanız gerekenler

1. **Yukarıdaki küçük logging eklemesini** Antigravity'ye uygulatıp deploy edin (davranışı değiştirmiyor, sadece görünürlük ekliyor).
2. Ben zaten şema önbelleğini yeniledim — bu ihtimal doğruysa ek bir şey yapmanıza gerek yok.
3. **Yeni bir test yorumu atın** (eskiler zaten "işlendi" olarak işaretlendiği için tekrar tetiklenmiyor — mutlaka yeni bir yorum olmalı, native bir TikTok gönderisine).
4. Ben yine loglardan ve veritabanından bağımsız olarak doğrulayacağım — bu sefer ya post içeriği gerçekten dolu gelecek, ya da (şema önbelleği teorisi yanlışsa) artık gerçek hata mesajını göreceğiz ve kesin nedeni bulacağız.

Not: test sırasında oluşan geçici/boş bir post kaydını (sizin testinizden değil, benim tanı sürecimde SQL ile oluşturdum) temizledim, veritabanında artık yok.
