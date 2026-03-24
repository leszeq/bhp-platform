import { generateCertificate } from '@/utils/generateCertificate'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { user_id, exam_id } = await req.json()

  if (!user_id || !exam_id) {
    return NextResponse.json({ error: 'Missing user_id or exam_id' }, { status: 400 })
  }

  console.log('[CERT] Generating request for exam_id:', exam_id, 'user_id:', user.id)

  const { data: initialExamData } = await supabase
    .from('exams')
    .select('id, user_id, status, course_id')
    .eq('id', exam_id)
    .maybeSingle()

  let examData = initialExamData
  
  if (!examData || examData.status !== 'passed') {
    console.log('[CERT] Provided exam_id is not passed or missing. Searching for fallback...')
    
    // Use course_id from initial data if available, or fetch it again
    const courseIdToSearch = examData?.course_id || (await supabase.from('exams').select('course_id').eq('id', exam_id).limit(1).maybeSingle()).data?.course_id
    
    if (courseIdToSearch) {
      const { data: fallbackExam } = await supabase
        .from('exams')
        .select('id, user_id, status, course_id')
        .eq('course_id', courseIdToSearch)
        .eq('user_id', user.id)
        .eq('status', 'passed')
        .order('finished_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        
      if (fallbackExam) {
        console.log('[CERT] Found fallback passed exam:', fallbackExam.id)
        examData = fallbackExam as any
      }
    }
  }

  if (!examData) {
    console.error('[CERT] Exam not found:', exam_id)
    return NextResponse.json({ error: 'Nie odnaleziono egzaminu dla tego zapytania.' }, { status: 404 })
  }

  if (examData.user_id !== user.id) {
    console.error('[CERT] Forbidden: User mismatch')
    return NextResponse.json({ error: 'Nie masz uprawnień do tego certyfikatu.' }, { status: 403 })
  }
  
  if (examData.status !== 'passed') {
    console.warn('[CERT] Rejected: Status is:', examData.status)
    return NextResponse.json({ error: `Egzamin nie został jeszcze zaliczony (Status: ${examData.status}). Upewnij się, że ukończyłeś test z wynikiem min. 70%.` }, { status: 400 })
  }

  // 2. Check if certificate already exists for this exam
  let cert = null
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('*')
    .eq('exam_id', examData.id)
    .maybeSingle()

  if (existingCert) {
    cert = existingCert
  } else {
    // Generate new code and insert
    const code = uuidv4()
    const { data: newCert, error: insertError } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: examData.course_id,
        exam_id: exam_id,
        verification_code: code
      })
      .select()
      .single()
      
    if (insertError) {
      return NextResponse.json({ error: 'Could not save certificate record' }, { status: 500 })
    }
    cert = newCert

    // Nowe certyfikaty emitują emaila systemowego
    try {
      const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const link = `${origin}/verify/${code}` // Punkt weryfikacji służy jako idealne miejsce docelowe
      const { certificateEmail } = await import('@/emails/templates')
      const { sendEmail } = await import('@/utils/sendEmail')

      const emailContent = certificateEmail(link)
      if (user.email) {
         const result = await sendEmail(user.email, emailContent.subject, emailContent.html)
         if (!result.success) {
           console.warn(`[CERT E-MAIL FAILED] ${result.error}`)
         }
      }
    } catch (e) {
      console.error('Failed to send cert email:', e)
    }
  }

  if (!cert || !cert.verification_code) {
    return NextResponse.json({ error: 'Could not generate certificate code' }, { status: 500 })
  }

  const nameToUse = user.email?.split('@')[0] || 'Uczestnik Szkolenia'

  try {
    const pdfBytes = await generateCertificate(nameToUse, cert.verification_code)
    console.log('[CERT] PDF generated successfully, size:', pdfBytes.length)

    return new Response(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `attachment; filename="certyfikat-bhp-${cert.verification_code.substring(0,8)}.pdf"`
      },
    })
  } catch (genError: any) {
    console.error('[CERT] PDF Generator failed:', genError)
    return NextResponse.json({ 
      error: 'Błąd podczas generowania pliku PDF',
      detail: genError?.message || String(genError)
    }, { status: 500 })
  }
}
