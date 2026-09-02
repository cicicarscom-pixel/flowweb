"use client";

// ==============================================================================
// PERSONA ENGINE — Üslup: küçük kart carousel
// ==============================================================================
// Üslup da (İşletme Rolü gibi) hardcoded bir liste — ai_personas'a modellenmiş
// bir kavram değil. Karma bir liste: Standart/Komik/Resmi/Samimi'nin görseli
// yok (icon emoji ile gösteriliyor, "Standart" persona kartındaki robot
// emojisiyle aynı fikir), yeni eklenen 5 mizaç (Neşeli/Sakin/Dedikoducu/
// Huysuz/Sinirli) ise kendi görseliyle geliyor. PersonaCard zaten avatarUrl
// yoksa emoji'ye düşüyor, o yüzden karışık liste sorunsuz render olur.
// Sürükleyerek kaydırma davranışı RoleCarousel/PersonaCarousel'den birebir
// taşındı — üçü de aynı UX'i paylaşıyor.
// ==============================================================================

import { useRef, useState, MouseEvent } from "react";
import PersonaCard from "./PersonaCard";
import type { PillItem } from "./PillGroup";

const TONE_ACCENT = "#C2478D";

interface ToneCarouselProps {
  tones: (PillItem & { avatarUrl?: string | null })[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ToneCarousel({ tones, selectedId, onSelect }: ToneCarouselProps) {
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
      {tones.map((t) => (
        <PersonaCard
          key={t.id}
          label={t.label}
          icon={t.icon}
          avatarUrl={t.avatarUrl}
          accentColor={TONE_ACCENT}
          selected={selectedId === t.id}
          onSelect={() => onSelect(t.id)}
          title={t.label}
          compact
        />
      ))}
    </div>
  );
}
