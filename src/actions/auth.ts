'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function authenticate(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const mode = formData.get('mode') as 'login' | 'signup'
  const fullName = formData.get('fullName') as string

  let result;
  if (mode === 'signup') {
    result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          authorized_person: fullName,
          full_name: fullName
        }
      }
    })
    
    // Also try to update profile if user was created
    if (result.data?.user && fullName) {
      await supabase.from('profiles').update({
        authorized_person: fullName
      }).eq('id', result.data.user.id)
    }
  } else {
    result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const { error } = result;

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
