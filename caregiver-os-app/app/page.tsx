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
  const [ageError, setAgeError] = useState<string | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'age') {
      if (value) setAgeError(null);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
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
    if (!formData.age || isNaN(Number(formData.age))) {
      setAgeError('부모님 연세를 입력해주세요.');
      return;
    }
    
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
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href='/'}>
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              가족돌봄OS
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600 items-center">
              <span className="font-semibold text-indigo-600">장기요양계산기</span>
              <a href="/mission" className="hover:text-indigo-600 transition-colors">자녀효도퀘스트</a>
              <a href="/os" className="hover:text-indigo-600 transition-colors">가족돌봄OS</a>
              <a href="/donate" className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors font-bold">☕ 커피응원</a>
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

      {/* Main Content */}
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-10">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold mb-5 shadow-sm border border-emerald-200">
                  <CalculatorIcon className="w-5 h-5" />
                  <span>세 아이 엄마가 만든 사회기여형 무료 앱</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 leading-tight">
                  나의 가족돌봄 비용은<br />얼마나 나올까요?
                </h1>
                <p className="text-xl md:text-2xl font-extrabold text-rose-500 mb-5 tracking-tight">
                  "돌보는 사람이 무너지지 않게."
                </p>
                <p className="text-md text-slate-600 max-w-lg mx-auto bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                  부모님 요양과 아이들 육아 사이에서 고단한 가족들을 돕기 위해, 상업적 광고나 결제 요구 없이 순수하게 운영됩니다.<br/>딱 5가지만 알려주시면 놓치고 있는 지원금 혜택을 따뜻하게 찾아드릴게요.
                </p>
              </div>

              {/* App Download Banner */}
              <div className="bg-gradient-to-r from-rose-50 to-indigo-50 border border-indigo-100/80 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-indigo-100/40 rounded-full blur-2xl"></div>
                <div className="flex items-center space-x-4 relative z-10 text-left">
                  <span className="text-4xl">📱</span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">가족돌봄OS 모바일 앱 출시!</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      매일의 부모님 케어 스케줄 알림과 간편 지출 정산 기능이 탑재되었습니다.<br />
                      Android 폰 전용 간편 설치 패키지(APK)를 직접 다운로드해 보세요.
                    </p>
                  </div>
                </div>
                <a 
                  href="/caregiver-os.apk" 
                  download 
                  className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-indigo-500/10 active:scale-95 text-sm whitespace-nowrap relative z-10"
                >
                  Android 앱 다운로드
                </a>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                
                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">부모님 연세</label>
                      <input 
                        type="number" 
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="예: 75" 
                        className={`w-full px-4 py-3 rounded-xl border ${ageError ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'} transition-all shadow-sm`}
                      />
                      {ageError && (
                        <p className="text-xs font-semibold text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">{ageError}</p>
                      )}
                    </div>
                    
                    {/* Region */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">거주지역</label>
                      <select name="region" value={formData.region} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="서울">서울</option>
                        <option value="경기">경기</option>
                        <option value="인천">인천</option>
                        <option value="대전">대전</option>
                        <option value="기타">기타 지역</option>
                      </select>
                    </div>

                    {/* Disease */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">질환 상태</label>
                      <select name="disease" value={formData.disease} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="NORMAL">해당 없음 (정상)</option>
                        <option value="DEMENTIA">치매 (초기~중증)</option>
                        <option value="STROKE">뇌졸중 및 거동 불편</option>
                        <option value="PARKINSON">파킨슨 등 노인성 질환</option>
                        <option value="FRAILTY">일반 노환 (기력 저하)</option>
                      </select>
                    </div>

                    {/* Care Type (Dropdown 1) */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">원하는 돌봄 형태 선택</label>
                      <select name="careType" value={formData.careType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="FACILITY">[ 요양원 입소 원함 ] 부모님이 시설에 입소하여 24시간 케어받는 형태</option>
                        <option value="HOME">[ 집에서 방문요양 원함 ] 요양보호사님이 집으로 찾아와 하루 몇 시간씩 돌봐주는 형태</option>
                      </select>
                    </div>

                    {/* Income Level (Dropdown 2) */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700">현재 경제적 상황 선택</label>
                      <select name="incomeLevel" value={formData.incomeLevel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none bg-white">
                        <option value="GENERAL">[ 일반 ] 대다수 직장인 및 세대주</option>
                        <option value="REDUCED_40">[ 건강보험료 40% 감경 ] 건보료를 조금 감경받고 있거나 중간 이하 소득</option>
                        <option value="REDUCED_60">[ 건강보험료 60% 감경 ] 건보료 부과 점수가 많이 낮거나 차상위 계층</option>
                        <option value="BASIC">[ 기초/의료급여 수급권자 ] 의료급여 수급권자 또는 기초생활수급자</option>
                        <option value="GENERAL_UNKNOWN">[ 잘 모름 ] (일반으로 안전하게 계산)</option>
                      </select>
                    </div>

                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleCalculate}
                      disabled={loading}
                      className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-rose-200 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-400 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI가 숨은 혜택을 정밀 분석 중입니다...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          내 부담금 및 손해액 확인하기 <ArrowRightIcon className="ml-2 w-5 h-5" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Calculation Criteria & Tiers */}
              <div className="mt-8 bg-white rounded-3xl shadow-lg shadow-slate-100 p-6 border border-slate-100 relative overflow-hidden">
                <button 
                  onClick={() => setShowCriteria(!showCriteria)}
                  className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-indigo-600 transition-colors text-lg"
                >
                  <span className="flex items-center space-x-2">
                    <CalculatorIcon className="w-6 h-6 text-indigo-500" />
                    <span>부모님 케어 나침반 V2 계산 기준 & 4대 감경 티어 안내</span>
                  </span>
                  <span className="text-sm font-medium text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                    {showCriteria ? '접기 ▲' : '자세히 보기 ▼'}
                  </span>
                </button>

                {showCriteria && (
                  <div className="mt-6 space-y-6 border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                      본 계산기는 보건복지부 고시 최신 장기요양보험 수가 및 소득별 본인부담 감경 요율을 기준으로 설계되었습니다. AI 엔진이 부모님의 연세, 거주지역, 질환 상태, 소득 수준을 정밀 조합하여 매월 놓치기 쉬운 혜택과 실제 지출액을 모의 산출합니다.
                    </p>

                    {/* Table of 4 Reduction Tiers */}
                    <div className="space-y-3 text-left">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                        <span>1. 4대 소득 감경 티어별 본인부담율 (보건복지부 기준)</span>
                      </h3>
                      <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold">
                              <th className="p-3">감경 구분 (티어)</th>
                              <th className="p-3">방문요양 (재가급여)</th>
                              <th className="p-3">요양원 입소 (시설급여)</th>
                              <th className="p-3">해당 대상 조건 예시</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-900">일반 대상자</td>
                              <td className="p-3 text-indigo-600 font-semibold">15%</td>
                              <td className="p-3 text-indigo-600 font-semibold">20%</td>
                              <td className="p-3 text-slate-500">직장가입자 평균 건보료 초과 세대</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-900">40% 감경자</td>
                              <td className="p-3 text-indigo-600 font-semibold">9%</td>
                              <td className="p-3 text-indigo-600 font-semibold">12%</td>
                              <td className="p-3 text-slate-500">건보료 순위 희망 감경 구간 (중하위 소득)</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-900">60% 감경자</td>
                              <td className="p-3 text-indigo-600 font-semibold">6%</td>
                              <td className="p-3 text-indigo-600 font-semibold">8%</td>
                              <td className="p-3 text-slate-500">차상위계층, 생계곤란 감경 대상자</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-3 font-semibold text-slate-900">기초/의료 수급자</td>
                              <td className="p-3 text-rose-600 font-semibold">0% (면제)</td>
                              <td className="p-3 text-rose-600 font-semibold">0% (면제)</td>
                              <td className="p-3 text-slate-500">국민기초생활 보장법상 수급권자</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Standard Costs and Non-benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                          <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                          <span>2. 공단 기본 수가 (한도액) 기준</span>
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
                          <div className="flex justify-between">
                            <span className="font-semibold">요양원 입소 (시설):</span>
                            <span>월 2,100,000원 상당</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">방문요양 (재가):</span>
                            <span>월 1,700,000원 상당</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                            ※ 등급별(1~5등급) 월 한도액 및 주야간보호 이용 비율에 따른 평균 표준 비용입니다.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                          <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                          <span>3. 비급여 항목 예상 기준</span>
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
                          <div className="flex justify-between">
                            <span className="font-semibold">요양원 비급여 (식대 등):</span>
                            <span>월 약 400,000원 추가</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">방문요양 비급여 (기타):</span>
                            <span>월 약 100,000원 추가</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                            ※ 요양원 내 비급여 식대(상급침실비, 이·미용비 등) 및 가정 방문 시 자부담 추가 지출액의 전국 평균 추정치입니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Potential Loss Criteria */}
                    <div className="space-y-3 text-left">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                        <span>4. 놓치면 손해 보는 국가 지원금 기준</span>
                      </h3>
                      <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50 text-xs text-slate-700 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-rose-600">기초연금 (만 65세 이상 대상):</span>
                          <span>월 최대 334,810원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-indigo-600">장기요양 공단부담 지원금:</span>
                          <span>등급 획득 시 수가의 80%~100% 국비 지원</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                          ※ 본인부담금 0%~20%를 제외한 나머지 80%~100%의 비용은 전액 국민건강보험공단 장기요양기금에서 지원됩니다. 등급 미신청 시 이 혜택을 전액 사비로 지출하게 되므로 "놓치면 손해 보는 금액"으로 산출됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
