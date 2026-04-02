'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  Users, Search, Filter, ArrowUpRight, 
  Lock, Check, ChevronRight, Download,
  Phone, MapPin, ShoppingBag, DollarSign,
  TrendingUp, TrendingDown, Star, MoreHorizontal
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

export default function CustomersClient({ profile }: { profile: any }) {
  const t = useTranslations('Customers')
  const locale = useLocale()
  const isAr = locale === 'ar'
  
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    const fetchCustomers = async () => {
      const { data } = await supabase
        .from('orders')
        .select('customer_name, customer_phone, customer_wilaya, total_da, created_at')
        .order('created_at', { ascending: false })

      if (data) {
        // Group by phone to simulate CRM
        const grouped = data.reduce((acc: any, curr: any) => {
          if (!acc[curr.customer_phone]) {
            acc[curr.customer_phone] = {
              name: curr.customer_name,
              phone: curr.customer_phone,
              wilaya: curr.customer_wilaya,
              orders_count: 0,
              total_spent: 0,
              last_order: curr.created_at
            }
          }
          acc[curr.customer_phone].orders_count += 1
          acc[curr.customer_phone].total_spent += curr.total_da
          return acc
        }, {})
        setCustomers(Object.values(grouped))
      }
      setLoading(false)
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.wilaya.toLowerCase().includes(search.toLowerCase())
  )

  const isStarter = profile?.plan === 'starter'

  if (isStarter) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>{t('stats', { count: 0 })}</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 32, padding: '80px 40px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: '100%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ 
            width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.03)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px',
            border: '1px solid rgba(255,255,255,0.05)', color: '#3B82F6'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            {t('locked.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
            {t('locked.description')}
          </p>

          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16, maxWidth: 600, margin: '0 auto 48px' 
          }}>
            {[0, 1, 2, 3].map((f) => (
              <div key={f} style={{ 
                display: 'flex', alignItems: 'center', gap: 12, 
                padding: '16px', background: 'rgba(255,255,255,0.02)', 
                borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <Check size={16} color="#10B981" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {t(`locked.features.${f}`)}
                </span>
              </div>
            ))}
          </div>

          <Link href="/checkout" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', background: '#fff', color: '#000',
            borderRadius: 16, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 15px 30px rgba(255,255,255,0.1)',
            transition: 'transform 0.2s'
          }}>
            {t('locked.upgrade_btn')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>{t('stats', { count: customers.length })}</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 13,
            fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Avg LTV', value: '12,400 DA', icon: TrendingUp, color: '#10B981' },
          { label: 'Repeat Rate', value: '42%', icon: Star, color: '#F59E0B' },
          { label: 'Active Leads', value: '1,204', icon: Users, color: '#3B82F6' },
          { label: 'Churn Risk', value: '2.4%', icon: TrendingDown, color: '#EF4444' }
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ 
        display: 'flex', gap: 12, marginBottom: 24, 
        padding: '12px', background: 'rgba(255,255,255,0.02)', 
        borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
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

      {/* Customers Table */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.02)', 
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        borderRadius: 24, overflow: 'hidden' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: isAr ? 'right' : 'left' }}>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.customer')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.wilaya')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.orders')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.spent')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}>{t('table.last_order')}</th>
              <th style={{ padding: '20px 24px', fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c, i) => (
                <tr key={i} style={{ background: 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14
                      }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Phone size={10} /> {c.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                      <MapPin size={14} color="#3B82F6" />
                      {c.wilaya}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 14, fontWeight: 700 }}>
                      <ShoppingBag size={14} color="rgba(255,255,255,0.3)" />
                      {c.orders_count}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10B981', fontSize: 14, fontWeight: 800 }}>
                      <DollarSign size={14} />
                      {c.total_spent.toLocaleString()} DA
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    {new Date(c.last_order).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '80px 0', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 16 }}>
                    <Users size={48} style={{ margin: '0 auto' }} />
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
