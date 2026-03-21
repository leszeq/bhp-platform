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
      
     if (payment) hasAccess = true
  }

  // Zezwól na dostęp jeśli cena to 0 lub brak pola ceny w starej strukturze (zakładamy wstecznie hasAccess jeżeli price=0 docelowo, ale pole price nie jest dodane w pierwotnym database.sql. Jeśli nie ma w db, b2b bypass)
  if (course.price === 0) hasAccess = true

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-sm text-indigo-600 mb-6 inline-block hover:text-indigo-800 transition font-medium">
          &larr; Powrót do kokpitu
        </Link>
        
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{course.title}</h1>
          <p className="mb-8 text-gray-500 mt-3 text-lg">{course.description}</p>

          {!hasAccess ? (
            <div className="bg-gray-50 p-8 md:p-12 rounded-xl text-center border border-gray-200 mt-8">
              <div className="text-5xl mb-6">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">To szkolenie jest płatne</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Wykup pełny, dożywotni dostęp jednorazową płatnością, aby odblokować materiały edukacyjne i podejść do egzaminu certyfikującego.</p>
              
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
            <>
              <h2 className="text-xl font-bold mb-6 text-gray-900">Program szkolenia</h2>
              <div className="space-y-4">
                {lessons && lessons.length > 0 ? (
                  lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center justify-between p-5 border border-indigo-50 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-xs transition group bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition">
                           {index + 1}
                        </span>
                        <span className="font-semibold text-gray-800 text-lg group-hover:text-indigo-900">{lesson.title}</span>
                      </div>
                      <span className="text-gray-300 group-hover:text-indigo-400 font-bold transition">&rarr;</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">Moduły są w trakcie przygotowywania.</p>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <Link
                  href={`/exam/${id}`}
                  className="inline-block bg-black text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10 hover:-translate-y-0.5"
                >
                  Rozpocznij egzamin &rarr;
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
