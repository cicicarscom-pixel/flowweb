import Link from 'next/link';

export default function AiRandevuPage() {
 return (
 <div className="flex-1 overflow-y-auto p-6 flex flex-col xl:flex-row gap-6 relative">
 {/* Left Column (Calendar & Availability) */}
 <div className="flex-1 flex flex-col min-w-0">
 {/* Header Section */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <div>
 <h1 className="text-2xl font-bold text-on-surface mb-1">Randevu Oluştur</h1>
 <p className="text-app-text">Müsaitlik durumunuzu görüntüleyin ve yeni randevu oluşturun.</p>
 </div>
 <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-app-primary text-app-primary hover:bg-app-primary hover:bg-opacity-10 transition-colors whitespace-nowrap">
 <i className="fa-solid fa-rotate-left"></i>
 <span>Bugüne Dön</span>
 </button>
 </div>

 {/* Date Selector (Horizontal) */}
 <div className="mb-6">
 <div className="flex items-center gap-2 mb-4">
 <button className="w-8 h-8 flex items-center justify-center rounded bg-app-input border border-app-border text-app-text hover:text-on-surface transition-colors">
 <i className="fa-solid fa-chevron-left"></i>
 </button>
 <button className="flex items-center justify-between gap-4 px-4 py-1.5 rounded bg-app-input border border-app-border text-on-surface min-w-[150px]">
 <span>Temmuz, 2026</span>
 <i className="fa-regular fa-calendar"></i>
 </button>
 <button className="w-8 h-8 flex items-center justify-center rounded bg-app-input border border-app-border text-app-primary hover:text-app-primaryHover transition-colors">
 <i className="fa-solid fa-chevron-right"></i>
 </button>
 </div>
 <div className="flex gap-2 overflow-x-auto pb-2">
 {/* Day Cards */}
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Çar</span>
 <span className="text-xl font-bold text-on-surface">01</span>
 </button>
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Per</span>
 <span className="text-xl font-bold text-on-surface">02</span>
 </button>
 <button className="relative flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-primary bg-secondary transition-colors">
 <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-app-primary"></div>
 <span className="text-xs text-app-primary mb-1">Cum</span>
 <span className="text-xl font-bold text-on-surface">03</span>
 </button>
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Cmt</span>
 <span className="text-xl font-bold text-on-surface">04</span>
 </button>
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Paz</span>
 <span className="text-xl font-bold text-on-surface">05</span>
 </button>
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Pzt</span>
 <span className="text-xl font-bold text-on-surface">06</span>
 </button>
 <button className="flex-1 min-w-[70px] max-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl border border-app-border bg-app-input hover:bg-app-hover transition-colors">
 <span className="text-xs text-app-text mb-1">Sal</span>
 <span className="text-xl font-bold text-on-surface">07</span>
 </button>
 </div>
 </div>

 {/* Availability Grid */}
 <div className="bg-app-card rounded-xl border border-app-border flex-1 flex flex-col">
 <div className="p-4 border-b border-app-border flex justify-between items-center">
 <h2 className="font-bold text-on-surface">Günlük Müsaitlik</h2>
 <div className="flex items-center gap-4 text-xs">
 <div className="flex items-center gap-1">
 <div className="w-2.5 h-2.5 rounded-full bg-app-primary"></div>
 <span className="text-app-textLight">Dolu</span>
 </div>
 <div className="flex items-center gap-1">
 <div className="w-2.5 h-2.5 rounded-full bg-app-textDark"></div>
 <span className="text-app-textLight">Boş</span>
 </div>
 </div>
 </div>
 
 <div className="p-6 space-y-8 flex-1">
 {/* Sabah */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="w-24 shrink-0">
 <div className="font-semibold text-on-surface">Sabah</div>
 <div className="text-xs text-app-textDark">(08:00 - 12:00)</div>
 </div>
 <div className="flex-1 flex flex-wrap gap-2">
 <button className="px-4 py-2 rounded-lg bg-secondary text-on-surface border border-secondary">08:00</button>
 <button className="px-4 py-2 rounded-lg bg-secondary text-on-surface border border-secondary">08:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">09:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">09:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">10:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">10:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">11:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">11:30</button>
 </div>
 </div>

 {/* Öğle */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="w-24 shrink-0">
 <div className="font-semibold text-on-surface">Öğle</div>
 <div className="text-xs text-app-textDark">(13:00 - 17:00)</div>
 </div>
 <div className="flex-1 flex flex-wrap gap-2">
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">13:30</button>
 <button className="px-4 py-2 rounded-lg bg-secondary text-on-surface border border-secondary">14:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">14:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">15:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">15:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">16:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">16:30</button>
 </div>
 </div>

 {/* Akşam */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="w-24 shrink-0">
 <div className="font-semibold text-on-surface">Akşam</div>
 <div className="text-xs text-app-textDark">(19:00 - 22:00)</div>
 </div>
 <div className="flex-1 flex flex-wrap gap-2">
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">19:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">19:30</button>
 <button className="px-4 py-2 rounded-lg bg-secondary text-on-surface border border-secondary">20:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">20:30</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">21:00</button>
 <button className="px-4 py-2 rounded-lg bg-app-input text-app-text border border-app-border hover:border-app-text transition-colors">21:30</button>
 </div>
 </div>

 <div className="flex items-center gap-2 text-xs text-app-textDark mt-4 pt-4 border-t border-app-border border-opacity-50">
 <i className="fa-solid fa-circle-info -tertiary"></i>
 <span>Yeşil olan saatler dolu, koyu olan saatler müsaittir.</span>
 </div>

 {/* Empty State Placeholder inside Grid Area */}
 <div className="flex-1 flex flex-col items-center justify-center text-center mt-8 pb-12">
 <i className="fa-regular fa-calendar text-4xl text-app-textDark mb-4 opacity-50"></i>
 <h3 className="text-lg font-medium text-app-text mb-1">Bugün için randevu yok</h3>
 <p className="text-app-textDark">Sağ taraftan yeni randevu oluşturabilirsiniz.</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column (Form & Upcoming) */}
 <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
 {/* Appointment Details Form */}
 <div className="bg-app-card rounded-xl border border-app-border flex flex-col">
 <div className="p-4 border-b border-app-border flex items-center gap-2">
 <i className="fa-regular fa-calendar-plus text-app-primary"></i>
 <h2 className="font-bold text-on-surface">Randevu Detayları</h2>
 </div>
 <div className="p-5 space-y-4">
 {/* Tarih */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-1.5">Tarih</label>
 <div className="relative">
 <input 
 className="w-full bg-app-input border border-app-border text-on-surface rounded-lg pl-3 pr-10 py-2.5 focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none" 
 readOnly 
 type="text" 
 value="03.07.2026 (Cuma)" 
 />
 <i className="fa-regular fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-app-text"></i>
 </div>
 </div>
 
 {/* Saat */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-1.5">Saat</label>
 <div className="relative">
 <select className="w-full bg-app-input border border-app-border text-app-text rounded-lg pl-3 pr-10 py-2.5 appearance-none focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none" defaultValue="">
 <option disabled value="">Müsait bir saat seçin</option>
 <option value="09:00">09:00</option>
 <option value="10:00">10:00</option>
 </select>
 <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-app-text text-xs pointer-events-none"></i>
 </div>
 </div>

 {/* Randevu Türü */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-1.5">Randevu Türü</label>
 <div className="relative">
 <select className="w-full bg-app-input border border-app-border text-app-text rounded-lg pl-3 pr-10 py-2.5 appearance-none focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none" defaultValue="">
 <option disabled value="">Randevu türünü seçin</option>
 <option value="online">Online Görüşme</option>
 <option value="yüzyüze">Yüz Yüze Görüşme</option>
 </select>
 <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-app-text text-xs pointer-events-none"></i>
 </div>
 </div>

 {/* Kişi / Firma */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-1.5">Kişi / Firma</label>
 <input 
 className="w-full bg-app-input border border-app-border text-on-surface placeholder-app-textDark rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none" 
 placeholder="Kişi veya firma adı girin" 
 type="text" 
 />
 </div>

 {/* Açıklama */}
 <div>
 <label className="block text-sm font-medium text-app-text mb-1.5">Açıklama (Opsiyonel)</label>
 <textarea 
 className="w-full bg-app-input border border-app-border text-on-surface placeholder-app-textDark rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-app-primary focus:border-app-primary outline-none resize-none" 
 placeholder="Randevu hakkında not ekleyin..." 
 rows={3}
 ></textarea>
 </div>

 {/* Actions */}
 <div className="flex gap-3 pt-2">
 <button className="px-4 py-2.5 rounded-lg border border-app-border text-app-text hover:bg-app-hover hover:text-on-surface transition-colors w-1/3 text-center" type="button">
 Temizle
 </button>
 <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-app-primary text-on-surface hover:bg-app-primaryHover transition-colors font-medium" type="button">
 <i className="fa-solid fa-plus"></i>
 <span>Randevu Oluştur</span>
 </button>
 </div>
 </div>
 </div>

 {/* Upcoming Appointments */}
 <div className="bg-app-card rounded-xl border border-app-border flex flex-col flex-1 min-h-[250px]">
 <div className="p-4 border-b border-app-border flex items-center justify-between">
 <div className="flex items-center gap-2">
 <i className="fa-regular fa-calendar-check text-app-primary"></i>
 <h2 className="font-bold text-on-surface">Yaklaşan Randevular</h2>
 </div>
 <Link href="#" className="text-xs text-app-primary hover:underline">Tümünü Gör</Link>
 </div>
 
 <div className="p-2 space-y-1 overflow-y-auto">
 {/* Item 1 */}
 <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-app-hover group transition-colors cursor-pointer">
 <div className="w-12 h-12 rounded bg-app-input border border-app-border flex flex-col items-center justify-center shrink-0">
 <span className="text-lg font-bold text-on-surface leading-none mb-0.5">03</span>
 <span className="text-[10px] text-app-text uppercase tracking-wide">Tem</span>
 </div>
 <div className="flex-1 min-w-0">
 <div className="font-medium text-on-surface truncate">ABC Teknoloji A.Ş.</div>
 <div className="text-xs text-app-text truncate">14:00 - 15:00</div>
 </div>
 <button className="text-app-textDark hover:text-on-surface p-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <i className="fa-solid fa-ellipsis-vertical"></i>
 </button>
 </div>
 {/* Item 2 */}
 <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-app-hover group transition-colors cursor-pointer">
 <div className="w-12 h-12 rounded bg-app-input border border-app-border flex flex-col items-center justify-center shrink-0">
 <span className="text-lg font-bold text-on-surface leading-none mb-0.5">04</span>
 <span className="text-[10px] text-app-text uppercase tracking-wide">Tem</span>
 </div>
 <div className="flex-1 min-w-0">
 <div className="font-medium text-on-surface truncate">Mehmet Yılmaz</div>
 <div className="text-xs text-app-text truncate">10:30 - 11:30</div>
 </div>
 <button className="text-app-textDark hover:text-on-surface p-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <i className="fa-solid fa-ellipsis-vertical"></i>
 </button>
 </div>
 {/* Item 3 */}
 <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-app-hover group transition-colors cursor-pointer">
 <div className="w-12 h-12 rounded bg-app-input border border-app-border flex flex-col items-center justify-center shrink-0">
 <span className="text-lg font-bold text-on-surface leading-none mb-0.5">06</span>
 <span className="text-[10px] text-app-text uppercase tracking-wide">Tem</span>
 </div>
 <div className="flex-1 min-w-0">
 <div className="font-medium text-on-surface truncate">XYZ İnşaat Ltd. Şti.</div>
 <div className="text-xs text-app-text truncate">20:00 - 21:00</div>
 </div>
 <button className="text-app-textDark hover:text-on-surface p-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <i className="fa-solid fa-ellipsis-vertical"></i>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
