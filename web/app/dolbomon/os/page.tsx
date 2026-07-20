'use client';

import React, { useState } from 'react';
import { 
  HeartIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon, CheckIcon } from '@heroicons/react/24/solid';

type TabType = 'calendar' | 'expense';

// Mock Data
const FAMILY_MEMBERS = [
  { id: 'u1', name: '대장님(나)', role: 'LEADER' },
  { id: 'u2', name: '첫째 오빠', role: 'MEMBER' },
  { id: 'u3', name: '막내 동생', role: 'MEMBER' },
];

export default function FamilyOSDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isSettled, setIsSettled] = useState(false);
  const [assignee, setAssignee] = useState<string | null>(null);

  // Mock Expense Data
  const totalExpense = 450000;
  const expenseItem = {
    title: '어머님 치매 약값 (3개월치)',
    payer: '첫째 오빠',
    amount: 300000,
    date: '3월 10일',
  };
  const splitAmount = expenseItem.amount / FAMILY_MEMBERS.length; // 100,000

  const handleRequireAuth = () => {
    const token = localStorage.getItem('dolbomon_user_token');
    if (!token) {
      alert('일정 등록 및 담당자 지정을 위해서는 가족 계정 로그인이 필요합니다. 3초 만에 간편 로그인하세요!');
      window.location.href = '/dolbomon/login';
      return false;
    }
    return true;
  };

  const handleAssign = (memberId: string) => {
    if (!handleRequireAuth()) return;
    const member = FAMILY_MEMBERS.find(m => m.id === memberId);
    if (member) {
      setAssignee(member.name);
      alert(`${member.name}님에게 병원 동행 일정이 배정되었으며, 카카오톡 알림이 발송되었습니다!`);
    }
  };

  const handleSettle = () => {
    alert('토스 간편송금 API가 호출됩니다. 송금 완료 처리하시겠습니까?');
    setIsSettled(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 pb-24">
      {/* Header (공통 스타일 유지) */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href='/dolbomon'}>
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              돌봄온
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 items-center">
            <a href="/dolbomon" className="hover:text-indigo-600 transition-colors">장기요양계산기</a>
            <a href="/dolbomon/mission" className="hover:text-indigo-600 transition-colors">자녀효도퀘스트</a>
            <span className="font-semibold text-indigo-600">돌봄온</span>
            <a href="/dolbomon/donate" className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors font-bold">☕ 커피응원</a>
          </nav>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="pt-36 px-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Family Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <UserGroupIcon className="w-4 h-4" />
              <span>김씨네 가족돌봄방</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">대한민국 최초 AI 기반 돌봄온</h1>
            <p className="text-sm text-slate-500 mt-1">참여 가족: {FAMILY_MEMBERS.map(m => m.name).join(', ')}</p>
          </div>
          <div className="hidden sm:flex -space-x-2 overflow-hidden">
            {FAMILY_MEMBERS.map((member, i) => (
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

        {/* Tab Content: Calendar */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              이번 달 병원 일정 <span className="ml-2 bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs">1건</span>
            </h2>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-rose-400"></div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pl-4">
                <div>
                  <div className="text-sm font-bold text-rose-500 mb-1">3월 15일 (금) 14:00</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">충남대병원 치매안심센터 정기 검사</h3>
                  <p className="text-sm text-slate-500">신분증, 이전 처방전 지참 필수</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-[200px]">
                  <div className="text-xs font-semibold text-slate-500 mb-2">담당 보호자</div>
                  
                  {assignee ? (
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon className="w-8 h-8 text-indigo-500" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{assignee}</div>
                        <div className="text-xs text-slate-400">배정 완료</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select 
                        onChange={(e) => handleAssign(e.target.value)}
                        defaultValue=""
                        className="w-full text-sm rounded-lg border border-slate-200 py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="" disabled>가족 중 선택하기</option>
                        {FAMILY_MEMBERS.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-50 cursor-not-allowed">
                        담당 지정 및 알림톡
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <button 
                onClick={() => { if(handleRequireAuth()) alert('새 일정 등록 폼이 열립니다.'); }}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl transition-colors"
              >
                + 새 일정 등록하기
              </button>
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

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">미정산 내역</h2>

            {/* Expense Card */}
            <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isSettled ? 'bg-slate-50 border-slate-200' : 'bg-white shadow-xl shadow-slate-200/50 border-indigo-100'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md mb-3">
                      <span>{expenseItem.date} 결제</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{expenseItem.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">결제자: <span className="font-semibold text-slate-700">{expenseItem.payer}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-400 line-through">총 {expenseItem.amount.toLocaleString()}원</div>
                    <div className="text-xl font-extrabold text-indigo-600 mt-1">나의 1/N: {splitAmount.toLocaleString()}원</div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  {!isSettled ? (
                    <>
                      <button 
                        onClick={handleSettle}
                        className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl font-bold text-white bg-[#0050FF] hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                      >
                        토스로 {splitAmount.toLocaleString()}원 송금하기
                      </button>
                      <button 
                        onClick={() => setIsSettled(true)}
                        className="flex-1 sm:flex-none sm:w-1/3 flex justify-center items-center py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        계좌이체 완료
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
            
            {/* Warning Banner */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mt-8 flex items-start space-x-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-800">가족 역할 불균형 알림</h4>
                <p className="text-xs text-rose-600 mt-1">최근 30일간 <b>첫째 오빠</b>님의 비용 결제 및 병원 동행 비율이 100%입니다. 시스템이 형제들에게 분담 권유 알림을 발송할 수 있습니다.</p>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
