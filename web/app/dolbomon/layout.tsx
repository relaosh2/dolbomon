'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const INDIGO = '#4F46E5';
const GREY   = '#9CA3AF';

// ── 아이콘 (28px, strokeWidth 1.6) ──
function IcoHome({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11L12 4L21 11V20C21 20.6 20.6 21 20 21H15V16C15 15.4 14.6 15 14 15H10C9.4 15 9 15.4 9 16V21H4C3.4 21 3 20.6 3 20V11Z"/>
    </svg>
  );
}

function IcoCalendar({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="3" x2="8" y2="7"/>
      <line x1="16" y1="3" x2="16" y2="7"/>
      <polyline points="8.5,14.5 11,17 15.5,12"/>
    </svg>
  );
}

function IcoRecord({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6C5.4 3 5 3.4 5 4V20C5 20.6 5.4 21 6 21H18C18.6 21 19 20.6 19 20V8L14 3Z"/>
      <polyline points="14,3 14,8 19,8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );
}

function IcoPerson({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4.5 21C4.5 17.1 7.9 14 12 14C16.1 14 19.5 17.1 19.5 21"/>
    </svg>
  );
}

const TABS = [
  { href: '/dolbomon',          label: '홈',   matches: ['/dolbomon', '/dolbomon/calculator', '/dolbomon/benefits'] },
  { href: '/dolbomon/schedule', label: '일정', matches: ['/dolbomon/schedule'] },
  { href: '/dolbomon/parent',   label: '돌봄ON', matches: ['/dolbomon/parent'], center: true },
  { href: '/dolbomon/records',  label: '기록', matches: ['/dolbomon/records'] },
  { href: '/dolbomon/me',       label: '보호자', matches: ['/dolbomon/me'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (matches: string[]) => matches.some(m => path === m);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* 헤더 */}
      <header className="fixed top-0 inset-x-0 h-14 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: INDIGO }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none"
              stroke="white" strokeWidth={2.2} strokeLinecap="round">
              <path d="M10 10C8.5 8 6.8 7 5.2 7C3.3 7 2 8.3 2 10C2 11.7 3.3 13 5.2 13C6.8 13 8.5 12 10 10Z"/>
              <path d="M10 10C11.5 8 13.2 7 14.8 7C16.7 7 18 8.3 18 10C18 11.7 16.7 13 14.8 13C13.2 13 11.5 12 10 10Z"/>
            </svg>
          </div>
          <span className="font-black text-[16px] text-slate-900 tracking-tight">돌봄ON</span>
        </div>
        <span className="text-[10px] text-slate-400">보호자를 위한 돌봄 관리</span>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 pt-14 pb-20">{children}</main>

      {/* 하단 탭 */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-100">
        <div className="flex items-center justify-around h-[62px] max-w-lg mx-auto">
          {TABS.map(tab => {
            const on = active(tab.matches);

            if (tab.center) {
              return (
                <Link key={tab.href} href={tab.href}
                  className="flex flex-col items-center gap-0.5 -mt-3">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
                    style={{
                      background: INDIGO,
                      boxShadow: '0 4px 14px rgba(79,70,229,0.45)',
                    }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
                      stroke="white" strokeWidth={2.2} strokeLinecap="round">
                      <path d="M12 12C10.4 9.8 8.4 8.4 6.4 8.4C3.9 8.4 2 10.1 2 12C2 13.9 3.9 15.6 6.4 15.6C8.4 15.6 10.4 14.2 12 12Z"/>
                      <path d="M12 12C13.6 9.8 15.6 8.4 17.6 8.4C20.1 8.4 22 10.1 22 12C22 13.9 20.1 15.6 17.6 15.6C15.6 15.6 13.6 14.2 12 12Z"/>
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: INDIGO }}>{tab.label}</span>
                </Link>
              );
            }

            return (
              <Link key={tab.href} href={tab.href}
                className="flex flex-col items-center gap-1 pt-1 w-[64px]"
                style={{ opacity: on ? 1 : 0.45 }}>
                {tab.href === '/dolbomon'          && <IcoHome     on={on} />}
                {tab.href === '/dolbomon/schedule' && <IcoCalendar on={on} />}
                {tab.href === '/dolbomon/records'  && <IcoRecord   on={on} />}
                {tab.href === '/dolbomon/me'       && <IcoPerson   on={on} />}
                <span className="text-[9px] font-semibold leading-none"
                  style={{ color: on ? INDIGO : GREY }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
