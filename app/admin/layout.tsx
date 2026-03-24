import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Sprawdzamy rolę admina
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-black tracking-tighter text-black uppercase">
            BHP <span className="text-indigo-600">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 rounded-xl hover:bg-gray-100 transition">
            🏠 Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition">
            📚 Kursy
          </Link>
          <Link href="/admin/questions" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition">
            ❓ Pytania AI
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition">
            👥 Użytkownicy
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/dashboard" className="text-xs font-semibold text-gray-400 hover:text-black transition">
            &larr; Powrót do Panelu Użytkownika
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
