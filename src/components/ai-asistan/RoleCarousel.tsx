"use client";

// ==============================================================================
// PERSONA ENGINE — İşletme Rolü: küçük kart carousel
// ==============================================================================
// İşletme rolü hâlâ hardcoded bir liste (ai_personas gibi bir tabloya
// modellenmiyor — bkz. AICharacterPanel.tsx'teki ROLES sabiti), ama artık
// KARAKTER bölümüyle aynı kart dilini (dairesel görsel + renkli halka)
// paylaşıyor; sadece PersonaCard'ın `compact` varyantında ve tek bir marka
// rengiyle (rainbow ACCENT_COLORS'a gerek yok — burada "hangi karakter"
// değil "hangi sektör" seçildiği önemli, tek renk yeterli ve daha sakin).
// Sürükleyerek kaydırma davranışı PersonaCarousel'den birebir taşındı.
// ==============================================================================

import { useRef, useState, MouseEvent, ReactNode } from "react";
import PersonaCard from "./PersonaCard";
import type { PillItem } from "./PillGroup";

const ROLE_ACCENT = "#C2478D";

interface RoleCarouselProps {
  roles: (PillItem & { avatarUrl?: string | null; onRemove?: () => void })[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Listenin başında duran ekstra kart(lar) (ör. "Ekle" kartı). */
  leading?: ReactNode;
  removeLabel?: string;
}

export default function RoleCarousel({ roles, selectedId, onSelect, leading, removeLabel }: RoleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragDistance = useRef(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    dragDistance.current = 0;
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    dragDistance.current += Math.abs(e.movementX);
  };

  const handleClickCapture = (e: MouseEvent) => {
    if (dragDistance.current > 5) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClickCapture={handleClickCapture}
      className="hide-scrollbar-carousel"
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        paddingBottom: 8,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .hide-scrollbar-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {leading}
      {roles.map((r) => (
        <div key={r.id} style={{ position: "relative", flexShrink: 0 }}>
          <PersonaCard
            label={r.label}
            icon={r.icon}
            avatarUrl={r.avatarUrl}
            accentColor={ROLE_ACCENT}
            selected={selectedId === r.id}
            onSelect={() => onSelect(r.id)}
            title={r.label}
            compact
          />
          {r.onRemove && (
            <button
              type="button"
              aria-label={removeLabel}
              title={removeLabel}
              onClick={(e) => { e.stopPropagation(); r.onRemove?.(); }}
              style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, lineHeight: "20px", cursor: "pointer", padding: 0 }}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
