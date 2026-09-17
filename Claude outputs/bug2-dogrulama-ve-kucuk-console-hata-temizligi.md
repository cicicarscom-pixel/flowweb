# Bug 2'yi kendi tarafımdan bağımsız doğruladım — gerçekten çalışıyor. Gönderdiğiniz ekran görüntülerindeki hata ayrı, zararsız bir şey.

## 1) Asıl silme işlemi gerçekten çalışıyor — SQL + log ile kendim teyit ettim

Ekran görüntülerinize güvenmek yerine (standart kuralım gereği), Supabase'den bizzat sorguladım:

**`function_logs` (zernio-client, 06:55-06:57 arası, tam sizin test ettiğiniz saatler):**
```
[disconnect-account] Zernio hesabı zaten bulamadı (muhtemelen zaten kopmuş bağlantı), yerel kayıt yine de siliniyor. accountId: 6a9bab5377555aae01dea0d3   (Instagram)
[disconnect-account] Zernio hesabı zaten bulamadı (muhtemelen zaten kopmuş bağlantı), yerel kayıt yine de siliniyor. accountId: 6a9d5cf477555aae01e4bfb4   (Facebook)
[disconnect-account] Zernio hesabı zaten bulamadı (muhtemelen zaten kopmuş bağlantı), yerel kayıt yine de siliniyor. accountId: 6a9dcc3b77555aae01e6c629   (YouTube/workigom-tr)
```
Üçünde de Zernio "Account not found" (404) döndürdü, yeni kod bunu yakalayıp yerel silmeye devam etti — tam istediğimiz davranış.

**Veritabanı:** Bu üç `zernio_account_id` artık `integration.social_accounts` tablosunda YOK — gerçekten silinmişler. (Sadece test etmediğiniz eski `direnis.kahvesi` TikTok kaydı hâlâ duruyor, o beklenen bir şey.)

**Sonuç: Bug 2 gerçekten düzeldi, kanıtlı.**

## 2) Konsoldaki kırmızı hatalar (42501 "permission denied for table social_accounts") ayrı, önemsiz bir sorun

Gönderdiğiniz ekran görüntülerindeki bu hata, silme işlemini **engellemiyor** (yukarıdaki kanıt bunu gösteriyor) — ama neden çıktığını açıklayayım: Frontend'deki `handleDisconnect` fonksiyonunda, edge function zaten kaydı sildikten SONRA, artık gereksiz kalmış eski bir satır var:

```ts
await supabase.schema('integration').from('social_accounts').update({ is_active: false }).eq('zernio_account_id', accountId);
```

Bu satır muhtemelen edge function henüz "sadece is_active=false yapıyordu, silmiyordu" dönemden kalma bir kalıntı. Artık iki sorunu var: (1) edge function zaten kaydı SİLDİĞİ için bu güncelleme zaten var olmayan bir satırı hedefliyor, (2) `authenticated` rolünün bu tabloda zaten UPDATE yetkisi yok (mesaj bunu açıkça söylüyor: "Grant the required privileges..."). Supabase JS client bu tür hataları fırlatmadığı (throw etmediği) için kodun geri kalanı (`setAccounts` + `fetchAccounts()`) sorunsuz çalışmaya devam ediyor — ama konsolu gereksiz yere kırmızı hatayla dolduruyor ve kafa karıştırıyor.

### Küçük temizlik — `flowweb-repo/src/app/(dashboard)/sosyal-medya/page.tsx`, `handleDisconnect`, satır ~221

**Şu an:**
```ts
      await supabase.schema('integration').from('social_accounts').update({ is_active: false }).eq('zernio_account_id', accountId);
      setAccounts(prev => prev.filter(acc => acc.zernio_account_id !== accountId));
      fetchAccounts();
```

**Olacak:**
```ts
      // NOT: Burada önceden ayrıca bir client-side .update({is_active:false}) çağrısı
      // vardı. zernio-client edge function'ı artık kaydı service-role ile doğrudan
      // SİLDİĞİ için (yukarıdaki invoke başarılıysa satır zaten yok), bu ikinci çağrı
      // hem gereksizdi hem de authenticated rolünün bu tabloda UPDATE yetkisi olmadığı
      // için her seferinde "permission denied for table social_accounts" (42501)
      // hatası atıp konsolu kirletiyordu. Silme işleminin kendisini engellemiyordu
      // ama yanıltıcıydı; kaldırıldı (16.09.2026, kullanıcının DevTools ekran
      // görüntüsüyle tespit edildi).
      setAccounts(prev => prev.filter(acc => acc.zernio_account_id !== accountId));
      fetchAccounts();
```

Bu tamamen isteğe bağlı bir kozmetik temizlik — silme işlevi zaten çalışıyor, bunu yapmasanız da sorun yok, sadece konsol daha temiz olur.

### Deploy
Frontend değişikliği, normal build/deploy süreciniz yeterli.

---

## Özet
- **Bug 2 kapandı** — kendi taraımdan SQL + log ile doğruladım, gönderdiğiniz test de tutarlı.
- Konsoldaki 42501 hatası ayrı ve zararsız, isterseniz yukarıdaki tek satırlık temizlikle giderilir, acele etmenize gerek yok.
- Bug 1'i (sayfaya giriş anındaki boşalma/dönme) siz test ettiniz mi, onu da öğrenmek isterim — onu da teyit ederseniz ikisini kapatıp TikTok ID eşleştirme konusuna geçelim.
