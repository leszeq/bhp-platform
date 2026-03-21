'use client'

import { useState } from 'react'

export function VerifyButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/verify-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      window.location.reload()
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      className="mt-3 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
      onClick={handleVerify}
    >
      {loading ? 'Zatwierdzanie...' : '✅ Zatwierdź to pytanie'}
    </button>
  )
}
