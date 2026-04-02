'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Store, Phone, Lock, Eye, EyeOff, 
  ChevronLeft, CheckCircle2, ShieldCheck,
  Zap, ArrowLeft, Loader2, Sparkles,
  ArrowRight
} from 'lucide-react'
import { triggerWelcomeEmail } from './actions'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

export default function RegisterPage() {
  const t = useTranslations('Auth.Register')
  const tc = useTranslations('Auth.Common')
  const locale = useLocale()
  const router = useRouter()
  const isRTL = locale === 'ar'
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', businessName: '',
    email: '', phone: '', password: '', confirm: '', terms: false,
  })

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))

  function pwStrength(pw: string) {
    if (!pw) return { score: 0, label: '—', color: 'rgba(255,255,255,.1)' }
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 12) s++
    return s === 1 ? { score: 1, label: t('form.strength_weak'), color: '#ef4444' }
         : s === 2 ? { score: 2, label: t('form.strength_good'), color: '#f59e0b' }
         : s === 3 ? { score: 3, label: t('form.strength_strong'), color: '#10b981' }
         : { score: 0, label: '—', color: 'rgba(255,255,255,.1)' }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 3) { setStep(s => s + 1); return }
    if (form.password !== form.confirm) return toast.error(t('form.error_match'))
    if (!form.terms) return toast.error(t('form.error_terms'))
    if (form.password.length < 8) return toast.error(t('form.error_length'))

    setLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: `${form.firstName} ${form.lastName}`,
            business_name: form.businessName,
            phone: form.phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      await triggerWelcomeEmail(form.email, locale)
      toast.success(t('form.success'))
      router.push('/auth/login?verify=true')
    } catch (error) {
      const err = error as { message?: string }
      toast.error(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const str = pwStrength(form.password)
  const steps = [t('steps.s1'), t('steps.s2'), t('steps.s3')]

  const inputStyle = "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
  const labelStyle = "text-[11px] font-black text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block"

  return (
    <div className={`min-h-screen grid lg:grid-cols-2 bg-[#050a14] selection:bg-blue-500/30 font-inter ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Panel - Premium Brand Showcase */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-[#07101f]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -mr-64 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] -ml-32 -mb-32" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3 no-underline group">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="text-3xl font-black text-white tracking-tight">
            Eco<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Mate</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <FadeIn direction="up" delay={0.2}>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              {t('builtFor')}
            </div>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
              {t('perks_h2_1')}<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {t('perks_h2_2')}
              </span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed mb-12 max-w-md font-medium">
              {t('perks_p')}
            </p>

            <StaggerContainer className="space-y-5">
              {[0, 1, 2, 3].map((i) => (
                <StaggerItem key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-white/70 text-lg font-semibold tracking-tight">{t(`perks_items.${i}`)}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        </div>

        <div className="relative z-10">
          <div className="glass inline-flex items-center gap-3 px-5 py-3 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="text-sm font-bold text-white/80 tracking-wide">🇩🇿 {tc('footerBuilt')}</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex flex-col justify-center items-center px-6 lg:px-24 py-16 relative bg-[#050a14]">
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors no-underline group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('back')}</span>
          </Link>
          <div className="lg:hidden flex items-center gap-2">
             <Zap className="w-6 h-6 text-blue-500" />
             <span className="text-xl font-black text-white">Eco<span className="text-blue-400">Mate</span></span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Step {step} of 3</span>
                <h3 className="text-white font-bold text-lg">{steps[step - 1]}</h3>
              </div>
              <ShieldCheck className="w-6 h-6 text-blue-500/50" />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </div>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t('title')}</h1>
            <p className="text-white/40 text-sm font-medium">{t('p')}</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelStyle}>{t('form.firstName')}</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                        <input className={inputStyle} type="text" required placeholder={t('form.firstName_placeholder')} value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelStyle}>{t('form.lastName')}</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                        <input className={inputStyle} type="text" required placeholder={t('form.lastName_placeholder')} value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelStyle}>{t('form.email')}</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input className={inputStyle} type="email" required placeholder={t('form.email_placeholder')} value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className={labelStyle}>{t('form.businessName')}</label>
                    <div className="relative group">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input className={inputStyle} type="text" required placeholder={t('form.businessName_placeholder')} value={form.businessName} onChange={e => set('businessName', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelStyle}>{t('form.phone')}</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input className={inputStyle} type="tel" placeholder={t('form.phone_placeholder')} value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className={labelStyle}>{t('form.password')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input className={`${inputStyle} pr-12`} type={showPw ? 'text' : 'password'} required placeholder={t('form.password_placeholder')} value={form.password} onChange={e => set('password', e.target.value)} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1">
                        {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="mt-3 flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <div className="flex-1 flex gap-1.5">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                              <motion.div 
                                className="h-full"
                                initial={{ width: 0 }}
                                animate={{ width: str.score >= i ? '100%' : '0%', backgroundColor: str.color }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap" style={{ color: str.color }}>{str.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelStyle}>{t('form.confirm')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                      <input className={inputStyle} type="password" required placeholder={t('form.confirm_placeholder')} value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                    </div>
                  </div>
                  
                  <label className="flex items-start gap-4 cursor-pointer group p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                    <div className="relative mt-1">
                      <input 
                        type="checkbox" 
                        required
                        className="peer sr-only"
                        checked={form.terms}
                        onChange={e => set('terms', e.target.checked)}
                      />
                      <div className="w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        <CheckCircle2 className={`w-4 h-4 text-white transition-opacity ${form.terms ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </div>
                    <span className="text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors font-medium">
                      {t('form.terms')}
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 flex gap-4">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 flex items-center justify-center gap-2 py-4.5 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                >
                  <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('form.btn_back')}</span>
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className={`flex-[2] relative group overflow-hidden py-4.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>{step < 3 ? t('form.btn_continue') : t('form.btn_create')}</span>
                      <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-center text-white/30 text-sm font-medium">
              {t('signIn_prompt')}{' '}
              <Link href="/auth/login" className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-bold">
                {t('signIn_link')}
              </Link>
            </p>
            
            <div className="mt-8">
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                &copy; 2026 EcoMate &mdash; {tc('footerBuilt')}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
