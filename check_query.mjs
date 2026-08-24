import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('accounting_firms')
    .select(`
      name,
      accounting_firm_members (
        profiles (
          authorized_person,
          avatar_url,
          phone
        )
      )
    `)
    .limit(1);
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
test();
