import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session?.user) {
      const user = data.session.user;
      
      const adminSupabase = createAdminClient();
      
      const { data: profileData } = await adminSupabase
        .from('profiles')
        .select('user_type, authorized_person, avatar_url')
        .eq('id', user.id)
        .limit(1);
        
      const profile = profileData?.[0] || null;
      const updates: any = {};
      let createdOrg = false;

      // Ensure user_type is set for flowweb
      if (!profile?.user_type) {
        updates.user_type = 'business';
        createdOrg = true;
      }
      
      // If user signed in with Google, sync profile data
      if (user.app_metadata?.provider === 'google') {
        const metadata = user.user_metadata;
        const fullName = metadata?.full_name || metadata?.name;
        const avatarUrl = metadata?.avatar_url || metadata?.picture;
        
        if (!profile?.authorized_person && fullName) updates.authorized_person = fullName;
        if (!profile?.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
      }

      if (Object.keys(updates).length > 0) {
        await adminSupabase.from('profiles').update(updates).eq('id', user.id);
      }

      if (createdOrg) {
        const { error: insertErr } = await adminSupabase.from('organizations').insert({ owner_id: user.id, name: null });
        if (insertErr) console.error("Org creation error:", insertErr);
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
