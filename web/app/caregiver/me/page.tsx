'use client';

import React, { useState } from 'react';
import { 
  FaceSmileIcon, 
  ClockIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  MoonIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { generateCaregiverReport } from '../../actions/dify';

export default function MePage() {
  const [sleepHours, setSleepHours] = useState(5.5);
  const [stressLevel, setStressLevel] = useState(75);
  const [careHours, setCareHours] = useState(8);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(28800); // 8 hours
  const [aiReport, setAiReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}시간 ${mins}분`;
  };

  const handleAskAIAdvice = async () => {
    setLoading(true);
    try {
      // Reuse generateCaregiverReport with a customized profile or invoke general advisor
      const response = await generateCaregiverReport({
        age: 78, // parent
        region: '대전',
        disease: '치매',
        incomeLevel: 'GENERAL',
        careType: 'HOME',
        actualRatePercent: 15,
        userMonthlyCost: 350000,
        potentialLossCost: 1200000,
      });

      // Format custom advisor response based on sleep/stress
      setAiReport(`
        <h4 class="text-rose-600 font-bold mb-2">🚨 보호자 멘탈 경보: 피로 위험 단계</h4>
        <p class="text-slate-700 text-xs leading-relaxed mb-3">
          현재 수면 시간 <strong>${sleepHours}시간</strong> 및 스트레스 지수 <strong>${stressLevel}%</strong>는 번아웃(Burnout) 발생 임계치에 가까운 수준입니다.
        </p>
        <ul class="list-disc pl-5 text-slate-700 text-xs mb-3 space-y-1">
          <li><strong>추천 처방 1:</strong> 이번 주 방문요양센터 시간을 하루 1시간 추가하여 온전한 휴식 확보</li>
          <li><strong>추천 처방 2:</strong> 건강보험공단 단기보호 제도(연간 9일~18일)를 활용한 보호자 리프레시 휴가</li>
        </ul>
        <p class="text-[10px] text-slate-400">돌봄온 3.0 AI 케어비서 드림</p>
      `);
    } catch (error) {
      console.error(error);
      alert('AI 조언을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 max-w-md mx-auto pb-24">
      
      {/* Care Timer Widget */}
      <section className="mb-6 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
          <ClockIcon className="w-5 h-5 text-indigo-600" />
          <span>오늘 나의 돌봄 시간 기록</span>
        </h2>

        <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
          <span className="text-[10px] font-extrabold text-slate-400 block mb-1">누적 기록 시간</span>
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            {formatTime(timerSeconds)}
          </span>
        </div>

        <button 
          onClick={toggleTimer}
          className={`w-full py-3 text-xs font-bold rounded-xl transition-all ${
            isTimerRunning 
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-100' 
              : 'bg-slate-950 text-white hover:bg-slate-800 shadow-md shadow-slate-200'
          }`}
        >
          {isTimerRunning ? '돌봄 기록 일시정지' : '오늘 돌봄 기록 개시'}
        </button>
      </section>

      {/* Wellness Self Checklist */}
      <section className="mb-6 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
          <FaceSmileIcon className="w-5 h-5 text-indigo-600" />
          <span>나의 웰니스 리포트</span>
        </h2>

        <div className="space-y-4">
          {/* Sleep hours */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <MoonIcon className="w-4 h-4 text-indigo-500" />
                <span>평균 수면 시간</span>
              </span>
              <span>{sleepHours}시간</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="10" 
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-indigo-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">성인 권장 수면시간은 7~8시간입니다.</span>
          </div>

          {/* Stress level */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" />
                <span>스트레스 체감 수준</span>
              </span>
              <span className="text-rose-600">{stressLevel}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-rose-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* AI Care Advisor Advice */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-3.5 flex items-center gap-1.5">
            <SparklesIcon className="w-5 h-5 text-indigo-600" />
            <span>AI 보호자 피로도 분석</span>
          </h3>

          {aiReport ? (
            <div 
              className="bg-rose-50/40 p-4 border border-rose-100/50 rounded-2xl animate-in fade-in duration-500"
              dangerouslySetInnerHTML={{ __html: aiReport }}
            />
          ) : (
            <div>
              <p className="text-xs text-slate-500 leading-normal mb-4 font-semibold">
                수면과 스트레스 분석을 기반으로 지친 보호자를 위한 맞춤 대처 방안을 제공합니다.
              </p>
              <button 
                onClick={handleAskAIAdvice}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100"
              >
                {loading ? 'AI 분석 리포트 생성 중...' : '맞춤 인공지능 진단 받기'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
