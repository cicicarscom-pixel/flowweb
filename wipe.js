const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function wipe() {
  console.log("Starting wipe...");

  // 1. Storage
  const bucketsToEmpty = ['avatars', 'invoices', 'finance_receipts', 'documents'];
  for (const b of bucketsToEmpty) {
    const { data: files } = await supabaseAdmin.storage.from(b).list();
    if (files && files.length > 0) {
      console.log(`Deleting ${files.length} files from ${b}`);
      const { error } = await supabaseAdmin.storage.from(b).remove(files.map(f => f.name));
      if (error) console.error(`Error deleting from ${b}:`, error);
    } else {
      console.log(`Bucket ${b} is empty`);
    }
  }

  // 2. Auth users
  let more = true;
  let deletedCount = 0;
  while (more) {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("Error listing users:", error);
      break;
    }
    if (users?.users && users.users.length > 0) {
      for (const u of users.users) {
        console.log(`Deleting user ${u.id}...`);
        const { error: e2 } = await supabaseAdmin.auth.admin.deleteUser(u.id);
        if (e2) {
          console.error(`Failed to delete ${u.id}:`, e2);
          more = false;
        } else {
          deletedCount++;
        }
      }
    } else {
      more = false;
    }
  }
  console.log(`Deleted ${deletedCount} users.`);

  // 3. Delete leftover rows in tables
  console.log("Deleting leftover table rows...");
  await supabaseAdmin.from('accountant_clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('organizations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log("Deleted leftover rows.");

  // 4. Verification
  console.log("Verifying...");
  const { data: vUsers } = await supabaseAdmin.auth.admin.listUsers();
  const { count: vProfiles } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
  const { count: vOrgs } = await supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true });
  const { count: vClients } = await supabaseAdmin.from('accountant_clients').select('*', { count: 'exact', head: true });

  let vStorage = 0;
  for (const b of bucketsToEmpty) {
    const { data } = await supabaseAdmin.storage.from(b).list();
    vStorage += data?.length || 0;
  }

  const { data: aiPersonas } = await supabaseAdmin.storage.from('ai-personas').list();
  const { data: refPics } = await supabaseAdmin.storage.from('referans_resimler').list();

  console.log(JSON.stringify({
    verification: {
      users: vUsers?.users?.length || 0,
      profiles: vProfiles,
      orgs: vOrgs,
      clients: vClients,
      user_files: vStorage
    },
    system_buckets: {
      ai_personas: aiPersonas?.length || 0,
      referans_resimler: refPics?.length || 0
    }
  }, null, 2));
}

wipe();
