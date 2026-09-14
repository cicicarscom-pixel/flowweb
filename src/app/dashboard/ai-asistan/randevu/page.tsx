import { createClient } from '@/lib/supabase/server'
import { getAppointmentsByDate } from '@/actions/appointments'
import { getBusinessServices } from '@/actions/businessServices'
import RandevuClient from './RandevuClient'
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

  const appointmentsRes = await getAppointmentsByDate(today)

  return (
    <RandevuClient 
      initialAppointments={appointmentsRes.data} 
      services={businessServices} 
      merchantId={session.user.id} 
      today={today}
    />
  )
}
