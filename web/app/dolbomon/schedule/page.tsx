'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, BellIcon, CheckIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 📅 일정 — 완료 클릭 → 기록 자동 생성 + 즉시 메모 팝업
// ─────────────────────────────────────────────────────────────

// ── 공유 타입 ──
export type RecordCategory = 'hospital' | 'medicine' | 'test' | 'admission' | 'admin' | 'support';

export interface SharedRecord {
  id: string;
  date: string;
  title: string;
  detail?: string;
  category: RecordCategory;
  cost?: number;
  tags?: string[];
  fromSchedule?: boolean;
  createdAt: number;
}

// ── localStorage 유틸 ──
const RECORDS_KEY = 'dolbomon_records';

export function getStoredRecords(): SharedRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'); }
  catch { return []; }
}

export function addStoredRecord(record: SharedRecord) {
  const records = getStoredRecords();
  records.unshift(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event('dolbomon_record_updated'));
}

// ── 일정 타입 ──
type EventType = 'hospital' | 'medicine' | 'test' | 'renewal' | 'visit' | 'other';
type EventStatus = 'pending' | 'done';

interface CareEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: EventType;
  status: EventStatus;
  repeat?: string;
  alarm: boolean;
  memo?: string;
}

const TYPE_META: Record<EventType, { label: string; emoji: string; color: string; recordCategory: RecordCategory }> = {
  hospital: { label: '병원', emoji: '🏥', color: 'bg-rose-50 text-rose-700 border-rose-100', recordCategory: 'hospital' },
  medicine: { label: '약수령', emoji: '💊', color: 'bg-amber-50 text-amber-700 border-amber-100', recordCategory: 'medicine' },
  test: { label: '검사', emoji: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-100', recordCategory: 'test' },
  renewal: { label: '갱신', emoji: '📋', color: 'bg-purple-50 text-purple-700 border-purple-100', recordCategory: 'admin' },
  visit: { label: '방문', emoji: '🚗', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', recordCategory: 'hospital' },
  other: { label: '기타', emoji: '📌', color: 'bg-slate-100 text-slate-600 border-slate-200', recordCategory: 'admin' },
};

// 오늘 이슈 태그 (완료 시 선택)
const ISSUE_TAGS = [
  '특이사항 없음', '약 변경', '증상 완화', '의사 소견 메모', '처방전 수령',
  '다음 예약 완료', '비용 지출', '상태 악화', '가족 동행',
];

const INIT_EVENTS: CareEvent[] = [
  { id: '1', title: '충남대병원 신경과 정기진료', date: '2026-06-24', time: '14:00', type: 'hospital', status: 'pending', repeat: '3개월', alarm: true, memo: '보호자 동행 필요 / 주차증 챙기기' },
  { id: '2', title: '고혈압약 처방전 수령', date: '2026-06-26', time: '10:00', type: 'medicine', status: 'pending', alarm: true },
  { id: '3', title: '인지기능 검사 예약', date: '2026-06-28', time: '13:30', type: 'test', status: 'pending', alarm: true },
  { id: '4', title: '장기요양 인정서 갱신일 확인', date: '2026-08-01', type: 'renewal', status: 'pending', alarm: false, memo: '국민건강보험공단 1577-1000' },
];

// ── 완료 모달 상태 ──
interface CompleteModal {
  event: CareEvent;
  selectedTags: string[];
  memo: string;
  cost: string;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<CareEvent[]>(INIT_EVENTS);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [completeModal, setCompleteModal] = useState<CompleteModal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 새 일정 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<EventType>('hospital');
  const [newAlarm, setNewAlarm] = useState(true);
  const [newMemo, setNewMemo] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 완료 버튼 클릭 → 모달 오픈
  const handleCompleteClick = (ev: CareEvent) => {
    setCompleteModal({ event: ev, selectedTags: [], memo: '', cost: '' });
  };

  // 태그 토글
  const toggleTag = (tag: string) => {
    if (!completeModal) return;
    setCompleteModal(prev => {
      if (!prev) return null;
      const has = prev.selectedTags.includes(tag);
      return { ...prev, selectedTags: has ? prev.selectedTags.filter(t => t !== tag) : [...prev.selectedTags, tag] };
    });
  };

  // 기록 저장 (태그/메모 포함)
  const handleSaveRecord = () => {
    if (!completeModal) return;
    const { event, selectedTags, memo, cost } = completeModal;
    const meta = TYPE_META[event.type];

    const record: SharedRecord = {
      id: `sched_${event.id}_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: event.title,
      detail: [memo, selectedTags.filter(t => t !== '특이사항 없음').join(', ')].filter(Boolean).join(' · ') || undefined,
      category: meta.recordCategory,
      cost: cost ? parseInt(cost) : undefined,
      tags: selectedTags,
      fromSchedule: true,
      createdAt: Date.now(),
    };

    addStoredRecord(record);
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'done' } : e));
    setCompleteModal(null);
    showToast('✓ 기록탭에 저장되었습니다');
  };

  // 건너뛰기 (기록만 자동 저장)
  const handleSkipMemo = () => {
    if (!completeModal) return;
    const { event } = completeModal;
    const meta = TYPE_META[event.type];

    const record: SharedRecord = {
      id: `sched_${event.id}_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: event.title,
      category: meta.recordCategory,
      fromSchedule: true,
      createdAt: Date.now(),
    };

    addStoredRecord(record);
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'done' } : e));
    setCompleteModal(null);
    showToast('✓ 기록탭에 자동 저장되었습니다');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setEvents(prev => [...prev, {
      id: Date.now().toString(), title: newTitle, date: newDate,
      type: newType, status: 'pending', alarm: newAlarm, memo: newMemo,
    }]);
    setNewTitle(''); setNewDate(''); setNewMemo(''); setShowAdd(false);
  };

  const pendingEvents = events.filter(e =>
    e.status === 'pending' && (filterType === 'all' || e.type === filterType)
  );
  const doneEvents = events.filter(e => e.status === 'done');

  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
  const thisWeek = pendingEvents.filter(e => new Date(e.date) <= weekEnd);
  const upcoming = pendingEvents.filter(e => new Date(e.date) > weekEnd);

  const EventCard = ({ ev }: { ev: CareEvent }) => {
    const meta = TYPE_META[ev.type];
    const dDay = Math.ceil((new Date(ev.date).getTime() - Date.now()) / 86400000);

    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-4 shadow-sm ${ev.status === 'done' ? 'opacity-50' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0 mt-0.5">{meta.emoji}</div>
          <div className="flex-grow">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${meta.color}`}>{meta.label}</span>
              {dDay >= 0 && dDay <= 3 && ev.status === 'pending' && (
                <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">
                  {dDay === 0 ? 'D-Day' : `D-${dDay}`}
                </span>
              )}
              {ev.alarm && <BellIcon className="w-3 h-3 text-amber-500" />}
            </div>
            <h4 className={`text-xs font-extrabold mb-1 ${ev.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
              {ev.title}
            </h4>
            <div className="flex gap-2 text-[10px] text-slate-400 font-semibold">
              <span>📅 {new Date(ev.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
              {ev.time && <span>⏰ {ev.time}</span>}
              {ev.repeat && <span className="text-indigo-500">🔄 {ev.repeat}마다</span>}
            </div>
            {ev.memo && <p className="text-[10px] text-slate-400 mt-1.5 bg-slate-50 rounded-lg px-2 py-1">💬 {ev.memo}</p>}
          </div>
          {ev.status === 'pending' ? (
            <button
              onClick={() => handleCompleteClick(ev)}
              className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-violet-500 hover:bg-violet-50 transition-all flex-shrink-0"
              title="완료 처리 (기록에 자동 저장)"
            >
              <CheckIcon className="w-4 h-4 text-slate-300" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 pt-5 pb-4 sticky top-14 z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">일정 관리</p>
            <h1 className="text-sm font-black text-slate-900">놓치지 않는 돌봄 일정</h1>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl">
            <PlusIcon className="w-4 h-4" /> 일정 추가
          </button>
        </div>

        {/* 자동 기록 안내 배너 */}
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 flex items-center gap-2 mb-2">
          <span>✅</span>
          <p className="text-[10px] text-violet-700 font-bold">일정 완료 시 기록탭에 자동으로 저장됩니다. 메모만 추가하세요.</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['all', ...Object.keys(TYPE_META)] as (EventType | 'all')[]).map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex-shrink-0 ${
                filterType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'
              }`}>
              {type === 'all' ? '전체' : `${TYPE_META[type as EventType].emoji} ${TYPE_META[type as EventType].label}`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 pb-8">
        {thisWeek.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-rose-400 rounded-full" /> 이번 주 ({thisWeek.length}건)
            </h3>
            <div className="space-y-2.5">{thisWeek.map(ev => <EventCard key={ev.id} ev={ev} />)}</div>
          </div>
        )}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-300 rounded-full" /> 다가오는 일정 ({upcoming.length}건)
            </h3>
            <div className="space-y-2.5">{upcoming.map(ev => <EventCard key={ev.id} ev={ev} />)}</div>
          </div>
        )}
        {doneEvents.length > 0 && (
          <div>
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CheckIcon className="w-3 h-3 text-emerald-500" /> 완료 · 기록 저장됨 ({doneEvents.length}건)
            </h3>
            <div className="space-y-2">{doneEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}</div>
          </div>
        )}
        {pendingEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-3">📅</p>
            <p className="text-xs font-extrabold text-slate-500">다음 병원 일정이나 약 수령일을 등록해보세요.</p>
          </div>
        )}
      </div>

      {/* ── 완료 메모 모달 ── */}
      {completeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-black text-slate-900">기록에 추가되었습니다!</h4>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-4 pl-8">메모를 남기시겠어요? (선택사항)</p>

            {/* 이슈 태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ISSUE_TAGS.map(tag => {
                const selected = completeModal.selectedTags.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all ${
                      selected ? 'bg-violet-600 text-white border-violet-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}>
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* 메모 + 비용 */}
            <div className="space-y-2 mb-4">
              <textarea
                value={completeModal.memo}
                onChange={e => setCompleteModal(prev => prev ? { ...prev, memo: e.target.value } : null)}
                placeholder="추가 메모 (선택) — 의사 소견, 처방 내용 등"
                rows={2}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="number"
                value={completeModal.cost}
                onChange={e => setCompleteModal(prev => prev ? { ...prev, cost: e.target.value } : null)}
                placeholder="지출 금액 (원, 선택)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleSkipMemo}
                className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold">
                건너뛰기
              </button>
              <button onClick={handleSaveRecord}
                className="flex-1 py-2.5 text-white rounded-xl text-xs font-extrabold"
                style={{ background: '#6C63FF' }}>
                기록 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 일정 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <form onSubmit={handleAdd} className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black">일정 추가</h4>
              <button type="button" onClick={() => setShowAdd(false)}><XMarkIcon className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <input required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="일정 제목" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
              <input required type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white" />
              <select value={newType} onChange={e => setNewType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white">
                {Object.entries(TYPE_META).map(([k, m]) => <option key={k} value={k}>{m.emoji} {m.label}</option>)}
              </select>
              <input value={newMemo} onChange={e => setNewMemo(e.target.value)} placeholder="메모 (선택)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
