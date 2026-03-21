import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { courseId, userId } = await req.json()

    // Use origin if available, otherwise localhost
    const origin = req.headers.get('origin') || 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Szkolenie BHP dla pracowników',
            },
            unit_amount: 9900, // 99 PLN
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/course/${courseId}?success=true`,
      cancel_url: `${origin}/course/${courseId}?canceled=true`,
      metadata: {
        courseId,
        userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
