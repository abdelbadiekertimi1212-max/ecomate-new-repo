import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

/**
 * Phase 3: Dynamic Catalog API (ManyChat ➔ EcoMate)
 * Formats the merchant's product catalog into ManyChat Gallery JSON.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')

  if (!clientId) {
    return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  }

  // 1. Fetch live products for this client
  const supabase = createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .eq('in_stock', true)
    .limit(10) // ManyChat carousel limit is usually 10

  if (error || !products) {
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 })
  }

  // 2. Map to ManyChat V2 Gallery Format
  const elements = products.map((p) => ({
    title: p.name,
    subtitle: `${p.price.toLocaleString()} DA | ${p.category || 'Category'}`,
    image_url: p.image_url || 'https://via.placeholder.com/600x400?text=Product',
    action_url: `${req.nextUrl.origin}/products/${p.id}`,
    buttons: [
      {
        type: 'url',
        caption: '🛒 Order Now',
        url: `${req.nextUrl.origin}/checkout?productId=${p.id}&clientId=${clientId}`
      },
      {
        type: 'node',
        caption: '💬 Ask AI',
        target: 'AI_Product_Inquiry_Node'
      }
    ]
  }))

  return NextResponse.json({
    version: 'v2',
    content: {
      type: 'gallery',
      elements: elements.length > 0 ? elements : [{
        title: 'Catalog Empty',
        subtitle: 'Visit our dashboard to add products.',
        image_url: 'https://via.placeholder.com/600x400?text=Empty',
        buttons: []
      }]
    }
  })
}
