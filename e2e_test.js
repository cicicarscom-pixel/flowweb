const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
  console.log("--- E2E TEST BAŞLIYOR ---");

  // 1. Yeni Kayıt (User A)
  console.log("\\n1. Kayıt Testi (User A)");
  const emailA = `testA_${Date.now()}@example.com`;
  const passA = 'Test1234!';
  
  // Normal frontend client gibi anon key ile kayıt olalım
  const clientA = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authDataA, error: authErrA } = await clientA.auth.signUp({
    email: emailA,
    password: passA
  });
  
  if (authErrA) return console.error("Kayıt Hatası:", authErrA.message);
  const userA = authDataA.user;
  console.log("✓ User A kayıt oldu:", userA.id);

  // Tablolar oluşmuş mu? (Admin ile kontrol)
  const { data: profileA } = await supabaseAdmin.from('profiles').select('*').eq('id', userA.id).single();
  const { data: orgA } = await supabaseAdmin.from('organizations').select('*').eq('owner_id', userA.id).single();
  
  if (profileA && profileA.onboarding_completed === false) {
    console.log("✓ Profile tablosunda satır var ve onboarding_completed = false");
  } else {
    console.error("X Profile hatası:", profileA);
  }
  
  if (orgA && orgA.name === null) {
    console.log("✓ Organizations tablosunda satır var ve name = null");
  } else {
    console.error("X Org hatası:", orgA);
  }

  // 2. Avatar Yükleme (User A)
  console.log("\\n2. Avatar Yükleme Testi (User A)");
  // Sahte bir resim dosyası oluşturalım
  const dummyImage = new Blob(["fake-image-content"], { type: 'image/jpeg' });
  const fileNameA = `${userA.id}/avatar-test.jpg`;
  
  const { error: uploadErrA } = await clientA.storage.from('avatars').upload(fileNameA, dummyImage, { contentType: 'image/jpeg' });
  if (uploadErrA) {
    console.error("X Avatar Yükleme Hatası (RLS engelledi?):", uploadErrA.message);
  } else {
    console.log("✓ Avatar başarıyla yüklendi:", fileNameA);
  }

  // 3. Erişim İzolasyonu (User B)
  console.log("\\n3. Erişim İzolasyonu Testi (User B)");
  const emailB = `testB_${Date.now()}@example.com`;
  const clientB = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authDataB } = await clientB.auth.signUp({ email: emailB, password: passA });
  const userB = authDataB.user;
  console.log("✓ User B kayıt oldu:", userB.id);

  // User B, User A'nın klasörüne dosya yüklemeyi denerse
  const { error: uploadErrB } = await clientB.storage.from('avatars').upload(fileNameA + "_hack", dummyImage);
  if (uploadErrB) {
    console.log("✓ Başarılı: User B, User A'nın klasörüne dosya YÜKLEYEMEDİ (RLS çalışıyor). Hata:", uploadErrB.message);
  } else {
    console.error("X KRİTİK HATA: User B, User A'nın klasörüne yazabildi!");
  }

  // 4. Google Testi (Simülasyon)
  console.log("\\n4. Google Kayıt Testi (Pre-fill kontrolü)");
  const emailGoogle = `google_${Date.now()}@example.com`;
  
  // Admin API ile user metadata ekleyerek createUser yapıyoruz (Google OAuth simülasyonu)
  const { data: googleUser, error: googleErr } = await supabaseAdmin.auth.admin.createUser({
    email: emailGoogle,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test Google Kullanıcısı'
    }
  });
  
  if (googleErr) {
    console.error("Google Kayıt Hatası:", googleErr.message);
  } else {
    console.log("✓ Google User oluşturuldu:", googleUser.user.id);
    const { data: profileG } = await supabaseAdmin.from('profiles').select('*').eq('id', googleUser.user.id).single();
    if (profileG && profileG.full_name === 'Test Google Kullanıcısı') {
      console.log("✓ Google'dan gelen full_name profiles tablosuna doğru şekilde yazıldı.");
    } else {
      console.error("X Google full_name aktarımı başarısız:", profileG);
    }
  }

  console.log("\\n--- E2E TEST TAMAMLANDI ---");
}

runTest();
