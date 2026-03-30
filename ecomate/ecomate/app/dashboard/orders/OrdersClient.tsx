'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Package, Search, Plus, Filter, User, MapPin, 
  Phone, Calendar, ArrowRight, CheckCircle2, 
  Truck, Clock, MoreVertical, XCircle 
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: '#f59e0b', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#2563eb', icon: CheckCircle2 },
  shipped: { label: 'Shipped', color: '#8b5cf6', icon: Truck },
  delivered: { label: 'Delivered', color: '#10B981', icon: Package },
}

const KANBAN_STAGES = ['pending', 'confirmed', 'shipped', 'delivered']

export default function OrdersClient({ initialOrders, userId }: { initialOrders: any[], userId: string }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customer_name: '', customer_phone: '', wilaya: '', address: '', total_da: '', notes: ''
  })

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search)
    )
  }, [orders, search])

  const groupedOrders = useMemo(() => {
    const groups: Record<string, any[]> = { pending: [], confirmed: [], shipped: [], delivered: [], cancelled: [] }
    filteredOrders.forEach(o => {
      if (groups[o.status]) groups[o.status].push(o)
      else groups.pending.push(o)
    })
    return groups
  }, [filteredOrders])

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) return toast.error(error.message)
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
    toast.success(`Order moved to ${status}`)
  }

  async function handleAddOrder(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('orders').insert({
      user_id: userId,
      order_number: `ORD-${Date.now().toString().slice(-6)}`,
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      wilaya: newOrder.wilaya,
      address: newOrder.address,
      total_da: parseInt(newOrder.total_da) || 0,
      status: 'pending'
    }).select().single()

    if (error) { toast.error(error.message) }
    else {
      setOrders(prev => [data, ...prev])
      setShowAdd(false)
      setNewOrder({ customer_name: '', customer_phone: '', wilaya: '', address: '', total_da: '', notes: '' })
      toast.success('Order created')
    }
    setAdding(false)
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Orders Pipeline 📦</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>Fulfillment & Logistics center powered by AI Sync.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              placeholder="Search or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '12px 16px 12px 40px', background: 'rgba(255,255,255,.03)', border: '1px solid var(--border-c)', borderRadius: 12, color: '#fff', fontSize: 13, width: 220 }}
            />
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ padding: '12px 20px' }}>
            <Plus size={18} style={{ marginRight: 6 }} /> New Order
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, minHeight: '60vh' }}>
        {KANBAN_STAGES.map((stage) => {
          const Icon = STATUS_CONFIG[stage].icon
          return (
            <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4px', borderBottom: `2px solid ${STATUS_CONFIG[stage].color}20` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color={STATUS_CONFIG[stage].color} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '.05em' }}>{STATUS_CONFIG[stage].label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>
                  {groupedOrders[stage]?.length || 0}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {groupedOrders[stage]?.map((order) => (
                  <div key={order.id} style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-c)', 
                    borderRadius: 16, 
                    padding: 16,
                    transition: 'transform .2s',
                    cursor: 'default'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                       <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.2)', fontFamily: 'monaco, monospace' }}>#{order.order_number}</span>
                       <button style={{ color: 'rgba(255,255,255,0.2)' }}><MoreVertical size={14} /></button>
                    </div>
                    
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{order.customer_name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                      <Phone size={10} /> {order.customer_phone}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Wilaya</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{order.wilaya || '—'}</div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Total</div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: '#10B981' }}>{order.total_da.toLocaleString()} DA</div>
                       </div>
                    </div>

                    {/* Quick Move */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                       {stage !== 'delivered' && (
                         <button 
                          onClick={() => updateStatus(order.id, KANBAN_STAGES[KANBAN_STAGES.indexOf(stage) + 1])}
                          style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: 6, 
                            padding: '8px', 
                            borderRadius: 8, 
                            background: `${STATUS_CONFIG[stage].color}15`, 
                            color: STATUS_CONFIG[stage].color, 
                            fontSize: 10, 
                            fontWeight: 800, 
                            border: 'none',
                            cursor: 'pointer'
                          }}
                         >
                           Move →
                         </button>
                       )}
                       <button style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.2)', border: 'none' }}>
                          <XCircle size={14} />
                       </button>
                    </div>
                  </div>
                ))}
                {groupedOrders[stage]?.length === 0 && (
                  <div style={{ padding: '32px 0', textAlign: 'center', border: '1px dashed var(--border-c)', borderRadius: 20, opacity: 0.2 }}>
                    <Icon size={24} style={{ margin: '0 auto 8px' }} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Empty Stage</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

       {/* Add Order Modal */}
       {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,16,31,.95)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,.1)', borderRadius: 32, padding: '40px', width: '100%', maxWidth: 500 }}>
            <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 24 }}>New Manual Order</h3>
            <form onSubmit={handleAddOrder} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Customer Name</label>
                  <input 
                    style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff' }} 
                    required value={newOrder.customer_name} onChange={e => setNewOrder(n => ({ ...n, customer_name: e.target.value }))} placeholder="Ahmed Benali" 
                  />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Phone</label>
                    <input 
                      style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff' }} 
                      value={newOrder.customer_phone} onChange={e => setNewOrder(n => ({ ...n, customer_phone: e.target.value }))} placeholder="055..." 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Wilaya</label>
                    <input 
                      style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff' }} 
                      value={newOrder.wilaya} onChange={e => setNewOrder(n => ({ ...n, wilaya: e.target.value }))} placeholder="16 - Alger" 
                    />
                  </div>
               </div>
               <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Total DA</label>
                  <input 
                    type="number"
                    style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-c)', color: '#fff' }} 
                    required value={newOrder.total_da} onChange={e => setNewOrder(n => ({ ...n, total_da: e.target.value }))} placeholder="5000" 
                  />
               </div>
               <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ flex: 1 }}>Discard</button>
                  <button type="submit" disabled={adding} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    {adding ? 'Creating...' : 'Create Order →'}
                  </button>
               </div>
            </form>
          </div>
        </div>
       )}
    </div>
  )
}
