'use client'

import { useState } from 'react';

export default function MusterilerClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const formatDate = (isoStr: string) => {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {initialCustomers.length === 0 ? (
          <div className="glass-strong" style={{ padding: 30, textAlign: 'center', color: 'var(--text-300)' }}>
            Henüz hiç müşteri kaydı yok.
          </div>
        ) : (
          initialCustomers.map(customer => (
            <div 
              key={customer.id} 
              className={`glass-strong ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
              style={{
                padding: 16,
                borderRadius: 12,
                cursor: 'pointer',
                border: selectedCustomer?.id === customer.id ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 16, color: 'var(--text-100)' }}>{customer.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-300)', marginTop: 4 }}>{customer.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'var(--text-200)' }}>{customer.total_appointments} Randevu</div>
                <div style={{ fontSize: 12, color: 'var(--text-400)', marginTop: 4 }}>Son: {formatDate(customer.last_visit)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details */}
      {selectedCustomer && (
        <div style={{ width: 350, flexShrink: 0 }}>
          <div className="glass-strong" style={{ padding: 20, borderRadius: 16, position: 'sticky', top: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-100)' }}>{selectedCustomer.name}</h3>
            <p style={{ margin: '0 0 20px 0', color: 'var(--text-300)', fontSize: 14 }}>{selectedCustomer.phone}</p>
            
            <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--text-200)' }}>Geçmiş Randevular</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedCustomer.history.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-400)' }}>Kayıtlı randevu yok.</div>
              ) : (
                selectedCustomer.history.map((appt: any) => (
                  <div key={appt.id} style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 14, color: 'var(--text-100)', marginBottom: 4 }}>
                      {appt.services?.length > 0 ? appt.services.join(' + ') : 'Bilinmeyen Hizmet'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-300)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{formatDate(appt.date)}</span>
                      <span style={{ 
                        color: appt.status === 'Approved' ? 'var(--accent-green)' : 
                               appt.status === 'Cancelled' ? 'var(--accent-red)' : 'var(--accent-yellow)'
                      }}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
