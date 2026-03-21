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

  const correct = answers.filter(a => a.is_correct).length
  const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0

  const status = score >= 70 ? 'passed' : 'failed'

  await supabase
    .from('exams')
    .update({
      score,
      status,
      finished_at: new Date().toISOString(),
    })
    .eq('id', exam_id)

  return NextResponse.json({ score, status })
}
