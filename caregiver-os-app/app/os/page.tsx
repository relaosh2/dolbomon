'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

type TabType = 'calendar' | 'expense';

interface Member {
  id: string;
  name: string;
  role: string;
}

interface CalendarEvent {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  status: string;
}

interface ExpenseItem {
  id: number;
  title: string;
  payerId: string;
  payer: string;
  amount: number;
  date: string;
  isSettled: number;
}

export default function FamilyOSDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [memberCount, setMemberCount] = useState(3);

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch calendar details
      const calRes = await fetch('/api/calendar');
      const calData = await calRes.json();
      if (calData.success) {
        setEvents(calData.events);
        setMembers(calData.members);
      }

      // Fetch expense details
      const expRes = await fetch('/api/expense');
      const expData = await expRes.json();
      if (expData.success) {
        setExpenses(expData.expenses);
        setTotalExpense(expData.totalExpense);
        setMemberCount(expData.memberCount);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequireAuth = () => {
    const token = localStorage.getItem('caregiver_user_token');
    if (!token) {
      alert('가족 서비스를 이용하기 위해서는 가족 계정 로그인이 필요합니다. 3초 만에 간편 로그인하세요!');
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const handleAssign = async (eventId: number, assigneeId: string) => {
    if (!handleRequireAuth()) return;
    
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN',
          eventId,
          assigneeId
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        const member = members.find(m => m.id === assigneeId);
        alert(`${member?.name || '가족'}님에게 일정이 배정되었으며, 카카오톡 알림이 발송되었습니다!`);
      } else {
        alert('배정 실패: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('일정 배정 중 오류가 발생했습니다.');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleRequireAuth()) return;
    if (!newEventTitle || !newEventDate || !newEventTime) {
      return alert('필수 입력 항목을 채워주세요.');
    }

    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          title: newEventTitle,
          date: newEventDate,
          time: newEventTime,
          description: newEventDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewEventTitle('');
        setNewEventDate('');
        setNewEventTime('');
        setNewEventDesc('');
        setShowEventForm(false);
        fetchData();
        alert('새 일정이 공유 캘린더에 추가되었습니다.');
      } else {
        alert('일정 등록 실패: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('일정 등록 중 오류가 발생했습니다.');
    }
  };

  const handleSettle = async (expenseId: number, amount: number) => {
    alert('토스 간편송금 결제창이 호출됩니다.');
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SETTLE',
          expenseId
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        alert('정산 송금이 완료 처리되었습니다!');
      } else {
        alert('정산 처리 실패: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('정산 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href='/'}>
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              가족돌봄OS
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600 items-center">
              <a href="/" className="hover:text-indigo-600 transition-colors">장기요양계산기</a>
              <a href="/mission" className="hover:text-indigo-600 transition-colors">자녀효도퀘스트</a>
              <span className="font-semibold text-indigo-600">가족돌봄OS</span>
              <a href="/donate" className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors font-bold font-sans">☕ 커피응원</a>
            </nav>
            <a 
              href="/caregiver-os.apk" 
              download 
              className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-full font-bold flex items-center space-x-1 shadow-sm transition-all whitespace-nowrap"
            >
              <span>📱 앱 다운로드</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="pt-24 px-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Family Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <UserGroupIcon className="w-4 h-4" />
              <span>김씨네 가족돌봄방</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">대한민국 최초 AI 기반 가족돌봄OS</h1>
            <p className="text-sm text-slate-500 mt-1">
              참여 가족: {members.map(m => m.name).join(', ')}
            </p>
          </div>
          <div className="hidden sm:flex -space-x-2 overflow-hidden">
            {members.map((member, i) => (
              <div key={member.id} className={`inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br ${i === 0 ? 'from-rose-400 to-rose-500' : 'from-slate-300 to-slate-400'} flex items-center justify-center text-white font-bold text-xs`}>
                {member.name.substring(0, 1)}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-slate-200/50 p-1 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 flex justify-center items-center space-x-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CalendarDaysIcon className="w-5 h-5" />
            <span>일정 분담</span>
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 flex justify-center items-center space-x-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'expense' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            <span>정산 장부</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <>
            {/* Tab Content: Calendar */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  부모님 케어 일정 <span className="ml-2 bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs">{events.length}건</span>
                </h2>

                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-rose-400"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pl-4">
                        <div className="flex-1">
                          <div className="text-sm font-bold text-rose-500 mb-1">{event.date} {event.time}</div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                          {event.description && <p className="text-sm text-slate-500">{event.description}</p>}
                        </div>
                        
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-[200px]">
                          <div className="text-xs font-semibold text-slate-500 mb-2">담당 보호자</div>
                          
                          {event.assigneeName ? (
                            <div className="flex items-center space-x-2">
                              <UserCircleIcon className="w-8 h-8 text-indigo-500" />
                              <div>
                                <div className="text-sm font-bold text-slate-900">{event.assigneeName}</div>
                                <div className="text-xs text-slate-400">배정 완료</div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <select 
                                onChange={(e) => handleAssign(event.id, e.target.value)}
                                defaultValue=""
                                className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              >
                                <option value="" disabled>가족 중 선택하기</option>
                                {members.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-dashed">
                      등록된 부모님 일정이 없습니다.
                    </div>
                  )}
                </div>
                
                {/* Event Creation Form toggler */}
                <div className="text-center pt-8">
                  {!showEventForm ? (
                    <button 
                      onClick={() => { if(handleRequireAuth()) setShowEventForm(true); }}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl transition-colors"
                    >
                      + 새 일정 등록하기
                    </button>
                  ) : (
                    <form onSubmit={handleAddEvent} className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-4 max-w-md mx-auto shadow-md">
                      <h3 className="font-bold text-slate-900 text-lg">새 일정 추가</h3>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">일정명</label>
                        <input 
                          type="text" 
                          placeholder="예: 어머님 요양병원 진료" 
                          value={newEventTitle}
                          onChange={e => setNewEventTitle(e.target.value)}
                          className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">날짜</label>
                          <input 
                            type="date" 
                            value={newEventDate}
                            onChange={e => setNewEventDate(e.target.value)}
                            className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">시간</label>
                          <input 
                            type="time" 
                            value={newEventTime}
                            onChange={e => setNewEventTime(e.target.value)}
                            className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">상세내용</label>
                        <textarea 
                          placeholder="가족들과 공유할 전달사항" 
                          value={newEventDesc}
                          onChange={e => setNewEventDesc(e.target.value)}
                          className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button 
                          type="submit" 
                          className="flex-1 bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-indigo-700"
                        >
                          저장
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowEventForm(false)}
                          className="flex-1 bg-slate-100 text-slate-700 text-sm font-bold py-2.5 rounded-lg hover:bg-slate-200"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Tab Content: Expense */}
            {activeTab === 'expense' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Total Summary */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="text-sm font-medium text-slate-400 mb-2">이번 달 우리 가족 총 간병 비용</div>
                  <div className="text-4xl font-extrabold tracking-tight">
                    {totalExpense.toLocaleString()} <span className="text-xl font-medium text-slate-500">원</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">정산 대상 내역</h2>

                {/* Expense List */}
                <div className="space-y-4">
                  {expenses.map(expense => {
                    const splitAmount = Math.round(expense.amount / memberCount);
                    return (
                      <div 
                        key={expense.id}
                        className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                          expense.isSettled ? 'bg-slate-50 border-slate-200' : 'bg-white shadow-xl shadow-slate-200/50 border-indigo-100'
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                            <div>
                              <div className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md mb-3">
                                <span>{expense.date} 결제</span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900">{expense.title}</h3>
                              <p className="text-sm text-slate-500 mt-1">결제자: <span className="font-semibold text-slate-700">{expense.payer}</span></p>
                            </div>
                            <div className="text-right sm:text-right">
                              <div className="text-sm font-semibold text-slate-400 line-through">총 {expense.amount.toLocaleString()}원</div>
                              <div className="text-xl font-extrabold text-indigo-600 mt-1">나의 1/{memberCount}: {splitAmount.toLocaleString()}원</div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            {!expense.isSettled ? (
                              <>
                                <button 
                                  onClick={() => handleSettle(expense.id, splitAmount)}
                                  className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl font-bold text-white bg-[#0050FF] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                                >
                                  토스로 {splitAmount.toLocaleString()}원 송금하기
                                </button>
                              </>
                            ) : (
                              <div className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircleIcon className="w-6 h-6" />
                                <span className="font-bold">정산이 완료되었습니다!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {expenses.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-dashed">
                      정산할 지출 기록이 없습니다.
                    </div>
                  )}
                </div>
                
                {/* Warning Banner */}
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mt-8 flex items-start space-x-3">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-800">가족 역할 불균형 알림</h4>
                    <p className="text-xs text-rose-600 mt-1">최근 30일간 비용 결제 및 병원 동행 비율이 특정 보호자에게 편중되어 있습니다. 시스템이 형제들에게 자발적 분담을 권유하는 알림을 발송할 수 있습니다.</p>
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
