'use client';

import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 👨‍👩‍👧 가족 돌봄방 — 일정분담 + 정산장부 + 자녀효도미션
// 가족돌봄OS의 킬러기능을 흡수·개선
// ─────────────────────────────────────────────────────────────

type TabType = 'schedule' | 'expense' | 'mission';

type FamilyMember = { id: string; name: string; emoji: string; role: string };
type CareEvent = { id: string; title: string; date: string; assignee: string; done: boolean };
type Expense = { id: string; title: string; amount: number; payer: string; date: string; settled: boolean };
type Mission = { id: string; title: string; emoji: string; points: number; completedBy: string | null; targetChild: string };

const FAMILY: FamilyMember[] = [
  { id: 'u1', name: '대장님(나)', emoji: '👑', role: '주보호자' },
  { id: 'u2', name: '첫째 오빠', emoji: '👨', role: '가족' },
  { id: 'u3', name: '막내 동생', emoji: '🧑', role: '가족' },
];

const INIT_EVENTS: CareEvent[] = [
  { id: 'e1', title: '충남대병원 치매안심센터 정기검진', date: '6월 24일 (수) 14:00', assignee: '대장님(나)', done: false },
  { id: 'e2', title: '을지대병원 혈압약 처방', date: '6월 29일 (월) 10:30', assignee: '첫째 오빠', done: false },
  { id: 'e3', title: '방문요양 비용 정산 확인', date: '6월 30일 (월)', assignee: '막내 동생', done: true },
];

const INIT_EXPENSES: Expense[] = [
  { id: 'x1', title: '어머님 치매약 3개월치', amount: 300000, payer: '첫째 오빠', date: '6월 10일', settled: false },
  { id: 'x2', title: '방문요양비 6월분', amount: 450000, payer: '대장님(나)', date: '6월 1일', settled: true },
];

const INIT_MISSIONS: Mission[] = [
  { id: 'm1', title: '할머니께 전화 드리기 (10분 이상)', emoji: '📞', points: 100, completedBy: null, targetChild: '어린이' },
  { id: 'm2', title: '할머니와 함께 산책하기', emoji: '🚶', points: 200, completedBy: '우리집 어린이', targetChild: '어린이' },
  { id: 'm3', title: '할머니 방 청소 도와드리기', emoji: '🧹', points: 150, completedBy: null, targetChild: '어린이' },
  { id: 'm4', title: '할머니께 편지 쓰기', emoji: '✉️', points: 120, completedBy: null, targetChild: '어린이' },
];

const POINTS_TO_WON = 10; // 100포인트 = 1,000원

