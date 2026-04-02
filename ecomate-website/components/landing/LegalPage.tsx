'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, FileText, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LegalPage({ type }: { type: 'Privacy' | 'Terms' }) {
  const t = useTranslations(`Legal.${type}`)
  const router = useRouter()

  const sections = t.raw('sections') as { h: string, p: string }[]

  return (
    <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '120px 5% 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
           <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, color: '#fff', cursor: 'pointer' }}>
             <ArrowLeft size={20} />
           </button>
           <div>
             <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{t('title')}</h1>
             <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Last Updated: March 2026</p>
           </div>
        </div>

        {/* Content */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: '48px' }}>
           <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>{t('p1')}</p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {sections.map((s, i) => (
                <div key={i}>
                   <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#2563eb' }}>{i + 1}</span>
                      {s.h}
                   </h2>
                   <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', paddingInlineStart: 44 }}>{s.p}</p>
                </div>
              ))}
           </div>

           <div style={{ marginTop: 60, padding: 32, background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 20, textAlign: 'center' }}>
              <CheckCircle size={24} color="#10b981" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Verified for Algerian Marketplace</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Compliant with B2B SaaS standards</p>
           </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
           <Link href="/" style={{ fontSize: 14, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
             Return to Homepage
           </Link>
        </div>
      </div>
    </div>
  )
}
