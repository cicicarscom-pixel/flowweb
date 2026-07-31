const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'roman', 'flowweb', 'src', 'app', '(dashboard)', 'ai-muhasebe', 'odeme-takvimi', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove overflow-y-auto and calendar-cell-scroll
content = content.replace(/overflow-y-auto calendar-cell-scroll/g, '');
content = content.replace(/overflow-y-auto/g, ''); // just in case

// Ensure all income columns have border-r and stretch properly
// We want to make sure the border goes all the way down. Since it's a grid (grid-cols-2), both children will stretch to the height of the tallest child.
// So putting border-r on the first child is correct.
// Let's check the empty days: 8 to 30.
// In the current file, empty days are like:
// <div className="bg-sidebar grid grid-cols-2 min-h-0 relative"><div className="absolute top-1 left-2 z-10 text-[10px] font-bold text-on-surface">8</div><div className="border-r border-surface-bright"></div><div></div></div>
// This is already correct, they have `border-r border-surface-bright`.

// Wait, the user said "bazılarında ayırma çizgisi var basısında yok".
// Why would it not show up?
// Maybe the empty div `<div className="border-r border-surface-bright"></div>` has 0 height if it has no content and is not stretching? 
// No, grid items stretch by default. But `min-h-0` on the parent `<div className="bg-sidebar grid grid-cols-2 min-h-0 relative">` might be causing issues?
// Actually, `h-full` on the inner columns would ensure they stretch if they were flex items, but in grid they stretch automatically.
// Wait, the separator line is missing in the *image* because the `overflow-y-auto` makes the container only as tall as its content inside the grid item, and if one has more content than the other... wait, if `overflow-y-auto` is removed, the grid item will grow to fit the content, and since both items are in a row, they will both be the same height! That will fix the border issue!

// Let's also implement the "mouse ile kaydırabilsin mobildeki gibi" (scroll with mouse like mobile).
// This implies they want drag-to-scroll on the main container since it's wide (2362px).
// We can add a simple drag-to-scroll functionality using a React ref and mouse events.

fs.writeFileSync(path.join('c:', 'Users', 'roman', 'flowweb', 'scratch', 'make_scrollable.js'), `
const fs = require('fs');
const filePath = 'c:/Users/roman/flowweb/src/app/(dashboard)/ai-muhasebe/odeme-takvimi/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove scrollbar classes
content = content.replace(/overflow-y-auto calendar-cell-scroll /g, '');
content = content.replace(/overflow-y-auto /g, '');

// Convert component to use client so we can add drag to scroll
if (!content.includes('"use client"')) {
    content = '"use client";\\n\\nimport { useRef, useState } from "react";\\n' + content;
}

// Add refs and mouse events for drag-to-scroll
// Find the OdemeTakvimiPage function
content = content.replace(/export default function OdemeTakvimiPage\\(\\) {/, \`export default function OdemeTakvimiPage() {
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
\`);

// Find the main scrollable container
// <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">
// Wait, the grid itself is wide. 
// <div className="flex-1 grid grid-cols-7 gap-[1px] bg-surface-bright border border-t-0 border-surface-bright rounded-b overflow-x-auto" style={{ minWidth: "2362px", gridAutoRows: "minmax(120px, auto)" }}>
// It is inside:
// <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">
// Let's attach the events to this wrapper.

content = content.replace(
  /<div\\s+className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto">/,
  \`<div 
    className="flex-1 flex flex-col overflow-hidden px-6 pb-6 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
    ref={scrollRef}
    onMouseDown={onMouseDown}
    onMouseLeave={onMouseLeave}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
  >\`
);

fs.writeFileSync(filePath, content);
console.log("Updated page.tsx with drag-to-scroll and removed inner scrollbars.");
`);
