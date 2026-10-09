'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCustomers() {
  try {
    const supabase = await createClient()

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      throw new Error("Unauthorized")
    }

    const { data, error } = await supabase.rpc('get_customers')

    if (error) {
      console.error("Error fetching customers:", error)
      return []
    }

    return data || []

  } catch (error) {
    console.error("Customers fetch exception:", error)
    return []
  }
}

export async function getCustomerAppointments(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_customer_appointments', { p_customer_id: id })
    
    if (error) {
      console.error("Error fetching customer appointments:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Customer appointments fetch exception:", error)
    return []
  }
}

export async function updateCustomerNotes(id: string, notes: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('update_customer_notes', { p_customer_id: id, p_notes: notes })
    
    if (error) {
      console.error("Error updating customer notes:", error)
      return { status: 'ERROR', error }
    }
    
    return data || { status: 'ERROR' }
  } catch (error) {
    console.error("Customer notes update exception:", error)
    return { status: 'ERROR' }
  }
}

export async function createCustomer(name: string, phone: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('create_customer', { p_name: name, p_phone: phone })
    
    if (error) {
      console.error("Error creating customer:", error)
      return { status: 'ERROR', error }
    }
    
    return data || { status: 'ERROR' }
  } catch (error) {
    console.error("Create customer exception:", error)
    return { status: 'ERROR' }
  }
}