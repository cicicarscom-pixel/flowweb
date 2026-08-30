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

  // Bug�n�n tarihini YYYY-MM-DD format�nda al
  const today = new Date().toISOString().split('T')[0]

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
