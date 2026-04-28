'use client'

import { useState } from 'react'
import { ManualQuestionModal } from './ManualQuestionModal'

interface ManualQuestionModalTriggerProps {
  courses: { id: string, title: string }[]
}

export function ManualQuestionModalTrigger({ courses }: ManualQuestionModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-4 bg-white border-2 border-dashed border-gray-200 text-gray-900 font-bold rounded-2xl hover:border-black transition flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Dodaj pytanie ręcznie
      </button>

      <ManualQuestionModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        courses={courses} 
      />
    </>
  )
}
