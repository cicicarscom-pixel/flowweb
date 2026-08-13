"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function AiAsistanPage() {
 const [selectedRole, setSelectedRole] = useState('Kebapçı');
 const [selectedChar, setSelectedChar] = useState('Albert Einstein');
 const [selectedTone, setSelectedTone] = useState('Standart');

 return (
 <div className="flex-1 overflow-y-auto p-8 scroll-hide">
 <div className="max-w-[1000px] mx-auto flex flex-col space-y-8 pb-20">
 
 {/* Header */}
 <div>
 <h1 className="text-2xl font-bold text-on-surface mb-1">Bot Karakter Yönetimi</h1>
 <p className="text-sm text-on-surface-variant">Yapay zekanın kişiliğini ve sınırlarını belirleyin</p>
 </div>

 {/* Toggles Section */}
 <section className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
 <h3 className="font-semibold text-lg text-on-surface">Ai Asistan</h3>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input defaultChecked className="sr-only peer" type="checkbox" />
 <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
 </label>
 </div>
 
 <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <span className="material-symbols-outlined text-on-surface-variant">chat</span>
 <span className="text-sm font-medium text-on-surface">WhatsApp Asistanı</span>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input defaultChecked className="sr-only peer" type="checkbox" />
 <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
 </label>
 </div>
 </section>

 {/* Instructions Section */}
 <section className="flex flex-col">
 <label className="text-sm font-semibold text-on-surface mb-3">Asistan Talimatı Oluştur</label>
 <textarea className="w-full bg-[#0b0c10] border border-outline-variant/20 rounded-xl p-4 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-[#a855f7]/50 resize-none min-h-[120px]" placeholder="Örn: Sen bir berber dükkanı asistanısın, fiyat bilgisi verip randevu alırsın..."></textarea>
 </section>

 {/* Connected Services */}
 <section className="flex flex-col space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="font-semibold text-sm text-on-surface">Bağlı Servisler</h3>
 <button className="w-8 h-8 bg-surface-container-high border border-outline-variant/20 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors">
 <span className="material-symbols-outlined text-on-surface-variant text-[18px]">settings</span>
 </button>
 </div>
 <div className="space-y-3">
 <div className="bg-[#0b0c10] border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/20">
 <span className="text-on-surface font-bold text-lg">G</span>
 </div>
 <div>
 <div className="text-sm font-medium text-on-surface">Google Drive <span className="text-on-surface-variant font-normal">(Bilgi Bankası)</span></div>
 <div className="text-xs text-rose-500 flex items-center mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></div>Bağlı değil</div>
 </div>
 </div>
 <button className="px-4 py-2 bg-surface-container-high border border-outline-variant/20 rounded-lg text-xs font-medium hover:bg-surface-container transition-colors text-on-surface">Bağla</button>
 </div>
 <div className="bg-[#0b0c10] border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between">
 <div className="flex items-center space-x-4">
 <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/20">
 <span className="material-symbols-outlined text-on-surface-variant">chat</span>
 </div>
 <div>
 <div className="text-sm font-medium text-on-surface">WhatsApp</div>
 <div className="text-xs text-rose-500 flex items-center mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></div>Bağlı değil</div>
 </div>
 </div>
 <button className="px-4 py-2 bg-surface-container-high border border-outline-variant/20 rounded-lg text-xs font-medium hover:bg-surface-container transition-colors text-on-surface">Bağla</button>
 </div>
 </div>
 </section>

 {/* AI Personality and Live Test Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Left Column: AI Personality & Advanced Settings */}
 <div className="flex flex-col space-y-6">
 {/* AI Personality */}
 <section className="bg-surface-container-high border border-primary/50 rounded-xl p-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
 <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
 <h3 className="font-semibold text-lg text-on-surface mb-6 relative">AI Kişiliği</h3>
 
 <div className="mb-6 relative">
 <label className="text-xs text-on-surface-variant mb-3 block uppercase tracking-wider flex items-center space-x-2">
 <span className="material-symbols-outlined text-[14px]">storefront</span>
 <span>İŞLETME ROLÜ</span>
 </label>
 <div className="flex flex-wrap gap-3">
 {[
 { id: 'Kebapçı', icon: '🥙' },
 { id: 'Berber', icon: '💈' },
 { id: 'Oto Tamir', icon: '🔧' }
 ].map(role => (
 <button 
 key={role.id}
 onClick={() => setSelectedRole(role.id)}
 className={`px-4 py-2 border rounded-full text-sm transition-colors flex items-center gap-2 ${
 selectedRole === role.id 
 ? 'bg-primary/20 border-primary text-primary' 
 : 'bg-[#0b0c10] hover:bg-outline-variant/20 border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
 }`}
 >
 <span>{role.icon}</span> {role.id}
 </button>
 ))}
 </div>
 </div>

 <div className="mb-6 relative">
 <label className="text-xs text-on-surface-variant mb-3 block uppercase tracking-wider flex items-center space-x-2">
 <span className="material-symbols-outlined text-[14px]">psychology</span>
 <span>KARAKTER</span>
 </label>
 <div className="flex flex-wrap gap-3">
 {[
 { id: 'Albert Einstein', icon: '🧠' },
 { id: 'William Shakespeare', icon: '📜' }
 ].map(char => (
 <button 
 key={char.id}
 onClick={() => setSelectedChar(char.id)}
 className={`px-4 py-2 border rounded-full text-sm transition-colors flex items-center gap-2 ${
 selectedChar === char.id 
 ? 'bg-primary/20 border-primary text-primary' 
 : 'bg-[#0b0c10] hover:bg-outline-variant/20 border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
 }`}
 >
 <span>{char.icon}</span> {char.id}
 </button>
 ))}
 </div>
 </div>

 <div className="relative">
 <label className="text-xs text-on-surface-variant mb-3 block uppercase tracking-wider flex items-center space-x-2">
 <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
 <span>ÜSLUP</span>
 </label>
 <div className="flex flex-wrap gap-3">
 {[
 { id: 'Standart', icon: '😌' },
 { id: 'Komik', icon: '😂' },
 { id: 'Gündelik', icon: '👖' }
 ].map(tone => (
 <button 
 key={tone.id}
 onClick={() => setSelectedTone(tone.id)}
 className={`px-4 py-2 border rounded-full text-sm transition-colors flex items-center gap-2 ${
 selectedTone === tone.id 
 ? 'bg-primary/20 border-primary text-primary' 
 : 'bg-[#0b0c10] hover:bg-outline-variant/20 border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
 }`}
 >
 <span>{tone.icon}</span> {tone.id}
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* Advanced Settings */}
 <div className="bg-[#0b0c10] border border-primary/50 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer hover:bg-surface-container transition-colors relative overflow-hidden">
 <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
 <div className="flex items-center space-x-3 text-on-surface relative">
 <span className="material-symbols-outlined text-primary">code</span>
 <h3 className="font-semibold text-[15px]">İleri Seviye Ayarlar</h3>
 </div>
 <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20 relative">
 <span className="material-symbols-outlined text-on-surface-variant text-[18px]">settings</span>
 </div>
 </div>
 </div>

 {/* Right Column: Live Test Section */}
 <div className="flex flex-col">
 <section className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-5 flex-1 flex flex-col">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-2 text-emerald-400">
 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
 <h3 className="font-semibold text-sm">Canlı Test</h3>
 </div>
 <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">SİMÜLASYON HAZIR</span>
 </div>
 <div className="bg-[#0b0c10] border border-outline-variant/10 rounded-lg flex-1 mb-4 relative overflow-hidden p-4 flex flex-col min-h-[250px]">
 <div className="flex-1 flex flex-col space-y-4">
 {/* User Message */}
 <div className="self-end bg-surface-container-high border border-outline-variant/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
 <p className="text-[13px] text-on-surface font-light">Merhaba, stoklarınızda mavi renk M beden kışlık mont var mı? Fiyatı nedir?</p>
 </div>
 {/* Typing Indicator */}
 <div className="self-start flex space-x-2">
 <div className="bg-surface-container-high border border-outline-variant/20 rounded-full px-3 py-1.5 flex items-center space-x-1.5">
 <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce"></div>
 <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.2s' }}></div>
 <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.4s' }}></div>
 </div>
 </div>
 {/* Bot Message */}
 <div className="self-start bg-surface-container-high border border-primary/20 shadow-[0_0_10px_rgba(168,85,247,0.05)] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] mt-1">
 <p className="text-[13px] text-on-surface font-light">Merhaba! 👋 Evet, mavi renk M beden kışlık montumuz stoklarımızda mevcuttur.</p>
 </div>
 </div>
 </div>
 <div className="relative mt-auto">
 <input className="w-full bg-[#0b0c10] border border-outline-variant/20 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-[#a855f7]/50 text-on-surface placeholder-on-surface-variant" placeholder="Asistan ile konuşun..." type="text" />
 <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center">
 <span className="material-symbols-outlined text-[18px]">send</span>
 </button>
 </div>
 </section>
 </div>
 </div>

 {/* BOT PERFORMANSI */}
 <section className="flex flex-col space-y-3 pt-4">
 <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">BOT PERFORMANSI - BUGÜN</label>
 <div className="grid grid-cols-3 gap-4">
 <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-5 flex flex-col items-center justify-center">
 <span className="text-2xl font-bold text-emerald-400 mb-1">94%</span>
 <span className="text-xs text-on-surface-variant">Otomatik Yanıt</span>
 </div>
 <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-5 flex flex-col items-center justify-center">
 <span className="text-2xl font-bold text-amber-400 mb-1">47</span>
 <span className="text-xs text-on-surface-variant">Yönlendirilen</span>
 </div>
 <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-5 flex flex-col items-center justify-center">
 <span className="text-2xl font-bold text-sky-400 mb-1">0.8s</span>
 <span className="text-xs text-on-surface-variant">Ort. Yanıt Süresi</span>
 </div>
 </div>
 </section>

 {/* Bottom Service Cards */}
 <section className="space-y-3">
 <div className="bg-[#0b0c10] border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
 <div className="flex items-center space-x-3 text-emerald-400">
 <span className="material-symbols-outlined">calendar_month</span>
 <span className="font-semibold text-[15px]">AI Randevu Yönetimi</span>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
 </div>
 <div className="bg-[#0b0c10] border border-amber-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
 <div className="flex items-center space-x-3 text-amber-400">
 <span className="material-symbols-outlined">work</span>
 <span className="font-semibold text-[15px]">AI İşletme Hizmetleri</span>
 </div>
 <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
 </div>
 </section>

 </div>
 </div>
 );
}
