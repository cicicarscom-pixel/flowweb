const fs = require('fs');

const pageTsxPath = 'c:\\Users\\roman\\flowweb\\src\\app\\(dashboard)\\ai-asistan\\page.tsx';
const pageCssPath = 'c:\\Users\\roman\\flowweb\\src\\app\\(dashboard)\\ai-asistan\\page.module.css';

const tsxReplacements = {
  'bg-[#201f22]': 'bg-surface-container',
  'bg-[#0e0e10]': 'bg-surface-container-lowest',
  'bg-[#353437]': 'bg-surface-variant',
  'bg-[#131315]': 'bg-surface',
  'bg-[#4ae176]': 'bg-secondary',
  'bg-[#ffb4ab]': 'bg-error',
  'bg-[#00b954]': 'bg-secondary-container',
  'bg-[#fabc4e]/10': 'bg-tertiary/10',
  'bg-[#b76dff]/20': 'bg-primary-container/20',
  'bg-[#b76dff]/10': 'bg-primary-container/10',
  
  'text-[#e5e1e4]': 'text-on-surface',
  'text-[#cfc2d6]': 'text-on-surface-variant',
  'text-[#ddb7ff]': 'text-primary',
  'text-[#b76dff]': 'text-primary-container',
  'text-[#4ae176]': 'text-secondary',
  'text-[#fabc4e]': 'text-tertiary',
  'text-[#00b954]': 'text-secondary-container',
  
  'border-[#4d4354]': 'border-outline-variant',
  'border-[#b76dff]': 'border-primary-container',
  'border-[#4ae176]': 'border-secondary',
  'border-[#4ae176]/30': 'border-secondary/30',
  'border-[#fabc4e]': 'border-tertiary',
  'border-[#ddb7ff]/50': 'border-primary/50',
  'border-[#131315]': 'border-background',
  
  'peer-focus:ring-[#00b954]/20': 'peer-focus:ring-secondary-container/20',
  'peer-focus:ring-[#ddb7ff]/20': 'peer-focus:ring-primary/20',
  'focus:border-[#ddb7ff]': 'focus:border-primary',
  'focus:ring-[#ddb7ff]': 'focus:ring-primary',
  'peer-checked:bg-[#00b954]': 'peer-checked:bg-secondary-container',
  'peer-checked:bg-[#ddb7ff]': 'peer-checked:bg-primary',
  
  'bg-[#201f22]/70': 'bg-transparent',
  'bg-[#353437]/50': 'bg-surface-variant/50',
  'bg-[#131315]/50': 'bg-surface/50',
  'bg-[#353437]/30': 'bg-surface-variant/30',
  
  'text-[#6bff8f]': 'text-secondary-fixed',
};

let pageTsxContent = fs.readFileSync(pageTsxPath, 'utf-8');
for (const [key, value] of Object.entries(tsxReplacements)) {
    pageTsxContent = pageTsxContent.split(key).join(value);
}
fs.writeFileSync(pageTsxPath, pageTsxContent);

let pageCssContent = fs.readFileSync(pageCssPath, 'utf-8');
pageCssContent = pageCssContent.replace(/#ddb7ff/g, '#22d3ee'); 
pageCssContent = pageCssContent.replace(/#b76dff/g, '#0ea5e9'); 
fs.writeFileSync(pageCssPath, pageCssContent);

console.log('Replaced colors successfully!');
