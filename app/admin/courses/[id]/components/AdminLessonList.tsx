'use client'

import { useState } from 'react'
import { deleteLessonAction } from '@/lib/actions/admin'

export function AdminLessonList({ lessons, courseId }: { lessons: any[], courseId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    setLoadingId(id)
    await deleteLessonAction(id, courseId)
    setLoadingId(null)
  }

  return (
    <div className="space-y-3 flex-1">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition group">
          <div className="flex items-center space-x-4">
            <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-xs font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition">
              {lesson.order_index}
            </span>
            <span className={`font-bold text-gray-900 ${loadingId === lesson.id ? 'opacity-50' : ''}`}>
              {lesson.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-black transition">⚙️</button>
            <button 
              onClick={() => handleDelete(lesson.id)}
              disabled={loadingId !== null}
              className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-30"
            >
              {loadingId === lesson.id ? '...' : '🗑️'}
            </button>
          </div>
        </div>
      ))}

      {lessons.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-20 italic">
          <div className="text-4xl mb-4">📖</div>
          <p className="font-bold">Brak lekcji w tym kursie.</p>
        </div>
      )}
    </div>
  )
}
