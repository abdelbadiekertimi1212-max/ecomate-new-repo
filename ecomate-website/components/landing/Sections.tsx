'use client'

import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Package, CreditCard, Monitor, FileText, 
  Database, Palette, TrendingUp, CheckCircle2, 
  ArrowRight, ShieldCheck, Layers, ChevronDown,
  Globe, Zap, MessageSquare, Truck, BarChart3,
  Search, Bell, Settings, Plus, Star, ZapOff,
  LayoutDashboard
} from 'lucide-react'

// --- Helpers ---

const SectionHeader = ({ badge, title1, title2, sub, align = 'start' }: any) => (
  <div style={{ textAlign: align as any, marginBottom: 60 }}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ 
        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, 
        fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', 
        color: '#2563eb', marginBottom: 20 
      }}
    >
      <span style={{ width: 18, height: 1.5, background: '#2563eb' }} />
      {badge}
      <span style={{ width: 18, height: 1.5, background: '#2563eb' }} />
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      style={{ 
        fontFamily: 'var(--font-poppins), var(--font-cairo)', 
        fontSize: 'clamp(32px, 4.2vw, 56px)', fontWeight: 900, 
        letterSpacing: '-.03em', color: 'var(--text-main)', 
        marginBottom: 20, lineHeight: 1.05 
      }}
    >
      <span style={{ background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title1}</span>
      {title2 && <><br /><span style={{ background: 'linear-gradient(135deg,#10B981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title2}</span></>}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      style={{ 
        fontSize: 17, color: 'var(--text-sub)', lineHeight: 1.7, 
        maxWidth: align === 'center' ? 580 : 500, 
        margin: align === 'center' ? '0 auto' : '0' 
      }}
    >
      {sub}
    </motion.p>
  </div>
)

// --- Sections ---

export function Integrations() {
  const t = useTranslations('Sections.Integrations')
  const cols = [
    { badge: t('social'), title: t('social'), icon: <MessageSquare size={20} />, pills: [['blue','Facebook'],['pink','Instagram'],['green','WhatsApp'],['tg','Telegram'],['tiktok','TikTok DM'],['sms','SMS'],['email','Email']] },
    { badge: t('delivery'), title: t('delivery'), icon: <Truck size={20} />, pills: [['dz','Yalidine Express'],['dz','Zimex'],['dz','Ecom Delivery'],['dz','Maystro'],['dz','58 Wilayas']] },
    { badge: t('tools'), title: t('tools'), icon: <Layers size={20} />, pills: [['sheets','Google Sheets'],['sheets','Google Drive'],['gray','Excel Export'],['gray','PDF Reports']] },
  ]
  const dotColors: Record<string,string> = { blue:'#1877f2', pink:'#e1306c', green:'#25d366', tg:'#229ED9', tiktok:'#00f2fe', sms:'#f59e0b', email:'#ef4444', dz:'#006233', sheets:'#34a853', gray:'#94a3b8' }

  return (
    <section id="integrations" style={{ padding: '100px 5%', background: 'var(--bg-section)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader 
          badge={t('badge')}
          title1={t('social')}
          title2={`& ${t('delivery')}`}
          sub={t('social') + " — " + t('delivery')}
          align="start"
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {cols.map((col, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-c)', 
                borderRadius: 24, padding: 32,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ borderColor: 'rgba(37,99,235,0.3)', transform: 'translateY(-5px)' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#2563eb', marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {col.icon}
                </div>
                <span style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em' }}>{col.title}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {col.pills.map(([color, label]) => (
                  <span 
                    key={label}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 8, 
                      background: 'var(--bg-card)', border: '1px solid var(--border-c)', 
                      borderRadius: 100, padding: '8px 16px', fontSize: 12.5, 
                      fontWeight: 600, color: 'var(--text-main)', 
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColors[color] }} />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Features() {
  const t = useTranslations('Sections.Features')
  
  const items = [
    { id: 's1', icon: <Bot size={28} />, color: '#2563eb', bg: 'rgba(37,99,235,.08)' },
    { id: 's2', icon: <Package size={28} />, color: '#10b981', bg: 'rgba(16,185,129,.08)' },
    { id: 's3', icon: <CreditCard size={28} />, color: '#6366f1', bg: 'rgba(99,102,241,.08)' },
    { id: 's4', icon: <Monitor size={28} />, color: '#f59e0b', bg: 'rgba(245,158,11,.08)' },
    { id: 's5', icon: <FileText size={28} />, color: '#ec4899', bg: 'rgba(236,72,153,.08)' },
    { id: 's6', icon: <Database size={28} />, color: '#8b5cf6', bg: 'rgba(139,92,246,.08)' },
    { id: 's7', icon: <Palette size={28} />, color: '#06b6d4', bg: 'rgba(6,182,212,.08)' },
    { id: 's8', icon: <TrendingUp size={28} />, color: '#64748b', bg: 'rgba(100,116,139,.08)' },
  ]

  return (
    <section id="features" style={{ padding: '120px 5%', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader 
          badge={t('badge')}
          title1={t('title1')}
          title2={t('title2')}
          sub={t('sub')}
        />

        <div className="services-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: 24 
        }}>
          {items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="service-card" 
              style={{
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-c)',
                borderRadius: 28, 
                padding: '36px 28px', 
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                cursor: 'default'
              }}
            >
              <div style={{ 
                width: 64, height: 64, borderRadius: 18, 
                background: item.bg, border: `1.5px solid ${item.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: 24, color: item.color,
                boxShadow: `0 8px 30px ${item.color}15`
              }}>
                {item.icon}
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-poppins), var(--font-cairo)', 
                fontSize: 18.5, fontWeight: 800, color: 'var(--text-main)', 
                marginBottom: 12, letterSpacing: '-.02em', lineHeight: 1.2
              }}>
                {t(`items.${item.id}.title`)}
              </h3>
              <p style={{ 
                fontSize: 14.5, color: 'var(--text-sub)', lineHeight: 1.6, fontWeight: 400
              }}>
                {t(`items.${item.id}.desc`)}
              </p>
              
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 100, height: 100, background: `radial-gradient(circle, ${item.color}05 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .service-card { padding: 24px 16px !important; border-radius: 20px !important; }
          .service-card h3 { font-size: 14.5px !important; margin-bottom: 8px !important; }
          .service-card p { font-size: 12px !important; line-height: 1.45 !important; }
          .service-card div:first-child { width: 44px !important; height: 44px !important; border-radius: 12px !important; margin-bottom: 16px !important; }
          .service-card svg { width: 20px !important; height: 20px !important; }
        }
      `}</style>
    </section>
  )
}

export function HowItWorks() {
  const t = useTranslations('Sections.How')
  const steps = [
    { n:1, icon: <LayoutDashboard size={32} />, title: t('steps.s1.title'), desc: t('steps.s1.desc') },
    { n:2, icon: <Bot size={32} />, title: t('steps.s2.title'), desc: t('steps.s2.desc') },
    { n:3, icon: <Truck size={32} />, title: t('steps.s3.title'), desc: t('steps.s3.desc') },
    { n:4, icon: <CheckCircle2 size={32} />, title: t('steps.s4.title'), desc: t('steps.s4.desc') },
  ]

  return (
    <section id="how" style={{ padding: '120px 5%', background: 'var(--bg-section)' }}>
      <SectionHeader 
        badge={t('badge')}
        title1={t('title1')}
        title2={t('title2')}
        sub={t('sub')}
        align="center"
      />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 52, left: '10%', right: '10%', height: 2, background: 'linear-gradient(90deg,transparent,rgba(37,99,235,0.2),rgba(16,185,129,0.2),transparent)', zIndex: 0 }} className="hide-mobile" />
        
        {steps.map((s, index) => (
          <motion.div 
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            style={{ padding: '0 10px', textAlign: 'center', position: 'relative', zIndex: 1 }}
          >
            <div style={{ 
              width: 110, height: 110, borderRadius: '50%', margin: '0 auto 28px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              position: 'relative', background: 'var(--bg-card)', 
              border: '2px solid var(--border-c)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              color: index % 2 === 0 ? '#2563eb' : '#10B981'
            }}>
              <div style={{ 
                position: 'absolute', top: -5, right: -5, width: 30, height: 30, 
                borderRadius: '50%', background: index % 2 === 0 ? '#2563eb' : '#10B981', 
                fontFamily: 'var(--font-poppins)', fontSize: 13, fontWeight: 900, 
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                border: '3px solid var(--bg-section)', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
              }}>{s.n}</div>
              {s.icon}
            </div>
            <h3 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, letterSpacing: '-.01em' }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  )
}

export function DashboardPreview() {
  const t = useTranslations('Sections.Dashboard')
  const stats = [
    { label: 'Revenue Today', value: '127,400 DA', color: '#10B981', change: '↑ 23.4%' },
    { label: 'Orders Today', value: '84', color: '#2563eb', change: '↑ 12' },
    { label: 'AI Resolution', value: '98.2%', color: 'var(--text-main)', change: '↑ 2.1%' },
    { label: 'Pending COD', value: '32', color: '#f59e0b', change: '→' },
  ]
  const bars = [42, 65, 50, 75, 88, 62, 95]

  return (
    <section id="dashboard" style={{ padding: '120px 5%', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader 
          badge={t('badge')}
          title1={t('title1')}
          title2={t('title2')}
          sub={t('sub')}
        />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="dashboard-mockup" 
          style={{ 
            background: 'rgba(7,10,18,0.85)', 
            border: '1px solid var(--border-c)', 
            borderRadius: 32, overflow: 'hidden', 
            boxShadow: '0 60px 150px rgba(0,0,0,.4)',
            position: 'relative',
            backdropFilter: 'blur(30px)'
          }}
        >
          {/* Header/Browser bar */}
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: 7 }}>
              {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ marginLeft: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '5px 16px', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={12} /> app.ecomate.dz/dashboard
            </div>
          </div>

          <div className="dash-content" style={{ display: 'flex', minHeight: 480 }}>
            {/* Sidebar */}
            <div style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 0' }} className="hide-mobile">
              {[
                { icon: <BarChart3 size={18} />, label: 'Overview', active: true },
                { icon: <Package size={18} />, label: 'Orders', active: false },
                { icon: <Bot size={18} />, label: 'AI Agent', active: false },
                { icon: <Truck size={18} />, label: 'Logistic', active: false },
                { icon: <TrendingUp size={18} />, label: 'Analytics', active: false },
                { icon: <Settings size={18} />, label: 'Settings', active: false },
              ].map((item, i) => (
                <div key={i} style={{ 
                  margin: '0 12px 4px', padding: '12px 18px', 
                  display: 'flex', alignItems: 'center', gap: 12, 
                  fontSize: 14, fontWeight: item.active ? 700 : 500, 
                  color: item.active ? '#fff' : 'rgba(255,255,255,0.4)', 
                  background: item.active ? 'rgba(37,99,235,0.15)' : 'transparent', 
                  borderRadius: 12,
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>Dashboard Summary</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Search size={18} /></div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Plus size={18} /></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
                {stats.map((s, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: 20, padding: 22 
                    }}
                  >
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>{s.change}</div>
                  </motion.div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Revenue Potential</h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Real-time sync with 58 Wilayas</p>
                  </div>
                  <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Live View</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
                  {bars.map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      style={{ 
                        flex: 1, borderRadius: '8px 8px 3px 3px', 
                        background: i === 6 ? 'linear-gradient(180deg, #2563eb, #1e40af)' : 'rgba(255,255,255,0.05)',
                        position: 'relative'
                      }} 
                    >
                      {i === 6 && <div style={{ position: 'absolute', top: -35, left: '50%', transform: 'translateX(-50%)', padding: '4px 8px', background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 4, whiteSpace: 'nowrap' }}>95% Target</div>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  )
}

export function AISection() {
  const t = useTranslations('Sections.AI')
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % 4)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const chatSteps = [
    { type: 'user', text: 'أريد طلب فستان صيفي قياس M 👗', delay: 0 },
    { type: 'ai', text: 'أهلاً بك! يتوفر الفستان بـ 3 ألوان. أي لون تفضلين؟ ✨', delay: 1 },
    { type: 'user', text: 'اللون الأزرق، التوصيل لوهران 🚚', delay: 2 },
    { type: 'ai', text: 'تم تسجيل طلبك بنجاح! رقم التوصيل: EC-4829. التوصيل سيتم عبر ياليدين خلال 48 ساعة ✅', delay: 3 },
  ]

  return (
    <section id="ai-section" style={{ padding: '120px 5%', background: 'var(--bg-section)', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
        
        {/* Deep AI Chat Mockup */}
        <motion.div 
          initial={{ opacity: 0, rotateY: -15 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          viewport={{ once: true }}
          style={{ position: 'relative', perspective: '1200px' }}
        >
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '2px solid var(--border-c)', 
            borderRadius: 36, overflow: 'hidden', 
            boxShadow: '0 40px 120px rgba(37,99,235,0.12)',
            maxWidth: 420, margin: '0 auto'
          }}>
            {/* Chat UI Header */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-c)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}>
                <Bot size={22} color="#fff" />
              </div>
              <div style={{ textAlign: 'start' }}>
                <h4 style={{ fontFamily: 'var(--font-cairo)', fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>EcoMate AI Agent</h4>
                <div style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                  متصل الآن · يرد فورا
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{ padding: 24, height: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(10,20,38,0.2)' }}>
              <AnimatePresence mode="popLayout">
                {chatSteps.slice(0, activeStep + 1).map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{ 
                      alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '14px 18px',
                      borderRadius: msg.type === 'user' ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                      background: msg.type === 'user' ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'rgba(255,255,255,0.06)',
                      boxShadow: msg.type === 'user' ? '0 10px 25px rgba(37,99,235,0.2)' : 'none',
                      border: msg.type === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      color: msg.type === 'user' ? '#fff' : 'var(--text-main)',
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontFamily: 'var(--font-cairo)',
                      textAlign: msg.type === 'user' ? 'right' : 'left'
                    }}
                    dir="rtl"
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-c)', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-c)', borderRadius: 14, padding: '12px 18px', fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'right', fontFamily: 'var(--font-cairo)' }}>اكتب طلبك هنا...</div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>
                <ArrowRight size={20} color="#fff" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Side */}
        <div>
          <SectionHeader 
            badge={t('badge')}
            title1={t('title1')}
            title2={t('title2')}
            sub={t('sub')}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 44 }}>
            {[
              { icon: <MessageSquare size={20} />, title: t('features.0.title'), desc: t('features.0.desc'), color: '#2563eb' },
              { icon: <Plus size={20} />, title: t('features.1.title'), desc: t('features.1.desc'), color: '#2563eb' },
              { icon: <Truck size={20} />, title: t('features.2.title'), desc: t('features.2.desc'), color: '#10B981' },
              { icon: <CheckCircle2 size={20} />, title: t('features.3.title'), desc: t('features.3.desc'), color: '#10B981' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: 18, padding: '20px 24px', 
                  background: 'var(--bg-card)', border: '1px solid var(--border-c)', 
                  borderRadius: 22, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
                whileHover={{ scale: 1.02, borderColor: f.color }}
              >
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: f.color, flexShrink: 0 
                }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 5 }}>{f.title}</h4>
                  <p style={{ fontSize: 13.5, color: 'var(--text-sub)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a 
            href="#" 
            className="btn-primary" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              fontSize: 16, padding: '18px 42px', textDecoration: 'none', 
              display: 'inline-flex', alignItems: 'center', gap: 12, borderRadius: 16 
            }}
          >
            {t('cta')} <ArrowRight size={20} />
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export function Pricing({ plans: _plans = [] }: { plans?: unknown[] }) {
  const t = useTranslations('Sections.Pricing')
  const servicesRaw = t.raw('services')
  const services = Object.keys(servicesRaw || {}).map(slug => ({
    slug,
    ...servicesRaw[slug]
  }))

  const [activeService, setActiveService] = useState(services[0]?.slug || 'ai-sales')

  const currentService = services.find(s => s.slug === activeService)
  const packs = currentService ? Object.keys(currentService.packs || {}).map(k => currentService.packs[k]) : []

  return (
    <section id="pricing" style={{ padding: '120px 5%', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader 
          badge={t('badge')}
          title1={t('title1')}
          title2={t('title2')}
          sub={t('sub')}
          align="center"
        />

        {/* Pricing Explorer Tabs */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: 8, 
          flexWrap: 'wrap', marginBottom: 56, 
          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-c)', 
          borderRadius: 24, padding: 8, maxWidth: 900, margin: '0 auto 56px' 
        }}>
          {services.map((s) => (
            <button
              key={s.slug}
              onClick={() => setActiveService(s.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px', borderRadius: 16,
                border: 'none', cursor: 'pointer',
                background: activeService === s.slug ? 'rgba(37,99,235,0.1)' : 'transparent',
                color: activeService === s.slug ? '#2563eb' : 'var(--text-sub)',
                fontFamily: 'var(--font-poppins), var(--font-cairo)',
                fontSize: 14, fontWeight: activeService === s.slug ? 800 : 500,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
            >
              {activeService === s.slug && (
                <motion.div 
                  layoutId="activeTab" 
                  style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1.5px solid rgba(37,99,235,0.4)', zIndex: 0 }} 
                />
              )}
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ position: 'relative', zIndex: 1 }}>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Packs Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeService}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 24,
              maxWidth: 1000,
              margin: '0 auto' 
            }}
          >
            {packs.map((pack: any, i: number) => {
              const isPopular = i === 1 // Modern convention: second pack is popular
              return (
                <div key={i} style={{
                  background: isPopular ? 'rgba(37,99,235,0.04)' : 'var(--bg-card)', 
                  border: isPopular ? '2px solid #2563eb' : '1px solid var(--border-c)', 
                  borderRadius: 32, padding: 40, position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  boxShadow: isPopular ? '0 30px 80px rgba(37,99,235,0.15)' : 'none'
                }}>
                  {isPopular && (
                    <div style={{ position: 'absolute', top: 18, right: 18, background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 100, letterSpacing: '.1em' }}>Recommended</div>
                  )}
                  
                  <div style={{ marginBottom: 30 }}>
                    <h4 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 20, fontWeight: 900, color: 'var(--text-main)', marginBottom: 12 }}>{pack.name}</h4>
                    <p style={{ fontSize: 13.5, color: 'var(--text-sub)', lineHeight: 1.5, minHeight: 40 }}>{pack.desc}</p>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 36, fontWeight: 900, color: 'var(--text-main)' }}>{pack.price.replace(' DZD', '')}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-sub)' }}>DZD{pack.price.includes('/') ? pack.price.split('/')[1] || '' : ''}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>What&apos;s Included</div>
                    {/* Dynamic feature mockup based on packs */}
                    {[1, 2, 3, 4].map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-main)', fontWeight: 500 }}>
                        <CheckCircle2 size={18} color={isPopular ? '#2563eb' : '#10B981'} style={{ flexShrink: 0 }} />
                        <span>Core {currentService?.title} Feature {f}</span>
                      </div>
                    ))}
                  </div>

                  <motion.a 
                    href="/contact" 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
                      width: '100%', padding: '18px', borderRadius: 18,
                      fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 15, fontWeight: 800,
                      background: isPopular ? '#2563eb' : 'rgba(255,255,255,0.05)', 
                      color: isPopular ? '#fff' : 'var(--text-main)', 
                      border: isPopular ? 'none' : '1px solid var(--border-c)',
                      textDecoration: 'none', transition: 'all 0.2s'
                    }}
                  >
                    {pack.cta || 'Get Started'} <ArrowRight size={18} />
                  </motion.a>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>
            Looking for a custom enterprise solution? <Link href="/contact" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid rgba(37,99,235,0.2)' }}>Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export function CTA() {
  const t = useTranslations('Sections.CTA')
  return (
    <section id="cta" style={{ background: 'linear-gradient(135deg,#070b13 0%,#0a1628 50%,#070b13 100%)', padding: '140px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border-c)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '8px 20px', fontSize: 12, fontWeight: 800, color: '#4488ff', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 32 }}>
            <Zap size={14} fill="#4488ff" /> 2026 Ready Platform
          </div>
          <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(38px, 6vw, 76px)', fontWeight: 950, letterSpacing: '-.04em', color: '#fff', lineHeight: 0.95, marginBottom: 32 }}>
            {t('title1')}<br />
            <span style={{ background: 'linear-gradient(135deg,#10B981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
          </h2>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto 56px', lineHeight: 1.6, fontWeight: 500 }}>
            {t('sub')}
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 16, fontWeight: 800, color: '#07101f', background: '#fff', borderRadius: 18, padding: '20px 48px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', textDecoration: 'none' }}>
                {t('btn1')} <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 16, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '20px 40px', textDecoration: 'none', transition: 'all 0.2s' }}>
                 <Star size={18} /> {t('btn2')}
              </a>
            </motion.div>
          </div>
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
             {['No Credit Card Required', 'Free 7-Day Trial', 'Algerian Support'].map(f => (
               <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                 <CheckCircle2 size={12} color="#10B981" /> {f}
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  const t = useTranslations('Sections.Footer')
  return (
    <footer style={{ background: '#050a14', padding: '100px 5% 50px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 60, marginBottom: 80 }}>
          <div style={{ textAlign: 'start' }}>
            <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontWeight: 900, fontSize: 28, marginBottom: 24, letterSpacing: '-.03em' }}>
              <span style={{ color: '#2563eb' }}>Eco</span>
              <span style={{ color: '#10B981' }}>Mate</span>
            </div>
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 32, maxWidth: 320 }}>{t('desc')}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['📘', '📸', '💬', '💼'].map((s, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -5, background: 'rgba(37,99,235,0.1)', borderColor: '#2563eb' }}
                  style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.2s' }}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {['Platform', 'Support', 'Company'].map(title => (
            <div key={title} className="hide-mobile">
              <h5 style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '.1em' }}>{title}</h5>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[1,2,3,4].map(l => (
                  <li key={l}><Link href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}>{title} Link {l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>© {new Date().getFullYear()} <span style={{ color: '#fff', fontWeight: 700 }}>EcoMate Platform</span>. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Terms of Service</Link>
            <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#10B981', fontWeight: 800, fontFamily: 'var(--font-cairo)' }}>
              صُنع بكل حُب في الجزائر 🇩🇿
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          footer { padding: 60px 5% 40px !important; }
          .hide-mobile { display: none !important; }
          footer > div > div:first-child { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
          footer > div > div:first-child > div:first-child { align-items: center !important; display: flex; flex-direction: column; }
          footer > div > div:first-child p { max-width: 100% !important; }
          footer > div > div:last-child { justify-content: center !important; flex-direction: column !important; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
