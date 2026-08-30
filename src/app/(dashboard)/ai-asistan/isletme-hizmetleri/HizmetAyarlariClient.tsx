'use client';

import { useState, useTransition } from 'react';
import { createBusinessService, updateBusinessService, deleteBusinessService } from '@/actions/businessServices';

export default function HizmetAyarlariClient({ initialServices, merchantId }: { initialServices: any[], merchantId: string }) {
  const [services, setServices] = useState(initialServices);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (selectedService) {
          await updateBusinessService(selectedService.id, formData);
        } else {
          await createBusinessService(merchantId, formData);
        }
        // Ideally we fetch the updated list here or rely on router.refresh() 
        // which server actions trigger via revalidatePath.
        window.location.reload(); 
      } catch (err) {
        console.error(err);
        alert('Hizmet kaydedilirken hata oluþtu.');
      }
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bu hizmeti silmek istediðinize emin misiniz?')) return;
    
    startTransition(async () => {
      try {
        await deleteBusinessService(id);
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert('Hizmet silinirken hata oluþtu.');
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Hizmet Ayarlarý</h1>
        <p className="text-dark-muted text-sm">Müþterileriniz randevu alýrken hizmetleri bu listeden seçebilir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl">
        {/* Sol Kolon */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-sm font-medium text-on-surface mb-4">Aktif Hizmetler ({services.length}/10)</h3>
            <div className="space-y-3">
              {services.map((svc, index) => (
                <div 
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  className={group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors \}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium" style={{ backgroundColor: svc.color || '#3b82f6', color: '#fff' }}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-on-surface group-hover:text-secondary transition-colors">{svc.name}</div>
                      <div className="text-xs text-emerald-400 mt-0.5">{svc.price} {svc.currency} / {svc.unit}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-on-surface transition-colors">
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button onClick={(e) => handleDelete(svc.id, e)} className="w-8 h-8 rounded bg-red-900/20 border border-red-900/30 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-colors">
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectedService(null)} className="w-full py-4 mt-2 rounded-lg border border-dashed border-secondary/50 bg-secondary/5 text-secondary font-medium hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-plus"></i>
              Yeni Hizmet Ekle
            </button>
          </div>
        </div>

        {/* Sað Kolon */}
        <div className="lg:col-span-7">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-on-surface mb-1">{selectedService ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}</h2>
              <p className="text-sm text-dark-muted">Hizmet bilgilerini girin ve kaydedin.</p>
            </div>
            
            <form action={handleSave} className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Hizmet Adý</label>
                <input name="name" key={\
ame-\\} defaultValue={selectedService?.name || ''} required className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" type="text" />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Fiyat</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input name="price" key={\price-\\} defaultValue={selectedService?.price || ''} required className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" type="number" step="0.01" />
                  </div>
                  <div className="w-32">
                    <select name="currency" key={\cur-\\} defaultValue={selectedService?.currency || 'TL'} className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-10 py-2.5 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="TL">TL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <span className="text-dark-muted">/</span>
                  <div className="w-40">
                    <select name="unit" key={\unit-\\} defaultValue={selectedService?.unit || 'seans'} className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-10 py-2.5 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="seans">seans</option>
                      <option value="saat">saat</option>
                      <option value="adet">adet</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Açýklama (Ýsteðe baðlý)</label>
                <textarea name="description" key={\desc-\\} defaultValue={selectedService?.description || ''} className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-dark-muted/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" rows={3}></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Tahmini Süre (Dakika)</label>
                <input name="duration_minutes" key={\dur-\\} defaultValue={selectedService?.duration_minutes || 30} required className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" type="number" />
              </div>
              
              <input type="hidden" name="color" value={selectedService?.color || '#F97316'} />
              <input type="hidden" name="is_visible" value="true" />

              <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
                <button type="button" onClick={() => setSelectedService(null)} className="px-6 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-on-surface hover:bg-dark-border/50 transition-colors text-sm font-medium">Temizle</button>
                <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-lg bg-secondary text-on-surface hover:bg-secondary/90 transition-colors text-sm font-medium flex items-center gap-2">
                  <i className="fa-regular fa-floppy-disk"></i>
                  {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
