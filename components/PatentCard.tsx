import React from 'react';
import { Patent } from '../lib/types';
import GlassCard from './GlassCard';
import { ArrowRight, Cpu, TrendingUp } from 'lucide-react';

interface PatentCardProps {
  patent: Patent;
}

const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  return (
    <GlassCard hoverEffect className="flex flex-col h-full p-8 group/card">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide">
          {patent.patentNumber}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            patent.viabilityScore > 80
                ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
        }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {patent.viabilityScore}% Viability
        </div>
      </div>

      <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight group-hover/card:text-emerald-200 transition-colors">
        {patent.title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
        {patent.summary}
      </p>

      {/* Product Box */}
      <div className="space-y-5">
        <div className="p-5 rounded-2xl bg-[#0B0D14] border border-white/5 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            Concept
          </div>
          <p className="text-white text-lg font-medium">{patent.productIdea}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {patent.tags.map(tag => (
                <span key={tag} className="text-xs font-medium text-gray-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                    #{tag}
                </span>
            ))}
        </div>

        {/* Action Button */}
        <button className="w-full mt-2 group/btn flex items-center justify-center gap-2 py-3.5 bg-white text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all active:scale-[0.98]">
          <span>Prototype This</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </GlassCard>
  );
};

export default PatentCard;
