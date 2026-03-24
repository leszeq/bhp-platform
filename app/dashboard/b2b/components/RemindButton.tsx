'use client'

import { useTransition, useState } from 'react'
import { resendInvitationEmail } from '../actions'

export function RemindButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const handleRemind = () => {
    startTransition(async () => {
      const result = await resendInvitationEmail(email)
      if (result.success) {
        setSent(true)
        setTimeout(() => setSent(false), 5000)
      } else {
        alert(result.error || 'Wystąpił błąd podczas wysyłania przypomnienia.')
      }
    })
  }

  return (
    <button
      onClick={handleRemind}
      disabled={isPending || sent}
      className={`font-semibold text-sm border px-4 py-2 flex-shrink-0 rounded-lg transition whitespace-nowrap disabled:opacity-70 ${
        sent 
          ? 'text-green-600 border-green-200 bg-green-50 shadow-sm' 
          : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-100'
      }`}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           Wysyłanie...
        </span>
      ) : sent ? 'Wysłano! ✅' : 'Przypomnij'}
    </button>
  )
}
