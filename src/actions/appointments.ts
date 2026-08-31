'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAppointmentsByDate(dateStr: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('organization_id', session.user.id)
    .like('date', `${dateStr}%`)
    .in('status', ['Pending', 'Approved'])
    .order('date', { ascending: true })

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

export async function getAvailableSlots(dateStr: string, serviceId: string) {
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

  const { data: taken } = await supabase
    .from('appointments')
    .select('date')
    .eq('organization_id', session.user.id)
    .like('date', `${dateStr}%`)
    .in('status', ['Pending', 'Approved'])

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
  serviceId: string
  employeeId?: string
  date: string // "YYYY-MM-DDTHH:MM:SS" formatında tam ISO datetime
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: null, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      organization_id: session.user.id,
      customer_phone: input.customerPhone,
      customer_name: input.customerName || null,
      service_id: input.serviceId,
      employee_id: input.employeeId || null,
      date: input.date,
      status: 'Pending',
      booking_token: crypto.randomUUID(),
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  revalidatePath('/ai-asistan/randevu')
  return { data, error: null }
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
