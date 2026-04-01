import { Fragment } from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function Integrations() {
  const t = await getTranslations('Sections.Integrations')
  const cols = [
    { badge: t('social'), title: t('social'), pills: [['blue','Facebook'],['pink','Instagram'],['green','WhatsApp'],['tg','Telegram'],['tiktok','TikTok DM'],['sms','SMS'],['email','Email']] },
    { badge: t('delivery'), title: t('delivery'), pills: [['dz','Yalidine Express'],['dz','Zimex'],['dz','Ecom Delivery'],['dz','Maystro'],['dz','58 Wilayas']] },
    { badge: t('tools'), title: t('tools'), pills: [['sheets','Google Sheets'],['sheets','Google Drive'],['gray','Excel Export'],['gray','PDF Reports']] },
  ]
  const dotColors: Record<string,string> = { blue:'#1877f2', pink:'#e1306c', green:'#25d366', tg:'#229ED9', tiktok:'#00f2fe', sms:'#f59e0b', email:'#ef4444', dz:'#006233', sheets:'#34a853', gray:'#94a3b8' }

  return (
    <div style={{ padding: '64px 5%', background: 'var(--bg-section)', transition: 'var(--theme-transition)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', marginBottom: 32, display: 'block' }}>
          {t('badge')}
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, alignItems: 'start' }}>
          {cols.map((col, i) => (
            <div key={i} style={{ padding: '0 20px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#10B981', marginBottom: 16 }}>✓ {col.badge}</div>
              <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>{col.title}</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {col.pills.map(([color, label]) => (
                  <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColors[color], flexShrink: 0 }} />{label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function Features() {
  const t = await getTranslations('Sections.Features')
  
  const items = [
    { id: 's1', icon: '🤖', color: '#2563eb', bg: 'rgba(37,99,235,.08)' },
    { id: 's2', icon: '📦', color: '#10b981', bg: 'rgba(16,185,129,.08)' },
    { id: 's3', icon: '💳', color: '#6366f1', bg: 'rgba(99,102,241,.08)' },
    { id: 's4', icon: '💻', color: '#f59e0b', bg: 'rgba(245,158,11,.08)' },
    { id: 's5', icon: '📑', color: '#ec4899', bg: 'rgba(236,72,153,.08)' },
    { id: 's6', icon: '🗄️', color: '#8b5cf6', bg: 'rgba(139,92,246,.08)' },
    { id: 's7', icon: '🎨', color: '#06b6d4', bg: 'rgba(6,182,212,.08)' },
    { id: 's8', icon: '📈', color: '#64748b', bg: 'rgba(100,116,139,.08)' },
  ]

  return (
    <section id="features" style={{ padding: '100px 5%', background: 'var(--bg-section)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 18 }}>
          <span style={{ width: 16, height: 1.5, background: '#2563eb' }} />{t('badge')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1 }}>
          <span style={{ background: 'linear-gradient(135deg,#2563eb,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title1')}</span><br />
          <span style={{ background: 'linear-gradient(135deg,#10B981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.75, maxWidth: 540, marginBottom: 60 }}>
          {t('sub')}
        </p>

        <div className="services-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: 20 
        }}>
          {items.map((item) => (
            <div key={item.id} className="service-card" style={{
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-c)',
              borderRadius: 22, 
              padding: '32px 24px', 
              transition: 'all .3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: 54, height: 54, borderRadius: 14, 
                background: item.bg, border: `1px solid ${item.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 24, marginBottom: 20, color: item.color,
                boxShadow: `0 8px 20px ${item.color}10`
              }}>
                {item.icon}
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-poppins), var(--font-cairo)', 
                fontSize: 17, fontWeight: 700, color: 'var(--text-main)', 
                marginBottom: 10, letterSpacing: '-.01em'
              }}>
                {t(`items.${item.id}.title`)}
              </h3>
              <p style={{ 
                fontSize: 13.5, color: 'var(--text-sub)', lineHeight: 1.6 
              }}>
                {t(`items.${item.id}.desc`)}
              </p>
              <div style={{
                position: 'absolute', bottom: -20, insetInlineEnd: -20,
                width: 80, height: 80, background: `radial-gradient(circle, ${item.color}08 0%, transparent 70%)`,
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .service-card {
            padding: 24px 16px !important;
          }
          .service-card h3 {
            font-size: 14px !important;
          }
          .service-card p {
            font-size: 12px !important;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </section>
  )
}

export async function HowItWorks() {
  const t = await getTranslations('Sections.How')
  const steps = [
    { n:1, icon:'📋', title: t('steps.s1.title'), desc: t('steps.s1.desc') },
    { n:2, icon:'⚙️', title: t('steps.s2.title'), desc: t('steps.s2.desc') },
    { n:3, icon:'🔗', title: t('steps.s3.title'), desc: t('steps.s3.desc') },
    { n:4, icon:'🚀', title: t('steps.s4.title'), desc: t('steps.s4.desc') },
  ]

  return (
    <section id="how" style={{ padding: '100px 5%' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 18 }}>
          <span style={{ width: 16, height: 1.5, background: '#2563eb' }} />{t('badge')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1 }}>
          {t('title1')} <span style={{ background: 'linear-gradient(135deg,#2563eb,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 60px' }}>
          {t('sub')}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 52, left: '12%', right: '12%', height: 1, background: 'linear-gradient(90deg,transparent,var(--border-c),#2563eb,#10B981,var(--border-c),transparent)' }} />
        {steps.map(s => (
          <div key={s.n} style={{ padding: '0 22px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 104, height: 104, borderRadius: '50%', margin: '0 auto 26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, position: 'relative', background: 'var(--bg-card)', border: '1.5px solid var(--border-c)' }}>
              <div style={{ position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1E3A8A)', fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 11, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-body)' }}>{s.n}</div>
              {s.icon}
            </div>
            <h3 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 9 }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.65 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export async function DashboardPreview() {
  const t = await getTranslations('Sections.Dashboard')
  const stats = [
    { label: 'Revenue Today', value: '127,400 DA', color: '#10B981', change: '↑ 23.4%' },
    { label: 'Orders Today', value: '84', color: '#2563eb', change: '↑ 12' },
    { label: 'AI Handled', value: '3,421', color: 'var(--text-main)', change: '↑ 98.7%' },
    { label: 'Pending COD', value: '32', color: '#f59e0b', change: '→' },
  ]
  const bars = [40, 58, 72, 55, 87, 78, 100]

  return (
    <section id="dashboard" style={{ padding: '100px 5%', background: 'var(--bg-section)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 18 }}>
          <span style={{ width: 16, height: 1.5, background: '#2563eb' }} />{t('badge')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1 }}>
          {t('title1')} <span style={{ background: 'linear-gradient(135deg,#2563eb,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.75, maxWidth: 500, marginBottom: 40 }}>{t('sub')}</p>

        <div className="dashboard-mockup" style={{ 
          background: 'rgba(10,20,38,.92)', border: '1px solid var(--border-c)', 
          borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.15)',
          position: 'relative'
        }}>
          {/* Browser bar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-c)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            <div style={{ marginInlineStart: 14, background: 'var(--bg-card)', borderRadius: 6, padding: '3px 14px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>app.ecomate.dz/dashboard</div>
          </div>
          <div className="dash-inner" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 440 }}>
            {/* Sidebar */}
            <div style={{ borderInlineEnd: '1px solid var(--border-c)', padding: '16px 0' }} className="hide-mobile">
              {[['📊', 'Dashboard', true], ['📦', 'Orders', false], ['🛍️', 'Products', false], ['👥', 'Customers', false], ['🤖', 'AI Chatbot', false], ['📈', 'Analytics', false], ['🚚', 'Delivery', false]].map(([icon, label, active], i) => (
                <div key={i} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500, color: active ? 'var(--text-main)' : 'var(--text-muted)', background: active ? 'rgba(37,99,235,.08)' : 'transparent', borderInlineStart: active ? '2px solid #2563eb' : 'none' }}>
                  <span style={{ fontSize: 16 }}>{icon as string}</span>{label as string}
                </div>
              ))}
            </div>
            {/* Main */}
            <div style={{ padding: 24 }}>
              <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 14, padding: 18 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 5 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>{s.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                  Weekly Revenue — دج
                  <span style={{ fontSize: 12, color: '#10B981' }}>Live Updates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                  {bars.map((h, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: '6px 6px 0 0', height: `${h}%`, background: i === 4 || i === 6 ? 'linear-gradient(180deg,#10B981,rgba(16,185,129,.2))' : i === 2 || i === 5 ? 'linear-gradient(180deg,#2563eb,rgba(37,99,235,.2))' : 'rgba(37,99,235,.12)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .dash-inner { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
          .dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}

export async function AISection() {
  const t = await getTranslations('Sections.AI')
  return (
    <section id="ai-section" style={{ padding: '100px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
        {/* Chat mockup */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            background: 'rgba(10,20,38,.92)', border: '1px solid var(--border-c)', 
            borderRadius: 30, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.15)',
            transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
            maxWidth: 400, margin: '0 auto'
          }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--border-c)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
              <div style={{ textAlign: 'start' }}>
                <h4 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)' }}>EcoMate AI Assistant</h4>
                <p style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />Online · Replies instantly</p>
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', borderRadius: '16px 16px 16px 4px', padding: '11px 15px', fontSize: 13, maxWidth: '85%', fontFamily: 'var(--font-cairo)' }} dir="rtl">أبغي أشوف السراويل الجديدة 👖</div>
              <div style={{ alignSelf: 'flex-end', background: 'rgba(255,255,255,.06)', color: 'var(--text-main)', borderRadius: '16px 16px 4px 16px', padding: '12px 15px', fontSize: 13, border: '1px solid var(--border-c)', maxWidth: '85%', textAlign: 'start' }}>
                أهلاً! / Hello! 🔥 Here are today&apos;s best sellers:
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 10 }}>
                  {[['👖', 'Baggy', '3,5k'], ['👖', 'Blue', '3,2k'], ['👖', 'Grey', '3,8k']].map(([e, n, p]) => (
                    <div key={n} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 10, padding: 8, textAlign: 'center' }}>
                      <span style={{ fontSize: 18, display: 'block', marginBottom: 3 }}>{e as string}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-sub)', display: 'block' }}>{n as string}</span>
                      <span style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 10, fontWeight: 800, color: '#10B981', display: 'block', marginTop: 2 }}>{p as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-c)', display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'start' }}>{t('input_placeholder') || 'Type in any language...'}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff' }}>➤</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 18 }}>
            <span style={{ width: 16, height: 1.5, background: '#2563eb' }} />{t('badge')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1 }}>
            {t('title1')} <span style={{ background: 'linear-gradient(135deg,#2563eb,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.75, marginBottom: 32 }}>{t('sub')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {[
              { icon: '💬', iconBg: 'rgba(37,99,235,.1)', title: t('features.0.title'), desc: t('features.0.desc') },
              { icon: '🛒', iconBg: 'rgba(37,99,235,.1)', title: t('features.1.title'), desc: t('features.1.desc') },
              { icon: '📋', iconBg: 'rgba(16,185,129,.1)', title: t('features.2.title'), desc: t('features.2.desc') },
              { icon: '🚚', iconBg: 'rgba(16,185,129,.1)', title: t('features.3.title'), desc: t('features.3.desc') },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 14, transition: 'all .25s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ textAlign: 'start' }}>
                  <h4 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 3 }}>{f.title}</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--text-sub)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="https://wa.me/213555000000" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 15, padding: '16px 36px', textDecoration: 'none', display: 'inline-flex' }}>
            {t('cta')}
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginInlineStart: 10 }} className="rtl:rotate-180"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export async function Pricing({ plans = [] }: { plans?: any[] }) {
  const t = await getTranslations('Sections.Pricing')
  const servicesRaw = await t.raw('services')
  const services = Object.keys(servicesRaw || {}).map(slug => ({
    slug,
    ...servicesRaw[slug]
  }))

  return (
    <section id="pricing" style={{ padding: '100px 5%', background: 'var(--bg-section)' }}>
      <style>{`
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .arrow-icon { transform: rotate(180deg); }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 18 }}>
          <span style={{ width: 16, height: 1.5, background: '#2563eb' }} />{t('badge')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(30px,3.8vw,52px)', fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.1 }}>
          {t('title1')} <span style={{ background: 'linear-gradient(135deg,#2563eb,#93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-sub)', lineHeight: 1.75, margin: '0 auto 56px', maxWidth: 400 }}>{t('sub')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 880, margin: '0 auto' }}>
        {services.map((service: any) => {
          const packs = Object.keys(service.packs || {}).map(k => service.packs[k])
          if (!packs.length) return null

          return (
            <details key={service.slug} style={{
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-c)', 
              borderRadius: 22, 
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}>
              <summary style={{
                padding: '28px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontWeight: 800, fontSize: 20, color: 'var(--text-main)', fontFamily: 'var(--font-poppins), var(--font-cairo)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 26 }}>{service.icon}</span>
                  {service.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2563eb', fontSize: 14 }}>
                  <span>{t('viewPacks') || 'View Packs'}</span>
                  <svg className="arrow-icon" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ transition: 'transform .3s' }}><path d="M19 9l-7 7-7-7"/></svg>
                </div>
              </summary>
              <div style={{ padding: '0 32px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, paddingTop: 24, paddingBottom: 24 }}>
                  {packs.map((pack: any, i: number) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, textAlign: 'center'
                    }}>
                      <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>{pack.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, minHeight: 20 }}>{pack.desc}</div>
                      <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 20, fontWeight: 900, color: '#10B981', marginBottom: 20 }}>{pack.price}</div>
                    </div>
                  ))}
                </div>
                <a href="mailto:contact@ecomate.dz" style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '14px', borderRadius: 12,
                  fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 14, fontWeight: 700,
                  background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}>
                  {packs[0]?.cta || 'Contact Us'} →
                </a>
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}

export async function CTA() {
  const t = await getTranslations('Sections.CTA')
  return (
    <section id="cta" style={{ background: 'linear-gradient(135deg,#1E3A8A,#1e3a8a 45%,#07101f 100%)', padding: '120px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(37,99,235,.25),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 280, background: 'radial-gradient(ellipse,rgba(16,185,129,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <h2 style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-.03em', color: '#fff', lineHeight: 1.1, marginBottom: 20, position: 'relative' }}>
        {t('title1')}<br />
        <span style={{ background: 'linear-gradient(135deg,#10B981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title2')}</span>
      </h2>
      <p style={{ fontSize: 17, color: 'rgba(255,255,255,.5)', maxWidth: 480, margin: '0 auto 46px', lineHeight: 1.7, position: 'relative' }}>
        {t('sub')}
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
        <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 15, fontWeight: 700, color: '#07101f', background: 'linear-gradient(135deg,#fff,#e2e8f0)', borderRadius: 12, padding: '15px 34px', boxShadow: '0 4px 24px rgba(0,0,0,.3)', transition: 'all .25s', textDecoration: 'none' }}>
          {t('btn1')}
        </Link>
        <a href="https://wa.me/213555000000" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.8)', background: 'rgba(255,255,255,.07)', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '15px 30px', transition: 'all .25s', textDecoration: 'none' }}>
          {t('btn2')}
        </a>
      </div>
      <p style={{ fontFamily: 'var(--font-cairo), var(--font-poppins)', fontSize: 13, color: 'rgba(255,255,255,.2)', marginTop: 20, position: 'relative' }}>
        {t('footer')}
      </p>
    </section>
  )
}

export async function Footer() {
  const t = await getTranslations('Sections.Footer')
  return (
    <footer style={{ background: 'rgba(5,10,20,1)', padding: '80px 5% 40px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 60, marginBottom: 60 }}>
          <div style={{ textAlign: 'start' }}>
            <div style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontWeight: 800, fontSize: 24, marginBottom: 20 }}>
              <span style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Eco</span>
              <span style={{ background: 'linear-gradient(135deg,#2563eb,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mate</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.35)', lineHeight: 1.8, marginBottom: 24 }}>{t('desc')}</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {['📘', '📸', '💬', '💼'].map((s, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, transition: 'all .2s' }}>{s}</a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/privacy" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none', transition: 'color .2s' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none', transition: 'color .2s' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontWeight: 500 }}>© 2026 <span style={{ color: 'rgba(255,255,255,.6)' }}>EcoMate Pro</span>. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,.25)', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            صُنع في الجزائر 🇩🇿
          </div>
        </div>
      </div>
    </footer>
  )
}
