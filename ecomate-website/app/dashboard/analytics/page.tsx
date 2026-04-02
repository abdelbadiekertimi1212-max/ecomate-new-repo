import ComingSoon from '@/components/dashboard/ComingSoon'
import { BarChart3 } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Dashboard.Analytics' })
  return {
    title: t('title'),
    description: t('sub')
  }
}

export default function AnalyticsPage() {
  return (
    <ComingSoon 
      icon={BarChart3} 
      titleKey="Dashboard.Analytics.title" 
      subKey="Dashboard.ComingSoon.sub" 
    />
  )
}
