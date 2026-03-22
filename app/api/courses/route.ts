import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('courses')
    .insert([
      {
        title: body.title,
        description: body.description,
      },
    ])

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data, error })
}
