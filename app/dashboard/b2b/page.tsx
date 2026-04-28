import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreateCompanyForm } from './components/CreateCompanyForm'
import { AddEmployeeModal } from './components/AddEmployeeModal'
import { RemindButton } from './components/RemindButton'
import { signOut } from '@/lib/actions/auth'

export default async function B2BDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!company) {
    return (
       <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-12 text-center">
         <div className="w-16 h-16 bg-gray-50 border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🏢</div>
         <h1 className="text-2xl font-bold mb-3 text-gray-900">Panel Firmowy B2B</h1>
         <p className="text-gray-500 mb-8 font-medium">Załóż wirtualny profil swojej firmy, aby móc zapraszać pracowników na szkolenia i monitorować na jakim etapie są aktualnie ich postępy szkoleniowe.</p>
         <CreateCompanyForm />
       </div>
    )
  }

  // Use Admin Client to bypass RLS issues for the list
  const { data: companyUsers } = await supabaseAdmin
    .from('company_users')
    .select(`
      user_id,
      profiles(email)
    `)
    .eq('company_id', company.id)

  const { data: pendingInvitations } = await supabaseAdmin
    .from('invitations')
    .select('id, email, status, created_at')
    .eq('company_id', company.id)
    .eq('status', 'pending')

  const { data: companyCourses } = await supabase
    .from('company_courses')
    .select('*, courses(*)')
    .eq('company_id', company.id)

  console.log('[B2B] companyUsers:', companyUsers?.length)
  console.log('[B2B] pendingInvitations:', pendingInvitations?.length)

  const userIds = companyUsers?.map((cu) => cu.user_id) || []
  let certificates: any[] = []
  let exams: any[] = []
  
  if (userIds.length > 0) {
    const { data: certs } = await supabaseAdmin
      .from('certificates')
      .select('*')
      .in('user_id', userIds)
    certificates = certs || []

    const { data: activeExams } = await supabaseAdmin
      .from('exams')
      .select('*')
      .in('user_id', userIds)
    exams = activeExams || []
  }

  // Aggregate Employees List
  const employees: { id: string, email: string, status: string, type: string }[] = []

  companyUsers?.forEach((cu) => {
    const email = (cu.profiles as any)?.email || 'Użytkownik bez adresu email'
    const hasCert = certificates.some(c => c.user_id === cu.user_id)
    const hasExam = exams.some(e => e.user_id === cu.user_id)
    
    let status = 'not_started'
    if (hasCert) status = 'completed'
    else if (hasExam) status = 'in_progress'

    employees.push({
      id: cu.user_id,
      email,
      status,
      type: 'registered'
    })
  })

  pendingInvitations?.forEach((inv) => {
    employees.push({
      id: inv.id,
      email: inv.email,
      status: 'pending',
      type: 'invited'
    })
  })

  const total = employees.length
  const done = employees.filter(e => e.status === 'completed').length
  const pending = total - done
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <Link href="/dashboard" className="text-gray-400 hover:text-black transition flex items-center gap-2">
                <span className="p-2 bg-gray-100 rounded-full">&larr;</span>
             </Link>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">{company.name}</h1>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
               <span>Postęp szkolenia firmy: {progressPercent}%</span>
               {done === total && total > 0 && <span className="text-green-600">🎉 Ukończono!</span>}
            </div>
            <div className="w-full md:w-80 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {profile?.role === 'admin' && (
            <Link 
              href="/admin"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 border border-indigo-100 rounded-xl px-4 py-2 bg-indigo-50 hover:bg-indigo-100 transition shadow-sm"
            >
              Panel Admina
            </Link>
          )}
          <form action={signOut}>
             <button className="text-sm font-semibold text-gray-500 hover:text-red-600 transition border border-gray-200 px-4 py-2 rounded-lg bg-white shadow-sm hover:border-red-200">
               Wyloguj konto
             </button>
          </form>
        </div>
      </div>

      {/* 2. STATS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Pracownicy</p>
          <p className="text-4xl font-black text-gray-900">{total}</p>
        </div>
        <div className="p-6 border border-green-100 bg-green-50/30 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">Ukończone</p>
          <p className="text-4xl font-black text-green-700">{done}</p>
        </div>
        <div className="p-6 border border-amber-100 bg-amber-50/30 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">Do zrobienia</p>
          <p className="text-4xl font-black text-amber-700">{pending}</p>
        </div>
      </div>

      {/* 3. COMPANY COURSES */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-12">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Oferta Kursów</h2>
            <p className="text-sm text-gray-500 mt-1">Szkolenia wybrane dla Twoich pracowników.</p>
          </div>
          <Link 
            href="/dashboard/b2b/courses/add" 
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-black/10"
          >
            + Dodaj kurs z puli
          </Link>
        </div>
        
        <div className="p-6">
          {(!companyCourses || companyCourses.length === 0) ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Twoja firma nie ma jeszcze przypisanych kursów.</p>
              <p className="text-xs text-gray-400 mt-1">Kliknij przycisk powyżej, aby wybrać szkolenia z katalogu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyCourses.map((cc: any) => (
                <div key={cc.id} className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-indigo-100 transition shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{cc.courses.title}</p>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Aktywny</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. EMPLOYEE LIST & ADD MODAL */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-12">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80">
          <h2 className="text-lg font-bold text-gray-900">Zarządzanie Zespołem</h2>
          <p className="text-sm text-gray-500 mt-1">Dodawaj pracowników wysyłając im magiczny link autoryzujący na podany adres email.</p>
        </div>
        
        <div className="p-6 border-b border-gray-100 bg-white">
           <AddEmployeeModal companyId={company.id} companyCourses={companyCourses || []} />
        </div>

        <div className="divide-y divide-gray-100">
          {employees.length === 0 ? (
             <div className="p-12 text-center text-gray-500">
                Brak pracowników. Dodaj pierwszą osobę w formularzu powyżej.
             </div>
          ) : (
            employees.map((e) => (
              <div key={e.id} className="p-5 px-6 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50 transition gap-4">
                <div className="font-semibold text-gray-900 w-full sm:w-auto">{e.email}</div>
                
                <div className="flex w-full sm:w-auto flex-row justify-between sm:justify-end gap-6 items-center">
                  <span className="font-medium text-sm flex items-center gap-2">
                    {e.status === 'completed' && <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">✅ ukończone</span>}
                    {e.status === 'in_progress' && <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">⏳ w trakcie</span>}
                    {(e.status === 'not_started' || e.status === 'pending') && <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">❌ oczekuje</span>}
                  </span>

                  {e.status === 'completed' ? (
                    <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 flex-shrink-0 rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">
                      ↓ Certyfikat
                    </button>
                  ) : (
                    <RemindButton email={e.email} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
