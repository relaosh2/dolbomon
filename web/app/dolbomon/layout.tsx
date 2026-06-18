'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// 🎨 돌봄온 아이콘 시스템
// 기준: 32px 표시 / 24×24 viewBox / strokeWidth 1.8 / round caps
// 메인컬러: #6C63FF (Violet) · #1A1D3B (Deep Navy) · #A0A7B8 (Grey)
// ─────────────────────────────────────────────────────────────

const VIOLET = '#6C63FF';
const GREY = '#A0A7B8';

const BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// 🏠 홈 아이콘 — 집 형태, 문 포함
function IcoHome({ active }: { active: boolean }) {
  const c = active ? VIOLET : GREY;
  return (
    <svg {...BASE} width="28" height="28" stroke={c}>
      <path d="M3 11L12 4L21 11V20C21 20.6 20.6 21 20 21H15V16C15 15.4 14.6 15 14 15H10C9.4 15 9 15.4 9 16V21H4C3.4 21 3 20.6 3 20V11Z" />
    </svg>
  );
}

// 📅 일정 아이콘 — 캘린더 + 체크
function IcoCalendar({ active }: { active: boolean }) {
  const c = active ? VIOLET : GREY;
  return (
    <svg {...BASE} width="28" height="28" stroke={c}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
      {/* 체크 마크 */}
      <polyline points="8.5,14.5 10.8,16.8 15.5,12" />
    </svg>
  );
}

// ♾️ 돌봄온 인피니티 로고 (흰색 — 바이올렛 원 위에 사용)
function IcoInfinity() {
  return (
    <svg viewBox="0 0 28 28" fill="none" width="28" height="28" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {/* 왼쪽 루프 */}
      <path d="M14 14C12.1 11.2 9.8 9.5 7.5 9.5C4.5 9.5 2 11.5 2 14C2 16.5 4.5 18.5 7.5 18.5C9.8 18.5 12.1 16.8 14 14Z" />
      {/* 오른쪽 루프 */}
      <path d="M14 14C15.9 11.2 18.2 9.5 20.5 9.5C23.5 9.5 26 11.5 26 14C26 16.5 23.5 18.5 20.5 18.5C18.2 18.5 15.9 16.8 14 14Z" />
    </svg>
  );
}

// 📋 기록 아이콘 — 문서 + 가로줄
function IcoDocument({ active }: { active: boolean }) {
  const c = active ? VIOLET : GREY;
  return (
    <svg {...BASE} width="28" height="28" stroke={c}>
      <path d="M14 3H6C5.4 3 5 3.4 5 4V20C5 20.6 5.4 21 6 21H18C18.6 21 19 20.6 19 20V8L14 3Z" />
      <polyline points="14,3 14,8 19,8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="16.5" x2="13" y2="16.5" />
    </svg>
  );
}

// 👤 보호자 아이콘 — 사람 실루엣
function IcoPerson({ active }: { active: boolean }) {
  const c = active ? VIOLET : GREY;
  return (
    <svg {...BASE} width="28" height="28" stroke={c}>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4 21C4 17.2 7.6 14.2 12 14.2C16.4 14.2 20 17.2 20 21" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 레이아웃
// ─────────────────────────────────────────────────────────────

type Tab = {
  href: string;
  label: string;
  matchPaths: string[];
  isCenter?: boolean;
};

const TABS: Tab[] = [
  { href: '/dolbomon', label: '홈', matchPaths: ['/dolbomon', '/dolbomon/benefits', '/dolbomon/calculator'] },
  { href: '/dolbomon/schedule', label: '일정', matchPaths: ['/dolbomon/schedule'] },
  { href: '/dolbomon/hub', label: '돌봄온', matchPaths: ['/dolbomon/hub', '/dolbomon/parent', '/dolbomon/find', '/dolbomon/family'], isCenter: true },
  { href: '/dolbomon/records', label: '기록', matchPaths: ['/dolbomon/records'] },
  { href: '/dolbomon/me', label: '보호자', matchPaths: ['/dolbomon/me'] },
];

export default function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHideNav = pathname === '/dolbomon/login';

  const isActive = (tab: Tab) => tab.matchPaths.some(p => pathname === p);

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col">

      {/* ── 앱 헤더 ── */}
      {!isHideNav && (
        <header
          className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 justify-between"
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(108,99,255,0.08)', boxShadow: '0 1px 12px rgba(108,99,255,0.06)' }}
        >
          {/* 로고 */}
          <div className="flex items-center gap-2">
            {/* 인피니티 로고마크 */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #8B83FF)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12C10.4 9.6 8.4 8 6.2 8C3.5 8 1.5 9.8 1.5 12C1.5 14.2 3.5 16 6.2 16C8.4 16 10.4 14.4 12 12Z" />
                <path d="M12 12C13.6 9.6 15.6 8 17.8 8C20.5 8 22.5 9.8 22.5 12C22.5 14.2 20.5 16 17.8 16C15.6 16 13.6 14.4 12 12Z" />
              </svg>
            </div>
            <span
              className="text-[17px] font-black tracking-tight"
              style={{ color: '#1A1D3B', letterSpacing: '-0.5px' }}
            >
              돌봄온
            </span>
          </div>
          <span
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border"
            style={{ color: '#6C63FF', background: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.15)' }}
          >
            보호자 생존 플랫폼
          </span>
        </header>
      )}

      {/* ── 콘텐츠 영역 ── */}
      <div className={`flex-grow ${!isHideNav ? 'pt-14 pb-24' : ''}`}>
        {children}
      </div>

      {/* ── 하단 탭바 ── */}
      {!isHideNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(108,99,255,0.08)', boxShadow: '0 -4px 24px rgba(26,29,59,0.06)' }}
        >
          <div className="flex justify-around items-end h-[72px] max-w-lg mx-auto px-2 pb-2">
            {TABS.map((tab) => {
              const active = isActive(tab);

              // ── 센터 탭 (돌봄온 인피니티) ──
              if (tab.isCenter) {
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="flex flex-col items-center justify-end pb-1 w-1/5 relative"
                  >
                    {/* 떠있는 원형 버튼 */}
                    <div
                      className="flex items-center justify-center rounded-full transition-transform duration-200 active:scale-95"
                      style={{
                        width: 56,
                        height: 56,
                        background: active
                          ? 'linear-gradient(135deg, #5A52E8, #6C63FF)'
                          : 'linear-gradient(135deg, #6C63FF, #8B83FF)',
                        boxShadow: '0 4px 20px rgba(108,99,255,0.45)',
                        marginBottom: 2,
                      }}
                    >
                      <IcoInfinity />
                    </div>
                    <span
                      className="text-[9px] font-extrabold mt-0.5"
                      style={{ color: VIOLET }}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              }

              // ── 일반 탭 ──
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex flex-col items-center justify-end pb-1 w-1/5 gap-0.5 transition-all duration-150"
                  style={{ opacity: active ? 1 : 0.65 }}
                >
                  {tab.href === '/dolbomon' && <IcoHome active={active} />}
                  {tab.href === '/dolbomon/schedule' && <IcoCalendar active={active} />}
                  {tab.href === '/dolbomon/records' && <IcoDocument active={active} />}
                  {tab.href === '/dolbomon/me' && <IcoPerson active={active} />}

                  <span
                    className="text-[9px] font-extrabold"
                    style={{ color: active ? VIOLET : GREY }}
                  >
                    {tab.label}
                  </span>

                  {/* 활성 인디케이터 점 */}
                  <div
                    className="w-1 h-1 rounded-full transition-all duration-200"
                    style={{ background: active ? VIOLET : 'transparent' }}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
