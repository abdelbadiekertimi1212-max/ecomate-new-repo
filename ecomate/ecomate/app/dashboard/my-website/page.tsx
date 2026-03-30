'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const steps = ['kickoff', 'design', 'development', 'review', 'client_approval', 'launched']
const stepLabels: Record<string, string> = {
  kickoff: 'Kickoff',
  design: 'Design',
  development: 'Dev',
  review: 'Review',
  client_approval: 'Approval',
  launched: 'Live'
}

export default function WebProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      
      const { data: proj } = await supabase
        .from('web_projects')
        .select('*')
        .eq('client_id', data.user.id)
        .order('created_at', { ascending: false })
      
      setProjects(proj || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>Web Development 🌐</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Track your custom store or landing page progress.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading projects...</div>
      ) : projects.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {projects.map(proj => {
            const currentIdx = steps.indexOf(proj.status)
            
            return (
              <div key={proj.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-c)', 
                borderRadius: 16, padding: '24px 28px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                      {proj.project_type.replace('_', ' ')}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>
                      Web Project #{proj.id.substring(0,6)}
                    </h3>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 10 }}>
                    {proj.preview_url && proj.status !== 'launched' && (
                      <a href={proj.preview_url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 12, fontWeight: 600, color: '#8b5cf6', padding: '6px 14px', 
                        background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', 
                        borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <span>🎨</span> Figma Preview
                      </a>
                    )}
                    {proj.live_url && proj.status === 'launched' && (
                      <a href={proj.live_url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 12, fontWeight: 600, color: '#10B981', padding: '6px 14px', 
                        background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', 
                        borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <span>🚀</span> Live Site
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', 
                  borderRadius: 12, padding: '24px', marginTop: 16 
                }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ position: 'absolute', top: 11, left: '5%', right: '5%', height: 2, background: 'rgba(255,255,255,.05)', zIndex: 0 }} />
                    <div style={{ position: 'absolute', top: 11, left: '5%', width: `${Math.max(0, (currentIdx / (steps.length - 1)) * 90)}%`, height: 2, background: '#2563eb', transition: 'width 0.5s', zIndex: 0 }} />
                    
                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentIdx || proj.status === 'launched'
                      const isActive = idx === currentIdx
                      return (
                        <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <div style={{ 
                            width: 24, height: 24, borderRadius: '50%', 
                            background: isCompleted ? '#2563eb' : isActive ? 'var(--bg-card)' : 'var(--bg-card)',
                            border: `2px solid ${isCompleted ? '#2563eb' : isActive ? '#2563eb' : 'rgba(255,255,255,.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,.2)' : 'none'
                          }}>
                            {isCompleted && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                            {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive || isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {stepLabels[step]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {proj.notes && (
                  <div style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)', background: 'rgba(0,0,0,.2)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid #2563eb' }}>
                     {proj.notes}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>No active web projects</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>
            Ready to scale? Book a call to start building your custom high-converting Shopify or Next.js store.
          </div>
        </div>
      )}
    </div>
  )
}
