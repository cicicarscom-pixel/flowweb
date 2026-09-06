'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { resetAiData } from '@/actions/resetAiData'

// Not: 'SIFIRLA' onay kelimesi iş mantığında (aşağıdaki === 'SIFIRLA' kontrolü)
// sabit bir değer olarak kullanıldığından KASITLI OLARAK çevrilmez — teknik bir
// sabittir, dile göre değişmez. Sadece etrafındaki talimat metni çevrilir.
const CONFIRM_WORD = 'SIFIRLA'

function ConfirmModal({ title, warning, onConfirm, onClose }: { title: string; warning: string; onConfirm: () => void; onClose: () => void }) {
  const t = useTranslations()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass" style={{ maxWidth: 420, padding: 24, borderRadius: 16, border: '1px solid rgba(239,68,68,0.4)' }}>
        <h3 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>{warning}</p>
        <p style={{ fontSize: 13, marginBottom: 8 }}>{t.rich('aiDataResetPanel.confirmModal.instructionRich', { word: CONFIRM_WORD, b: (chunks) => <b>{chunks}</b> })}</p>
        <input value={confirmText} onChange={e => setConfirmText(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, marginBottom: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', color: '#fff' }}>{t('aiDataResetPanel.confirmModal.cancel')}</button>
          <button
            disabled={confirmText !== CONFIRM_WORD || loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#EF4444', color: '#fff', opacity: confirmText === CONFIRM_WORD ? 1 : 0.5 }}
          >
            {loading ? t('aiDataResetPanel.confirmModal.deleting') : t('aiDataResetPanel.confirmModal.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AiDataResetPanel() {
  const t = useTranslations()
  const [modal, setModal] = useState<'soft' | 'hard' | null>(null)

  const handleReset = async (mode: 'soft' | 'hard') => {
    const res = await resetAiData(mode)
    if (res.success) {
      alert(mode === 'soft' ? t('aiDataResetPanel.softReset.doneAlert') : t('aiDataResetPanel.hardReset.doneAlert'))
      window.location.reload()
    } else {
      alert(t('aiDataResetPanel.alerts.errorPrefix', { error: res.error }))
    }
    setModal(null)
  }

  return (
    <div className="glass" style={{ borderRadius: 20, padding: 20, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)', marginTop: 32 }}>
      <h3 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 4 }}>{t('aiDataResetPanel.dangerZone.title')}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>{t('aiDataResetPanel.dangerZone.subtitle')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{t('aiDataResetPanel.softReset.title')}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t('aiDataResetPanel.softReset.description')}</p>
          </div>
          <button onClick={() => setModal('soft')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', padding: '8px 16px', borderRadius: 8 }}>{t('aiDataResetPanel.softReset.button')}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{t('aiDataResetPanel.hardReset.title')}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t('aiDataResetPanel.hardReset.description')}</p>
          </div>
          <button onClick={() => setModal('hard')} style={{ background: '#EF4444', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 600 }}>{t('aiDataResetPanel.hardReset.button')}</button>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          title={modal === 'soft' ? t('aiDataResetPanel.softReset.title') : t('aiDataResetPanel.hardReset.title')}
          warning={modal === 'soft' ? t('aiDataResetPanel.softReset.warning') : t('aiDataResetPanel.hardReset.warning')}
          onConfirm={() => handleReset(modal)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
