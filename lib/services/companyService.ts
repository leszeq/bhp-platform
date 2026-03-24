import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../supabase/database.types'

export class CompanyService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Tworzy nową firmę
   */
  async createCompany(ownerId: string, name: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .insert([{ owner_id: ownerId, name }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Tworzy zaproszenie dla pracownika
   */
  async createInvitation(data: {
    email: string
    company_id: string
    course_id?: string | null
    token: string
    expires_at: string
  }) {
    const { error } = await this.supabase
      .from('invitations')
      .insert([{
        email: data.email,
        company_id: data.company_id,
        course_id: data.course_id || null,
        token: data.token,
        expires_at: data.expires_at,
        status: 'pending'
      }])

    if (error) throw error
    return true
  }

  /**
   * Pobiera dane firmy wraz z listą pracowników (uproszczone)
   */
  async getCompanyData(ownerId: string) {
    const { data: company, error } = await this.supabase
      .from('companies')
      .select('*, invitations(*)')
      .eq('owner_id', ownerId)
      .maybeSingle()

    if (error) throw error
    return company
  }

  /**
   * Pobiera listę kursów przypisanych do firmy
   */
  async getCompanyCourses(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_courses')
      .select('*, courses(*)')
      .eq('company_id', companyId)

    if (error) throw error
    return data
  }

  /**
   * Pobiera listę kursów dostępnych do przypisania (tylko aktywne + nie przypisane)
   */
  async getAvailableCourses(companyId: string) {
    const { data: alreadyAssigned } = await this.supabase
      .from('company_courses')
      .select('course_id')
      .eq('company_id', companyId)

    const assignedIds = alreadyAssigned?.map(a => a.course_id) || []

    let query = this.supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)

    if (assignedIds.length > 0) {
      query = query.not('id', 'in', `(${assignedIds.join(',')})`)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  /**
   * Przypisuje kurs do firmy
   */
  async assignCourseToCompany(companyId: string, courseId: string) {
    const { error } = await this.supabase
      .from('company_courses')
      .insert([{ company_id: companyId, course_id: courseId }])

    if (error) throw error
    return true
  }
}
