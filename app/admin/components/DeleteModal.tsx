'use client'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
  status?: 'idle' | 'success' | 'error'
  errorMessage?: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, message, loading, status = 'idle', errorMessage }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-black mb-2 text-gray-900">Usunięto pomyślnie!</h2>
            <p className="text-gray-500 font-medium">Kurs został trwale wykasowany z bazy.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black mb-3">{title}</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              {message}
            </p>

            {status === 'error' && errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 italic">
                ⚠️ Błąd: {errorMessage}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Anuluj
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition shadow-xl shadow-red-500/20 disabled:opacity-50"
              >
                {loading ? 'Usuwanie...' : 'Tak, usuń'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
