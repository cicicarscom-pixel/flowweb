"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { PLATFORMS, TIME_RANGES, TIME_RANGE_KEY_BY_ID } from "./analizConfig";
import { useAnalyticsData } from "./useAnalyticsData";
import { PostingAnalytics } from "./PostingAnalytics";
import { InboxAnalytics } from "./InboxAnalytics";

export default function AnalyticsScreen() {
  const t = useTranslations();
  const dayShort = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(d => t(`analizPage.days.${d}`));
  const getPlatformLabel = (p: typeof PLATFORMS[number]) =>
    p.id === 'all' ? t('analizPage.platforms.all') : p.name;
  const getTimeRangeLabel = (tr: typeof TIME_RANGES[number]) =>
    t(`analizPage.timeRanges.${TIME_RANGE_KEY_BY_ID[tr.id]}`);

  const [activeTab, setActiveTab] = useState<'posting' | 'inbox'>('posting');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[1]);

  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

  const { isLoading, stats, zernioData } = useAnalyticsData(selectedPlatform, selectedTimeRange);
  const [chartMetric, setChartMetric] = useState('views');
  const [postTimelineMetrics, setPostTimelineMetrics] = useState<string[]>(['views', 'likes', 'comments']);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#F6F1EC" }}>{t("analizPage.header.title")}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("analizPage.header.subtitle")}</p>
      </div>

      {/* Top Tabs */}
      <div className="glass" style={{ display: "flex", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('posting')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'posting' ? "rgba(255,122,89,0.15)" : "transparent",
            border: activeTab === 'posting' ? "1px solid rgba(255,122,89,0.3)" : "1px solid transparent",
            color: activeTab === 'posting' ? "#FF7A59" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          {t("analizPage.tabs.posting")}
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'inbox' ? "rgba(194,71,141,0.15)" : "transparent",
            border: activeTab === 'inbox' ? "1px solid rgba(194,71,141,0.3)" : "1px solid transparent",
            color: activeTab === 'inbox' ? "#E8A8CD" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          {t("analizPage.tabs.inbox")}
        </button>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
        
        {/* Platform Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => { setIsPlatformMenuOpen(!isPlatformMenuOpen); setIsTimeMenuOpen(false); }}
            className="glass" 
            style={{ 
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", minWidth: 200
            }}
          >
            <span style={{ fontSize: 16, color: selectedPlatform.color }}>★</span>
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getPlatformLabel(selectedPlatform)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isPlatformMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", left: 0, marginTop: 8, width: 220,
              borderRadius: 12, padding: 8, border: "1px solid rgba(255,122,89,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {PLATFORMS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p); setIsPlatformMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedPlatform.id === p.id ? "rgba(255,122,89,0.1)" : "transparent"
                  }}
                >
                  <span style={{ fontSize: 16, color: p.color }}>★</span>
                  <span style={{ color: selectedPlatform.id === p.id ? "#FF7A59" : "#F6F1EC", fontSize: 13, fontWeight: selectedPlatform.id === p.id ? 700 : 500 }}>{getPlatformLabel(p)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => { setIsTimeMenuOpen(!isTimeMenuOpen); setIsPlatformMenuOpen(false); }}
            className="glass" 
            style={{ 
              display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", minWidth: 160
            }}
          >
            <span style={{ fontSize: 16, color: "var(--text-secondary)" }}>⏱️</span>
            <span style={{ color: "#F6F1EC", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{getTimeRangeLabel(selectedTimeRange)}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isTimeMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", right: 0, marginTop: 8, width: 160,
              borderRadius: 12, padding: 8, border: "1px solid rgba(255,122,89,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {TIME_RANGES.map(tr => (
                <div 
                  key={tr.id}
                  onClick={() => { setSelectedTimeRange(tr); setIsTimeMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedTimeRange.id === tr.id ? "rgba(255,122,89,0.1)" : "transparent"
                  }}
                >
                  <span style={{ color: selectedTimeRange.id === tr.id ? "#FF7A59" : "#F6F1EC", fontSize: 13, fontWeight: selectedTimeRange.id === tr.id ? 700 : 500 }}>{getTimeRangeLabel(tr)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area Based on Tabs */}
      <div style={{ flex: 1 }}>
        {activeTab === 'posting' ? (
          <PostingAnalytics
            t={t}
            dayShort={dayShort}
            zernioData={zernioData}
            stats={stats}
            isLoading={isLoading}
            selectedPlatform={selectedPlatform}
            chartMetric={chartMetric}
            setChartMetric={setChartMetric}
            postTimelineMetrics={postTimelineMetrics}
            setPostTimelineMetrics={setPostTimelineMetrics}
          />
        ) : (
          <InboxAnalytics t={t} zernioData={zernioData} stats={stats} />
        )}
      </div>

    </div>
  );
}