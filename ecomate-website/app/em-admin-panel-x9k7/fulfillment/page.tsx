'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const statuses = ['pending', 'packing', 'handed_to_carrier', 'in_transit', 'delivered', 'returned']

export default function AdminFulfillmentPage() {
  const [fOrders, setFOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const supabase = createClient()
    const { data } = await supabase
      .from('fulfillment_orders')
      .select(`
        *,
        profiles:client_id(full_name, business_name),
        orders:order_id(order_number, customer_name, wilaya)
      `)
      .order('created_at', { ascending: false })
    
    setFOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('fulfillment_orders')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Status updated')
      setFOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-poppins)' }}>
          Fulfillment Orders 📦
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Manage warehouse dispatch and tracking statuses.</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading orders...</div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Client</th>
                <th style={{ padding: '16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Order Ref</th>
                <th style={{ padding: '16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>End Customer</th>
                <th style={{ padding: '16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Tracking</th>
                <th style={{ padding: '16px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {fOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px', fontSize: 14, color: '#fff' }}>
                    <div style={{ fontWeight: 600 }}>{o.profiles?.business_name || 'Unknown'}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{o.profiles?.full_name}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: '#10b981', fontFamily: 'monospace' }}>
                    {o.orders?.order_number || '-'}
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    <div>{o.orders?.customer_name || '-'}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{o.orders?.wilaya || '-'}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {o.tracking_code || 'Not assigned'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={o.status || 'pending'} 
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                        color: o.status === 'delivered' ? '#10b981' : o.status === 'returned' ? '#ef4444' : '#3b82f6',
                        padding: '6px 10px', borderRadius: 8, fontSize: 13, outline: 'none', cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {fOrders.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No fulfillment orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
