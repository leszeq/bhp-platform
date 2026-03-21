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

  const { exam_id } = await req.json()

  // 1. Verify the exam was actually passed by the current user
  const { data: examData } = await supabase
    .from('exams')
    .select('user_id, status, course_id')
    .eq('id', exam_id)
    .single()

  if (!examData || examData.user_id !== user.id) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  if (examData.status !== 'passed') {
     return NextResponse.json({ error: 'Exam not passed' }, { status: 400 })
  }

  // 2. Check if certificate already exists for this exam
  let cert = null
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('*')
    .eq('exam_id', exam_id)
    .single()

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
  }

  const nameToUse = user.email?.split('@')[0] || 'Uczestnik Szkolenia'
  const nameAscii = nameToUse.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L")

  const pdfBytes = await generateCertificate(nameAscii, cert.verification_code)

  return new Response(pdfBytes as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certyfikat-bhp-${cert.verification_code.substring(0,8)}.pdf"`
    },
  })
}
