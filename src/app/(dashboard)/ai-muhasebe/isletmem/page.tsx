import Link from 'next/link';
import styles from './page.module.css';

export default function IsletmemPage() {
 return (
 <div className="flex-1 flex flex-col h-full overflow-hidden" data-purpose="main-content">
 {/* BEGIN: Header */}
 <div className="px-8 py-6 flex items-center justify-between flex-shrink-0" data-purpose="page-header">
 <div>
 <h1 className="text-2xl font-bold text-[#E2E8F0]">İşletmem</h1>
 <p className="text-on-surface-variant text-sm mt-1">İşletmenizin finansal durumunu takip edin.</p>
 </div>
 <div className="flex items-center gap-4">
 {/* Notifications */}
 <button className="relative p-2.5 rounded-xl bg-[#1A1C21] border border-[#2A2F3A] text-on-surface-variant hover:text-[#E2E8F0] transition-colors">
 <i className="fa-regular fa-bell"></i>
 <span className="absolute -top-1 -right-1 bg-[#22C55E] text-[#0F1115] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0F1115]">3</span>
 </button>
 
 {/* Date Picker */}
 <div className="flex items-center gap-3 bg-[#1A1C21] border border-[#2A2F3A] rounded-xl px-4 py-2.5 cursor-pointer hover:bg-[#23262D] transition-colors">
 <span className="text-sm text-[#E2E8F0] font-medium">Bugün: 03 Temmuz 2026</span>
 <i className="fa-regular fa-calendar text-on-surface-variant"></i>
 </div>
 
 {/* Settings */}
 <button className="p-2.5 rounded-xl bg-[#1A1C21] border border-[#2A2F3A] text-on-surface-variant hover:text-[#E2E8F0] transition-colors">
 <i className="fa-solid fa-gear"></i>
 </button>
 </div>
 </div>
 {/* END: Header */}

 {/* BEGIN: Dashboard Content Scrollable Area */}
 <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6" data-purpose="dashboard-content">
 {/* Date Filters */}
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 bg-[#22C55E] text-[#0F1115] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16A34A] transition-colors">
 Haziran 2026
 <i className="fa-solid fa-chevron-down text-xs"></i>
 </button>
 <button className="flex items-center gap-2 bg-[#1A1C21] text-on-surface-variant border border-[#2A2F3A] px-4 py-2 rounded-lg text-sm font-medium hover:text-[#E2E8F0] hover:bg-[#23262D] transition-colors">
 Eylül 2022
 </button>
 </div>

 {/* BEGIN: Main Balance Card */}
 <div className="bg-[#1A1C21] border border-[#22C55E]/30 rounded-2xl p-6 relative overflow-hidden" data-purpose="balance-card">
 {/* Background Glow */}
 <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/5 to-transparent pointer-events-none"></div>
 
 <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
 {/* Balance Info */}
 <div className="flex-1">
 <h2 className="text-on-surface-variant text-sm font-medium tracking-wide mb-2 uppercase">TOPLAM BAKİYE</h2>
 <div className="text-5xl font-bold text-[#22C55E] mb-4 tracking-tight">₺-5.900,00</div>
 <div className="flex items-center gap-2 text-[#EF4444] text-sm font-medium">
 <i className="fa-solid fa-arrow-trend-down"></i>
 <span>Geçen aya göre %4.2 düşüş</span>
 </div>
 </div>
 
 {/* Chart Area */}
 <div className="w-full lg:w-2/3 h-40 relative">
 {/* Grid Lines */}
 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
 <div className="border-t border-[#2A2F3A] border-dashed w-full"></div>
 <div className="border-t border-[#2A2F3A] border-dashed w-full"></div>
 <div className="border-t border-[#2A2F3A] border-dashed w-full"></div>
 <div className="border-t border-[#2A2F3A] border-dashed w-full"></div>
 <div className="border-t border-[#2A2F3A] border-dashed w-full"></div>
 </div>
 
 {/* Y-Axis Labels */}
 <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-on-surface-variant text-right pr-2 font-mono pb-1 z-20 bg-[#1A1C21]/80 pl-2">
 <span>₺4.000</span>
 <span>₺0</span>
 <span>-₺4.000</span>
 <span>-₺8.000</span>
 <span>-₺12.000</span>
 </div>
 
 {/* SVG Chart */}
 <svg className="w-full h-full relative z-10 pr-12" preserveAspectRatio="none" viewBox="0 0 500 150">
 <defs>
 <linearGradient id="gradientLine" x1="0%" x2="100%" y1="0%" y2="0%">
 <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3"></stop>
 <stop offset="50%" stopColor="#22C55E" stopOpacity="1"></stop>
 <stop offset="100%" stopColor="#22C55E" stopOpacity="1"></stop>
 </linearGradient>
 <linearGradient id="fillGradient" x1="0%" x2="0%" y1="0%" y2="100%">
 <stop offset="0%" stopColor="#22C55E" stopOpacity="0.2"></stop>
 <stop offset="100%" stopColor="#22C55E" stopOpacity="0"></stop>
 </linearGradient>
 </defs>
 {/* Fill Area */}
 <path d="M0 80 Q 40 90, 80 85 T 160 55 T 240 60 T 320 20 T 400 30 T 480 130 L 480 150 L 0 150 Z" fill="url(#fillGradient)"></path>
 {/* Line */}
 <path className={styles.chartPath} d="M0 80 Q 40 90, 80 85 T 160 55 T 240 60 T 320 20 T 400 30 T 480 130" fill="none" stroke="url(#gradientLine)" strokeLinecap="round" strokeWidth="2.5"></path>
 {/* End Dot */}
 <circle cx="480" cy="130" fill="#22C55E" r="4"></circle>
 </svg>
 </div>
 </div>
 </div>
 {/* END: Main Balance Card */}

 {/* BEGIN: Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Income Card */}
 <div className="bg-[#1A1C21] border border-[#2A2F3A] rounded-2xl p-6 flex items-center justify-between" data-purpose="income-card">
 <div>
 <h3 className="text-on-surface-variant text-sm font-medium mb-1">Gelirler</h3>
 <div className="text-3xl font-bold text-[#22C55E]">₺0,00</div>
 </div>
 <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
 <i className="fa-solid fa-arrow-trend-up text-xl"></i>
 </div>
 </div>
 
 {/* Expense Card */}
 <div className="bg-[#1A1C21] border border-[#2A2F3A] rounded-2xl p-6 flex items-center justify-between" data-purpose="expense-card">
 <div>
 <h3 className="text-on-surface-variant text-sm font-medium mb-1">Giderler</h3>
 <div className="text-3xl font-bold text-[#EF4444]">₺5.900,00</div>
 </div>
 <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
 <i className="fa-solid fa-arrow-trend-down text-xl"></i>
 </div>
 </div>
 </div>
 {/* END: Summary Cards */}

 {/* BEGIN: Tabs and Filters */}
 <div className="flex items-center justify-between border-b border-[#2A2F3A] pt-2" data-purpose="tabs-section">
 <div className="flex items-center gap-6">
 <button className="pb-3 text-sm font-medium text-[#22C55E] border-b-2 border-[#22C55E]">Gelirler</button>
 <button className="pb-3 text-sm font-medium text-on-surface-variant hover:text-[#E2E8F0] transition-colors">Giderler</button>
 <button className="pb-3 text-sm font-medium text-on-surface-variant hover:text-[#E2E8F0] transition-colors">Faturalar</button>
 </div>
 <div className="flex items-center gap-3 pb-2">
 <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1C21] border border-[#2A2F3A] rounded-lg text-sm text-on-surface-variant hover:text-[#E2E8F0] hover:bg-[#23262D] transition-colors">
 <i className="fa-solid fa-filter text-xs"></i>
 Filtrele
 </button>
 <div className="relative">
 <input className="bg-[#1A1C21] border border-[#2A2F3A] rounded-lg pl-4 pr-10 py-2 text-sm text-[#E2E8F0] placeholder-[#94A3B8] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] w-64" placeholder="Ara..." type="text"/>
 <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"></i>
 </div>
 <button className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-lg text-sm font-medium hover:bg-[#22C55E]/30 transition-colors">
 <i className="fa-solid fa-plus text-xs"></i>
 Yeni Ekle
 </button>
 </div>
 </div>
 {/* END: Tabs and Filters */}

 {/* BEGIN: Empty State */}
 <div className="bg-[#1A1C21] border border-[#2A2F3A] rounded-2xl flex flex-col items-center justify-center py-20" data-purpose="empty-state">
 <div className="text-on-surface-variant mb-4 opacity-50 relative">
 {/* Sparkles */}
 <i className="fa-solid fa-sparkles absolute -top-4 -right-4 text-xs"></i>
 <i className="fa-solid fa-sparkles absolute -top-2 right-2 text-[10px]"></i>
 {/* Box Icon */}
 <svg fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="48">
 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
 <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
 <line x1="12" x2="12" y1="22.08" y2="12"></line>
 <path d="M7 11V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6"></path>
 </svg>
 </div>
 <p className="text-on-surface-variant text-sm">Bu kategori için kayıt bulunamadı.</p>
 </div>
 {/* END: Empty State */}

 {/* BEGIN: Smart Analysis */}
 <div className="bg-[#1A1C21] border border-[#2A2F3A] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-purpose="smart-analysis">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-xl bg-[#11241C] flex items-center justify-center text-[#22C55E] shrink-0 border border-[#1A3828]">
 <i className="fa-solid fa-chart-line"></i>
 </div>
 <div>
 <h3 className="text-[#22C55E] font-medium text-lg mb-2">Akıllı Analiz</h3>
 <div className="flex items-center gap-2 text-on-surface-variant text-sm border-l-2 border-[#22C55E] pl-3 py-0.5">
 <span>Analiz alınamadı.</span>
 </div>
 </div>
 </div>
 <button className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#2A2F3A] rounded-xl text-[#22C55E] text-sm font-medium hover:bg-[#23262D] hover:border-[#22C55E]/50 transition-colors">
 <i className="fa-solid fa-wand-magic-sparkles"></i>
 Analiz Oluştur
 </button>
 </div>
 {/* END: Smart Analysis */}
 </div>
 </div>
 );
}

