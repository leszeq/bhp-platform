'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCompany(formData: FormData) {
  const name = formData.get('name') as string
  if (!name || name.trim() === '') {
    return { error: 'Nazwa firmy jest wymagana.' }
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Błąd autoryzacji. Spróbuj zalogować się ponownie.' }
  }

  // Wstawienie firmy do bazy
  const { error } = await supabase.from('companies').insert({ 
    owner_id: user.id, 
    name 
  })

  // Obsługa błędów bazy, upewnijmy się że RLS nie odrzuca wpisu
  if (error) {
    console.error('Błąd podczas zapisywania w DB:', error)
    return { error: 'Wystąpił błąd po stronie bazy danych. Szczegóły: ' + error.message }
  }

  // Wymuś odświeżenie danych o firmie dla obecnego route-a
  revalidatePath('/dashboard/b2b')
  return { success: true }
}

export async function resendInvitationEmail(email: string) {
  const supabase = await createClient()

  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('email', email)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (invError || !invitation) {
    return { error: 'Nie znaleziono aktywnego zaproszenia dla tego adresu email.' }
  }

  const { headers } = await import('next/headers')
  const host = (await headers()).get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  const link = `${origin}/join?token=${invitation.token}`

  const { reminderEmail } = await import('@/emails/templates')
  const { sendEmail } = await import('@/utils/sendEmail')

  const emailContent = reminderEmail(link)
  const result = await sendEmail(email, emailContent.subject, emailContent.html)

  if (!result.success) {
    return { error: 'Błąd wysyłki e-mail: ' + result.error }
  }

  await supabase
    .from('invitations')
    .update({
      reminder_count: (invitation.reminder_count || 0) + 1,
      email_sent_at: new Date().toISOString()
    })
    .eq('id', invitation.id)

  revalidatePath('/dashboard/b2b')
  return { success: true }
}
