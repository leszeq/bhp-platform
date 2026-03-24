import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/lib/services/adminService'
import { QuestionActions } from './components/QuestionActions'

export default async function AdminQuestionsPage() {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)
  
  const unverified = await adminService.getUnverifiedQuestions()

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Baza Pytań AI</h1>
        <p className="text-gray-500 mt-2 font-medium">Zweryfikuj pytania wygenerowane przez sztuczną inteligencję przed ich aktywacją.</p>
      </header>

      <div className="space-y-6">
        {unverified?.map((q) => (
          <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
               <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-400">Moderacja</span>
            </div>
            
            <div className="mb-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
                {(q.courses as any)?.title || 'Brak kursu'}
              </span>
              <h3 className="text-xl font-black text-gray-900 leading-snug">{q.question_text}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">Poprawna odpowiedź:</span>
                <p className="font-bold text-emerald-900">{q.correct_answer}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Błędne odpowiedzi:</span>
                <ul className="text-sm font-medium text-gray-600 space-y-1 list-disc list-inside">
                  {(q.wrong_answers as string[])?.map((wa, idx) => (
                    <li key={idx}>{wa}</li>
                  ))}
                </ul>
              </div>
            </div>

            <QuestionActions id={q.id} />
          </div>
        ))}

        {(!unverified || unverified.length === 0) && (
          <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
             <div className="text-6xl mb-6 grayscale mix-blend-multiply opacity-20">✨</div>
             <p className="text-gray-400 font-bold text-xl">Wszystkie pytania zostały zweryfikowane!</p>
             <p className="text-gray-400 text-sm mt-2 font-medium">Baza pytań jest czysta i gotowa do użycia.</p>
          </div>
        )}
      </div>
    </div>
  )
}
