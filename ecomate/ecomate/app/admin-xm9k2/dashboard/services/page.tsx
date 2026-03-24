'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '⚙️', plan_required: 'starter', is_active: true })

  useEffect(() => { fetchServices() }, [])

  async function fetchServices() {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setServices(data || [])
    setLoading(false)
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('services').update(form).eq('id', editId)
      toast.success('Service updated!')
    } else {
      await supabase.from('services').insert({ ...form, sort_order: services.length + 1 })
      toast.success('Service added!')
    }
    fetchServices()
    setShowAdd(false); setEditId(null)
    setForm({ name: '', description: '', icon: '⚙️', plan_required: 'starter', is_active: true })
    setSaving(false)
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('services').update({ is_active: !current }).eq('id', id)
    setServices(s => s.map(x => x.id === id ? { ...x, is_active: !current } : x))
    toast.success(`Service ${!current ? 'activated' : 'deactivated'}`)
  }

  const planColor = (p: string) => p === 'growth' ? '#10B981' : p === 'business' ? '#8b5cf6' : '#2563eb'
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(255,255,255,.08)', borderRadius: 9, fontSize: 13.5, color: '#fff', outline: 'none', fontFamily: 'var(--font-inter)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Services ⚙️</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.35)' }}>Manage EcoMate services and plan requirements</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', description: '', icon: '⚙️', plan_required: 'starter', is_active: true }) }} className="btn-primary" style={{ padding: '11px 22px' }}>+ Add Service</button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,.3)' }}>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {services.map(s => (
            <div key={s.id} style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${s.is_active ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.04)'}`, borderRadius: 14, padding: '20px', opacity: s.is_active ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(37,99,235,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setEditId(s.id); setForm({ name: s.name, description: s.description || '', icon: s.icon, plan_required: s.plan_required, is_active: s.is_active }); setShowAdd(true) }} style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.2)', color: '#2563eb', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✏️</button>
                  <button onClick={() => toggleActive(s.id, s.is_active)} style={{ padding: '5px 10px', borderRadius: 7, background: s.is_active ? 'rgba(239,68,68,.08)' : 'rgba(16,185,129,.1)', border: `1px solid ${s.is_active ? 'rgba(239,68,68,.15)' : 'rgba(16,185,129,.2)'}`, color: s.is_active ? '#ef4444' : '#10B981', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {s.is_active ? '⏸' : '▶'}
                  </button>
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.name}</h3>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.4)', lineHeight: 1.55, marginBottom: 12 }}>{s.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${planColor(s.plan_required)}20`, color: planColor(s.plan_required), textTransform: 'uppercase' }}>
                  {s.plan_required} plan
                </span>
                <span style={{ fontSize: 12, color: s.is_active ? '#10B981' : 'rgba(255,255,255,.25)', fontWeight: 600 }}>
                  {s.is_active ? '● Active' : '○ Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 420 }}>
            <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20 }}>{editId ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={saveService} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Service Name *', key: 'name', type: 'text', placeholder: 'AI Chatbot', required: true },
                { label: 'Icon (emoji)', key: 'icon', type: 'text', placeholder: '🤖', required: false },
                { label: 'Description', key: 'description', type: 'text', placeholder: 'Short description', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input style={inputStyle} type={f.type} required={f.required} placeholder={f.placeholder} value={form[f.key as keyof typeof form] as string} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Required Plan</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.plan_required} onChange={e => setForm(x => ({ ...x, plan_required: e.target.value }))}>
                  <option value="starter">Starter (Free)</option>
                  <option value="growth">Growth (4,900 DA)</option>
                  <option value="business">Business (Custom)</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div onClick={() => setForm(x => ({ ...x, is_active: !x.is_active }))} style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${form.is_active ? '#10B981' : 'rgba(255,255,255,.14)'}`, background: form.is_active ? '#10B981' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 800 }}>
                  {form.is_active ? '✓' : ''}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Service is active</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editId ? 'Update' : 'Add Service →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
