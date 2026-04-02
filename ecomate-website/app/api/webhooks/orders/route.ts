import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { orderSchema } from '@/lib/validation/schemas'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate request body
    const validatedData = orderSchema.parse(body)
    
    const supabase = createAdminClient()
    
    // Generate order number
    const orderNumber = `ECO-${Date.now().toString().slice(-8)}`
    
    const { error: orderError } = await supabase.from('orders').insert({
      user_id: validatedData.client_id,
      order_number: orderNumber,
      customer_name: validatedData.customer_name,
      customer_phone: validatedData.phone,
      wilaya: validatedData.wilaya,
      total_da: validatedData.total_da,
      status: validatedData.status || 'pending',
      items: validatedData.items || [],
    })

    if (orderError) throw orderError
    
    // Upsert CRM
    const { error: crmError } = await supabase.from('crm_customers').upsert({
      user_id: validatedData.client_id,
      phone: validatedData.phone,
      full_name: validatedData.customer_name,
      wilaya: validatedData.wilaya,
    }, { onConflict: 'phone,user_id' })
    
    if (crmError) throw crmError

    return NextResponse.json({ success: true, order_number: orderNumber })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.issues 
      }, { status: 400 })
    }
    console.error('Order Webhook Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
