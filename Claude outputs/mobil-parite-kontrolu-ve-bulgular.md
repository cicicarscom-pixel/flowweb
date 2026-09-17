# Mobil (flow-repo) parite kontrolü — sonuçlar

`flow-repo`'yu (React Native) baştan sona kontrol ettim. Özet: **backend düzeltmesi (otomatik bot yanıtı) mobili de otomatik olarak kapsıyor**, ama **arayüz tarafındaki üç düzeltmenin hiçbiri mobile taşınmamış** — üstelik bunu incelerken web tarafını da etkileyen, daha önce fark etmediğimiz yeni bir boşluk buldum. Sırayla:

## 0. Otomatik bot yanıtı (BotSettingsRepository) — mobilde EK İŞLEM GEREKMİYOR ✅

Bu düzeltme `ledger-repo`'daki paylaşılan Supabase backend'de (`zernio-webhook`, `process-ai-jobs`/`HandleIncomingMessageUseCase`) yapıldı. Web ve mobil AYNI Supabase projesini ve AYNI edge function'ları kullanıyor (AGENTS.md'nizdeki "Ortak Veritabanı Etkileşimi" kuralı tam bunu söylüyor) — yani bu düzeltme zaten hem web hem mobil için aktif. Mobil tarafta bu konuda dokunulacak bir şey yok.

## 1. 🆕 Yeni bulgu: yanıt gönderilince `parent_comment_id` hiçbir zaman yazılmıyor (HEM web HEM mobil etkileniyor)

Bunu mobili incelerken fark ettim ama web'i de etkiliyor. Kullanıcı uygulamadan (Gelen Kutusu / PostCommentsScreen) bir yoruma yanıt gönderdiğinde:

1. Önce Zernio API'sine istek atılıp gerçek `zernio_comment_id` alınıyor.
2. Sonra bu ID ile **iyimser (optimistic) bir satır** doğrudan `comments` tablosuna insert ediliyor — ama bu insert'te `parent_comment_id` alanı **hiç yok**.
3. Birazdan webhook, botun kendi yanıtını "yeni bir yorum" olarak geri alıyor (echo) ve DOĞRU `parent_comment_id`'yi biliyor — ama tam o satırı insert etmeye çalıştığında `zernio_comment_id` zaten var olduğu için `23505` (duplicate) hatası alıp **sessizce vazgeçiyor** (bu, 17.08.2026'da bilinçli olarak eklediğiniz çiftleşme-önleme mekanizması — kendi içinde doğru, ama bu sefer farklı bir yan etkisi var).

