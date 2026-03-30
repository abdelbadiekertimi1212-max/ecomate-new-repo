import { createClient } from './client'

export async function logActivity(userId: string, type: string, title: string, description: string = '', metadata: any = {}) {
  const supabase = createClient()
  const { error } = await supabase.from('activity_log').insert({
    user_id: userId,
    type,
    title,
    description,
    metadata
  })
  
  if (error) {
    console.error('Failed to log activity:', error)
  }
}
