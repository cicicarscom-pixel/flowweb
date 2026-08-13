"use client";

import React, { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// -------------------------
// DUMMY DATA FOR WEB PREVIEW
// -------------------------
const timelineData = [
  { date: "01 Oca", views: 12000, likes: 1800 },
  { date: "02 Oca", views: 18000, likes: 2400 },
  { date: "03 Oca", views: 15000, likes: 2100 },
  { date: "04 Oca", views: 24000, likes: 3800 },
  { date: "05 Oca", views: 22000, likes: 3200 },
  { date: "06 Oca", views: 32000, likes: 4800 },
  { date: "07 Oca", views: 28000, likes: 4100 },
];

const followerStats = [
  { date: "01 Oca", followers: 42000 },
  { date: "02 Oca", followers: 42150 },
  { date: "03 Oca", followers: 42300 },
  { date: "04 Oca", followers: 42800 },
  { date: "05 Oca", followers: 43200 },
  { date: "06 Oca", followers: 43900 },
  { date: "07 Oca", followers: 44500 },
];

const demographicsData = [
  { name: "18-24 Kadın", value: 35, color: "#00f0ff" },
  { name: "25-34 Kadın", value: 25, color: "#bc13fe" },
  { name: "18-24 Erkek", value: 20, color: "#ebb2ff" },
  { name: "25-34 Erkek", value: 20, color: "#0077b5" },
];

const PLATFORMS = [
  { id: 'all', name: 'Tümü', icon: 'apps', color: '#849495' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#ff0050' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#ebb2ff' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#00f0ff' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#ff0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0077b5' },
  { id: 'googlebusiness', name: 'Google Business', icon: 'store', color: '#34a853' }
];

const TIME_RANGES = [
  { id: '7d', name: 'Son 7 Gün', days: 7 },
  { id: '30d', name: 'Son 30 Gün', days: 30 },
  { id: '90d', name: 'Son 90 Gün', days: 90 },
  { id: '1y', name: 'Son 1 Yıl', days: 365 }
];

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong" style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,10,12,0.9)", backdropFilter: "blur(12px)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 8, fontFamily: "JetBrains Mono, monospace" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color || p.payload.color }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color || p.payload.color, fontFamily: "JetBrains Mono, monospace" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<'posting' | 'inbox'>('posting');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[1]);

  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

  // Mock State Data (matching mobile functionality)
  const zernioData = {
    totalPosts: 142,
    totalComments: 890,
    totalFollowers: "44.5K",
    messagesReceived: 342,
    messagesSent: 284,
  };
  const stats = { totalReviews: 56 };

  const renderPostingAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        {/* Animated Border Card Simulation */}
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(0,240,255,0.1), rgba(0,240,255,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>TOPLAM GÖNDERİ</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#00f0ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalPosts}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(188,19,254,0.1), rgba(188,19,254,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>TOPLAM YORUM</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#ebb2ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.totalComments}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👥</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>TOPLAM TAKİPÇİ</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>{zernioData.totalFollowers}</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>📝</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>DEĞERLENDİRMELER</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>{stats.totalReviews}</p>
        </div>
      </div>

      {/* Line Chart: Engagement / Impressions */}
      <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3", marginBottom: 4 }}>Etkileşim ve Gösterim</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Seçili dönemdeki görüntülenme ve beğeni değişimi</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00f0ff" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Görüntülenme</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#bc13fe" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Beğeni</span>
            </div>
          </div>
        </div>

        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="views" name="Görüntülenme" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: "#00f0ff", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="likes" name="Beğeni" stroke="#bc13fe" strokeWidth={3} dot={{ r: 4, fill: "#bc13fe", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart: Follower Growth */}
      <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(78,222,163,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ color: "#4edea3", fontSize: 20 }}>📈</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3" }}>Takipçi Büyümesi</h3>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 24 }}>Seçili dönemdeki net takipçi değişimi</p>

        <div style={{ height: 250, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={followerStats}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4edea3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" domain={['dataMin - 1000', 'dataMax + 1000']} tick={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="followers" name="Takipçi" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Demographics (Simulated for Instagram) */}
      {(selectedPlatform.id === 'instagram' || selectedPlatform.id === 'all') && (
        <div className="glass" style={{ borderRadius: 20, padding: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e5e2e3", marginBottom: 24 }}>Demografi Analizi</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicsData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {demographicsData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: d.color }} />
                    <span style={{ color: "#e5e2e3", fontSize: 14 }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>%{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInboxAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      {/* Key Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(188,19,254,0.1), rgba(188,19,254,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📥</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>ALINAN MESAJ</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#ebb2ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.messagesReceived}</p>
          </div>
        </div>

        <div style={{ position: "relative", padding: 2, borderRadius: 18, background: "linear-gradient(135deg, rgba(0,240,255,0.1), rgba(0,240,255,0.5))" }}>
          <div style={{ background: "#0A0A0B", borderRadius: 16, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>📤</span>
              <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>GÖNDERİLEN MESAJ</p>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#00f0ff", fontFamily: "Outfit, sans-serif" }}>{zernioData.messagesSent}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>👁️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>OKUNAN</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>%84</p>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>⏱️</span>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>ORT. YANIT SÜRESİ</p>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#e5e2e3" }}>1.2 dk</p>
        </div>
      </div>

      {/* Response Time Analysis Card */}
      <div className="glass" style={{ borderRadius: 20, padding: "32px 24px", border: "1px solid rgba(0,240,255,0.3)", textAlign: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e5e2e3", marginBottom: 8 }}>Yanıt Süresi Analizi</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 32 }}>Mesajlara ilk dönüş hızı, müşteri memnuniyeti için kritiktir.</p>
        
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 0 20px rgba(0,240,255,0.4))", marginBottom: 16 }}>🚀</span>
          <p style={{ color: "#00f0ff", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" }}>HARİKA HIZ</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Analitik & İstatistikler</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Tüm sosyal medya kanallarınızın performansını detaylı inceleyin</p>
      </div>

      {/* Top Tabs */}
      <div className="glass" style={{ display: "flex", padding: 6, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('posting')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'posting' ? "rgba(0,240,255,0.15)" : "transparent",
            border: activeTab === 'posting' ? "1px solid rgba(0,240,255,0.3)" : "1px solid transparent",
            color: activeTab === 'posting' ? "#00f0ff" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Gönderi Analizi
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: activeTab === 'inbox' ? "rgba(188,19,254,0.15)" : "transparent",
            border: activeTab === 'inbox' ? "1px solid rgba(188,19,254,0.3)" : "1px solid transparent",
            color: activeTab === 'inbox' ? "#ebb2ff" : "var(--text-secondary)",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Gelen Kutusu Analizi
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
            <span style={{ color: "#e5e2e3", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{selectedPlatform.name}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isPlatformMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", left: 0, marginTop: 8, width: 220,
              borderRadius: 12, padding: 8, border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {PLATFORMS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p); setIsPlatformMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedPlatform.id === p.id ? "rgba(0,240,255,0.1)" : "transparent"
                  }}
                >
                  <span style={{ fontSize: 16, color: p.color }}>★</span>
                  <span style={{ color: selectedPlatform.id === p.id ? "#00f0ff" : "#e5e2e3", fontSize: 13, fontWeight: selectedPlatform.id === p.id ? 700 : 500 }}>{p.name}</span>
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
            <span style={{ color: "#e5e2e3", fontSize: 14, flex: 1, textAlign: "left", fontWeight: 600 }}>{selectedTimeRange.name}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>▼</span>
          </button>

          {isTimeMenuOpen && (
            <div className="glass-strong" style={{ 
              position: "absolute", top: "100%", right: 0, marginTop: 8, width: 160,
              borderRadius: 12, padding: 8, border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(10,10,12,0.95)", zIndex: 50, boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}>
              {TIME_RANGES.map(tr => (
                <div 
                  key={tr.id}
                  onClick={() => { setSelectedTimeRange(tr); setIsTimeMenuOpen(false); }}
                  style={{
                    padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    background: selectedTimeRange.id === tr.id ? "rgba(0,240,255,0.1)" : "transparent"
                  }}
                >
                  <span style={{ color: selectedTimeRange.id === tr.id ? "#00f0ff" : "#e5e2e3", fontSize: 13, fontWeight: selectedTimeRange.id === tr.id ? 700 : 500 }}>{tr.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area Based on Tabs */}
      <div style={{ flex: 1 }}>
        {activeTab === 'posting' ? renderPostingAnalytics() : renderInboxAnalytics()}
      </div>

    </div>
  );
}
