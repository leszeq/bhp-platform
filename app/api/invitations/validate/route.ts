import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) return NextResponse.json({ valid: false })

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'
  )

  const { data, error } = await supabaseAdmin
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !data) {
    console.error('[VALIDATE] Token not found or DB error:', error?.message)
    return NextResponse.json({ valid: false })
  }

  const isExpired = new Date(data.expires_at) < new Date()
  const isPending = data.status === 'pending'

  if (!isPending || isExpired) {
    const reason = isExpired ? 'expired' : 'not_pending'
    console.warn(`[VALIDATE] Invalid token state: ${reason}`, { 
      token, 
      status: data.status, 
      expires_at: data.expires_at,
      now: new Date().toISOString()
    })
    return NextResponse.json({ valid: false, reason })
  }

  return NextResponse.json({ valid: true, invitation: data })
}
