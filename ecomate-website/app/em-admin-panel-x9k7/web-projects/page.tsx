'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const statuses = ['kickoff', 'design', 'development', 'review', 'client_approval', 'launched']

export default function AdminWebProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const supabase = createClient()
    const { data } = await supabase
      .from('web_projects')
      .select(`
        *,
        profiles:client_id(full_name, business_name)
      `)
      .order('created_at', { ascending: false })
    
    setProjects(data || [])
    setLoading(false)
  }

  async function updateField(id: string, field: string, value: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('web_projects')
      .update({ [field]: value })
      .eq('id', id)
    
    if (error) {
      toast.error(`Failed to update ${field}`)
    } else {
      toast.success(`${field} updated`)
      setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-poppins)' }}>
          Web Projects Pipeline 🌐
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Manage custom store builds and landing page pipelines.</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading projects...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <div key={p.id} style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: 16, padding: 24 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
                    {p.project_type?.replace('_', ' ') || 'Web Dev'}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                    {p.profiles?.business_name || 'Unknown Client'}
                  </h3>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{p.profiles?.full_name}</div>
                </div>
                <select 
                  value={p.status || 'kickoff'} 
                  onChange={(e) => updateField(p.id, 'status', e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                    color: p.status === 'launched' ? '#10b981' : p.status === 'client_approval' ? '#f59e0b' : '#3b82f6',
                    padding: '4px 8px', borderRadius: 8, fontSize: 12, outline: 'none', cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Preview URL (Figma, Vercel)</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    defaultValue={p.preview_url || ''}
                    onBlur={(e) => {
                      if (e.target.value !== p.preview_url) updateField(p.id, 'preview_url', e.target.value)
                    }}
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#8b5cf6', padding: '8px 12px', borderRadius: 8, fontSize: 13, outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Live URL (Production)</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    defaultValue={p.live_url || ''}
                    onBlur={(e) => {
                      if (e.target.value !== p.live_url) updateField(p.id, 'live_url', e.target.value)
                    }}
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#10b981', padding: '8px 12px', borderRadius: 8, fontSize: 13, outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Admin Notes & Logs</label>
                  <textarea 
                    rows={2}
                    placeholder="Progress updates..."
                    defaultValue={p.notes || ''}
                    onBlur={(e) => {
                      if (e.target.value !== p.notes) updateField(p.id, 'notes', e.target.value)
                    }}
                    style={{
                      width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)', padding: '8px 12px', borderRadius: 8, fontSize: 13, 
                      outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No web projects found.</div>
          )}
        </div>
      )}
    </div>
  )
}
