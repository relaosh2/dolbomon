'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalculatorIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  BellIcon,
  HeartIcon,
  FaceSmileIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

// Checklist item type
type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  category: 'health' | 'admin' | 'care';
};

export default function CaregiverHome() {
  // Mock/State for interactive items
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '부모님 오전 치매 약 복용 확인하기', completed: true, category: 'health' },
    { id: '2', text: '방문요양센터 주간 일정 확인 전화', completed: false, category: 'admin' },
    { id: '3', text: '어르신 혈압 체크 및 기록하기', completed: false, category: 'health' },
    { id: '4', text: '장기요양 인정서 갱신 서류 확인', completed: false, category: 'admin' },
  ]);

  const [parentStatus, setParentStatus] = useState({
    grade: '예상 3등급',
    subsidy: '월 120만원 지원 대상',
    lastCalculated: '2026.06.17'
  });

  const [caregiverCondition, setCaregiverCondition] = useState({
    stressScore: 78,
    sleepHours: 5.5,
    careHours: 8,
    statusText: '지침 (관심 필요)'
  });

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Read state from localStorage if available (hydration safe)
  useEffect(() => {
    const savedGrade = localStorage.getItem('caregiver_grade');
    const savedSubsidy = localStorage.getItem('caregiver_subsidy');
    if (savedGrade && savedSubsidy) {
      setParentStatus({
        grade: savedGrade,
        subsidy: savedSubsidy,
        lastCalculated: '최근 계산됨'
      });
    }
  }, []);

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => {
      setShowSubscriptionModal(false);
      alert('돌봄온 3.0 멤버십(월 4,900원) 구독이 완료되었습니다! (시뮬레이션)');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 max-w-md mx-auto relative">
      
      {/* Hero Welcome banner */}
      <div className="mb-6 relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/20">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full blur-2xl"></div>
        <span className="inline-block bg-indigo-800/80 text-rose-300 border border-indigo-700/50 text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 tracking-wider uppercase">
          부모를 돌보는 사람을 위한 운영비서
        </span>
        <h1 className="text-xl font-black leading-tight mb-2">
          부모님 돌봄으로 지친<br />
          <span className="text-rose-400">보호자님의 마음</span>을 돌봅니다.
        </h1>
        <p className="text-xs text-indigo-200/90 font-medium">
          대한민국 최초 보호자 중심 돌봄 지원 플랫폼 돌봄온
        </p>
      </div>

      {/* 1. 예상 장기요양등급 & 지원금 위젯 */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-0.5">우리 부모님 케어 나침반</span>
              <h2 className="text-base font-extrabold text-slate-800">예상 등급 및 정부 지원금</h2>
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-bold">
              {parentStatus.lastCalculated}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-rose-50/50 border border-rose-100/50 rounded-xl p-3.5 text-center">
              <span className="text-xs text-rose-600 font-bold block mb-1">장기요양등급</span>
              <span className="text-lg font-black text-rose-700">{parentStatus.grade}</span>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3.5 text-center">
              <span className="text-xs text-indigo-600 font-bold block mb-1">예상 지원 한도</span>
              <span className="text-xs font-black text-indigo-700 block mt-1 leading-snug">{parentStatus.subsidy}</span>
            </div>
          </div>

          <Link 
            href="/caregiver/calculator" 
            className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all active:scale-[0.98]"
          >
            <CalculatorIcon className="w-4 h-4 text-rose-400" />
            <span>장기요양 모의 테스트 및 계산기 시작</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. 오늘 할 일 (Checklist) */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
              <span>보호자의 오늘 할 일</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {todos.filter(t => t.completed).length}/{todos.length} 완료
            </span>
          </div>

          <div className="space-y-2.5">
            {todos.map(todo => (
              <div 
                key={todo.id} 
                onClick={() => toggleTodo(todo.id)}
                className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  todo.completed 
                    ? 'bg-slate-50/70 border-slate-100 text-slate-400 line-through' 
                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  todo.completed 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {todo.completed && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-xs font-semibold flex-grow leading-normal">
                  {todo.text}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  todo.category === 'health' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {todo.category === 'health' ? '의료' : '행정'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 최근 기록 & 보호자 상태 */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        {/* 최근 기록 요약 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block mb-1">최근 돌봄 기록</span>
            <div className="border-l-2 border-indigo-500 pl-2.5 my-2">
              <span className="text-[10px] text-indigo-600 font-bold block">3일 전 (06.14)</span>
              <p className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">치매안심센터 정기 검사 방문 완료</p>
            </div>
          </div>
          <Link href="/caregiver/records" className="text-[10px] font-extrabold text-indigo-600 hover:underline flex items-center mt-2">
            전체 기록 보기 →
          </Link>
        </div>

        {/* 보호자 상태 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-extrabold text-slate-400">보호자 상태</span>
              <span className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold">
                {caregiverCondition.statusText}
              </span>
            </div>
            <div className="my-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>스트레스 지수</span>
                <span className="text-rose-600">{caregiverCondition.stressScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-rose-500" style={{ width: `${caregiverCondition.stressScore}%` }}></div>
              </div>
            </div>
          </div>
          <Link href="/caregiver/me" className="text-[10px] font-extrabold text-rose-500 hover:underline flex items-center mt-2">
            스트레스 분석 & 충전하기 →
          </Link>
        </div>
      </section>

      {/* 4. 월 4,900원 멤버십 배너 */}
      <section className="mb-6">
        <div className="bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-slate-900 rounded-2xl p-5 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Premium
              </span>
              <h3 className="text-sm font-black mt-2 leading-snug">
                돌봄온 3.0 멤버십 구독<br />
                서류 무제한 보관 및 가족 연동
              </h3>
              <p className="text-[11px] text-slate-800 mt-1 font-medium">
                월 4,900원으로 온 가족이 실시간 일정을 공유하세요.
              </p>
            </div>
            <span className="text-lg font-black text-slate-900 flex flex-col items-end">
              <span>₩4,900</span>
              <span className="text-[9px] font-bold opacity-80">/월</span>
            </span>
          </div>

          <button 
            onClick={() => setShowSubscriptionModal(true)}
            className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800 text-xs font-extrabold py-2.5 rounded-xl transition-all"
          >
            {subscribed ? '구독 중 (멤버십 가입됨)' : '30일 무료 체험 시작하기'}
          </button>
        </div>
      </section>

      {/* 5. 투자 문구 및 카피라이팅 (보호자 중심 브랜딩) */}
      <footer className="text-center py-6 border-t border-slate-100 mt-4">
        <p className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 py-2.5 px-4 rounded-xl leading-relaxed">
          "돌봄온은 노인이 아닌, 부모를 돌보다가 하루하루 지쳐가는 보호자를 직접 돕는 따뜻한 비서 플랫폼입니다."
        </p>
        <p className="text-[10px] text-slate-400 mt-3">
          © 2026 DolbomON Inc. All rights reserved.
        </p>
      </footer>

      {/* Subscription Modal Simulation */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">돌봄온 3.0 프리미엄</h3>
              <p className="text-xs text-slate-500 mt-1">월 4,900원으로 빈틈없는 부모님 돌봄을 준비하세요.</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">종이 서류 무제한 스캔 & 보관 (서류함)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <BellIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">돌봄 일정 카카오톡 실시간 가족 공유</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <BookOpenIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">진료 & 처방 타임라인 PDF 자동 리포트 생성</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                닫기
              </button>
              <button 
                onClick={handleSubscribe}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-xl text-xs font-bold transition-all hover:opacity-95 shadow-md shadow-indigo-200"
              >
                구독 개시 (₩4,900)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
