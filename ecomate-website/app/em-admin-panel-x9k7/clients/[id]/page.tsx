'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, MessageCircle, Mail, Shield, Trash2, Calendar, MapPin, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ClientDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClient()
  }, [id])

  async function fetchClient() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      toast.error('Client not found')
      router.push('/em-admin-panel-x9k7/clients')
    } else {
      setClient(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.2)' }}>
      Analyzing merchant dossier...
    </div>
  )

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/em-admin-panel-x9k7/clients" style={{
          width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none'
        }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {client.full_name || 'Anonymous Merchant'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>ID: {id}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Main Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Card: Business Vitals */}
          <div style={{
            background: 'rgba(5, 10, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24,
            padding: 32
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>
              Business Vitals 💼
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Entity / Store</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{client.business_name || 'Individual'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Wilaya</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{client.wilaya || 'Alger'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Niche</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{client.niche || 'General Merchant'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Joined</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{new Date(client.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Social Sales Intelligence */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-c)',
            borderRadius: 24,
            padding: 32
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Social Sales Intelligence 🤖
              </h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 100 }}>
                Omni-Sync Active
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { platform: 'WhatsApp', text: 'Confirming order for 5 items...', status: 'Synced', amount: '12,500 DA' },
                { platform: 'Facebook', text: 'Pricing query handled by AI', status: 'Lead', amount: '—' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {item.platform === 'WhatsApp' ? '💬' : '📘'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.text}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{item.status} • {item.platform}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.amount !== '—' ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Timeline */}
          <div style={{
            background: 'rgba(5, 10, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24,
            padding: 32
          }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>
              Activity Timeline ⏱️
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.05)' }} />
              
              <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0a1628', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Merchant Registered</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>User successfully completed the 3-step onboarding.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0a1628', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚀</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>EcoMate Dashboard Active</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Merchant has logged in and reached the workspace.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Communication */}
          <div style={{
            background: 'rgba(5, 10, 20, 0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24,
            padding: 24
          }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              Quick Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={`https://wa.me/${client.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(37,211,102,0.1)', color: '#25D366', textDecoration: 'none', fontWeight: 600, fontSize: 14
              }}>
                <MessageCircle size={18} />
                WhatsApp Merchant
              </a>
              <a href={`mailto:${client.email}`} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(37,99,235,0.1)', color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: 14
              }}>
                <Mail size={18} />
                Send Official Email
              </a>
            </div>
          </div>

          {/* Safety Zone */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            borderRadius: 24,
            padding: 24
          }}>
             <h3 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(239, 68, 68, 0.5)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              Safety Zone
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Restrict Access
              </button>
              <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'none', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
