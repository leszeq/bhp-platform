import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, courses(id, title)')
    .eq('id', id)
    .single()

  if (!lesson) {
    notFound()
  }

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, order_index')
    .eq('course_id', lesson.course_id)
    .order('order_index')

  const currentIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? 0
  const totalLessons = allLessons?.length || 1
  const isLastLesson = currentIndex === totalLessons - 1
  const nextLesson = !isLastLesson ? allLessons![currentIndex + 1] : null
  
  const progress = Math.round(((currentIndex + 1) / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-sm border-x border-gray-100 flex flex-col relative">
        
        {/* Header ze wskaźnikiem progressu */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
             <span>Postęp kursu</span>
             <span className="text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
             <div className="bg-indigo-500 h-full transition-all duration-700 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 flex-1">
          <h1 className="text-3xl md:text-4xl font-black mb-8 text-gray-900 tracking-tight leading-tight">{lesson.title}</h1>
          <div className="prose prose-lg prose-indigo max-w-none text-gray-600 leading-relaxed mb-12 whitespace-pre-wrap">
            {lesson.content}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 mt-auto sticky bottom-0">
          {nextLesson ? (
             <Link
               href={`/lessons/${nextLesson.id}`}
               className="block w-full text-center bg-black text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-gray-800 transition shadow-xl shadow-black/10 hover:-translate-y-1"
             >
               Dalej &rarr;
             </Link>
          ) : (
             <Link
               href={`/exam/${lesson.course_id}`}
               className="block w-full text-center bg-green-500 text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-xl shadow-green-500/20 hover:-translate-y-1"
             >
               Zakończ i przejdź do Egzaminu 🎓
             </Link>
          )}
        </div>

      </div>
    </div>
  )
}
