'use client';

import React, { useState } from 'react';
import { CalculatorIcon, HeartIcon, ArrowRightIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Types
type FormData = {
  age: number | '';
  region: string;
  disease: string;
  incomeLevel: string; // GENERAL | REDUCED_40 | REDUCED_60 | BASIC
  careType: string;    // FACILITY | HOME
};

type ResultData = {
  actualRatePercent: number;
  userMonthlyCost: number;
  potentialLossCost: number;
};

export default function CaregiverOS() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    region: '대전',
    disease: 'DEMENTIA',
    incomeLevel: 'GENERAL',
    careType: 'HOME',
  });
  
  const [results, setResults] = useState<ResultData | null>(null);
  const [report, setReport] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  /**
   * 가족돌봄OS - 최신화된 부모님 케어 나침반 연산 엔진
   */
  const calculateCaregiverOSV2 = (age: number, incomeLevel: string, careType: string, disease: string): ResultData => {
      // 1. 2026년 기준 공단 표준 월 수가
      const baseStandardCost = (careType === 'FACILITY') ? 2100000 : 1700000;
      
      // 2. 최신화된 소득 티어별/서비스별 본인부담 요율 정밀 매칭
      let rate = 0.20; 
      
      if (careType === 'FACILITY') {
          if (incomeLevel === 'GENERAL')    rate = 0.20;
          if (incomeLevel === 'REDUCED_40') rate = 0.12;
          if (incomeLevel === 'REDUCED_60') rate = 0.08;
          if (incomeLevel === 'BASIC')      rate = 0.00;
      } else { // HOME
          if (incomeLevel === 'GENERAL')    rate = 0.15;
          if (incomeLevel === 'REDUCED_40') rate = 0.09;
          if (incomeLevel === 'REDUCED_60') rate = 0.06;
          if (incomeLevel === 'BASIC')      rate = 0.00;
      }

      // 3. 비급여 항목 예외 처리
      const nonBenefitCost = (careType === 'FACILITY') ? 400000 : 100000;

      // 4. 최종 월 예상 본인 부담금 산출
      const pureBenefitComponent = baseStandardCost * rate;
      const finalUserMonthlyCost = pureBenefitComponent + nonBenefitCost;

      // 5. "놓치면 손해 보는 금액" 알고리즘
      let monthlyLoss = 0;
      
      if (age >= 65) {
          monthlyLoss += 334810; // 2026 기초연금
      }
      
      if (disease !== 'NORMAL') {
          monthlyLoss += (baseStandardCost * (1 - rate));
      }

      return {
          actualRatePercent: rate * 100,
          userMonthlyCost: Math.round(finalUserMonthlyCost),
          potentialLossCost: Math.round(monthlyLoss)
      };
  };

  const handleCalculate = async () => {
    if (!formData.age) return alert('나이를 입력해주세요.');
    
    setLoading(true);
    const calculatedResults = calculateCaregiverOSV2(
      Number(formData.age), 
      formData.incomeLevel === 'GENERAL_UNKNOWN' ? 'GENERAL' : formData.incomeLevel, 
      formData.careType, 
      formData.disease
    );
    setResults(calculatedResults);

    // Mocking Dify API response
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const careTypeText = formData.careType === 'FACILITY' ? '요양원 입소(시설급여)' : '방문요양(재가급여)';
      
      const difyMockReport = `
<h1 class="text-rose-600 text-2xl font-bold mb-4">🚨 이번 달 신청 안 하면 매월 최대 <strong>${calculatedResults.potentialLossCost.toLocaleString()}원</strong>(추정) 손해 발생 가능성!</h1>
<p class="mb-4 text-slate-800 leading-relaxed">보호자님, 입력해주신 정보(${formData.region} 거주, ${formData.age}세)를 바탕으로 <strong>AI가 추정한 예상 결과</strong>입니다.</p>

<h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 flex items-center">💰 월 예상 비용 내역 (${careTypeText})</h3>
<ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
  <li><strong>적용 예상 감경 요율:</strong> <strong class="text-indigo-600">${calculatedResults.actualRatePercent}%</strong></li>
  <li><strong>비급여 포함 월 예상 본인 부담금:</strong> <strong class="text-rose-600">약 ${calculatedResults.userMonthlyCost.toLocaleString()}원</strong></li>
</ul>

<blockquote class="border-l-4 border-amber-400 pl-4 py-3 my-6 bg-amber-50 text-amber-900 rounded-r-lg shadow-sm text-sm">
  <strong>⚠️ 유의사항:</strong> 위 산정 금액은 공단 평균 수가를 기반으로 <strong>AI가 추정한 예상치</strong>입니다. 실제 청구액은 어르신의 정확한 장기요양등급, 실제 이용 시간, 시설별 비급여 항목(식대 등)에 따라 <strong>차이가 발생할 수 있습니다.</strong><br/><br/>
  다만, 등급을 신청하지 않고 100% 사비로 간병을 해결하실 경우 매월 약 <strong>${calculatedResults.potentialLossCost.toLocaleString()}원</strong> 규모의 정부 지원 혜택을 놓치게 될 것으로 예상됩니다.
</blockquote>

<hr class="my-8 border-slate-200" />

<p class="font-bold text-indigo-700 text-lg mb-2">💡 AI 케어 코치의 한마디</p>
<p class="text-slate-700 leading-relaxed">예상보다 큰 혜택, 더 이상 미루지 마시고 장기요양등급 신청을 준비하세요! 복잡한 행정 절차는 <strong>가족돌봄OS</strong>가 매월 캘린더로 챙겨드립니다.</p>
      `;
      setReport(difyMockReport);
      setStep(2);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLink = () => {
    alert('카카오채널 연동 API를 호출하여 UUID를 획득하고 User_Table에 적재합니다.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              가족돌봄OS
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 items-center">
            <span className="font-semibold text-indigo-600">장기요양계산기</span>
            <a href="/caregiver/mission" className="hover:text-indigo-600 transition-colors">자녀효도퀘스트</a>
            <a href="/caregiver/os" className="hover:text-indigo-600 transition-colors">가족돌봄OS</a>
            <a href="/caregiver/donate" className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors font-bold">☕ 커피응원</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-5">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm border border-emerald-200">
                  <CalculatorIcon className="w-4 h-4" />
                  <span>세 아이 엄마가 만든 착한 무료 앱</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-slate-900 leading-tight">
                  나의 가족돌봄 비용은 얼마나 나올까요?
                </h1>
                <p className="text-base font-extrabold text-rose-500 mb-2 tracking-tight">
                  "돌보는 사람이 무너지지 않게."
                </p>
                <p className="text-xs text-slate-600 max-w-lg mx-auto bg-orange-50/50 p-2 rounded-xl border border-orange-100/50">
                  부모님 요양과 아이들 육아 사이에서 고단한 가족들을 돕기 위해, 상업적 광고나 결제 요구 없이 순수하게 운영됩니다. 딱 5가지만 알려주시면 놓치고 있는 지원금 혜택을 찾아드릴게요.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-5 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                
                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Age */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">부모님 연세</label>
                      <input 
                        type="number" 
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="예: 75" 
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    
                    {/* Region */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">거주지역</label>
                      <select name="region" value={formData.region} onChange={handleInputChange} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="서울">서울</option>
                        <option value="경기">경기</option>
                        <option value="인천">인천</option>
                        <option value="대전">대전</option>
                        <option value="기타">기타 지역</option>
                      </select>
                    </div>

                    {/* Disease */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">질환 상태</label>
                      <select name="disease" value={formData.disease} onChange={handleInputChange} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="NORMAL">해당 없음 (정상)</option>
                        <option value="DEMENTIA">치매 (초기~중증)</option>
                        <option value="STROKE">뇌졸중 및 거동 불편</option>
                        <option value="PARKINSON">파킨슨 등 노인성 질환</option>
                        <option value="FRAILTY">일반 노환 (기력 저하)</option>
                      </select>
                    </div>

                    {/* Care Type (Dropdown 1) */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">돌봄 형태</label>
                      <select name="careType" value={formData.careType} onChange={handleInputChange} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="FACILITY">[ 요양원 ] 부모님이 입소하여 24시간 케어</option>
                        <option value="HOME">[ 방문요양 ] 보호사님이 집으로 찾아오는 케어</option>
                      </select>
                    </div>

                    {/* Income Level (Dropdown 2) */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">현재 경제적 상황</label>
                      <select name="incomeLevel" value={formData.incomeLevel} onChange={handleInputChange} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="GENERAL">[ 일반 ] 대다수 직장인 및 세대주</option>
                        <option value="REDUCED_40">[ 건보료 40% 감경 ] 중간 이하 소득</option>
                        <option value="REDUCED_60">[ 건보료 60% 감경 ] 차상위 계층</option>
                        <option value="BASIC">[ 기초수급권자 ] 의료급여/기초생활수급</option>
                        <option value="GENERAL_UNKNOWN">[ 모름 ] (일반으로 계산)</option>
                      </select>
                    </div>

                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={handleCalculate}
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-rose-200 text-base font-bold text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-400 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center text-sm">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI 정밀 분석 중...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          내 부담금 확인하기 <ArrowRightIcon className="ml-2 w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <button 
                onClick={() => setStep(1)}
                className="mb-6 text-sm text-slate-500 hover:text-slate-800 flex items-center transition-colors"
              >
                ← 다시 계산하기
              </button>
              
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-rose-500 to-indigo-600 p-8 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="w-6 h-6 text-rose-100" />
                    <span className="font-medium text-rose-100">AI 정밀 분석 완료</span>
                  </div>
                  <h2 className="text-3xl font-bold">
                    맞춤형 혜택 리포트가 <br />도착했습니다!
                  </h2>
                </div>
                
                {/* HTML Content rendered from Dify Engine */}
                <div 
                  className="p-8 max-w-none"
                  dangerouslySetInnerHTML={{ __html: report }}
                />

                {/* Kakao Channel Integration Bridge */}
                <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">매월 바뀌는 지원금 정책, 놓치지 마세요</h3>
                  <p className="text-sm text-slate-500 mb-6">회원가입 없이 카카오톡으로 우리가족 맞춤 알림을 보내드립니다.</p>
                  
                  <button 
                    onClick={handleKakaoLink}
                    className="w-full sm:w-auto inline-flex justify-center items-center py-4 px-8 rounded-xl shadow-md text-base font-bold text-slate-900 bg-[#FEE500] hover:bg-[#FDD800] focus:outline-none transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 opacity-80" />
                    내 카톡으로 행정/의료 알림 예약하기
                  </button>
                  
                  <div className="mt-6 text-xs text-slate-400 flex justify-center items-center space-x-4">
                    <a href="#" className="hover:underline">서비스 이용약관</a>
                    <a href="#" className="hover:underline">개인정보 처리방침</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
