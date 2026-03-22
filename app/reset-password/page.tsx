'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetPassword } from '@/lib/actions/auth'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    setLoading(true)
    const result = await resetPassword(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          &larr; Powrót do logowania
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 z-10">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-xl">
             🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Resetowanie hasła</h2>
          <p className="text-sm text-gray-500 mt-2">Podaj email przypisany do Twojego konta, a wyślemy Ci link do ustawienia nowego hasła.</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900"
              placeholder="np. jan@kowalski.pl"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Wysyłanie linku...' : 'Wyślij link'}
          </button>
        </form>
      </div>
    </div>
  )
}
