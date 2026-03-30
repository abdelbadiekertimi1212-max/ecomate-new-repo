'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, ExternalLink, MessageSquare, Zap, CheckCircle2, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminIntegrationsPage() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setClients(data.filter((c: any) => c.onboarding_status !== 'pending'))
      setLoading(false)
    }
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ onboarding_status: status }).eq('id', id)
    if (error) toast.error('Failed to update status.')
    else {
      toast.success(`Client ${status} success.`)
      setClients(clients.map(c => c.id === id ? { ...c, onboarding_status: status } : c))
    }
  }

  if (loading) return null

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Social Link Management 🛡️</h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>Agency oversight: Connect merchant credentials to the master sync engine.</p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-c)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Merchant</th>
              <th style={{ padding: '24px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Meta / Page ID</th>
              <th style={{ padding: '24px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Telegram Token</th>
              <th style={{ padding: '24px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '24px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No integration requests pending.</td>
              </tr>
            ) : clients.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#2563eb" /></div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.full_name || 'Unnamed Merchant'}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '24px' }}>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{c.meta_business_id || '—'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>Page: {c.instagram_page_id || 'Not provided'}</div>
                </td>
                <td style={{ padding: '24px' }}>
                   <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.telegram_bot_token || '—'}</div>
                </td>
                <td style={{ padding: '24px' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    padding: '4px 10px', 
                    borderRadius: 100, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: c.onboarding_status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: c.onboarding_status === 'active' ? '#10b981' : '#f59e0b'
                  }}>
                    {c.onboarding_status === 'active' ? 'ACTIVE' : 'INTEGRATING...'}
                  </div>
                </td>
                <td style={{ padding: '24px', textAlign: 'right' }}>
                   {c.onboarding_status !== 'active' ? (
                     <button 
                       onClick={() => updateStatus(c.id, 'active')}
                       style={{ padding: '8px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                     >
                       Activate Sync
                     </button>
                   ) : (
                     <button 
                       onClick={() => updateStatus(c.id, 'integrating')}
                       style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                     >
                       Reset to Pending
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
