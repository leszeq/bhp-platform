'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function ResultContent() {
  const searchParams = useSearchParams()
  const score = parseInt(searchParams.get('score') || '0', 10)
  const passed = searchParams.get('passed') === 'true'
  const examId = searchParams.get('exam_id')
  
  const [downloading, setDownloading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const downloadCertificate = async () => {
    if (!user || !examId) return
    setDownloading(true)
    
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          exam_id: examId,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const msg = errData.detail 
          ? `${errData.error}: ${errData.detail}` 
          : (errData.error || 'Nie udało się pobrać certyfikatu')
        throw new Error(msg)
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `certyfikat-bhp-${examId.substring(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center px-6">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-xl ${
        passed ? 'bg-green-100 text-green-600 ring-8 ring-green-50' : 'bg-red-100 text-red-600 ring-8 ring-red-50'
      }`}>
        {passed ? '🏆' : '🕯️'}
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
        {passed ? 'Gratulacje! Zaliczono!' : 'Niestety, spróbuj ponownie'}
      </h1>

      <p className="text-gray-500 text-lg mb-10 font-medium">
        Twój wynik to <span className={`font-black text-2xl ${passed ? 'text-green-600' : 'text-red-500'}`}>{score}%</span>. 
        {passed 
          ? ' Uzyskałeś wymagane minimum 70%. Możesz teraz pobrać swój certyfikat.' 
          : ' Do zaliczenia wymagane jest min. 70%. Przejrzyj materiały i podejdź do testu jeszcze raz.'}
      </p>

      {passed ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={downloadCertificate}
            disabled={downloading}
            className="w-full bg-black text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-gray-800 transition shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generowanie PDF...
              </>
            ) : (
              <>
                <span>📄 Pobierz Certyfikat (PDF)</span>
              </>
            )}
          </button>
          <Link href="/dashboard" className="text-gray-400 font-bold hover:text-black transition py-4">
            Wróć do kokpitu &rarr;
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="w-full bg-gray-100 text-gray-900 px-8 py-5 rounded-2xl font-black text-xl hover:bg-gray-200 transition"
          >
            Spróbuj ponownie
          </Link>
          <p className="text-sm text-gray-400">Możesz powtarzać egzamin nieskończoną ilość razy.</p>
        </div>
      )}
    </div>
  )
}

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <Suspense fallback={<div className="font-bold text-gray-400 animate-pulse">Obliczanie finalnego wyniku...</div>}>
        <ResultContent />
      </Suspense>
    </div>
  )
}
