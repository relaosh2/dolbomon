'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type NavTab = {
  href: string;
  label: string;
  emoji: string;
  activeColor: string;
  matchPaths: string[];
};

const NAV_TABS: NavTab[] = [
  {
    href: '/caregiver',
    label: '홈',
    emoji: '🏠',
    activeColor: 'text-indigo-600',
    matchPaths: ['/caregiver', '/caregiver/calculator', '/caregiver/benefits'],
  },
  {
    href: '/caregiver/parent',
    label: '부모',
    emoji: '👴',
    activeColor: 'text-rose-500',
    matchPaths: ['/caregiver/parent'],
  },
  {
    href: '/caregiver/schedule',
    label: '일정',
    emoji: '📅',
    activeColor: 'text-amber-600',
    matchPaths: ['/caregiver/schedule'],
  },
  {
    href: '/caregiver/records',
    label: '기록',
    emoji: '📋',
    activeColor: 'text-emerald-600',
    matchPaths: ['/caregiver/records'],
  },
  {
    href: '/caregiver/me',
    label: '나',
    emoji: '🫀',
    activeColor: 'text-purple-600',
    matchPaths: ['/caregiver/me'],
  },
];

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHideNav = pathname === '/caregiver/login';

  const isActive = (tab: NavTab) =>
    tab.matchPaths.some(p => pathname === p);

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      {!isHideNav && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-4 justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌿</span>
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
              돌봄온
            </span>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
            보호자 생존 플랫폼
          </span>
        </header>
      )}

      {/* Main Content */}
      <div className={`flex-grow ${!isHideNav ? 'pt-14 pb-20' : ''}`}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {!isHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-slate-100 z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
            {NAV_TABS.map((tab) => {
              const active = isActive(tab);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex flex-col items-center justify-center w-1/5 py-1 rounded-xl transition-all duration-150 ${
                    active ? 'scale-105' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <span className={`text-[22px] leading-none transition-transform duration-150 ${active ? 'scale-110' : ''}`}>
                    {tab.emoji}
                  </span>
                  <span className={`text-[9px] font-extrabold mt-0.5 tracking-tight ${active ? tab.activeColor : 'text-slate-400'}`}>
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
