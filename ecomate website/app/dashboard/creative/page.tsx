'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Clapperboard, FolderOpen, Play, CheckCircle2, 
  ExternalLink, Video, FileText, ArrowRight,
  Clock, MessageSquare, AlertCircle
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/animations'

const steps = ['briefing', 'filming', 'editing', 'delivered']

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1] as any
    }
  })
}

export default function CreativePage() {
  const t = useTranslations('Creative')
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

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'in_production': return 1 // filming
      case 'in_review': return 2    // editing
      case 'revision': return 2      // editing
      case 'delivered': return 3     // delivered
      default: return 0              // briefing
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Clapperboard className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                {t('title')} <span className="text-blue-500">.</span>
              </h1>
            </div>
            <p className="text-white/50 font-medium text-sm ml-12">
              {t('sub')}
            </p>
          </div>
          
          {profile?.drive_folder_url && (
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={profile.drive_folder_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3.5 bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 hover:bg-blue-500/10 rounded-2xl transition-all duration-300"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <FolderOpen className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-black text-white/80 group-hover:text-white transition-colors uppercase tracking-widest">
                {t('drive')}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-400 transition-all ml-1" />
            </motion.a>
          )}
        </div>
      </FadeIn>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 animate-pulse" />
          </div>
          <p className="text-white/40 font-black text-xs uppercase tracking-[0.2em] animate-pulse">
            {t('loading')}
          </p>
        </div>
      ) : projects.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 gap-8">
          {projects.map((proj, i) => {
            const currentIdx = getStepIndex(proj.status)
            
            return (
              <StaggerItem key={proj.id}>
                <motion.div 
                  custom={i}
                  variants={cardVariants as any}
                  className="group relative overflow-hidden bg-[#ffffff]/[0.02] border border-white/[0.08] rounded-[2.5rem] p-10 hover:bg-[#ffffff]/[0.04] hover:border-blue-500/30 transition-all duration-500"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-700" />
                  
                  <div className="relative flex flex-col lg:flex-row gap-12">
                    {/* Project Info */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            Project #{proj.id.slice(0, 4)}
                          </span>
                          <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest italic">
                            <Clock className="w-3 h-3" />
                            {new Date(proj.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-blue-500 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xl font-medium">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        {proj.drive_link && (
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={proj.drive_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-6 py-3 bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-3 uppercase tracking-widest"
                          >
                            <Play className="fill-current" size={14} /> {t('deliverables')}
                          </motion.a>
                        )}
                        <button 
                          className="px-6 py-3 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 rounded-2xl text-xs font-black text-white/40 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest"
                        >
                          <Video size={16} /> Details
                        </button>
                      </div>
                    </div>

                    {/* Stepper Pipeline */}
                    <div className="flex-1">
                      <div className="relative pt-4 pb-12">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.05] -translate-y-1/2" />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                          transition={{ duration: 1, ease: "circOut", delay: 0.5 }}
                          className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 -translate-y-1/2 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
                        />

                        <div className="relative flex justify-between z-20">
                          {steps.map((step, idx) => {
                            const isCompleted = idx < currentIdx || proj.status === 'delivered'
                            const isActive = idx === currentIdx
                            
                            return (
                              <div key={step} className="flex flex-col items-center gap-4">
                                <motion.div 
                                  initial={false}
                                  animate={{ 
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isCompleted ? '#3b82f6' : isActive ? '#1e293b' : '#0f172a',
                                    borderColor: isCompleted || isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)'
                                  }}
                                  className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-colors duration-500 ${isActive ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  ) : (
                                    <span className={`text-xs font-black ${isActive ? 'text-blue-500' : 'text-white/20'}`}>
                                      0{idx + 1}
                                    </span>
                                  )}
                                </motion.div>
                                <span className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-500 ${isActive ? 'text-blue-400' : isCompleted ? 'text-white/60' : 'text-white/20'}`}>
                                  {t(`steps.${step}`)}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revision Notes */}
                  <AnimatePresence>
                    {proj.revision_notes && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                        className="bg-amber-500/[0.03] border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden group/revision"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40" />
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-amber-500/10 rounded-xl mt-1">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                              {t('revision')}
                              <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1.5 h-1.5 rounded-full bg-amber-500" 
                              />
                            </div>
                            <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                              "{proj.revision_notes}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      ) : (
        <ScaleIn>
          <div className="relative overflow-hidden bg-[#ffffff]/[0.02] border border-white/[0.08] rounded-[3rem] p-16 text-center group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full opacity-50" />
            
            <div className="relative space-y-8">
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center p-6 shadow-2xl shadow-blue-500/20"
              >
                <Clapperboard className="w-full h-full text-white" />
              </motion.div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-white italic tracking-tight">
                  {t('empty.title')}
                </h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  {t('empty.description')}
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://docs.google.com/forms/d/e/mock-brief-form', '_blank')}
                className="inline-flex items-center gap-3 px-10 py-4.5 bg-blue-500 text-white rounded-[2rem] text-sm font-black transition-all group/btn uppercase tracking-[0.2em]"
              >
                <FileText className="w-4 h-4" />
                {t('empty.btn')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </ScaleIn>
      )}
    </div>
  )
}
