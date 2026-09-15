const fs = require('fs');
let c = fs.readFileSync('src/app/(dashboard)/sosyal-medya/page.tsx', 'utf8');
c = c.replace(`.eq('is_active', true)`, `.or('is_active.eq.true,needs_reconnection.eq.true')`);
fs.writeFileSync('src/app/(dashboard)/sosyal-medya/page.tsx', c);
