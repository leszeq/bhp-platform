'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { signIn } from '@/lib/actions/auth'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const searchParams = useSearchParams()
  const resetSuccess = searchParams?.get('reset_success') === 'true'

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {resetSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
          ✅ Twoje hasło zostało pomyślnie zmienione! Możesz się teraz zalogować.
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition text-gray-900"
          placeholder="Twój email"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
           <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
           <Link href="/reset-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition">
             Zapomniałeś hasła?
           </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition text-gray-900"
            placeholder="Twoje hasło"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Logowanie…' : 'Zaloguj się'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          &larr; Wróć na stronę główną
        </Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 z-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Witaj ponownie</h2>
          <p className="text-sm text-gray-500 mt-2">Zaloguj się na swoje konto</p>
        </div>

        <Suspense fallback={<div className="py-4 text-center text-gray-400 text-sm">Trwa ładowanie formularza...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center text-sm text-gray-500">
          Nie masz konta?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  )
}
