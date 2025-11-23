import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-glass-100 backdrop-blur-xl
        border border-emerald-900/10
        rounded-ios-lg shadow-xl
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:scale-[1.01] hover:bg-glass-200 hover:shadow-2xl hover:border-emerald-900/20 hover:shadow-emerald-500/10 group' : ''}
        ${className}
      `}
    >
      {/* Subtle Inner Highlight */}
      <div className="absolute inset-0 border border-emerald-900/5 rounded-ios-lg pointer-events-none"></div>

      {/* Inner Glow on Hover */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-emerald-900/5 via-transparent to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
};

export default GlassCard;
