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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <Link
          href={`/course/${lesson.course_id}`}
          className="text-sm text-indigo-600 mb-6 inline-block hover:underline font-medium"
        >
          &larr; Wróć do spisu lekcji
        </Link>
        
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{lesson.title}</h1>

        <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap">
          {lesson.content}
        </div>
      </div>
    </div>
  )
}
