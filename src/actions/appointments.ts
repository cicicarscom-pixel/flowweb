'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAppointmentsByDate(dateStr: string, calendarId?: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('organization_id', session.user.id)
    .gte('date', `${dateStr}T00:00:00`)
    .lt('date', `${nextDayStr}T00:00:00`)
    .in('status', ['Pending', 'Approved'])
    .order('date', { ascending: true })

  if (calendarId) {
    query = query.eq('calendar_id', calendarId);
  }

  const { data: appointments, error } = await query;

  if (error) return { data: [], error: error.message }
  if (!appointments || appointments.length === 0) return { data: [], error: null }

  const appointmentIds = appointments.map((a) => a.id)

  const { data: links } = await supabase
    .from('appointment_services')
    .select('appointment_id, service_id')
    .in('appointment_id', appointmentIds)

  const { data: services } = await supabase
    .from('business_services')
    .select('id, name')
    .eq('merchant_id', session.user.id)

  const serviceNameById = new Map((services || []).map((s) => [s.id, s.name]))

  const servicesByAppointment = new Map<string, string[]>()
  for (const link of links || []) {
    const name = serviceNameById.get(link.service_id)
    if (!name) continue
    const list = servicesByAppointment.get(link.appointment_id) || []
    list.push(name)
    servicesByAppointment.set(link.appointment_id, list)
  }

  const enriched = appointments.map((a) => ({
    ...a,
    services:
      servicesByAppointment.get(a.id) ||
      (a.service_id && serviceNameById.get(a.service_id)
        ? [serviceNameById.get(a.service_id) as string]
        : []),
  }))

  return { data: enriched, error: null }
}

export async function getAvailableSlots(dateStr: string, serviceId?: string, calendarId?: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  const { data: service } = await supabase
    .from('business_services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .eq('merchant_id', session.user.id)
    .single()

  const duration = service?.duration_minutes || 30

  const nextDay2 = new Date(dateStr); nextDay2.setDate(nextDay2.getDate() + 1); const nextDayStr = nextDay2.toISOString().split('T')[0];
  let query = supabase
    .from('appointments')
    .select('date')
    .eq('organization_id', session.user.id)
    .gte('date', `${dateStr}T00:00:00`).lt('date', `${nextDayStr}T00:00:00`)
    .in('status', ['Pending', 'Approved'])

  if (calendarId) {
    query = query.eq('calendar_id', calendarId);
  }

  const { data: taken } = await query;

  const takenTimes = new Set(
    (taken || []).map((r) => {
      const d = r.date || ''
      const t = d.includes('T') ? d.split('T')[1] : d.split(' ')[1] || ''
      return t.substring(0, 5)
    })
  )

  const slots: string[] = []
  for (let h = 9; h < 18; h++) {
    for (let m = 0; m < 60; m += duration) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      if (!takenTimes.has(time)) slots.push(time)
    }
  }

  return { data: slots, error: null }
}

export async function createAppointment(input: {
  customerName?: string
  customerPhone: string
  serviceId?: string | null
  calendarId?: string | null
  date: string // format: YYYY-MM-DDTHH:mm
  note?: string 
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const { data, error } = await supabase.rpc("create_manual_appointment", {
    p_local_start: input.date.substring(0, 16),
    p_customer_name: input.customerName || null,
    p_customer_phone: input.customerPhone,
    p_calendar_id: input.calendarId || null,
    p_service_id: input.serviceId || null,
    p_request_raw: input.note || null,
    p_source: "web"
  });

  if (error) {
    return { data: null, error: error.message };
  }

  switch (data.status) {
    case "SUCCESS":
      revalidatePath("/ai-asistan/randevu");
      return { data, error: null };
    case "SLOT_TAKEN": return { data: null, error: "Bu saat dolu" };
    case "CUSTOMER_TIME_CONFLICT": return { data: null, error: "Bu müşterinin bu saatte başka randevusu var" };
    case "CALENDAR_REQUIRED": return { data: null, error: "Lütfen bir doktor/takvim seçin" };
    case "INVALID_LOCAL_TIME": return { data: null, error: "Bu saat, saat değişikliği nedeniyle mevcut değil" };
    case "CUSTOMER_REQUIRED": return { data: null, error: "Müşteri adı ve telefonu zorunlu" };
    default: return { data: null, error: "Randevu oluşturulamadı (" + data.status + ")" };
  }
}

export async function updateAppointmentStatus(id: string, status: 'Approved' | 'Cancelled') {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: null, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .eq('organization_id', session.user.id) // RLS'e ek, kod seviyesinde de garanti
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath('/ai-asistan/randevu')
  return { data, error: null }
}


