import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    const supabase = await createClient()
    
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

    let userId = null

    if (existingProfile) {
      // User exists, we update the status and send them an OTP magically to login
      userId = existingProfile.id
      
      await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id)
      await supabaseAdmin.from('company_users').insert({ company_id: invitation.company_id, user_id: userId })
      if (invitation.course_id) {
         await supabaseAdmin.from('user_courses').insert({ user_id: userId, course_id: invitation.course_id })
      }

      await supabase.auth.signInWithOtp({ email: invitation.email })
      
      return NextResponse.json({ 
        ok: true, 
        requiresMagicLink: true, 
        message: 'Konto już istnieje. Sprawdź e-mail (przysłaliśmy link logujących cię bezpiecznie).' 
      })
    } else {
      // New User - Magically create session
      const randomPassword = randomBytes(16).toString('hex')
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password: randomPassword,
        email_confirm: true 
      })

      if (authError || !authData.user) {
         return NextResponse.json({ error: 'Nie udało się stworzyć konta w chmurze.' }, { status: 500 })
      }
      
      userId = authData.user.id
      
      // Auto login the user in the Next.js cookies
      await supabase.auth.signInWithPassword({ email: invitation.email, password: randomPassword })

      await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id)
      await supabaseAdmin.from('company_users').insert({ company_id: invitation.company_id, user_id: userId })
      if (invitation.course_id) {
         await supabaseAdmin.from('user_courses').insert({ user_id: userId, course_id: invitation.course_id })
      }

      return NextResponse.json({ ok: true, requiresMagicLink: false, courseId: invitation.course_id })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
