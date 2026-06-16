'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CalculatorIcon, SparklesIcon, UserGroupIcon, GiftIcon } from '@heroicons/react/24/outline';
import { CalculatorIcon as CalculatorSolid, SparklesIcon as SparklesSolid, UserGroupIcon as UserGroupSolid, GiftIcon as GiftSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // hide bottom nav on login page only
  const isHideNav = pathname === '/caregiver/login';

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Main Content Area */}
      <div className="">
        {children}
      </div>

      {/* Mobile Top Navigation Bar - Appears right under the main header on small screens */}
      {!isHideNav && (
        <div className="fixed top-16 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-[100] px-2 py-1 md:hidden shadow-sm">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <Link href="/caregiver" className="flex flex-col items-center space-y-1 w-1/4 py-2">
              {pathname === '/caregiver' ? <CalculatorSolid className="w-7 h-7 text-rose-500" /> : <CalculatorIcon className="w-7 h-7 text-slate-400" />}
              <span className={`text-[10px] font-extrabold ${pathname === '/caregiver' ? 'text-rose-500' : 'text-slate-500'}`}>계산기</span>
            </Link>
            
            <Link href="/caregiver/mission" className="flex flex-col items-center space-y-1 w-1/4 py-2">
              {pathname === '/caregiver/mission' ? <SparklesSolid className="w-7 h-7 text-amber-500" /> : <SparklesIcon className="w-7 h-7 text-slate-400" />}
              <span className={`text-[10px] font-extrabold ${pathname === '/caregiver/mission' ? 'text-amber-500' : 'text-slate-500'}`}>자녀효도</span>
            </Link>

            <Link href="/caregiver/os" className="flex flex-col items-center space-y-1 w-1/4 py-2">
              {pathname === '/caregiver/os' ? <UserGroupSolid className="w-7 h-7 text-indigo-500" /> : <UserGroupIcon className="w-7 h-7 text-slate-400" />}
              <span className={`text-[10px] font-extrabold ${pathname === '/caregiver/os' ? 'text-indigo-500' : 'text-slate-500'}`}>가족돌봄</span>
            </Link>

            <Link href="/caregiver/donate" className="flex flex-col items-center space-y-1 w-1/4 py-2">
              {pathname === '/caregiver/donate' ? <GiftSolid className="w-7 h-7 text-emerald-500" /> : <GiftIcon className="w-7 h-7 text-slate-400" />}
              <span className={`text-[10px] font-extrabold ${pathname === '/caregiver/donate' ? 'text-emerald-500' : 'text-slate-500'}`}>커피응원</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
