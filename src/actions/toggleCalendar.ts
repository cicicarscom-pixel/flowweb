"use server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSSRClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMultiCalendarMode(enabled: boolean) {
  // First verify user is authenticated
  const ssrSupabase = await createSSRClient();
  const { data: { session } } = await ssrSupabase.auth.getSession();
  if (!session) return { error: "No session" };
  
  // Use admin client to bypass RLS for this specific toggle
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .update({ multi_calendar_enabled: enabled })
    .eq("owner_id", session.user.id)
    .select();
    
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: "No organization found for your user ID." };
  
  revalidatePath("/ai-asistan");
  return { success: true, data };
}

