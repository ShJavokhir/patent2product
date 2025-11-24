'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFutureMode } from '@/lib/FutureModeContext'
import { Sparkles, Zap, Cpu, Activity } from 'lucide-react'

export function FutureModeIndicator() {
  const { isFutureMode } = useFutureMode()

  return (
    <AnimatePresence>
      {isFutureMode && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="fixed top-24 right-6 z-40 flex flex-col items-end gap-2"
        >
          {/* Main Identity Disc / Status Monitor */}
          <div className="relative group cursor-default">
            {/* Rotating Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-[-4px] rounded-full border border-dashed border-cyan-500/20 animate-[spin_10s_linear_infinite_reverse]" />
            
            {/* Glow Backdrop */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />

            <div className="relative flex items-center gap-3 px-5 py-3 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.3)] overflow-hidden">
              
              {/* Scanning Bar Effect inside badge */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 relative">
                <Cpu className="w-4 h-4 text-cyan-400 animate-[pulse_2s_infinite]" />
                <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20" />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-cyan-400/70 leading-none tracking-widest uppercase">
                  System Online
                </span>
                <span className="text-sm font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 animate-text-shimmer drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                  FUTURE MODE
                </span>
              </div>

              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f3ff] animate-pulse" />
            </div>
          </div>

          {/* Decorative Data Lines */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-end gap-1 pr-4"
          >
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-mono text-cyan-600">SYS.V.2.0</span>
               <div className="w-16 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-mono text-cyan-600">RENDER.OK</span>
               <div className="w-10 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
