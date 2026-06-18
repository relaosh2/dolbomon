'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 🏠 홈 — 보호자 중심 대시보드
// 핵심 카피: "오늘 부모보다 당신은 괜찮으신가요?"
// ─────────────────────────────────────────────────────────────

type Todo = { id: string; text: string; done: boolean; type: 'hospital' | 'medicine' | 'admin' };

const SAMPLE_TODOS: Todo[] = [
  { id: '1', text: '충남대병원 정기진료 (14:00)', done: false, type: 'hospital' },
  { id: '2', text: '고혈압약 처방전 수령', done: false, type: 'medicine' },
  { id: '3', text: '장기요양 인정서 갱신일 확인', done: false, type: 'admin' },
];

const SAMPLE_RECORDS = [
  { date: '2026.06.14', text: '충남대병원 치매안심센터 정기 방문', type: '검사' },
  { date: '2026.06.10', text: '고혈압약 을지대병원 처방', type: '진료' },
  { date: '2026.06.03', text: '장기요양 급여명세서 수령 및 보관', type: '서류' },
];

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>(SAMPLE_TODOS);

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const typeIcon = (type: Todo['type']) =>
    ({ hospital: '🏥', medicine: '💊', admin: '📄' })[type];

  const recordTypeColor = (type: string) => ({
    '검사': 'bg-amber-50 text-amber-700 border-amber-100',
    '진료': 'bg-blue-50 text-blue-700 border-blue-100',
    '서류': 'bg-slate-100 text-slate-600 border-slate-200',
  }[type] ?? 'bg-slate-100 text-slate-600');

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto">

      {/* ── Hero: 보호자에게 먼저 말 걸기 ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-5 pt-7 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <span className="inline-block text-indigo-300/80 text-[10px] font-extrabold tracking-widest uppercase mb-3">
            Today's Check-in
          </span>
          <h1 className="text-[22px] font-black text-white leading-snug mb-2">
            오늘 부모보다<br />
            <span className="text-purple-300">당신은 괜찮으신가요?</span>
          </h1>
          <p className="text-xs text-indigo-200/80 font-medium leading-relaxed">
            부모를 돌보다 무너지지 않도록, 돌봄온이 돕습니다.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 space-y-3 pb-8">

        {/* ── 카드 1: 장기요양 예상등급 자가진단 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-extrabold text-rose-100 uppercase tracking-wide">유입 자가진단</p>
                <h2 className="text-sm font-black text-white mt-0.5">우리 부모님, 장기요양 대상일까요?</h2>
              </div>
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] text-slate-400 font-semibold mb-3 leading-relaxed">
              ※ 본 결과는 <strong>참고용 자가진단</strong>이며 실제 등급은 국민건강보험공단 심사를 통해 결정됩니다.
            </p>
            <Link
              href="/dolbomon/calculator"
              className="w-full flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all active:scale-[0.98]"
            >
              예상등급 자가진단 시작 <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── 카드 2: 지원금 확인 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
              💰
            </div>
            <div className="flex-grow">
              <p className="text-xs font-extrabold text-slate-800">놓치고 있는 지원금을 확인하세요</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">기초연금 · 장기요양급여 · 치매안심센터 무료서비스</p>
            </div>
            <Link href="/dolbomon/benefits">
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
            </Link>
          </div>
        </div>

        {/* ── 카드 3: 오늘 해야 할 일 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>✅</span>
              <span>오늘 해야 할 일</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">
              {todos.filter(t => t.done).length}/{todos.length} 완료
            </span>
          </div>
          <div className="space-y-2">
            {todos.map(todo => (
              <button
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                  todo.done
                    ? 'bg-slate-50 border-slate-100 opacity-50'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  todo.done ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                }`}>
                  {todo.done && <span className="text-[9px] text-white font-black">✓</span>}
                </div>
                <span className="text-[10px]">{typeIcon(todo.type)}</span>
                <span className={`text-[11px] font-bold flex-grow ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {todo.text}
                </span>
              </button>
            ))}
          </div>
          <Link href="/dolbomon/schedule" className="flex items-center justify-center gap-1 mt-3 text-[10px] text-indigo-500 font-extrabold">
            전체 일정 보기 →
          </Link>
        </div>

        {/* ── 카드 4: 보호자 상태 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>🫀</span>
              <span>보호자 상태</span>
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full font-extrabold">
              주의
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: '수면', value: '5.5h', status: 'warn' },
              { label: '피로도', value: '높음', status: 'danger' },
              { label: '스트레스', value: '75%', status: 'danger' },
            ].map(item => (
              <div key={item.label} className={`text-center p-2 rounded-xl border ${
                item.status === 'danger'
                  ? 'bg-rose-50 border-rose-100'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <div className={`text-sm font-black ${item.status === 'danger' ? 'text-rose-700' : 'text-amber-700'}`}>
                  {item.value}
                </div>
                <div className="text-[9px] text-slate-500 font-bold">{item.label}</div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            💡 이번 주 돌봄 업무가 많았습니다. 가족에게 도움을 요청해보세요.
          </p>

          <Link href="/dolbomon/me" className="flex items-center justify-center gap-1 mt-3 text-[10px] text-purple-500 font-extrabold">
            내 상태 자세히 확인하기 →
          </Link>
        </div>

        {/* ── 카드 5: 최근 돌봄 기록 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span>
              <span>최근 돌봄 기록</span>
            </h3>
          </div>
          <div className="space-y-2.5">
            {SAMPLE_RECORDS.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1 h-full bg-indigo-200 rounded-full mt-0.5 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-slate-400 font-bold">{r.date}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold ${recordTypeColor(r.type)}`}>{r.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-semibold">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dolbomon/records" className="flex items-center justify-center gap-1 mt-3 text-[10px] text-emerald-600 font-extrabold">
            전체 기록 보기 →
          </Link>
        </div>

        {/* ── 스토리라인 ── */}
        <div className="text-center py-4 border-t border-slate-100">
          <p className="text-[11px] font-extrabold text-indigo-700 leading-relaxed px-2">
            "부모 돌봄, 혼자 머리에 담지 마세요.<br />
            일정·기록·지원금·보호자 상태를 한 곳에."
          </p>
          <p className="text-[9px] text-slate-400 mt-2">© 2026 돌봄온. 보호자를 위한 플랫폼.</p>
        </div>
      </div>
    </div>
  );
}
