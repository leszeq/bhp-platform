import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminService } from '@/lib/services/adminService'
import { CourseWizard } from './components/CourseWizard'

export default async function NewCourseWizardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminService = new AdminService(supabase)
  const verifiedQuestions = await adminService.getVerifiedQuestions()

  return (
    <div className="max-w-4xl mx-auto py-10">
      <header className="mb-10">
        <Link 
          href="/admin/courses"
          className="text-sm font-bold text-gray-400 hover:text-black transition flex items-center gap-2 mb-4"
        >
          &larr; Powrót do listy kursów
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Kreator Nowego Kursu</h1>
        <p className="text-gray-500 mt-2 font-medium">Przejdź przez kroki, aby skonfigurować kurs i przypisać do niego egzamin.</p>
      </header>

      <CourseWizard verifiedQuestions={verifiedQuestions} />
    </div>
  )
}
