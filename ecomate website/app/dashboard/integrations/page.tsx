'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Share2, MessageSquare, Zap, Shield, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer } from '@/components/ui/animations'

export default function IntegrationsPage() {
  const t = useTranslations('Integrations')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    meta_business_id: '',
    instagram_page_id: '',
    telegram_bot_token: ''
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setFormData({
            meta_business_id: data.meta_business_id || '',
            instagram_page_id: data.instagram_page_id || '',
            telegram_bot_token: data.telegram_bot_token || ''
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('profiles').update({
        ...formData,
        onboarding_status: 'integrating'
      }).eq('id', user?.id)

      if (error) {
        toast.error(t('toasts.error'))
      } else {
        toast.success(t('toasts.success'))
        setProfile({ ...profile, ...formData, onboarding_status: 'integrating' })
      }
    } catch (err) {
      toast.error(t('toasts.error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <StaggerContainer className="max-w-5xl mx-auto space-y-8 pb-12">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            {t('title')} <span className="inline-block animate-pulse">🔌</span>
          </h1>
          <p className="text-sm text-white/40 max-w-2xl font-medium">
            {t('sub')}
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <FadeIn>
            <motion.form 
              onSubmit={handleSave} 
              className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
              whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none" />

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Shield size={20} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{t('form.title')}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-extrabold text-white/30 uppercase tracking-widest mb-2.5 ml-1">
                    {t('form.meta')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.meta_business_id}
                    onChange={(e) => setFormData({ ...formData, meta_business_id: e.target.value })}
                    placeholder="e.g. 1029384756..."
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-white/10" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-white/30 uppercase tracking-widest mb-2.5 ml-1">
                    {t('form.instagram')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.instagram_page_id}
                    onChange={(e) => setFormData({ ...formData, instagram_page_id: e.target.value })}
                    placeholder="e.g. yourbrand_official"
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-white/10" 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-white/30 uppercase tracking-widest mb-2.5 ml-1">
                    {t('form.telegram')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.telegram_bot_token}
                    onChange={(e) => setFormData({ ...formData, telegram_bot_token: e.target.value })}
                    placeholder="e.g. 12456:AAFd..."
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-c)] text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-white/10" 
                  />
                </div>

                <div className="pt-4">
                  <motion.button 
                    type="submit" 
                    disabled={saving} 
                    className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale"
                    whileHover={{ scale: 1.01 }}
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('form.saving')}
                      </div>
                    ) : t('form.btn')}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </FadeIn>

          <FadeIn>
            <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-6 relative overflow-hidden group">
               <div className="flex gap-4 relative z-10">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 shrink-0">
                    <AlertCircle size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">{t('why.title')}</h4>
                    <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                      {t('why.description')}
                    </p>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
            </div>
          </FadeIn>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <FadeIn>
            <div className="bg-[var(--bg-card)] border border-[var(--border-c)] rounded-[32px] p-8 text-center space-y-4 shadow-xl">
              <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                {t('status.label')}
              </label>
              
              <div className="inline-flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full border-2 ${
                  profile?.onboarding_status === 'active' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                }`}>
                  {profile?.onboarding_status === 'active' ? <CheckCircle2 size={32} /> : <Zap size={32} />}
                </div>
                
                <span className={`text-sm font-black uppercase tracking-wider ${
                  profile?.onboarding_status === 'active' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {profile?.onboarding_status === 'active' ? t('status.active') : t('status.pending')}
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 space-y-6">
              <h5 className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">{t('steps.title')}</h5>
              <div className="space-y-4">
                {[
                  { text: t('steps.s1'), active: true },
                  { text: t('steps.s2'), active: ['integrating', 'active'].includes(profile?.onboarding_status) },
                  { text: t('steps.s3'), active: profile?.onboarding_status === 'active' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                      step.active 
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-white/5 border-white/10 text-white/20'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-[13px] font-bold transition-all duration-300 ${
                      step.active ? 'text-white' : 'text-white/20'
                    }`}>
                      {step.text.split('. ')[1] || step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </StaggerContainer>
  )
}
