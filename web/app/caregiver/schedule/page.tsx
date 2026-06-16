'use client';

import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PlusIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type CareEvent = {
  id: string;
  title: string;
  category: 'hospital' | 'exam' | 'medicine' | 'renewal';
  date: string;
  time: string;
  location: string;
  alertSent: boolean;
};

export default function SchedulePage() {
  const [events, setEvents] = useState<CareEvent[]>([
    { id: '1', title: '충남대병원 치매안심센터 정기검진', category: 'exam', date: '6월 24일 (수)', time: '14:00', location: '충남대병원 신관 3층', alertSent: true },
    { id: '2', title: '을지대병원 고혈압약 처방 및 수령', category: 'medicine', date: '6월 29일 (월)', time: '10:30', location: '가장 행복한 온누리약국', alertSent: false },
    { id: '3', title: '건강보험공단 등급 갱신 심사 인터뷰', category: 'renewal', date: '7월 15일 (수)', time: '11:00', location: '자택 방문', alertSent: true },
    { id: '4', title: '어머님 백내장 정기 안과 진료', category: 'hospital', date: '7월 22일 (수)', time: '09:30', location: '맑은성모안과', alertSent: false },
  ]);

  const [filter, setFilter] = useState<'all' | 'hospital' | 'exam' | 'medicine' | 'renewal'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'hospital' | 'exam' | 'medicine' | 'renewal'>('hospital');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.category === filter);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newEv: CareEvent = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      date: newDate || '7월 1일 (수)',
      time: newTime || '12:00',
      location: '미지정',
      alertSent: false
    };

    setEvents(prev => [...prev, newEv]);
    setNewTitle('');
    setIsAddOpen(false);
    alert('새 돌봄 일정이 추가되었습니다. 가족 카톡방에도 일정이 연동됩니다!');
  };

  const handleNotifyToggle = (id: string) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, alertSent: !e.alertSent } : e
    ));
    alert('카카오톡 예약 알림이 켜졌습니다. (매일 오전 8시 및 일정 2시간 전 알림 발송)');
  };

  const categoryLabels = {
    hospital: { label: '병원 진료', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    exam: { label: '정기 검사', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    medicine: { label: '약 수령', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    renewal: { label: '갱신일/행정', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 max-w-md mx-auto">
      
      {/* Filters */}
      <section className="mb-6 overflow-x-auto scrollbar-none">
        <div className="flex space-x-2 pb-1">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filter === 'all' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            전체 일정
          </button>
          {Object.entries(categoryLabels).map(([key, value]) => (
            <button 
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                filter === key 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>다가오는 일정 ({filteredEvents.length})</span>
          </h2>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="text-xs text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold shadow-sm transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>일정 추가</span>
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <span className="text-slate-400 text-xs font-bold">등록된 일정이 없습니다.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm relative overflow-hidden transition-all hover:border-slate-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${categoryLabels[event.category].color}`}>
                    {categoryLabels[event.category].label}
                  </span>
                  
                  {/* Alarm Activation Toggle Button */}
                  <button 
                    onClick={() => handleNotifyToggle(event.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      event.alertSent 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="알림 등록"
                  >
                    <BellIcon className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-extrabold text-slate-800 leading-snug">{event.title}</h3>

                <div className="mt-3 space-y-1 text-slate-500 font-semibold text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.date} {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Event Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateEvent}
            className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black text-slate-900">새 일정 추가</h4>
              <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">일정 내용</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 충남대병원 정기검진" 
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">카테고리</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="hospital">병원 진료</option>
                  <option value="exam">정기 검사</option>
                  <option value="medicine">약 수령</option>
                  <option value="renewal">장기요양등급 갱신</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">날짜</label>
                  <input 
                    type="text" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="예: 7월 1일 (수)" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">시간</label>
                  <input 
                    type="text" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="예: 14:00" 
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setIsAddOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                취소
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                확인
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
