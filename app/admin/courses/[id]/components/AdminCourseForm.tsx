'use client'

import { useState } from 'react'
import { updateCourseAction } from '@/lib/actions/admin'

export function AdminCourseForm({ course }: { course: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    const result = await updateCourseAction(course.id, formData)
    setLoading(false)
    
    if (result.success) {
      setMessage('Zapisano pomyślnie! ✅ Wszystkie zmiany zostały wprowadzone.')
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage(`Błąd podczas zapisywania: ${result.error || 'Nieznany błąd'}`)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Tytuł kursu</label>
        <input 
          name="title"
          type="text" 
          defaultValue={course.title}
          required
          className="w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-3 font-bold transition outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cena (PLN)</label>
        <input 
          name="price"
          type="number" 
          defaultValue={course.price || 0}
          className="w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-3 font-bold transition outline-none"
        />
      </div>
      
      {message && (
        <p className={`text-sm font-bold ml-1 ${message.includes('Błąd') ? 'text-red-500' : 'text-emerald-600'}`}>
          {message}
        </p>
      )}

      <div className="pt-4">
        <button 
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-black/10 disabled:opacity-50"
        >
          {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </div>
    </form>
  )
}
