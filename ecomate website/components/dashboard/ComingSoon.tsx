import { LucideIcon, Construction, ChevronLeft } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'

interface ComingSoonProps {
  icon?: LucideIcon
  titleKey?: string
  subKey?: string
}

export default async function ComingSoon({ 
  icon: Icon = Construction, 
  titleKey = 'ComingSoon.title', 
  subKey = 'ComingSoon.sub' 
}: ComingSoonProps) {
  const t = await getTranslations()
  const locale = await getLocale()
  const isAr = locale === 'ar'

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      style={{ 
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px'
      }}
    >
      <div style={{
        position: 'relative',
        marginBottom: 32
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 140,
          height: 140,
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0
        }} />
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          color: '#3B82F6'
        }}>
          <Icon size={40} strokeWidth={1.5} />
        </div>
      </div>

      <h1 style={{ 
        fontFamily: 'var(--font-poppins)', 
        fontSize: 32, 
        fontWeight: 900, 
        color: '#fff', 
        marginBottom: 12,
        letterSpacing: '-0.02em'
      }}>
        {t(titleKey)}
      </h1>
      
      <p style={{ 
        fontSize: 16, 
        color: 'rgba(255,255,255,0.4)', 
        maxWidth: 400, 
        lineHeight: 1.6,
        marginBottom: 40
      }}>
        {t(subKey)}
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={{
          padding: '14px 32px',
          borderRadius: 14,
          background: '#fff',
          color: '#000',
          border: 'none',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(255,255,255,0.1)'
        }}>
          {t('ComingSoon.btn')}
        </button>
        
        <Link 
          href="/dashboard" 
          style={{
            padding: '14px 32px',
            borderRadius: 14,
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {isAr ? null : <ChevronLeft size={18} />}
          {t('ComingSoon.back')}
          {isAr ? <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} /> : null}
        </Link>
      </div>
    </div>
  )
}
