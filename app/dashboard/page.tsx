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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
              >
                Wyloguj się
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Twoje Kursy</h2>
              <p className="text-sm text-gray-500">Wybierz kurs, aby rozpocząć szkolenie BHP.</p>
            </div>
            <Link
              href="/dashboard/courses/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-sm rounded-lg transition border border-indigo-100"
            >
              + Dodaj kurs
            </Link>
          </div>

          {courses && courses.length > 0 ? (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border border-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-100 transition"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-gray-500 mt-0.5">{course.description}</p>
                    )}
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 mt-2">
                      Nie rozpoczęty
                    </span>
                  </div>
                  <Link
                    href={`/course/${course.id}`}
                    className="whitespace-nowrap px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                  >
                    Przejdź do kursu →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg">
              <p className="text-sm">Brak dostępnych kursów.</p>
              <p className="text-xs mt-1">Skontaktuj się z administratorem.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
