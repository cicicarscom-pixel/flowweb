const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qybzidylewzsnmlofjul.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YnppZHlsZXd6c25tbG9manVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk3MTMsImV4cCI6MjA5NTgzNTcxM30.WNnzSFMEueVJg_TLaWXdpkadKkw-fJk0vSyNBdHbPrU');

async function test() {
  const { data, error } = await supabase.rpc('get_table_columns_debug'); 
  // No custom rpc. Wait, I can try select on some rows and hope for a row that has no RLS? No, RLS is active.
  const { error: err2 } = await supabase.from('comments').select('unknown_column_abc123').limit(1);
  console.log(err2);
}
test();
