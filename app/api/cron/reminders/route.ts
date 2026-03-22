import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { reminderEmail, inProgressEmail } from '@/emails/templates'
import { sendEmail } from '@/utils/sendEmail'

// This endpoint should be protected by a Vercel Cron Secret in production
export async function GET(req: Request) {
  try {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // We fetch open invitations
    const { data: invitations } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .in('status', ['pending', 'accepted'])

    if (!invitations) {
      return NextResponse.json({ ok: true, processed: 0 })
    }

    const now = new Date()
    let emailsSent = 0

    for (const inv of invitations) {
      // Obliczanie precyzyjnego wieku zaproszenia
      const createdAt = new Date(inv.created_at)
      const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      
      let shouldSend = false
      
      // Algorytm: przypomnienie po 1, 3 i 5 dniu
      if (diffDays >= 1 && inv.reminder_count === 0) shouldSend = true
      if (diffDays >= 3 && inv.reminder_count === 1) shouldSend = true
      if (diffDays >= 5 && inv.reminder_count === 2) shouldSend = true

      if (shouldSend) {
         // Sprawdzenie na jakim etapie jest profil autentyczny w user_courses jeśli zaproszenie zaakceptowano
         let courseStatus: string = 'not_started'
         
         if (inv.status === 'accepted') {
           const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('email', inv.email).single()
           if (profile && inv.course_id) {
             const { data: userCourse } = await supabaseAdmin.from('user_courses').select('status').eq('user_id', profile.id).eq('course_id', inv.course_id).single()
             
             // Check if certificate exists (implies completion beyond status flag)
             const { data: cert } = await supabaseAdmin.from('certificates').select('id').eq('user_id', profile.id).eq('course_id', inv.course_id).single()
             
             if (cert) {
                courseStatus = 'completed'
             } else if (userCourse) {
                // we'll assume they started if they haven't finished
                courseStatus = 'in_progress'
             }
           }
         }

         if (courseStatus === 'completed') {
            // Zamknij reminder count wyższym limitem, by oszczędzić bazę per iteracja
            await supabaseAdmin.from('invitations').update({ reminder_count: 99 }).eq('id', inv.id)
            continue
         }

         const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://twojadomena.pl'
         const link = `${origin}/join?token=${inv.token}`

         const emailTpl = courseStatus === 'in_progress' ? inProgressEmail(link) : reminderEmail(link)

         await sendEmail(inv.email, emailTpl.subject, emailTpl.html)

         await supabaseAdmin
           .from('invitations')
           .update({
             reminder_count: inv.reminder_count + 1,
             email_sent_at: new Date().toISOString()
           })
           .eq('id', inv.id)

         emailsSent++
      }
    }

    return NextResponse.json({ ok: true, processed: invitations.length, emailsSent })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
