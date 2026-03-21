import { stripe } from '@/lib/stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata?.userId
    const courseId = session.metadata?.courseId

    if (!userId || !courseId) {
      console.error('Missing metadata in successful checkout session')
      return new Response('Webhook metadata missing', { status: 400 })
    }

    // Dodano użycie ewentualnego klucza serwisowego jeśli by był, ponieważ webhooki działają asynchronicznie bez ciastek sesji użytwkownika
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabaseAdmin.from('payments').insert({
      user_id: userId,
      course_id: courseId,
      status: 'paid',
    })

    if (error) {
      console.error('Błąd zapisu płatności do bazy: ', error)
      return new Response('Database error', { status: 500 })
    }
  }

  return new Response('ok', { status: 200 })
}
