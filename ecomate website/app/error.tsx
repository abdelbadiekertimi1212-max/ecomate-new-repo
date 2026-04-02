'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { RefreshCw, AlertTriangle, MessageSquare } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('Errors.Global')

  useEffect(() => {
    // Log the error to an error reporting service (e.g. Sentry)
    console.error('[GLOBAL ERROR]', error)
  }, [error])

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
    }}>
      <div style={{ 
        width: 80, height: 80, borderRadius: 24, 
        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 
      }}>
        <AlertTriangle size={36} color="#ef4444" />
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{t('title')}</h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 450, margin: '0 auto 40px', lineHeight: 1.6 }}>{t('sub')}</p>
      
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
         <button 
           onClick={() => reset()} 
           className="btn-primary" 
           style={{ padding: '14px 28px', cursor: 'pointer' }}
         >
            <RefreshCw size={18} style={{ marginInlineEnd: 10 }} />
            {t('btn')}
         </button>
         <button onClick={() => window.open('https://wa.me/213555000000', '_blank')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '14px 28px', textDecoration: 'none', cursor: 'pointer'
         }}>
            <MessageSquare size={18} />
            Contact Support
         </button>
      </div>
      
      {error.digest && (
        <div style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
          Error Reference: {error.digest}
        </div>
      )}
    </div>
  )
}
