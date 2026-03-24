import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AdminCourseForm } from './components/AdminCourseForm'
import { AdminLessonList } from './components/AdminLessonList'
import { AddLessonModal } from './components/AddLessonModal'
import { CourseDeleteButton } from '../components/CourseDeleteButton'

export default async function AdminCourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (!course) {
    notFound()
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index')

  const sortedLessons = lessons || []

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center space-x-4 text-gray-400 mb-4">
            <Link href="/admin/courses" className="hover:text-black font-bold text-sm transition">Kursy</Link>
            <span>&rarr;</span>
            <span className="text-black font-bold text-sm">Edycja</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{course.title}</h1>
        </div>
        <CourseDeleteButton id={id} redirectOnSuccess={true} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata Editorial */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Informacje ogólne</h2>
            <AdminCourseForm course={course} />
          </div>
        </div>

        {/* Right Column: Lessons Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Lekcje w tym kursie</h2>
              <AddLessonModal courseId={course.id} nextOrder={sortedLessons.length + 1} />
            </div>

            <AdminLessonList lessons={sortedLessons} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
