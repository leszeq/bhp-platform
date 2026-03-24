'use client'

import { useState } from 'react'
import { createLessonAction } from '@/lib/actions/admin'

export function AddLessonModal({ courseId, nextOrder }: { courseId: string, nextOrder: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    const result = await createLessonAction(courseId, title, content, nextOrder)
    setLoading(false)
    
    if (result.success) {
      setIsOpen(false)
    } else {
      setError(result.error || 'Wystąpił błąd')
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
      >
        ➕ Dodaj lekcję
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-black mb-6">Nowa lekcja</h2>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tytuł lekcji</label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="np. Wstęp do bezpieczeństwa"
              className="w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-3 font-bold transition outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Treść lekcji (Markdown)</label>
            <textarea 
              name="content"
              required
              rows={6}
              placeholder="Tutaj wpisz treść lekcji..."
              className="w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-3 font-bold transition outline-none resize-none"
            ></textarea>
          </div>

          {error && <p className="text-sm text-red-500 font-bold ml-1">{error}</p>}

          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
            >
              Anuluj
            </button>
            <button 
              disabled={loading}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Dodawanie...' : 'Dodaj lekcję'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
