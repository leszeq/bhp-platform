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
    const { course_id } = await req.json()
    if (!course_id) {
      return NextResponse.json({ error: 'Missing course_id' }, { status: 400 })
    }

    const examService = new ExamService(supabase)
    const exam = await examService.startExam(course_id, user.id)

    return NextResponse.json({ exam_id: exam.id })
  } catch (error: any) {
    console.error('[EXAM_START] Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to start exam' }, { status: 500 })
  }
}
