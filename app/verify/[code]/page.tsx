'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

export default function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/certificates/verify/${code}`)
      .then(res => res.json())
      .then(resData => {
         setData(resData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [code])

  if (loading) return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-gray-500 font-medium">Sprawdzanie autentyczności certyfikatu...</div>
     </div>
  )

  if (!data || !data.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
         <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Certyfikat jest nieważny</h1>
            <p className="text-gray-500 text-sm">Nie odnaleźliśmy certyfikatu w naszej bazie danych dla podanego kodu weryfikacyjnego.</p>
            <div className="mt-8 border-t border-gray-100 pt-6">
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium text-sm transition">Wróć na stronę główną</Link>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
       <div className="bg-white p-8 rounded-xl shadow-sm border border-green-100 max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="text-5xl mb-4 text-center">✅</div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Certyfikat jest w pełni ważny</h1>
          
          <div className="space-y-4 text-left">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Kursant</span>
              <p className="font-semibold text-gray-900 text-lg">{data.user}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Kurs</span>
              <p className="font-semibold text-gray-900">{data.course || 'Szkolenie BHP'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Data wystawienia</span>
              <p className="font-semibold text-gray-900">{new Date(data.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <Link href="/" className="text-gray-500 hover:text-indigo-600 font-medium text-sm transition">Zabezpieczone przez platformę BHP</Link>
          </div>
       </div>
    </div>
  )
}
