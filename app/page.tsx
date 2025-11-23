'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Etheral Shadow Background */}
      <div className="absolute inset-0 z-0">
        <EtheralShadow
          color="rgba(16, 185, 129, 0.6)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-10 animate-fade-in">
          {/* Hero Text */}
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-white drop-shadow-2xl">
            From <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Patent</span> <br />
            to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">Product.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Discover hidden gems in patent databases and visualize their commercial potential instantly using generative intelligence.
          </p>

          {/* Search Section */}
          <div className="flex justify-center pt-8 w-full">
              <div className="w-full max-w-2xl transform transition-transform hover:scale-[1.01] duration-300">
                  <SearchInput
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onSearch={handleSearch}
                      large
                      placeholder="Search patents (e.g., 'Solid state batteries')"
                  />
              </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 opacity-70">
              {['Biotech', 'Robotics', 'Clean Energy', 'AI', 'Nanotech'].map(tag => (
                  <button
                      key={tag}
                      onClick={() => {
                          setQuery(tag);
                      }}
                      className="text-xs font-medium px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white active:scale-95"
                  >
                      {tag}
                  </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
