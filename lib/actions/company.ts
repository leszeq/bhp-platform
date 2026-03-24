'use server'

import { createClient } from '@/lib/supabase/server'
import { CompanyService } from '@/lib/services/companyService'
import { revalidatePath } from 'next/cache'

export async function assignCourseAction(companyId: string, courseId: string) {
  const supabase = await createClient()
  const companyService = new CompanyService(supabase)

  try {
    await companyService.assignCourseToCompany(companyId, courseId)
    revalidatePath('/dashboard/b2b')
    revalidatePath('/dashboard/b2b/courses/add')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
