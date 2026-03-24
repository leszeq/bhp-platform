'use client'

import { useState } from 'react'
import { assignCourseAction } from '@/lib/actions/company'

export function CourseAssignButton({ companyId, courseId }: { companyId: string, courseId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleAssign() {
    setLoading(true)
    const result = await assignCourseAction(companyId, courseId)
    setLoading(false)
    
    if (result.success) {
      setSuccess(true)
    } else {
      alert(result.error || 'Wystąpił błąd podczas przypisywania kursu')
    }
  }

  if (success) {
    return (
      <span className="text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl border border-green-200">
        ✅ Przypisano
      </span>
    )
  }

  return (
    <button 
      onClick={handleAssign}
      disabled={loading}
      className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10 disabled:opacity-50"
    >
      {loading ? 'Dodawanie...' : 'Dodaj do firmy'}
    </button>
  )
}
