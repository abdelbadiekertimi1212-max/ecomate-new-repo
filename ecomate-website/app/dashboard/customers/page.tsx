import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import CustomersClient from './CustomersClient'

export async function generateMetadata() {
  const t = await getTranslations('Customers')
  return {
    title: t('title'),
    description: t('stats', { count: 0 }).split('(')[0] // Simple cleanup for desc
  }
}

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <CustomersClient profile={profile} />
}
