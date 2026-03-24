import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../supabase/database.types'

export type ExamWithQuestions = Database['public']['Tables']['exams']['Row'] & {
  exam_questions: (Database['public']['Tables']['exam_questions']['Row'] & {
    question_bank: Database['public']['Tables']['question_bank']['Row']
  })[]
}

export class ExamService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async startExam(courseId: string, userId: string) {
    // 1. Create exam
    const { data: exam, error: examError } = await this.supabase
      .from('exams')
      .insert([{ course_id: courseId, user_id: userId }])
      .select()
      .single()

    if (examError || !exam) throw new Error(examError?.message || 'Failed to create exam')

    // 2. Get questions
    const { data: questions } = await this.supabase
      .from('question_bank')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_verified', true)

    if (!questions || questions.length === 0) {
      throw new Error('No verified questions available for this course')
    }

    // Shuffle and pick 5
    const shuffled = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)

    // 3. Assign to exam
    const examQuestions = shuffled.map((q) => ({
      exam_id: exam.id,
      question_id: q.id,
    }))

    const { error: insertError } = await this.supabase
      .from('exam_questions')
      .insert(examQuestions)

    if (insertError) throw new Error(insertError.message)

    return exam
  }

  async getExamWithQuestions(examId: string): Promise<ExamWithQuestions> {
    const { data, error } = await this.supabase
      .from('exams')
      .select(`
        *,
        exam_questions (
          *,
          question_bank (*)
        )
      `)
      .eq('id', examId)
      .single()

    if (error || !data) throw new Error(error?.message || 'Exam not found')
    return data as any // Supabase join types can be tricky
  }

  async submitAnswer(examId: string, questionId: string, selectedAnswer: string) {
    // 1. Get correct answer
    const { data: qData } = await this.supabase
      .from('question_bank')
      .select('correct_answer')
      .eq('id', questionId)
      .single()

    if (!qData) throw new Error('Question not found')

    const isCorrect = qData.correct_answer?.trim() === selectedAnswer.trim()

    // 2. Update exam_questions
    const { error } = await this.supabase
      .from('exam_questions')
      .update({
        selected_answer: selectedAnswer,
        is_correct: isCorrect
      })
      .eq('exam_id', examId)
      .eq('question_id', questionId)

    if (error) throw new Error(error.message)

    return { isCorrect }
  }

  async finishExam(examId: string) {
    const { data: answers } = await this.supabase
      .from('exam_questions')
      .select('is_correct')
      .eq('exam_id', examId)

    if (!answers) throw new Error('No answers found for this exam')

    const total = answers.length
    const correct = answers.filter((a) => a.is_correct).length
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    const status = score >= 70 ? 'passed' : 'failed'

    const { error: updateError } = await this.supabase
      .from('exams')
      .update({
        score,
        status,
        finished_at: new Date().toISOString()
      })
      .eq('id', examId)

    if (updateError) throw new Error(updateError.message)

    return { score, status, correct, total, passed: score >= 70 }
  }

  async getPassedExamForCourse(userId: string, courseId: string) {
    const { data } = await this.supabase
      .from('exams')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'passed')
      .order('finished_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return data
  }
}
