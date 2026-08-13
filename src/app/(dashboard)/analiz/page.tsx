"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";

const analyticsData = [
  { date: "28 Oca", instagram: 4200, tiktok: 8100, linkedin: 1800, facebook: 2900 },
  { date: "29 Oca", instagram: 5100, tiktok: 9400, linkedin: 2100, facebook: 3200 },
  { date: "30 Oca", instagram: 4800, tiktok: 7200, linkedin: 2400, facebook: 3600 },
  { date: "31 Oca", instagram: 6300, tiktok: 11000, linkedin: 2700, facebook: 4100 },
  { date: "1 Şub", instagram: 7200, tiktok: 13500, linkedin: 3100, facebook: 4800 },
  { date: "2 Şub", instagram: 6800, tiktok: 12800, linkedin: 3400, facebook: 5200 },
  { date: "3 Şub", instagram: 8400, tiktok: 15200, linkedin: 3900, facebook: 5900 },
];

const barData = [
  { name: "Pzt", value: 340 },
  { name: "Sal", value: 520 },
  { name: "Çar", value: 410 },
  { name: "Per", value: 680 },
  { name: "Cum", value: 920 },
  { name: "Cmt", value: 780 },
  { name: "Paz", value: 430 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong" style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,10,12,0.9)", backdropFilter: "blur(12px)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 8, fontFamily: "JetBrains Mono, monospace" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color, fontFamily: "JetBrains Mono, monospace" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState("7g");
  const periods = [{ id: "7g", label: "Son 7 Gün" }, { id: "30g", label: "Son 30 Gün" }, { id: "all", label: "Tüm Zamanlar" }];

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100 }}>
      {/* Period filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Analitik & İstatistikler</h2>
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className="pill-btn"
              style={{
                background: period === p.id ? "rgba(0,240,255,0.15)" : "transparent",
                color: period === p.id ? "#00f0ff" : "var(--text-secondary)",
                border: period === p.id ? "1px solid rgba(0,240,255,0.3)" : "1px solid transparent",
                fontSize: 12,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {[
          { label: "Toplam Erişim", value: "284K", change: "+22.4%", color: "#00f0ff" },
          { label: "Takipçi Artışı", value: "+1,847", change: "+8.1%", color: "#4edea3" },
          { label: "Etkileşim Oranı", value: "18.4%", change: "+3.2%", color: "#bc13fe" },
          { label: "Yanıt Süresi", value: "1.2dk", change: "-40%", color: "#ffb95f" },
        ].map(k => (
          <div key={k.label} className="glass" style={{ borderRadius: 18, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 10 }}>{k.label.toUpperCase()}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: k.color, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>{k.value}</p>
            <span style={{ fontSize: 11, color: "#4edea3", background: "rgba(78,222,163,0.12)", padding: "3px 8px", borderRadius: 99, fontFamily: "JetBrains Mono, monospace" }}>{k.change}</span>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)", height: 280 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 18 }}>PLATFORM ERİŞİM TRENDİ</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analyticsData}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="li" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#bc13fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" fill="url(#ig)" strokeWidth={2} />
            <Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#00f0ff" fill="url(#tk)" strokeWidth={2} />
            <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#4edea3" fill="url(#li)" strokeWidth={2} />
            <Area type="monotone" dataKey="facebook" name="Facebook" stroke="#bc13fe" fill="url(#fb)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="glass" style={{ borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.06)", height: 240 }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 18 }}>GÜNLÜK ETKİLEŞİM</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Etkileşim" fill="rgba(188,19,254,0.5)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
