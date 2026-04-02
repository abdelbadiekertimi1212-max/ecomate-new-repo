import { getTranslations } from 'next-intl/server'
import InventoryClient from './InventoryClient'

export async function generateMetadata() {
  const t = await getTranslations('Inventory')
  return {
    title: t('title'),
    description: t('sub', { count: 0, units: 0 }).split('(')[0]
  }
}

export default async function InventoryPage() {
  return <InventoryClient />
}
