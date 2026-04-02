'use client'

import { useState } from 'react'
import { 
  MessageSquare, Zap, Target, Share2, 
  Activity, TrendingUp, BarChart3, Globe, 
  Send, CheckCircle2,
  AlertCircle, ChevronRight
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

export default function AISalesHubPage() {
  const t = useTranslations('AIHub')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [activeTab, setActiveTab] = useState('live')

  const platforms = [
    { id: 'facebook', icon: MessageSquare, name: 'Facebook Messenger', status: 'Active', color: '#1877f2', connected: true },
    { id: 'instagram', icon: Globe, name: 'Instagram DM', status: 'Paused', color: '#e1306c', connected: true },
    { id: 'whatsapp', icon: MessageSquare, name: 'WhatsApp Business', status: 'Syncing...', color: '#25d366', connected: true },
    { id: 'telegram', icon: Send, name: 'Telegram', status: 'Connect', color: '#229ED9', connected: false },
  ]

  const liveFeeds = [
    { customer: 'Ahmed. B', platform: 'WhatsApp', text: 'How much for the Eco-Bag with delivery to Oran?', statusKey: 'extracting', time: '2m ago' },
    { customer: 'Sara_92', platform: 'Instagram', text: 'I want to buy 2 large sizes please.', statusKey: 'created', number: '#5502', time: '15m ago' },
    { customer: 'Business_Owner', platform: 'Facebook', text: 'Do you have wholesale prices?', statusKey: 'captured', time: '1h ago' },
  ]

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ 
            fontFamily: 'var(--font-poppins)', fontSize: 28, fontWeight: 900, 
            color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' 
          }}>
            {t('title')} 🚀
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
            {t('sub')}
          </p>
        </div>
        
        {/* Premium Tab Switcher */}
        <div style={{ 
          display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)', 
          padding: 6, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {['live', 'connectivity'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '10px 20px', borderRadius: 12, 
                background: activeTab === tab ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTab === tab ? '#3B82F6' : 'rgba(255,255,255,0.4)', 
                fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              {tab === 'live' ? <Activity size={16} /> : <Globe size={16} />}
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'live' ? (
          <motion.div 
            key="live"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24 }}
          >
            {/* Main Feed Container */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: 32, padding: 32 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981'
                  }}>
                    <Zap size={22} fill="currentColor" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-poppins)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                    {t('feed.title')}
                  </h3>
                </div>
                <div style={{ fontSize: 12, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: 100, fontWeight: 700 }}>
                  ● LIVE
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {liveFeeds.map((f, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    style={{ 
                      padding: 20, borderRadius: 20, 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.04)', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                       <div style={{ 
                         width: 48, height: 48, borderRadius: 14, 
                         background: 'rgba(59, 130, 246, 0.15)', 
                         display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                         border: '1px solid rgba(59, 130, 246, 0.2)'
                       }}>
                        {f.platform === 'WhatsApp' ? <MessageSquare color="#25D366" size={24} /> : f.platform === 'Instagram' ? <Globe color="#E1306C" size={24} /> : <MessageSquare color="#1877F2" size={24} />}
                       </div>
                       <div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                           <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{f.customer}</span>
                           <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{f.time}</span>
                         </div>
                         <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontStyle: 'italic' }}>"{f.text}"</p>
                       </div>
                    </div>
                    <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                       <div style={{ 
                         fontSize: 13, fontWeight: 700, 
                         color: f.statusKey === 'created' ? '#10B981' : '#3B82F6',
                         display: 'flex', alignItems: 'center', gap: 6, justifyContent: isAr ? 'flex-start' : 'flex-end'
                       }}>
                         {f.statusKey === 'created' && <CheckCircle2 size={14} />}
                         {t(`feed.${f.statusKey}`, { number: f.number || '' })}
                       </div>
                       <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4, fontWeight: 600 }}>{t('feed.managed')}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Performance Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <div style={{ 
                 background: 'rgba(255, 255, 255, 0.02)', 
                 border: '1px solid rgba(255, 255, 255, 0.05)', 
                 borderRadius: 32, padding: 28 
               }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <BarChart3 size={18} color="#3B82F6" />
                    <h4 style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                      {t('performance.title')}
                    </h4>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t('performance.handling')}</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>94%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '94%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: 10, background: 'linear-gradient(90deg, #10B981, #34D399)' }} 
                        />
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.02)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t('performance.speed')}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Zap size={14} fill="#F59E0B" color="#F59E0B" /> &lt; 2s
                      </span>
                    </div>
                  </div>
               </div>

               <div style={{ 
                 background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))', 
                 border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: 32, padding: 28 
               }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <TrendingUp size={20} color="#3B82F6" />
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{t('performance.roi')}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                    52,400 <span style={{ fontSize: 16, fontWeight: 700, opacity: 0.5 }}>DA</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    {t('performance.est_sales')}
                  </p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="connectivity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}
          >
            {platforms.map((p) => (
              <div 
                key={p.id} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '32px', background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 28,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ 
                    width: 60, height: 60, borderRadius: 18, 
                    background: `${p.color}15`, border: `1px solid ${p.color}30`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color 
                  }}>
                    <p.icon size={30} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.connected ? '#10B981' : 'rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: p.connected ? '#10B981' : 'rgba(255,255,255,0.3)' }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button style={{ 
                  padding: '12px 24px', borderRadius: 14, 
                  background: p.connected ? 'rgba(255,255,255,0.05)' : p.color, 
                  border: 'none',
                  color: p.connected ? 'rgba(255,255,255,0.6)' : '#fff', 
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'transform 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {p.connected ? t('connectivity.manage') : t('connectivity.connect')}
                  {p.connected && <ChevronRight size={16} />}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
