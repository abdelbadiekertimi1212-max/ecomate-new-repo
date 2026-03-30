'use client'
import { useState } from 'react'
import { MessageSquare, Zap, Target, Share2, Activity, TrendingUp } from 'lucide-react'

export default function AISalesHubPage() {
  const [activeTab, setActiveTab] = useState('live')

  const platforms = [
    { icon: <MessageSquare size={20} />, name: 'Facebook Messenger', status: 'Active', color: '#1877f2', connected: true },
    { icon: <MessageSquare size={20} />, name: 'Instagram DM', status: 'Paused', color: '#e1306c', connected: true },
    { icon: <MessageSquare size={20} />, name: 'WhatsApp Business', status: 'Syncing...', color: '#25d366', connected: true },
    { icon: <MessageSquare size={20} />, name: 'Telegram', status: 'Connect', color: '#229ED9', connected: false },
  ]

  const liveFeeds = [
    { customer: 'Ahmed. B', platform: 'WhatsApp', text: 'How much for the Eco-Bag with delivery to Oran?', status: 'Extracting Order...', time: '2m ago' },
    { customer: 'Sara_92', platform: 'Instagram', text: 'I want to buy 2 large sizes please.', status: 'Order Created #5502', time: '15m ago' },
    { customer: 'Business_Owner', platform: 'Facebook', text: 'Do you have wholesale prices?', status: 'Lead Captured', time: '1h ago' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-poppins)', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>AI Sales Hub 🚀</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.4)' }}>Omni-channel sales automation and data sync.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 12 }}>
          <button 
            onClick={() => setActiveTab('live')}
            style={{ padding: '8px 16px', borderRadius: 8, background: activeTab === 'live' ? '#2563eb' : 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Live Activity
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ padding: '8px 16px', borderRadius: 8, background: activeTab === 'settings' ? '#2563eb' : 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Connectivity
          </button>
        </div>
      </div>

      {activeTab === 'live' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Main Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Activity size={20} color="#10B981" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Social Sales Stream</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {liveFeeds.map((f, i) => (
                  <div key={i} style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                       <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {f.platform === 'WhatsApp' ? '💬' : f.platform === 'Instagram' ? '📸' : '📘'}
                       </div>
                       <div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{f.customer}</span>
                           <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{f.time}</span>
                         </div>
                         <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>"{f.text}"</p>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 12, fontWeight: 700, color: f.status.includes('Order') ? '#10B981' : '#2563eb' }}>{f.status}</div>
                       <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>AI Managed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 24, padding: 24 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>AI Performance 📈</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#fff' }}>AI Handling Rate</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>94%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '94%', height: '100%', borderRadius: 10, background: '#10b981' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#fff' }}>Response Speed</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>⚡ &lt; 2s</span>
                    </div>
                  </div>
                </div>
             </div>

             <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 24, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <TrendingUp size={18} color="#2563eb" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Social ROI</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>52k DA</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Estimated sales via DMs this week</div>
             </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {platforms.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-c)', borderRadius: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color }}>{p.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-poppins)', fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: p.connected ? '#10b981' : 'var(--text-muted)' }}>{p.status}</div>
                </div>
              </div>
              <button style={{ padding: '8px 18px', borderRadius: 10, background: p.connected ? 'rgba(255,255,255,0.05)' : `${p.color}15`, border: `1px solid ${p.connected ? 'rgba(255,255,255,0.1)' : `${p.color}40`}`, color: p.connected ? 'rgba(255,255,255,0.5)' : p.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {p.connected ? 'Manage' : '+ Connect'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
