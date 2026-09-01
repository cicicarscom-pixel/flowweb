const fs = require('fs');
const file_path = 'src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx';
let content = fs.readFileSync(file_path, 'utf-8');

const newScrollable = `<div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: \`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      \`}} />
      <div 
        ref={containerRef}
        className="hide-scroll"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          display: "flex", overflowX: "auto", gap: 12, paddingBottom: 8, paddingLeft: 10, paddingRight: 10, 
          cursor: isDown ? "grabbing" : "grab",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
          userSelect: "none"
        }}
      >
        {children}
      </div>
    </div>`;

content = content.replace(/<div \s*ref=\{containerRef\}[\s\S]*?<style dangerouslySetInnerHTML=\{.*?\/>\s*\{children\}\s*<\/div>/g, newScrollable);

content = content.replace(
  '{/* Heatmap Grid */}\n              <div style={{ flex: 1, overflowX: "auto", paddingBottom: 6 }}>',
  '{/* Heatmap Grid */}\n              <div className="hide-scroll" style={{ flex: 1, overflowX: "auto", paddingBottom: 6, overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}>'
);
content = content.replace(
  '{/* Heatmap Grid */}\r\n              <div style={{ flex: 1, overflowX: "auto", paddingBottom: 6 }}>',
  '{/* Heatmap Grid */}\r\n              <div className="hide-scroll" style={{ flex: 1, overflowX: "auto", paddingBottom: 6, overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}>'
);

fs.writeFileSync(file_path, content, 'utf-8');
console.log('Success');
