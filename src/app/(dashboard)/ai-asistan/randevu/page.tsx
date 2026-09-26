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

  // Bugünün tarihini YYYY-MM-DD formatında al (Yerel Saat Dilimine Göre)
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(now.getTime() - offsetMs)
  const today = localDate.toISOString().split('T')[0]

  let businessServices = []
  try {
    businessServices = await getBusinessServices(session.user.id)
  } catch (error) {
    console.error('getBusinessServices Error:', error)
    // Hata durumunda bo� liste ile devam ediyoruz ki sayfa ��kmesin
  }

  const { data: org } = await supabase.from("organizations").select("multi_calendar_enabled").eq("owner_id", session.user.id).single();
  const multiCalendarEnabled = org?.multi_calendar_enabled || false;
  const { getCalendars } = await import("@/actions/calendars");
  const calendars = await getCalendars();
  const appointmentsRes = await getAppointmentsByDate(today)

  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#fff' }}>Yükleniyor...</div>}>
      <RandevuClient 
      initialAppointments={appointmentsRes.data} 
      services={businessServices} 
      merchantId={session.user.id} 
      today={today}
      initialCalendars={calendars}
      multiCalendarEnabled={multiCalendarEnabled}
    />
    </Suspense>
  )
}
