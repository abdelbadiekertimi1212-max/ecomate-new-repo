import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createChargilyCheckout } from '@/lib/chargily'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planName, amount } = await req.json()

    // Validate inputs
    if (!planName || !amount) {
      return NextResponse.json({ error: 'Invalid plan or amount' }, { status: 400 })
    }

    // Chargily V2 Checkout Logic
    // Documentation: https://dev.chargily.com/docs/checkouts
    const checkout = await createChargilyCheckout({
      amount: amount,
      currency: 'dzd',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success&plan=${planName}`,
      failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=canceled`,
      metadata: [
        { name: 'client_id', value: user.id },
        { name: 'plan_name', value: planName }
      ]
    })

    return NextResponse.json({ checkoutUrl: checkout.checkout_url })
  } catch (error: any) {
    console.error('Chargily Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
