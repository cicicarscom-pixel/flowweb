import Link from 'next/link';
import styles from './page.module.css';

export default function GelenMesajAnaliziPage() {
 return (
 <div className={`flex-1 flex flex-col h-full bg-surface-container ${styles.customScrollbar}`}>
 <div className="flex-1 overflow-y-auto p-8 space-y-6">
 
 <h1 className="text-2xl font-semibold text-on-surface mb-6">Analiz (Canlı)</h1>

 {/* Filter Bar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 {/* Tabs */}
 <div className="flex p-1 bg-surface-container rounded-lg border border-outline-variant/10 w-max">
 <Link href="/analiz" className="px-6 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
 Gönderi Analizi
 </Link>
 <Link href="/analiz/gelen-mesaj-analizi" className="px-6 py-2 rounded-md text-sm font-medium bg-primary/20 text-primary border border-primary/30 transition-colors">
 Gelen Mesaj Analizi
 </Link>
 </div>
 {/* Controls */}
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/10 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
 <i className="fa-solid fa-globe w-4 h-4 flex items-center justify-center"></i>
 Tüm platformlar
 <i className="fa-solid fa-chevron-down w-4 h-4 ml-2 flex items-center justify-center"></i>
 </button>
 <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/10 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
 <i className="fa-regular fa-calendar w-4 h-4 flex items-center justify-center"></i>
 Son 30 gün
 <i className="fa-solid fa-chevron-down w-4 h-4 ml-2 flex items-center justify-center"></i>
 </button>
 <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/10 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
 <i className="fa-solid fa-download w-4 h-4 flex items-center justify-center"></i>
 Dışa Aktar
 </button>
 </div>
 </div>

 {/* Metric Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {/* Card 1: Alınan */}
 <div className={`bg-surface-container border border-outline-variant/10 rounded-xl p-5 flex items-start gap-4 ${styles.glowBorder}`}>
 <div className="p-3 bg-primary/10 rounded-lg text-primary relative z-10">
 <i className="fa-solid fa-inbox w-6 h-6 flex items-center justify-center"></i>
 </div>
 <div className="relative z-10">
 <div className="text-sm text-on-surface-variant mb-1">Alınan</div>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-on-surface">2</span>
 <span className="text-xs -secondary mb-1">%100</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Toplam mesaj</div>
 </div>
 </div>
 {/* Card 2: Gönderilen */}
 <div className="bg-surface-container border border-cyan-500/30 rounded-xl p-5 flex items-start gap-4">
 <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 relative">
 <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-lg"></div>
 <i className="fa-solid fa-paper-plane w-6 h-6 relative z-10 flex items-center justify-center"></i>
 </div>
 <div>
 <div className="text-sm text-on-surface-variant mb-1">Gönderilen</div>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-on-surface">0</span>
 <span className="text-xs text-on-surface-variant mb-1">%0</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Toplam mesaj</div>
 </div>
 </div>
 {/* Card 3: Okunan */}
 <div className="bg-surface-container border -primary/30 rounded-xl p-5 flex items-start gap-4">
 <div className="p-3 -primary/10 rounded-lg -primary relative">
 <div className="absolute inset-0 -primary/20 blur-md rounded-lg"></div>
 <i className="fa-regular fa-eye w-6 h-6 relative z-10 flex items-center justify-center"></i>
 </div>
 <div>
 <div className="text-sm text-on-surface-variant mb-1">Okunan</div>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-on-surface">--</span>
 <span className="text-xs text-on-surface-variant mb-1">%0</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Veri yok</div>
 </div>
 </div>
 {/* Card 4: Ortalama Yanıt */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5 flex items-start gap-4">
 <div className="p-3 -primary/10 rounded-lg -primary">
 <i className="fa-regular fa-clock w-6 h-6 flex items-center justify-center"></i>
 </div>
 <div>
 <div className="text-sm text-on-surface-variant mb-1">Ortalama Yanıt</div>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-bold text-on-surface">12 dk</span>
 <span className="text-xs text-on-surface-variant mb-1">%-</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Ortalama süre</div>
 </div>
 </div>
 </div>

 {/* Analysis Row 1 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-6">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="text-lg font-semibold text-on-surface">Yanıt Süresi Analizi</h2>
 <p className="text-sm text-on-surface-variant mt-1">Müşteri mesajına ilk yanıtın verilme süresi</p>
 </div>
 <button className="flex items-center gap-2 px-3 py-1.5 bg-outline-variant border border-outline-variant/10 rounded-md text-sm text-on-surface-variant hover:text-on-surface transition-colors">
 Günlük
 <i className="fa-solid fa-chevron-down w-4 h-4 flex items-center justify-center"></i>
 </button>
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
 {/* Gauge Chart Area */}
 <div className="lg:col-span-1 flex flex-col items-center justify-center">
 <div className="relative w-48 h-48">
 <div className="absolute inset-0 rounded-full border-[12px] border-cyan-500/20 blur-sm"></div>
 <div className="absolute inset-2 rounded-full border-[8px] border-outline-variant/10"></div>
 <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] -rotate-90 transform">
 <circle className="text-cyan-400" cx="50%" cy="50%" fill="none" r="48%" stroke="currentColor" strokeDasharray="300" strokeDashoffset="50" strokeLinecap="round" strokeWidth="8"></circle>
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
 <span className="text-4xl font-bold text-on-surface">12 dk</span>
 <span className="text-xs text-on-surface-variant mt-1">Ortalama Yanıt Süresi</span>
 </div>
 </div>
 </div>
 {/* Line Chart Area (Skeleton) */}
 <div className="lg:col-span-3">
 <div className="flex items-center gap-2 mb-4">
 <span className="text-sm text-on-surface">Günlere Göre Ortalama Yanıt Süresi</span>
 <i className="fa-solid fa-circle-info w-4 h-4 text-on-surface-variant"></i>
 </div>
 <div className="h-48 w-full relative border-l border-b border-outline-variant/10/50 flex items-end">
 {/* Mock Line Chart SVG Skeleton */}
 <svg viewBox="0 0 1000 200" className="w-full h-full opacity-50 text-primary" preserveAspectRatio="none">
 <path d="M0,100 L100,80 L200,90 L300,50 L400,120 L500,70 L600,90 L700,80 L800,20 L900,100 L1000,50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
 <circle cx="0" cy="100" r="4" fill="currentColor"/>
 <circle cx="100" cy="80" r="4" fill="currentColor"/>
 <circle cx="200" cy="90" r="4" fill="currentColor"/>
 <circle cx="300" cy="50" r="4" fill="currentColor"/>
 <circle cx="400" cy="120" r="4" fill="currentColor"/>
 <circle cx="500" cy="70" r="4" fill="currentColor"/>
 <circle cx="600" cy="90" r="4" fill="currentColor"/>
 <circle cx="700" cy="80" r="4" fill="currentColor"/>
 <circle cx="800" cy="20" r="4" fill="currentColor"/>
 <circle cx="900" cy="100" r="4" fill="currentColor"/>
 <circle cx="1000" cy="50" r="4" fill="currentColor"/>
 </svg>
 {/* X Axis Mock Labels */}
 <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-on-surface-variant">
 <span>23 Nis</span>
 <span>26 Nis</span>
 <span>29 Nis</span>
 <span>2 May</span>
 <span>5 May</span>
 <span>8 May</span>
 <span>11 May</span>
 <span>14 May</span>
 <span>17 May</span>
 <span>20 May</span>
 <span>22 May</span>
 </div>
 </div>
 <div className="flex justify-center mt-8">
 <div className="flex items-center gap-2 text-xs text-on-surface-variant">
 <span className="w-4 h-1 bg-primary rounded-full"></span>
 Ortalama Yanıt Süresi (dk)
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Analysis Row 2 */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Platform Distribution */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-6 flex flex-col h-full">
 <h2 className="text-lg font-semibold text-on-surface mb-6">Platform Dağılımı</h2>
 <div className="flex-1 flex items-center justify-center gap-8">
 {/* Donut Chart (Skeleton) */}
 <div className="relative w-48 h-48 flex-shrink-0">
 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
 <path
 className="-primary"
 d="M18 2.0845
 a 15.9155 15.9155 0 0 1 0 31.831
 a 15.9155 15.9155 0 0 1 0 -31.831"
 fill="none"
 stroke="currentColor"
 strokeWidth="4"
 strokeDasharray="50, 100"
 />
 <path
 className="text-primary"
 d="M18 2.0845
 a 15.9155 15.9155 0 0 1 0 31.831
 a 15.9155 15.9155 0 0 1 0 -31.831"
 fill="none"
 stroke="currentColor"
 strokeWidth="4"
 strokeDasharray="50, 100"
 strokeDashoffset="-50"
 />
 </svg>
 {/* Center Text */}
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
 <span className="text-sm text-on-surface-variant">Toplam</span>
 <span className="text-3xl font-bold text-on-surface">2</span>
 </div>
 </div>
 {/* Legend */}
 <div className="flex-1 space-y-4">
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
 <span className="text-on-surface">WhatsApp</span>
 </div>
 <div className="text-on-surface-variant">1 (%50)</div>
 </div>
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full -primary"></span>
 <span className="text-on-surface">Web Canlı Destek</span>
 </div>
 <div className="text-on-surface-variant">1 (%50)</div>
 </div>
 <div className="flex items-center justify-between text-sm opacity-50">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full -tertiary"></span>
 <span className="text-on-surface">Instagram</span>
 </div>
 <div className="text-on-surface-variant">0 (%0)</div>
 </div>
 <div className="flex items-center justify-between text-sm opacity-50">
 <div className="flex items-center gap-2">
 <span className="w-2.5 h-2.5 rounded-full -secondary"></span>
 <span className="text-on-surface">Facebook</span>
 </div>
 <div className="text-on-surface-variant">0 (%0)</div>
 </div>
 </div>
 </div>
 <div className="flex justify-end mt-6">
 <button className="px-4 py-2 border border-primary/30 text-primary rounded-md text-sm hover:bg-primary/10 transition-colors">
 Detayları Gör
 </button>
 </div>
 </div>

 {/* Activity Heatmap */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-6 flex flex-col h-full">
 <h2 className="text-lg font-semibold text-on-surface mb-6">Saatlere Göre Aktivite</h2>
 <div className="flex-1 flex flex-col">
 {/* Heatmap Grid (Simulated) */}
 <div className="relative flex-1">
 {/* X Axis Labels */}
 <div className="flex justify-between pl-8 text-xs text-on-surface-variant mb-2">
 <span>00:00</span>
 <span>04:00</span>
 <span>08:00</span>
 <span>12:00</span>
 <span>16:00</span>
 <span>20:00</span>
 </div>
 {/* Grid rows */}
 <div className="space-y-1">
 {/* Row Pzt */}
 <div className="flex items-center gap-2 h-5">
 <span className="w-6 text-xs text-on-surface-variant">Pzt</span>
 <div className="flex-1 flex gap-1 h-full">
 {[...Array(24)].map((_, i) => (
 <div key={`pzt-${i}`} className="flex-1 bg-outline-variant rounded-sm"></div>
 ))}
 </div>
 </div>
 {/* Row Sal */}
 <div className="flex items-center gap-2 h-5">
 <span className="w-6 text-xs text-on-surface-variant">Sal</span>
 <div className="flex-1 flex gap-1 h-full">
 {[...Array(24)].map((_, i) => (
 <div key={`sal-${i}`} className={`flex-1 ${i === 11 ? 'bg-primary' : 'bg-outline-variant'} rounded-sm`}></div>
 ))}
 </div>
 </div>
 {/* Row Çar */}
 <div className="flex items-center gap-2 h-5">
 <span className="w-6 text-xs text-on-surface-variant">Çar</span>
 <div className="flex-1 flex gap-1 h-full">
 {[...Array(24)].map((_, i) => (
 <div key={`car-${i}`} className={`flex-1 ${i === 11 ? 'bg-primary' : 'bg-outline-variant'} rounded-sm`}></div>
 ))}
 </div>
 </div>
 {/* Row Per */}
 <div className="flex items-center gap-2 h-5">
 <span className="w-6 text-xs text-on-surface-variant">Per</span>
 <div className="flex-1 flex gap-1 h-full">
 {[...Array(24)].map((_, i) => (
 <div key={`per-${i}`} className={`flex-1 ${i === 11 ? 'bg-primary' : 'bg-outline-variant'} rounded-sm`}></div>
 ))}
 </div>
 </div>
 {/* Rows Cum, Cmt, Paz (Empty for layout) */}
 <div className="flex items-center gap-2 h-5"><span className="w-6 text-xs text-on-surface-variant">Cum</span><div className="flex-1 flex gap-1 h-full"><div className="w-full bg-outline-variant rounded-sm bg-opacity-50" style={{ background: "repeating-linear-gradient(90deg, #2a2a2c, #2a2a2c calc(4.16% - 2px), transparent calc(4.16% - 2px), transparent 4.16%)" }}></div></div></div>
 <div className="flex items-center gap-2 h-5"><span className="w-6 text-xs text-on-surface-variant">Cmt</span><div className="flex-1 flex gap-1 h-full"><div className="w-full bg-outline-variant rounded-sm bg-opacity-50" style={{ background: "repeating-linear-gradient(90deg, #2a2a2c, #2a2a2c calc(4.16% - 2px), transparent calc(4.16% - 2px), transparent 4.16%)" }}></div></div></div>
 <div className="flex items-center gap-2 h-5"><span className="w-6 text-xs text-on-surface-variant">Paz</span><div className="flex-1 flex gap-1 h-full"><div className="w-full bg-outline-variant rounded-sm bg-opacity-50" style={{ background: "repeating-linear-gradient(90deg, #2a2a2c, #2a2a2c calc(4.16% - 2px), transparent calc(4.16% - 2px), transparent 4.16%)" }}></div></div></div>
 </div>
 </div>
 {/* Bottom Legend & Button */}
 <div className="flex items-center justify-between mt-6">
 <div className="flex items-center gap-2 text-xs text-on-surface-variant">
 <span>Düşük</span>
 <div className="w-32 h-2 rounded-full bg-gradient-to-r from-outline-variant to-primary"></div>
 <span>Yüksek</span>
 </div>
 <button className="px-4 py-2 border border-primary/30 text-primary rounded-md text-sm hover:bg-primary/10 transition-colors">
 Detayları Gör
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Recent Messages Table */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-6">
 <h2 className="text-lg font-semibold text-on-surface mb-6">Son Mesajlar</h2>
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm text-on-surface-variant">
 <thead className="text-xs text-on-surface-variant border-b border-outline-variant/10/50">
 <tr>
 <th className="pb-3 font-medium" scope="col">Platform</th>
 <th className="pb-3 font-medium" scope="col">Müşteri</th>
 <th className="pb-3 font-medium" scope="col">Mesaj</th>
 <th className="pb-3 font-medium" scope="col">Tarih</th>
 <th className="pb-3 font-medium" scope="col">Durum</th>
 <th className="pb-3 font-medium" scope="col">Yanıt Süresi</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#454548]/30">
 <tr className="hover:bg-outline-variant/50 transition-colors">
 <td className="py-4">
 <div className="flex items-center gap-2">
 <div className="p-1.5 -secondary/10 rounded-md -secondary">
 <i className="fa-brands fa-whatsapp w-4 h-4 flex items-center justify-center"></i>
 </div>
 <span className="text-on-surface">WhatsApp</span>
 </div>
 </td>
 <td className="py-4 text-on-surface">Ahmet Yılmaz</td>
 <td className="py-4 max-w-xs truncate" title="Fiyat teklifi hakkında bilgi alabilir miyim?">Fiyat teklifi hakkında bilgi alabilir miyim?</td>
 <td className="py-4">22 May 2024 14:32</td>
 <td className="py-4">
 <span className="px-2 py-1 -secondary/10 -secondary border -secondary/20 rounded-md text-xs font-medium">Okundu</span>
 </td>
 <td className="py-4 text-on-surface">8 dk</td>
 </tr>
 <tr className="hover:bg-outline-variant/50 transition-colors">
 <td className="py-4">
 <div className="flex items-center gap-2">
 <div className="p-1.5 -primary/10 rounded-md -primary">
 <i className="fa-solid fa-globe w-4 h-4 flex items-center justify-center"></i>
 </div>
 <span className="text-on-surface">Web Canlı Destek</span>
 </div>
 </td>
 <td className="py-4 text-on-surface">Elif Kaya</td>
 <td className="py-4 max-w-xs truncate" title="Ürün iade süreci nasıl işliyor?">Ürün iade süreci nasıl işliyor?</td>
 <td className="py-4">22 May 2024 10:15</td>
 <td className="py-4">
 <span className="px-2 py-1 -secondary/10 -secondary border -secondary/20 rounded-md text-xs font-medium">Okundu</span>
 </td>
 <td className="py-4 text-on-surface">16 dk</td>
 </tr>
 </tbody>
 </table>
 </div>
 <div className="flex justify-end mt-4">
 <button className="px-4 py-2 border border-outline-variant/10 text-on-surface-variant rounded-md text-sm hover:text-on-surface hover:bg-outline-variant transition-colors">
 Tümünü Gör
 </button>
 </div>
 </div>
 </div>
 
 {/* Floating Chat Widget */}
 <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary text-on-surface rounded-full shadow-lg shadow-[#a855f7]/30 flex items-center justify-center transition-transform hover:scale-105 z-50">
 <i className="fa-regular fa-message w-6 h-6 flex items-center justify-center text-xl"></i>
 </button>

 </div>
 );
}
