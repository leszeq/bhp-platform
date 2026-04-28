'use client'

import { QuestionActions } from './QuestionActions'

interface QuestionCardProps {
  question: {
    id: string
    question_text: string | null
    correct_answer: string | null
    wrong_answers: any
    is_verified: boolean | null
    courses?: { title: string } | null
  }
  showActions?: boolean
}

export function QuestionCard({ question, showActions = true }: QuestionCardProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group transition hover:shadow-md">
      <div className="absolute top-0 right-0 p-4 flex gap-2">
        {!question.is_verified && (
          <span className="text-[10px] font-black uppercase bg-amber-100 px-3 py-1 rounded-full text-amber-600">
            Oczekuje
          </span>
        )}
        {question.is_verified && (
          <span className="text-[10px] font-black uppercase bg-emerald-100 px-3 py-1 rounded-full text-emerald-600">
            Zweryfikowane
          </span>
        )}
      </div>
      
      <div className="mb-6">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
          {question.courses?.title || 'Ogólne / Do przypisania'}
        </span>
        <h3 className="text-xl font-black text-gray-900 leading-snug">{question.question_text}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">Poprawna odpowiedź:</span>
          <p className="font-bold text-emerald-900">{question.correct_answer}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-2xl">
          <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Błędne odpowiedzi:</span>
          <ul className="text-sm font-medium text-gray-600 space-y-1 list-disc list-inside">
            {(question.wrong_answers as string[])?.map((wa, idx) => (
              <li key={idx}>{wa}</li>
            ))}
          </ul>
        </div>
      </div>

      {showActions && <QuestionActions id={question.id} isVerified={question.is_verified ?? false} />}
    </div>
  )
}
