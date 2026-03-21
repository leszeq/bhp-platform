import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VerifyButton } from './components/VerifyButton'

export default async function AdminQuestions() {
  const supabase = await createClient()

  // Wymaga zalogowania (docelowo należy też sprawdzić role='admin' z tabeli profiles)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('question_bank')
    .select('*, courses(title)')
    .eq('is_verified', false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Pytania do zatwierdzenia (Panel Admina)
        </h1>

        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((q) => (
              <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-3 inline-block">
                  Kurs: {q.courses?.title || q.course_id}
                </span>
                <p className="font-semibold text-gray-900 text-lg mb-4">{q.question_text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-100 p-3 rounded-lg">
                    <span className="text-xs text-green-700 font-bold block mb-1">POPRAWNA ODPOWIEDŹ:</span>
                    <span className="text-green-900 font-medium">{q.correct_answer}</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                    <span className="text-xs text-red-700 font-bold block mb-1">BŁĘDNE ODPOWIEDZI:</span>
                    <ul className="text-red-900 text-sm list-disc pl-4 space-y-1">
                       {Array.isArray(q.wrong_answers) ? q.wrong_answers.map((w: string, i: number) => (
                         <li key={i}>{w}</li>
                       )) : <li>{typeof q.wrong_answers === 'string' ? q.wrong_answers : JSON.stringify(q.wrong_answers)}</li>}
                    </ul>
                  </div>
                </div>

                <VerifyButton id={q.id} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 flex flex-col items-center">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-gray-500 font-medium">Brak pytań do zatwierdzenia. Oczekuj na działanie AI!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
