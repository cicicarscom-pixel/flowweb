# Kesin fix — doğru namespace ve parametre yapısıyla

Teşekkürler, bu tam da ihtiyacımız olan şeydi — tahmin değil, gerçek tip tanımlarından gelen kesin bilgi. Aşağıda üç dosyada yapılacak değişiklikler var: (1) `PostApi.ts`'teki yanlış eklemeyi geri al, (2) `AnalyticsApi.ts`'e doğru metodu ekle, (3) `zernio-webhook/index.ts`'i doğru çağrıyı ve doğru yanıt şeklini kullanacak şekilde güncelle.

## 1) `ledger-repo/supabase/functions/shared/infrastructure/zernio/PostApi.ts` — yanlış eklemeyi geri al

**Şu an dosyanın sonunda** (bir önceki, hatalı denemeden kalan):
```ts
  /**
   * Zernio üzerinden değil, doğrudan platformda (native olarak) paylaşılmış bir
   * gönderiyi Zernio'ya senkronize edip içeriğini getirir. ...
   */
  async syncExternalPost(accountId: string, postId: string): Promise<ZernioResponse> {
    return withRetry(() => (this.context.sdk.posts.syncExternalPost as any)({
      body: { accountId, postId }
    }));
  }
}
```

**Olacak** (bu metodu tamamen silin, dosya `unpublishPost`'tan sonra kapanan `}` ile bitsin):
```ts
  async unpublishPost(postId: string, platform: string): Promise<ZernioResponse> {
    return withRetry(() => (this.context.sdk.posts.unpublishPost as any)({
      path: { postId },
      body: { platform }
    }));
  }
}
```

## 2) `ledger-repo/supabase/functions/shared/infrastructure/zernio/AnalyticsApi.ts` — doğru metodu ekle

Dosyanın sonundaki kapanış `}`'den hemen önce ekleyin:

```ts
  /**
   * Zernio üzerinden değil, doğrudan platformda (native olarak) paylaşılmış bir
   * gönderiyi Zernio'ya senkronize edip içeriğini getirir. Zernio API dokümantasyonu:
   * POST /v1/posts/sync-external (https://docs.zernio.com/analytics/sync-external-posts,
   * doküman sitesinde "Analytics" kategorisinde listeleniyor). `listPosts()` bu tür
   * postları ASLA döndürmez çünkü varsayılan olarak sadece source=zernio postlarını
   * listeler. Metod adı ve namespace'i 16.09.2026'da @zernio/node paketinin gerçek
   * index.d.ts dosyasından doğrulandı: `analytics.syncExternalPosts` (çoğul "s" ile,
   * `posts` değil `analytics` altında) — ilk denemede yanlışlıkla PostApi.ts'e
   * `syncExternalPost` (tekil) olarak eklenmişti, "is not a function" hatası verdi.
   */
  async syncExternalPosts(accountId: string, postId: string): Promise<ZernioResponse> {
    return withRetry(() => (this.context.sdk.analytics.syncExternalPosts as any)({
      body: { accountId, postId }
    }));
  }
}
```

## 3) `ledger-repo/supabase/functions/zernio-webhook/index.ts` — doğru çağrı + doğru yanıt ayrıştırma

**Şu an** (yanlış namespace, yanlış yanıt şekli varsayımı):
```ts
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
```

**Olacak** (doğru namespace: `analytics.syncExternalPosts`; SDK `hey-api` sarmalayıcısı olduğu için yanıt `{data, error, response}` şeklinde döndüğünden `syncRes.data.post` / `syncRes.data.found` okunuyor):
```ts
            try {
              const zernio = new ZernioClient();
              const syncRes: any = await zernio.analytics.syncExternalPosts(zernioAccountId, actualPostId);
              // hey-api sarmalayıcısı ({data, error, response}) kullanıldığı için asıl
              // içerik syncRes.data altında geliyor — 16.09.2026'da @zernio/node'un
              // gerçek tip tanımlarından doğrulandı.
              const foundPost = syncRes?.data?.post;
              if (syncRes?.data?.found && foundPost) {
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
```

Sadece iki satır değişti: `zernio.posts.syncExternalPost(...)` → `zernio.analytics.syncExternalPosts(...)`, ve `foundPost = syncRes?.post || syncRes?.data?.post` → `foundPost = syncRes?.data?.post` (artık `data` her zaman var olacağı için `||` ile eski yanlış varsayımı denemeye gerek yok, ama `syncRes?.data?.found` kontrolünü de ekledim ki `found:false` durumunda content'i boş bırakmayalım).

## Deploy ve test
```bash
supabase functions deploy zernio-webhook
```
Deploy sonrası, biraz önce yorum attığınız "Haydar Baş Beyefendi" videosuna (native ID `7686071130758712577`, hâlâ içeriği boş duran post) yeni bir test yorumu daha atın — bu sefer `sync-external` çağrısının gerçekten başarılı olduğunu ve içeriğin doğru şekilde çekildiğini loglardan doğrularım.
