"use client";

export default function IsletmeHizmetleriPage() {
 return (
 <div className="flex-1 overflow-y-auto p-6 lg:p-8">
 {/* Page Header */}
 <div className="mb-8">
 <h1 className="text-2xl font-bold text-on-surface mb-2">Hizmet Ayarları</h1>
 <p className="text-dark-muted text-sm">Müşterileriniz randevu alırken hizmetleri bu listeden seçebilir.</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 {/* BEGIN: Left Column (Active Services) */}
 <div className="lg:col-span-5 flex flex-col gap-6">
 {/* Visibility Toggle Card */}
 <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-center justify-between">
 <div>
 <h3 className="text-base font-semibold text-on-surface mb-1">Hizmet Görünürlüğü</h3>
 <p className="text-sm text-dark-muted">Müşterileriniz randevu alırken hizmetleri bu listeden seçebilir.</p>
 </div>
 {/* Toggle Switch */}
 <label className="relative inline-flex items-center cursor-pointer ml-2">
 <input defaultChecked className="sr-only peer" name="toggle" type="checkbox" />
 <div className="w-11 h-6 bg-[#2A2E39] rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:-secondary"></div>
 </label>
 </div>

 {/* Active Services List Card */}
 <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex-1">
 <div className="flex items-center gap-2 mb-5">
 <h3 className="text-base font-semibold text-on-surface">Aktif Hizmetler (3/10)</h3>
 <i className="fa-solid fa-circle-info text-dark-muted text-sm cursor-help"></i>
 </div>
 <div className="space-y-3">
 {/* Service Item 1 */}
 <div className="flex items-center justify-between p-3 rounded-lg border border-dark-border bg-surface-container hover:border-dark-muted/50 transition-colors">
 <div className="flex items-center gap-3">
 <div className="w-6 h-6 rounded bg-emerald-900/50 -secondary flex items-center justify-center text-xs font-medium">1</div>
 <span className="font-medium text-on-surface">Sac Kesimi</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="-secondary font-medium text-sm">150 TL / seans</span>
 <div className="flex gap-2">
 <button className="w-8 h-8 rounded bg-sidebar border border-dark-border flex items-center justify-center text-dark-muted hover:text-on-surface transition-colors">
 <i className="fa-solid fa-pen text-xs"></i>
 </button>
 <button className="w-8 h-8 rounded bg-red-900/20 border border-red-900/30 flex items-center justify-center -tertiary hover:bg-red-900/40 transition-colors">
 <i className="fa-solid fa-trash-can text-xs"></i>
 </button>
 </div>
 </div>
 </div>

 {/* Service Item 2 */}
 <div className="flex items-center justify-between p-3 rounded-lg border border-dark-border bg-surface-container hover:border-dark-muted/50 transition-colors">
 <div className="flex items-center gap-3">
 <div className="w-6 h-6 rounded bg-emerald-900/50 -secondary flex items-center justify-center text-xs font-medium">2</div>
 <span className="font-medium text-on-surface">Sac Boyama</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="-secondary font-medium text-sm">300 TL / seans</span>
 <div className="flex gap-2">
 <button className="w-8 h-8 rounded bg-sidebar border border-dark-border flex items-center justify-center text-dark-muted hover:text-on-surface transition-colors">
 <i className="fa-solid fa-pen text-xs"></i>
 </button>
 <button className="w-8 h-8 rounded bg-red-900/20 border border-red-900/30 flex items-center justify-center -tertiary hover:bg-red-900/40 transition-colors">
 <i className="fa-solid fa-trash-can text-xs"></i>
 </button>
 </div>
 </div>
 </div>

 {/* Service Item 3 */}
 <div className="flex items-center justify-between p-3 rounded-lg border border-dark-border bg-surface-container hover:border-dark-muted/50 transition-colors">
 <div className="flex items-center gap-3">
 <div className="w-6 h-6 rounded bg-emerald-900/50 -secondary flex items-center justify-center text-xs font-medium">3</div>
 <span className="font-medium text-on-surface">Fon Teknik</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="-secondary font-medium text-sm">500 TL / seans</span>
 <div className="flex gap-2">
 <button className="w-8 h-8 rounded bg-sidebar border border-dark-border flex items-center justify-center text-dark-muted hover:text-on-surface transition-colors">
 <i className="fa-solid fa-pen text-xs"></i>
 </button>
 <button className="w-8 h-8 rounded bg-red-900/20 border border-red-900/30 flex items-center justify-center -tertiary hover:bg-red-900/40 transition-colors">
 <i className="fa-solid fa-trash-can text-xs"></i>
 </button>
 </div>
 </div>
 </div>

 {/* Add New Service Button */}
 <button className="w-full py-4 mt-2 rounded-lg border border-dashed -secondary/50 -secondary/5 -secondary font-medium hover:-secondary/10 transition-colors flex items-center justify-center gap-2">
 <i className="fa-solid fa-plus"></i>
 Hizmet Ekle (3/10)
 </button>
 </div>
 
 <div className="mt-6 flex items-center gap-2 text-xs text-dark-muted border-t border-dark-border pt-4">
 <i className="fa-solid fa-circle-info"></i>
 Maksimum 10 hizmet ekleyebilirsiniz. 3 hizmet aktif.
 </div>
 </div>
 </div>
 {/* END: Left Column */}

 {/* BEGIN: Right Column (Add/Edit Form) */}
 <div className="lg:col-span-7">
 <div className="bg-dark-card border border-dark-border rounded-xl p-6 h-full flex flex-col">
 <div className="mb-6">
 <h2 className="text-lg font-semibold text-on-surface mb-1">Hizmet Ekle / Düzenle</h2>
 <p className="text-sm text-dark-muted">Hizmet bilgilerini girin ve kaydedin.</p>
 </div>
 
 <form className="flex-1 space-y-5">
 {/* Hizmet Adı */}
 <div>
 <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="serviceName">Hizmet Adı</label>
 <input 
 className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-black focus:outline-none focus:ring-1 focus:ring-emerald-500" 
 id="serviceName" 
 type="text" 
 defaultValue="Sac Kesimi" 
 onFocus={(e) => {
   if (e.target.value === "Sac Kesimi") e.target.value = "";
 }}
 />
 </div>

 {/* Fiyat */}
 <div>
 <label className="block text-sm font-medium text-on-surface mb-2">Fiyat</label>
 <div className="flex items-center gap-3">
 <div className="flex-1">
 <input 
 className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2.5 text-black focus:outline-none focus:ring-1 focus:ring-emerald-500" 
 type="text" 
 defaultValue="150" 
 onFocus={(e) => {
   if (e.target.value === "150") e.target.value = "";
 }}
 />
 </div>
 <div className="w-32">
 <div className="relative">
 <select className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-10 py-2.5 text-black appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500" defaultValue="TL">
 <option value="TL">TL</option>
 <option value="USD">USD</option>
 <option value="EUR">EUR</option>
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-muted">
 <i className="fa-solid fa-chevron-down text-xs"></i>
 </div>
 </div>
 </div>
 <span className="text-dark-muted">/</span>
 <div className="w-40">
 <div className="relative">
 <select className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-10 py-2.5 text-black appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500" defaultValue="seans">
 <option value="seans">seans</option>
 <option value="saat">saat</option>
 <option value="adet">adet</option>
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-muted">
 <i className="fa-solid fa-chevron-down text-xs"></i>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Açıklama */}
 <div>
 <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="description">
 Açıklama <span className="text-dark-muted font-normal">(İsteğe bağlı)</span>
 </label>
 <div className="relative">
 <textarea 
 className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-black placeholder-dark-muted/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" 
 id="description" 
 placeholder="Hizmet hakkında kısa açıklama girin..." 
 rows={3}
 onFocus={(e) => e.target.value = ""}
 ></textarea>
 <div className="absolute bottom-3 right-3 text-xs text-dark-muted">0 / 250</div>
 </div>
 </div>

 {/* Tahmini Süre */}
 <div>
 <label className="block text-sm font-medium text-on-surface mb-2">Tahmini Süre</label>
 <div className="relative">
 <select className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-10 py-2.5 text-black appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500" defaultValue="30 dakika">
 <option value="30 dakika">30 dakika</option>
 <option value="45 dakika">45 dakika</option>
 <option value="60 dakika">60 dakika</option>
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-muted">
 <i className="fa-solid fa-chevron-down text-sm"></i>
 </div>
 </div>
 </div>

 {/* Hizmet Rengi */}
 <div>
 <label className="block text-sm font-medium text-on-surface mb-3">Hizmet Rengi</label>
 <div className="flex gap-4">
 {/* Selected Color */}
 <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center ring-2 ring-offset-2 ring-offset-dark-card ring-white focus:outline-none" type="button">
 <i className="fa-solid fa-check text-on-surface text-xs"></i>
 </button>
 <button className="w-8 h-8 rounded-full bg-primary focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-primary focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#FBBF24] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#F97316] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#EF4444] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#06B6D4] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#EC4899] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 <button className="w-8 h-8 rounded-full bg-[#9CA3AF] focus:outline-none hover:scale-110 transition-transform" type="button"></button>
 </div>
 </div>

 {/* Form Visibility Toggle */}
 <div className="flex items-center justify-between pt-4 border-t border-dark-border">
 <div>
 <h3 className="text-sm font-medium text-on-surface mb-1">Hizmet Görünürlüğü</h3>
 <p className="text-xs text-dark-muted">Müşterileriniz randevu alırken hizmeti görebilir.</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer ml-2">
 <input defaultChecked className="sr-only peer" name="toggle" type="checkbox" />
 <div className="w-11 h-6 bg-[#2A2E39] rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:-secondary"></div>
 </label>
 </div>
 </form>

 {/* Form Actions */}
 <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
 <button className="px-6 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-on-surface hover:bg-app-border/50 transition-colors text-sm font-medium" type="button">
 İptal
 </button>
 <button className="px-6 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-on-surface hover:bg-app-border/50 transition-colors text-sm font-medium" type="button">
 Temizle
 </button>
 <button className="px-6 py-2.5 rounded-lg -secondary text-on-surface hover:-secondary transition-colors text-sm font-medium flex items-center gap-2" type="button">
 <i className="fa-regular fa-floppy-disk"></i>
 Kaydet
 </button>
 </div>
 </div>
 </div>
 {/* END: Right Column */}
 </div>
 </div>
 );
}
