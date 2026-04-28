'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCourseWithQuestionsAction } from '@/lib/actions/admin'

type Step = 1 | 2 | 3

export function CourseWizard({ verifiedQuestions }: { verifiedQuestions: any[] }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  const handleNext = () => setStep((s) => (s + 1) as Step)
  const handleBack = () => setStep((s) => (s - 1) as Step)

  const toggleQuestion = (id: string) => {
    setSelectedQuestionIds((prev) => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const result = await createCourseWithQuestionsAction(title, description, price, selectedQuestionIds)

    if (result.success) {
      router.push(`/admin/courses/${result.courseId}`)
      router.refresh()
    } else {
      setError(result.error || 'Wystąpił nieoczekiwany błąd')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden">
      {/* ProgressBar */}
      <div className="bg-gray-50 px-10 py-4 flex justify-between border-b border-gray-100">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${step >= s ? 'text-black' : 'text-gray-400'}`}>
              {s === 1 ? 'Detale' : s === 2 ? 'Pytania' : 'Podsumowanie'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-10">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Podstawowe informacje</h2>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tytuł kursu</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. BHP w biurze 2024"
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Opis</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Krótki opis kursu dla uczestników..."
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cena (PLN)</label>
              <input 
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-64 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition font-medium"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Baza Pytań</h2>
                <p className="text-gray-500 text-sm font-medium">Wybierz pytania, które wejdą w skład egzaminu.</p>
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                Wybrano: {selectedQuestionIds.length}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {verifiedQuestions.map((q) => (
                <div 
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-4 ${
                    selectedQuestionIds.includes(q.id) 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                    selectedQuestionIds.includes(q.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}>
                    {selectedQuestionIds.includes(q.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{q.question_text}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Poziom: {q.difficulty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Gotowy do publikacji?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Dane kursu</p>
                <p className="font-bold text-gray-900 text-xl mb-1">{title}</p>
                <p className="text-sm text-gray-500 font-medium mb-4">{description || 'Brak opisu'}</p>
                <p className="text-lg font-black text-indigo-600">{price} PLN</p>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Struktura egzaminu</p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📝</div>
                  <div>
                    <p className="font-bold text-gray-900 text-xl">{selectedQuestionIds.length}</p>
                    <p className="text-sm text-gray-500 font-medium">Wybranych pytań</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between gap-4">
          {step > 1 ? (
             <button
              onClick={handleBack}
              className="px-8 py-3 bg-white text-gray-500 font-bold rounded-2xl hover:text-black transition"
            >
              Cofnij
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!title}
              className="px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition shadow-xl disabled:opacity-50"
            >
              Dalej &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? 'Zapisywanie...' : 'Zatwierdź i Opublikuj 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
