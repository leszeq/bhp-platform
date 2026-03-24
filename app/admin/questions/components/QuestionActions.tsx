'use client'

import { useState } from 'react'
import { verifyQuestionAction, deleteQuestionAction } from '@/lib/actions/admin'

export function QuestionActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    await verifyQuestionAction(id)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć to pytanie?')) return
    setLoading(true)
    await deleteQuestionAction(id)
    setLoading(false)
  }

  return (
    <div className="flex items-center space-x-4">
      <button 
        onClick={handleVerify}
        disabled={loading}
        className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-black/10 disabled:opacity-50"
      >
        {loading ? 'Przetwarzanie...' : 'Zatwierdź pytanie ✅'}
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="px-8 bg-gray-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
      >
        {loading ? '...' : 'Odrzuć'}
      </button>
    </div>
  )
}
