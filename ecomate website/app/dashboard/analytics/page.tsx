import ComingSoon from '@/components/dashboard/ComingSoon'
import { BarChart3 } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
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
