"use client";
import React, { useState } from "react";

export default function AnalizPage() {
  const [activeTab, setActiveTab] = useState<"gonderi" | "mesaj">("gonderi");

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface">AI Nexus - Analiz (Canlı)</h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Gerçek zamanlı {activeTab === 'gonderi' ? 'içerik performansı' : 'iletişim istatistikleri'} ve tahminleme modelleri.</p>
        </div>
        <div className="flex gap-2 bg-surface-container p-1 rounded-xl border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('gonderi')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'gonderi' 
                ? 'bg-secondary/20 text-secondary shadow-[0_0_10px_rgba(68,226,205,0.2)]' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Gönderi Analizi
          </button>
          <button 
            onClick={() => setActiveTab('mesaj')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'mesaj' 
                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Gelen Mesaj Analizi
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="flex gap-4">
          <select className="bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors">
            <option>Tüm Platformlar</option>
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
          <select className="bg-surface-container border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors">
            <option>Son 7 Gün</option>
            <option>Son 30 Gün</option>
            <option>Bu Ay</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span> Rapor Al
        </button>
      </div>

      {activeTab === 'gonderi' ? (
        // GÖNDERİ ANALİZİ GÖRÜNÜMÜ
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-secondary/30 neon-border-cyan group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Toplam Etkileşim</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-secondary">24.5K</span>
                <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1">+12%</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Erişim</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-on-surface">158K</span>
                <span className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1">+5%</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Paylaşılan Gönderi</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-on-surface">42</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-error/50 transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Takipçi Kaybı</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-error">120</span>
                <span className="text-error bg-error/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1">-2%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="text-lg font-headline-md font-bold text-on-surface mb-6">Etkileşim Trendi</h3>
              {/* Mock Line Chart */}
              <div className="h-64 w-full border-b border-l border-outline-variant/30 flex items-end justify-between px-2 pb-2 relative">
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline points="0,80 20,60 40,70 60,30 80,40 100,10" fill="none" stroke="var(--color-secondary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <polyline points="0,90 20,80 40,85 60,60 80,75 100,50" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                </svg>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                  <div key={d} className="h-full flex flex-col justify-end">
                    <span className="text-[10px] text-on-surface-variant font-code-sm mb-[-20px]">{d}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8 justify-center">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-xs text-on-surface-variant">Beğeni</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-primary border-dashed"></span><span className="text-xs text-on-surface-variant">Yorum</span></div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="text-lg font-headline-md font-bold text-on-surface mb-6 text-center">Hedef Kitle</h3>
              {/* Mock Donut Chart */}
              <div className="flex justify-center items-center h-48">
                <div className="w-32 h-32 rounded-full border-[16px] border-surface-container relative shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 75%)' }}></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary" style={{ clipPath: 'polygon(50% 50%, 0 75%, 0 0, 50% 0)' }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                 <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span>Kadın</span><span className="font-bold text-on-surface">65%</span></div>
                 <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span>Erkek</span><span className="font-bold text-on-surface">35%</span></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // GELEN MESAJ ANALİZİ GÖRÜNÜMÜ
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-primary/30 neon-border-purple group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block text-primary">Toplam Mesaj</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-primary">1,245</span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1">+24%</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-secondary/30 hover:border-secondary/50 neon-border-cyan transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block text-secondary">AI Yanıtlama Oranı</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-secondary">%85</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Ort. Yanıt Süresi</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-on-surface">2 dk</span>
                <span className="text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1">-1 dk</span>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors group">
              <span className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-2 block">Çözülen Talepler</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-headline-lg font-bold text-on-surface">942</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="text-lg font-headline-md font-bold text-on-surface mb-6">Mesaj Yoğunluk Haritası (Heatmap)</h3>
              
              {/* Mock Heatmap */}
              <div className="grid grid-cols-8 gap-1 mb-4">
                <div className="col-span-1"></div>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <div key={d} className="text-center text-xs text-on-surface-variant font-code-sm">{d}</div>)}
                
                {['09:00', '12:00', '15:00', '18:00', '21:00'].map((time, rowIdx) => (
                  <React.Fragment key={time}>
                    <div className="text-right pr-2 text-xs text-on-surface-variant font-code-sm self-center">{time}</div>
                    {[1,2,3,4,5,6,7].map((colIdx) => (
                      <div key={colIdx} className={`h-8 rounded-sm transition-all hover:scale-110 cursor-pointer ${
                        (rowIdx === 1 && colIdx === 3) || (rowIdx === 2 && colIdx === 5) ? 'bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10' :
                        (rowIdx === 2 || colIdx === 6) ? 'bg-primary/60' :
                        'bg-primary/20'
                      }`}></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="text-lg font-headline-md font-bold text-on-surface mb-6">Sıkça Sorulan Konular</h3>
              <div className="flex flex-col gap-4">
                {[
                  { topic: "Fiyat Listesi", percent: 45, color: "bg-primary" },
                  { topic: "Çalışma Saatleri", percent: 25, color: "bg-secondary" },
                  { topic: "Randevu İptali", percent: 15, color: "bg-tertiary" },
                  { topic: "Diğer", percent: 15, color: "bg-outline-variant" }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-on-surface">{item.topic}</span>
                      <span className="font-bold text-on-surface-variant">%{item.percent}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
