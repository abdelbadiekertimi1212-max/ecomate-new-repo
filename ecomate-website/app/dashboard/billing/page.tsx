'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Shield, Zap, Star, Crown, Check
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from '@/components/ui/animations'

export default function BillingPage() {
  const t = useTranslations('Billing')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null) // FIXME: Define Profile interface
  const [uploading, setUploading] = useState(false)

  const PLANS = [
    { key: 'starter', icon: Zap, color: 'blue' },
    { key: 'growth', icon: Star, color: 'purple', popular: true },
    { key: 'business', icon: Crown, color: 'amber' },
  ]

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'success') {
      toast.success(t('toasts.success'), { duration: 5000 })
    } else if (status === 'cancel') {
      toast.error(t('toasts.cancel'))
    }

    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [searchParams, t])

  const handleUpgrade = async (planKey: string, price: string) => {
    setUploading(true)
    try {
      const res = await fetch('/api/billing/chargily/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planName: t(`plans.${planKey}.name`), 
          amount: parseInt(price.replace(',', '')) 
        })
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || t('toasts.error'))
      }
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message)
    }
    setUploading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full"
      />
    </div>
  )

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white mb-2 tracking-tight"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 font-medium"
          >
            {t('sub')}
          </motion.p>
        </div>
      </div>

      {/* Current Plan Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-[#ffffff]/[0.02] border border-white/[0.08] rounded-[40px] p-8 md:p-12 backdrop-blur-2xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[28px] bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-all duration-500">
              <Shield size={32} />
            </div>
            <div>
              <div className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">{t('current.title')}</div>
              <h2 className="text-3xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors uppercase">{profile?.plan || 'STARTER TRIAL'}</h2>
              <p className="text-sm text-white/30 font-medium">{t('current.valid_until', { date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'en-US') })}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 transition-all group-hover:border-blue-500/20`}>
              <div className={`w-2 h-2 rounded-full ${profile?.onboarding_status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
              <span className="text-sm font-black text-white/60 tracking-wider">
                {profile?.onboarding_status === 'active' ? t('current.status.active') : t('current.status.pending')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLANS.map((p) => {
          const Icon = p.icon
          const planData = t.raw(`plans.${p.key}`)
          return (
            <StaggerItem key={p.key} className="relative group">
              <div className={`absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${p.popular ? 'from-blue-500/30' : ''}`} />
              <div className={`relative h-full bg-[#ffffff]/[0.02] border transition-all duration-500 ${p.popular ? 'border-blue-500/30 bg-blue-500/[0.02] shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)]' : 'border-white/[0.05] hover:border-white/10'} rounded-[48px] p-10 backdrop-blur-xl flex flex-col`}>
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30">
                    {planData.popular}
                  </div>
                )}
                
                <div className="mb-10 flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${p.popular ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white/[0.03] text-white/40'}`}>
                    <Icon size={24} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{planData.name}</h3>
                <div className="flex items-baseline gap-3 mb-10">
                  <span className="text-4xl font-black text-white">{planData.price}</span>
                  <span className="text-sm font-bold text-white/30">{t('currency')}</span>
                </div>

                <div className="space-y-5 mb-12 flex-1">
                  {planData.features.map((f: string) => (
                    <div key={f} className="flex items-start gap-4 group/item">
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-white/50 group-hover/item:text-white/80 transition-colors leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpgrade(p.key, planData.price)}
                  disabled={uploading}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center font-black text-sm uppercase tracking-[0.1em] transition-all duration-300 disabled:opacity-50 ${p.popular ? 'bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/5' : 'bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.05] hover:border-white/20'}`}
                >
                  {uploading ? t('btns.redirecting') : t('btns.select', { plan: planData.name })}
                </motion.button>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </div>
  )
}
