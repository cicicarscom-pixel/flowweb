
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: `
    * { box-sizing: border-box; }
    body { margin: 0; }
    .wf-body { font-family: 'Manrope', system-ui, sans-serif; }
    .wf-display { font-family: 'Sora', system-ui, sans-serif; }
    a.wf-link { color: #16a34a; text-decoration: none; }
    a.wf-link:hover { color: #15803d; }
    .wf-btn-primary { background: #16a34a; color: #fff; border: none; cursor: pointer; }
    .wf-btn-primary:hover { background: #15803d; }
    .wf-btn-primary-dark { background: #4edea3; color: #003824; border: none; cursor: pointer; }
    .wf-btn-primary-dark:hover { background: #6ee8b5; }
    .wf-btn-ghost-dark { background: transparent; color: #e5e1e4; border: 1px solid rgba(255,255,255,0.18); cursor: pointer; }
    .wf-btn-ghost-dark:hover { background: rgba(255,255,255,0.06); }
    .wf-btn-ghost-light { background: transparent; color: #374151; border: 1px solid #e2e5e3; cursor: pointer; }
    .wf-btn-ghost-light:hover { background: #f4f6f5; }
    .wf-card { background: #ffffff; border: 1px solid #eceeed; border-radius: 18px; box-shadow: 0 10px 30px -18px rgba(16,30,24,0.14); }
    .wf-card-dark { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; }
    .wf-chip-light { background: #f2f6f4; border: 1px solid #e5e9e7; border-radius: 999px; }
    .wf-chip-dark { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; }
    .wf-nav-link { color: #4b5750; text-decoration: none; }
    .wf-nav-link:hover { color: #0f1b16; }
  ` }} />
      <div dangerouslySetInnerHTML={{ __html: `


<div class="wf-body" style="background:#ffffff; color:#101a15; min-height:100vh; width:100%; position:relative; overflow-x:hidden;">

  <!-- NAV (light) -->
  <div style="position:relative; z-index:2; display:flex; align-items:center; justify-content:space-between; padding:20px 64px; max-width:1320px; margin:0 auto;">
    <div style="display:flex; align-items:center; gap:10px;">
      <div style="width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,#4edea3,#16a34a); display:flex; align-items:center; justify-content:center; font-weight:800; color:#062b1a; font-family:'Sora',sans-serif;">W</div>
      <span class="wf-display" style="font-weight:700; font-size:18px; letter-spacing:-0.01em; color:#0f1b16;">Workigom <span style="color:#16a34a;">Flow</span></span>
    </div>
    <div style="display:flex; align-items:center; gap:32px;">
      <a class="wf-nav-link" href="#ozellikler" style="font-size:14px; font-weight:600;">Özellikler</a>
      <a class="wf-nav-link" href="#nasil-calisir" style="font-size:14px; font-weight:600;">Nasıl Çalışır</a>
      <a class="wf-nav-link" href="#sss" style="font-size:14px; font-weight:600;">SSS</a>
    </div>
    <button class="wf-btn-primary" style="padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; font-family:'Manrope',sans-serif;">Ücretsiz Dene</button>
  </div>

  <!-- HERO (dark teal-black band) -->
  <div style="position:relative; background:linear-gradient(180deg,#0a1512,#0d1e18 55%,#0a1512); overflow:hidden;">
    <div style="position:absolute; top:-140px; left:12%; width:520px; height:520px; background:#4edea3; opacity:0.16; filter:blur(150px); border-radius:999px; pointer-events:none;"></div>
    <div style="position:absolute; top:40px; right:6%; width:380px; height:380px; background:#22d3ee; opacity:0.10; filter:blur(130px); border-radius:999px; pointer-events:none;"></div>

    <div style="position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:64px 64px 72px; display:flex; align-items:center; gap:56px; flex-wrap:wrap;">
      <div style="flex:1 1 480px; min-width:320px;">
        <div class="wf-chip-dark" style="display:inline-flex; align-items:center; gap:8px; padding:7px 14px; margin-bottom:22px;">
          <span style="width:6px; height:6px; border-radius:999px; background:#4edea3; display:inline-block;"></span>
          <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#4edea3; text-transform:uppercase;">Tüm sosyal medya hesaplarınız tek platformda</span>
        </div>
        <h1 class="wf-display" style="font-size:46px; line-height:1.1; font-weight:700; margin:0 0 20px; letter-spacing:-0.02em; color:#fff;">
          Tüm Sosyal Medya Hesaplarınızı<br>Tek Yerden <span style="color:#4edea3;">Aynı Anda</span> Yönetin
        </h1>
        <p style="font-size:16px; line-height:1.65; color:#b9c4bf; max-width:520px; margin:0 0 28px;">
          Instagram, Facebook, TikTok, YouTube, X, LinkedIn ve daha fazlasını Workigom Flow'a bağlayın. Gönderinizi bir kez yükleyin, tüm platformlarda aynı anda yayınlansın. İsterseniz hemen paylaşın, isterseniz planlayın — seçtiğiniz tarih ve saatte gönderiniz otomatik olarak yayınlanır.
        </p>
        <p style="font-size:14.5px; line-height:1.6; color:#8fe6bf; max-width:520px; margin:0 0 32px; font-weight:600;">
          Üstelik WhatsApp mesajlarınıza ve sosyal medya yorumlarınıza da 7/24 yanıt veren, kişiliğini sizin seçtiğiniz bir yapay zekâ asistanınız olur. 😊
        </p>
        <div style="display:flex; gap:14px; flex-wrap:wrap;">
          <button class="wf-btn-primary-dark" style="padding:14px 26px; border-radius:12px; font-size:15px; font-weight:700; font-family:'Manrope',sans-serif;">Ücretsiz Dene</button>
          <button class="wf-btn-ghost-dark" style="padding:14px 26px; border-radius:12px; font-size:15px; font-weight:600; font-family:'Manrope',sans-serif; display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"></circle><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"></path></svg>
            Nasıl Çalışır
          </button>
        </div>
      </div>

      <!-- Hero visual: dashboard preview mockup -->
      <div style="flex:1 1 480px; min-width:320px; position:relative;">
        <div class="wf-card" style="padding:20px; position:relative; z-index:2;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:22px; height:22px; border-radius:6px; background:linear-gradient(135deg,#4edea3,#16a34a);"></div>
              <span class="wf-display" style="font-size:13px; font-weight:700; color:#0f1b16;">Workigom Flow</span>
            </div>
            <div style="display:flex; gap:6px;">
              <span style="width:26px; height:26px; border-radius:7px; background:linear-gradient(135deg,#f58529,#dd2a7b,#8134af); display:inline-flex; align-items:center; justify-content:center;"><svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#fff" stroke-width="2"></rect><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="2"></circle><circle cx="17.4" cy="6.6" r="1.1"></circle></svg></span>
              <span style="width:26px; height:26px; border-radius:7px; background:#1877F2; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:13px; font-weight:800; font-family:'Sora',sans-serif;">f</span>
              <span style="width:26px; height:26px; border-radius:7px; background:#111; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:800;">TT</span>
              <span style="width:26px; height:26px; border-radius:7px; background:#FF0000; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:800;">YT</span>
              <span style="width:26px; height:26px; border-radius:7px; background:#000; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:800;">X</span>
              <span style="width:26px; height:26px; border-radius:7px; background:#0A66C2; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:800;">in</span>
            </div>
          </div>
          <div style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px;">Yeni Gönderi</div>
          <div style="height:120px; border-radius:12px; background:linear-gradient(135deg,#eafbf2,#e6f6ff); display:flex; align-items:center; justify-content:center; margin-bottom:14px; border:1px solid #eef2f0;">
            <span style="font-size:13px; color:#6b7c74;">Harika bir gün! ✨</span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <span class="wf-chip-light" style="padding:8px 14px; font-size:12px; color:#4b5750; font-weight:600;">Tarih Seç</span>
            <button class="wf-btn-primary" style="flex:1; padding:10px 14px; border-radius:10px; font-size:12.5px; font-weight:700;">Tüm Platformlarda Yayınla</button>
          </div>
        </div>

        <div class="wf-card" style="position:absolute; top:-26px; right:-18px; z-index:3; padding:14px 16px; width:150px;">
          <div style="font-size:10px; font-weight:700; color:#9aa39d; text-transform:uppercase; margin-bottom:6px;">Takipçi Büyümesi</div>
          <div style="font-size:16px; font-weight:800; color:#16a34a; margin-bottom:4px;">+%18 <span style="font-size:10px; color:#9aa39d; font-weight:600;">bu ay</span></div>
          <svg width="100%" height="30" viewBox="0 0 120 30" preserveAspectRatio="none">
            <polyline points="0,24 20,20 40,22 60,12 80,14 100,4 120,6" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
          </svg>
        </div>

        <div class="wf-card" style="position:absolute; bottom:-30px; left:-24px; z-index:3; padding:14px 16px; width:190px;">
          <div style="font-size:10px; font-weight:700; color:#9aa39d; text-transform:uppercase; margin-bottom:8px;">Planlanan Gönderiler</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>
              <span style="font-size:11px; color:#374542;">Yeni koleksiyon tanıtımı</span>
            </div>
            <div style="font-size:10px; color:#9aa39d; margin-left:21px;">Bugün 18:00</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>
              <span style="font-size:11px; color:#374542;">Haftalık kampanya videosu</span>
            </div>
            <div style="font-size:10px; color:#9aa39d; margin-left:21px;">Yarın 09:30</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PLATFORM ROW (light) -->
  <div style="position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:44px 64px; text-align:center;">
    <div style="font-size:11.5px; font-weight:700; letter-spacing:0.08em; color:#8a958f; text-transform:uppercase; margin-bottom:22px;">Aynı Anda Yayınladığınız Platformlar</div>
    <div style="display:flex; justify-content:center; gap:28px; flex-wrap:wrap;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#25D366"/><path d="M50 24c-14.36 0-26 11.64-26 26 0 4.7 1.25 9.1 3.43 12.9L24 76l13.5-3.35A25.9 25.9 0 0 0 50 76c14.36 0 26-11.64 26-26S64.36 24 50 24z" fill="none" stroke="#fff" stroke-width="4"/><path d="M40.5 42.8c.6-1.3 1.2-1.3 1.8-1.3.5 0 1 0 1.5.03.5.02 1.1-.2 1.7 1.3.6 1.5 2.1 5.1 2.3 5.5.2.4.3.9 0 1.4-.3.5-.4.8-.8 1.3-.4.4-.8.9-1.2 1.2-.4.4-.8.8-.3 1.6.5.8 2.1 3.5 4.6 5.6 3.1 2.8 5.7 3.6 6.5 4 .8.4 1.3.3 1.8-.2.5-.5 2-2.4 2.6-3.2.6-.8 1.1-.7 1.9-.4.8.3 5 2.4 5.9 2.8.9.4 1.4.6 1.6 1 .2.4.2 2.1-.5 4.1-.7 2-3.9 3.9-5.5 4.1-1.4.2-3.2.3-5.2-.3-1.2-.4-2.7-.9-4.7-1.7-8.2-3.5-13.6-11.7-14-12.3-.4-.6-3.3-4.4-3.3-8.4 0-4 2.1-6 2.9-6.8z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">WhatsApp</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#C13584"/><rect x="26" y="26" width="48" height="48" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="68" cy="32" r="3.2" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Instagram</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#1877F2"/><path d="M58 27h-8a12 12 0 0 0-12 12v7h-8v10h8v20h10V56h8l2-10h-10v-6a2.5 2.5 0 0 1 2.5-2.5H58z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Facebook</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#101010"/><path d="M56 26c1.6 6.4 5.6 10.3 12 11v9c-4.4.2-8.3-1.1-12-3.6V58c0 10.5-8.2 17.5-17.8 17.5-10 0-17.7-7.7-17.7-17.4 0-9.9 8.4-17.7 18.7-17 v9.4c-4.8-.3-9 3.1-9 7.9 0 4.6 3.7 8.1 8.4 8.1 5.2 0 9-4 9-9.4V26z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">TikTok</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#FF0000"/><rect x="24" y="34" width="52" height="32" rx="9" fill="none" stroke="#fff" stroke-width="4"/><path d="M45 42.5 60 50 45 57.5z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Youtube</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#000000"/><path d="M31 31 69 69M69 31 31 69" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">X</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#0A66C2"/><rect x="28" y="42" width="9" height="28" fill="#fff"/><circle cx="32.5" cy="31" r="5" fill="#fff"/><path d="M46 42h8.5v4.2c1.6-2.6 4.6-4.9 9.5-4.9 8.2 0 12 5.1 12 14.3V70h-9V57.4c0-4.6-1.7-7.4-5.6-7.4-3.6 0-5.7 2.5-6.4 4.9-.3.8-.4 1.9-.4 3V70H46z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Linkedin</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#E60023"/><path d="M50 25c-13.8 0-25 11.2-25 25 0 10.5 6.4 19.4 15.4 23.2-.2-2-.4-5 .1-7.2.4-2 2.8-12.6 2.8-12.6s-.7-1.4-.7-3.5c0-3.3 1.9-5.7 4.3-5.7 2 0 3 1.5 3 3.4 0 2-1.3 5.1-2 8-.6 2.4 1.2 4.4 3.6 4.4 4.3 0 7.6-4.5 7.6-11.1 0-5.8-4.2-9.9-10.1-9.9-6.9 0-11 5.2-11 10.5 0 2.1.8 4.3 1.8 5.5.2.2.2.4.1.7l-.7 2.7c-.1.5-.4.6-.9.4-3.4-1.6-5.5-6.5-5.5-10.5 0-8.5 6.2-16.4 17.8-16.4 9.3 0 16.6 6.6 16.6 15.5 0 9.3-5.8 16.7-13.9 16.7-2.7 0-5.3-1.4-6.1-3.1l-1.7 6.4c-.6 2.3-2.3 5.2-3.4 7 2.6.8 5.3 1.2 8.1 1.2 13.8 0 25-11.2 25-25S63.8 25 50 25z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Pinterest</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#101010"/><path d="M50 26c-13.3 0-21 8.6-21 24s7.7 24 21 24c9.8 0 16.6-4.9 19-13.2l-8-2.4c-1.4 4.9-4.8 7.3-10.4 7.3-6.7 0-10.6-4.2-11.2-11.5 3 .9 6.5 1.4 10.2 1.4 12 0 19.4-4.8 19.4-13 0-8-6.7-12.9-16.5-12.9-8 0-14 3-17 8.4l7 4.1c1.8-3 4.8-4.6 9-4.6 4.1 0 6.6 1.8 6.6 4.5 0 3-3.3 4.6-9.8 4.6-2.9 0-5.6-.3-8.1-.9.9-9.6 5.4-14.8 11.9-14.8 4.9 0 8.2 2 9.9 5.8l7.6-3.4C67.3 29.9 60.2 26 50 26z" fill="#fff"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Threads</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#26A5E4"/><path d="M74 28 24.5 47.7c-3.4 1.4-3.4 3.3-.6 4.1l12.7 4 4.9 15.1c.6 1.7 1.1 2.4 2.3 2.4 1 0 1.5-.5 2.1-1.1l6.1-5.9 12.6 9.3c2.3 1.7 4 .8 4.6-2.1l8.3-39.2c.9-3.6-1.3-5.3-3.6-3.3z" fill="#fff"/><path d="M40 66.5 62.5 42 45.8 55.5l-.7 10c-.1.3-.3.6-.5.6z" fill="#26A5E4"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Telegram</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#FFFC00"/><path d="M50 27c8 0 13.5 6.5 13.2 14.6l-.3 6.5c-.1 1.6.5 2.3 1.9 2.3 1.7 0 3.6-1.3 4.7-1.3 1.2 0 2.4.7 2.4 2 0 1.6-2.1 2.6-4.5 3.5-1.4.5-2 1.1-2 1.9 0 1.1 1.8 4.4 6.6 6.2 1 .4 2.2.7 2.2 1.9 0 1.5-2.6 2.1-5.8 2.7-.4 1.1-.7 2.5-1 3.4-.3.9-.9 1.4-2.3 1.2-1.6-.2-3.2-.6-5.4-.6-3 0-4.6 2.7-9.7 2.7-5 0-6.6-2.7-9.6-2.7-2.2 0-4 .5-5.4.6-1.5.1-2-.4-2.3-1.2-.3-.9-.6-2.3-1-3.4-3.2-.5-5.8-1.1-5.8-2.7 0-1.2 1.2-1.5 2.2-1.9 4.8-1.8 6.5-5.1 6.5-6.2 0-.8-.6-1.4-2-1.9-2.4-.9-4.5-1.9-4.5-3.5 0-1.3 1.2-2 2.4-2 1.1 0 3 1.3 4.7 1.3 1.4 0 2-.7 1.9-2.3l-.3-6.5C36.5 33.5 42 27 50 27z" fill="none" stroke="#101010" stroke-width="3.2" stroke-linejoin="round"/></svg>
        <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Snapchat</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <svg width="46" height="46" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#e5e9e7"/><circle cx="36" cy="50" r="5.5" fill="#7d8b84"/><circle cx="50" cy="50" r="5.5" fill="#7d8b84"/><circle cx="64" cy="50" r="5.5" fill="#7d8b84"/></svg>
        <span style="font-size:11.5px; color:#8a958f; font-weight:600;">Daha fazla</span>
      </div>
    </div>
  </div>

  <!-- FEATURES INTRO -->
  <div id="ozellikler" style="position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:56px 64px 20px;">
    <div style="display:flex; align-items:center; justify-content:center; gap:28px; flex-wrap:wrap; text-align:center; margin-bottom:64px;">
      <div style="max-width:560px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:0.08em; color:#16a34a; text-transform:uppercase;">Özellikler</span>
        <h2 class="wf-display" style="font-size:32px; font-weight:700; margin:12px 0 0; letter-spacing:-0.01em; color:#0f1b16;">İşletmenizin Tüm Dijital İşleri, Tek Asistanda</h2>
        <p style="font-size:14.5px; line-height:1.6; color:#6b7c74; margin:14px 0 0;">Yapay zekâ destekli asistanınız, müşteri mesajlarından gönderi planlamaya, randevulardan faturalara kadar tüm işlerinizi sizin için yönetir.</p>
      </div>
      <div style="position:relative; display:flex; align-items:center; gap:14px;">
        <div class="wf-card" style="padding:14px 18px; max-width:220px; text-align:left;">
          <div style="font-size:13px; font-weight:700; color:#0f1b16; margin-bottom:4px;">Merhaba! 👋</div>
          <div style="font-size:12px; color:#6b7c74; line-height:1.5;">İşletmenizin dijital asistanı yanınızda. Size nasıl yardımcı olabilirim?</div>
        </div>
        <img src="robot-mascot.png" width="72" height="72" style="border-radius:999px; display:block; flex-shrink:0;">
      </div>
    </div>

    <!-- Feature 1: WhatsApp -->
    <div style="display:flex; align-items:center; gap:56px; flex-wrap:wrap; margin-bottom:88px;">
      <div style="flex:1 1 380px; min-width:300px;">
        <div class="wf-card" style="padding:0; overflow:hidden;">
          <div style="background:#16a34a; padding:14px 18px; display:flex; align-items:center; gap:10px;">
            <div style="width:30px; height:30px; border-radius:999px; background:rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; color:#fff; font-size:13px; font-weight:800;">M</div>
            <div>
              <div style="font-size:13px; font-weight:700; color:#fff;">Müşteri</div>
              <div style="font-size:10.5px; color:rgba(255,255,255,0.75);">Çevrimiçi</div>
            </div>
          </div>
          <div style="padding:16px 18px; display:flex; flex-direction:column; gap:8px; background:#f6faf7;">
            <div style="align-self:flex-start; background:#fff; border:1px solid #eceeed; border-radius:12px 12px 12px 2px; padding:8px 12px; font-size:12.5px; color:#1f2a25; max-width:80%;">Bu ürün hâlâ stokta var mı?</div>
            <div style="align-self:flex-end; background:#dcf8c6; border-radius:12px 12px 2px 12px; padding:8px 12px; font-size:12.5px; color:#1f2a25; max-width:80%;">Evet, stokta var! 😊</div>
            <div style="align-self:flex-start; background:#fff; border:1px solid #eceeed; border-radius:12px 12px 12px 2px; padding:8px 12px; font-size:12.5px; color:#1f2a25; max-width:80%;">Fiyat bilgisi alabilir miyim?</div>
            <div style="align-self:flex-end; background:#dcf8c6; border-radius:12px 12px 2px 12px; padding:8px 12px; font-size:12.5px; color:#1f2a25; max-width:80%;">Güncel fiyat listemizi hemen paylaşıyorum. 👇</div>
            <div style="align-self:flex-end; background:#fff; border:1px solid #eceeed; border-radius:12px; padding:8px 12px; font-size:12px; color:#1f2a25; display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c1131f" stroke-width="1.8"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>
              <div><div style="font-weight:700;">Fiyat Listesi 2024.pdf</div><div style="font-size:10px; color:#9aa39d;">2.4 MB</div></div>
            </div>
          </div>
        </div>
      </div>
      <div style="flex:1 1 420px; min-width:300px;">
        <div style="width:48px; height:48px; border-radius:14px; background:#eafbf2; display:flex; align-items:center; justify-content:center; color:#16a34a; margin-bottom:20px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </div>
        <h3 class="wf-display" style="font-size:24px; font-weight:700; margin:0 0 12px; color:#0f1b16;">Müşteri Mesajlarına Siz Uyurken Bile Yanıt Verin</h3>
        <p style="font-size:15px; line-height:1.7; color:#6b7c74; margin:0 0 20px; max-width:480px;">WhatsApp asistanınız işletmenize özel bir karakterle konuşur; sorulara yanıt verir, randevu alır, ürün ve hizmet bilgisi paylaşır. Türkçe hitap kurallarına (Bey, Hanım) uygun, doğal ve nazik bir üslup kullanır.</p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>7/24 otomatik yanıt</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Kendi karakterinizi tanımlayın</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Kültüre uygun, doğal bir dil</div>
        </div>
        <div class="wf-card" style="padding:18px;">
          <div style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px;">Asistan Talimatı</div>
          <div style="background:#f6faf7; border:1px solid #eceeed; border-radius:10px; padding:12px; font-size:12.5px; line-height:1.6; color:#4b5750;">"Sen [İşletme Adı]'nın nazik ve yardımsever asistanısın. Müşterilere daima 'Bey/Hanım' diye hitap et, randevu taleplerini not al, fiyat sorularında güncel listeyi paylaş."</div>
          <div style="display:flex; gap:8px; margin-top:12px;">
            <span class="wf-chip-light" style="padding:5px 12px; font-size:11px; color:#16a34a; font-weight:700;">● Aktif</span>
            <span class="wf-chip-light" style="padding:5px 12px; font-size:11px; color:#6b7c74;">Özel Karakter</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature 2: Sosyal Medya -->
    <div style="display:flex; align-items:center; gap:56px; flex-wrap:wrap-reverse; margin-bottom:0;">
      <div style="flex:1 1 380px; min-width:300px;">
        <div class="wf-card" style="padding:22px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em;">Gelen Kutusu</span>
            <span class="wf-chip-light" style="padding:5px 10px; font-size:11px; color:#16a34a; font-weight:700;">4 yeni</span>
          </div>
          <div style="display:flex; gap:16px; border-bottom:1px solid #eceeed; padding-bottom:8px; font-size:12px; font-weight:700;">
            <span style="color:#0f1b16;">Tümü</span>
            <span style="color:#9aa39d;">Yorumlar <span style="color:#16a34a;">2</span></span>
            <span style="color:#9aa39d;">Mesajlar <span style="color:#16a34a;">2</span></span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; background:#f6faf7;">
            <div style="width:30px; height:30px; border-radius:999px; background:linear-gradient(135deg,#f58529,#dd2a7b,#8134af); flex-shrink:0;"></div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:12.5px; font-weight:700; color:#0f1b16;">Instagram · Yorum</div>
              <div style="font-size:12px; color:#8a958f; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Bu ürün hâlâ stokta var mı?"</div>
            </div>
            <span style="font-size:10.5px; color:#16a34a; font-weight:700; flex-shrink:0;">Yanıtlandı</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; background:#f6faf7;">
            <div style="width:30px; height:30px; border-radius:999px; background:#1877F2; flex-shrink:0;"></div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:12.5px; font-weight:700; color:#0f1b16;">Facebook · DM</div>
              <div style="font-size:12px; color:#8a958f; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Çalışma saatleriniz nedir?"</div>
            </div>
            <span style="font-size:10.5px; color:#16a34a; font-weight:700; flex-shrink:0;">Yanıtlandı</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; background:#f6faf7;">
            <div style="width:30px; height:30px; border-radius:999px; background:#111; flex-shrink:0;"></div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:12.5px; font-weight:700; color:#0f1b16;">TikTok · Yorum</div>
              <div style="font-size:12px; color:#8a958f; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"Fiyat bilgisi alabilir miyim?"</div>
            </div>
            <span style="font-size:10.5px; color:#d97706; font-weight:700; flex-shrink:0;">Beklemede</span>
          </div>
        </div>
      </div>
      <div style="flex:1 1 420px; min-width:300px;">
        <div style="width:48px; height:48px; border-radius:14px; background:#eef2ff; display:flex; align-items:center; justify-content:center; color:#6366f1; margin-bottom:20px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"></line><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line></svg>
        </div>
        <h3 class="wf-display" style="font-size:24px; font-weight:700; margin:0 0 12px; color:#0f1b16;">Instagram, Facebook, TikTok ve YouTube — Tek Panelden</h3>
        <p style="font-size:15px; line-height:1.7; color:#6b7c74; margin:0 0 20px; max-width:480px;">Tüm sosyal medya hesaplarınızı bağlayın; gönderi paylaşın, gelen yorumlara ve mesajlara yapay zekâ ile yanıt verin, hepsini tek gelen kutusundan takip edin.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#6366f1; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Gönderi planlama ve AI başlık üretimi</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#6366f1; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Yorum ve mesaj kutusu tek yerde</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#6366f1; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Tek panelden performans takibi</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ALL PLATFORMS (light mint band) -->
  <div style="position:relative; z-index:2; background:#f2fbf6; padding:80px 64px; margin-top:80px;">
    <div style="max-width:820px; margin:0 auto; text-align:center;">
      <span style="font-size:12px; font-weight:700; letter-spacing:0.08em; color:#16a34a; text-transform:uppercase;">🎉 Bağlanabileceğiniz Platformlar</span>
      <h3 class="wf-display" style="font-size:28px; font-weight:700; margin:12px 0 10px; letter-spacing:-0.01em; color:#0f1b16;">Aklınıza Gelen Her Platform, Tek Çatı Altında</h3>
      <p style="font-size:14.5px; color:#6b7c74; margin:0 0 40px;">Standart bir asistan değiliz — bu yüzden tek bir platformla yetinmedik. 😄</p>
      <div style="display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:16px;">
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#C13584"/><rect x="26" y="26" width="48" height="48" rx="14" ry="14" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" stroke-width="4.5"/><circle cx="68" cy="32" r="3.2" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Instagram</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#25D366"/><path d="M50 24c-14.36 0-26 11.64-26 26 0 4.7 1.25 9.1 3.43 12.9L24 76l13.5-3.35A25.9 25.9 0 0 0 50 76c14.36 0 26-11.64 26-26S64.36 24 50 24z" fill="none" stroke="#fff" stroke-width="4"/><path d="M40.5 42.8c.6-1.3 1.2-1.3 1.8-1.3.5 0 1 0 1.5.03.5.02 1.1-.2 1.7 1.3.6 1.5 2.1 5.1 2.3 5.5.2.4.3.9 0 1.4-.3.5-.4.8-.8 1.3-.4.4-.8.9-1.2 1.2-.4.4-.8.8-.3 1.6.5.8 2.1 3.5 4.6 5.6 3.1 2.8 5.7 3.6 6.5 4 .8.4 1.3.3 1.8-.2.5-.5 2-2.4 2.6-3.2.6-.8 1.1-.7 1.9-.4.8.3 5 2.4 5.9 2.8.9.4 1.4.6 1.6 1 .2.4.2 2.1-.5 4.1-.7 2-3.9 3.9-5.5 4.1-1.4.2-3.2.3-5.2-.3-1.2-.4-2.7-.9-4.7-1.7-8.2-3.5-13.6-11.7-14-12.3-.4-.6-3.3-4.4-3.3-8.4 0-4 2.1-6 2.9-6.8z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">WhatsApp</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#1877F2"/><path d="M58 27h-8a12 12 0 0 0-12 12v7h-8v10h8v20h10V56h8l2-10h-10v-6a2.5 2.5 0 0 1 2.5-2.5H58z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Facebook</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#101010"/><path d="M56 26c1.6 6.4 5.6 10.3 12 11v9c-4.4.2-8.3-1.1-12-3.6V58c0 10.5-8.2 17.5-17.8 17.5-10 0-17.7-7.7-17.7-17.4 0-9.9 8.4-17.7 18.7-17 v9.4c-4.8-.3-9 3.1-9 7.9 0 4.6 3.7 8.1 8.4 8.1 5.2 0 9-4 9-9.4V26z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">TikTok</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#FF0000"/><rect x="24" y="34" width="52" height="32" rx="9" fill="none" stroke="#fff" stroke-width="4"/><path d="M45 42.5 60 50 45 57.5z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">YouTube</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#000000"/><path d="M31 31 69 69M69 31 31 69" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">X</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#0A66C2"/><rect x="28" y="42" width="9" height="28" fill="#fff"/><circle cx="32.5" cy="31" r="5" fill="#fff"/><path d="M46 42h8.5v4.2c1.6-2.6 4.6-4.9 9.5-4.9 8.2 0 12 5.1 12 14.3V70h-9V57.4c0-4.6-1.7-7.4-5.6-7.4-3.6 0-5.7 2.5-6.4 4.9-.3.8-.4 1.9-.4 3V70H46z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">LinkedIn</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#E60023"/><path d="M50 25c-13.8 0-25 11.2-25 25 0 10.5 6.4 19.4 15.4 23.2-.2-2-.4-5 .1-7.2.4-2 2.8-12.6 2.8-12.6s-.7-1.4-.7-3.5c0-3.3 1.9-5.7 4.3-5.7 2 0 3 1.5 3 3.4 0 2-1.3 5.1-2 8-.6 2.4 1.2 4.4 3.6 4.4 4.3 0 7.6-4.5 7.6-11.1 0-5.8-4.2-9.9-10.1-9.9-6.9 0-11 5.2-11 10.5 0 2.1.8 4.3 1.8 5.5.2.2.2.4.1.7l-.7 2.7c-.1.5-.4.6-.9.4-3.4-1.6-5.5-6.5-5.5-10.5 0-8.5 6.2-16.4 17.8-16.4 9.3 0 16.6 6.6 16.6 15.5 0 9.3-5.8 16.7-13.9 16.7-2.7 0-5.3-1.4-6.1-3.1l-1.7 6.4c-.6 2.3-2.3 5.2-3.4 7 2.6.8 5.3 1.2 8.1 1.2 13.8 0 25-11.2 25-25S63.8 25 50 25z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Pinterest</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#101010"/><path d="M50 26c-13.3 0-21 8.6-21 24s7.7 24 21 24c9.8 0 16.6-4.9 19-13.2l-8-2.4c-1.4 4.9-4.8 7.3-10.4 7.3-6.7 0-10.6-4.2-11.2-11.5 3 .9 6.5 1.4 10.2 1.4 12 0 19.4-4.8 19.4-13 0-8-6.7-12.9-16.5-12.9-8 0-14 3-17 8.4l7 4.1c1.8-3 4.8-4.6 9-4.6 4.1 0 6.6 1.8 6.6 4.5 0 3-3.3 4.6-9.8 4.6-2.9 0-5.6-.3-8.1-.9.9-9.6 5.4-14.8 11.9-14.8 4.9 0 8.2 2 9.9 5.8l7.6-3.4C67.3 29.9 60.2 26 50 26z" fill="#fff"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Threads</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#26A5E4"/><path d="M74 28 24.5 47.7c-3.4 1.4-3.4 3.3-.6 4.1l12.7 4 4.9 15.1c.6 1.7 1.1 2.4 2.3 2.4 1 0 1.5-.5 2.1-1.1l6.1-5.9 12.6 9.3c2.3 1.7 4 .8 4.6-2.1l8.3-39.2c.9-3.6-1.3-5.3-3.6-3.3z" fill="#fff"/><path d="M40 66.5 62.5 42 45.8 55.5l-.7 10c-.1.3-.3.6-.5.6z" fill="#26A5E4"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Telegram</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#FFFC00"/><path d="M50 27c8 0 13.5 6.5 13.2 14.6l-.3 6.5c-.1 1.6.5 2.3 1.9 2.3 1.7 0 3.6-1.3 4.7-1.3 1.2 0 2.4.7 2.4 2 0 1.6-2.1 2.6-4.5 3.5-1.4.5-2 1.1-2 1.9 0 1.1 1.8 4.4 6.6 6.2 1 .4 2.2.7 2.2 1.9 0 1.5-2.6 2.1-5.8 2.7-.4 1.1-.7 2.5-1 3.4-.3.9-.9 1.4-2.3 1.2-1.6-.2-3.2-.6-5.4-.6-3 0-4.6 2.7-9.7 2.7-5 0-6.6-2.7-9.6-2.7-2.2 0-4 .5-5.4.6-1.5.1-2-.4-2.3-1.2-.3-.9-.6-2.3-1-3.4-3.2-.5-5.8-1.1-5.8-2.7 0-1.2 1.2-1.5 2.2-1.9 4.8-1.8 6.5-5.1 6.5-6.2 0-.8-.6-1.4-2-1.9-2.4-.9-4.5-1.9-4.5-3.5 0-1.3 1.2-2 2.4-2 1.1 0 3 1.3 4.7 1.3 1.4 0 2-.7 1.9-2.3l-.3-6.5C36.5 33.5 42 27 50 27z" fill="none" stroke="#101010" stroke-width="3.2" stroke-linejoin="round"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Snapchat</span>
        </div>
        <div class="wf-card" style="padding:18px 10px; display:flex; flex-direction:column; align-items:center; gap:9px;">
          <svg width="42" height="42" viewBox="0 0 100 100" style="border-radius:999px; display:block;"><circle cx="50" cy="50" r="50" fill="#e5e9e7"/><circle cx="36" cy="50" r="5.5" fill="#7d8b84"/><circle cx="50" cy="50" r="5.5" fill="#7d8b84"/><circle cx="64" cy="50" r="5.5" fill="#7d8b84"/></svg>
          <span style="font-size:11.5px; color:#4b5750; font-weight:600;">Daha fazlası</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Feature 2b: Analitik + Planlama -->
  <div style="position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:88px 64px 0;">
    <div style="display:flex; align-items:center; gap:56px; flex-wrap:wrap; margin-bottom:88px;">
      <div style="flex:1 1 420px; min-width:300px;">
        <div style="width:48px; height:48px; border-radius:14px; background:#eafbf2; display:flex; align-items:center; justify-content:center; color:#16a34a; margin-bottom:20px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18"></path><path d="M6 15l4-5 3 3 6-7"></path></svg>
        </div>
        <h3 class="wf-display" style="font-size:24px; font-weight:700; margin:0 0 12px; color:#0f1b16;">Hesaplarınızın Büyümesini Anlık İzleyin</h3>
        <p style="font-size:15px; line-height:1.7; color:#6b7c74; margin:0 0 20px; max-width:480px;">Workigom Flow, tüm sosyal medya hesaplarınızı tek bir yapay zekâ asistanının izlediği uçtan uca bir mimariyle yönetir. 12'den fazla platformdaki hesaplarınızın gelişimini, gönderi performansınızı ve etkileşimlerinizi tek panelden anlık takip edin. Gönderilerinizi önceden planlayın; seçtiğiniz saatte otomatik olarak yayınlansın — siz o an başka bir işle uğraşıyor olsanız bile.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Anlık büyüme ve etkileşim analitiği</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Gönderi planlama, otomatik yayınlama</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Uçtan uca tek panel, tek asistan</div>
        </div>
      </div>
      <div style="flex:1 1 380px; min-width:300px; display:flex; flex-direction:column; gap:16px;">
        <div class="wf-card" style="padding:20px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <span style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em;">Takipçi Büyümesi</span>
            <span class="wf-chip-light" style="padding:4px 10px; font-size:11px; color:#16a34a; font-weight:700;">+%18 bu ay</span>
          </div>
          <svg width="100%" height="64" viewBox="0 0 280 64" preserveAspectRatio="none">
            <polyline points="0,50 40,44 80,46 120,30 160,32 200,16 240,20 280,6" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
          </svg>
        </div>
        <div class="wf-card" style="padding:20px;">
          <div style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px;">Planlanan Gönderiler</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#f6faf7; border-radius:9px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>
              <span style="font-size:12px; flex:1; color:#1f2a25;">Yeni koleksiyon tanıtımı</span>
              <span style="font-size:11px; color:#9aa39d;">Bugün 18:00</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#f6faf7; border-radius:9px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>
              <span style="font-size:12px; flex:1; color:#1f2a25;">Haftalık kampanya videosu</span>
              <span style="font-size:11px; color:#9aa39d;">Yarın 09:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature 3: Randevu -->
    <div style="display:flex; align-items:center; gap:56px; flex-wrap:wrap; margin-bottom:88px;">
      <div style="flex:1 1 420px; min-width:300px;">
        <div style="width:48px; height:48px; border-radius:14px; background:#fff7ed; display:flex; align-items:center; justify-content:center; color:#d97706; margin-bottom:20px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"></rect><line x1="3" y1="9.5" x2="21" y2="9.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="16" y1="2.5" x2="16" y2="6.5"></line><circle cx="8" cy="14" r="1"></circle><circle cx="12" cy="14" r="1"></circle><circle cx="16" cy="14" r="1"></circle></svg>
        </div>
        <h3 class="wf-display" style="font-size:24px; font-weight:700; margin:0 0 12px; color:#0f1b16;">Randevularınız Kendi Kendine Sıraya Girsin</h3>
        <p style="font-size:15px; line-height:1.7; color:#6b7c74; margin:0 0 20px; max-width:480px;">Müşterileriniz WhatsApp üzerinden uygun saatleri görüp randevu alır. Çakışan randevu, unutulan telefon yok — canlı takvim ve yoğunluk haritası her şeyi sizin için düzenler.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#d97706; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Gerçek zamanlı takvim</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#d97706; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Çakışma önleme</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#d97706; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Otomatik hatırlatma</div>
        </div>
      </div>
      <div style="flex:1 1 380px; min-width:300px;">
        <div class="wf-card" style="padding:24px;">
          <div style="font-size:11px; font-weight:700; color:#9aa39d; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px;">Bugünkü Yoğunluk</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:11px; color:#9aa39d; width:44px;">Sabah</span><div style="flex:1; display:flex; gap:4px;"><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.15);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.45);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.15);"></div><div style="height:16px; flex:1; border-radius:4px; background:#eef1ef;"></div></div></div>
            <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:11px; color:#9aa39d; width:44px;">Öğle</span><div style="flex:1; display:flex; gap:4px;"><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.8);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.8);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.45);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.15);"></div></div></div>
            <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:11px; color:#9aa39d; width:44px;">Akşam</span><div style="flex:1; display:flex; gap:4px;"><div style="height:16px; flex:1; border-radius:4px; background:#eef1ef;"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.15);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.45);"></div><div style="height:16px; flex:1; border-radius:4px; background:rgba(22,163,74,0.15);"></div></div></div>
          </div>
          <div style="margin-top:16px; padding-top:14px; border-top:1px solid #eceeed; font-size:12px; color:#9aa39d;">Yeşil koyulaştıkça yoğunluk artar — müsait saatler müşterilerinize otomatik gösterilir.</div>
        </div>
      </div>
    </div>

    <!-- Feature 4: Muhasebe köprüsü -->
    <div style="display:flex; align-items:center; gap:56px; flex-wrap:wrap-reverse; margin-bottom:88px;">
      <div style="flex:1 1 380px; min-width:300px;">
        <div class="wf-card" style="padding:24px; display:flex; align-items:center; gap:18px;">
          <div style="width:56px; height:56px; border-radius:12px; background:#eafbf2; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z"></path><circle cx="12" cy="13" r="3.2"></circle></svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:13px; font-weight:700; margin-bottom:4px; color:#0f1b16;">Fatura yüklendi</div>
            <div style="font-size:12px; color:#9aa39d;">AI okuma tamamlandı · Müşavire iletildi</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
      </div>
      <div style="flex:1 1 420px; min-width:300px;">
        <div style="width:48px; height:48px; border-radius:14px; background:#eafbf2; display:flex; align-items:center; justify-content:center; color:#16a34a; margin-bottom:20px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6"></path><path d="M11 6l1-1a3.5 3.5 0 0 1 5 5l-1 1"></path><path d="M13 18l-1 1a3.5 3.5 0 0 1-5-5l1-1"></path></svg>
        </div>
        <h3 class="wf-display" style="font-size:24px; font-weight:700; margin:0 0 12px; color:#0f1b16;">Faturanın Fotoğrafını Çekin, Gerisini Bırakın</h3>
        <p style="font-size:15px; line-height:1.7; color:#6b7c74; margin:0 0 20px; max-width:480px;">Aldığınız ya da kestiğiniz faturanın fotoğrafını yükleyin; yapay zekâ bilgileri okur, eksikleri sorup tamamlar ve doğrudan mali müşavirinizin onayına gönderir. Workigom Ledger kullanan müşavirlerle uçtan uca entegre çalışır.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Anında yapay zekâ okuması</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Mali müşavire otomatik iletim</div>
          <div style="display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1f2a25;"><span style="color:#16a34a; display:flex;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Kağıt israfı ve unutulan fatura yok</div>
        </div>
      </div>
    </div>

    <!-- Feature 5: CRM - compact card -->
    <div class="wf-card" style="padding:32px; display:flex; align-items:center; gap:28px; flex-wrap:wrap;">
      <div style="width:52px; height:52px; border-radius:14px; background:#fff7ed; display:flex; align-items:center; justify-content:center; color:#d97706; flex-shrink:0;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"></circle><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"></path><circle cx="17.5" cy="9" r="2.4"></circle><path d="M15.5 13.2c2.2.3 4 2 4 4.3"></path></svg>
      </div>
      <div style="flex:1; min-width:260px;">
        <h3 class="wf-display" style="font-size:19px; font-weight:700; margin:0 0 6px; color:#0f1b16;">Her Müşteriyi Hatırlayan Bir Asistan</h3>
        <p style="font-size:14px; line-height:1.6; color:#6b7c74; margin:0;">Workigom Flow, daha önce yazışan müşterilerinizi tanır; geçmiş randevularını ve konuşmalarını hatırlayarak daha kişisel bir deneyim sunar.</p>
      </div>
    </div>
  </div>

  <!-- PERSONA ENGINE (dark band) -->
  <div style="position:relative; z-index:2; background:linear-gradient(180deg,#0a1512,#0d1e18); margin-top:96px; padding:80px 64px; overflow:hidden;">
    <div style="position:absolute; top:-100px; right:8%; width:360px; height:360px; background:#c2478d; opacity:0.12; filter:blur(110px); border-radius:999px; pointer-events:none;"></div>
    <div style="position:absolute; bottom:-100px; left:6%; width:340px; height:340px; background:#4edea3; opacity:0.10; filter:blur(110px); border-radius:999px; pointer-events:none;"></div>

    <div style="position:relative; max-width:1100px; margin:0 auto;">
      <div style="text-align:center; max-width:640px; margin:0 auto 44px;">
        <span style="font-size:12px; font-weight:700; letter-spacing:0.08em; color:#e879c4; text-transform:uppercase;">🎭 Persona Engine</span>
        <h2 class="wf-display" style="font-size:32px; font-weight:700; margin:12px 0 14px; letter-spacing:-0.01em; color:#fff;">Asistanınız Sıradan Olmak Zorunda Değil</h2>
        <p style="font-size:15.5px; line-height:1.7; color:#b9c4bf; margin:0;">Neşeli mi olsun, huysuz mu, yoksa biraz dedikoducu mu? 😄 Workigom Flow'da asistanınızın kişiliğini tamamen siz belirlersiniz — hatta ister Shakespeare'in ister Albert Einstein'ın ruhunu ödünç alabilirsiniz. 🎩</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:14px; margin-bottom:24px;">
        <div class="wf-card-dark" style="padding:14px; text-align:center;">
          <img src="persona-shakespeare.png" width="100%" style="border-radius:12px; display:block; margin-bottom:12px; aspect-ratio:1; object-fit:cover;">
          <div style="font-size:13.5px; font-weight:700; color:#fff;">Shakespeare</div>
          <div style="font-size:11px; color:#9aa8a2; margin-top:4px;">Edebi ve zarif</div>
        </div>
        <div class="wf-card-dark" style="padding:14px; text-align:center;">
          <img src="persona-einstein.png" width="100%" style="border-radius:12px; display:block; margin-bottom:12px; aspect-ratio:1; object-fit:cover;">
          <div style="font-size:13.5px; font-weight:700; color:#fff;">Einstein</div>
          <div style="font-size:11px; color:#9aa8a2; margin-top:4px;">Zeki ve meraklı</div>
        </div>
        <div class="wf-card-dark" style="padding:14px; text-align:center; border-color:#4edea3;">
          <img src="tone-neseli.jpg" width="100%" style="border-radius:12px; display:block; margin-bottom:12px; aspect-ratio:1; object-fit:cover;">
          <div style="font-size:13.5px; font-weight:700; color:#fff;">Neşeli</div>
          <div style="font-size:11px; color:#9aa8a2; margin-top:4px;">Enerjik ve samimi</div>
        </div>
        <div class="wf-card-dark" style="padding:14px; text-align:center;">
          <img src="tone-huysuz.jpg" width="100%" style="border-radius:12px; display:block; margin-bottom:12px; aspect-ratio:1; object-fit:cover;">
          <div style="font-size:13.5px; font-weight:700; color:#fff;">Huysuz</div>
          <div style="font-size:11px; color:#9aa8a2; margin-top:4px;">Dürüst ve net</div>
        </div>
        <div class="wf-card-dark" style="padding:14px; text-align:center;">
          <img src="tone-dedikoducu.jpg" width="100%" style="border-radius:12px; display:block; margin-bottom:12px; aspect-ratio:1; object-fit:cover;">
          <div style="font-size:13.5px; font-weight:700; color:#fff;">Dedikoducu</div>
          <div style="font-size:11px; color:#9aa8a2; margin-top:4px;">Sıcak ve meraklı</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:36px;">
        <span class="wf-chip-dark" style="padding:7px 15px; font-size:12.5px; font-weight:600; color:#e5e1e4;">🧘 Sakin</span>
        <span class="wf-chip-dark" style="padding:7px 15px; font-size:12.5px; font-weight:600; color:#e5e1e4;">😤 Sinirli</span>
        <span class="wf-chip-dark" style="padding:7px 15px; font-size:12.5px; font-weight:600; color:#e5e1e4;">🕵️ Sherlock Holmes</span>
        <span class="wf-chip-dark" style="padding:7px 15px; font-size:12.5px; font-weight:600; color:#e5e1e4;">👑 Kleopatra</span>
        <span class="wf-chip-dark" style="padding:7px 15px; font-size:12.5px; color:#9aa8a2; font-weight:600;">+ kendi karakterinizi yazın</span>
      </div>

      <div style="max-width:640px; margin:0 auto; text-align:center; padding:22px 28px; border-radius:14px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.08);">
        <p style="font-size:14.5px; line-height:1.6; color:#e5e1e4; margin:0; font-style:italic;">"Biz kodlarken çok eğlendik, siz de eğlenebilirsiniz — biz de sizin gibi standart yapay zekâlardan sıkıldık." 🙂</p>
        <p style="font-size:12px; color:#9aa8a2; margin:10px 0 0; font-style:normal;">— Workigom Flow Ekibi</p>
      </div>
    </div>
  </div>

  <!-- NASIL ÇALIŞIR -->
  <div id="nasil-calisir" style="position:relative; z-index:2; max-width:1100px; margin:0 auto; padding:100px 64px;">
    <div style="text-align:center; max-width:560px; margin:0 auto 56px;">
      <span style="font-size:12px; font-weight:700; letter-spacing:0.08em; color:#16a34a; text-transform:uppercase;">Nasıl Çalışır</span>
      <h2 class="wf-display" style="font-size:32px; font-weight:700; margin:12px 0 0; letter-spacing:-0.01em; color:#0f1b16;">Üç Adımda Kurulum</h2>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:28px;">
      <div class="wf-card" style="padding:28px;">
        <div style="width:44px; height:44px; border-radius:12px; background:#eafbf2; display:flex; align-items:center; justify-content:center; color:#16a34a; margin-bottom:18px; font-weight:800; font-family:'Sora',sans-serif;">1</div>
        <h4 class="wf-display" style="font-size:17px; font-weight:700; margin:0 0 8px; color:#0f1b16;">Hesabınızı Bağlayın</h4>
        <p style="font-size:13.5px; line-height:1.6; color:#6b7c74; margin:0;">WhatsApp ve sosyal medya hesaplarınızı birkaç dakikada bağlayın.</p>
      </div>
      <div class="wf-card" style="padding:28px;">
        <div style="width:44px; height:44px; border-radius:12px; background:#eef2ff; display:flex; align-items:center; justify-content:center; color:#6366f1; margin-bottom:18px; font-weight:800; font-family:'Sora',sans-serif;">2</div>
        <h4 class="wf-display" style="font-size:17px; font-weight:700; margin:0 0 8px; color:#0f1b16;">Asistanınızı Tanımlayın</h4>
        <p style="font-size:13.5px; line-height:1.6; color:#6b7c74; margin:0;">İşletmenize özel karakteri ve talimatları belirleyin.</p>
      </div>
      <div class="wf-card" style="padding:28px;">
        <div style="width:44px; height:44px; border-radius:12px; background:#fff7ed; display:flex; align-items:center; justify-content:center; color:#d97706; margin-bottom:18px; font-weight:800; font-family:'Sora',sans-serif;">3</div>
        <h4 class="wf-display" style="font-size:17px; font-weight:700; margin:0 0 8px; color:#0f1b16;">Müşterileriniz Yanıt Alsın</h4>
        <p style="font-size:13.5px; line-height:1.6; color:#6b7c74; margin:0;">Yapay zekâ, siz uğraşmadan 7/24 devrede kalır.</p>
      </div>
    </div>
  </div>

  <!-- DUAL PLATFORM -->
  <div style="position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:0 64px 100px;">
    <div class="wf-card" style="padding:44px; display:flex; align-items:center; gap:32px; flex-wrap:wrap; background:linear-gradient(135deg,#eafbf2,#ffffff);">
      <div style="width:56px; height:56px; border-radius:14px; background:#d1fae5; display:flex; align-items:center; justify-content:center; color:#16a34a; flex-shrink:0;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="13" height="9" rx="1.2"></rect><line x1="6" y1="17.5" x2="12" y2="17.5"></line><rect x="17" y="9" width="4.5" height="8" rx="1"></rect></svg>
      </div>
      <div style="flex:1; min-width:280px;">
        <h3 class="wf-display" style="font-size:22px; font-weight:700; margin:0 0 8px; color:#0f1b16;">Cebinizde de, Masanızda da</h3>
        <p style="font-size:14.5px; line-height:1.6; color:#6b7c74; margin:0;">Mobil uygulama ve web paneli aynı hesabı paylaşır — işletmenizi istediğiniz cihazdan, gerçek zamanlı olarak yönetin.</p>
      </div>
    </div>
  </div>

  <!-- FINAL CTA (dark band) -->
  <div style="position:relative; z-index:2; background:linear-gradient(180deg,#0a1512,#0d1e18); padding:90px 64px; text-align:center; overflow:hidden;">
    <div style="position:absolute; top:-100px; left:50%; transform:translateX(-50%); width:600px; height:300px; background:#4edea3; opacity:0.14; filter:blur(130px); border-radius:999px; pointer-events:none;"></div>
    <div style="position:relative; max-width:700px; margin:0 auto;">
      <h2 class="wf-display" style="font-size:34px; font-weight:700; margin:0 0 16px; letter-spacing:-0.01em; color:#fff;">İşletmenizin Dijital Gücünü Artırın</h2>
      <p style="font-size:15.5px; color:#b9c4bf; margin:0 0 32px;">Hemen Workigom Flow'u deneyin, tüm sosyal medya hesaplarınızı tek yerden yönetin.</p>
      <button class="wf-btn-primary-dark" style="padding:16px 36px; border-radius:12px; font-size:16px; font-weight:700; font-family:'Manrope',sans-serif;">Ücretsiz Dene</button>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="position:relative; z-index:2; border-top:1px solid #eceeed; padding:48px 64px;">
    <div style="max-width:1320px; margin:0 auto; display:flex; justify-content:space-between; align-items:flex-start; gap:40px; flex-wrap:wrap;">
      <div style="max-width:280px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <div style="width:26px; height:26px; border-radius:7px; background:linear-gradient(135deg,#4edea3,#16a34a); display:flex; align-items:center; justify-content:center; font-weight:800; color:#062b1a; font-size:13px; font-family:'Sora',sans-serif;">W</div>
          <span class="wf-display" style="font-weight:700; font-size:15px; color:#0f1b16;">Workigom Flow</span>
        </div>
        <p style="font-size:12.5px; line-height:1.6; color:#8a958f; margin:0;">Esnaf ve küçük işletmeler için WhatsApp ve sosyal medya yapay zekâ asistanı.</p>
      </div>
      <div style="display:flex; gap:64px; flex-wrap:wrap;">
        <div>
          <div style="font-size:11.5px; font-weight:700; color:#8a958f; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:14px;">Ürün</div>
          <div style="display:flex; flex-direction:column; gap:9px;">
            <a class="wf-link" href="#ozellikler" style="font-size:13.5px;">Özellikler</a>
            <a class="wf-link" href="#nasil-calisir" style="font-size:13.5px;">Nasıl Çalışır</a>
          </div>
        </div>
        <div>
          <div style="font-size:11.5px; font-weight:700; color:#8a958f; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:14px;">İletişim</div>
          <div style="display:flex; flex-direction:column; gap:9px;">
            <span style="font-size:13.5px; color:#6b7c74;">[E-POSTA ADRESİ]</span>
            <span style="font-size:13.5px; color:#6b7c74;">[TELEFON NUMARASI]</span>
          </div>
        </div>
      </div>
    </div>
    <div style="max-width:1320px; margin:36px auto 0; padding-top:24px; border-top:1px solid #f0f2f1; font-size:12px; color:#a3ada7;">
      © 2026 Workigom. Tüm hakları saklıdır.
    </div>
  </div>

</div>
` }} />
    </>
  );
}
