'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
// Dla obejścia RLS przy rejestracji zaproszenia
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    let errorMsg = error.message
    if (error.message.includes('Invalid login credentials')) {
      errorMsg = 'Nieprawidłowy adres e-mail lub hasło.'
    }
    return { error: errorMsg }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  if (!email) return { error: 'Podaj adres e-mail.' }

  const nextUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/auth/callback?next=/update-password' 
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: nextUrl,
  })

  if (error) {
    return { error: 'Wystąpił błąd podczas wysyłania linku. Spróbuj ponownie później.' }
  }

  return { success: 'Wysłaliśmy link do resetu hasła na Twój adres e-mail.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  
  if (!password || password.length < 6) return { error: 'Hasło musi mieć co najmniej 6 znaków.' }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Wiadomość z bazy: ' + error.message }
  }

  // Wylogowujemy uzytkownika po resecie zeby zmusil do ponownego zalogowania (dobry wzorzec bezpieczenstwa)
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login?reset_success=true')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const companyId = formData.get('companyId') as string

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // After sign-up, sign the user in immediately
  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  
  if (companyId && authData.user) {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // przypisanie usera do firmy w architekturze b2b
    await supabaseAdmin.from('company_users').insert({
      company_id: companyId,
      user_id: authData.user.id
    })
  }

  if (signInError) {
    return { success: 'Konto zostało utworzone. Zaloguj się, aby kontynuować.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
