'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'

export default function VerifyPage() {
  const t = useTranslations('Auth.Verify')

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-body)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px' 
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: '48px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract Glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1))',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          color: '#2563eb'
        }}>
          <Mail size={36} strokeWidth={1.5} />
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-poppins)', 
          fontSize: 28, 
          fontWeight: 800, 
          color: '#fff', 
          marginBottom: 16,
          letterSpacing: '-0.02em'
        }}>
          {t('title')}
        </h1>

        <p style={{ 
          fontSize: 16, 
          lineHeight: 1.6, 
          color: 'rgba(255, 255, 255, 0.5)', 
          marginBottom: 40 
        }}>
          {t('description')}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <Link href="/auth/login" className="btn-primary" style={{
            justifyContent: 'center',
            padding: '16px',
            fontSize: 15
          }}>
            {t('btn_login')}
          </Link>

          <button style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '8px',
            transition: 'color 0.2s'
          }}>
            <RefreshCw size={14} />
            {t('btn_resend')}
          </button>
        </div>

        <div style={{
          marginTop: 48,
          paddingTop: 32,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255, 255, 255, 0.3)',
            textDecoration: 'none',
            fontSize: 13,
            transition: 'color 0.2s'
          }}>
            <ArrowLeft size={14} />
            {t('back_home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
