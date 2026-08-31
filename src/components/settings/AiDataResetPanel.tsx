'use client'
import { useState } from 'react'
import { resetAiData } from '@/actions/resetAiData'

function ConfirmModal({ title, warning, onConfirm, onClose }: { title: string; warning: string; onConfirm: () => void; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass" style={{ maxWidth: 420, padding: 24, borderRadius: 16, border: '1px solid rgba(239,68,68,0.4)' }}>
        <h3 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>{warning}</p>
        <p style={{ fontSize: 13, marginBottom: 8 }}>Onaylamak için <b>SIFIRLA</b> yazın:</p>
        <input value={confirmText} onChange={e => setConfirmText(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', color: '#fff' }}>Vazgeç</button>
          <button
            disabled={confirmText !== 'SIFIRLA' || loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#EF4444', color: '#fff', opacity: confirmText === 'SIFIRLA' ? 1 : 0.5 }}
          >
            {loading ? 'Siliniyor...' : 'Evet, Sıfırla'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AiDataResetPanel() {
  const [modal, setModal] = useState<'soft' | 'hard' | null>(null)

  const handleReset = async (mode: 'soft' | 'hard') => {
    const res = await resetAiData(mode)
    if (res.success) {
      alert(mode === 'soft' ? 'Veriler sıfırlandı.' : 'Fabrika ayarlarına sıfırlandı.')
      window.location.reload()
    } else {
      alert(`Hata: ${res.error}`)
    }
    setModal(null)
  }

  return (
    <div className="glass" style={{ borderRadius: 20, padding: 20, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)', marginTop: 32 }}>
      <h3 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 4 }}>⚠️ Tehlikeli Bölge</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Bu işlemler geri alınamaz.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>Test Verilerini Sıfırla</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Müşteriler, randevular, sohbet geçmişi, bildirimler, sosyal medya mesaj/yorumları silinir. Ayarlarınız (persona, hizmetler, bağlantılar) korunur.</p>
          </div>
          <button onClick={() => setModal('soft')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', padding: '8px 16px', borderRadius: 8 }}>Sıfırla</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>Fabrika Ayarlarına Sıfırla</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Yukarıdakilere ek olarak persona seçimi ve hizmet listesi de silinir. WhatsApp/sosyal medya bağlantılarınız korunur, yeniden bağlamanız gerekmez.</p>
          </div>
          <button onClick={() => setModal('hard')} style={{ background: '#EF4444', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 600 }}>Fabrika Ayarları</button>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          title={modal === 'soft' ? 'Test Verilerini Sıfırla' : 'Fabrika Ayarlarına Sıfırla'}
          warning={modal === 'soft' ? 'Tüm müşteri, randevu ve sohbet geçmişi kalıcı olarak silinecek.' : 'Tüm veriler VE ayarlarınız (persona, hizmetler) kalıcı olarak silinecek. İşletmeniz sıfırdan kurulum gerektirecek.'}
          onConfirm={() => handleReset(modal)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
