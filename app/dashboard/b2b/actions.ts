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
