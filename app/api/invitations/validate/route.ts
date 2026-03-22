import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) return NextResponse.json({ valid: false })

  const supabase = await createClient()
  const { data } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (!data || data.status !== 'pending' || new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({ valid: true, invitation: data })
}
