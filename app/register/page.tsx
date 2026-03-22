'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { signUp } from '@/lib/actions/auth'
import { useSearchParams } from 'next/navigation'

function RegisterForm() {
  const searchParams = useSearchParams()
  const companyId = searchParams?.get('companyId') || ''
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (companyId) {
      formData.append('companyId', companyId)
    }
    setError(null)
    setSuccess(null)
    setLoading(true)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {companyId && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-3 rounded-lg text-sm font-medium mb-4">
          Zostałeś zaproszony(a) przez Twoją firmę. Zarejestruj się aby uzyskać dostęp pracowniczy do materiałów szkoleniowych.
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900"
          placeholder="Twój email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900"
            placeholder="Minimum 6 znaków"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
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
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Tworzenie konta…' : 'Zarejestruj się'}
      </button>
    </form>
  )
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          &larr; Wróć na stronę główną
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 z-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Dołącz do nas</h2>
          <p className="text-sm text-gray-500 mt-2">Utwórz konto, aby rozpocząć szkolenie</p>
        </div>

        <Suspense fallback={<div className="text-center text-sm text-gray-500 py-4">Ładowanie formularza...</div>}>
          <RegisterForm />
        </Suspense>

        <div className="mt-6 text-center text-sm text-gray-500">
          Masz już konto?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Zaloguj się
          </Link>
        </div>
      </div>
    </div>
  )
}
