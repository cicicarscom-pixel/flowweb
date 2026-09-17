# TikTok caption sorununun GERÇEK kök nedenini buldum — dokümante edilmiş, kanıtlı

Diagnostik logumuz (`ZERNIO_POST_PLATFORMS_RAW`) sizin temizliğiniz sonrası bile ısrarla boş (`[]`) dönmeye devam edince, "belki profildeki başka bozuk bir bağlantı listPosts'u engelliyordur" hipotezimi bir kenara bıraktım (yanlış çıktı — TikTok zaten `slot_1`/primary'de, tek başına sağlıklı haldeyken bile 3 kez boş döndü) ve doğrudan Zernio'nun resmi API dokümantasyonuna (docs.zernio.com) gittim. Cevap orada duruyordu.

## Kök neden: `listPosts()` varsayılan olarak SADECE Zernio üzerinden oluşturulmuş postları döndürüyor

`GET /v1/posts` (bizim `zernio.posts.listPosts()` sarmaladığımız uç nokta) bir `source` query parametresi alıyor:

| Parametre | Varsayılan | Anlamı |
|---|---|---|
| `source` | **`"zernio"`** | `"zernio"` (Zernio üzerinden oluşturulmuş/planlanmış postlar) veya `"external"` (doğrudan platformda paylaşılmış, Zernio'dan geçmemiş postlar) |

Bizim kodumuz (`PostApi.ts`, `listPosts`) bu parametreyi hiç göndermiyor:
```ts
async listPosts(profileId: string): Promise<ZernioResponse> {
  return withRetry(() => this.context.sdk.posts.listPosts({ query: { profileId } }));
}
```
Parametre gönderilmeyince Zernio varsayılan olarak `source=zernio` uyguluyor — yani kullanıcının TikTok'ta **doğrudan uygulamadan paylaştığı** ("Bu Alçak 3,5 kuruş...", "cezaevi kapıları..." vb. — hepsi native TikTok gönderisi, hiçbiri Workigom/Zernio üzerinden planlanmadı) postların TAMAMI bu sorguda görünmez oluyor. `listPosts()` boş dönmesinin sebebi bozuk token, yanlış profil ya da API hatası değilmiş — basitçe "bu tür postları zaten hiç sormuyorduk".

Bu, en başından beri peşinde olduğumuz caption sorununun gerçek kaynağı: webhook'un native TikTok ID'sini Zernio'nun iç ID'siyle eşleştirememesi sorunu da aslında ikincil bir semptommuş — asıl sorun, REST fallback'imizin baktığı yerde (`listPosts`) bu postların YAPISAL OLARAK hiç bulunmaması.

## Doğru araç zaten hazır: `POST /v1/posts/sync-external`

Zernio'nun tam bunun için ayrı bir uç noktası var — "bir kullanıcı native olarak paylaştı ve hemen doğrulamak istiyorsunuz" senaryosu için tasarlanmış:

**İstek:**
```
POST /v1/posts/sync-external
Body: { accountId: "<zernio hesap ID'si>", postId: "<platformun native post ID'si>" }
```

**Yanıt:**
```json
{
  "found": true,
  "post": {
    "platformPostId": "7683431493879794962",
    "platformPostUrl": "https://www.tiktok.com/@direnis.kahvesi/video/...",
    "platform": "tiktok",
    "publishedAt": "...",
    "content": "Bu Alçak 3 ,5 kuruş ceza yazılıp sokağa mı salınacak?",
    "analytics": { "likes": 0, "comments": 0, "views": 0 }
  }
}
```

Yani `platformPostId` alanı tam da aradığımız şey — native ID'yi açıkça taşıyan alan bu. SDK'nın GitHub README'sinde de `posts.syncExternalPost()` metodunun gerçekten var olduğunu doğruladım (isim tahmini değil).

**Ayrıca güzel bir tesadüf:** webhook kodumuzda (`zernio-webhook/index.ts`, satır 83-89) her event için zaten `zernioAccountId` çözülüyor (`payload.account?.id` vb. üzerinden) — yani `comment.created`/`comment.received` case'inde bu değişken ZATEN elimizde, ayrı bir DB sorgusuna (eski kodun yaptığı `zernio_profiles` + `is_primary` lookup'ı) hiç gerek yok.

## Önerilen düzeltme

### 1) `ledger-repo/supabase/functions/shared/infrastructure/zernio/PostApi.ts` — yeni metod ekle

```ts
  /**
   * Zernio üzerinden değil, doğrudan platformda (native olarak) paylaşılmış bir
   * gönderiyi Zernio'ya senkronize edip içeriğini getirir. Zernio API dokümantasyonu:
   * POST /v1/posts/sync-external (https://docs.zernio.com/analytics/sync-external-posts).
   * `listPosts()` bu tür postları ASLA döndürmez çünkü varsayılan olarak sadece
   * source=zernio (Zernio'nun kendi oluşturduğu) postları listeler — native postlar
   * için tek doğru yol bu uç nokta (16.09.2026'da doküman üzerinden doğrulandı).
   *
   * ⚠️ DİKKAT: `syncExternalPost` metod adı SDK'nın GitHub README'sinde doğrulandı,
   * ama tam çağrı imzasını (body sarmalama şekli) deploy öncesi TypeScript
   * otokompletiyle bir kez daha teyit edin — diğer metodlarla aynı ihtiyat kuralı.
   */
  async syncExternalPost(accountId: string, postId: string): Promise<ZernioResponse> {
    return withRetry(() => (this.context.sdk.posts.syncExternalPost as any)({
      body: { accountId, postId }
    }));
  }
```

### 2) `ledger-repo/supabase/functions/zernio-webhook/index.ts` — REST fallback'i değiştir (satır ~285-309 civarı)

**Şu an** (yanlış uç noktayı kullanıyor, yanlış ID alanıyla eşleştirmeye çalışıyor):
```ts
          const needsRestFallback = !postContent && (!postData || !postData.content);
          if (needsRestFallback) {
            try {
              const { data: zernioProfile } = await supabase
                .schema('integration')
                .from('zernio_profiles')
                .select('zernio_profile_id')
                .eq('organization_id', profileId)
                .eq('is_primary', true)
                .maybeSingle();

              if (zernioProfile?.zernio_profile_id) {
                const zernio = new ZernioClient();
                const postsRes: any = await zernio.posts.listPosts(zernioProfile.zernio_profile_id);
                const postsList = postsRes.data?.posts || postsRes.posts || postsRes.data || [];
                const matchedPost = postsList.find((p: any) => (p._id || p.id) === actualPostId);
                if (matchedPost) {
                  if (!postContent && matchedPost.content) postContent = matchedPost.content;
                  if (!postImageUrl) {
                    postImageUrl = matchedPost.picture || matchedPost.image || matchedPost.thumbnail || null;
                  }
                }
              }
            } catch (restFallbackErr) {
              console.warn('[webhook] REST post-content fallback failed:', restFallbackErr);
            }
          }
```

**Olacak:**
```ts
          const needsRestFallback = !postContent && (!postData || !postData.content);
          if (needsRestFallback && zernioAccountId && actualPostId) {
            // ESKİ YAKLAŞIM YANLIŞTI: listPosts() varsayılan olarak source=zernio
            // filtreliyor, yani Zernio üzerinden değil doğrudan platformda (native)
            // paylaşılmış postları HİÇBİR ZAMAN döndürmüyordu — eşleştirme denemesi
            // bu yüzden hep boşa çıkıyordu (16.09.2026, docs.zernio.com üzerinden
            // doğrulandı). Doğru araç: POST /v1/posts/sync-external — native post ID'yi
            // doğrudan account bazında sorgulayıp içeriği getiriyor.
            try {
              const zernio = new ZernioClient();
              const syncRes: any = await zernio.posts.syncExternalPost(zernioAccountId, actualPostId);
              const foundPost = syncRes?.post || syncRes?.data?.post;
              if (foundPost) {
                if (!postContent && foundPost.content) postContent = foundPost.content;
                // Not: sync-external yanıt şemasında dokümante edilmiş bir resim/thumbnail
                // alanı yok (sadece content/platformPostUrl/analytics) — postImageUrl bu
                // yoldan gelmeyebilir, mevcut diğer kaynaklar (payload.post.imageUrl vb.)
                // dokunulmadan aynen çalışmaya devam ediyor.
              } else {
                console.warn(`[webhook] sync-external postu bulamadı. accountId=${zernioAccountId} postId=${actualPostId}`);
              }
            } catch (restFallbackErr) {
              console.warn('[webhook] sync-external fallback failed:', restFallbackErr);
            }
          }
```

Tek fark: artık `zernio_profiles` sorgusuna hiç gitmiyoruz (zaten elimizde olan `zernioAccountId`'yi kullanıyoruz), ve `listPosts()` yerine doğru uç noktayı (`syncExternalPost`) çağırıp doğru alandan (`foundPost.content`) okuyoruz.

## Deploy ve test
```bash
supabase functions deploy zernio-webhook
```
Deploy sonrası "Bu Alçak 3,5 kuruş..." (veya başka herhangi bir native TikTok) gönderisine yeni bir test yorumu atın. Ben Supabase loglarından `sync-external` çağrısının gerçekten tetiklendiğini ve `comments`/`posts` tablosuna doğru `content` ile yazıldığını doğrudan doğrularım — Gelen Kutusu'nda "Gönderi detayı bulunamadı" yerine gerçek başlığın göründüğünü siz de göreceksiniz.

## Sonraki adım (bu doğrulandıktan sonra)
Daha önce oluşmuş 3 adet "hayalet" (native ID'li, içeriksiz stub) post satırını, artık doğru içeriğe sahip olan gerçek postla birleştirip yorumlarını doğru posta taşıyacak bir SQL hazırlayacağım — ama önce yukarıdaki asıl düzeltmenin canlıda gerçekten çalıştığını görelim.

---

**Kaynaklar (Zernio resmi dokümantasyonu):**
- [List posts - API Reference](https://docs.zernio.com/posts/list-posts)
- [Sync an external post - API Reference](https://docs.zernio.com/analytics/sync-external-posts)
- [Zernio Node.js SDK - GitHub](https://github.com/zernio-dev/zernio-node)
