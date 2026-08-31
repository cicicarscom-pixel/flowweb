'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers() {
  try {
    const supabase = await createClient()

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      throw new Error("Unauthorized")
    }

    const { data, error } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        phone,
        created_at,
        appointments (
          id,
          date,
          status,
          business_services (
            name
          )
        )
      `)
      .eq('organization_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)
      return []
    }

    // Process data to calculate total appointments and last visit
    const processedData = data.map((customer: any) => {
      const appointments = customer.appointments || []
      const sortedAppts = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const lastVisit = sortedAppts.length > 0 ? sortedAppts[0].date : null
      
      return {
        id: customer.id,
        name: customer.name || 'İsimsiz',
        phone: customer.phone,
        created_at: customer.created_at,
        total_appointments: appointments.length,
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
