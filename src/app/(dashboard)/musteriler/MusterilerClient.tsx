'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getCustomerAppointments, updateCustomerNotes, createCustomer } from '@/actions/customers';

export default function MusterilerClient({ initialCustomers }: { initialCustomers: any[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addError, setAddError] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    const phoneDigits = c.phone_display?.replace(/\D/g, '') || '';
    const searchDigits = search.replace(/\D/g, '');
    return (c.name || '').toLowerCase().includes(s) || (searchDigits && phoneDigits.includes(searchDigits));
  });

  const getAvatarColor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 40%)`;
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (isoStr: string, tz?: string) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat(locale, { 
        timeZone: tz || 'Europe/Istanbul', 
        day: 'numeric', month: 'short', weekday: 'short', hour: '2-digit', minute: '2-digit' 
      }).format(d);
    } catch(e) {
      return new Date(isoStr).toLocaleString(locale);
    }
  };

  const loadAppointments = async (id: string) => {
    const list = await getCustomerAppointments(id);
    setAppointments(list);
  };

  const openCard = (customer: any) => {
    setSelectedCustomer(customer);
    setAppointments([]);
    loadAppointments(customer.id);
  };

  const handleNotesBlur = async (id: string, notes: string) => {
    const res = await updateCustomerNotes(id, notes);
    if (res.status === 'SUCCESS') {
      const span = document.getElementById('notes-saved-' + id);
      if (span) {
        span.style.opacity = '1';
        setTimeout(() => span.style.opacity = '0', 2000);
      }
    }
  };

  const handleAdd = async () => {
    setAddError('');
    if (!addName.trim()) { setAddError(t('musteriler.nameRequired', { defaultValue: 'İsim gerekli' })); return; }
    if (!addPhone.trim()) { setAddError(t('musteriler.phoneRequired', { defaultValue: 'Telefon gerekli' })); return; }
    
    const res = await createCustomer(addName, addPhone);
    if (res.status === 'SUCCESS' || res.status === 'ALREADY_EXISTS') {
      window.location.reload();
    } else if (res.status === 'INVALID_PHONE') {
      setAddError(t('musteriler.invalidPhone', { defaultValue: 'Geçersiz telefon formatı' }));
    } else {
      setAddError(t('musteriler.error', { defaultValue: 'Bir hata oluştu' }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, margin: '0 0 4px 0', color: 'var(--text-100)' }}>
            {t('header.titles.customers', { defaultValue: 'Müşteriler' })}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-300)', fontSize: 14 }}>
            {customers.length} {t('musteriler.customerCount', { defaultValue: 'müşteri' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            placeholder={t('musteriler.search', { defaultValue: 'İsim veya telefon ara...' })}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'var(--text-100)', padding: '8px 12px', borderRadius: 8, outline: 'none' 
            }}
          />
          <button 
            onClick={() => setIsAddOpen(true)}
            style={{ 
              background: 'var(--accent-blue)', color: '#fff', border: 'none', 
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 
            }}
          >
            + {t('musteriler.addCustomer', { defaultValue: 'Müşteri ekle' })}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left: Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredCustomers.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-300)' }}>
              {t('musteriler.empty', { defaultValue: 'Müşteri bulunamadı.' })}
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <div 
                key={customer.id} 
                className="glass-strong"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: selectedCustomer?.id === customer.id ? '2px solid #FF7A59' : '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 20, background: getAvatarColor(customer.id), 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 
                  }}>
                    {getInitials(customer.name)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {customer.name}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-300)' }}>
                      {customer.phone_display}
                    </div>
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: 10, padding: '4px 8px', borderRadius: 4, fontWeight: 600,
                      background: customer.source === 'whatsapp' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: customer.source === 'whatsapp' ? '#22c55e' : '#3b82f6'
                    }}>
                      {customer.source === 'whatsapp' ? 'WhatsApp' : 'Elle eklendi'}
                    </span>
                  </div>
                </div>

                {/* Next Appointment Box */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
                  {customer.next_starts_at ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#FF7A59', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600 }}>
                          {formatDate(customer.next_starts_at)}
                        </span>
                        {customer.next_doctor && (
                          <span style={{ fontSize: 11, color: '#7ddba8', background: 'rgba(125,219,168,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            {customer.next_doctor}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-200)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        "{customer.next_request}"
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--text-300)' }}>
                      {t('musteriler.noUpcoming', { defaultValue: 'Yaklaşan randevu yok' })}
                      {customer.last_visit_at && ` - Son ziyaret: ${formatDate(customer.last_visit_at)}`}
                    </div>
                  )}
                </div>

                {/* 3 Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-300)' }}>
                  <div>Randevu: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-100)' }}>{customer.total}</span></div>
                  <div>Yaklaşan: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-100)' }}>{customer.upcoming}</span></div>
                  <div>İptal: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-100)' }}>{customer.cancelled}</span></div>
                </div>

                {/* Button */}
                <button 
                  onClick={() => openCard(customer)}
                  style={{ 
                    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'var(--text-100)', padding: '8px', borderRadius: 8, cursor: 'pointer' 
                  }}
                >
                  {t('musteriler.openCard', { defaultValue: 'Kartı aç' })}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Detail Panel */}
        {selectedCustomer && (
          <div className="glass-strong" style={{ width: 380, flexShrink: 0, position: 'sticky', top: 90, borderRadius: 16, padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: getAvatarColor(selectedCustomer.id), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 600 }}>
                {getInitials(selectedCustomer.name)}
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: 20, color: 'var(--text-100)' }}>{selectedCustomer.name}</h2>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: 'var(--text-200)', marginBottom: 4 }}>
                  {selectedCustomer.phone_display}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-400)' }}>
                  {new Date(selectedCustomer.created_at).toLocaleDateString(locale)} tarihinden beri • {selectedCustomer.source === 'whatsapp' ? 'WhatsApp' : 'Elle eklendi'}
                </div>
              </div>
            </div>

            {/* 3 Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <button onClick={() => window.open(`https://wa.me/${selectedCustomer.phone_display?.replace(/\D/g, '')}`, '_blank')} style={{ flex: 1, padding: 8, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>WhatsApp</button>
              <button onClick={() => window.location.href = `tel:+${selectedCustomer.phone_display?.replace(/\D/g, '')}`} style={{ flex: 1, padding: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Ara</button>
              <button onClick={() => router.push('/ai-asistan/randevu')} style={{ flex: 1, padding: 8, background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Randevu ver</button>
            </div>

            {/* 4 Stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[
                { label: 'Toplam', val: selectedCustomer.total },
                { label: 'Yaklaşan', val: selectedCustomer.upcoming },
                { label: 'Tamamlanan', val: selectedCustomer.past },
                { label: 'İptal', val: selectedCustomer.cancelled },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '8px 4px', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-300)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 600, color: 'var(--text-100)' }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14, color: 'var(--text-100)' }}>Notlar</h4>
                <span id={`notes-saved-${selectedCustomer.id}`} style={{ fontSize: 12, color: '#7ddba8', opacity: 0, transition: 'opacity 0.3s' }}>Kaydedildi</span>
              </div>
              <textarea 
                defaultValue={selectedCustomer.notes || ''}
                onBlur={(e) => handleNotesBlur(selectedCustomer.id, e.target.value)}
                style={{ width: '100%', height: 80, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, color: 'var(--text-100)', resize: 'none', outline: 'none' }}
                placeholder="Müşteri için not ekleyin..."
              />
            </div>

            {/* Appointments */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--text-100)' }}>Randevu Geçmişi</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                {appointments.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-400)' }}>Randevu bulunamadı.</div>
                ) : (
                  appointments.map(appt => (
                    <div key={appt.id} style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, borderLeft: `3px solid ${appt.status === 'Approved' ? '#22c55e' : appt.status === 'Pending' ? '#eab308' : '#6b7280'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#FF7A59', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600 }}>{formatDate(appt.starts_at, appt.timezone)}</span>
                        <span style={{ fontSize: 11, color: appt.status === 'Approved' ? '#22c55e' : appt.status === 'Pending' ? '#eab308' : '#9ca3af' }}>{appt.status}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-100)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{appt.request}"</div>
                      <div style={{ fontSize: 11, color: '#7ddba8' }}>{appt.doctor}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-strong" style={{ width: 400, padding: 24, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-100)' }}>Yeni Müşteri Ekle</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-300)', marginBottom: 4 }}>İsim Soyisim</label>
              <input value={addName} onChange={e => setAddName(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: 10, borderRadius: 8, color: '#fff' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-300)', marginBottom: 4 }}>Telefon (+90 5XX ...)</label>
              <input value={addPhone} onChange={e => setAddPhone(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: 10, borderRadius: 8, color: '#fff' }} />
            </div>
            {addError && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 16 }}>{addError}</div>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setIsAddOpen(false)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-200)', border: 'none', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}