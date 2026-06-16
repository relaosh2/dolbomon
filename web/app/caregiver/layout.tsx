'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  HeartIcon, 
  CalendarDaysIcon, 
  ClipboardDocumentListIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  HeartIcon as HeartSolid, 
  CalendarDaysIcon as CalendarDaysSolid, 
  ClipboardDocumentListIcon as ClipboardDocumentListSolid, 
  UserIcon as UserSolid 
} from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide bottom nav on login page only
  const isHideNav = pathname === '/caregiver/login';

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      {!isHideNav && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <HeartIcon className="w-6 h-6 text-rose-500" />
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              돌봄온 3.0
            </span>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full border border-slate-200">
            보호자 운영비서
          </span>
        </header>
      )}

      {/* Main Content Area */}
      <div className={`flex-grow ${!isHideNav ? 'pt-14 pb-20' : ''}`}>
        {children}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!isHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-50 pb-safe shadow-lg">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            {/* 1. 홈 */}
            <Link href="/caregiver" className="flex flex-col items-center justify-center w-1/5 py-1">
              {pathname === '/caregiver' ? (
                <HomeSolid className="w-6 h-6 text-indigo-600 animate-in zoom-in duration-300" />
              ) : (
                <HomeIcon className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
              )}
              <span className={`text-[10px] mt-1 font-bold ${pathname === '/caregiver' ? 'text-indigo-600' : 'text-slate-400'}`}>홈</span>
            </Link>

            {/* 2. 우리부모 */}
            <Link href="/caregiver/parent" className="flex flex-col items-center justify-center w-1/5 py-1">
              {pathname === '/caregiver/parent' ? (
                <HeartSolid className="w-6 h-6 text-rose-500 animate-in zoom-in duration-300" />
              ) : (
                <HeartIcon className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
              )}
              <span className={`text-[10px] mt-1 font-bold ${pathname === '/caregiver/parent' ? 'text-rose-500' : 'text-slate-400'}`}>우리부모</span>
            </Link>

            {/* 3. 일정 */}
            <Link href="/caregiver/schedule" className="flex flex-col items-center justify-center w-1/5 py-1">
              {pathname === '/caregiver/schedule' ? (
                <CalendarDaysSolid className="w-6 h-6 text-amber-500 animate-in zoom-in duration-300" />
              ) : (
                <CalendarDaysIcon className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
              )}
              <span className={`text-[10px] mt-1 font-bold ${pathname === '/caregiver/schedule' ? 'text-amber-500' : 'text-slate-400'}`}>일정</span>
            </Link>

            {/* 4. 기록 */}
            <Link href="/caregiver/records" className="flex flex-col items-center justify-center w-1/5 py-1">
              {pathname === '/caregiver/records' ? (
                <ClipboardDocumentListSolid className="w-6 h-6 text-emerald-600 animate-in zoom-in duration-300" />
              ) : (
                <ClipboardDocumentListIcon className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
              )}
              <span className={`text-[10px] mt-1 font-bold ${pathname === '/caregiver/records' ? 'text-emerald-600' : 'text-slate-400'}`}>기록</span>
            </Link>

            {/* 5. 나 */}
            <Link href="/caregiver/me" className="flex flex-col items-center justify-center w-1/5 py-1">
              {pathname === '/caregiver/me' ? (
                <UserSolid className="w-6 h-6 text-indigo-500 animate-in zoom-in duration-300" />
              ) : (
                <UserIcon className="w-6 h-6 text-slate-400 hover:text-slate-600 transition-colors" />
              )}
              <span className={`text-[10px] mt-1 font-bold ${pathname === '/caregiver/me' ? 'text-indigo-500' : 'text-slate-400'}`}>나</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
