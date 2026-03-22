'use client'

import { useState } from 'react'
import { updatePassword } from '@/lib/actions/auth'

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (formData.get('password') !== formData.get('password_confirm')) {
      setError('Hasła nie są identyczne.')
      return
    }
    
    setError(null)
    setLoading(true)
    const result = await updatePassword(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 z-10">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-xl">
             ✨
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ustaw nowe hasło</h2>
          <p className="text-sm text-gray-500 mt-2">Wpisz nowe, bezpieczne hasło aby odzyskać pełny dostęp do profilu.</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
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
          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">Potwierdź nowe hasło</label>
            <div className="relative">
              <input
                id="password_confirm"
                name="password_confirm"
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900"
                placeholder="Powtórz hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirm ? "🙈" : "👁️"}
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
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Zapisywanie...' : 'Zmień hasło i przejdź do panelu'}
          </button>
        </form>
      </div>
    </div>
  )
}
