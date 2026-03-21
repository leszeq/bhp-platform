import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('certificates')
    .select(`
      *,
      profiles(email),
      courses(title)
    `)
    .eq('verification_code', code)
    .single()

  if (!data) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({
    valid: true,
    user: (data.profiles as any)?.email,
    course: (data.courses as any)?.title,
    date: data.issued_at,
  })
}
