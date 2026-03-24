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

  const exams = Array.isArray(eq.exams) ? eq.exams[0] : eq.exams
  const qb = Array.isArray(eq.question_bank) ? eq.question_bank[0] : eq.question_bank

  if (!exams || !qb) {
    console.error('[ANSWER] Missing relation data:', { exams: !!exams, qb: !!qb })
    return NextResponse.json({ error: 'Data integrity error' }, { status: 500 })
  }

  // Check if this exam belongs to user
  if ((exams as any).user_id !== user.id) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const correctAnswer = qb.correct_answer
  const isCorrect = correctAnswer?.toString().trim() === answer?.toString().trim()

  console.log('[ANSWER] Comparison:', {
    questionId: eq.id,
    received: `|${answer}|`,
    expected: `|${correctAnswer}|`,
    match: isCorrect,
    qb_type: Array.isArray(eq.question_bank) ? 'array' : 'object'
  })

  const { error: updateError } = await supabase
    .from('exam_questions')
    .update({
      selected_answer: answer,
      is_correct: isCorrect,
    })
    .eq('id', exam_question_id)

  if (updateError) {
    console.error('[ANSWER] Update error:', updateError)
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, isCorrect })
}
