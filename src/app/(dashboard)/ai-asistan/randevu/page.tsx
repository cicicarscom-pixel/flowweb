import { createClient } from '@/lib/supabase/server'
import { getAppointmentsByDate } from '@/actions/appointments'
import { getBusinessServices } from '@/actions/businessServices'
import RandevuClient from './RandevuClient'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

export default async function RandevuPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  const { data: org } = await supabase.from("organizations").select("multi_calendar_enabled, timezone").eq("owner_id", session.user.id).single();
  const timezone = org?.timezone || 'Europe/Istanbul';
  const { todayInTimezone } = await import('@/lib/dates');
  const today = todayInTimezone(timezone);

  const { getCurrentOrgId } = await import('@/lib/org');
  const orgId = await getCurrentOrgId(supabase);

  let businessServices = [];
  try {
    businessServices = await getBusinessServices();
  } catch (error) {
    console.error('getBusinessServices Error:', error);
  }
  const multiCalendarEnabled = org?.multi_calendar_enabled || false;
  const { getCalendars } = await import("@/actions/calendars");
  const calendars = await getCalendars();
  const appointmentsRes = await getAppointmentsByDate(today)

  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#fff' }}>Yükleniyor...</div>}>
      <RandevuClient 
      initialAppointments={appointmentsRes.data} 
      services={businessServices} 
      orgId={orgId}
      today={today}
      initialCalendars={calendars}
      multiCalendarEnabled={multiCalendarEnabled}
    />
    </Suspense>
  )
}
