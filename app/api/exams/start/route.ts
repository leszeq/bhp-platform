import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { course_id } = await req.json()

  // 1. Create exam
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert([{ course_id, user_id: user.id }])
    .select()
    .single()

  if (examError || !exam) {
    return NextResponse.json({ error: examError?.message || 'Failed to create exam' }, { status: 400 })
  }

  // 2. Get random verified questions
  const { data: questions } = await supabase
    .from('question_bank')
    .select('*')
    .eq('course_id', course_id)
    .eq('is_verified', true)

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'No questions available for this course' }, { status: 404 })
  }

  // Shuffle and pick 5
  const shuffled = questions
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  // 3. Assign questions
  const examQuestions = shuffled.map((q) => ({
    exam_id: exam.id,
    question_id: q.id,
  }))

  const { error: insertError } = await supabase.from('exam_questions').insert(examQuestions)
  if (insertError) {
     return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ exam_id: exam.id })
}
