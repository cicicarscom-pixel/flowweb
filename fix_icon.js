const fs = require('fs');
let c = fs.readFileSync('src/app/(dashboard)/gelen-kutusu/page.tsx', 'utf8');
c = c.replace(
  `case 'linkedin': return <i className="fa-brands fa-linkedin text-[#0077b5]"></i>;`,
  `case 'linkedin': return <i className="fa-brands fa-linkedin text-[#0077b5]"></i>;\n      case 'tiktok': return <i className="fa-brands fa-tiktok text-[#69C9D0]"></i>;`
);
fs.writeFileSync('src/app/(dashboard)/gelen-kutusu/page.tsx', c);
