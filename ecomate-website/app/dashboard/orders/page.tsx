import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import OrdersClient from './OrdersClient'

export async function generateMetadata() {
  const t = await getTranslations('Orders')
  return {
    title: t('title'),
    description: t('sub')
  }
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return <OrdersClient initialOrders={orders || []} userId={user!.id} />
}
