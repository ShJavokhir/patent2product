'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import { WarpBackground } from "@/components/ui/warp-background";
import { Card, CardContent } from "@/components/ui/card";
import { useFutureMode } from '@/lib/FutureModeContext';
import { cn } from '@/lib/utils';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { isFutureMode } = useFutureMode();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <WarpBackground 
      className="min-h-screen w-full p-0 border-none rounded-none"
      gridColor={isFutureMode ? "rgba(0, 243, 255, 0.2)" : undefined}
      beamColor={isFutureMode ? "linear-gradient(to bottom, rgba(0, 243, 255, 0.8), transparent)" : undefined}
    >
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <Card className={cn(
          "max-w-4xl w-full backdrop-blur-sm shadow-xl transition-colors duration-300",
          isFutureMode 
            ? "bg-slate-900/20 border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.1)]" 
            : "bg-white/90 border-slate-200/50"
        )}>
          <CardContent className="text-center space-y-10 animate-fade-in p-12">
            {/* Hero Text */}
            <h1 className={cn(
              "text-5xl md:text-8xl font-display font-bold tracking-tighter drop-shadow-sm",
              isFutureMode ? "text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "text-slate-900"
            )}>
              See the <span className={cn(
                "text-transparent bg-clip-text",
                isFutureMode 
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" 
                  : "bg-linear-to-r from-emerald-600 to-teal-600"
              )}>Future.</span> <br />
              Before It Ships.
            </h1>

            <p className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light",
              isFutureMode ? "text-cyan-100/80 font-mono" : "text-slate-600"
            )}>
                Transform patent drawings into photorealistic product renderings. Visualize unreleased technology from Apple, Tesla, Meta, and beyond—instantly.
            </p>
            
            {/* Search Section */}
            <div className="flex justify-center pt-8 w-full">
                <div className="w-full max-w-2xl transform transition-transform hover:scale-[1.01] duration-300">
                    <SearchInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onSearch={handleSearch}
                        large
                        placeholder="Search patents (e.g., 'AR glasses', 'flying car', 'humanoid robot')"
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-3 pt-4 opacity-70">
                {['Consumer Electronics', 'Automotive', 'Aerospace', 'Wearables', 'Robotics'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => {
                            setQuery(tag);
                        }}
                        className={cn(
                            "text-xs font-medium px-4 py-2 rounded-full border transition-all active:scale-95",
                            isFutureMode
                              ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50 hover:border-cyan-400"
                              : "border-slate-300 text-slate-500 hover:bg-emerald-100/50 hover:border-emerald-300 hover:text-emerald-700"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </WarpBackground>
  );
}
