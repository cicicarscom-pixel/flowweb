"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

export default function DashboardHomePage() {
  const [isMagicPanelOpen, setIsMagicPanelOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 pb-24">
      {/* AI Assistant Toggle - Modified with Magic Container */}
      <div className={styles.magicAuraContainer}>
          {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className={styles.magicAuraDot} 
                style={{
                  animationDelay: `-${i * 0.08}s`,
                  opacity: Math.max(0, 1 - (i * 0.033)),
                  transform: `scale(${Math.max(0.2, 1 - (i * 0.03))})`,
                  background: i < 5 ? "#00ff00" : i < 12 ? "#ffff00" : i < 19 ? "#ff0050" : i < 25 ? "#bc13fe" : "#0055ff"
                }}
              ></div>
            ))}
          <div className={`${styles.panel} p-0 ${styles.magicContainer} h-[104px] ${isMagicPanelOpen ? styles.isOpen : ''}`}>
        <div className={`${styles.magicContent} p-6 flex flex-col justify-center w-full`}>
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A1F29] rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-[#0055ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">AI Asistan Aktif</h2>
                <p className="text-sm text-[#8E9BAE]">7/24 Akıllı Otomasyon Devrede</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#0055ff]"></div>
            </label>
          </div>

        </div>
        <div className={styles.mechanicalCover}>
          <div className={styles.coverTop}></div>
          <div className={styles.coverBottom}></div>
          <div className={styles.magicButtonWrapper} onClick={() => setIsMagicPanelOpen(true)}>
            <button className={styles.magicButton}>Sihri Başlat</button>
            </div>
          </div>
        </div>
        </div>

      {/* Income / Expense Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gelir Card */}
        <div className={`${styles.panel} p-6 flex flex-col justify-between h-48`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#00FF9D] font-medium text-lg">Gelir</h3>
            <svg className="w-5 h-5 text-[#00FF9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold text-white mr-1">0</span>
            <span className="text-lg text-[#8E9BAE]">TL</span>
          </div>
          {/* Bar Chart Mockup */}
          <div className="flex items-end justify-between h-16 space-x-2 mt-auto">
            <div className="w-full bg-[#1A1F29] rounded-sm h-[15%]"></div>
            <div className="w-full bg-[#1A1F29] rounded-sm h-[20%]"></div>
            <div className="w-full bg-[#1A1F29] rounded-sm h-[25%]"></div>
            <div className={`w-full ${styles.barChartGreen} rounded-sm h-[40%]`}></div>
            <div className={`w-full ${styles.barChartGreen} rounded-sm h-[35%]`}></div>
            <div className={`w-full ${styles.barChartGreen} rounded-sm h-[45%]`}></div>
            <div className={`w-full ${styles.barChartGreen} rounded-sm h-[60%]`}></div>
            <div className={`w-full ${styles.barChartGreen} rounded-sm h-[80%]`}></div>
          </div>
        </div>
        
        {/* Gider Card */}
        <div className={`${styles.panel} p-6 flex flex-col justify-between h-48`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#FF4D4D] font-medium text-lg">Gider</h3>
            <svg className="w-5 h-5 text-[#FF4D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
            </svg>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold text-white mr-1">0</span>
            <span className="text-lg text-[#8E9BAE]">TL</span>
          </div>
          {/* Bar Chart Mockup */}
          <div className="flex items-end justify-between h-16 space-x-2 mt-auto opacity-80">
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[30%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[25%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[40%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[15%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[20%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[40%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[20%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[25%]`}></div>
            <div className={`w-full ${styles.barChartRed} rounded-sm h-[45%]`}></div>
          </div>
        </div>
      </div>

      {/* Tüm Hesaplar Section */}
      <div className={`${styles.panel} p-6 ${styles.glowBorderBottom}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#1A1F29] rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#0055ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold">Tüm Hesaplar</h2>
          </div>
          <button className="flex items-center px-4 py-2 rounded-lg border border-[#1F2937] text-[#0055ff] text-sm font-medium hover:bg-[#1A1F29] transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            CANLI ANALİZ
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8 divide-x divide-[#1F2937]">
          {/* Follower Stats */}
          <div>
            <p className="text-sm text-[#8E9BAE] mb-2">Toplam Takipçi Kitle</p>
            <div className="flex items-end">
              <span className="text-5xl font-bold text-[#0055ff] mr-4">0</span>
              <div className="pb-1">
                <div className="flex items-center text-[#00FF9D] text-sm font-medium mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  %12
                </div>
                <p className="text-xs text-[#8E9BAE]">Geçen haftaya göre</p>
              </div>
            </div>
          </div>
          {/* Interaction Trend */}
          <div className="pl-8 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-[#8E9BAE]">Etkileşim Trendi</p>
              <div className="text-right">
                <div className="font-bold text-white">Yüksek</div>
                <div className="text-xs text-[#8E9BAE]">Performans seviyesi</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${styles.progressBarGradient} rounded-full`} style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Son Aktiviteler */}
        <div className={`${styles.panel} p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-white">Son Aktiviteler</h3>
            <Link href="#" className="text-xs text-[#0055ff] font-medium hover:underline">TÜMÜNÜ GÖR</Link>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 rounded-full border border-dashed border-[#0055ff] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#0055ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-sm text-[#8E9BAE]">Henüz bir aktivite bulunmuyor.</p>
          </div>
        </div>
        {/* Yaklaşan Ödemeler */}
        <div className={`${styles.panel} p-6 flex flex-col`}>
          <h3 className="font-semibold text-white mb-8">Yaklaşan Ödemeler</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 rounded-full border border-dashed border-[#0055ff] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#0055ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <p className="text-sm text-[#8E9BAE]">Yaklaşan bir ödeme bulunmuyor.</p>
          </div>
        </div>
        {/* İletişim Raporları */}
        <div className={`${styles.panel} p-6 flex flex-col justify-start`}>
          <h3 className="font-semibold text-white mb-6">İletişim Raporları</h3>
          <div className="bg-[#1A1F29] p-4 rounded-xl flex items-center justify-between border border-[#1F2937] cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border border-[#0055ff] flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-[#0055ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white mb-1">İletişim Raporları</div>
                <div className="text-xs text-[#8E9BAE]">Henüz bir iletişim geçmişi bulunmuyor.</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-[#8E9BAE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}








