
const fs = require('fs');
const filePath = 'c:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove scrollbar classes
content = content.replace(/overflow-y-auto calendar-cell-scroll /g, '');
content = content.replace(/overflow-y-auto /g, '');

// Convert component to use client so we can add drag to scroll
if (!content.includes('"use client"')) {
    content = '"use client";\n\nimport { useRef, useState } from "react";\n' + content;
}

// Add refs and mouse events for drag-to-scroll
// Find the OdemeTakvimiPage function
content = content.replace(/export default function OdemeTakvimiPage\(\) {/, `export default function OdemeTakvimiPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDown(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
`);

// Find the main scrollable container
// <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">
// Wait, the grid itself is wide. 
// <div className="flex-1 grid grid-cols-7 gap-[1px] bg-surface-bright border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ minWidth: "2362px", gridAutoRows: "minmax(120px, auto)" }}>
// It is inside:
// <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">
// Let's attach the events to this wrapper.

content = content.replace(
  /<div\s+className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">/,
  `<div 
    className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
    ref={scrollRef}
    onMouseDown={onMouseDown}
    onMouseLeave={onMouseLeave}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
  >`
);

fs.writeFileSync(filePath, content);
console.log("Updated page.tsx with drag-to-scroll and removed inner scrollbars.");
