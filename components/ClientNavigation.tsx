'use client';

import dynamic from 'next/dynamic';

// Dynamically import Navigation with no SSR to prevent hydration issues
const Navigation = dynamic(() => import('./navigation').then(mod => ({ default: mod.Navigation })), {
  ssr: false,
  loading: () => (
    <nav className="bg-[#090909] py-4 px-6 lg:px-8 border-b border-[#202020]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-end gap-2">
          <div className="h-8 w-24 bg-[#202020] rounded animate-pulse" />
          <span className="bg-[#D78E59] text-[#171717] px-2 py-1 rounded text-xs font-semibold">Beta</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-[#202020] rounded animate-pulse" />
          <div className="w-32 h-8 bg-[#202020] rounded animate-pulse" />
        </div>
      </div>
    </nav>
  ),
});

export { Navigation as ClientNavigation };