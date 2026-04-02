'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, Eye, EyeOff, CheckCircle2, 
  ArrowLeft, Loader2, Sparkles,
  Zap, ArrowRight
} from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

function LoginContent() {
  const t = useTranslations('Auth.Login')
  const tc = useTranslations('Auth.Common')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))
  const supabase = createClient()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')
  const needsVerify = searchParams.get('verify')
  
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error(t('form.error_fill'))
    setLoading(true)
    
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ 
        email: form.email, 
        password: form.password 
      })
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error(t('form.error_verify'))
        } else {
          toast.error(error.message)
        }
        setLoading(false)
        return
      }

      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'admin') {
          await supabase.auth.signOut()
          toast.error(t('form.error_admin'))
          setLoading(false)
          return
        }
      }

      toast.success(t('form.welcome_back'))
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen grid lg:grid-cols-2 bg-[#050a14] selection:bg-blue-500/30 font-inter ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Panel - Premium Brand Showcase */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-[#07101f]">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -mr-64 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] -ml-32 -mb-32" />
        
        {/* Brand Header */}
        <Link href="/" className="relative z-10 flex items-center gap-3 no-underline group">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight">
            Eco<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Mate</span>
          </span>
        </Link>

        {/* Dynamic Content Section */}
        <StaggerContainer className="relative z-10 max-w-lg">
          <StaggerItem>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              {t('form.store_waiting')}
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
              {t('title')}<br />
              <span className="gradient-text-green">{tc('footerBuilt')}</span>
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="text-white/50 text-xl leading-relaxed mb-12 max-w-md font-medium">
              {t('p')}
            </p>
          </StaggerItem>

          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-white/70 text-lg font-semibold tracking-tight">{t(`perks.${i}`)}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Footer Badge */}
        <div className="relative z-10">
          <div className="glass inline-flex items-center gap-3 px-5 py-3 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-sm font-bold text-white/80 tracking-wide">🇩🇿 {tc('footerBuilt')}</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center px-6 lg:px-24 py-16 relative bg-[#050a14]">
        {/* Navigation Back */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-8 left-8 right-8 flex justify-between items-center"
        >
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors no-underline group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{tc('backToHome')}</span>
          </Link>
          <div className="lg:hidden flex items-center gap-2">
             <Zap className="w-6 h-6 text-blue-500" />
             <span className="text-xl font-black text-white">Eco<span className="text-blue-400">Mate</span></span>
          </div>
        </motion.div>

        <div className="w-full max-w-md">
          <FadeIn direction="up" delay={0.2}>
            <header className="mb-12 text-center lg:text-left">
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight">{t('form.title')}</h1>
              <p className="text-white/40 text-lg font-medium">{t('form.sub')}</p>
            </header>
          </FadeIn>

          <AnimatePresence mode="wait">
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-red-400 text-sm font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="scale-125">⚠️</span>
                </div>
                {decodeURIComponent(authError)}
              </motion.div>
            )}

            {needsVerify && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <Mail className="w-5 h-5" />
                  <span className="font-black uppercase tracking-widest text-xs">{t('form.verify_title')}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{t('form.verify_p')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <FadeIn direction="up" delay={0.3}>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{tc('email')}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email" required
                    placeholder="youssef@business.dz"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{tc('password')}</label>
                  <Link href="/auth/forgot-password" title={t('form.forgot')} className="text-xs font-bold text-white/20 hover:text-blue-400 no-underline transition-colors">
                    {t('form.forgot')}
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPw ? 'text' : 'password'} required
                    placeholder="••••••••"
                    value={form.password} onChange={e => set('password', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.5}>
              <button
                type="submit" disabled={loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 py-4.5 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <span>{t('form.btn_login')}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </FadeIn>
          </form>

          <FadeIn direction="up" delay={0.6}>
            <footer className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="mt-8 text-center text-white/30 text-sm font-medium">
                {t('signUp_prompt')}{' '}
                <Link href="/auth/register" className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-bold">
                  {t('signUp_link')}
                </Link>
              </p>
            </footer>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050a14] flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
