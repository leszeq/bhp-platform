import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../supabase/database.types'

export type CourseInsert = Database['public']['Tables']['courses']['Insert']

export class CourseService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Tworzy nowy kurs w bazie danych
   */
  async createCourse(data: CourseInsert) {
    const { data: course, error } = await this.supabase
      .from('courses')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('[CourseService] Error creating course:', error)
      throw new Error(error.message)
    }

    return course
  }

  /**
   * Pobiera listę aktywnych kursów
   */
  async getActiveCourses() {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}
