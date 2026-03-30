'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const steps = ['briefing', 'in_production', 'in_review', 'delivered']
const stepLabels: Record<string, string> = {
  briefing: 'Briefing',
  in_production: 'Filming',
  in_review: 'Editing',
  delivered: 'Delivered'
}

export default function CreativePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(prof)

      const { data: proj } = await supabase
        .from('creative_projects')
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
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>Creative Studio 🎬</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Track your UGC and content production pipeline.</p>
        </div>
        
        {/* Universal Drive Link from Profile */}
        {profile?.drive_folder_url && (
          <a href={profile.drive_folder_url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', 
            background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.2)', 
            borderRadius: 10, color: '#2563eb', fontSize: 13, fontWeight: 600, textDecoration: 'none'
          }}>
            <span style={{ fontSize: 16 }}>📁</span> Master Drive Folder
          </a>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading projects...</div>
      ) : projects.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {projects.map(proj => {
            // "briefing" isn't explicitly in schema, we'll map status:
            // schema bounds: in_production, in_review, delivered, revision
            let currentIdx = steps.indexOf(proj.status)
            if (proj.status === 'revision') currentIdx = 2 // treat as editing
            
            return (
              <div key={proj.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-c)', 
                borderRadius: 16, padding: '24px 28px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{proj.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{proj.description}</p>
                  </div>
                  {proj.drive_link && (
                    <a href={proj.drive_link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 12, fontWeight: 600, color: '#10B981', padding: '6px 12px', 
                      background: 'rgba(16,185,129,.1)', borderRadius: 8, textDecoration: 'none'
                    }}>
                      View Deliverables →
                    </a>
                  )}
                </div>

                {/* Pipeline UI */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ position: 'absolute', top: 11, left: '10%', right: '10%', height: 2, background: 'rgba(255,255,255,.05)', zIndex: 0 }} />
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentIdx || proj.status === 'delivered'
                    const isActive = idx === currentIdx
                    return (
                      <div key={step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '25%' }}>
                        <div style={{ 
                          width: 24, height: 24, borderRadius: '50%', 
                          background: isCompleted ? '#10B981' : isActive ? '#2563eb' : 'var(--bg-card)',
                          border: `2px solid ${isCompleted || isActive ? 'transparent' : 'rgba(255,255,255,.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,.2)' : 'none'
                        }}>
                          {isCompleted && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {stepLabels[step]}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {proj.revision_notes && (
                  <div style={{ marginTop: 24, padding: '14px', background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: 4 }}>Revision Notes</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{proj.revision_notes}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 16, padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>No creative projects yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 450, margin: '0 auto', lineHeight: 1.6 }}>
            Submit a creative brief or contact your account manager to start producing UGC, product videos, and photoshoots.
          </div>
          <button className="btn-primary" onClick={() => window.open('https://docs.google.com/forms/d/e/mock-brief-form', '_blank')}>
            📄 Submit Creative Brief
          </button>
        </div>
      )}
    </div>
  )
}
