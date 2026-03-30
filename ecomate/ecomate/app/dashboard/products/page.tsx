'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', sizes: '', colors: '' })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: p } = await supabase
        .from('products')
        .select('*')
        .eq('client_id', data.user.id)
        .order('created_at', { ascending: false })
      setProducts(p || [])
      setLoading(false)
    })
  }, [])

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const payload = { 
      client_id: userId, 
      name: form.name, 
      description: form.description, 
      price: parseInt(form.price) || 0, 
      in_stock: parseInt(form.stock) > 0,
      category: form.category,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean)
    }

    if (editId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editId)
      if (error) { toast.error(error.message); setSaving(false); return }
      setProducts(p => p.map(x => x.id === editId ? { ...x, ...payload } : x))
      toast.success('Product updated!')
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setProducts(p => [data, ...p])
      toast.success('Product added!')
    }
    setShowAdd(false); setEditId(null)
    setForm({ name: '', description: '', price: '', stock: '', category: '', sizes: '', colors: '' })
    setSaving(false)
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setProducts(p => p.filter(x => x.id !== id))
    toast.success('Product deleted')
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, fontSize: 13.5, color: '#fff', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Products Hub 🛍️</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>Manage your catalog for social sales automation.</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', description: '', price: '', stock: '10', category: '', sizes: '', colors: '' }) }} className="btn-primary" style={{ padding: '12px 24px' }}>+ New Product</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64, color: 'rgba(255,255,255,.2)' }}>Fetching inventory...</div>
      ) : products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setEditId(p.id); setForm({ name: p.name, description: p.description || '', price: p.price.toString(), stock: '1', category: p.category || '', sizes: p.sizes?.join(', ') || '', colors: p.colors?.join(', ') || '' }); setShowAdd(true) }} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.1)', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>{p.category || 'Uncategorized'}</div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                {p.sizes?.map((s: string) => <span key={s} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{s}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981' }}>{p.price.toLocaleString()} DA</div>
                <div style={{ fontSize: 11, color: p.in_stock ? '#10B981' : '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>
                  {p.in_stock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Empty Catalog</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Add products to enable AI Social Sales.</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">Add First Product</button>
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,16,31,.9)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,.1)', borderRadius: 32, padding: '40px', width: '100%', maxWidth: 500 }}>
            <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 24 }}>{editId ? 'Modify Product' : 'Create Product'}</h3>
            <form onSubmit={saveProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Name</label>
                  <input style={inputStyle} type="text" required placeholder="Luxury Bag" value={form.name} onChange={e => setForm(x => ({ ...x, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
                  <input style={inputStyle} type="text" placeholder="Fashion" value={form.category} onChange={e => setForm(x => ({ ...x, category: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Price (DA)</label>
                  <input style={inputStyle} type="number" required placeholder="5000" value={form.price} onChange={e => setForm(x => ({ ...x, price: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Initial Stock</label>
                  <input style={inputStyle} type="number" placeholder="50" value={form.stock} onChange={e => setForm(x => ({ ...x, stock: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Sizes (comma separated)</label>
                <input style={inputStyle} type="text" placeholder="S, M, L, XL" value={form.sizes} onChange={e => setForm(x => ({ ...x, sizes: e.target.value }))} />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Colors (comma separated)</label>
                <input style={inputStyle} type="text" placeholder="Black, White, Blue" value={form.colors} onChange={e => setForm(x => ({ ...x, colors: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? 'Processing...' : editId ? 'Save Changes' : 'Create Product →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
