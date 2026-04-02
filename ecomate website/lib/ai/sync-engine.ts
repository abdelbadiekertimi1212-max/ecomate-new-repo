import { createClient } from '@/lib/supabase/client'

/**
 * EcoMate AI Omni-Sync Engine
 * Logic for extracting sales data from unstructured DMs and syncing with CRM/Orders.
 */

export type Platform = 'facebook' | 'instagram' | 'whatsapp' | 'telegram'

export interface MessageExtraction {
  intent: 'order' | 'pricing' | 'lead' | 'complaint'
  customer_name?: string
  product?: string
  total_da?: number
  wilaya?: number
  confidence: number
}

/**
 * Simulates AI parsing of a message into structured data.
 * In production, this would call OpenAI or Google Gemini.
 */
export function extractIntelligence(text: string): MessageExtraction {
  const content = text.toLowerCase()
  
  // Simple heuristic-based extraction for simulation
  if (content.includes('order') || content.includes('buy') || content.includes('commander')) {
    return {
      intent: 'order',
      customer_name: 'Extracted Customer', // Mock
      product: content.includes('bag') ? 'Eco-Bag' : 'Standard Item',
      total_da: 4500,
      wilaya: 16,
      confidence: 0.88
    }
  }
  
  if (content.includes('price') || content.includes('how much') || content.includes('prix')) {
    return {
      intent: 'pricing',
      confidence: 0.95
    }
  }

  return {
    intent: 'lead',
    confidence: 0.5
  }
}

/**
 * Synchronizes an extraction with the core database.
 */
export async function syncWithCRM(userId: string, platform: Platform, text: string) {
  const supabase = createClient()
  const extraction = extractIntelligence(text)

  // 1. Create the log entry
  const { data: log, error: logError } = await supabase
    .from('chatbot_logs')
    .insert({
      user_id: userId,
      platform,
      sender_type: 'customer',
      content: text,
      metadata: { extraction }
    })
    .select()
    .single()

  if (logError) throw logError

  // 2. Store the AI extraction
  const { data: ext, error: extError } = await supabase
    .from('ai_extractions')
    .insert({
      user_id: userId,
      log_id: log.id,
      intent: extraction.intent,
      confidence: extraction.confidence,
      extracted_data: extraction
    })
    .select()
    .single()

  if (extError) throw extError

  // 3. If it's a high-confidence order, auto-create a pending order
  if (extraction.intent === 'order' && extraction.confidence > 0.8) {
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: `AI-${Math.floor(Math.random() * 10000)}`,
        customer_name: extraction.customer_name,
        total_da: extraction.total_da,
        status: 'pending',
        items: [{ product: extraction.product, qty: 1 }]
      })

    if (!orderError) {
       // Update as synced
       await supabase.from('ai_extractions').update({ is_be_synced: true }).eq('id', ext.id)
    }
  }

  return { log, ext }
}
