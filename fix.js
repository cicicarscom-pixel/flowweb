const fs = require('fs');
const file = 'C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/isletme-hizmetleri/HizmetAyarlariClient.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'e.stopPropagation();', 
  'e.preventDefault();\n    e.stopPropagation();'
);

code = code.replace(
  '<button onClick={(e) => handleDelete(svc.id, e)} className="w-8 h-8 rounded bg-red-900/20',
  '<button type="button" onClick={(e) => handleDelete(svc.id, e)} className="relative z-10 w-8 h-8 rounded bg-red-900/20'
);

fs.writeFileSync(file, code, 'utf8');
