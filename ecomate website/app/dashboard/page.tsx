import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { 
  DollarSign, ShoppingBag, Package, Clock, 
  PlusCircle, Bot, Settings, TrendingUp,
  ChevronRight, AlertCircle
} from 'lucide-react'

export default async function DashboardPage() {
  const locale = await getLocale()
  const t = await getTranslations('Dashboard.Home')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: orders }, { data: products }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id').eq('user_id', user.id),
  ])

  const totalRevenue = orders?.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total_da, 0) || 0
  const todayOrders = orders?.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 0

  const { data: growthPlan } = await supabase.from('plans').select('price').eq('name', 'Growth').single()

  const isAr = locale === 'ar'

  const stats = [
    { label: t('stats.revenue'), value: `${totalRevenue.toLocaleString()} DA`, change: t('stats.month'), icon: DollarSign, color: '#10B981' },
    { label: t('stats.orders_today'), value: todayOrders.toString(), change: t('stats.month'), icon: ShoppingBag, color: '#3B82F6' },
    { label: t('stats.products'), value: (products?.length || 0).toString(), change: t('stats.catalog'), icon: Package, color: '#8B5CF6' },
    { label: t('stats.pending_cod'), value: pendingOrders.toString(), change: t('stats.awaiting'), icon: Clock, color: '#F59E0B' },
  ]

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          fontFamily: 'var(--font-poppins)', fontSize: 32, fontWeight: 900, 
          color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' 
        }}>
          {t('title', { name: profile?.full_name?.split(' ')[0] || t('fallback_name') })}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
          {t('sub')}
        </p>
      </div>

      {/* Premium Trial Banner */}
      {profile?.plan === 'starter' && trialDaysLeft > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 20,
          padding: '24px', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          flexWrap: 'wrap', gap: 20,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -50, right: isAr ? 'auto' : -50, left: isAr ? -50 : 'auto', 
            width: 150, height: 150,
            background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(40px)'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                {t('trial.title', { days: trialDaysLeft })}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', maxWidth: 450 }}>
                {t('trial.sub')}
              </div>
            </div>
          </div>
          
          <Link 
            href="/checkout" 
            style={{ 
              padding: '12px 28px', fontSize: 14, fontWeight: 700, borderRadius: 12,
              background: '#fff', color: '#000', textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(255,255,255,0.1)',
              transition: 'transform 0.2s', position: 'relative'
            }}
          >
            {t('trial.btn', { price: growthPlan?.price?.toLocaleString() || '4,900' })}
          </Link>
        </div>
      )}

      {/* Stats Grid - Glassmorphism cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 20, padding: '24px',
            display: 'flex', flexDirection: 'column', gap: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, 
              background: `${s.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: s.color, border: `1px solid ${s.color}25`
            }}>
              <s.icon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ 
                fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, 
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 
              }}>
                {s.label}
              </div>
              <div style={{ 
                fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 800, 
                color: '#fff', marginBottom: 4 
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#10B981', fontWeight: 600 }}>{s.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
        {/* Orders Card */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)', 
          borderRadius: 24, overflow: 'hidden' 
        }}>
          <div style={{ 
            padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {t('orders.title')}
            </h3>
            <Link 
              href="/dashboard/orders" 
              style={{ 
                fontSize: 13, color: '#3B82F6', textDecoration: 'none', 
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 
              }}
            >
              {t('orders.view_all')}
            </Link>
          </div>
          
          <div style={{ padding: '0 12px' }}>
            {orders && orders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: isAr ? 'right' : 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>{t('orders.col_order')}</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>{t('orders.col_customer')}</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>{t('orders.col_total')}</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>{t('orders.col_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: 12,
                      transition: 'transform 0.2s'
                    }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff', borderRadius: isAr ? '0 12px 12px 0' : '12px 0 0 12px' }}>
                        #{o.order_number}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                        {o.customer_name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#10B981', fontWeight: 700, fontSize: 14 }}>
                        {o.total_da.toLocaleString()} DA
                      </td>
                      <td style={{ padding: '14px 16px', borderRadius: isAr ? '12px 0 0 12px' : '0 12px 12px 0' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                          background: o.status === 'delivered' ? 'rgba(16,185,129,0.1)' : o.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                          color: o.status === 'delivered' ? '#10B981' : o.status === 'pending' ? '#F59E0B' : '#3B82F6',
                          textTransform: 'uppercase', letterSpacing: '0.02em'
                        }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                }}>
                  <Package size={28} color="rgba(255,255,255,0.1)" />
                </div>
                <h4 style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>{t('orders.empty_h3')}</h4>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, maxWidth: 300, margin: '0 auto' }}>
                  {t('orders.empty_p')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { id: 'add_product', href: '/dashboard/products', icon: PlusCircle, color: '#3B82F6' },
            { id: 'ai_chatbot', href: '/dashboard/ai-chatbot', icon: Bot, color: '#10B981' },
            { id: 'settings', href: '/dashboard/settings', icon: Settings, color: '#6B7280' },
          ].map((a, i) => (
            <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 20, padding: '20px',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: `${a.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color
                }}>
                  <a.icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{t(`actions.${a.id}`)}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t(`actions.${a.id}_sub`)}</div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Help Card */}
          <div style={{
            marginTop: 8, padding: 24, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.05))',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <AlertCircle size={32} color="#10B981" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t('support.title')}</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 20 }}>
              {t('support.sub')}
            </p>
            <a 
              href="https://wa.me/213554162485" 
              target="_blank"
              style={{ 
                display: 'block', padding: '10px', background: 'rgba(255,255,255,0.05)',
                borderRadius: 12, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none'
              }}
            >
              {t('support.btn')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
