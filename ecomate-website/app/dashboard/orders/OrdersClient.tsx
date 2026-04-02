'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Package, Search, Plus, Filter, User, MapPin, 
  Phone, Calendar, ArrowRight, CheckCircle2, 
  Truck, Clock, MoreVertical, XCircle, ChevronRight,
  PackageOpen, Hash, DollarSign, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

const KANBAN_STAGES = ['pending', 'confirmed', 'shipped', 'delivered']

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  wilaya: string
  address: string
  total_da: number
  status: string
  created_at: string
}

export default function OrdersClient({ initialOrders, userId }: { initialOrders: Order[], userId: string }) {
  const t = useTranslations('Orders')
  const locale = useLocale()
  const isAr = locale === 'ar'

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: t('kanban.pending'), color: '#f59e0b', icon: Clock },
    confirmed: { label: t('kanban.confirmed'), color: '#3B82F6', icon: CheckCircle2 },
    shipped: { label: t('kanban.shipped'), color: '#8b5cf6', icon: Truck },
    delivered: { label: t('kanban.delivered'), color: '#10B981', icon: Package },
  }

  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customer_name: '', customer_phone: '', wilaya: '', address: '', total_da: '', notes: ''
  })

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search)
    )
  }, [orders, search])

  const groupedOrders = useMemo(() => {
    const groups: Record<string, Order[]> = { pending: [], confirmed: [], shipped: [], delivered: [], cancelled: [] }
    filteredOrders.forEach(o => {
      if (groups[o.status]) groups[o.status].push(o)
      else groups.pending.push(o)
    })
    return groups
  }, [filteredOrders])

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) return toast.error(error.message)
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
    toast.success(t('toasts.moved', { status: STATUS_CONFIG[status].label }))
  }

  async function handleAddOrder(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('orders').insert({
      user_id: userId,
      order_number: `ORD-${Date.now().toString().slice(-6)}`,
      customer_name: newOrder.customer_name,
      customer_phone: newOrder.customer_phone,
      wilaya: newOrder.wilaya,
      address: newOrder.address,
      total_da: parseInt(newOrder.total_da) || 0,
      status: 'pending'
    }).select().single()

    if (error) { toast.error(error.message) }
    else {
      setOrders(prev => [data, ...prev])
      setShowAdd(false)
      setNewOrder({ customer_name: '', customer_phone: '', wilaya: '', address: '', total_da: '', notes: '' })
      toast.success(t('toasts.created'))
    }
    setAdding(false)
  }

  const stages = isAr ? [...KANBAN_STAGES].reverse() : KANBAN_STAGES

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="space-y-8 pb-20">
      {/* Header & Controls */}
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
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-white/90 transition-all shadow-xl shadow-white/5 whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={3} />
            {t('add_btn')}
          </motion.button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[60vh]">
        {stages.map((stage) => {
          const Icon = STATUS_CONFIG[stage].icon
          return (
            <div key={stage} className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: `${STATUS_CONFIG[stage].color}15`, color: STATUS_CONFIG[stage].color }}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">{STATUS_CONFIG[stage].label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[10px] font-black text-white/20">
                  {groupedOrders[stage]?.length || 0}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {groupedOrders[stage]?.map((order, i) => (
                    <motion.div 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group relative bg-[#ffffff]/[0.02] border border-white/[0.05] rounded-[24px] p-5 hover:bg-[#ffffff]/[0.04] hover:border-white/[0.1] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                          <Hash size={10} className="text-blue-400" />
                          <span className="text-[10px] font-black text-white font-mono">{order.order_number}</span>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-white/5 text-white/10 group-hover:text-white/40 transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-[15px] font-extrabold text-white mb-1 group-hover:text-blue-400 transition-colors">{order.customer_name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-white/30 font-medium">
                          <Phone size={10} /> 
                          {order.customer_phone}
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-4 border-t border-white/[0.03] mt-2">
                        <div>
                          <div className="text-[9px] font-black text-white/10 uppercase tracking-tighter mb-0.5">{t('kanban.wilaya')}</div>
                          <div className="text-[12px] font-bold text-white/50">{order.wilaya || '—'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black text-white/10 uppercase tracking-tighter mb-0.5">{t('kanban.total')}</div>
                          <div className="text-[14px] font-black text-emerald-500">{order.total_da.toLocaleString()} <span className="text-[10px] opacity-40">DA</span></div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-4">
                        {stage !== 'delivered' && (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateStatus(order.id, KANBAN_STAGES[KANBAN_STAGES.indexOf(stage) + 1])}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={{ background: `${STATUS_CONFIG[stage].color}15`, color: STATUS_CONFIG[stage].color }}
                          >
                            {t('kanban.move')}
                          </motion.button>
                        )}
                        <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/10 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {(!groupedOrders[stage] || groupedOrders[stage].length === 0) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 border-2 border-dashed border-white/[0.03] rounded-[24px] flex flex-col items-center justify-center text-white/10 gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center">
                      <Icon size={18} strokeWidth={1} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t('kanban.empty_stage')}</span>
                  </motion.div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Order Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 text-right">
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
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {t('form.title')}
                  </h3>
                </div>

                <form onSubmit={handleAddOrder} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.name')}</label>
                    <input 
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[14px] text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                      required value={newOrder.customer_name} onChange={e => setNewOrder(n => ({ ...n, customer_name: e.target.value }))} placeholder="Ahmed Benali" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.phone')}</label>
                      <input 
                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[14px] text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                        value={newOrder.customer_phone} onChange={e => setNewOrder(n => ({ ...n, customer_phone: e.target.value }))} placeholder="055..." 
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.wilaya')}</label>
                      <input 
                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[14px] text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                        value={newOrder.wilaya} onChange={e => setNewOrder(n => ({ ...n, wilaya: e.target.value }))} placeholder="16 - Alger" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">{t('form.total')}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="number"
                        className="w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[14px] text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 font-bold"
                        required value={newOrder.total_da} onChange={e => setNewOrder(n => ({ ...n, total_da: e.target.value }))} placeholder="5000" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-8 py-4 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all">
                      {t('form.discard')}
                    </button>
                    <button type="submit" disabled={adding} className="flex-[2] px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all shadow-xl shadow-white/5 disabled:opacity-50">
                      {adding ? t('form.creating') : t('form.create')}
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
