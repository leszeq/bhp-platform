import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CompanyService } from '@/lib/services/companyService'
import { CourseAssignButton } from './components/CourseAssignButton'

export default async function AddCoursePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const companyService = new CompanyService(supabase)
  
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!company) redirect('/dashboard/b2b')

  const availableCourses = await companyService.getAvailableCourses(company.id)

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen">
      <header className="mb-10">
        <Link 
          href="/dashboard/b2b"
          className="text-sm font-bold text-gray-400 hover:text-black transition flex items-center gap-2 mb-4"
        >
          &larr; Powrót do panelu B2B
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Katalog Dostępnych Kursów</h1>
        <p className="text-gray-500 mt-2 font-medium">Wybierz profesjonalne szkolenia BHP i dodaj je do oferty swojej firmy.</p>
      </header>

      {availableCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold">Wszystkie dostępne kursy są już przypisane do Twojej firmy.</p>
          <p className="text-sm text-gray-400 mt-1">Zajrzyj tu później, gdy dodamy nowe materiały!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableCourses.map((course) => (
            <div key={course.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:border-indigo-100 transition flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-indigo-50 transition">
                  📚
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                  {course.description || 'Kompleksowe szkolenie BHP przygotowane przez naszych ekspertów.'}
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Standardowa cena</p>
                  <p className="font-bold text-gray-900">{course.price} PLN / os.</p>
                </div>
                <CourseAssignButton companyId={company.id} courseId={course.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
