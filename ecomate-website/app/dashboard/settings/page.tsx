'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Shield, CreditCard, LogOut, Trash2, Camera, Mail, Phone, Store, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { FadeIn, ScaleIn, StaggerContainer } from '@/components/ui/animations'

export default function SettingsPage() {
  const t = useTranslations('Settings')
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    email: ''
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setProfileData({
            full_name: data.full_name || '',
            business_name: data.business_name || '',
            phone: data.phone || '',
            email: user.email || ''
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('profiles').update({
        full_name: profileData.full_name,
        business_name: profileData.business_name,
        phone: profileData.phone
      }).eq('id', user?.id)

      if (error) throw error
      toast.success(t('toasts.profile_success'))
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error(t('toasts.pw_error_match'))
    }
    if (passwordData.newPassword.length < 8) {
      return toast.error(t('toasts.pw_error_length'))
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword })
      if (error) throw error
      toast.success(t('toasts.pw_success'))
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  )

  const tabs = [
    { id: 'profile', label: t('tabs.profile'), icon: User },
    { id: 'security', label: t('tabs.security'), icon: Shield },
    { id: 'plan', label: t('tabs.plan'), icon: CreditCard },
  ]

  return (
    <StaggerContainer className="max-w-5xl mx-auto space-y-8 pb-12">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            {t('title')} <span className="inline-block animate-bounce-slow">⚙️</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl font-medium">
            {t('sub')}
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="flex p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-3xl w-fit mb-8 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black tracking-wide transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                    <User size={20} />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight">{t('profile.title')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('profile.email')}</label>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-[var(--border-c)] text-white/40 text-sm">
                      <Mail size={16} />
                      {profileData.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('profile.full_name')}</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full p-4 pl-12 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('profile.business_name')}</label>
                    <div className="relative group">
                      <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profileData.business_name}
                        onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                        className="w-full p-4 pl-12 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('profile.phone')}</label>
                    <div className="relative group">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full p-4 pl-12 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/[0.05]">
                  <motion.button 
                    onClick={saveProfile}
                    disabled={saving}
                    className="py-4 px-8 rounded-[20px] bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {saving ? t('profile.saving') : t('profile.btn')}
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                  <AlertTriangle size={20} />
                  <h4 className="text-lg font-black tracking-tight">{t('danger.title')}</h4>
                </div>
                <p className="text-sm text-red-500/60 font-medium mb-6 max-w-xl underline underline-offset-4 decoration-red-500/10">
                  {t('danger.description')}
                </p>
                <button className="py-3 px-6 rounded-2xl bg-red-500/10 text-red-500 text-[13px] font-black hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5">
                  {t('danger.btn')}
                </button>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 text-center bg-gradient-to-br from-primary/10 to-transparent">
                  <div className="w-24 h-24 rounded-[32px] bg-primary/20 border-2 border-primary/20 mx-auto flex items-center justify-center mb-6 overflow-hidden group">
                     {profile?.avatar_url ? (
                       <img src={profile.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <User size={40} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                     )}
                  </div>
                  <button className="text-[13px] font-bold text-primary hover:text-white transition-colors flex items-center gap-2 mx-auto px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                    <Camera size={14} />
                    Update Avatar
                  </button>
               </div>

               <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[32px] p-8 space-y-6">
                  <div className="space-y-1">
                    <title className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t('profile.current_plan')}</title>
                    <p className="text-2xl font-black text-white tracking-tight uppercase">{profile?.subscription_plan || 'Starter'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-500/80 uppercase tracking-widest leading-none">Active Subscription</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">{t('security.title')}</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('security.new')}</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{t('security.confirm')}</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                    />
                  </div>

                  <div className="pt-6">
                    <motion.button 
                      onClick={updatePassword}
                      disabled={saving}
                      className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-black text-sm shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
                      whileHover={{ scale: 1.01 }}
                    >
                      {saving ? <Loader2 size={20} className="animate-spin" /> : t('security.btn')}
                    </motion.button>
                  </div>
                </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'plan' && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
             <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[40px] p-10 shadow-2xl relative overflow-hidden group border-primary/20">
                <div className="absolute top-10 right-10">
                  <div className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    Current Plan
                  </div>
                </div>
                <h3 className="text-[13px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Starter</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-white">4,900</span>
                  <span className="text-lg font-bold text-white/40 tracking-tight">دج/month</span>
                </div>
                
                <div className="space-y-4 mb-10">
                  {['AI Sales Bot', 'Social Inventory Sync', 'CRM Foundation', 'Analytics Dashboard'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm font-bold text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[40px] p-10 shadow-2xl bg-gradient-to-br from-primary/10 to-transparent flex flex-col justify-between">
                <div>
                   <h3 className="text-[13px] font-black text-primary uppercase tracking-[0.2em] mb-4">Master Sync</h3>
                   <div className="flex items-baseline gap-2 mb-8">
                     <span className="text-5xl font-black text-white">12,000</span>
                     <span className="text-lg font-bold text-white/40 tracking-tight">دج/month</span>
                   </div>
                   <p className="text-sm text-white/60 font-medium leading-relaxed mb-8">
                      For serious scaling business looking to automate everything.
                   </p>
                </div>
                <button className="w-full py-5 rounded-3xl bg-white text-black font-black text-sm hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-[0.98] uppercase tracking-widest">
                  {t('plan.upgrade')}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StaggerContainer>
  )
}

function CheckCircle2({ size = 16 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
    </svg>
  )
}
