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
    const { exam_id } = await req.json()
    if (!exam_id) {
      return NextResponse.json({ error: 'Missing exam_id' }, { status: 400 })
    }

    const examService = new ExamService(supabase)
    const result = await examService.finishExam(exam_id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[EXAM_FINISH] Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to finish exam' }, { status: 500 })
  }
}
