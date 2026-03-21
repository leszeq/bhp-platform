import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { exam_question_id, answer } = await req.json()

  const { data: eq, error: eqError } = await supabase
    .from('exam_questions')
    .select(`
      id,
      exam_id,
      exams ( user_id ),
      question_bank (correct_answer)
    `)
    .eq('id', exam_question_id)
    .single()

  if (eqError || !eq || !eq.question_bank) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Check if this exam belongs to user
  if ((eq.exams as any).user_id !== user.id) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const isCorrect = (eq.question_bank as any).correct_answer === answer

  await supabase
    .from('exam_questions')
    .update({
      selected_answer: answer,
      is_correct: isCorrect,
    })
    .eq('id', exam_question_id)

  return NextResponse.json({ ok: true, isCorrect })
}
