'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, Landmark, Zap, Shield, CheckCircle2, UploadCloud, AlertCircle, Phone, ArrowUpRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

const PLANS = [
  { name: 'Starter', price: '2,900', features: ['AI Sales Sync (1 Channel)', '50 Orders/mo', 'Basic CRM'] },
  { name: 'Growth', price: '5,900', features: ['AI Sales Sync (Omni-channel)', 'Unlimited Orders', 'Power CRM', 'Analytics'], popular: true },
  { name: 'Business', price: '12,900', features: ['Multi-tenant (5 stores)', 'Priority AI Support', 'Advanced Logistics', 'Custom Webhooks'] },
]

import { useSearchParams } from 'next/navigation'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [showPayModal, setShowPayModal] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'success') {
      toast.success('Subscription updated successfully! 🚀', { duration: 5000 })
    } else if (status === 'cancel') {
      toast.error('Payment cancelled.')
    }

    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [searchParams])

  const handleUpgrade = async (plan: any) => {
    setUploading(true)
    try {
      const res = await fetch('/api/billing/chargily/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: plan.name, amount: parseInt(plan.price.replace(',', '')) })
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to start checkout')
      }
    } catch (err: any) {
      toast.error(err.message)
    }
    setUploading(false)
  }

  if (loading) return null

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Plans & Billing ⚡</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>Choose the best plan to scale your sales with EcoMate.</p>
      </div>

      {/* Current Plan Card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(16,185,129,0.05))', border: '1px solid var(--border-c)', borderRadius: 24, padding: 32, marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <div style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 }}>Active Plan</div>
           <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{profile.plan?.toUpperCase() || 'STARTER TRIAL'}</h2>
           <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Valid until: {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 13, fontWeight: 700 }}>{profile.onboarding_status === 'active' ? 'Sync Active' : 'Sync Pending'}</div>
           </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {PLANS.map((p) => (
          <div key={p.name} style={{ 
            background: 'var(--bg-card)', 
            border: p.popular ? '2px solid #2563eb' : '1px solid var(--border-c)', 
            borderRadius: 32, 
            padding: 40,
            position: 'relative'
          }}>
            {p.popular && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '4px 14px', borderRadius: 100, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em' }}>Most Popular</div>
            )}
            
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 12 }}>{p.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
               <span style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{p.price}</span>
               <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>DA / month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
               {p.features.map(f => (
                 <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                   <CheckCircle2 size={16} color="#10b981" /> {f}
                 </li>
               ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(p)}
              disabled={uploading}
              className={p.popular ? 'btn-primary' : 'btn-secondary'} 
              style={{ width: '100%', padding: '14px', borderRadius: 12, justifyContent: 'center' }}
            >
              {uploading ? 'Redirecting...' : `Select ${p.name}`}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
