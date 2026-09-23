"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Calendar = {
  id: string;
  merchant_id: string;
  name: string;
  is_active: boolean;
  working_hours: any;
  created_at: string;
  updated_at: string;
  services?: string[]; // IDs of services
};

export async function getCalendars(): Promise<Calendar[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from("calendars")
    .select(`
      *,
      calendar_services(service_id)
    `)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("getCalendars error:", error);
    return [];
  }

  return data.map((item: any) => ({
    ...item,
    services: item.calendar_services.map((cs: any) => cs.service_id)
  }));
}

export async function createCalendar(name: string, workingHours?: any): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("calendars")
    .insert({
      merchant_id: session.user.id,
      name,
      working_hours: workingHours || null
    });

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/ai-asistan/takvimler");
  return { success: true };
}

export async function updateCalendar(id: string, changes: Partial<Calendar>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { id: _, merchant_id: __, services: ___, ...safeChanges } = changes;
  
  const { error } = await supabase
    .from("calendars")
    .update(safeChanges)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/ai-asistan/takvimler");
  return { success: true };
}

export async function deleteCalendar(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("calendars")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/ai-asistan/takvimler");
  return { success: true };
}

export async function setCalendarServices(calendarId: string, serviceIds: string[]): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { error: delError } = await supabase
    .from("calendar_services")
    .delete()
    .eq("calendar_id", calendarId);
    
  if (delError) return { success: false, error: delError.message };
  
  if (serviceIds.length > 0) {
    const inserts = serviceIds.map(sid => ({
      calendar_id: calendarId,
      service_id: sid
    }));
    
    const { error: insError } = await supabase
      .from("calendar_services")
      .insert(inserts);
      
    if (insError) return { success: false, error: insError.message };
  }
  
  revalidatePath("/ai-asistan/takvimler");
  return { success: true };
}

