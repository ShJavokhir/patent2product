'use client'

import React from 'react';
import { useFutureMode } from '@/lib/FutureModeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  const { isFutureMode } = useFutureMode();

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-300 ease-out
        ${isFutureMode
          ? 'bg-slate-900/40 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.05)]'
          : 'bg-glass-100 backdrop-blur-xl border border-emerald-900/10 rounded-ios-lg shadow-xl'
        }
        ${hoverEffect
          ? isFutureMode
            ? 'hover:scale-[1.01] hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:border-cyan-500/60 group'
            : 'hover:scale-[1.01] hover:bg-glass-200 hover:shadow-2xl hover:border-emerald-900/20 hover:shadow-emerald-500/10 group'
          : ''
        }
        ${className}
      `}
      style={isFutureMode ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
    >
      {/* TRON DECORATIONS */}
      {isFutureMode && (
        <>
          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-10" />
          
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-10" />
          
          {/* Scanline Vertical - animated */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
             <div className="h-full w-1 bg-cyan-400/50 blur-sm absolute top-0 animate-[scanline_3s_linear_infinite]" style={{ left: '20%' }}></div>
          </div>

          {/* Technical Grid Background specific to card */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(0deg,transparent_24%,rgba(0,243,255,0.3)_25%,rgba(0,243,255,0.3)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.3)_75%,rgba(0,243,255,0.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(0,243,255,0.3)_25%,rgba(0,243,255,0.3)_26%,transparent_27%,transparent_74%,rgba(0,243,255,0.3)_75%,rgba(0,243,255,0.3)_76%,transparent_77%,transparent)] bg-[length:30px_30px]" />
        </>
      )}

      {/* Subtle Inner Highlight (Standard Mode) */}
      {!isFutureMode && (
        <div className="absolute inset-0 border rounded-ios-lg pointer-events-none transition-colors border-emerald-900/5"></div>
      )}

      {/* Inner Glow on Hover */}
      {hoverEffect && (
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isFutureMode
            ? 'bg-gradient-to-tr from-cyan-500/10 via-purple-500/5 to-transparent'
            : 'bg-gradient-to-tr from-emerald-900/5 via-transparent to-transparent'
        }`} />
      )}

      {/* Future Mode: Animated Border Glow */}
      {isFutureMode && hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 animate-pulse" />
        </div>
      )}

      <div className="relative z-0 h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
