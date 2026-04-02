'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Globe, Layout, Code2, Eye, CheckCircle2, 
  ExternalLink, Rocket, ArrowRight,
  Clock, MessageSquare, ShieldCheck
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

interface WebProject {
  id: string
  project_type: string
  status: string
  preview_url?: string
  live_url?: string
  notes?: string
}

const steps = ['kickoff', 'design', 'development', 'review', 'client_approval', 'launched']

export default function WebProjectsPage() {
  const t = useTranslations('MyWebsite')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [projects, setProjects] = useState<WebProject[]>([])
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full"
      />
    </div>
  )

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white mb-2 tracking-tight"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 font-medium"
          >
            {t('sub')}
          </motion.p>
        </div>
      </div>

      {projects.length > 0 ? (
        <StaggerContainer className="space-y-8">
          {projects.map(proj => {
            const currentIdx = steps.indexOf(proj.status)
            
            return (
              <StaggerItem key={proj.id} className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative bg-[#ffffff]/[0.02] border border-white/[0.08] rounded-[40px] p-8 md:p-10 backdrop-blur-2xl shadow-2xl transition-all duration-500 group-hover:bg-white/[0.04]">
                  
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5 group-hover:scale-110 transition-transform duration-500">
                        <Globe size={28} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">
                          {proj.project_type.replace('_', ' ')}
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                          {t('project_id', { id: proj.id.substring(0, 6) })}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      {proj.preview_url && proj.status !== 'launched' && (
                        <motion.a 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={proj.preview_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 lg:flex-none px-6 py-3 bg-[#ffffff]/[0.03] border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-500/5 rounded-2xl text-xs font-black text-white/60 hover:text-purple-400 transition-all flex items-center justify-center gap-3"
                        >
                          <Layout size={16} /> {t('figma')}
                        </motion.a>
                      )}
                      {proj.live_url && proj.status === 'launched' && (
                        <motion.a 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={proj.live_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 lg:flex-none px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
                        >
                          <Rocket size={16} /> {t('live')}
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* High Performance Stepper */}
                  <div className="relative pt-8 pb-12 px-4">
                    <div className="absolute top-[52px] left-[40px] right-[40px] h-[2px] bg-white/[0.05]" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="absolute top-[52px] left-[40px] h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                    />
                    
                    <div className="relative flex justify-between gap-2">
                      {steps.map((step, idx) => {
                        const isCompleted = idx < currentIdx || proj.status === 'launched'
                        const isActive = idx === currentIdx
                        
                        return (
                          <div key={step} className="flex flex-col items-center gap-6 group/step">
                            <motion.div 
                              initial={false}
                              animate={{ 
                                scale: isActive ? 1.2 : 1,
                                backgroundColor: isCompleted ? '#2563eb' : isActive ? '#1e1e1e' : '#1a1a1a',
                                borderColor: isCompleted ? '#2563eb' : isActive ? '#2563eb' : 'rgba(255,255,255,0.1)'
                              }}
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-500 ${isActive ? 'shadow-[0_0_20px_rgba(37,99,235,0.3)]' : ''}`}
                            >
                              <AnimatePresence mode="wait">
                                {isCompleted ? (
                                  <motion.div
                                    key="check"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                  >
                                    <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="dot"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isActive ? 1 : 0.5 }}
                                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/20'}`}
                                  />
                                )}
                              </AnimatePresence>
                            </motion.div>
                            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-blue-500' : isCompleted ? 'text-white/60' : 'text-white/20'}`}>
                              {t(`steps.${step}`)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {proj.notes && (
                    <FadeIn delay={0.3}>
                      <div className="mt-8 flex gap-4 p-6 bg-white/[0.03] border-l-4 border-blue-500 rounded-2xl group-hover:bg-white/[0.05] transition-colors">
                        <MessageSquare size={18} className="text-blue-500 flex-shrink-0" />
                        <p className="text-sm font-bold text-white/50 leading-relaxed italic">
                          "{proj.notes}"
                        </p>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      ) : (
        <ScaleIn>
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative bg-[#ffffff]/[0.02] border border-white/[0.05] rounded-[48px] p-20 backdrop-blur-xl text-center shadow-2xl transition-all duration-500 group-hover:bg-white/[0.03]">
              <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
                <Globe size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{t('empty.title')}</h2>
              <p className="text-lg text-white/30 font-medium max-w-lg mx-auto leading-relaxed mb-10">
                {t('empty.description')}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-white/5 hover:bg-white/90 transition-all"
              >
                Start Your Project
              </motion.button>
            </div>
          </div>
        </ScaleIn>
      )}
    </div>
  )
}
