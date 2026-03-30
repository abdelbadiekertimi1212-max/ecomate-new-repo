'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, AlertCircle, Compass } from 'lucide-react'

export default function NotFound() {
  const t = useTranslations('Errors.404')
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          fontSize: 'clamp(80px, 15vw, 180px)', 
          fontWeight: 900, 
          letterSpacing: '-.05em',
          background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 20,
          filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.3))'
        }}>
          404
        </div>
        
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{t('title')}</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 450, margin: '0 auto 40px', lineHeight: 1.6 }}>{t('sub')}</p>
        
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
           <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 28px' }}>
              <Home size={18} style={{ marginInlineEnd: 10 }} />
              {t('btn')}
           </Link>
           <Link href="https://wa.me/213555000000" target="_blank" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '14px 28px', textDecoration: 'none'
           }}>
              <Compass size={18} />
              Support
           </Link>
        </div>
      </div>
    </div>
  )
}
