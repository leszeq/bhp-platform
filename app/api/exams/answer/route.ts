import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ExamService } from '@/lib/services/examService'

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
     const { exam_id, question_id, answer } = await req.json()

     if (!exam_id || !question_id || answer === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
     }

     const examService = new ExamService(supabase)
     const { isCorrect } = await examService.submitAnswer(exam_id, question_id, answer)

     return NextResponse.json({ success: true, is_correct: isCorrect })
  } catch (error: any) {
     console.error('[EXAM_ANSWER] Error:', error)
     return NextResponse.json({ error: error.message || 'Failed to submit answer' }, { status: 500 })
  }
}
