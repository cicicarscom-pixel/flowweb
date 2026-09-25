'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAppointmentsByDate(dateStr: string, calendarId?: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { data: [], error: 'Unauthorized' }

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('organization_id', session.user.id)
    .like('date', `${dateStr}%`)
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

export async function getAvailableSlots(dateStr: string, serviceId: string, calendarId?: string) {
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

  let query = supabase
    .from('appointments')
    .select('date')
    .eq('organization_id', session.user.id)
    .like('date', `${dateStr}%`)
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

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

function offsetAt(ms: number, tz: string): number {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(new Date(ms)).map(x => [x.type, x.value])
  );
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ms;
}

function localToUtc(local: string, tz: string): string {
  const m = LOCAL_RE.exec(local);
  if (!m) throw new Error('INVALID_LOCAL_FORMAT');
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
  const offsets = new Set([-864e5, 0, 864e5].map(d => offsetAt(wall + d, tz)));
  const hits = [...offsets]
    .map(o => wall - o)
    .filter(c => offsetAt(c, tz) === wall - c)
    .sort((a, b) => a - b);
  if (hits.length === 0) throw new Error('INVALID_LOCAL_TIME');
  return new Date(hits[0]).toISOString();
}

export async function createAppointment(input: {
  customerName?: string
  customerPhone: string
  serviceId?: string | null
  calendarId?: string | null
  date: string 
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { data: null, error: 'Unauthorized' };
  const merchantId = user.id;

  const { data: org, error: orgError } = await supabase.from('organizations')
    .select('timezone, default_appointment_duration_minutes')
    .eq('owner_id', merchantId)
    .single();
  if (orgError || !org) return { data: null, error: 'İşletme bulunamadı' };

  let serviceDuration: number | null = null;
  if (input.serviceId) {
    const { data: svc, error } = await supabase.from('business_services')
      .select('duration_minutes')
      .eq('id', input.serviceId)
      .eq('merchant_id', merchantId)
      .maybeSingle();
    if (error) return { data: null, error: error.message };
    if (!svc) return { data: null, error: 'Geçersiz hizmet' };
    serviceDuration = svc.duration_minutes;
  }

  const { data: calendars, error: calError } = await supabase.from('calendars')
    .select('id, default_duration_minutes')
    .eq('merchant_id', merchantId)
    .eq('is_active', true);
  if (calError) return { data: null, error: calError.message };
  const calendar = input.calendarId
    ? calendars.find(c => c.id === input.calendarId)
    : calendars.length === 1 ? calendars[0] : undefined;
  if (!calendar) {
    return { data: null, error: input.calendarId ? 'Geçersiz takvim' : 'Lütfen bir takvim seçin' };
  }

  const durationMins = serviceDuration ?? calendar.default_duration_minutes ?? org.default_appointment_duration_minutes ?? 30;

  let startsAt: string;
  try {
    startsAt = localToUtc(input.date, org.timezone);
  } catch (e) {
    const code = (e as Error).message;
    return {
      data: null,
      error: code === 'INVALID_LOCAL_TIME'
        ? 'Bu saat, yaz saati geçişi nedeniyle mevcut değil'
        : 'Geçersiz tarih/saat formatı',
    };
  }
  const endsAt = new Date(Date.parse(startsAt) + durationMins * 60_000).toISOString();

  const { data, error } = await supabase.from('appointments')
    .insert({
      organization_id: merchantId,
      customer_phone: input.customerPhone,
      customer_name: input.customerName || null,
      service_id: input.serviceId || null,
      calendar_id: calendar.id,
      starts_at: startsAt,
      ends_at: endsAt,
      timezone: org.timezone,
      status: 'Pending',
      booking_token: crypto.randomUUID(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23P01') return { data: null, error: 'Bu saat dolu' };
    return { data: null, error: error.message };
  }

  revalidatePath('/ai-asistan/randevu');
  return { data, error: null };
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

