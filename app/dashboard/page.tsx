import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch courses from DB
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Fetch progress
  const { data: userExams } = await supabase
    .from('exams')
    .select('*')
    .eq('user_id', user.id)

  const { data: userCerts } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edukacja BHP</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block font-medium">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-bold text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl px-4 py-2 hover:bg-red-50 hover:border-red-100 transition shadow-sm"
              >
                Wyloguj się
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 -z-0"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 relative z-10">
            <div>
              <h2 className="text-2xl font-black mb-1 text-gray-900">Twoje Szkolenia</h2>
              <p className="text-gray-500 font-medium">Wybierz kurs, aby rozpocząć i uzyskać certyfikat.</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/b2b"
                className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-white text-gray-700 hover:bg-gray-50 font-bold text-sm rounded-2xl transition border border-gray-200 shadow-sm"
              >
                🏢 Panel Firmowy
              </Link>
              <Link
                href="/dashboard/courses/new"
                className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm rounded-2xl transition border border-indigo-100 shadow-sm"
              >
                + Dodaj kurs
              </Link>
            </div>
          </div>

          {courses && courses.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {courses.map((course) => {
                const examsForCourse = userExams?.filter(e => e.course_id === course.id) || []
                // Prefer passed exam, then latest by date
                const bestExam = examsForCourse.find(e => e.status === 'passed') || 
                                 examsForCourse.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0]
                
                const cert = userCerts?.find(c => c.course_id === course.id)
                
                let statusLabel = 'Nie rozpoczęty'
                let statusColor = 'bg-gray-100 text-gray-600 border-gray-200'
                
                if (cert) {
                  statusLabel = 'Ukończono ✅'
                  statusColor = 'bg-green-100 text-green-700 border-green-200'
                } else if (bestExam) {
                  statusLabel = bestExam.status === 'failed' ? 'Niezdany ❌' : 'W trakcie ⏳'
                  statusColor = bestExam.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                }

                return (
                  <div
                    key={course.id}
                    className="p-6 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-indigo-200 hover:bg-indigo-50/10 transition group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition">{course.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                      {course.description && (
                        <p className="text-gray-500 font-medium text-sm line-clamp-2">{course.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {cert && (
                         <Link 
                           href={`/exam/result?score=${bestExam?.score || 100}&passed=true&exam_id=${cert.exam_id}`}
                           className="flex-1 sm:flex-none text-center px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl text-sm font-black hover:bg-gray-50 transition shadow-sm"
                         >
                           📄 Certyfikat
                         </Link>
                      )}
                      <Link
                        href={`/course/${course.id}`}
                        className="flex-1 sm:flex-none text-center px-8 py-3 bg-black text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition shadow-xl"
                      >
                        {cert ? 'Przejrzyj lekcje' : bestExam ? 'Kontynuuj' : 'Rozpocznij'} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <div className="text-4xl mb-4">📭</div>
              <p className="font-bold text-gray-500">Brak dostępnych kursów.</p>
              <p className="text-sm mt-1">Skontaktuj się z administracją firmy.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
