import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    const supabase = await createClient()
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
    )

    const { data: invitation } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (!invitation || invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Zaproszenie nieaktywne lub wygasłe' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', invitation.email)
      .single()

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const existingAuthUser = users?.find(u => u.email === invitation.email)

    const existingUserId = existingProfile?.id || existingAuthUser?.id

    if (existingUserId) {
      // User exists (either in Profiles or just in Auth), we update the status and send them an OTP magically to login
      const { error: updateError } = await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id)
      if (updateError) console.error('[ACCEPT] Failed to update invitation:', updateError)

      const { error: cuError } = await supabaseAdmin.from('company_users').insert({ company_id: invitation.company_id, user_id: existingUserId })
      if (cuError) console.error('[ACCEPT] Failed to insert company_user:', cuError)

      if (invitation.course_id) {
         const { error: ucError } = await supabaseAdmin.from('user_courses').insert({ user_id: existingUserId, course_id: invitation.course_id })
         if (ucError) console.error('[ACCEPT] Failed to insert user_course:', ucError)
      }

      await supabase.auth.signInWithOtp({ 
        email: invitation.email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/course/${invitation.course_id}`
        }
      })
      
      return NextResponse.json({ 
        ok: true, 
        requiresMagicLink: true, 
        message: 'Konto już istnieje. Sprawdź e-mail (przysłaliśmy link logujących cię bezpiecznie).' 
      })
    } else {
      // New User - Create & Login
      const randomPassword = randomBytes(16).toString('hex')
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password: randomPassword,
        email_confirm: true 
      })

      if (authError || !authData.user) {
         console.error('[ACCEPT] Auth creation failed:', authError?.message || 'No user returned')
         return NextResponse.json({ 
           error: 'Nie udało się stworzyć konta w chmurze.',
           details: authError?.message 
         }, { status: 500 })
      }
      
      const userId = authData.user.id
      
      // Auto login the user in the Next.js cookies
      await supabase.auth.signInWithPassword({ email: invitation.email, password: randomPassword })

      const { error: updateError } = await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id)
      if (updateError) console.error('[ACCEPT NEW] Failed to update invitation:', updateError)

      const { error: cuError } = await supabaseAdmin.from('company_users').insert({ company_id: invitation.company_id, user_id: userId })
      if (cuError) console.error('[ACCEPT NEW] Failed to insert company_user:', cuError)

      if (invitation.course_id) {
         const { error: ucError } = await supabaseAdmin.from('user_courses').insert({ user_id: userId, course_id: invitation.course_id })
         if (ucError) console.error('[ACCEPT NEW] Failed to insert user_course:', ucError)
      }

      return NextResponse.json({ ok: true, requiresMagicLink: false, courseId: invitation.course_id })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
