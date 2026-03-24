import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CourseDeleteButton } from './components/CourseDeleteButton'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Katalog Kursów</h1>
          <p className="text-gray-500 mt-2 font-medium">Zarządzaj dostępnymi szkoleniami i ich strukturą.</p>
        </div>
        <Link 
          href="/dashboard/courses/new" 
          className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition"
        >
          ➕ Nowy kurs
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {courses?.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition group">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition">
                📚
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${course.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {course.is_active ? 'Aktywny' : 'Szkic'}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">Cena: {course.price} PLN</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link 
                href={`/admin/courses/${course.id}`}
                className="px-6 py-2.5 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition"
              >
                Edytuj
              </Link>
              <CourseDeleteButton id={course.id} />
            </div>
          </div>
        ))}

        {(!courses || courses.length === 0) && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">Brak kursów w bazie danych.</p>
          </div>
        )}
      </div>
    </div>
  )
}
