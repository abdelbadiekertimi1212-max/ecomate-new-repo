import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHmac } from 'node:crypto'

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('chargily-signature')
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)

    // Security: Verify Signature using CHARGILY_SECRET_KEY
    if (signature && process.env.CHARGILY_SECRET_KEY) {
      const hmac = createHmac('sha256', process.env.CHARGILY_SECRET_KEY)
      const expectedSignature = hmac.update(rawBody).digest('hex')
      
      if (signature !== expectedSignature) {
        console.error('[CHARGILY WEBHOOK] Invalid Signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    if (body.type === 'checkout.paid') {
      const checkout = body.data
      const metadata = checkout.metadata || []
      
      const clientId = metadata.find((m: any) => m.name === 'client_id')?.value
      const planName = metadata.find((m: any) => m.name === 'plan_name')?.value

      if (clientId && planName) {
        const supabase = await createClient()
        
        // Upgrade user plan in profiles
        const { error } = await supabase
          .from('profiles')
          .update({ 
               plan: planName.toLowerCase(),
               onboarding_status: 'active' 
          })
          .eq('id', clientId)

        if (error) throw error
        
        console.log(`[CHARGILY WEBHOOK] Success: Upgraded ${clientId} to ${planName}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Chargily Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
