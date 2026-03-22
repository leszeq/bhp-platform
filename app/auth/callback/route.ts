import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorFromUrl = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // URL to redirect to after sign in process completes
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('--- CALLBACK HIT ---')
  console.log('URL:', request.url)
  console.log('CODE:', code)

  if (errorFromUrl) {
    console.error('Supabase redirect error:', errorFromUrl, errorDescription)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Session exchanged successfully')
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Exchange error:', error)
    }
  }

  // Handle errors
  return NextResponse.redirect(`${origin}/login?error=Nieprawidłowy_lub_wygasły_link`)
}
