import React from 'react';
import GlassCard from '@/components/GlassCard';
import { MOCK_PATENTS } from '@/lib/constants';
import PatentCard from '@/components/PatentCard';
import { Activity, Aperture, Cast } from 'lucide-react';

export default function Components() {
  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-20 animate-fade-in">

      <div className="space-y-6">
        <h1 className="text-5xl font-display font-bold text-white">Design System</h1>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            A comprehensive look at the &quot;Patent2Product&quot; visual identity.
            Featuring robust glassmorphism, deep gradients, and iOS-inspired geometry.
        </p>
      </div>

      {/* Colors Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-200 mb-8 flex items-center gap-3">
            <Aperture className="w-6 h-6 text-blue-400" />
            Color Palette & Textures
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <GlassCard className="p-8">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 mb-6 shadow-lg"></div>
                <h3 className="text-xl text-white font-bold mb-1">Primary Gradient</h3>
                <p className="text-sm text-gray-500">Used for highlights and accents.</p>
            </GlassCard>
            <GlassCard className="p-8">
                <div className="h-32 rounded-2xl bg-[#0B0D14] border border-white/10 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5"></div>
                </div>
                <h3 className="text-xl text-white font-bold mb-1">Robust Surface</h3>
                <p className="text-sm text-gray-500">Deep slate with 5% white overlay.</p>
            </GlassCard>
            <GlassCard className="p-8">
                <div className="h-32 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 mb-6 shadow-lg"></div>
                <h3 className="text-xl text-white font-bold mb-1">Success State</h3>
                <p className="text-sm text-gray-500">Emerald tones for high viability scores.</p>
            </GlassCard>
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-200 mb-8 flex items-center gap-3">
            <Cast className="w-6 h-6 text-purple-400" />
            Typography
        </h2>
        <GlassCard className="p-10 space-y-8">
            <div className="space-y-4 border-b border-white/5 pb-8">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Font (Space Grotesk)</span>
                <h1 className="text-6xl font-display font-bold text-white tracking-tight">The Quick Brown Fox</h1>
            </div>
            <div className="space-y-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Body Font (Inter)</span>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                    Jumps over the lazy dog. This typography system is designed for maximum readability while maintaining a futuristic, technical aesthetic suitable for patent data.
                </p>
            </div>
        </GlassCard>
      </section>

      {/* Components Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-200 mb-8 flex items-center gap-3">
            <Activity className="w-6 h-6 text-pink-400" />
            Interactive Components
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-10">

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Input Fields</h3>
                    <div className="p-8 border border-white/5 rounded-ios-lg bg-black/20 backdrop-blur-md">
                        {/* Visual representation of input states */}
                        <div className="space-y-6">
                            <input type="text" placeholder="Default state" className="w-full bg-[#0F111A] border border-white/10 rounded-full p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                            <div className="relative">
                                <input type="text" value="Focused Active State" readOnly className="w-full bg-[#161b2c] border border-white/20 rounded-full p-4 text-white focus:outline-none shadow-xl" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Buttons</h3>
                    <div className="flex flex-col gap-6 p-8 border border-white/5 rounded-ios-lg bg-black/20 backdrop-blur-md">
                        <button className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all active:scale-95">
                            Primary Solid Action
                        </button>
                        <div className="flex gap-4">
                             <button className="flex-1 py-3 bg-white/10 text-white font-semibold border border-white/10 rounded-xl hover:bg-white/20 transition-all active:scale-95">
                                Glass Button
                            </button>
                            <button className="flex-1 py-3 bg-transparent border border-white/10 text-gray-300 font-medium rounded-xl hover:border-white/30 hover:text-white transition-all active:scale-95">
                                Outline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Card Component</h3>
                <div className="h-full">
                    <PatentCard patent={MOCK_PATENTS[0]} />
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}
