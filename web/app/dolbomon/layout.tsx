'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const INDIGO = '#5B3DF5';
const GREY   = '#9CA3AF';

// ── 아이콘 (30px, strokeWidth 1.6) ──
function IcoHome({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11L12 4L21 11V20C21 20.6 20.6 21 20 21H15V16C15 15.4 14.6 15 14 15H10C9.4 15 9 15.4 9 16V21H4C3.4 21 3 20.6 3 20V11Z"/>
    </svg>
  );
}

function IcoCalendar({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
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
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
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
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
      stroke={on ? INDIGO : GREY} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4.5 21C4.5 17.1 7.9 14 12 14C16.1 14 19.5 17.1 19.5 21"/>
    </svg>
  );
}

const TABS = [
  { href: '/dolbomon',          label: '홈',   matches: ['/dolbomon', '/dolbomon/calculator', '/dolbomon/benefits'] },
  { href: '/dolbomon/schedule', label: '일정', matches: ['/dolbomon/schedule'] },
  { href: '/dolbomon/parent',   label: '돌봄온', matches: ['/dolbomon/parent'], center: true },
  { href: '/dolbomon/records',  label: '기록', matches: ['/dolbomon/records'] },
  { href: '/dolbomon/me',       label: '보호자', matches: ['/dolbomon/me'] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const active = (matches: string[]) => matches.some(m => path === m);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-5 pb-2"
        style={{
          height: 'calc(88px + env(safe-area-inset-top, 24px))',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 24px))'
        }}>
        <div className="flex items-center gap-2">
          <Link href="/dolbomon" className="cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
            <img src="/logo.svg" alt="돌봄온" className="h-[70px] w-auto object-contain" />
          </Link>
        </div>
        <span className="text-[15px] font-medium text-[#5B3DF5] bg-[#5B3DF5]/5 px-3 py-1.5 rounded-full tracking-tight select-none">
          보호자를 위한 돌봄 운영체제
        </span>
      </header>

      {/* 콘텐츠 영역 (하단 안전여백 확보를 위해 pb-32로 확장) */}
      <main className="flex-1 pb-32"
        style={{ paddingTop: 'calc(88px + env(safe-area-inset-top, 24px))' }}>{children}</main>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-100"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex items-center justify-around h-[62px] max-w-lg mx-auto">
          {TABS.map(tab => {
            const on = active(tab.matches);

            if (tab.center) {
              return (
                <Link key={tab.href} href={tab.href}
                  className="flex flex-col items-center gap-0.5 -mt-3 w-[64px]">
                  <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #5B3DF5 0%, #A78BFA 100%)',
                      boxShadow: '0 4px 12px rgba(91,61,245,0.35)',
                    }}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                      stroke="white" strokeWidth={2.6} strokeLinecap="round">
                      <path d="M12 12C10.4 9.8 8.4 8.4 6.4 8.4C3.9 8.4 2 10.1 2 12C2 13.9 3.9 15.6 6.4 15.6C8.4 15.6 10.4 14.2 12 12Z"/>
                      <path d="M12 12C13.6 9.8 15.6 8.4 17.6 8.4C20.1 8.4 22 10.1 22 12C22 13.9 20.1 15.6 17.6 15.6C15.6 15.6 13.6 14.2 12 12Z"/>
                      <circle cx="19.5" cy="5.0" r="2.0" fill="white" stroke="none" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: INDIGO }}>{tab.label}</span>
                </Link>
              );
            }

            return (
              <Link key={tab.href} href={tab.href}
                className="flex flex-col items-center gap-0.5 w-[64px]"
                style={{ opacity: on ? 1 : 0.45 }}>
                {tab.href === '/dolbomon'          && <IcoHome     on={on} />}
                {tab.href === '/dolbomon/schedule' && <IcoCalendar on={on} />}
                {tab.href === '/dolbomon/records'  && <IcoRecord   on={on} />}
                {tab.href === '/dolbomon/me'       && <IcoPerson   on={on} />}
                <span className="text-[9px] font-semibold"
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
