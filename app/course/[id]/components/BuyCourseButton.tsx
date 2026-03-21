'use client'

import { useState } from 'react'

export function BuyCourseButton({ courseId, userId }: { courseId: string, userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          userId,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Wystąpił błąd przy tworzeniu płatności.')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="mt-6 w-full bg-black text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? 'Przekierowanie do płatności...' : 'Kup dostęp za 99 PLN'}
    </button>
  )
}
