'use server'

import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/lib/services/adminService'
import { revalidatePath } from 'next/cache'

export async function updateCourseAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  console.log('[updateCourseAction] FormData keys:', Array.from(formData.keys()))
  
  // Próbujemy wyciągnąć klucze bezpośrednio lub z prefiksami (czasem Next.js dodaje prefiksy typu 1_)
  const title = (formData.get('title') || formData.get('1_title')) as string
  const rawPrice = formData.get('price') || formData.get('1_price')
  const price = Number(rawPrice) || 0

  console.log('[updateCourseAction] Parsed:', { title, price })

  try {
    await adminService.updateCourse(id, { title, price })
    revalidatePath(`/admin/courses/${id}`)
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function verifyQuestionAction(id: string) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    await adminService.verifyQuestion(id)
    revalidatePath('/admin/questions')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteQuestionAction(id: string) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    await adminService.deleteQuestion(id)
    revalidatePath('/admin/questions')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteLessonAction(id: string, courseId: string) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    await adminService.deleteLesson(id)
    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function createLessonAction(courseId: string, title: string, content: string, orderIndex: number) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    await adminService.createLesson({
      course_id: courseId,
      title,
      content,
      order_index: orderIndex
    })
    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteCourseAction(id: string) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    await adminService.deleteCourse(id)
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
export async function createCourseWithQuestionsAction(title: string, description: string, price: number, questionIds: string[]) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    const course = await adminService.createCourseWithQuestions({
      title,
      description,
      price,
      is_active: true
    }, questionIds)
    
    revalidatePath('/admin/courses')
    revalidatePath('/dashboard')
    return { success: true, courseId: course.id }
  } catch (err: any) {
    return { error: err.message }
  }
}
export async function createQuestionAction(data: {
  course_id: string | null,
  question_text: string,
  correct_answer: string,
  wrong_answers: string[]
}) {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)

  try {
    const { error } = await supabase
      .from('question_bank')
      .insert({
        ...data,
        is_verified: false, // Ustawiamy na false, aby admin widział je na liście moderacji i mógł potwierdzić
        created_by: 'admin_manual'
      })

    if (error) throw error
    revalidatePath('/admin/questions')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
