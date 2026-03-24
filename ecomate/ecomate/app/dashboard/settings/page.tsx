'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [tab, setTab] = useState<'profile' | 'security' | 'plan'>('profile')
  const [form, setForm] = useState({ full_name: '', business_name: '', phone: '' })
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
      setForm({ full_name: p?.full_name || '', business_name: p?.business_name || '', phone: p?.phone || '' })
    })
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update(form).eq('id', user!.id)
    if (error) toast.error(error.message)
    else {
      toast.success('Profile updated!')
      router.refresh()
    }
    setLoading(false)
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pw.newPw.length < 8) return toast.error('Password must be at least 8 characters')
    if (pw.newPw !== pw.confirm) return toast.error('Passwords do not match')
    setPwLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pw.newPw })
    if (error) toast.error(error.message)
    else { toast.success('Password updated!'); setPw({ current: '', newPw: '', confirm: '' }) }
    setPwLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 16px', background: 'rgba(255,255,255,.05)',
    border: '1.5px solid rgba(255,255,255,.08)', borderRadius: 10,
    fontSize: 14, color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-inter)',
    transition: 'border-color .2s',
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>Settings ⚙️</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Manage your account, security and subscription.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 12, padding: 4 }}>
        {(['profile', 'security', 'plan'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: tab === t ? 'rgba(37,99,235,.2)' : 'transparent',
            color: tab === t ? '#2563eb' : 'var(--text-muted)',
            fontFamily: 'var(--font-poppins)', fontWeight: 600, fontSize: 13,
            textTransform: 'capitalize', transition: 'all .2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, padding: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 20 }}>Profile Information</h3>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input style={inputStyle} type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Business / Store Name</label>
              <input style={inputStyle} type="text" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} placeholder="My Store DZ" />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Phone Number</label>
              <input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+213 555 00 00 00" />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Current Plan</label>
              <div style={{ padding: '11px 16px', background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.2)', borderRadius: 10, fontSize: 14, color: '#2563eb', fontWeight: 600 }}>
                {profile?.plan === 'starter' ? '⏱ Starter (Trial)' : profile?.plan === 'growth' ? '⚡ Growth' : '💎 Business'}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, padding: '28px' }}>
          <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 20 }}>Change Password</h3>
          <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'New Password', key: 'newPw', placeholder: 'Min. 8 characters' },
              { label: 'Confirm New Password', key: 'confirm', placeholder: 'Re-enter password' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input style={inputStyle} type="password" value={pw[f.key as keyof typeof pw]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              </div>
            ))}
            <button type="submit" disabled={pwLoading} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Plan Tab */}
      {tab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { slug: 'starter', name: 'Starter', price: 'Free', desc: '14-day trial', features: ['Basic AI Chatbot', '50 orders/month', '1 social channel'] },
            { slug: 'growth', name: 'Growth', price: '4,900 DA/mo', desc: 'Full AI system', features: ['Unlimited orders', 'All platforms', 'CRM + Analytics', 'AI Growth Agent'], popular: true },
            { slug: 'business', name: 'Business', price: 'Custom', desc: 'Enterprise', features: ['Everything in Growth', 'Priority support', 'Dedicated manager'] },
          ].map(plan => (
            <div key={plan.slug} style={{
              background: plan.popular ? 'linear-gradient(145deg,rgba(30,58,138,.5),rgba(10,20,38,.8))' : 'var(--bg-card)',
              border: `1px solid ${profile?.plan === plan.slug ? '#10B981' : plan.popular ? 'rgba(37,99,235,.3)' : 'var(--border-c)'}`,
              borderRadius: 14, padding: '20px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
                  {plan.name} {profile?.plan === plan.slug && '✓ Current Plan'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{plan.desc}</div>
                <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 22, fontWeight: 800, color: plan.slug === 'growth' ? '#10B981' : 'var(--text-main)' }}>{plan.price}</div>
              </div>
              <div>
                {plan.features.map(f => <div key={f} style={{ fontSize: 12.5, color: 'var(--text-sub)', marginBottom: 4 }}>✓ {f}</div>)}
              </div>
              {profile?.plan !== plan.slug && (
                <a href={plan.slug === 'business' ? 'mailto:contact@ecomate.dz' : '/checkout'} className="btn-primary" style={{ padding: '10px 22px', fontSize: 13, textDecoration: 'none' }}>
                  {plan.slug === 'business' ? 'Contact Sales' : 'Upgrade →'}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
