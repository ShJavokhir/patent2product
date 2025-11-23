'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Patent } from '../lib/types';
import GlassCard from './GlassCard';
import { ArrowRight, Cpu, TrendingUp } from 'lucide-react';

interface PatentCardProps {
  patent: Patent;
}

const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  const router = useRouter();

  const handlePrototype = () => {
    router.push(`/prototype/${patent.id}`);
  };

  return (
    <GlassCard hoverEffect className="flex flex-col h-full p-8 group/card">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="bg-slate-200/50 border border-slate-300/50 text-slate-600 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide">
          {patent.patentNumber}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            patent.viabilityScore > 80
                ? 'text-emerald-700 bg-emerald-100/50 border border-emerald-200'
                : 'text-amber-700 bg-amber-100/50 border border-amber-200'
        }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {patent.viabilityScore}% Viability
        </div>
      </div>

      <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 leading-tight group-hover/card:text-emerald-700 transition-colors">
        {patent.title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
        {patent.summary}
      </p>

      {/* Product Box */}
      <div className="space-y-5">
        <div className="p-5 rounded-2xl bg-white/50 border border-emerald-900/5 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Concept
          </div>
          <p className="text-slate-800 text-lg font-medium">{patent.productIdea}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {patent.tags.map(tag => (
                <span key={tag} className="text-xs font-medium text-slate-500 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                    #{tag}
                </span>
            ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handlePrototype}
          className="w-full mt-2 group/btn flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <span>Prototype This</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </GlassCard>
  );
};

export default PatentCard;
