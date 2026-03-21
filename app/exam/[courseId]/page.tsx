'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

export default function ExamPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const [examId, setExamId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingCert, setIsGeneratingCert] = useState(false)

  // Start exam
  useEffect(() => {
    async function initExam() {
      try {
        const res = await fetch('/api/exams/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId })
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        
        setExamId(data.exam_id)
        
        const qRes = await fetch(`/api/exams/${data.exam_id}`)
        const qData = await qRes.json()
        
        if (qData.error) throw new Error(qData.error)

        // Shuffle answers for each question on the client
        const formattedQuestions = qData.map((q: any) => {
           const ansArr = Array.isArray(q.question_bank.wrong_answers) 
             ? q.question_bank.wrong_answers 
             : []
           const answers = [
             q.question_bank.correct_answer,
             ...ansArr
           ].sort(() => Math.random() - 0.5)
           return { ...q, allAnswers: answers }
        })
        
        setQuestions(formattedQuestions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    initExam()
  }, [courseId])

  const handleSelect = async (answer: string) => {
    if (selected !== null) return // zablokuj po pierwszym kliknięciu
    setSelected(answer)
    
    try {
      // 1. Zapisz odpowiedź w DB
      await fetch('/api/exams/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_question_id: questions[current].id,
          answer
        })
      })

      // 2. Opóźnienie dla UX feedback
      setTimeout(async () => {
        if (current + 1 < questions.length) {
          setCurrent(current + 1)
          setSelected(null)
        } else {
          // Zakończ egzamin
          const finRes = await fetch('/api/exams/finish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exam_id: examId })
          })
          const finData = await finRes.json()
          setScore(finData.score)
          setStatus(finData.status)
          setFinished(true)
        }
      }, 1200)
    } catch (err) {
      console.error(err)
    }
  }

  const downloadCertificate = async () => {
    setIsGeneratingCert(true)
    try {
        const res = await fetch('/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exam_id: examId })
        })
        
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certyfikat-bhp.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    } catch (err) {
        console.error(err)
    } finally {
        setIsGeneratingCert(false)
    }
  }

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-500 font-medium tracking-wide">Ładowanie egzaminu...</div></div>
  }

  if (error) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
            <h2 className="text-lg font-bold text-red-600 mb-4">Wystąpił błąd</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <Link href={`/course/${courseId}`} className="text-indigo-600 underline font-medium text-sm">Wróć do kursu</Link>
         </div>
       </div>
     )
  }

  if (finished) {
    const passed = status === 'passed'

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
             {passed ? '🏆' : '📚'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Egzamin {passed ? 'Zaliczony!' : 'Zakończony'}
          </h1>
          <p className="text-gray-600 mb-8">
            Twój wynik to <strong>{score}%</strong> (wymagane 70%).
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!passed && (
               <button 
                 onClick={() => window.location.reload()}
                 className="w-full sm:w-auto inline-block bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
               >
                 Spróbuj ponownie
               </button>
            )}
            {passed && (
               <button 
                 onClick={downloadCertificate}
                 disabled={isGeneratingCert}
                 className="w-full sm:w-auto inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50"
               >
                 {isGeneratingCert ? 'Generowanie...' : 'Pobierz Certyfikat PDF'}
               </button>
            )}
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Powrót do Kokpitu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const qData = questions[current]
  if (!qData) return <div className="p-6 text-center text-gray-500 min-h-screen pt-24">Brak pytań pasujących do tego egzaminu.</div>

  const q = qData.question_bank
  const allAnswers = qData.allAnswers

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/course/${courseId}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
             &larr; Przerwij egzamin
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-500 font-medium">Pytanie {current + 1} z {questions.length}</span>
              <span className="text-xs text-gray-400 font-medium">{Math.round(((current) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((current) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-8 text-gray-900 leading-snug">
            {q.question_text}
          </h2>

          <div className="space-y-3">
            {allAnswers.map((a: string, i: number) => {
              const isSelected = selected === a
              const isCorrect = a === q.correct_answer
              
              let btnClass = "block w-full text-left p-4 border rounded-xl transition-all font-medium text-sm "
              
              if (selected === null) {
                  btnClass += "border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 text-gray-700 hover:-translate-y-0.5"
              } else {
                  if (isSelected) {
                    btnClass += isCorrect 
                      ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500" 
                      : "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500"
                  } else if (isCorrect) {
                    btnClass += "bg-green-50 border-green-500 text-green-700"
                  } else {
                    btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed"
                  }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(a)}
                  disabled={selected !== null}
                  className={btnClass}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
