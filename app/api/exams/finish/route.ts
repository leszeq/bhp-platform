import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { exam_id } = await req.json()

  const { data: examData } = await supabase
    .from('exams')
    .select('user_id')
    .eq('id', exam_id)
    .single()

  if (!examData || examData.user_id !== user.id) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: answers, error: answerError } = await supabase
    .from('exam_questions')
    .select('is_correct')
    .eq('exam_id', exam_id)

  if (answerError || !answers) {
    return NextResponse.json({ error: 'No answers found' }, { status: 400 })
  }

  const correct = answers.filter(a => a.is_correct === true).length
  const total = answers.length
  const score = total > 0 ? Math.round((correct / total) * 100) : 0

  console.log('[FINISH] Exam:', exam_id, {
    correct,
    total,
    score,
    details: answers.map(a => a.is_correct)
  })

  const status = score >= 70 ? 'passed' : 'failed'

  const { error: updateError } = await supabase
    .from('exams')
    .update({
      score,
      status,
      finished_at: new Date().toISOString(),
    })
    .eq('id', exam_id)

  if (updateError) {
    console.error('[FINISH] Status update error:', updateError)
    return NextResponse.json({ error: 'Nie udało się zaktualizować statusu egzaminu' }, { status: 500 })
  }

  return NextResponse.json({ 
    score, 
    status,
    correct,
    total,
    passed: score >= 70 
  })
}
