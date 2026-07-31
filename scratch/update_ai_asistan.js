const fs = require('fs');

const pagePath = 'c:\\Users\\roman\\flowweb\\src\\app\\(dashboard)\\ai-asistan\\page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove magicFloat
content = content.replace(/\${styles\.magicFloat}/g, '');

// 2. Remove Derin Analiz & Hızlı Yanıt buttons block
const buttonsRegex = /<div className="flex gap-4">[\s\S]*?<\/div>/;
content = content.replace(buttonsRegex, '');

// 3. Add states
content = content.replace('const [isOpen, setIsOpen] = useState(false);', 
  `const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Kebapçı');
  const [selectedChar, setSelectedChar] = useState('Albert Einstein');`
);

// 4. Update Role Buttons
const rolesHtml = `
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'Kebapçı', icon: 'restaurant' },
          { id: 'Berber', icon: 'content_cut' },
          { id: 'Oto Tamir', icon: 'build' },
          { id: 'E-Ticaret', icon: 'shopping_cart' }
        ].map(role => (
          <button 
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={\`px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all \${
              selectedRole === role.id 
                ? 'bg-[#27272a] border border-[#a855f7] font-bold text-[#e5e1e4]' 
                : 'bg-[#1c1b1d] border border-[#27272a] text-[#cfc2d6] hover:bg-[#27272a]'
            }\`}
          >
            <span className="material-symbols-outlined text-sm">{role.icon}</span> {role.id}
          </button>
        ))}
        <button className="px-3 py-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full text-xs text-[#a855f7] hover:bg-[#a855f7]/20 transition-colors">+ Özel Rol</button>
      </div>`;

content = content.replace(/<div className="flex flex-wrap gap-2">\s*<span.*?Kebapçı<\/span>\s*<span.*?Berber<\/span>\s*<span.*?Oto Tamir<\/span>\s*<span.*?E-Ticaret<\/span>\s*<button.*?\+ Özel Rol<\/button>\s*<\/div>/, rolesHtml);

// 5. Update Character Buttons
const charsHtml = `
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'Albert Einstein', icon: '🧠' },
          { id: 'William Shakespeare', icon: '📜' }
        ].map(char => (
          <button 
            key={char.id}
            onClick={() => setSelectedChar(char.id)}
            className={\`px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all \${
              selectedChar === char.id 
                ? 'bg-[#27272a] border border-[#a855f7] font-bold text-[#e5e1e4]' 
                : 'bg-[#1c1b1d] border border-[#27272a] text-[#cfc2d6] hover:bg-[#27272a]'
            }\`}
          >
            {char.icon} {char.id}
          </button>
        ))}
        <button className="px-3 py-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 rounded-full text-xs text-[#a855f7] hover:bg-[#a855f7]/20 transition-colors">+ Özel Karakter</button>
      </div>`;

content = content.replace(/<div className="flex flex-wrap gap-2">\s*<span.*?Albert Einstein<\/span>\s*<span.*?William Shakespeare<\/span>\s*<button.*?\+ Özel Karakter<\/button>\s*<\/div>/, charsHtml);

fs.writeFileSync(pagePath, content);
console.log("Updated page.tsx successfully.");
