'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers() {
  try {
    const supabase = await createClient()

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      throw new Error("Unauthorized")
    }

    // 1. Fetch customers
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('id, name, phone, created_at')
      .eq('organization_id', session.user.id)
      .order('created_at', { ascending: false })

    if (customersError) {
      console.error("Error fetching customers:", customersError)
      return []
    }

    // 2. Fetch appointments (no nested embed)
    const { data: appointmentsData, error: apptError } = await supabase
      .from('appointments')
      .select('id, date, status, customer_phone, service_id')
      .eq('organization_id', session.user.id)

    if (apptError) {
      console.error("Error fetching appointments for customers:", apptError)
    }

    const apptList = appointmentsData || []

    // 3. Fetch business_services
    const { data: servicesData } = await supabase
      .from('business_services')
      .select('id, name')
      .eq('merchant_id', session.user.id)
    const serviceNameById = new Map((servicesData || []).map((s: any) => [s.id, s.name]))

    // 4. Fetch appointment_services
    const appointmentIds = apptList.map((a: any) => a.id)
    const servicesByAppointment: Record<string, string[]> = {}
    if (appointmentIds.length > 0) {
      const { data: apptServices } = await supabase
        .from('appointment_services')
        .select('appointment_id, service_id')
        .in('appointment_id', appointmentIds)
      
      for (const row of apptServices || []) {
        const name = serviceNameById.get(row.service_id)
        if (!name) continue
        if (!servicesByAppointment[row.appointment_id]) servicesByAppointment[row.appointment_id] = []
        servicesByAppointment[row.appointment_id].push(name)
      }
    }

    // 5. Map in JS by phone number
    const processedData = (customersData || []).map((customer: any) => {
      const customerAppts = apptList.filter((a: any) => a.customer_phone === customer.phone).map((a: any) => {
        // Build services array for this appointment
        const sList = servicesByAppointment[a.id] || []
        if (sList.length === 0 && a.service_id) {
          const fallback = serviceNameById.get(a.service_id)
          if (fallback) sList.push(fallback)
        }
        return { ...a, services: sList }
      })

      const sortedAppts = [...customerAppts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const lastVisit = sortedAppts.length > 0 ? sortedAppts[0].date : null
      
      return {
        id: customer.id,
        name: customer.name || 'İsimsiz',
        phone: customer.phone,
        created_at: customer.created_at,
        total_appointments: customerAppts.length,
        last_visit: lastVisit,
        history: sortedAppts
      }
    })

    return processedData

  } catch (error) {
    console.error("Customers fetch exception:", error)
    return []
  }
}
