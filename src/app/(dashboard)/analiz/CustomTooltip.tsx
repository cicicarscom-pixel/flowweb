"use client";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong" style={{ padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,10,12,0.9)", backdropFilter: "blur(12px)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 8, fontFamily: "JetBrains Mono, monospace" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: "flex", gap: 12, justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color || p.payload?.color || p.fill }} />
              <span style={{ fontSize: 13, color: "#fff" }}>{p.name}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color || p.payload?.color || p.fill, fontFamily: "JetBrains Mono, monospace" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
