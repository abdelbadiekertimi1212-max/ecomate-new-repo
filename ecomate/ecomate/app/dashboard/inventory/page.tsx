'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const { data: inv } = await supabase
        .from('inventory')
        .select('*')
        .eq('client_id', data.user!.id)
        .order('product_name', { ascending: true })
      
      setInventory(inv || [])
      setLoading(false)
    })
  }, [])

  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const totalReserved = inventory.reduce((sum, item) => sum + item.reserved_qty, 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>Inventory 📦</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{inventory.length} SKUs · {totalUnits} units in warehouse</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading inventory...</div>
      ) : inventory.length > 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,.02)', borderBottom: '1px solid var(--border-c)' }}>
                <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Product</th>
                <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>SKU</th>
                <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Qty</th>
                <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Reserved</th>
                <th style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-c)', backgroundColor: item.quantity <= 10 ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{item.product_name}</td>
                  <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.sku || '-'}</td>
                  <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{item.quantity}</td>
                  <td style={{ padding: '16px 20px', fontSize: 14, color: 'var(--text-muted)' }}>{item.reserved_qty}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {item.quantity > 30 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,.1)', padding: '4px 10px', borderRadius: 100 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}/> In Stock
                      </span>
                    ) : item.quantity > 0 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#F59E0B', background: 'rgba(245,158,11,.1)', padding: '4px 10px', borderRadius: 100 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }}/> Low Stock
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#EF4444', background: 'rgba(239,68,68,.1)', padding: '4px 10px', borderRadius: 100 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}/> Out of Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏭</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>No inventory tracking yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 400, margin: '0 auto' }}>
            When you send stock to our fulfillment center, your tracked items will appear here automatically.
          </div>
        </div>
      )}
    </div>
  )
}
