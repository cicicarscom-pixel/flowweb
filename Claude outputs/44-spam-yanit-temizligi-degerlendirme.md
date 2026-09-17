# 44 spam yanıt temizliği — paylaşılan SQL'i çalıştırmadan önce üç önemli nokta

Önce doğrulama: `zernio-webhook` v94'ün deploy hash'i, v89/v92'deki temiz haliyle **birebir aynı** (`3ad9d5c5...`) — yani test bloğu gerçekten temizlenmiş, kod tekrar güvenli halinde. (Küçük not: bu sefer git'e yeni bir commit düşmedi — geçici test kodu için sorun değil, ama alışkanlık olarak belirtmek istedim.)

Şimdi paylaştığınız SQL script'i çalıştırmadan önce üç önemli sorun buldum:

## 1. Kolon adları yanlış — script hemen hata verir

`comments` tablosunun gerçek şeması: `content` ve `username` var, `message` ve `author_name` **yok**. Script olduğu gibi çalıştırılsa `column "message" does not exist` hatasıyla patlar.

## 2. Kolon adını düzeltsek bile `ILIKE '@Bilinmeyen%'` deseni güvenilir değil

Aynı zaman aralığında (18:20-19:20) `comments` tablosunu incelediğimde 46 satır buldum. Bunlardan biri gerçek bir müşteri yorumu: **"sonuna kadar haklısın"** (18:21:36) — döngüyü başlatan asıl orijinal yorum, bot spam'i değil. Bu satır `@Bilinmeyen` ile başlamadığı için filtre onu yanlışlıkla silmezdi (şans eseri güvende), ama asıl sorun şu: gerçek bot spam'lerinin çoğu da `@Bilinmeyen` ile **başlamıyor** — örneğin `"↳ @Yorum:\n@Bilinmeyen haklısın"` (başında "↳" var) veya `"haklısın hocam"` gibi. Yani bu metin deseniyle hem yanlış satırlar silinebilir hem de gerçek spam'lerin çoğu **kaçırılabilir**.

Ben bunun yerine, orijinal olay raporunda kullandığım kesin yöntemi tekrar kullandım: `integration.webhook_events` tablosundaki ham payload'da `isOwnAccount: true` bayrağını taşıyan kayıtları filtreledim (metin tahmini değil, TikTok'un kendi işaretlediği alan). Sonuç: **tam olarak 44 kayıt** — ilk olay raporundaki sayıyla birebir örtüşüyor, iki gönderiye dağılmış (Zernio post id'leri `6aaadc604e8076fc7c324bbd` ve `6aa151c83db89d611fdb4acc`). Bu, hangi yorumların gerçekten bot spam'i olduğunun kesin ve doğrulanmış listesi.

## 3. En kritik nokta: bu SQL sadece BİZİM veritabanımızı temizliyor, TikTok'taki gerçek yorumlara dokunmuyor

`comments` tablosundan satır silmek, sadece Gelen Kutusu'nda görünen listeyi temizler. **TikTok'ta, gerçek kullanıcıların gönderilerinin altında hâlâ görünür durumda olan o 44 spam yanıt, bu SQL çalıştırılsa bile aynen yerinde kalır.** Asıl kullanıcıları rahatsız eden/markayı kötü gösteren şey de zaten bu — bizim kendi arayüzümüzdeki kayıt değil, TikTok'ta herkesin görebildiği spam.

TikTok'taki gerçek yorumları silmek için Zernio'nun bir "yorum silme" (veya en azından "gizleme") API'sine ihtiyacımız var. `CommentApi.ts` dosyasında şu an böyle bir metod yok (`likeComment`, `replyToComment`, `sendPrivateReply`, `getInboxPostComments` var, `deleteComment`/`hideComment` yok). docs.zernio.com'da bunu aradım ama kesin bir "delete comment" endpoint'i bulamadım (sadece `DELETE /v1/posts/{postId}` post silme için var, comments bölümünde silme/gizleme endpoint'ine dair bir referans göremedim). İlginç bir ipucu: bizim `comments` tablomuzda zaten bir `hidden` (boolean) kolonu var — bu, ürün tasarımında "silme" değil "gizleme" (moderation) kavramının daha önce düşünülmüş olabileceğine işaret ediyor. Belki Zernio bir hide/moderate endpoint'i sunuyor ama ben dokümantasyonda bulamadım, ya da bu kolon başka bir amaç için (örn. bizim panelimizde manuel gizleme) eklenmiş olabilir.

## Önerim

1. TikTok'taki 44 gerçek spam yanıtı silmeden/gizlemeden önce, doğru API endpoint'ini netleştirelim — Zernio'nun API key'i/dokümantasyon erişimi sizde olduğu için, Zernio destek/dokümantasyonundan "comment silme" veya "comment gizleme" için doğru endpoint'i teyit edebilir misiniz? (Ben arattım ama kesin bulamadım, tahmin yürütüp yanlış endpoint'e istek atmak istemiyorum.)
2. Doğru endpoint netleşince, elimde zaten hazır olan kesin 44 kayıtlık listeyi (gerçek TikTok comment ID'leriyle) kullanarak önce TikTok'tan silme/gizleme işlemini yapan bir script yazarım, sonra (ve SADECE ondan sonra) aynı kesin ID listesiyle bizim `comments` tablomuzu temizleriz.
3. Alternatif (daha yavaş ama sıfır teknik risk): bu 44 yanıtı TikTok uygulamasından manuel olarak silebilirsiniz — sadece iki gönderi altında toplandıkları için o kadar da can sıkıcı olmayabilir.

Nasıl ilerlemek istersiniz?
