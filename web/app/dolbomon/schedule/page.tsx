'use client';

import React, { useState } from 'react';
import { PlusIcon, XMarkIcon, BellIcon, CheckIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 📅 일정 — 놓치지 않는 돌봄 일정
// 완료 체크 시 자동으로 기록 타임라인에 남김
// ─────────────────────────────────────────────────────────────

type EventType = 'hospital' | 'medicine' | 'test' | 'renewal' | 'visit' | 'other';
type EventStatus = 'pending' | 'done';

type CareEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: EventType;
  status: EventStatus;
  repeat?: string;
  alarm: boolean;
  memo?: string;
};

const TYPE_META: Record<EventType, { label: string; emoji: string; color: string }> = {
  hospital: { label: '병원', emoji: '🏥', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  medicine: { label: '약수령', emoji: '💊', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  test: { label: '검사', emoji: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  renewal: { label: '갱신', emoji: '📋', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  visit: { label: '방문', emoji: '🚗', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  other: { label: '기타', emoji: '📌', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const INIT_EVENTS: CareEvent[] = [
  { id: '1', title: '충남대병원 신경과 정기진료', date: '2026-06-24', time: '14:00', type: 'hospital', status: 'pending', repeat: '3개월', alarm: true, memo: '보호자 동행 필요 / 주차증 챙기기' },
  { id: '2', title: '고혈압약 처방전 수령', date: '2026-06-26', time: '10:00', type: 'medicine', status: 'pending', alarm: true },
  { id: '3', title: '인지기능 검사 예약', date: '2026-06-28', time: '13:30', type: 'test', status: 'pending', alarm: true },
  { id: '4', title: '장기요양 인정서 갱신일 확인', date: '2026-08-01', type: 'renewal', status: 'pending', alarm: false, memo: '국민건강보험공단 1577-1000' },
];

const groupByWeek = (events: CareEvent[]) => {
  const thisWeek: CareEvent[] = [];
  const upcoming: CareEvent[] = [];

  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d <= weekEnd) thisWeek.push(ev);
    else upcoming.push(ev);
  });

  return { thisWeek, upcoming };
};

export default function SchedulePage() {
  const [events, setEvents] = useState<CareEvent[]>(INIT_EVENTS);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<EventType>('hospital');
  const [newAlarm, setNewAlarm] = useState(true);
  const [newMemo, setNewMemo] = useState('');

  const pendingEvents = events.filter(e =>
    e.status === 'pending' && (filterType === 'all' || e.type === filterType)
  );
  const doneEvents = events.filter(e => e.status === 'done');
  const { thisWeek, upcoming } = groupByWeek(pendingEvents);

  const handleComplete = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'done' } : e));
    // 실제 구현 시 여기서 기록 타임라인에도 자동 추가
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    const newEv: CareEvent = {
      id: Date.now().toString(), title: newTitle, date: newDate,
      type: newType, status: 'pending', alarm: newAlarm, memo: newMemo,
    };
    setEvents(prev => [...prev, newEv]);
    setNewTitle(''); setNewDate(''); setNewMemo(''); setShowAdd(false);
  };

  const EventCard = ({ ev }: { ev: CareEvent }) => {
    const meta = TYPE_META[ev.type];
    const dateObj = new Date(ev.date);
    const dDay = Math.ceil((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-4 shadow-sm transition-all ${
        ev.status === 'done' ? 'opacity-50' : ''
      }`}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0 mt-0.5">{meta.emoji}</div>
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold mr-1.5 ${meta.color}`}>
                  {meta.label}
                </span>
                {dDay >= 0 && dDay <= 3 && (
                  <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">
                    D-{dDay === 0 ? 'Day' : dDay}
                  </span>
                )}
              </div>
              {ev.alarm && (
                <BellIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              )}
            </div>
            <h4 className={`text-xs font-extrabold mb-1 ${ev.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {ev.title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
              <span>📅 {new Date(ev.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
              {ev.time && <span>⏰ {ev.time}</span>}
              {ev.repeat && <span className="text-indigo-500">🔄 {ev.repeat}마다</span>}
            </div>
            {ev.memo && (
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium bg-slate-50 rounded-lg px-2 py-1">
                💬 {ev.memo}
              </p>
            )}
          </div>
          <button
            onClick={() => handleComplete(ev.id)}
            className="w-7 h-7 rounded-full border-2 border-slate-200 flex items-center justify-center flex-shrink-0 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            title="완료 처리 (기록에 자동 저장)"
          >
            <CheckIcon className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-5 pb-4 sticky top-14 z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">일정 관리</p>
            <h1 className="text-sm font-black text-slate-900">놓치지 않는 돌봄 일정</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl"
          >
            <PlusIcon className="w-4 h-4" /> 일정 추가
          </button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', ...Object.keys(TYPE_META)] as (EventType | 'all')[]).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex-shrink-0 ${
                filterType === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type === 'all' ? '전체' : `${TYPE_META[type as EventType].emoji} ${TYPE_META[type as EventType].label}`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 pb-8">

        {/* 완료 시 기록 자동 저장 안내 */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <span className="text-sm">✅</span>
          <p className="text-[10px] text-indigo-700 font-bold">일정 완료 체크 시 기록 타임라인에 자동으로 저장됩니다.</p>
        </div>

        {/* 이번 주 일정 */}
        {thisWeek.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-rose-400 rounded-full" />
              이번 주 ({thisWeek.length}건)
            </h3>
            <div className="space-y-2.5">
              {thisWeek.map(ev => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}

        {/* 다가오는 일정 */}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-300 rounded-full" />
              다가오는 일정 ({upcoming.length}건)
            </h3>
            <div className="space-y-2.5">
              {upcoming.map(ev => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}

        {/* 완료된 일정 */}
        {doneEvents.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CheckIcon className="w-3 h-3 text-emerald-500" />
              완료 · 기록 저장됨 ({doneEvents.length}건)
            </h3>
            <div className="space-y-2">
              {doneEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
            </div>
          </div>
        )}

        {pendingEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-3">📅</p>
            <p className="text-xs font-extrabold text-slate-500">다음 병원 일정이나 약 수령일을 등록해보세요.</p>
          </div>
        )}
      </div>

      {/* 일정 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black">일정 추가</h4>
              <button type="button" onClick={() => setShowAdd(false)}>
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <input
                required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="일정 제목 (예: 충남대병원 진료)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
              <select value={newType} onChange={e => setNewType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {Object.entries(TYPE_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.emoji} {meta.label}</option>
                ))}
              </select>
              <input value={newMemo} onChange={e => setNewMemo(e.target.value)}
                placeholder="메모 (선택)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setNewAlarm(!newAlarm)}
                  className={`w-10 h-5 rounded-full transition-all ${newAlarm ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full border shadow transition-transform ${newAlarm ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-bold text-slate-700">알림 받기</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">일정 저장</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
