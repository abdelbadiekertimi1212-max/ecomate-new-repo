import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

// System Font Stacks (Bypassing Google Fonts for offline build stability)
const poppinsFont = "font-sans"
const interFont = "font-sans" 
const cairoFont = "font-sans"

export const metadata: Metadata = {
  title: {
    default: 'EcoMate — The All-in-One AI Sales & Fulfillment OS 🇩🇿',
    template: '%s | EcoMate'
  },
  description: 'EcoMate is Algeria\'s leading AI sales agency. We sync your Instagram, Facebook, and WhatsApp orders directly with your dashboard and Yalidine fulfillment.',
  keywords: ['ecomate', 'algeria', 'saas', 'ecommerce', 'ai sales', 'fulfillment', 'yalidine', 'manychat', 'algerian business'],
  authors: [{ name: 'Abdelbadie Kertimi' }],
  creator: 'Abdelbadie Kertimi',
  publisher: 'EcoMate',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ecomate-v2-prod.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar-DZ': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ecomate-v2-prod.vercel.app',
    siteName: 'EcoMate',
    title: 'EcoMate — Scale your Algerian Business with AI',
    description: 'Transform your social DMs into automated sales. Direct ManyChat ↔ Yalidine sync for Algerian SMEs.',
    images: [
      {
        url: '/og-image.jpg', // Placeholder - User should upload this
        width: 1200,
        height: 630,
        alt: 'EcoMate AI Sales OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoMate — AI sales & fulfillment for Algeria',
    description: 'The all-in-one platform for Algerian SMEs. AI chatbots + 58 Wilaya fulfillment.',
    images: ['/og-image.jpg'],
    creator: '@ecomate_dz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({ 
  children,
  params: { locale } 
}: { 
  children: React.ReactNode, 
  params: { locale: string } 
}) {
  const messages = await getMessages()
  const isArabic = locale === 'ar'

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} data-theme="dark" suppressHydrationWarning>
      <body className={`${poppinsFont} ${interFont} ${cairoFont} ${isArabic ? 'font-cairo' : 'font-inter'}`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GoogleAnalytics ga_id={process.env.GA_ID || 'G-XXXXXXXXXX'} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0a1628',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
