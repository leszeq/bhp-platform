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

    const { CompanyService } = await import('@/lib/services/companyService')
    const companyService = new CompanyService(supabase)

    await companyService.createInvitation({
      email,
      company_id,
      course_id,
      token,
      expires_at,
    })

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const link = `${origin}/join?token=${token}`

    const { inviteEmail } = await import('@/emails/templates')
    const { sendEmail } = await import('@/utils/sendEmail')

    const emailContent = inviteEmail(link)
    const emailResult = await sendEmail(email, emailContent.subject, emailContent.html)

    if (!emailResult.success) {
      console.warn('Email send failed but invitation created:', emailResult.error)
      // We still return ok for the invite, but maybe explain it's pending email?
    }

    return NextResponse.json({ link, ok: true, emailSent: emailResult.success })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
