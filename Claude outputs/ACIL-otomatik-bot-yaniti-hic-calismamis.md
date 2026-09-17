# 🚨 Kritik bulgu: Otomatik AI yanıt kuyruğu, bot_settings hatası yüzünden büyük olasılıkla hiç çalışmamış

## Nereden başladı

Ekran görüntünüzdeki "Missing accountId for reply-comment" hatasını incelerken (aşağıda ayrıca açıklıyorum), loglarda dikkatimi başka bir şey çekti: `[HandleIncomingMessageUseCase] Bot settings fetch error or not found.` — son 24 saatte **17 kez** tekrar etmiş. Kaynağına indim ve çok daha büyük bir sorunla karşılaştım.

## Kök neden: aynı bot_settings/organization id hatası, farklı ve DAHA ÖNEMLİ bir dosyada

Daha önce `zernio-webhook/index.ts`'te bulup düzelttiğimiz `bot_settings.merchant_id` (gerçek `auth.users.id`) ile `organizations.id` uyuşmazlığını hatırlarsınız. O düzeltme sadece **webhook'un** "bot kapalı mı, iş kuyruğa girsin mi?" kontrolünü onardı.

Ama iş kuyruğa girdikten SONRA, gerçek yanıtı üretip gönderen taraf — `process-ai-jobs` → `HandleIncomingMessageUseCase.ts` — **kendi ayrı ve hâlâ düzeltilmemiş** bir `bot_settings` sorgusu yapıyor:

```ts
// HandleIncomingMessageUseCase.ts, satır 46-51
const { data: botSettings, error: botError } = await supabaseClient
  .from('bot_settings')
  .select('*')
  .eq('merchant_id', merchantId)   // merchantId burada organizations.id — YANLIŞ
  .single();

if (botError) {
  console.warn("[HandleIncomingMessageUseCase] Bot settings fetch error or not found.");
  return; // ayarlar olmadan devam edemeyiz
}
```

`merchantId` buraya `ai_jobs.payload.merchantId` üzerinden geliyor, ve webhook'un kuyruğa iş eklerken kullandığı değer kesin olarak organizasyon id'si (`merchantId: profileId` — `zernio-webhook/index.ts` satır 215 ve 422). Yani bu sorgu da **tıpkı eski haliyle webhook'taki gibi** hiçbir zaman eşleşen satır bulamıyor, `.single()` hata veriyor, `botError` doluyor, fonksiyon **hiçbir şey yapmadan sessizce return ediyor.**

## Neden şimdiye kadar fark edilmedi: iş, "başarılı" gibi kuyruktan siliniyor

`process-ai-jobs/index.ts`'i inceledim:

```ts
try {
  await useCase.execute(supabase, job.payload);
  // Başarılıysa kuyruktan tamamen sil
  await supabase.from('ai_jobs').delete().eq('id', job.id);
} catch (err) {
  // sadece burada 'failed'/'pending' olarak işaretlenir
}
```

`HandleIncomingMessageUseCase.execute()` yukarıdaki `botError` durumunda **exception fırlatmıyor, sadece `return` ediyor** — yani `process-ai-jobs`'ın gözünde hiçbir hata yok, iş "başarılı" sayılıp satır tamamen siliniyor. Sonuç: ne `failed` durumunda kalan bir kayıt, ne bir retry, ne görünür bir hata — sadece o tek `console.warn` satırı, kimse özellikle log aramadıkça asla görülmeyen.

## Kanıt: `ai_jobs` tablosunun tüm geçmişi

```sql
SELECT task_type, status, count(*) FROM ai_jobs GROUP BY task_type, status;
-- debug_webhook_error | failed    | 6
-- instagram_comment   | cancelled | 44
```

Tablonun **tüm zamanlar** verisi bu — 06.09'dan bugüne kadar oluşturulan 50 işin hiçbiri `completed` görünmüyor (zaten görünmezdi, başarılı olanlar siliniyor) ama daha da önemlisi **hiçbiri normal şekilde işlenip silinmemiş** — mevcut olan 44 kaydın tamamı, geçmişteki sonsuz döngü olayında elle iptal ettiğimiz (`cancelled`) işler. Yani elimde "otomatik olarak başarıyla gönderildi" diyebileceğim tek bir iz bile yok. Bu segment içinde gördüğümüz tüm başarılı yanıtlar (örn. "haklısın", "aile var işte...") **sizin Gelen Kutusu'ndan manuel gönderdiğiniz** yanıtlardı — bunlar `ai_jobs` kuyruğuna hiç girmeyen, doğrudan `reply-comment` action'ını çağıran ayrı bir kod yolu.

## Sonuç

