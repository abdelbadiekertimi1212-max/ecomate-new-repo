'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Package, Boxes, TrendingDown, AlertTriangle, 
  CheckCircle2, Search, Filter, ArrowUpRight,
  History, Info, MoreVertical, Layers
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

export default function InventoryClient() {
  const t = useTranslations('Inventory')
  const locale = useLocale()
  const isAr = locale === 'ar'
  
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    const fetchInventory = async () => {
      const { data: products } = await supabase.from('products').select('*')
      const { data: orders } = await supabase.from('orders').select('*').not('status', 'eq', 'delivered')

      if (products) {
        const enriched = products.map((p: any) => ({
          ...p,
          reserved: orders?.filter(o => o.items?.some((i: any) => i.id === p.id)).length || 0,
          status: p.stock > 10 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock'
        }))
        setInventory(enriched)
      }
      setLoading(false)
    }

    fetchInventory()
  }, [])

  const filteredInventory = inventory.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0)

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t('sub', { count: inventory.length, units: totalUnits })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 13,
            fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <History size={16} />
            Stock History
          </button>
        </div>
      </div>

      {/* Quick Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Value', value: '840,000 DA', icon: Layers, color: '#3B82F6' },
          { label: 'Low Stock', value: inventory.filter(p => p.status === 'low_stock').length.toString(), icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Out of Stock', value: inventory.filter(p => p.status === 'out_of_stock').length.toString(), icon: TrendingDown, color: '#EF4444' },
          { label: 'In Stock', value: inventory.filter(p => p.status === 'in_stock').length.toString(), icon: CheckCircle2, color: '#10B981' }
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search SKU or Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 48px', background: 'transparent',
              border: 'none', color: '#fff', fontSize: 14, outline: 'none'
            }}
          />
        </div>
        <button style={{
          padding: '0 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
        }}>
          <Filter size={18} />
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 24, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: isAr ? 'right' : 'left' }}>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.product')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.sku')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.qty')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.reserved')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.status')}</th>
              <th style={{ padding: '20px 24px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((p, i) => (
                <tr key={i} style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Package size={20} color="rgba(255,255,255,0.4)" />
                      </div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{p.sku || 'N/A'}</td>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 800 }}>{p.stock}</td>
                  <td style={{ padding: '16px 24px', color: '#F59E0B', fontWeight: 600 }}>{p.reserved}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: p.status === 'in_stock' ? 'rgba(16,185,129,0.1)' : p.status === 'low_stock' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: p.status === 'in_stock' ? '#10B981' : p.status === 'low_stock' ? '#F59E0B' : '#EF4444',
                      textTransform: 'uppercase'
                    }}>
                      {t(`status.${p.status}`)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '80px 0', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.05)', marginBottom: 16 }}>
                    <Boxes size={64} style={{ margin: '0 auto' }} />
                  </div>
                  <h3 style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{t('empty.title')}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>{t('empty.description')}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
