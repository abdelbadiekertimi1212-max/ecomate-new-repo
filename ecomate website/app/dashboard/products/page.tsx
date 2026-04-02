'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { 
  Package, Plus, Search, Edit, Trash2, ChevronRight, PackageOpen, Tag, 
  Warehouse, DollarSign
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  })
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  in_stock: boolean
  category: string | null
  sizes: string[]
  colors: string[]
}

export default function ProductsPage() {
  const t = useTranslations('Products')
  const locale = useLocale()
  const isAr = locale === 'ar'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    stock: '10', 
    category: '', 
    sizes: '', 
    colors: '' 
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
      toast.success(t('toasts.updated'))
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setProducts(p => [data, ...p])
      toast.success(t('toasts.added'))
    }
    setShowAdd(false); setEditId(null)
    setForm({ name: '', description: '', price: '', stock: '10', category: '', sizes: '', colors: '' })
    setSaving(false)
  }

  async function deleteProduct(id: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
      return
    }
    setProducts(p => p.filter(x => x.id !== id))
    toast.success(t('toasts.deleted'))
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" }
    })
  }

  const inputClass = "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[13.5px] text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/20"

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-3xl text-white mb-2"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-white/40"
          >
            {t('sub')}
          </motion.p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', description: '', price: '', stock: '10', category: '', sizes: '', colors: '' }) }}
            className="px-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-white/90 transition-all whitespace-nowrap shadow-xl shadow-white/5"
          >
            <Plus size={18} strokeWidth={3} />
            {t('add_btn')}
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-white/20 gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-white/40 animate-spin" />
          <p className="text-sm font-medium animate-pulse">{t('loading')}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((p, i) => (
            <motion.div 
              key={p.id}
              custom={i}
              variants={cardVariants as any}
              className="group relative bg-[#ffffff]/[0.02] border border-white/[0.05] rounded-[32px] p-6 hover:bg-[#ffffff]/[0.04] hover:border-white/[0.1] transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <Package size={28} strokeWidth={1.5} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { 
                      setEditId(p.id); 
                      setForm({ 
                        name: p.name, 
                        description: p.description || '', 
                        price: p.price.toString(), 
                        stock: p.in_stock ? '10' : '0', 
                        category: p.category || '', 
                        sizes: p.sizes?.join(', ') || '', 
                        colors: p.colors?.join(', ') || '' 
                      }); 
                      setShowAdd(true) 
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px] uppercase font-bold tracking-wider text-white/40">
                    {p.category || t('card.uncategorized')}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${
                    p.in_stock 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}>
                    {p.in_stock ? t('card.in_stock') : t('card.out_of_stock')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {p.name}
                </h3>
                
                {p.sizes && p.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.sizes.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[9px] font-bold text-white/30 uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="text-2xl font-black text-white">
                    {p.price.toLocaleString()} <span className="text-sm font-medium text-white/30 uppercase ml-1">DA</span>
                  </div>
                  <ChevronRight size={20} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ffffff]/[0.02] border border-white/[0.05] rounded-[48px] py-24 px-12 text-center"
        >
          <div className="w-24 h-24 rounded-[32px] bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-8">
            <PackageOpen size={48} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{t('empty.title')}</h3>
          <p className="text-white/40 mb-10 max-w-sm mx-auto">{t('empty.sub')}</p>
          <button 
            onClick={() => setShowAdd(true)}
            className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
          >
            {t('empty.btn')}
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-[#07101f]/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#0a1628] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    {editId ? <Tag size={24} /> : <Plus size={24} />}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {editId ? t('form.edit_title') : t('form.add_title')}
                  </h3>
                </div>

                <form onSubmit={saveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.name')}</label>
                      <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="text" required placeholder="Luxury Bag" value={form.name} onChange={e => setForm(x => ({ ...x, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.category')}</label>
                      <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="text" placeholder="Fashion" value={form.category} onChange={e => setForm(x => ({ ...x, category: e.target.value }))} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 pl-1">
                        <DollarSign size={10} className="text-white/30" />
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('form.price')}</label>
                      </div>
                      <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="number" required placeholder="5000" value={form.price} onChange={e => setForm(x => ({ ...x, price: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 pl-1">
                        <Warehouse size={10} className="text-white/30" />
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('form.stock')}</label>
                      </div>
                      <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="number" placeholder="50" value={form.stock} onChange={e => setForm(x => ({ ...x, stock: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.sizes')}</label>
                    <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="text" placeholder="S, M, L, XL" value={form.sizes} onChange={e => setForm(x => ({ ...x, sizes: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.colors')}</label>
                    <input style={{ paddingLeft: '1rem', paddingRight: '1rem' }} className={inputClass} type="text" placeholder="Black, White, Blue" value={form.colors} onChange={e => setForm(x => ({ ...x, colors: e.target.value }))} />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setShowAdd(false)} 
                      className="flex-1 px-8 py-4 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                    >
                      {t('form.cancel')}
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving} 
                      className="flex-[2] px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                    >
                      {saving ? t('form.processing') : editId ? t('form.save') : t('form.create')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
