'use client';

import React, { useState } from 'react';
import { 
  HeartIcon, 
  GiftIcon, 
  CheckCircleIcon,
  SparklesIcon,
  PlusCircleIcon,
  CheckBadgeIcon,
  ArrowUpCircleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

type UserRole = 'PARENT' | 'CHILD';

type MissionStatus = 'AVAILABLE' | 'REQUESTED' | 'APPROVED';

interface Mission {
  id: number;
  title: string;
  points: number;
  status: MissionStatus;
  comment?: string;
}

export default function KidsMissionDashboard() {
  const [role, setRole] = useState<UserRole>('PARENT');
  
  // Wallet State
  const [currentPoints, setCurrentPoints] = useState(49500);
  const [targetItem, setTargetItem] = useState('닌텐도 스위치 칩');
  const [targetPoints, setTargetPoints] = useState(50000);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTargetItem, setTempTargetItem] = useState(targetItem);
  const [tempTargetPoints, setTempTargetPoints] = useState(targetPoints);
  const [isExchangeRequested, setIsExchangeRequested] = useState(false);

  // Mission State
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: '할머니께 안부 전화드리기', points: 1000, status: 'REQUESTED', comment: '오늘 할머니가 주말에 맛있는 거 사주신대요!' },
    { id: 2, title: '수학 익힘책 5장 풀기', points: 700, status: 'AVAILABLE' },
    { id: 3, title: '분리수거 돕기', points: 500, status: 'AVAILABLE' },
  ]);

  // Parent Action: Add new mission
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionPoints, setNewMissionPoints] = useState<number | ''>('');

  const handleRequireAuth = () => {
    const token = localStorage.getItem('caregiver_user_token');
    if (!token) {
      alert('자녀에게 미션을 배포하려면 가족 계정 로그인이 필요합니다. 3초 만에 간편 로그인하세요!');
      window.location.href = '/caregiver/login';
      return false;
    }
    return true;
  };

  const handleAddMission = () => {
    if (!handleRequireAuth()) return;
    if (!newMissionTitle || !newMissionPoints) return;
    setMissions([...missions, {
      id: Date.now(),
      title: newMissionTitle,
      points: Number(newMissionPoints),
      status: 'AVAILABLE'
    }]);
    setNewMissionTitle('');
    setNewMissionPoints('');
  };

  // Parent Action: Approve mission
  const handleApprove = (id: number) => {
    setMissions(missions.map(m => m.id === id ? { ...m, status: 'APPROVED' } : m));
    const approvedMission = missions.find(m => m.id === id);
    if (approvedMission) {
      setCurrentPoints(prev => prev + approvedMission.points);
      alert('미션이 승인되었습니다! 자녀의 지갑에 포인트가 지급되고 알림톡이 발송됩니다.');
    }
  };

  // Child Action: Request completion
  const handleRequest = (id: number) => {
    const comment = prompt('부모님께 보낼 한줄평을 입력해 주세요! (예: 할머니가 엄청 좋아하셨어요!)');
    if (comment !== null) {
      setMissions(missions.map(m => m.id === id ? { ...m, status: 'REQUESTED', comment } : m));
      alert('완료 요청을 쐈습니다! 부모님이 승인하면 포인트가 들어옵니다.');
    }
  };

  // Child Action: Update target
  const handleSaveTarget = () => {
    setTargetItem(tempTargetItem);
    setTargetPoints(tempTargetPoints);
    setIsEditingTarget(false);
  };

  const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href='/caregiver'}>
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-500">
              가족돌봄OS
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 items-center">
            <a href="/caregiver" className="hover:text-amber-600 transition-colors">장기요양계산기</a>
            <span className="font-semibold text-amber-600">자녀효도퀘스트</span>
            <a href="/caregiver/os" className="hover:text-amber-600 transition-colors">가족돌봄OS</a>
            <a href="/caregiver/donate" className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors font-bold">☕ 커피응원</a>
          </nav>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="pt-36 px-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Role Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 p-1 rounded-2xl flex space-x-1">
            <button
              onClick={() => setRole('PARENT')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                role === 'PARENT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              👨👩 부모 패널
            </button>
            <button
              onClick={() => setRole('CHILD')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                role === 'CHILD' ? 'bg-amber-400 text-amber-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              👦 자녀 패널
            </button>
          </div>
        </div>

        {/* PARENT VIEW */}
        {role === 'PARENT' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. 목표 포인트 설정기 (부모) */}
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-3xl shadow-sm border border-amber-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-amber-900 flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-2 text-amber-600" />
                  1. 환전 기준 (목표 포인트) 설정
                </h2>
                <p className="text-sm text-amber-700 mt-1">자녀가 이 포인트를 달성하면 현금 용돈으로 환전해 줍니다.</p>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-amber-200">
                <input 
                  type="number" 
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value) || 0)}
                  className="w-24 text-right outline-none font-extrabold text-amber-600 text-lg"
                />
                <span className="font-bold text-amber-900">P</span>
              </div>
            </div>

            {/* 2. 미션 발급기 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <PlusCircleIcon className="w-6 h-6 mr-2 text-indigo-500" />
                2. 미션 부여 및 보상 설정
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="예: 오늘 할머니께 3분 이상 안부전화 드리기" 
                  value={newMissionTitle}
                  onChange={(e) => setNewMissionTitle(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input 
                  type="number" 
                  placeholder="보상 포인트 (예: 500)" 
                  value={newMissionPoints}
                  onChange={(e) => setNewMissionPoints(Number(e.target.value) || '')}
                  className="w-full sm:w-40 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={handleAddMission}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                >
                  배포하기
                </button>
              </div>
            </div>

            {/* 승인 대기 리스트 */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CheckBadgeIcon className="w-6 h-6 mr-2 text-rose-500" />
                팩트체크 및 승인 대기
              </h2>
              <div className="space-y-4">
                {missions.filter(m => m.status === 'REQUESTED').map(mission => (
                  <div key={mission.id} className="bg-white rounded-2xl shadow-md shadow-rose-100 border border-rose-100 p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">11살 아들</span>
                        <span className="text-rose-500 font-extrabold text-sm">+{mission.points}P</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{mission.title}</h3>
                      <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600">
                        💬 "{mission.comment}"
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleApprove(mission.id)}
                        className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-transform active:scale-95"
                      >
                        승인 (지급)
                      </button>
                    </div>
                  </div>
                ))}
                {missions.filter(m => m.status === 'REQUESTED').length === 0 && (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    현재 승인 대기 중인 미션이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 용돈 환전 요청 승인 (부모 패널) */}
            {isExchangeRequested && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4 animate-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2" />
                    용돈 환전 요청 도착!
                  </h3>
                  <p className="text-amber-100 text-sm">11살 아들이 목표({targetItem})를 달성하여 {targetPoints.toLocaleString()}P 환전을 요청했습니다.</p>
                </div>
                <button 
                  onClick={() => {
                    alert('토스 송금 완료! 자녀의 포인트가 차감됩니다.');
                    setCurrentPoints(prev => Math.max(0, prev - targetPoints));
                    setIsExchangeRequested(false);
                  }}
                  className="w-full sm:w-auto bg-white text-amber-600 font-extrabold py-3 px-6 rounded-xl hover:bg-amber-50 transition-colors whitespace-nowrap"
                >
                  토스 송금 및 포인트 차감
                </button>
              </div>
            )}
          </div>
        )}

        {/* CHILD VIEW */}
        {role === 'CHILD' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 내 지갑 (Wallet) */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-8 text-amber-950 shadow-xl shadow-amber-200/50 relative overflow-hidden">
              <SparklesIcon className="absolute top-4 right-4 w-24 h-24 text-amber-300 opacity-50" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="text-sm font-bold text-amber-800/80 mb-1">현재 내 지갑</div>
                    <div className="text-5xl font-extrabold tracking-tight">
                      {currentPoints.toLocaleString()} <span className="text-2xl">P</span>
                    </div>
                  </div>
                </div>

                {/* Target Editor */}
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-5 border border-white/40 mt-4">
                  {!isEditingTarget ? (
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-3">
                         <div className="text-sm font-bold text-amber-900 flex items-center">
                           🎯 나의 목표: <span className="text-lg font-extrabold bg-white/60 px-3 py-1 rounded-lg ml-2 shadow-sm">{targetItem} ({targetPoints.toLocaleString()}P)</span>
                         </div>
                         <button onClick={() => setIsEditingTarget(true)} className="bg-amber-100 text-amber-800 text-xs px-3 py-2 rounded-lg font-bold shadow-sm hover:bg-amber-200 flex items-center">
                           <PencilSquareIcon className="w-4 h-4 mr-1" />
                           목표 변경
                         </button>
                      </div>
                      <div className="flex justify-between items-center mt-2 mb-1">
                        <span className="text-xs font-bold text-amber-800">진행률</span>
                        <span className="text-sm font-extrabold text-amber-900">{progressPercent}%</span>
                      </div>
                      <div className="h-4 bg-amber-900/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-white to-amber-100 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-amber-800 text-right">
                        목표까지 {Math.max(0, targetPoints - currentPoints).toLocaleString()}P 남았어요!
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-amber-100">
                      <div className="text-sm font-bold text-amber-900 mb-3">🎯 무엇을 위해 포인트를 모을까요?</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="text" 
                          placeholder="사고 싶은 물건 (예: 닌텐도 스위치)"
                          value={tempTargetItem} 
                          onChange={e => setTempTargetItem(e.target.value)}
                          className="flex-1 text-sm px-4 py-3 rounded-lg bg-white border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none text-slate-800 font-medium"
                        />
                        <div className="flex items-center space-x-2">
                          <input 
                            type="number" 
                            placeholder="목표 포인트"
                            value={tempTargetPoints} 
                            onChange={e => setTempTargetPoints(Number(e.target.value))}
                            className="w-32 text-sm px-4 py-3 rounded-lg bg-white border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none text-slate-800 font-bold"
                          />
                          <span className="font-bold text-amber-800">P</span>
                        </div>
                        <button onClick={handleSaveTarget} className="bg-amber-600 text-white text-sm px-6 py-3 rounded-lg font-bold shadow-md hover:bg-amber-700 transition-colors">
                          설정 완료
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {progressPercent >= 100 && (
                    <div className="mt-4 animate-in fade-in zoom-in duration-500">
                      {!isExchangeRequested ? (
                        <button 
                          onClick={() => setIsExchangeRequested(true)} 
                          className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex justify-center items-center space-x-2"
                        >
                          <GiftIcon className="w-6 h-6" />
                          <span>목표 달성! 용돈(현금) 환전 요청하기 🎉</span>
                        </button>
                      ) : (
                        <div className="w-full bg-amber-100/50 text-amber-900 font-bold py-3 rounded-xl text-center border border-amber-300/50 flex justify-center items-center space-x-2 backdrop-blur-sm">
                          <CheckCircleIcon className="w-6 h-6 text-amber-600" />
                          <span>부모님께 송금을 요청했어요! ⏳</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 수행 가능 미션 리스트 */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <GiftIcon className="w-6 h-6 mr-2 text-amber-500" />
                오늘의 미션 보물상자
              </h2>
              <div className="space-y-4">
                {missions.filter(m => m.status === 'AVAILABLE').map(mission => (
                  <div key={mission.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-300 transition-colors">
                    <div>
                      <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md mb-2">보상 {mission.points}P</div>
                      <h3 className="text-lg font-bold text-slate-900">{mission.title}</h3>
                    </div>
                    <button 
                      onClick={() => handleRequest(mission.id)}
                      className="w-full sm:w-auto flex justify-center items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-transform active:scale-95"
                    >
                      <ArrowUpCircleIcon className="w-5 h-5" />
                      <span>완료 요청 쏘기</span>
                    </button>
                  </div>
                ))}
                {missions.filter(m => m.status === 'AVAILABLE').length === 0 && (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    오늘은 모든 미션을 클리어했어요! 🎉
                  </div>
                )}
              </div>
            </div>
            
            {/* 승인 대기 중 미션 (읽기 전용) */}
            {missions.filter(m => m.status === 'REQUESTED').length > 0 && (
              <div className="opacity-60">
                <h3 className="text-sm font-bold text-slate-500 mb-3">부모님 확인 대기 중 ⏳</h3>
                <div className="space-y-3">
                  {missions.filter(m => m.status === 'REQUESTED').map(mission => (
                    <div key={mission.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between">
                      <span className="text-slate-700 font-medium line-through">{mission.title}</span>
                      <span className="text-slate-500 font-bold">{mission.points}P</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
