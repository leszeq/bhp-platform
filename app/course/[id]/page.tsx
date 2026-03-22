import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BuyCourseButton } from './components/BuyCourseButton'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (!course) {
    notFound()
  }

  // Weryfikacja płatności
  let hasAccess = false
  if (user) {
     const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .eq('status', 'paid')
      .single()
      
     const { data: userCourse } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .single()
      
     if (payment || userCourse) hasAccess = true
  }

  // Zezwól na dostęp jeśli cena to 0 
  if (course.price === 0) hasAccess = true

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Link href="/dashboard" className="text-sm text-indigo-600 mb-6 inline-block hover:text-indigo-800 transition font-medium">
          &larr; Wróć do kokpitu
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
          {/* Subtle gradient background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4 relative z-10">{course.title}</h1>
          <p className="text-gray-500 mb-8 text-lg font-medium max-w-lg mx-auto relative z-10">{course.description}</p>

          {!hasAccess ? (
            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-200 mt-8 relative z-10">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Wymagany dostęp</h2>
              <p className="text-gray-500 mb-6 font-medium text-sm">Wykup pełny dostęp do certyfikacji aby odblokować materiały.</p>
              
              {user ? (
                 <div className="max-w-xs mx-auto">
                   <BuyCourseButton courseId={id} userId={user.id} />
                 </div>
              ) : (
                 <Link href="/login" className="inline-block bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                   Zaloguj się, aby kupić
                 </Link>
              )}
            </div>
          ) : (
            <div className="relative z-10 mt-8">
               <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full font-bold mb-8 text-sm border border-indigo-100">
                 <span>⏱</span> Zajmie tylko ok. 30 minut
               </div>
               
               {lessons && lessons.length > 0 ? (
                 <Link
                    href={`/lessons/${lessons[0].id}`}
                    className="block w-full bg-black text-white px-10 py-5 rounded-2xl text-xl font-black hover:bg-gray-800 transition shadow-xl shadow-black/10 hover:-translate-y-1"
                 >
                    Rozpocznij szkolenie 🚀
                 </Link>
               ) : (
                 <div className="p-6 bg-amber-50 text-amber-700 rounded-xl font-bold border border-amber-200">
                    Brak opublikowanych modułów.
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
