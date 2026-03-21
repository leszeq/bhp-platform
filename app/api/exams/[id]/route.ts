import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Sprawdzamy autoryzację
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pobieramy pytania przypisane do tego egzaminu i tego użytkownika
  const { data: examData } = await supabase
    .from('exams')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!examData || examData.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('exam_questions')
    .select(`
      id,
      selected_answer,
      question_bank (
        id,
        question_text,
        correct_answer,
        wrong_answers
      )
    `)
    .eq('exam_id', id)

  if (error) {
     return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
