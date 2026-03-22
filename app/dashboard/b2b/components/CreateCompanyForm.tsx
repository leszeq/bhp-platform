'use client'

import { useState } from 'react'
import { createCompany } from '../actions'
import Link from 'next/link'

export function CreateCompanyForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await createCompany(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // W wypadku powdodzenia Next.js automatycznie zrevaliduje path i przekauktualizuje komponent renderujący wyżej 
      // (B2BDashboard Server component zniknie dając miejsce właściwemu panelowi bez przeładowywania całej strony)
    } catch (err: any) {
      console.error(err)
      setError('Wystąpił nieoczekiwany błąd sieci.')
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="w-full text-left">
      <input 
        name="name" 
        required 
        placeholder="np. CodeCraft sp. z o.o." 
        className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-600 transition text-gray-900" 
      />
      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 font-medium">
          ⚠️ {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Tworzenie profilu...' : 'Utwórz profil organizacji'}
      </button>
      
      <div className="text-center mt-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black font-medium transition">
          Powrót do kursów prywatnych
        </Link>
      </div>
    </form>
  )
}
