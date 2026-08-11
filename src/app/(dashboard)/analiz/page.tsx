import Link from 'next/link';
import styles from './page.module.css';

export default function AnalizPage() {
 return (
 <div className={`flex-1 flex flex-col overflow-hidden ${styles.customScrollbar} text-sm h-full`}>
 {/* Scrollable Content Area */}
 <div className="flex-1 overflow-y-auto p-8 space-y-6">
 
 {/* Page Title (Added since global header is omitted) */}
 <h1 className="text-2xl font-semibold text-on-surface mb-6">Analiz (Canlı)</h1>

 {/* Tabs & Filters */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 {/* Tabs */}
 <div className="flex p-1 bg-surface-container rounded-lg border border-outline-variant/10 w-max">
 <Link href="/analiz" className="px-6 py-2 rounded-md text-sm font-medium bg-primary/20 text-primary border border-primary/30 transition-colors">
 Gönderi Analizi
 </Link>
 <Link href="/analiz/gelen-mesaj-analizi" className="px-6 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
 Gelen Mesaj Analizi
 </Link>
 </div>
 {/* Filter Row */}
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

 {/* Top Metrics Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Card 1 */}
 <div className="bg-surface-container border border-secondary/20 rounded-xl p-5 relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none"></div>
 <div className="flex items-start space-x-4 relative z-10">
 <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
 <i className="fa-regular fa-paper-plane text-xl"></i>
 </div>
 <div>
 <div className="text-on-surface-variant text-sm mb-1">Toplam Gönderi</div>
 <div className="flex items-baseline space-x-2">
 <span className="text-2xl font-semibold text-on-surface">0</span>
 <span className="text-secondary text-xs font-medium">%0</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Önceki 30 güne göre</div>
 </div>
 </div>
 </div>

 {/* Card 2 */}
 <div className="bg-surface-container border border-primary/20 rounded-xl p-5 relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
 <div className="flex items-start space-x-4 relative z-10">
 <div className="p-3 bg-primary/10 rounded-lg text-primary">
 <i className="fa-regular fa-comment-dots text-xl"></i>
 </div>
 <div>
 <div className="text-on-surface-variant text-sm mb-1">Toplam Yorum</div>
 <div className="flex items-baseline space-x-2">
 <span className="text-2xl font-semibold text-on-surface">0</span>
 <span className="text-primary text-xs font-medium">%0</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Önceki 30 güne göre</div>
 </div>
 </div>
 </div>

 {/* Card 3 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
 <div className="flex items-start space-x-4">
 <div className="p-3 -primary/10 rounded-lg -primary">
 <i className="fa-solid fa-user-group text-xl"></i>
 </div>
 <div>
 <div className="text-on-surface-variant text-sm mb-1">Toplam Takipçi</div>
 <div className="text-2xl font-semibold text-on-surface mb-1">--</div>
 <div className="text-xs text-on-surface-variant">Veri yok</div>
 </div>
 </div>
 </div>

 {/* Card 4 */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
 <div className="flex items-start space-x-4">
 <div className="p-3 -primary/10 rounded-lg -primary">
 <i className="fa-solid fa-clipboard-list text-xl"></i>
 </div>
 <div>
 <div className="text-on-surface-variant text-sm mb-1">Değerlendirmeler</div>
 <div className="flex items-baseline space-x-2">
 <span className="text-2xl font-semibold text-on-surface">0</span>
 <span className="text-primary text-xs font-medium">%0</span>
 </div>
 <div className="text-xs text-on-surface-variant mt-1">Önceki 30 güne göre</div>
 </div>
 </div>
 </div>
 </div>

 {/* Main Chart Area */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
 <div className="flex justify-between items-center mb-6 text-on-surface">
 <div className="flex items-center space-x-2">
 <h2 className="text-lg font-medium text-on-surface">Etkileşim / Gösterim</h2>
 <i className="fa-regular fa-circle-question text-on-surface-variant text-xs"></i>
 </div>
 <div className="flex items-center space-x-6">
 <div className="flex items-center space-x-4 text-sm">
 <div className="flex items-center">
 <span className="w-2.5 h-2.5 rounded-full bg-secondary mr-2"></span>
 Views
 </div>
 <div className="flex items-center">
 <span className="w-2.5 h-2.5 rounded-full bg-primary mr-2"></span>
 Likes
 </div>
 </div>
 <button className="flex items-center px-3 py-1.5 border border-outline-variant/10 rounded-lg text-sm hover:bg-surface-container-high transition-colors text-on-surface">
 Günlük
 <i className="fa-solid fa-chevron-down ml-2 text-xs text-on-surface-variant"></i>
 </button>
 </div>
 </div>
 <div className="text-xs text-on-surface-variant mb-4">Zaman içindeki değişim grafiği</div>
 
 {/* Chart Placeholder */}
 <div className="relative h-64 border-l border-b border-outline-variant/10 flex flex-col justify-between pt-4 pb-1 pl-2">
 {/* Y Axis Labels */}
 <div className="absolute left-[-20px] top-0 bottom-8 flex flex-col justify-between text-xs text-on-surface-variant h-full py-2">
 <span>1</span>
 <span>0.5</span>
 <span>0</span>
 </div>
 {/* Empty State */}
 <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant">
 <i className="fa-solid fa-chart-line text-4xl mb-3 opacity-50"></i>
 <p>Bu aralık için yeterli grafik verisi yok.</p>
 </div>
 {/* Grid Lines (Horizontal) */}
 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
 <div className="border-t border-white w-full h-0"></div>
 <div className="border-t border-white w-full h-0"></div>
 <div className="border-t border-white w-full h-0"></div>
 </div>
 {/* X Axis Labels */}
 <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-on-surface-variant px-4">
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
 </div>

 {/* Platform Overview */}
 <div>
 <h2 className="text-lg font-medium text-on-surface mb-4">Platformlara Genel Bakış</h2>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 {/* Instagram */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 bg-gradient-to-tr -tertiary -tertiary -primary rounded-xl p-[2px]">
 <div className="bg-surface-container w-full h-full rounded-[10px] flex items-center justify-center">
 <i className="fa-brands fa-instagram text-2xl text-transparent bg-clip-text bg-gradient-to-tr -tertiary -tertiary -primary"></i>
 </div>
 </div>
 <div>
 <div className="font-medium text-on-surface">Instagram</div>
 <div className="flex items-center text-xs -secondary mt-1">
 <span className="w-1.5 h-1.5 -secondary rounded-full mr-1.5"></span>
 Aktif
 </div>
 </div>
 </div>
 <div className="flex space-x-8 text-center">
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Gönderi</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Yorum</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Beğeni</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Takipçi</div>
 </div>
 </div>
 </div>

 {/* Web/Blog */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 -secondary/10 rounded-xl flex items-center justify-center -secondary">
 <i className="fa-solid fa-building text-2xl"></i>
 </div>
 <div>
 <div className="font-medium text-on-surface">Web / Blog</div>
 <div className="flex items-center text-xs -secondary mt-1">
 <span className="w-1.5 h-1.5 -secondary rounded-full mr-1.5"></span>
 Aktif
 </div>
 </div>
 </div>
 <div className="flex space-x-8 text-center">
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Gönderi</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Yorum</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Beğeni</div>
 </div>
 <div>
 <div className="text-lg font-semibold text-on-surface">0</div>
 <div className="text-xs text-on-surface-variant">Takipçi</div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom Tables Section */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
 {/* Gönderi Performansı */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
 <h3 className="font-medium text-on-surface mb-4">Gönderi Performansı</h3>
 <div className="grid grid-cols-6 gap-2 text-xs text-on-surface-variant border-b border-outline-variant/10 pb-2 mb-8">
 <div>Gönderi</div>
 <div>Platform</div>
 <div>Tarih</div>
 <div>Gösterim</div>
 <div>Beğeni</div>
 <div>Yorum</div>
 </div>
 <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
 <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-3">
 <i className="fa-solid fa-table-cells text-xl"></i>
 </div>
 <p className="text-sm">Bu aralıkta gönderi bulunamadı.</p>
 </div>
 </div>

 {/* En Çok Etkileşim Alan Gönderiler */}
 <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5">
 <div className="flex justify-between items-center mb-4">
 <h3 className="font-medium text-on-surface">En Çok Etkileşim Alan Gönderiler</h3>
 <button className="px-3 py-1 text-xs border border-outline-variant/10 text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">Tümünü Gör</button>
 </div>
 <div className="grid grid-cols-5 gap-2 text-xs text-on-surface-variant border-b border-outline-variant/10 pb-2 mb-8">
 <div>Gönderi</div>
 <div>Platform</div>
 <div>Etkileşim</div>
 <div>Gösterim</div>
 <div>Oran</div>
 </div>
 <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
 <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-3">
 <i className="fa-solid fa-trophy text-xl"></i>
 </div>
 <p className="text-sm">Bu aralıkta veri bulunamadı.</p>
 </div>
 </div>
 </div>

 </div>
 </div>
 );
}





