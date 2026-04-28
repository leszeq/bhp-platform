'use client'

import { useState } from 'react'
import { createQuestionAction } from '@/lib/actions/admin'

interface ManualQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  courses: { id: string, title: string }[]
}

export function ManualQuestionModal({ isOpen, onClose, courses }: ManualQuestionModalProps) {
  const [loading, setLoading] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [wrongAnswers, setWrongAnswers] = useState(['', '', ''])
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleWrongAnswerChange = (index: number, value: string) => {
    const newWrong = [...wrongAnswers]
    newWrong[index] = value
    setWrongAnswers(newWrong)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!questionText || !correctAnswer || wrongAnswers.some(wa => !wa)) {
      setError('Proszę wypełnić wszystkie pola.')
      setLoading(false)
      return
    }

    const result = await createQuestionAction({
      course_id: courseId || null,
      question_text: questionText,
      correct_answer: correctAnswer,
      wrong_answers: wrongAnswers
    })

    if (result.success) {
      onClose()
      // Reset form
      setQuestionText('')
      setCorrectAnswer('')
      setWrongAnswers(['', '', ''])
      setCourseId('')
    } else {
      setError(result.error || 'Wystąpił błąd podczas zapisywania')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-[40px] w-full max-w-2xl p-8 my-8 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Dodaj pytanie ręcznie</h2>
            <p className="text-gray-500 font-medium">Uzupełnij bazę pytań bez udziału AI.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Przydziel do kursu (opcjonalnie)</label>
            <select 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium"
            >
              <option value="">-- Wybierz kurs --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Treść pytania</label>
            <textarea 
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Wpisz treść pytania..."
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-emerald-600 mb-2">Poprawna odpowiedź</label>
              <input 
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Prawidłowa odpowiedź"
                className="w-full border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-bold text-red-600 mb-2">Błędne odpowiedzi (3)</label>
              {wrongAnswers.map((wa, i) => (
                <input 
                  key={i}
                  value={wa}
                  onChange={(e) => handleWrongAnswerChange(i, e.target.value)}
                  placeholder={`Zła odpowiedź ${i+1}`}
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-gray-500 font-bold hover:text-black transition"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-black text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition shadow-xl disabled:opacity-50"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz pytanie w bazie 💾'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
