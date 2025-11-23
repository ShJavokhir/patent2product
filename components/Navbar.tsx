'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Boxes, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const getLinkClass = (path: string) =>
    `px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
      pathname === path
        ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)]'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

    return (
      <div>
        
      </div>
    );
  // return (
  //   <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
  //     <div className="pointer-events-auto flex items-center gap-2 p-2 bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-ios-lg shadow-2xl ring-1 ring-white/5">

  //       {/* Logo Area */}
  //       <div className="flex items-center gap-2 pl-4 pr-6 border-r border-white/10">
  //         <div className="relative flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-xl border border-blue-500/30">
  //           <Zap className="w-4 h-4 text-blue-400" />
  //         </div>
  //         <span className="font-display font-bold text-lg tracking-tight text-white">
  //           patent2product
  //         </span>
  //       </div>

  //       {/* Links */}
  //       <div className="flex items-center gap-1">
  //         <Link href="/" className={getLinkClass('/')}>
  //           Search
  //         </Link>
  //         <Link href="/components" className={getLinkClass('/components')}>
  //           System
  //         </Link>
  //       </div>

  //       {/* Extra Action */}
  //       <div className="hidden sm:block pl-2 pr-2">
  //           <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 transition-all active:scale-95 text-gray-400">
  //               <Boxes className="w-4 h-4" />
  //           </button>
  //       </div>
  //     </div>
  //   </nav>
  // );
};

export default Navbar;
