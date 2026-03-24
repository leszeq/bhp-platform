import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/lib/services/adminService'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)
  
  const stats = await adminService.getStats()

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">System CMS</h1>
        <p className="text-gray-500 mt-2 font-medium">Zarządzaj treścią kursów i bazą pytań swojego produktu.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Aktywne kursy</span>
            <span className="text-2xl">📚</span>
          </div>
          <div className="text-4xl font-black">{stats.courses}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Użytkownicy</span>
            <span className="text-2xl">👤</span>
          </div>
          <div className="text-4xl font-black">{stats.users}</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Wydane certyfikaty</span>
            <span className="text-2xl">📄</span>
          </div>
          <div className="text-4xl font-black">{stats.certificates}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Szybkie akcje</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/courses/new" 
              className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition group"
            >
              <span className="mr-3 text-lg group-hover:scale-125 transition">➕</span>
              <span className="font-bold">Dodaj kurs</span>
            </Link>
            <Link 
              href="/admin/questions" 
              className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition group"
            >
              <span className="mr-3 text-lg group-hover:scale-125 transition">✨</span>
              <span className="font-bold">Zatwierdź pytania AI</span>
            </Link>
          </div>
        </section>

        {/* Recently Added Section placeholder */}
        <section className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Wskazówka AI</h2>
            <p className="text-gray-400 leading-relaxed font-medium">
              Możesz generować pytania egzaminacyjne automatycznie na podstawie treści lekcji. Przejdź do edycji kursu, aby wywołać generator.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 rotate-12 select-none">🤖</div>
        </section>
      </div>
    </div>
  )
}
