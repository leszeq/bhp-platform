import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/lib/services/adminService'
import { QuestionCard } from './components/QuestionCard'
import { QuestionGenerator } from './components/QuestionGenerator'
import { ManualQuestionModalTrigger } from './components/ManualQuestionModalTrigger'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminQuestionsPage({ searchParams }: PageProps) {
  const { tab = 'moderation' } = await searchParams
  const supabase = await createClient()
  const adminService = new AdminService(supabase)
  
  const unverified = await adminService.getUnverifiedQuestions()
  const allQuestions = tab === 'all' ? await adminService.getAllQuestions() : []
  
  const displayQuestions = tab === 'all' ? allQuestions : unverified

  // Pobieramy listę kursów do generatorów
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title')
    .eq('is_active', true)

  const coursesList = courses || []

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Baza Pytań</h1>
          <p className="text-gray-500 mt-2 font-medium">Zarządzaj pytaniami egzaminacyjnymi Twojej platformy.</p>
        </div>
        <ManualQuestionModalTrigger courses={coursesList} />
      </header>

      {/* Generator Section */}
      <QuestionGenerator courses={coursesList} />

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-1">
        <Link 
          href="/admin/questions?tab=moderation"
          className={`pb-4 px-2 font-bold transition-all relative ${
            tab === 'moderation' ? 'text-indigo-600' : 'text-gray-400 hover:text-black'
          }`}
        >
          Do moderacji ({unverified?.length || 0})
          {tab === 'moderation' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
        </Link>
        <Link 
          href="/admin/questions?tab=all"
          className={`pb-4 px-2 font-bold transition-all relative ${
            tab === 'all' ? 'text-indigo-600' : 'text-gray-400 hover:text-black'
          }`}
        >
          Wszystkie pytania
          {tab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
        </Link>
      </div>

      <div className="space-y-6">
        {displayQuestions?.map((q: any) => (
          <QuestionCard key={q.id} question={q} />
        ))}

        {(!displayQuestions || displayQuestions.length === 0) && (
          <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
             <div className="text-6xl mb-6 grayscale mix-blend-multiply opacity-20">✨</div>
             <p className="text-gray-400 font-bold text-xl">
               {tab === 'moderation' ? 'Wszystkie pytania zostały zweryfikowane!' : 'Brak pytań w bazie.'}
             </p>
             <p className="text-gray-400 text-sm mt-2 font-medium">Użyj generatora powyżej, aby stworzyć nowe propozycje.</p>
          </div>
        )}
      </div>
    </div>
  )
}
