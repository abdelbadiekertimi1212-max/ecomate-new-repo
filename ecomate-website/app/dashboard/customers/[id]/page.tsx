'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { User, Phone, MapPin, TrendingUp, ShoppingBag, MessageSquare, ArrowLeft, Calendar, DollarSign, Tag } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      // Fetch Customer
      const { data: cust, error: cErr } = await supabase
        .from('crm_customers')
        .select('*')
        .eq('id', id)
        .single()

      if (cErr) {
        toast.error('Customer not found')
        router.push('/dashboard/customers')
        return
      }

      setCustomer(cust)

      // Fetch Orders for Intelligence
      const { data: ords } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })

      setOrders(ords || [])
      setLoading(false)
    }
    loadData()
  }, [id, router])

  if (loading) return <div style={{ padding: 40, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Loading Intelligence...</div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{customer.name}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Customer Intelligence Dossier</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Left Sidebar: Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 32 }}>
             <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <User size={32} color="#2563eb" />
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <Phone size={16} color="rgba(255,255,255,0.3)" />
                   <span style={{ fontSize: 14, color: '#fff' }}>{customer.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <MapPin size={16} color="rgba(255,255,255,0.3)" />
                   <span style={{ fontSize: 14, color: '#fff' }}>{customer.wilaya || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <Calendar size={16} color="rgba(255,255,255,0.3)" />
                   <span style={{ fontSize: 14, color: '#fff' }}>Joined: {new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
             </div>
          </div>

          <div style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 24, padding: 32 }}>
             <h3 style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="#2563eb" /> Financial Insights
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Total Lifetime Spend</span>
                   <span style={{ fontSize: 15, fontWeight: 900, color: '#10b981' }}>{customer.total_spend?.toLocaleString() || 0} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Total Orders</span>
                   <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{orders.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Avg Order Value</span>
                   <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>
                     {orders.length > 0 ? Math.round(customer.total_spend / orders.length).toLocaleString() : 0} DA
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content: Intel Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
           {/* Section 1: Product Affinity */}
           <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                 <ShoppingBag size={20} color="#2563eb" /> Product Affinity
              </h3>
              {orders.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                   <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Tag size={16} color="#2563eb" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800 }}>Primary Category</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 4 }}>Apparel & Shoes</div>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Calendar size={16} color="#10b981" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800 }}>Purchase Frequency</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 4 }}>Bi-Monthly</div>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <DollarSign size={16} color="#f59e0b" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800 }}>Price Sensitivity</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 4 }}>Premium Tier</div>
                   </div>
                </div>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Not enough data to calculate affinity.</p>
              )}
           </div>

           {/* Section 2: Recent Sync History */}
           <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                 <MessageSquare size={20} color="#2563eb" /> Social Sync History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {orders.length > 0 ? orders.map(o => (
                   <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                         <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Order confirmed via ManyChat</div>
                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 11, fontWeight: 800 }}>{o.status.toUpperCase()}</div>
                   </div>
                 )) : (
                   <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No social interactions synced yet.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
