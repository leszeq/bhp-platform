'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddEmployeeModal({ companyId, companyCourses }: { companyId: string, companyCourses: any[] }) {
  const [email, setEmail] = useState('')
  const [courseId, setCourseId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleAdd = async () => {
    if (!email) return
    setLoading(true)
    
    const res = await fetch('/api/invitations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, company_id: companyId, course_id: courseId || null })
    })

    if (res.ok) {
      setSuccess(true)
      setEmail('')
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="p-6 border border-indigo-100 bg-indigo-50/50 rounded-2xl flex flex-col md:flex-row items-end md:items-center gap-4 shadow-sm mb-8">
      <div className="flex-1 w-full">
         <label className="block text-sm font-bold text-gray-800 mb-2">Szybkie zaproszenie pracownika</label>
         <div className="flex flex-col md:flex-row gap-3">
           <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="p.kowalski@twojafirma.pl"
              type="email"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-600 outline-none transition shadow-inner font-medium text-gray-900"
           />
           <select 
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="md:w-64 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-600 outline-none transition bg-white font-medium text-gray-900"
           >
              <option value="">Wybierz kurs (opcjonalnie)</option>
              {companyCourses.map((cc) => (
                <option key={cc.courses.id} value={cc.courses.id}>
                  {cc.courses.title}
                </option>
              ))}
           </select>
         </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={loading || !email}
        className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 whitespace-nowrap shadow-md hover:-translate-y-0.5"
      >
        {loading ? 'Wysyłanie...' : success ? 'Wysłano! ✅' : '+ Wyślij link'}
      </button>
    </div>
  )
}