Elimdeki veriye göre: **botun yorumlara/mesajlara otomatik AI yanıtı üretip gönderme özelliği, organizasyon mimarisine geçildiğinden beri muhtemelen hiç gerçek anlamda çalışmamış.** Sadece siz Gelen Kutusu'ndan elle yanıtladığınızda (veya Zernio panelinden) bir şey gönderiliyor. Son 24 saatte bu sessiz hata en az 17 kez tetiklenmiş.

## Önerilen düzeltme

`HandleIncomingMessageUseCase.ts`'e, `zernio-webhook/index.ts`'e uyguladığımız aynı çözümü taşıyın — `bot_settings`'i doğrudan `merchantId` ile değil, önce `organization_members`'tan gerçek sahip `user_id`'sini bulup onunla sorgulayın:

```ts
const { data: ownerMember } = await supabaseClient
  .from('organization_members')
  .select('user_id')
  .eq('organization_id', merchantId)
  .eq('role', 'owner')
  .maybeSingle();

const { data: botSettings, error: botError } = ownerMember
  ? await supabaseClient
      .from('bot_settings')
      .select('*')
      .eq('merchant_id', ownerMember.user_id)
      .maybeSingle()
  : { data: null, error: null };

if (!botSettings) {
  console.warn("[HandleIncomingMessageUseCase] Bot settings fetch error or not found.");
  return;
}
```

**Ayrıca önerim:** Bu mantık artık iki ayrı dosyada aynen tekrarlanıyor (webhook + use case) — üçüncü bir yerde de tekrar unutulmasın diye, "org id'den gerçek bot_settings satırını bul" işini paylaşılan (shared) tek bir yardımcı fonksiyona (`resolveBotSettingsForOrg(supabase, orgId)` gibi) çıkarmanızı öneririm. İleride benzer bir yeri daha atlamayı önler.

**Test önerisi:** Düzeltme deploy edildikten sonra, gerçek bir müşteri yorumuna (sizin veya botun DEĞİL, gerçek bir kullanıcının yorumuna) hiç müdahale etmeden bekleyin — 8-13 dakika sonra `ai_jobs`'a düşüp otomatik işlenmesini ve TikTok'ta gerçekten bir yanıt belirmesini izleyelim. Ben de `function_logs`'ta "Bot settings fetch error" satırının artık hiç çıkmadığını ve işin kuyruktan silinmeden önce gerçekten `replyToComment` çağrısı yaptığını doğrularım.

---

# Ayrıca: ekran görüntünüzdeki "Missing accountId for reply-comment" hatası

Bu, farklı ve daha küçük bir sorun — kök nedenini buldum:

Yanıt vermeye çalıştığınız "Arif Akar" yorumu, aynı gönderi (`zernio_post_id: 6aa151c83db89d611fdb4acc`) altında toplanmış ama **platformu `facebook`** — oysa bu organizasyonda şu an sadece **TikTok** hesabı bağlı/aktif (`integration.social_accounts`'ta tek satır, `platform: tiktok`). `zernio-client`'taki `reply-comment` handler'ı, `accountId` gelmediğinde organizasyonun o platform için aktif hesabını otomatik bulmaya çalışıyor — ama Facebook için aktif hesap olmadığından hiçbir şey bulamıyor ve `"Missing accountId for reply-comment"` hatası fırlatıyor.

Yani teknik olarak beklenen bir durum (bağlı olmayan bir platformdaki yoruma yanıt veremeyiz) — ama gerçek sorun şu: **`gelen-kutusu/page.tsx`'teki `handleSendReply` bu hatayı yakalayıp sadece `console.error`'a yazıyor (satır 300-302, `alert` çağrısı yorum satırına alınmış) — size hiçbir görünür hata/uyarı göstermiyor.** Siz yanıtı gönderdiğinizi sanıyorsunuz ama aslında hiçbir şey gitmiyor, sessizce.

**Önerilen düzeltme:** `handleSendReply`'deki `catch` bloğunda kullanıcıya görünür bir hata mesajı gösterin (örn. "Bu yoruma yanıt gönderilemedi: platform bağlı değil" gibi platform-özel bir mesaj `err.message.includes('Missing accountId')` durumunda). Bonus: aynı gönderi altında birden fazla platformdan yorum varsa (cross-post), Gelen Kutusu'nda hangi platformdan geldiğini gösteren bir rozet/etiket eklemek de kullanıcı için netlik sağlar.

Bu ikinci konu acil değil (tek bir platform-mismatch durumu, veri kaybı yok) ama yukarıdaki otomatik yanıt sorunu **acil** — isterseniz önce onu Antigravity'ye ilettirelim.
