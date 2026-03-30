'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Share2, MessageSquare, Zap, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    meta_business_id: '',
    instagram_page_id: '',
    telegram_bot_token: ''
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setFormData({
            meta_business_id: data.meta_business_id || '',
            instagram_page_id: data.instagram_page_id || '',
            telegram_bot_token: data.telegram_bot_token || ''
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('profiles').update({
      ...formData,
      onboarding_status: 'integrating'
    }).eq('id', user?.id)

    if (error) {
      toast.error('Failed to update integrations.')
    } else {
      toast.success('Integration details submitted. Our team will verify and activate your sync.')
      setProfile({ ...profile, ...formData, onboarding_status: 'integrating' })
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div style={{ maxWidth: 800 }}>
       <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Social Integrations 🔌</h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>Securely connect your social platforms to the EcoMate AI Sales Sync.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Form Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
           <form onSubmit={handleSave} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <Shield size={20} color="#10b981" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Onboarding Details</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Meta Business ID</label>
                  <input 
                    type="text" 
                    value={formData.meta_business_id}
                    onChange={(e) => setFormData({ ...formData, meta_business_id: e.target.value })}
                    placeholder="e.g. 1029384756..."
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff', fontSize: 14 }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Instagram Page Handle / ID</label>
                  <input 
                    type="text" 
                    value={formData.instagram_page_id}
                    onChange={(e) => setFormData({ ...formData, instagram_page_id: e.target.value })}
                    placeholder="e.g. yourbrand_official"
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff', fontSize: 14 }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Telegram Bot Token (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.telegram_bot_token}
                    onChange={(e) => setFormData({ ...formData, telegram_bot_token: e.target.value })}
                    placeholder="e.g. 12456:AAFd..."
                    style={{ width: '100%', padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff', fontSize: 14 }} 
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: 12, fontSize: 14 }}>
                    {saving ? 'Saving...' : 'Submit Integration Details →'}
                  </button>
                </div>
              </div>
           </form>

           <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                 <AlertCircle size={20} color="#2563eb" />
                 <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Why we need this?</h4>
                    <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                      EcoMate uses a managed infrastructure to power your AI chatbot. By providing these IDs, our staff can securely link your social pages to our master sync engine without requiring individual ManyChat accounts.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 24, textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Sync Status</label>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '6px 14px', 
                borderRadius: 100, 
                fontSize: 12, 
                fontWeight: 700, 
                background: profile.onboarding_status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: profile.onboarding_status === 'active' ? '#10b981' : '#f59e0b'
              }}>
                {profile.onboarding_status === 'active' ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                {profile.onboarding_status === 'active' ? 'Active' : 'Pending Verification'}
              </div>
            </div>

            <div style={{ padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Next Steps:</h5>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#2563eb' }}>1.</span> Submit credentials
                </li>
                <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 8 }}>
                   <span style={{ color: '#2563eb' }}>2.</span> Admin verification (24h)
                </li>
                <li style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 8 }}>
                   <span style={{ color: '#2563eb' }}>3.</span> AI Sync activation
                </li>
              </ul>
            </div>
        </div>
      </div>
    </div>
  )
}
