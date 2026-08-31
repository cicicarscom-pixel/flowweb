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

    // 2. Fetch all appointments for this organization
    const { data: appointmentsData, error: apptError } = await supabase
      .from('appointments')
      .select(`
        id,
        date,
        status,
        customer_phone,
        business_services (
          name
        )
      `)
      .eq('organization_id', session.user.id)

    if (apptError) {
      console.error("Error fetching appointments for customers:", apptError)
    }

    const apptList = appointmentsData || []

    // 3. Map in JS by phone number
    const processedData = (customersData || []).map((customer: any) => {
      const customerAppts = apptList.filter((a: any) => a.customer_phone === customer.phone)
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
