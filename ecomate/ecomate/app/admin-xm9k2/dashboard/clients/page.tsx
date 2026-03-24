import { createClient } from '@/lib/supabase/server'

export default async function AdminClientsPage() {
  const supabase = createClient()
  const { data: clients } = await supabase
    .from('profiles')
    .select('*, subscriptions(plan_slug, status, created_at)')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  const planColor = (plan: string) => plan === 'growth' ? '#10B981' : plan === 'business' ? '#8b5cf6' : '#2563eb'

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Clients 👥</h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.35)' }}>{clients?.length || 0} registered clients</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Business</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients?.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {c.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 13.5 }}>{c.full_name || 'Unknown'}</div>
                    </div>
                  </div>
                </td>
                <td>{c.business_name || '—'}</td>
                <td>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: `${planColor(c.plan)}20`, color: planColor(c.plan), textTransform: 'uppercase' }}>
                    {c.plan || 'starter'}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                    color: c.plan_status === 'active' ? '#10B981' : c.plan_status === 'trial' ? '#f59e0b' : '#ef4444' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {c.plan_status || 'trial'}
                  </span>
                </td>
                <td>{c.phone || '—'}</td>
                <td style={{ fontSize: 12.5 }}>{new Date(c.created_at).toLocaleDateString('fr-DZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!clients || clients.length === 0) && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,.25)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            No clients registered yet
          </div>
        )}
      </div>
    </div>
  )
}
