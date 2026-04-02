'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, ShoppingBag, Package, Warehouse, 
  Users, Bot, Video, Globe, BarChart3, 
  Link2, Truck, Settings, LogOut, Zap, 
  ChevronRight, Lock, CreditCard
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, plan: 'starter' },
  { id: 'orders', href: '/dashboard/orders', icon: ShoppingBag, plan: 'starter' },
  { id: 'products', href: '/dashboard/products', icon: Package, plan: 'starter' },
  { id: 'inventory', href: '/dashboard/inventory', icon: Warehouse, plan: 'starter' },
  { id: 'customers', href: '/dashboard/customers', icon: Users, plan: 'growth' },
  { id: 'ai_chatbot', href: '/dashboard/ai-chatbot', icon: Bot, plan: 'starter' },
  { id: 'creative_studio', href: '/dashboard/creative', icon: Video, plan: 'starter' },
  //{ id: 'my_website', href: '/dashboard/my-website', icon: Globe, plan: 'starter' },
  { id: 'analytics', href: '/dashboard/analytics', icon: BarChart3, plan: 'growth' },
  { id: 'social_link', href: '/dashboard/integrations', icon: Link2, plan: 'starter' },
  { id: 'delivery', href: '/dashboard/delivery', icon: Truck, plan: 'starter' },
  { id: 'billing', href: '/dashboard/billing', icon: CreditCard, plan: 'starter' },
  { id: 'settings', href: '/dashboard/settings', icon: Settings, plan: 'starter' },
]

const planOrder = { starter: 0, growth: 1, business: 2, none: -1 }

export default function DashboardSidebar({ profile, userEmail }: { profile: any; userEmail?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Dashboard.Sidebar')
  
  const rawPlan = profile?.plan || (profile?.is_admin ? 'business' : 'starter')
  const userPlan = rawPlan.toLowerCase()

  function canAccess(requiredPlan: string) {
    return (planOrder[userPlan as keyof typeof planOrder] ?? 0) >= (planOrder[requiredPlan as keyof typeof planOrder] ?? 0)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success(t('logout'))
    router.push(`/${locale}`)
    router.refresh()
  }

  const isAr = locale === 'ar'

  return (
    <aside 
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        width: 260, flexShrink: 0,
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(30px) saturate(180%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh', 
        zIndex: 100,
        overflowY: 'auto'
      }}
    >
      {/* Premium Logo Section */}
      <Link href={`/${locale}`} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 32, paddingLeft: 8, textDecoration: 'none',
        transition: 'transform 0.2s',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #2563eb, #10B981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)'
        }}>
          <ShoppingBag size={20} color="white" />
        </div>
        <span style={{ 
          fontFamily: 'var(--font-poppins)', fontWeight: 800, fontSize: 24,
          letterSpacing: '-0.02em'
        }}>
          <span style={{ color: '#fff' }}>Eco</span>
          <span style={{ color: '#10B981' }}>Mate</span>
        </span>
      </Link>

      {/* User Profile Card (Premium Glass) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 16, padding: '16px', marginBottom: 28,
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            position: 'relative', width: 44, height: 44, borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {(profile?.full_name?.[0] || profile?.business_name?.[0] || '👤').toUpperCase()}
            <div style={{
              position: 'absolute', bottom: -2, right: -2, width: 12, height: 12,
              background: '#10B981', border: '2px solid #000', borderRadius: '50%'
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: 14, fontWeight: 600, color: '#fff', 
              fontFamily: 'var(--font-poppins)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {profile?.full_name || 'Merchant Pro'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
              {profile?.business_name || 'Official Store'}
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
          background: userPlan === 'business' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)',
          borderRadius: 8, padding: '4px 10px', fontSize: 10, fontWeight: 700,
          color: userPlan === 'business' ? '#3B82F6' : '#10B981',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          <Zap size={10} fill="currentColor" />
          {t(userPlan)}
        </div>
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            const locked = !canAccess(item.plan)
            const label = t(item.id)
            
            return (
              <div key={item.id} style={{ position: 'relative' }}>
                {locked ? (
                  <motion.div
                    whileHover={{ x: isAr ? -4 : 4 }}
                    style={{ 
                      opacity: 0.35, cursor: 'not-allowed', 
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 12,
                    }}
                    onClick={() => toast.error(t('upgrade_error', { plan: t(item.plan), label }))}
                  >
                    <item.icon size={18} strokeWidth={2.5} />
                    <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{label}</span>
                    <Lock size={12} opacity={0.6} />
                  </motion.div>
                ) : (
                  <Link
                    href={item.href}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <motion.div
                      whileHover={{ background: 'rgba(255,255,255, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 12,
                        background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                        color: active ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                      }}
                    >
                      <item.icon 
                        size={18} 
                        strokeWidth={2.5} 
                        color={active ? '#3B82F6' : undefined} 
                      />
                      <span style={{ 
                        fontSize: 14, 
                        fontWeight: active ? 600 : 500, 
                        flex: 1 
                      }}>
                        {label}
                      </span>
                      {active && (
                        <motion.div 
                          layoutId="active-indicator"
                          style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#3B82F6', boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Upgrade CTA Area */}
      <AnimatePresence>
        {(userPlan === 'starter' || userPlan === 'growth') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 'auto', paddingTop: 20
            }}
          >
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))',
                borderRadius: 20, padding: '20px', 
                border: '1px solid rgba(59, 130, 246, 0.1)',
                position: 'relative', overflow: 'hidden'
              }}>
                {/* Decorative blob */}
                <div style={{
                  position: 'absolute', top: -20, right: -20, width: 60, height: 60,
                  background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(20px)'
                }} />
                
                <div style={{ 
                  fontSize: 13, fontWeight: 700, color: '#3B82F6', 
                  fontFamily: 'var(--font-poppins)', display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 8
                }}>
                  <Zap size={14} fill="#3B82F6" />
                  {userPlan === 'starter' ? t('upgrade_cta_growth') : t('upgrade_cta_contact')}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>
                  {userPlan === 'starter' ? t('upgrade_sub_starter') : t('upgrade_sub_growth')}
                </div>
                
                <div style={{ 
                  background: '#fff', color: '#000', borderRadius: 12, 
                  padding: '10px', fontSize: 12, fontWeight: 700, textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                }}>
                  {userPlan === 'starter' ? t('price_mo') : t('plan_details')}
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Footer Action */}
      <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
        <button 
          onClick={handleLogout} 
          style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 12,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.color = '#EF4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          <LogOut size={16} />
          {t('logout')}
        </button>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </aside>
  )
}
