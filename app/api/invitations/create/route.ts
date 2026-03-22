import { createClient } from '@/lib/supabase/server'
import { generateToken } from '@/utils/token'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, company_id, course_id } = await req.json()
    
    if (!email || !company_id) {
       return NextResponse.json({ error: 'Brakujące dane' }, { status: 400 })
    }

    const supabase = await createClient()
    const token = generateToken()

    // 7 days expiration
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()

    const { error } = await supabase.from('invitations').insert({
      email,
      company_id,
      course_id: course_id || null, // Optional if default company course is desired
      token,
      expires_at,
    })

    if (error) {
       console.error('Error inserting invitation:', error)
       return NextResponse.json({ error: 'Nie udało się stworzyć zaproszenia' }, { status: 500 })
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const link = `${origin}/join?token=${token}`

    const { inviteEmail } = await import('@/emails/templates')
    const { sendEmail } = await import('@/utils/sendEmail')

    const emailContent = inviteEmail(link)
    await sendEmail(email, emailContent.subject, emailContent.html)

    return NextResponse.json({ link, ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
