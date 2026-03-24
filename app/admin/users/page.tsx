import { createClient } from '@/lib/supabase/server'
import { AdminService } from '@/lib/services/adminService'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const adminService = new AdminService(supabase)
  
  const users = await adminService.getAllUsers()

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Użytkownicy</h1>
        <p className="text-gray-500 mt-2 font-medium">Zarządzaj dostępem i rolami osób zarejestrowanych na platformie.</p>
      </header>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Użytkownik</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rola</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Firma</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Data dołączenia</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                      {u.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{u.email}</p>
                      <p className="text-[10px] text-gray-400 font-medium">ID: {u.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-gray-600">
                    {(u.companies as any)?.name || 'Brak'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm text-gray-400 font-medium">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('pl-PL') : '-'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-gray-400 hover:text-black transition">⚙️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!users || users.length === 0) && (
          <div className="text-center py-20 italic text-gray-400">
            Brak użytkowników w systemie.
          </div>
        )}
      </div>
    </div>
  )
}
