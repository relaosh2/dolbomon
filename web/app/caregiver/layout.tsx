'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Nav tab definition
type NavTab = {
  href: string;
  label: string;
  emoji: string;
  activeColor: string;
  matchPaths?: string[];
};

const NAV_TABS: NavTab[] = [
  {
    href: '/caregiver',
    label: '돌봄시작',
    emoji: '🌱',
    activeColor: 'text-emerald-600',
    matchPaths: ['/caregiver', '/caregiver/calculator'],
  },
  {
    href: '/caregiver/find',
    label: '돌봄찾기',
    emoji: '🔍',
    activeColor: 'text-blue-600',
    matchPaths: ['/caregiver/find'],
  },
  {
    href: '/caregiver/family',
    label: '가족돌봄방',
    emoji: '👨‍👩‍👧',
    activeColor: 'text-rose-500',
    matchPaths: ['/caregiver/family', '/caregiver/parent', '/caregiver/schedule'],
  },
  {
    href: '/caregiver/records',
    label: '돌봄기록',
    emoji: '📋',
    activeColor: 'text-amber-600',
    matchPaths: ['/caregiver/records', '/caregiver/me'],
  },
  {
    href: '/caregiver/benefits',
    label: '돌봄혜택',
    emoji: '💰',
    activeColor: 'text-indigo-600',
    matchPaths: ['/caregiver/benefits'],
  },
];

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHideNav = pathname === '/caregiver/login';

  const isActive = (tab: NavTab) => {
    if (tab.matchPaths) return tab.matchPaths.some(p => pathname === p);
    return pathname === tab.href;
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      {!isHideNav && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-4 justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600">
              돌봄온
            </span>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              BETA
            </span>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-200">
            처음 돌봄부터 끝까지
          </span>
        </header>
      )}

      {/* Main Content Area */}
      <div className={`flex-grow ${!isHideNav ? 'pt-14 pb-20' : ''}`}>
        {children}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!isHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-slate-200/80 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
            {NAV_TABS.map((tab) => {
              const active = isActive(tab);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex flex-col items-center justify-center w-1/5 py-1.5 rounded-xl transition-all duration-200 ${
                    active ? 'scale-105' : 'scale-100 opacity-70 hover:opacity-90'
                  }`}
                >
                  <span className={`text-xl leading-none mb-0.5 transition-all duration-200 ${active ? 'scale-110' : ''}`}>
                    {tab.emoji}
                  </span>
                  <span className={`text-[9px] font-extrabold mt-0.5 tracking-tight transition-colors duration-200 ${
                    active ? tab.activeColor : 'text-slate-400'
                  }`}>
                    {tab.label}
                  </span>
                  {active && (
                    <div className={`w-1 h-1 rounded-full mt-0.5 ${tab.activeColor.replace('text-', 'bg-')}`} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
