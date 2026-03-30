import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

/**
 * Phase 4: Order & CRM Webhook Receiver (Make.com ➔ EcoMate)
 * Ingests orders from social DMs into the core database.
 */

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const secret = process.env.WEBHOOK_SECRET || 'ecomate_master_sync_key_2025'

  // 1. Security Check
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await req.json()
    const { clientId, fullName, phone, wilaya, productName, quantity, totalAmount, deliveryType } = payload

    if (!clientId || !phone) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // 2. Step 1: Upsert CRM Customer
    const { data: customer, error: crmError } = await supabase
      .from('crm_customers')
      .upsert({
        user_id: clientId,
        phone,
        full_name: fullName,
        wilaya: wilaya?.toString(),
        total_spend: totalAmount // This should ideally be additive, but for demo we upsert.
      }, { onConflict: 'phone,user_id' })
      .select()
      .single()

    if (crmError) throw crmError

    // 3. Step 2: Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: clientId,
        order_number: `AI-${Math.floor(Math.random() * 9000) + 1000}`,
        customer_name: fullName,
        customer_phone: phone,
        wilaya: wilaya?.toString(),
        total_da: totalAmount,
        quantity: quantity || 1,
        delivery_type: deliveryType || 'home',
        status: 'pending',
        items: [{ name: productName, qty: quantity || 1 }]
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. Step 3: Log Activity (Phase 1 AI Sync)
    await supabase.from('chatbot_logs').insert({
       user_id: clientId,
       platform: 'whatsapp',
       sender_type: 'ai',
       content: `Order created by AI Sync: ${productName} x ${quantity}`
    })

    return NextResponse.json({ success: true, orderId: order.id, customerId: customer.id })

  } catch (err: any) {
    console.error('Webhook Error:', err.message)
    return NextResponse.json({ error: 'Failed to process webhook', details: err.message }, { status: 500 })
  }
}
