'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Star, Quote, Plus, X, CheckCircle2 } from 'lucide-react'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ 
            background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 0, 
            color: (hover || value) >= s ? '#F59E0B' : 'rgba(255,255,255,0.1)', 
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: (hover || value) >= s ? 'scale(1.1)' : 'scale(1)'
          }}>
          <Star size={onChange ? 26 : 18} fill={(hover || value) >= s ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}

export default function Reviews({ reviews: initialReviews }: { reviews: any[] }) {
  const t = useTranslations('Sections.reviews')
  const [reviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ rating: 5, content: '', plan_used: '' })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) return
      setUser(authData.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()
      if (p) {
        setProfile(p)
        setForm(f => ({ ...f, plan_used: p.plan || '' }))
      }
    })
  }, [])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { toast.error('Please sign in to leave a review'); return }
    if (form.content.length < 20) { toast.error('Review must be at least 20 characters'); return }
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      reviewer_name: profile?.full_name || 'Anonymous',
      author_name: profile?.full_name || 'Anonymous',
      business_name: profile?.business_name || '',
      rating: form.rating,
      content: form.content,
      plan_slug: form.plan_used || 'trial',
      is_approved: false,
    })
    if (error) { 
      toast.error('Submission failed')
      setSubmitting(false) 
      return 
    }
    setSubmitted(true)
    setShowForm(false)
    setSubmitting(false)
    toast.success(t('pending'))
  }

  return (
    <section id="reviews" style={{ padding: '120px 5%', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: 'var(--p)', marginBottom: 24, letterSpacing: '.05em' }}
          >
            {t('tag')}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 900, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.1 }}
          >
            {t('title')} <span style={{ background: 'linear-gradient(135deg, #2563EB, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('highlight')}</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: 'var(--text-sub)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' }}
          >
            {t('subtitle')}
          </motion.p>

          {!submitted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => user ? setShowForm(true) : toast.error('Sign in first to leave a review')}
              className="btn-primary"
              style={{ padding: '14px 32px', borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <Plus size={18} /> {t('leaveReview')}
            </motion.button>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '10px 24px', fontSize: 14, color: '#10B981', fontWeight: 600 }}>
              <CheckCircle2 size={18} /> {t('pending')}
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {reviews.length > 0 ? reviews.map((r: any, i: number) => (
            <motion.div 
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 24,
                padding: 32,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Quote size={40} style={{ position: 'absolute', top: 24, right: 32, opacity: 0.05, color: '#2563EB' }} />
              
              <div style={{ marginBottom: 20 }}>
                <StarRating value={r.rating} />
              </div>

              <p style={{ fontSize: 15.5, color: 'var(--text-main)', lineHeight: 1.7, marginBottom: 28, flex: 1, fontWeight: 500, fontStyle: 'italic' }}>
                &ldquo;{r.content}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #2563EB, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}>
                  {r.reviewer_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 14.5, fontWeight: 800, color: '#fff', letterSpacing: '-.01em' }}>{r.reviewer_name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.business_name || 'Business Partner'}
                    {r.is_approved && <CheckCircle2 size={12} color="#10B981" />}
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 24, color: 'var(--text-sub)' }}>
              <Star size={48} style={{ opacity: 0.1, marginBottom: 16, margin: '0 auto' }} />
              <p>{t('empty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: 40, width: '100%', maxWidth: 520, position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
            >
              <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.05)', border: 'none', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h3 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{t('form.title')}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-sub)', marginBottom: 32 }}>{t('form.description')}</p>

              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 12 }}>{t('form.rating')}</label>
                  <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 10 }}>{t('form.content')}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t('form.placeholder')}
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 16, fontSize: 15, color: '#fff', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', resize: 'none' }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'right' }}>
                    {form.content.length}/500
                  </div>
                </div>

                <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 20, padding: '20px', fontSize: 13.5, color: 'var(--text-sub)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>{t('form.submittingAs')}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {profile?.full_name || 'User'} · {profile?.business_name || 'Business'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1, padding: '16px' }}>{t('form.cancel')}</button>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1.5, padding: '16px', justifyContent: 'center' }}>
                    {submitting ? t('form.loading') : t('form.submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 640px) {
          #reviews { padding: 80px 20px !important; }
        }
      `}</style>
    </section>
  )
}
