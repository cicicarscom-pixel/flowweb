"use client";

// ==============================================================================
// PERSONA ENGINE — PHASE 6: generic pill/button selector
// ==============================================================================
// Shared primitive extracted from the old inline JSX in page.tsx — used for
// both the "İŞLETME ROLÜ" (role) and "ÜSLUP" (tone) groups, which were
// byte-for-byte identical except for their item list. Doubles as this
// project's ToneSelector/RoleSelector from the plan's component list; kept as
// one generic component instead of two near-duplicates.
// ==============================================================================

export interface PillItem {
  id: string;
  label: string;
  icon: string;
}

interface PillGroupProps {
  items: PillItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PillGroup({ items, selectedId, onSelect }: PillGroupProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 99,
            background: selectedId === item.id ? "rgba(194,71,141,0.15)" : "rgba(255,255,255,0.03)",
            border: selectedId === item.id ? "1px solid rgba(194,71,141,0.4)" : "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", color: selectedId === item.id ? "#C2478D" : "var(--text-secondary)",
            fontSize: 14, fontWeight: 500, transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
