/**
 * lib/chargily.ts
 * Utility for Chargily Pay V2 (Algerian Payments)
 */

const CHARGILY_API_BASE = process.env.CHARGILY_API_BASE || 'https://pay.chargily.net/api/v2' // Live Production URL

export async function createChargilyCheckout(payload: {
  amount: number;
  currency: string;
  success_url: string;
  failure_url: string;
  metadata?: any;
}) {
  const secretKey = process.env.CHARGILY_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('CHARGILY_SECRET_KEY is not defined in environment variables')
  }

  const response = await fetch(`${CHARGILY_API_BASE}/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Chargily API Error: ${JSON.stringify(errorData)}`)
  }

  return await response.json()
}
