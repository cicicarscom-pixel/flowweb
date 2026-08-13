export default function DashboardHomePage() {
  const appointments = [
    { time: "10:00", title: "Ayşe Kaya - Danışmanlık", type: "consulting", color: "#00f0ff" },
    { time: "12:30", title: "Marka Toplantısı", type: "meeting", color: "#bc13fe" },
    { time: "15:00", title: "Seda Koç - Demo Sunumu", type: "demo", color: "#4edea3" },
    { time: "17:30", title: "Haftalık Analitik İncelemesi", type: "review", color: "#ffb95f" },
  ];

  function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
    const icons: Record<string, { bg: string; label: string }> = {
      instagram: { bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", label: "IG" },
      tiktok: { bg: "#010101", label: "TK" },
      facebook: { bg: "#1877F2", label: "FB" },
      youtube: { bg: "#FF0000", label: "YT" },
      linkedin: { bg: "#0A66C2", label: "LI" },
      google: { bg: "#4285F4", label: "GB" },
      whatsapp: { bg: "#25D366", label: "WA" },
    };
    const p = icons[platform] || { bg: "#444", label: "??" };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, borderRadius: "50%", background: p.bg,
        fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0,
        fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em",
      }}>
        {p.label}
      </span>
    );
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* AI Summary Bubble */}
      <div className="glass neon-cyan" style={{ borderRadius: 20, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 74, height: 74, borderRadius: 23, background: "linear-gradient(135deg,#00f0ff22,#4edea322)",
          border: "1.5px solid rgba(0,240,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden"
        }}>
          <video 
            src="/video1.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(0,240,255,0.7)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>AI ASISTAN · GÜNLÜK ÖZET</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
            Bugün <strong style={{ color: "#00f0ff" }}>47 mesaj</strong> ve <strong style={{ color: "#4edea3" }}>128 yorum</strong> otomatik yanıtlandı.
            Instagram'da yayınlanan son post <strong style={{ color: "#ffb95f" }}>%18.4</strong> etkileşim aldı — bu haftanın rekoru!
            Öğleden sonra <strong style={{ color: "#bc13fe" }}>3 randevunuz</strong> var.
          </p>
        </div>
      </div>

      {/* Financial Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "Aylık Gelir", value: "₺128,450", change: "+12.4%", up: true, color: "#4edea3" },
          { label: "Aylık Gider", value: "₺34,820", change: "-3.1%", up: false, color: "#ff6b6b" },
          { label: "Net Kar", value: "₺93,630", change: "+18.7%", up: true, color: "#ffb95f" },
        ].map(m => (
          <div key={m.label} className="glass" style={{ borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{m.label}</p>
            <p style={{ color: m.color, fontSize: 28, fontWeight: 700, fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", marginBottom: 6 }}>{m.value}</p>
            <span style={{
              fontSize: 12, fontWeight: 600, color: m.up ? "#4edea3" : "#ff6b6b",
              background: m.up ? "rgba(78,222,163,0.12)" : "rgba(255,107,107,0.12)",
              padding: "3px 8px", borderRadius: 99, fontFamily: "JetBrains Mono, monospace"
            }}>{m.change}</span>
          </div>
        ))}
      </div>

      {/* Split view: Invoice + Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Invoice Scanner */}
        <div className="glass neon-orange" style={{ borderRadius: 20, padding: "20px 22px" }}>
          <p style={{ fontSize: 12, color: "rgba(255,185,95,0.8)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14, fontFamily: "JetBrains Mono, monospace" }}>FATURA TARAYICI · SON FATURA</p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 80, height: 100, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,185,95,0.2)" }}>
              <img
                src="https://images.unsplash.com/photo-1648500847390-7792256bb95a?w=80&h=100&fit=crop&auto=format"
                alt="Fatura belgesi"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: "Tedarikçi", value: "Ofis Dünyası A.Ş." },
                { label: "Tarih", value: "03.02.2026" },
                { label: "KDV", value: "%20" },
                { label: "Toplam", value: "₺4,820.00" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{r.label}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="fab" style={{ marginTop: 14, background: "rgba(255,185,95,0.12)", color: "#ffb95f", border: "1px solid rgba(255,185,95,0.25)", width: "100%", justifyContent: "center", fontSize: 13 }}>
            + Yeni Fatura Tara
          </button>
        </div>

        {/* Today's timeline */}
        <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14 }}>BUGÜNKÜ RANDEVULAR</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.map(a => (
              <div key={a.time} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: a.color, fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", width: 38, flexShrink: 0 }}>{a.time}</span>
                <div style={{ width: 3, height: 36, borderRadius: 2, background: a.color, flexShrink: 0, opacity: 0.6 }} />
                <div>
                  <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>{a.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform overview */}
      <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.07em", marginBottom: 14 }}>PLATFORM PERFORMANSI · BUGÜN</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { name: "Instagram", reach: "8,420", engagement: "18.4%", platform: "instagram" },
            { name: "TikTok", reach: "15,200", engagement: "22.1%", platform: "tiktok" },
            { name: "Facebook", reach: "5,900", engagement: "9.8%", platform: "facebook" },
            { name: "YouTube", reach: "3,100", engagement: "14.2%", platform: "youtube" },
          ].map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <PlatformIcon platform={p.platform} size={28} />
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: 10, marginBottom: 2 }}>{p.name}</p>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{p.reach}</p>
                <p style={{ color: "#4edea3", fontSize: 10, fontWeight: 600 }}>{p.engagement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
