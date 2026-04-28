'use client'

import { useState } from 'react'
import { deleteCourseAction } from '@/lib/actions/admin'
import { DeleteModal } from '@/app/admin/components/DeleteModal'
import { useRouter } from 'next/navigation'

export function CourseDeleteButton({ id, redirectOnSuccess = false }: { id: string, redirectOnSuccess?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    setErrorMessage('')
    const result = await deleteCourseAction(id)
    setLoading(false)

    if (result.success) {
      setStatus('success')
      setTimeout(() => {
        setIsOpen(false)
        if (redirectOnSuccess) {
          router.push('/admin/courses')
        }
      }, 1000)
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Wystąpił błąd podczas usuwania kursu')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"
        title="Usuń kurs"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
        </svg>
      </button>

      <DeleteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        status={status}
        errorMessage={errorMessage}
        title="Usuń kurs"
        message="Czy na pewno chcesz usunąć ten kurs? Tej operacji nie można cofnąć, a wszystkie powiązane lekcje i wyniki egzaminów zostaną skasowane."
      />
    </>
  )
}
