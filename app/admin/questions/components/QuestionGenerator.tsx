'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuestionGeneratorProps {
  courses: { id: string, title: string }[]
}

export function QuestionGenerator({ courses }: QuestionGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [courseId, setCourseId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleGenerate() {
    if (!topic) return
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, course_id: courseId || null })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setStatus('success')
      setMessage(`Wygenerowano ${data.count} pytań! Odświeżam listę...`)
      setTopic('')
      
      // Refresh the page to show new unverified questions
      setTimeout(() => {
        router.refresh()
        setStatus('idle')
      }, 2000)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Wystąpił błąd podczas generowania')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl mb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
        <div className="text-9xl">✨</div>
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-black mb-2">Generator Pytań AI</h2>
        <p className="text-gray-400 font-medium mb-8 text-sm">Podaj temat, a sztuczna inteligencja przygotuje propozycje pytań do Twojej bazy.</p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="np. Praca na wysokościach, Pierwsza pomoc..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-500 transition font-bold"
            />
          </div>
          
          <div className="w-full md:w-64">
            <select 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition font-bold appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900">Ogólne (bez kursu)</option>
              {courses.map(c => (
                <option key={c.id} value={c.id} className="bg-gray-900">{c.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition shadow-xl shadow-indigo-600/20 whitespace-nowrap"
          >
            {loading ? 'Generowanie...' : 'Generuj Pytania 🚀'}
          </button>
        </div>

        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
            status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {status === 'success' ? '✅' : '⚠️'} {message}
          </div>
        )}
      </div>
    </div>
  )
}
