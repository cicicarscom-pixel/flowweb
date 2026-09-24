import * as fs from 'fs';

let content = fs.readFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', 'utf8');

content = content.replace(
    'const { supabase } = await import("@/shared");',
    ''
);

content = content.replace(
    'const client = await supabase();',
    'const { createClient } = await import("@/lib/supabase/client");\n                          const client = createClient();'
);

fs.writeFileSync('src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', content, 'utf8');
console.log("Fixed supabase client import for vercel build");
