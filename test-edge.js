const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qybzidylewzsnmlofjul.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YnppZHlsZXd6c25tbG9manVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk3MTMsImV4cCI6MjA5NTgzNTcxM30.WNnzSFMEueVJg_TLaWXdpkadKkw-fJk0vSyNBdHbPrU');

async function test() {
  const { data: comments } = await supabase.from('comments').select('organization_id').limit(1);
  if (!comments || comments.length === 0) { console.log('No comments found.'); return; }
  const orgId = comments[0].organization_id;
  console.log('Org ID:', orgId);
  const { data, error } = await supabase.functions.invoke('zernio-client', {
    body: { action: 'get-inbox-pictures', payload: { organizationId: orgId } }
  });
  console.log('Result:', JSON.stringify(data, null, 2));
}
test();
