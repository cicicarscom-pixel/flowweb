"use client";

import React, {/* Randevu Bildirimleri */}
        <div>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 16 }}>Randevu Bildirimleri</p>
          <div className="glass" style={{ borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--text-secondary)", textAlign: "left" }}>
                  <th style={{ padding: "16px 20px", fontWeight: 600 }}>Tarih</th>
                  <th style={{ padding: "16px 20px", fontWeight: 600 }}>Bildirim</th>
                  <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {commLogs.map((log, i) => {
                  let text = "Yeni randevu oluşturuldu.";
                  let dateStr = new Date(log.created_at).toLocaleDateString(locale) + ' ' + new Date(log.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
                  if (log.metadata) {
                    const md = log.metadata;
                    const rd = md.starts_at ? new Date(md.starts_at) : null;
                    const rds = rd ? rd.toLocaleDateString(locale, { month: 'long', day: 'numeric', weekday: 'long'}) + ' ' + rd.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit'}) : '';
                    text = `${md.customer_name || 'Müşteri'} randevu aldı — ${rds} · ${md.calendar_name || ''}` + (md.customer_request_raw ? ` 📝 ${md.customer_request_raw}` : '');
                  } else if (log.message) {
                    text = log.message;
                  }
                  return (
                    <tr key={log.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: log.is_read ? 'transparent' : 'rgba(255,122,89,0.05)' }}>
                      <td style={{ padding: "16px 20px", color: "rgba(255,255,255,0.7)" }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: "16px 20px", color: log.is_read ? "#fff" : "#FF7A59", fontWeight: log.is_read ? 400 : 600 }}>
                        {text}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", color: "#FF7A59", cursor: "pointer", fontWeight: 600 }} onClick={async () => {
                        if (!log.is_read) {
                          await supabase.from('notifications').update({ is_read: true }).eq('id', log.id);
                        }
                        let targetDate = '';
                        if (log.metadata?.starts_at) targetDate = '?date=' + log.metadata.starts_at.split('T')[0];
                        router.push('/ai-asistan/randevu' + targetDate);
                      }}>
                        Görüntüle
                      </td>
                    </tr>
                  );
                })}
                {commLogs.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: "16px 20px", color: "var(--text-secondary)", textAlign: "center" }}>Bildirim bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
