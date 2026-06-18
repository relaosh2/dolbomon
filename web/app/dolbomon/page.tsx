'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// 홈 — 심플하게. 3가지만.
// ─────────────────────────────────────────────────────────────

const todos = [
  { id: '1', text: '충남대병원 진료 14:00', type: 'hospital', urgent: true },
  { id: '2', text: '고혈압약 수령', type: 'medicine', urgent: false },
  { id: '3', text: '장기요양 갱신일 확인', type: 'admin', urgent: false },
];

const recentRecords = [
  { date: '06.14', title: '신경과 정기진료', tag: '진료' },
  { date: '06.14', title: '아리셉트 처방', tag: '약' },
  { date: '06.03', title: '급여명세서 수령', tag: '서류' },
];

export default function Home() {
  const [done, setDone] = useState<string[]>([]);

  const toggle = (id: string) =>
    setDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-4">

      {/* ── 인사 ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400">{today}</p>
          <h1 className="text-[17px] font-black text-slate-900 mt-0.5">오늘도 수고하세요 🌿</h1>
        </div>
        <Link href="/dolbomon/me">
          <div className="w-10 h-10 rounded-full border-2 border-red-200 flex items-center justify-center bg-red-50">
            <span className="text-[10px] font-black text-red-500">주의</span>
          </div>
        </Link>
      </div>

      {/* ── 보호자 상태 ── */}
      <Link href="/dolbomon/me">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-[10px] text-slate-400 font-medium mb-3">내 상태</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '수면', value: '5.5h', bad: true },
              { label: '피로', value: '높음',  bad: true },
              { label: '스트레스', value: '높음', bad: true },
            ].map(s => (
              <div key={s.label} className="text-center py-2.5 rounded-xl"
                style={{ background: '#FEF2F2' }}>
                <p className="text-sm font-black" style={{ color: '#EF4444' }}>{s.value}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2.5 text-center">탭하여 자세히 보기 →</p>
        </div>
      </Link>

      {/* ── 오늘 일정 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
          <p className="text-xs font-bold text-slate-900">오늘 할 일</p>
          <span className="text-[10px] text-slate-400">{done.length}/{todos.length}</span>
        </div>
        {todos.map(t => (
          <button key={t.id} onClick={() => toggle(t.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 text-left">
            {/* 체크 */}
            <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={done.includes(t.id)
                ? { background: '#4F46E5', borderColor: '#4F46E5' }
                : { borderColor: t.urgent ? '#EF4444' : '#E2E8F0' }}>
              {done.includes(t.id) && (
                <svg viewBox="0 0 10 8" width="10" height="8" fill="none" stroke="white" strokeWidth={2.2}>
                  <polyline points="1,4 3.5,6.5 9,1"/>
                </svg>
              )}
            </div>
            <span className={`text-[12px] font-medium flex-1 ${done.includes(t.id) ? 'line-through text-slate-300' : 'text-slate-800'}`}>
              {t.text}
            </span>
            {t.urgent && !done.includes(t.id) && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: '#FEF2F2', color: '#EF4444' }}>오늘</span>
            )}
          </button>
        ))}
        <div className="px-4 py-2.5">
          <Link href="/dolbomon/schedule"
            className="text-[11px] font-semibold" style={{ color: '#4F46E5' }}>
            전체 일정 →
          </Link>
        </div>
      </div>

      {/* ── 최근 기록 ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
          <p className="text-xs font-bold text-slate-900">최근 기록</p>
          <Link href="/dolbomon/records"
            className="text-[10px] font-semibold" style={{ color: '#14B8A6' }}>전체 보기</Link>
        </div>
        {recentRecords.map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0">
            <span className="text-[10px] text-slate-300 w-8 flex-shrink-0">{r.date}</span>
            <p className="text-[11px] text-slate-700 flex-1">{r.title}</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-500">
              {r.tag}
            </span>
          </div>
        ))}
      </div>

      {/* ── 자가진단 배너 ── */}
      <Link href="/dolbomon/calculator">
        <div className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: '#EEF2FF' }}>
          <div>
            <p className="text-xs font-bold" style={{ color: '#4F46E5' }}>장기요양 예상등급 자가진단</p>
            <p className="text-[10px] text-slate-400 mt-0.5">※ 참고용 · 실제 등급은 건보공단 기준</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: '#4F46E5' }}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="white" strokeWidth={2}>
              <polyline points="6,4 10,8 6,12"/>
            </svg>
          </div>
        </div>
      </Link>

    </div>
  );
}
