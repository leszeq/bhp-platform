'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function JoinFlow() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(true)
  const [valid, setValid] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)
  
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  useEffect(() => {
    if (!token) {
      setValid(false)
      setValidating(false)
      return
    }

    fetch(`/api/invitations/validate?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setValid(true)
          setInvitation(data.invitation)
        } else {
          setValid(false)
        }
        setValidating(false)
      })
      .catch(() => {
        setValid(false)
        setValidating(false)
      })
  }, [token])

  const handleJoin = async () => {
    setJoining(true)
    setError(null)
    
    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Wystąpił błąd krytyczny.')
        setJoining(false)
        return
      }

      if (data.requiresMagicLink) {
        setMagicLinkSent(true)
        setJoining(false)
      } else {
        router.push(data.courseId ? `/course/${data.courseId}` : '/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
      setJoining(false)
    }
  }

  if (validating) {
    return <div className="text-center p-12 text-gray-500 animate-pulse font-medium">Weryfikujemy jednorazowy kod bezpieczeństwa...</div>
  }

  if (!valid) {
    return (
       <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100 shadow-sm max-w-md mx-auto">
         <div className="text-4xl mb-4">❌</div>
         <h2 className="text-xl font-bold mb-2">Zaproszenie wygasło lub jest nieprawidłowe</h2>
         <p className="text-sm opacity-80 mt-2">Ze względów bezpieczeństwa zablokowaliśmy sesję. Skontaktuj się ze swoim pracodawcą, aby wygenerować nówy link.</p>
       </div>
    )
  }

  if (magicLinkSent) {
     return (
       <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm max-w-md mx-auto">
         <div className="text-5xl mb-4">✉️</div>
         <h2 className="text-2xl font-black mb-3">Wysłano bezpieczny link!</h2>
         <p className="text-gray-500 mb-6 font-medium leading-relaxed">Posiadałeś już konto w naszej platformie, dlatego wysłaliśmy link weryfikacyjny na Twój e-mail <strong>{invitation?.email}</strong> by Cię zalogować.</p>
         <p className="text-sm text-indigo-500 font-bold">Sprawdź swoją skrzynkę i kliknij w przycisk.</p>
       </div>
     )
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl text-center border border-gray-100 shadow-sm max-w-lg mx-auto transform transition hover:shadow-md">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner ring-4 ring-green-100">👋</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Witaj w szkoleniach BHP!</h1>
      <p className="text-gray-500 mb-10 text-lg leading-relaxed">Czeka na ciebie certyfikacja przygotowana przez Twoją firmę. Przeprowadzimy Cię za rękę przez około 30-minutowy kurs.</p>
      
      {error && <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl mb-6 text-sm">{error}</div>}

      <button
        onClick={handleJoin}
        disabled={joining}
        className="w-full bg-black text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition disabled:opacity-50 shadow-xl shadow-black/10 hover:-translate-y-1"
      >
        {joining ? 'Tworzenie darmowego profilu w tle...' : 'Rozpocznij kurs ułamkiem sekundy 🚀'}
      </button>
    </div>
  )
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
       {/* Grafika z tłem premium landing page'y */}
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-green-200/40 rounded-full blur-[100px] pointer-events-none"></div>
       
       <div className="relative z-10 w-full animate-in fade-in duration-500 zoom-in-95">
         <Suspense fallback={<div className="text-center font-bold text-gray-500">Ładowanie okna Magic Link...</div>}>
            <JoinFlow />
         </Suspense>
       </div>
    </div>
  )
}
