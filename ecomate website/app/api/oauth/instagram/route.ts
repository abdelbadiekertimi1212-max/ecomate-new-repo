import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const code = searchParams.get('code')

    // In a real scenario, we would redirect to Instagram's OAuth page first:
    // https://api.instagram.com/oauth/authorize?client_id=APP_ID&redirect_uri=THIS_ROUTE&scope=user_profile,user_media&response_type=code
    
    if (!clientId) {
      return new NextResponse('Missing client_id', { status: 400 })
    }

    // Since this is a specialized Make.com flow where Make does the heavy lifting,
    // we simulate the callback success and update the profile table to trigger the webhook.
    
    const mockPageId = `ig_${Date.now()}`
    const mockAccessToken = `IGQAQ_${Math.random().toString(36).substring(2)}`

    const supabase = createAdminClient()
    
    const { error } = await supabase.from('profiles').update({
      instagram_page_id: mockPageId,
      instagram_access_token: mockAccessToken,
      chatbot_status: 'connecting' // Make.com triggers on this and updates it to 'connected'
    }).eq('id', clientId)

    if (error) throw error

    // Redirect the user back to the dashboard AI page
    return NextResponse.redirect(new URL('/dashboard/ai-chatbot?status=connected', request.url))
  } catch (error) {
    console.error('Instagram OAuth Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
