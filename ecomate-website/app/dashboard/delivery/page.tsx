import ComingSoon from '@/components/dashboard/ComingSoon'
import { Truck } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Dashboard.Sidebar' })
  return {
    title: t('delivery'),
    description: t('delivery')
  }
}

export default function DeliveryPage() {
  return (
    <ComingSoon 
      icon={Truck} 
      titleKey="Dashboard.Sidebar.delivery" 
      subKey="Dashboard.ComingSoon.sub" 
    />
  )
}
