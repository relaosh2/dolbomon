'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, BellIcon, CheckIcon } from '@heroicons/react/24/outline';

type EventType = 'hospital' | 'medicine' | 'test' | 'renewal' | 'visit' | 'other';
type EventStatus = 'pending' | 'done';

interface CareEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: EventType;
  status: EventStatus;
  alarm: boolean;
  memo?: string;
}

const TYPE_META: Record<EventType, { label: string; emoji: string }> = {
  hospital: { label: '병원', emoji: '🏥' },
  medicine: { label: '약수령', emoji: '💊' },
  test: { label: '검사', emoji: '🔬' },
  renewal: { label: '갱신', emoji: '📋' },
  visit: { label: '방문', emoji: '🚗' },
  other: { label: '기타', emoji: '📌' },
};

export default function SchedulePage() {
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);

  // New Event states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState<EventType>('hospital');
  const [newMemo, setNewMemo] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);
  
  // 마운트 시 로컬스토리지에서 일정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('dolbomon_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 일정 변경 시 로컬스토리지 동기화 헬퍼
  const saveEvents = (updated: CareEvent[]) => {
    setEvents(updated);
    localStorage.setItem('dolbomon_events', JSON.stringify(updated));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    const updated = [
      ...events,
      {
        id: Date.now().toString(),
        title: newTitle,
        date: newDate,
        time: newTime || undefined,
        type: newType,
        status: 'pending' as EventStatus,
        alarm: true,
        memo: newMemo || undefined,
      }
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    saveEvents(updated);
    
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewMemo('');
    setShowAdd(false);
  };

  const toggleStatus = (id: string) => {
    const updated = events.map(ev => ev.id === id ? { ...ev, status: ev.status === 'pending' ? 'done' : 'pending' as EventStatus } : ev);
    saveEvents(updated);
  };

  // 선택된 타입에 해당하는 일정만 1차 필터링
  const getFilteredEvents = () => {
    return events.filter(ev => selectedType === 'all' || ev.type === selectedType);
  };

  // 이번주 일정 (오늘 포함 7일간의 일정)
  const getThisWeekEvents = () => {
    const today = new Date(todayStr);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    const filteredEvents = getFilteredEvents();

    return filteredEvents.filter(ev => {
      const evDate = new Date(ev.date);
      return evDate >= today && evDate <= endOfWeek;
    });
  };

  // 다가오는 일정 (8일 이후 및 이전 완료/미완료 일정 전체 포함)
  const getUpcomingEvents = () => {
    const today = new Date(todayStr);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    const filteredEvents = getFilteredEvents();

    return filteredEvents.filter(ev => {
      const evDate = new Date(ev.date);
      return evDate > endOfWeek || evDate < today;
    });
  };

  const thisWeekEvents = getThisWeekEvents();
  const upcomingEvents = getUpcomingEvents();

  const renderEventCard = (ev: CareEvent) => {
    const dDay = Math.ceil((new Date(ev.date).getTime() - new Date(todayStr).getTime()) / 86400000);
    const isToday = ev.date === todayStr;
    
    let statusColor = '#5B3DF5';
    let statusLabel = '예정';
    if (ev.status === 'done') {
      statusColor = '#9CA3AF';
      statusLabel = '완료';
    } else if (isToday) {
      statusColor = '#FFB020';
      statusLabel = '오늘';
    }

    return (
      <div
        key={ev.id}
        className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 flex gap-3.5 items-start"
      >
        <div className="text-2xl flex-shrink-0">{TYPE_META[ev.type].emoji}</div>
        <div className="flex-grow space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: statusColor }}
            >
              {statusLabel}
            </span>
            {dDay > 0 && ev.status !== 'done' && (
              <span className="text-[10px] font-bold text-[#FF5C7A] bg-[#FF5C7A]/10 px-2 py-0.5 rounded-full">
                D-{dDay}
              </span>
            )}
            {dDay === 0 && ev.status !== 'done' && (
              <span className="text-[10px] font-bold text-white bg-[#FF5C7A] px-2 py-0.5 rounded-full">
                D-Day
              </span>
            )}
            {ev.alarm && <BellIcon className="w-3.5 h-3.5 text-[#FFB020]" />}
          </div>
          
          <h3 className={`text-[16px] font-bold tracking-tight ${ev.status === 'done' ? 'line-through text-[#6B7280] opacity-60' : 'text-[#111827]'}`}>
            {ev.title}
          </h3>
          
          <p className="text-[13px] text-[#6B7280] font-medium">
            📅 {ev.date} {ev.time && `⏰ ${ev.time}`}
          </p>
          
          {ev.memo && (
            <p className="text-[13px] text-[#6B7280] bg-[#F8F9FC] p-2.5 rounded-xl border border-slate-100 mt-1">
              💬 {ev.memo}
            </p>
          )}
        </div>

        <button
          onClick={() => toggleStatus(ev.id)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
            ev.status === 'done'
              ? 'bg-[#16C47F] border-[#16C47F] text-white'
              : 'border-slate-200 text-slate-300 hover:border-[#5B3DF5] hover:text-[#5B3DF5]'
          }`}
        >
          <CheckIcon className="w-4.5 h-4.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-32">
      <div className="max-w-md mx-auto px-5 pt-10 space-y-5">
        
        {/* ── 헤더 ── */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[26px] font-bold text-[#111827]">일정</h1>
            <p className="text-[12px] text-[#6B7280] mt-0.5">부모님 치료 및 복약 일정 관리</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white text-[14px] font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            <span>일정추가</span>
          </button>
        </div>

        {/* ── 분류 필터 탭 (병원, 약수령, 검사, 갱신 등 - 줄바꿈으로 항시 노출) ── */}
        <div className="flex flex-row flex-wrap gap-1.5 w-full">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap ${
              selectedType === 'all'
                ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                : 'bg-white text-[#6B7280] border-slate-200 hover:text-[#111827]'
            }`}
          >
            전체
          </button>
          {(Object.keys(TYPE_META) as EventType[]).map(typeKey => (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap ${
                selectedType === typeKey
                  ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                  : 'bg-white text-[#6B7280] border-slate-200 hover:text-[#111827]'
              }`}
            >
              {TYPE_META[typeKey].emoji} {TYPE_META[typeKey].label}
            </button>
          ))}
        </div>

        {/* ── 이번주 일정 섹션 ── */}
        <div className="space-y-2.5">
          <h2 className="text-[18px] font-bold text-[#111827]">이번주 일정</h2>
          {thisWeekEvents.length === 0 ? (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center">
              <span className="text-2xl block mb-1">📅</span>
              <p className="text-[13px] font-medium text-[#6B7280]">이번주 등록된 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {thisWeekEvents.map(renderEventCard)}
            </div>
          )}
        </div>

        {/* ── 다가오는 일정 섹션 ── */}
        <div className="space-y-2.5">
          <h2 className="text-[18px] font-bold text-[#111827]">다가오는 일정</h2>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 text-center">
              <span className="text-2xl block mb-1">📌</span>
              <p className="text-[13px] font-medium text-[#6B7280]">등록된 다가오는 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map(renderEventCard)}
            </div>
          )}
        </div>

      </div>

      {/* ── 일정 추가 모달 ── */}
      {showAdd && (
        <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-[100] flex items-end justify-center p-4">
          <form onSubmit={handleAddEvent} className="bg-white rounded-t-[32px] p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[18px] font-semibold text-[#111827]">일정 추가</h4>
              <button type="button" onClick={() => setShowAdd(false)}>
                <XMarkIcon className="w-6 h-6 text-[#6B7280]" />
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="일정 제목 (예: 충남대병원 신경과)"
                className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-xl outline-none focus:border-[#5B3DF5]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-xl outline-none bg-white focus:border-[#5B3DF5]"
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-xl outline-none bg-white focus:border-[#5B3DF5]"
                />
              </div>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as EventType)}
                className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-xl outline-none bg-white focus:border-[#5B3DF5]"
              >
                {Object.entries(TYPE_META).map(([k, m]) => (
                  <option key={k} value={k}>{m.emoji} {m.label}</option>
                ))}
              </select>
              <input
                value={newMemo}
                onChange={e => setNewMemo(e.target.value)}
                placeholder="간단한 메모 (선택)"
                className="w-full px-3 py-2.5 text-[14px] border border-slate-200 rounded-xl outline-none focus:border-[#5B3DF5]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[15px] font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#5B3DF5] text-white rounded-xl text-[15px] font-semibold"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
