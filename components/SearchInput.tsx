'use client';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  loading?: boolean;
  placeholder?: string;
  large?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  loading = false,
  placeholder = "Search for patents...",
  large = false
}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`relative group w-full ${large ? 'max-w-2xl' : 'max-w-md'}`}>
      {/* Glow Effect behind */}
      <div className={`
        absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-green-500/50 
        ${large ? 'rounded-2xl' : 'rounded-xl'} 
        opacity-0 group-focus-within:opacity-100 transition duration-500 blur-lg
      `}></div>

      <div className={`
        relative flex items-center bg-white/70 backdrop-blur-xl border transition-all duration-300
        ${large ? 'rounded-2xl py-1.5' : 'rounded-xl py-1'}
        border-emerald-900/10 group-focus-within:border-emerald-500/30 group-focus-within:bg-white group-focus-within:shadow-2xl
      `}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none
            ${large ? 'py-4 pl-6 pr-16 text-lg' : 'py-2 pl-4 pr-12 text-sm'}
            font-light tracking-wide
          `}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className={`
            absolute top-1/2 -translate-y-1/2
            flex items-center justify-center
            text-emerald-600
            transition-all duration-200
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:text-emerald-500 hover:bg-emerald-500/10
            ${large ? 'right-2 w-10 h-10 rounded-xl' : 'right-1 w-8 h-8 rounded-lg'}
          `}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
