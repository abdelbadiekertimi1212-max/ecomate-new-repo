import { useTranslations } from 'next-intl'

export default function Partners({ partners }: { partners: any[] }) {
  const t = useTranslations('Sections.Integrations')
  const row1 = partners.filter(p => p.row_num === 1)
  const row2 = partners.filter(p => p.row_num === 2)

  function card(p: any) {
    const isSoon = !p.is_live
    return (
      <div key={p.id} style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '13px 20px',
        background: 'var(--bg-card)', border: '1px solid var(--border-c)',
        borderRadius: 14, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: isSoon ? 0.6 : 1,
        position: 'relative', overflow: 'hidden',
        transition: 'all .3s ease',
        cursor: 'default',
      }}>
        {isSoon && (
          <span style={{ 
            position: 'absolute', top: 6, insetInlineEnd: 10, 
            fontSize: 8, fontWeight: 900, letterSpacing: '.1em', 
            color: '#f59e0b', opacity: 0.8 
          }}>SOON</span>
        )}
        <div style={{ 
          width: 40, height: 40, borderRadius: 10, 
          background: 'rgba(255,255,255,.04)', border: '1px solid var(--border-c)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 20, flexShrink: 0 
        }}>
          {p.logo?.startsWith('http') ? (
            <img src={p.logo} alt={p.name} style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain' }} />
          ) : p.logo}
        </div>
        <div style={{ textAlign: 'start' }}>
          <span style={{ fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'block', lineHeight: 1.25 }}>{p.name}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>{p.category}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '60px 0 50px', borderTop: '1px solid var(--border-c)', 
      borderBottom: '1px solid var(--border-c)', background: 'var(--bg-body)', 
      overflow: 'hidden', position: 'relative' 
    }}>
      <div style={{ textAlign: 'center', padding: '0 5% 44px' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, 
          fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', 
          color: '#2563eb', marginBottom: 12 
        }}>
          <span style={{ width: 18, height: 1.5, background: '#2563eb', display: 'block' }} />
          {t('badge')}
          <span style={{ width: 18, height: 1.5, background: '#2563eb', display: 'block' }} />
        </div>
        <h2 style={{ 
          fontFamily: 'var(--font-poppins), var(--font-cairo)', fontSize: 'clamp(24px,2.8vw,34px)', 
          fontWeight: 800, letterSpacing: '-.02em', color: 'var(--text-main)', 
          marginBottom: 10, lineHeight: 1.15 
        }}>
          Growing with <span style={{ background: 'linear-gradient(135deg,#2563eb,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Algerian Excellence.</span>
        </h2>
        <p style={{ fontSize: 14.5, color: 'var(--text-sub)', fontWeight: 500 }}>{t('social')} & {t('delivery')}</p>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: 120, background: 'linear-gradient(to right, var(--bg-body), transparent)', zIndex: 2, pointerEvents: 'none' }} className="rtl:hidden" />
        <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: 120, background: 'linear-gradient(to left, var(--bg-body), transparent)', zIndex: 2, pointerEvents: 'none' }} className="rtl:hidden" />

        <div className="ptn-row" style={{ display: 'flex', gap: 16, width: 'max-content', padding: '8px 0', animation: 'pscroll-l 40s linear infinite' }}>
          {row1.map(p => card(p))}
          {row1.map(p => ({ ...p, id: p.id + '_dup' })).map(p => card(p))}
        </div>

        <div className="ptn-row" style={{ display: 'flex', gap: 16, width: 'max-content', padding: '8px 0', marginTop: 12, animation: 'pscroll-r 48s linear infinite' }}>
          {row2.map(p => card(p))}
          {row2.map(p => ({ ...p, id: p.id + '_dup' })).map(p => card(p))}
        </div>
      </div>
    </div>
  )
}
