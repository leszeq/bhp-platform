import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { course_id, user_id } = await req.json()

  // 1. create exam
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .insert([{ course_id, user_id }])
    .select()
    .single()

  if (examError || !exam) {
    return NextResponse.json({ error: examError }, { status: 500 })
  }

  // 2. get random questions
  const { data: questions } = await supabase
    .from('question_bank')
    .select('*')
    .eq('course_id', course_id)
    .eq('is_verified', true)
    .limit(10)

  // 3. assign questions
  if (questions && questions.length > 0) {
    const examQuestions = questions.map(q => ({
      exam_id: exam.id,
      question_id: q.id,
    }))

    await supabase.from('exam_questions').insert(examQuestions)
  }

  return NextResponse.json({ exam_id: exam.id })
}
