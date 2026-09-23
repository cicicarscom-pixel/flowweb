"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMultiCalendarMode(enabled: boolean) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: "No session" };
  
  const { data, error } = await supabase
    .from("organizations")
    .update({ multi_calendar_enabled: enabled })
    .eq("owner_id", session.user.id)
    .select();
    
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: "No row updated. RLS issue or no organization found for this owner." };
  
  revalidatePath("/ai-asistan");
  return { success: true, data };
}

