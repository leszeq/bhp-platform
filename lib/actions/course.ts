'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Nie jesteś zalogowany.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price')) || 0
  const is_active = formData.get('is_active') === 'on'

  if (!title) {
    return { error: 'Tytuł jest wymagany.' }
  }

  const { error } = await supabase
    .from('courses')
    .insert([{ title, description, price, is_active }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard', 'page')
  redirect('/dashboard')
}
