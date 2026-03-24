'use client'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, message, loading }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">

        <h2 className="text-2xl font-black mb-3">{title}</h2>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
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
      </div>
    </div>
  )
}