export default function FamilyRoomPage() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [events, setEvents] = useState<CareEvent[]>(INIT_EVENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INIT_EXPENSES);
  const [missions, setMissions] = useState<Mission[]>(INIT_MISSIONS);
  const [showSettleConfirm, setShowSettleConfirm] = useState<string | null>(null);

  const totalPoints = missions.filter(m => m.completedBy).reduce((a, m) => a + m.points, 0);
  const totalWon = totalPoints * POINTS_TO_WON;
  const unsettledTotal = expenses.filter(e => !e.settled).reduce((a, e) => a + e.amount, 0);
  const myShare = Math.round(unsettledTotal / FAMILY.length);

  const toggleEventDone = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, done: !e.done } : e));
  };

  const handleSettleExpense = (id: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, settled: true } : e));
    setShowSettleConfirm(null);
    alert('정산 완료 처리되었습니다! 가족 채팅방에 알림이 전송됩니다.');
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completedBy: '우리집 어린이' } : m));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── Family Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>👨‍👩‍👧</span>
              <span>김씨네 가족 돌봄방</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {FAMILY.map(f => f.name).join(' · ')} 참여 중
            </p>
          </div>
          <div className="flex -space-x-1.5">
            {FAMILY.map(f => (
              <div key={f.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-rose-100 border-2 border-white flex items-center justify-center text-sm">
                {f.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
          {([
            { key: 'schedule', label: '일정 분담', emoji: '📅' },
            { key: 'expense', label: '정산 장부', emoji: '💳' },
            { key: 'mission', label: '자녀효도 미션', emoji: '⭐' },
          ] as { key: TabType; label: string; emoji: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-[10px] font-extrabold rounded-xl transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-8 space-y-3">

        {/* ── 일정 분담 ── */}
        {activeTab === 'schedule' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700">이번 달 돌봄 일정</span>
              <button className="text-[10px] bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <PlusIcon className="w-3 h-3" />
                일정 추가
              </button>
            </div>

            {/* 역할 불균형 알림 */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-rose-500 text-base">⚠️</span>
                <div>
                  <h4 className="text-xs font-extrabold text-rose-800">가족 역할 불균형 감지</h4>
                  <p className="text-[10px] text-rose-700 mt-0.5 font-medium">
                    최근 30일간 <strong>대장님</strong>의 병원 동행 및 비용 부담 비율이 70%입니다.
                    형제들에게 분담 알림을 보내드릴까요?
                  </p>
                  <button
                    onClick={() => alert('첫째 오빠, 막내 동생에게 카카오톡 알림이 전송됩니다!')}
                    className="mt-2 text-[10px] bg-rose-600 text-white font-bold px-3 py-1 rounded-lg"
                  >
                    📨 알림 발송하기
                  </button>
                </div>
              </div>
            </div>

            {events.map(ev => (
              <div
                key={ev.id}
                className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${ev.done ? 'border-slate-100 opacity-60' : 'border-slate-100'}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleEventDone(ev.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      ev.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                    }`}
                  >
                    {ev.done && <CheckIcon className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-grow">
                    <p className={`text-xs font-extrabold ${ev.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {ev.title}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">📅 {ev.date}</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                        {ev.assignee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 정산 장부 ── */}
        {activeTab === 'expense' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5">
              <div className="text-[10px] text-slate-400 font-bold mb-1">미정산 총액</div>
              <div className="text-3xl font-black">{unsettledTotal.toLocaleString()}<span className="text-lg text-slate-400 ml-1">원</span></div>
              <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-[11px]">
                <span className="text-slate-400">나의 1/N 부담분</span>
                <span className="font-extrabold text-amber-400">{myShare.toLocaleString()}원</span>
              </div>
            </div>

            {expenses.map(ex => (
              <div key={ex.id} className={`bg-white rounded-2xl border p-4 shadow-sm ${ex.settled ? 'border-slate-100 opacity-60' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold mb-0.5">{ex.date} 결제</div>
                    <h4 className="text-xs font-extrabold text-slate-900">{ex.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">결제자: <span className="font-bold text-slate-600">{ex.payer}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 line-through">{ex.amount.toLocaleString()}원</div>
                    {!ex.settled && (
                      <div className="text-sm font-extrabold text-indigo-600">
                        {Math.round(ex.amount / FAMILY.length).toLocaleString()}원
                      </div>
                    )}
                  </div>
                </div>

                {ex.settled ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] font-bold">
                    <CheckIcon className="w-4 h-4" />
                    정산 완료
                  </div>
                ) : (
                  <div className="flex gap-2 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => setShowSettleConfirm(ex.id)}
                      className="flex-1 py-2 bg-[#0050FF] text-white text-[11px] font-extrabold rounded-xl hover:opacity-90"
                    >
                      토스로 {Math.round(ex.amount / FAMILY.length).toLocaleString()}원 송금
                    </button>
                    <button
                      onClick={() => handleSettleExpense(ex.id)}
                      className="flex-1 py-2 bg-slate-100 text-slate-700 text-[11px] font-extrabold rounded-xl hover:bg-slate-200"
                    >
                      계좌이체 완료
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 자녀효도 미션 (킬러기능) ── */}
        {activeTab === 'mission' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {/* Point Summary */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-2xl p-5 text-center">
              <div className="text-[10px] font-extrabold mb-1">우리 아이 적립 포인트</div>
              <div className="text-3xl font-black">{totalPoints.toLocaleString()}<span className="text-base ml-1 font-bold">P</span></div>
              <div className="text-sm font-extrabold mt-1">≈ 현금 {totalWon.toLocaleString()}원</div>
              <button
                onClick={() => alert('포인트를 용돈으로 교환 신청이 완료되었습니다! (시뮬레이션)')}
                className="mt-3 bg-slate-900 text-white text-[11px] font-extrabold px-4 py-2 rounded-xl"
              >
                💰 용돈으로 교환하기
              </button>
            </div>

            {/* 미션 설명 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                ⭐ 아이가 할머니 할아버지 미션을 완료하면<br />
                <span className="text-amber-600">포인트가 쌓여 용돈으로 교환</span>됩니다.<br />
                아이의 경제교육과 조부모 연결을 한번에!
              </p>
            </div>

            {/* 미션 목록 */}
            {missions.map(m => (
              <div
                key={m.id}
                className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${
                  m.completedBy ? 'border-amber-100 bg-amber-50/30' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-grow">
                    <p className={`text-xs font-extrabold ${m.completedBy ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {m.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-extrabold px-2 py-0.5 rounded-full">
                        +{m.points}P
                      </span>
                      {m.completedBy && (
                        <span className="text-[10px] text-emerald-600 font-bold">✓ 완료</span>
                      )}
                    </div>
                  </div>
                  {!m.completedBy && (
                    <button
                      onClick={() => completeMission(m.id)}
                      className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-3 py-1.5 rounded-lg hover:bg-amber-500 transition-all whitespace-nowrap"
                    >
                      완료 인증
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button className="w-full py-3 border-2 border-dashed border-amber-300 text-amber-600 text-xs font-extrabold rounded-2xl hover:bg-amber-50 transition-all flex items-center justify-center gap-1.5">
              <PlusIcon className="w-4 h-4" />
              새 미션 추가하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