Sonuç: kullanıcının uygulama içinden gönderdiği HİÇBİR yanıt, gönderildiği anda `parent_comment_id` almıyor — kalıcı olarak `NULL` kalıyor (siz az önce çalıştırdığımız backfill script'i olmasa hâlâ NULL olacaktı). Yani düzeltme, sadece (a) müşterilerin gönderdiği orijinal yorumlar ve (b) `ai_jobs` üzerinden botun otomatik gönderdiği yanıtlar için kalıcı olarak çalışıyor; kullanıcının Gelen Kutusu'ndan/PostCommentsScreen'den elle gönderdiği yanıtlar için her seferinde tekrar backfill gerekecek.

**Önerilen düzeltme (hem web hem mobil, aynı mantık):** iyimser insert'e, yanıt verilen yorumun id'sini `parent_comment_id` olarak ekleyin.

**Web — `flowweb-repo/src/app/(dashboard)/gelen-kutusu/page.tsx`, `handleSendReply` (satır ~277-290 civarı, `newComment` objesi):**
```tsx
const newComment = {
  id: Math.random().toString(),
  post_id: comment.post_id,
  zernio_comment_id: returnedCommentId,
  zernio_post_id: comment.zernio_post_id,
  parent_comment_id: comment.zernio_comment_id, // ✅ eklendi
  content: finalContent,
  username: 'Mağaza (Ben)',
  ...
};
```

**Mobil — `flow-repo/src/screens/PostCommentsScreen.js`, `handleSendPublicReply` (satır 338-357 civarı):**
```js
const newComment = {
  id: Math.random().toString(),
  post_id: post?.id,
  content: localContent,
  username: localUsername,
  parent_comment_id: isReplyToComment ? targetCommentId : null, // ✅ eklendi
  created_at: new Date().toISOString(),
  liked: false,
  hidden: false,
};
setComments(prev => [newComment, ...prev]);

await supabase.from('comments').insert({
  post_id: post?.id,
  zernio_comment_id: zernioCommentId,
  zernio_post_id: post?.zernio_post_id || post?.id,
  parent_comment_id: isReplyToComment ? targetCommentId : null, // ✅ eklendi
  content: localContent,
  username: localUsername,
  platform: post?.platform || 'unknown'
});
```

## 2. Mobilde yorum eşleştirme (threading) hatası var — hatta zaten "yarım" düzeltilmiş, tek satır eksik

`PostCommentsScreen.js`'teki `threadedComments` (satır 150-187) aslında SİZİN düşündüğünüz doğru yaklaşımı zaten deniyor — önce id ile eşleştirmeye çalışıyor, olmazsa kullanıcı adı metin eşlemesine düşüyor. Ama bir alan adı hatası yüzünden id eşlemesi **hiç çalışmıyor**:

```js
// Şu an (satır 156 ve 166-167):
const isReply = copy.content?.startsWith('↳ @') || copy.content?.startsWith('@') || copy.parent_id; // ❌ parent_id yok
...
if (reply.parent_id) {  // ❌ bu alan comments tablosunda hiç yok, hep undefined
   parent = roots.find(r => r.zernio_comment_id === reply.parent_id || r.id === reply.parent_id);
}
```

`comments` tablosundaki gerçek kolon adı `parent_comment_id` (`parent_id` değil) — web'de bulup düzelttiğimiz aynı kolon. Tek satırlık düzeltme:

```js
comments.forEach(c => {
   const copy = { ...c, replies: [] };
   const isReply = copy.content?.startsWith('↳ @') || copy.content?.startsWith('@') || copy.parent_comment_id; // ✅
   if (isReply) replies.push(copy);
   else roots.push(copy);
});

replies.forEach(reply => {
   const match = reply.content?.match(/^↳?\s*@([^:]+):/);
   let targetUsername = match ? match[1].trim() : null;
   
   let parent = null;
   if (reply.parent_comment_id) {  // ✅
      parent = roots.find(r => r.zernio_comment_id === reply.parent_comment_id || r.id === reply.parent_comment_id);
   } else if (targetUsername) {
      ...
   }
   ...
});
```

Bu tek değişiklikle, artık az önce doldurduğumuz `parent_comment_id` verisi (ve #1'deki düzeltmeyle bundan sonra gelecek olanlar) gerçekten kullanılmaya başlayacak.

(Not: `InboxScreen.js` içinde de neredeyse aynı — hatta web'in eski haline göre daha kırılgan, "eşleşme yoksa en son parent'a yapıştır" diye bir fallback'i olan — bir `displayedComments` bloğu var, satır 828-864. Ama kontrol ettim: bu değişken tanımlanıyor, hiçbir yerde render edilmiyor (ölü kod) — ekrandaki gerçek liste `uniquePosts` üzerinden `PostCommentsScreen`'e yönlendiriyor. Yani bunu düzeltmenize gerek yok, isterseniz temizlik için silinebilir, aciliyeti yok.)

## 3. Mobilde platform rozeti hiç yok

Ne `InboxScreen.js` ne `PostCommentsScreen.js`'de web'deki `getPlatformIcon` gibi bir fonksiyon var — yorum satırlarında sadece jenerik bir kişi ikonu var (`PostCommentsScreen.js` satır 451-453). Web'dekiyle aynı görsel dili kurmak için:

```js
// PostCommentsScreen.js içine, uygun bir yere ekleyin:
const getPlatformIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'instagram': return <Ionicons name="logo-instagram" size={12} color="#E8A8CD" />;
    case 'facebook': return <Ionicons name="logo-facebook" size={12} color="#FF7A59" />;
    case 'tiktok': return <Ionicons name="logo-tiktok" size={12} color="#69C9D0" />;
    case 'youtube': return <Ionicons name="logo-youtube" size={12} color="#ff0000" />;
    default: return <Ionicons name="chatbubble" size={12} color="#A79E96" />;
  }
};
```

Ve satır 454-459 civarındaki kullanıcı adı bloğuna ekleyin:

```jsx
<View className="flex-1">
  <View className="flex-row items-center">
    <Text className="text-white font-bold text-[13px]" numberOfLines={1} ellipsizeMode="tail">{item.username}</Text>
    <View style={{ marginLeft: 6 }}>{getPlatformIcon(item.platform || post?.platform)}</View>
  </View>
  <Text className="text-[#A79E96] text-[10px]">
    {new Date(item.created_at).toLocaleDateString('tr-TR')}
  </Text>
</View>
```

## 4. Mobilde kopuk-bağlantı filtresi hiç yok

`social_accounts`/`needs_reconnection` sorgusu mobil kodunda (Inbox/PostComments ekranlarında) hiç geçmiyor. Web'e eklediğimiz mantığın aynısı `InboxScreen.js`'teki `uniquePosts` memo'suna uygulanmalı:

```js
const [connectedPlatforms, setConnectedPlatforms] = useState(new Set());

useEffect(() => {
   const fetchConnectedPlatforms = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      const { data: orgMember } = await supabase.from('organization_members').select('organization_id').eq('user_id', session.user.id).maybeSingle();
      const orgId = orgMember?.organization_id || session.user.id;
      const { data } = await supabase
         .schema('integration')
         .from('social_accounts')
         .select('platform')
         .eq('organization_id', orgId)
         .eq('is_active', true)
         .eq('needs_reconnection', false);
      setConnectedPlatforms(new Set((data || []).map(r => r.platform?.toLowerCase())));
   };
   fetchConnectedPlatforms();
}, []);
```

Ve `uniquePosts` memo'sundaki `comments.forEach` döngüsünden önce aynı web'deki gibi bir filtre eklenmeli:

```js
const uniquePosts = React.useMemo(() => {
   const postsMap = new Map();
   comments
      .filter(c => connectedPlatforms.size === 0 || connectedPlatforms.has((c.platform || c.posts?.platform)?.toLowerCase()))
      .forEach(c => { ... });  // mevcut içerik aynen kalsın
   return Array.from(postsMap.values());
}, [comments, connectedPlatforms]);
```

(Web'deki uyarıyı burada da tekrarlıyorum: bu filtre devreye girince, o organizasyonda bağlı olmayan platformların yorumları mobilde de kaybolacak — web'de gördüğümüz aynı büyük görünürlük etkisi burada da geçerli, zaten aynı veritabanını paylaşıyorlar.)

## 5. "Missing accountId" görünür hata — mobilde zaten SORUN YOK ✅

Kontrol ettim, hem `InboxScreen.js`'in `submitReply`'i (satır 433-438) hem `PostCommentsScreen.js`'in `handleSendPublicReply`'i (satır 358-360) zaten `catch` bloğunda `Alert.alert(...)` ile görünür hata gösteriyor — web'deki gibi sessizce yutulmuyor. Bu konuda mobilde ek işlem gerekmiyor.

## Öncelik sıralaması

1. **#1 ve #2** birlikte uygulanmalı (biri diğerini tamamlıyor) — ikisi de veri kalitesi/doğruluk sorunu, orta-yüksek öncelik.
2. **#3 ve #4** kozmetik/UX iyileştirmesi, normal öncelik — istediğiniz zaman.
3. **#0 ve #5** zaten sorunsuz, dokunmayın.

Bunları da Antigravity'ye iletebilirsiniz; uyguladıktan sonra ben yine git diff + canlı kod doğrulaması yaparım.
