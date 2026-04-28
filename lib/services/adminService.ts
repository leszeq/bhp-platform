import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../supabase/database.types'

export class AdminService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Pobiera statystyki dla dashboardu admina
   */
  async getStats() {
    const [
      { count: coursesCount },
      { count: usersCount },
      { count: certificatesCount }
    ] = await Promise.all([
      this.supabase.from('courses').select('*', { count: 'exact', head: true }),
      this.supabase.from('profiles').select('*', { count: 'exact', head: true }),
      this.supabase.from('certificates').select('*', { count: 'exact', head: true })
    ])

    return {
      courses: coursesCount || 0,
      users: usersCount || 0,
      certificates: certificatesCount || 0
    }
  }

  /**
   * Aktualizuje dane kursu
   */
  async updateCourse(id: string, data: Partial<Database['public']['Tables']['courses']['Update']>) {
    const { data: updatedData, error } = await this.supabase
      .from('courses')
      .update(data)
      .eq('id', id)
      .select()

    if (error) throw error
    if (!updatedData || updatedData.length === 0) {
      throw new Error('Nie znaleziono kursu lub brak uprawnień (RLS).')
    }
    return true
  }

  /**
   * Pobiera wszystkie pytania oczekujące na weryfikację
   */
  async getUnverifiedQuestions() {
    const { data, error } = await this.supabase
      .from('question_bank')
      .select('*, courses(title)')
      .eq('is_verified', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Zatwierdza pytanie
   */
  async verifyQuestion(id: string) {
    const { error } = await this.supabase
      .from('question_bank')
      .update({ is_verified: true })
      .eq('id', id)

    if (error) throw error
    return true
  }

  /**
   * Usuwa pytanie z banku
   */
  async deleteQuestion(id: string) {
    const { error } = await this.supabase
      .from('question_bank')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  /**
   * Usuwa kurs
   */
  async deleteCourse(id: string) {
    const { data: deletedData, error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .select()

    if (error) throw error
    if (!deletedData || deletedData.length === 0) {
      throw new Error('Nie znaleziono kursu lub brak uprawnień (RLS).')
    }
    return true
  }

  /**
   * Pobiera listę wszystkich użytkowników
   */
  async getAllUsers() {
    const { data: profiles, error: pError } = await this.supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (pError) {
      console.error('[AdminService] Error fetching profiles:', pError)
      throw pError
    }

    const { data: companies, error: cError } = await this.supabase
      .from('companies')
      .select('id, name')

    if (cError) {
      console.error('[AdminService] Error fetching companies:', cError)
      // We still return profiles even if companies fetch fails
      return profiles.map(p => ({ ...p, companies: null }))
    }

    // Join in memory
    return profiles.map(p => ({
      ...p,
      companies: companies.find(c => c.id === p.company_id) || null
    }))
  }

  /**
   * Tworzy nową lekcję
   */
  async createLesson(data: Database['public']['Tables']['lessons']['Insert']) {
    const { data: lesson, error } = await this.supabase
      .from('lessons')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return lesson
  }

  /**
   * Usuwa lekcję
   */
  async deleteLesson(id: string) {
    const { error } = await this.supabase
      .from('lessons')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  /**
   * Pobiera wszystkie zatwierdzone pytania (dostępne do przypisania)
   */
  async getVerifiedQuestions() {
    const { data, error } = await this.supabase
      .from('question_bank')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Tworzy kurs i przypisuje do niego wybrane pytania
   */
  async createCourseWithQuestions(courseData: Database['public']['Tables']['courses']['Insert'], questionIds: string[]) {
    // 1. Stwórz kurs
    const { data: course, error: courseError } = await this.supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single()

    if (courseError) throw courseError

    // 2. Pobierz wybrane pytania i STWÓRZ KOPIE dla nowego kursu
    if (questionIds.length > 0) {
      const { data: sourceQuestions } = await this.supabase
        .from('question_bank')
        .select('*')
        .in('id', questionIds)

      if (sourceQuestions && sourceQuestions.length > 0) {
        const duplicatedQuestions = sourceQuestions.map(q => ({
          course_id: course.id,
          question_text: q.question_text,
          correct_answer: q.correct_answer,
          wrong_answers: q.wrong_answers,
          difficulty: q.difficulty,
          is_verified: true,
          created_by: 'cloned'
        }))

        const { error: questionsError } = await this.supabase
          .from('question_bank')
          .insert(duplicatedQuestions)

        if (questionsError) {
          console.error('[AdminService] Błąd podczas kopiowania pytań:', questionsError)
        }
      }
    }

    return course
  }
  /**
   * Pobiera wszystkie pytania z bazy (zarówno zweryfikowane jak i nie)
   */
  async getAllQuestions() {
    const { data, error } = await this.supabase
      .from('question_bank')
      .select('*, courses(title)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Pobiera pytania przypisane do konkretnego kursu
   */
  async getCourseQuestions(courseId: string) {
    const { data, error } = await this.supabase
      .from('question_bank')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
