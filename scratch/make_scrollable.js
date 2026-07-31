const fs = require('fs');

const pagePath = 'c:\\Users\\roman\\flowweb\\src\\app\\(dashboard)\\ai-asistan\\page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// Replace flex-wrap with overflow-x-auto flex-nowrap scrollbar-hide for both Role and Character
content = content.replace(/<div className="flex flex-wrap gap-2">/g, '<div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">');

// Add flex-shrink-0 to buttons so they don't squish when scrolling
content = content.replace(/className={`px-3 py-1\.5 rounded-full text-xs flex items-center gap-2 transition-all \${/g, 'className={`shrink-0 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all ${');
content = content.replace(/<button className="px-3 py-1.5 bg-\[#a855f7\]\/10 border border-\[#a855f7\]\/30 rounded-full text-xs text-\[#a855f7\] hover:bg-\[#a855f7\]\/20 transition-colors">/g, '<button className="shrink-0 px-3 py-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full text-xs text-[#a855f7] hover:bg-[#a855f7]/20 transition-colors">');

fs.writeFileSync(pagePath, content);
console.log("Updated page.tsx successfully.");
