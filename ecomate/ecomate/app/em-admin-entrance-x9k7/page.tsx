'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function AdminLoginContent() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      toast.error('Authentication failed. Access Denied.')
      setLoading(false)
      return
    }

    if (user) {
      const { data: admin } = await supabase.from('admin_users').select('role').eq('user_id', user.id).single()
      
      if (admin) {
        toast.success('Access Granted. Redirecting to Secure Panel...')
        // Redirect to the TOP-LEVEL secret panel link
        router.push('/em-admin-panel-x9k7')
        router.refresh()
        return
      } else {
        await supabase.auth.signOut()
        toast.error('Unauthorized. This incident has been logged.')
        setLoading(false)
        return
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020617', color: '#fff', fontFamily: 'var(--font-inter)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      <div style={{
        maxWidth: 400, width: '100%', padding: '48px 40px',
        background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)', position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Admin Portal
          </h1>
          <div style={{
            display: 'inline-block', padding: '2px 10px', background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 100,
            fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase'
          }}>Direct Link Access</div>
        </div>

        {authError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 12, padding: '12px', fontSize: 13, color: '#f87171', marginBottom: 20,
            textAlign: 'center'
          }}>
            ⚠️ {decodeURIComponent(authError)}
          </div>
        )}

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Identity</label>
            <input
              type="email" required
              style={{
                width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none'
              }}
              placeholder="admin@ecomate.dz" value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Passcode</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} required
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none'
                }}
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.3
              }}>
                {showPw ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, background: '#2563eb',
              color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer',
              marginTop: 8, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {loading ? 'Verifying...' : 'Authorize Login →'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.02em' }}>
          SYSTEM ID: EM-ADMIN-PRT-V2<br/>
          ENCRYPTED SESSION ACTIVE
        </div>
      </div>

      <style>{`
        input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5); }
        button:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#020617' }} />}>
      <AdminLoginContent />
    </Suspense>
  )
}
