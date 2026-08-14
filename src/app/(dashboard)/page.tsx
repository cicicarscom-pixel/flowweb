export default function DashboardHomePage() {
  const appointments = [
    { time: "10:00", title: "Ayşe Kaya - Danışmanlık", type: "consulting", color: "#00f0ff" },
    { time: "12:30", title: "Marka Toplantısı", type: "meeting", color: "#bc13fe" },
    { time: "15:00", title: "Seda Koç - Demo Sunumu", type: "demo", color: "#4edea3" },
    { time: "17:30", title: "Haftalık Analitik İncelemesi", type: "review", color: "#ffb95f" },
  ];

  const activities = [
    { id: 1, type: "MESAJ", platform: "WHATSAPP", name: "Ahmet Yılmaz", message: "Merhaba, ürün hakkında bilgi alabilir miyim?", date: "5dk önce", color: "#25D366" },
    { id: 2, type: "YORUM", platform: "INSTAGRAM", name: "ayse_kaya", message: "Fiyat nedir acaba?", date: "1sa önce", color: "#bc13fe" },
    { id: 3, type: "MESAJ", platform: "WHATSAPP", name: "Mehmet Demir", message: "Siparişim ne zaman kargoya verilir?", date: "2sa önce", color: "#25D366" },
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
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: "rgba(0,240,255,0.7)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>AI ASISTAN · GÜNLÜK ÖZET</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>
            Bugün <strong style={{ color: "#00f0ff" }}>47 mesaj</strong> ve <strong style={{ color: "#4edea3" }}>128 yorum</strong> otomatik yanıtlandı.
            Instagram'da yayınlanan son post <strong style={{ color: "#ffb95f" }}>%18.4</strong> etkileşim aldı — bu haftanın rekoru!
            Öğleden sonra <strong style={{ color: "#bc13fe" }}>3 randevunuz</strong> var.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingLeft: 20, borderLeft: "1px solid rgba(255,255,255,0.1)", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#00f0ff", letterSpacing: "0.05em", fontFamily: "JetBrains Mono, monospace" }}>AKTİF</span>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: "rgba(0, 240, 255, 0.2)", border: "1.5px solid rgba(0, 240, 255, 0.4)", position: "relative", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 1.5, right: 2, boxShadow: "0 0 10px #00f0ff" }} />
          </div>
        </div>
      </div>

      {/* Financial Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Aylık Gelir", value: "₺128,450", change: "+12.4%", up: true, color: "#4edea3" },
          { label: "Aylık Gider", value: "₺34,820", change: "-3.1%", up: false, color: "#ff6b6b" },
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

      {/* Social Media Stats (Tüm Hesaplar) */}
      <div className="glass neon-cyan" style={{ borderRadius: 20, padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(0,240,255,0.05), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👥</div>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Tüm Hesaplar</p>
          </div>
          <div style={{ padding: "4px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>CANLI ANALİZ</span>
          </div>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 8 }}>Toplam Takipçi Kitle</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#00f0ff", fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em", textShadow: "0 0 10px rgba(0,240,255,0.3)" }}>32,420</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#4edea3" }}>
                <span style={{ fontSize: 14 }}>↑</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>12%</span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 8 }}>Etkileşim Trendi</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 120, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: "82%", height: "100%", background: "linear-gradient(90deg, #00f0ff, #bc13fe)" }} />
              </div>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Yüksek</span>
            </div>
          </div>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>Son Aktiviteler</p>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>TÜMÜNÜ GÖR</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activities.map(act => (
            <div key={act.id} className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, borderLeft: `3px solid ${act.color}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden" }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(act.name)}&background=random&color=fff`} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{act.name}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 11 }}>{act.date}</p>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 8 }}>{act.message}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: `${act.color}22`, color: act.color, fontWeight: 700 }}>{act.type}</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontWeight: 700 }}>{act.platform}</span>
                </div>
              </div>
              <span style={{ color: "var(--text-secondary)", opacity: 0.5, fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* İletişim Raporları */}
      <div>
        <p style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 16 }}>İletişim Raporları</p>
        <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--text-secondary)", textAlign: "left" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>İletişim Kanalı</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Tarih/Saat</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Durum</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                  <PlatformIcon platform="whatsapp" size={24} /> WhatsApp
                </td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.7)" }}>Bugün, 10:45</td>
                <td style={{ padding: "16px 20px" }}><span style={{ color: "#4edea3", background: "rgba(78,222,163,0.1)", padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>Başarılı</span></td>
                <td style={{ padding: "16px 20px", textAlign: "right", color: "#00f0ff", cursor: "pointer", fontWeight: 600 }}>İncele</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                  <PlatformIcon platform="instagram" size={24} /> Instagram DM
                </td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.7)" }}>Dün, 18:20</td>
                <td style={{ padding: "16px 20px" }}><span style={{ color: "#4edea3", background: "rgba(78,222,163,0.1)", padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>Başarılı</span></td>
                <td style={{ padding: "16px 20px", textAlign: "right", color: "#00f0ff", cursor: "pointer", fontWeight: 600 }}>İncele</td>
              </tr>
              <tr>
                <td style={{ padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                  <PlatformIcon platform="facebook" size={24} /> Facebook Yorum
                </td>
                <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.7)" }}>12 Ağu, 14:10</td>
                <td style={{ padding: "16px 20px" }}><span style={{ color: "#ffb95f", background: "rgba(255,185,95,0.1)", padding: "4px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>Beklemede</span></td>
                <td style={{ padding: "16px 20px", textAlign: "right", color: "#00f0ff", cursor: "pointer", fontWeight: 600 }}>İncele</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
