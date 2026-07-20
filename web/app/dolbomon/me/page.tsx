'use client';

import React, { useState } from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';

type CheckValue = 1 | 2 | 3 | 4 | 5;

type WeeklyCheck = {
  sleep: CheckValue;
  fatigue: CheckValue;
  stress: CheckValue;
};

const INITIAL_CHECK: WeeklyCheck = {
  sleep: 2,
  fatigue: 4,
  stress: 4,
};

const getBurnoutLevel = (check: WeeklyCheck) => {
  const score = (6 - check.sleep) + check.fatigue + check.stress;
  if (score <= 5) return { level: '낮음', color: '#16C47F', desc: '이번 주는 비교적 건강한 상태입니다.' };
  if (score <= 9) return { level: '보통', color: '#FFB020', desc: '경미한 소진 신호가 있으니 휴식을 확보하세요.' };
  return { level: '높음', color: '#FF5C7A', desc: '심각한 소진 상태입니다. 적극적인 도움 요청이 필요합니다.' };
};

export default function MePage() {
  const [check, setCheck] = useState<WeeklyCheck>(INITIAL_CHECK);
  const burnout = getBurnoutLevel(check);

  const updateCheck = (key: keyof WeeklyCheck, val: CheckValue) => {
    setCheck(prev => ({ ...prev, [key]: val }));
  };

  const handleShare = () => {
    const template = `[돌봄온] 가족 역할 분담 요청
이번 주 부모님 돌봄 현황:
- 전화 상담: 8회
- 병원 동행: 2회
- 이동 시간: 4시간
- 서류 처리: 3건

현재 소진 상태가 '${burnout.level}' 단계입니다. 역할 분담이 필요합니다.`;
    
    if (navigator.share) {
      navigator.share({
        title: '돌봄 분담 요청',
        text: template,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(template);
      alert('도움 요청 메시지가 클립보드에 복사되었습니다! 카카오톡에 붙여넣어 공유하세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-32">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        
        {/* ── 헤더 ── */}
        <div>
          <h1 className="text-[32px] font-bold text-[#111827]">보호자체크인</h1>
          <p className="text-[14px] text-[#6B7280] mt-1">보호자 상태 및 돌봄 분담 지원</p>
        </div>

        {/* ── 보호자 상태 요약 ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-4">
          <h3 className="text-[18px] font-semibold text-[#111827]">이번주 소진 신호</h3>
          
          <div className="flex justify-between items-center bg-[#F8F9FC] p-4 rounded-2xl border border-slate-100 gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[14px] text-[#6B7280] block font-medium">돌봄 위험도</span>
              <span className="text-[13px] text-[#6B7280] block mt-0.5 leading-tight">{burnout.desc}</span>
            </div>
            <span
              className="text-[13px] font-bold px-2.5 py-1 rounded-lg text-white flex-shrink-0 whitespace-nowrap"
              style={{ backgroundColor: burnout.color }}
            >
              {burnout.level}
            </span>
          </div>

          {/* 게이지 바들 */}
          <div className="space-y-4">
            {[
              { key: 'sleep', label: '수면 충분도', minText: '부족', maxText: '충분' },
              { key: 'fatigue', label: '피로 누적도', minText: '낮음', maxText: '심함' },
              { key: 'stress', label: '정서적 스트레스', minText: '낮음', maxText: '높음' },
            ].map(item => {
              const val = check[item.key as keyof WeeklyCheck];
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex justify-between text-[14px] font-medium text-[#111827]">
                    <span>{item.label}</span>
                    <span className="text-[#5B3DF5] font-semibold">{val}단계</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => updateCheck(item.key as keyof WeeklyCheck, v as CheckValue)}
                        className={`flex-1 h-3.5 rounded-full transition-all ${
                          v <= val
                            ? 'bg-[#5B3DF5]'
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[12px] text-[#6B7280]">
                    <span>{item.minText}</span>
                    <span>{item.maxText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 신규: 보호자 리포트 ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-4">
          <h3 className="text-[18px] font-semibold text-[#111827]">보호자 리포트 (이번주)</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '전화 상담', count: '8회', emoji: '📞' },
              { label: '병원 동행', count: '2회', emoji: '🏥' },
              { label: '이동 시간', count: '4시간', emoji: '🚗' },
              { label: '서류 처리', count: '3건', emoji: '📄' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <span className="text-2xl">{stat.emoji}</span>
                <div>
                  <span className="text-[12px] text-[#6B7280] block font-medium">{stat.label}</span>
                  <span className="text-[16px] font-bold text-[#111827] block mt-0.5">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 보호자 리포트 하단에만 프리미엄 전략 노출 */}
          <div className="bg-[#5B3DF5]/5 p-4 rounded-2xl border border-[#5B3DF5]/10 mt-2">
            <span className="inline-block text-[12px] font-bold bg-[#5B3DF5] text-white px-2 py-0.5 rounded mb-2">
              PREMIUM
            </span>
            <p className="text-[14px] font-semibold text-[#111827]">상세 활동시간 시계열 분석</p>
            <p className="text-[12px] text-[#6B7280] mt-1 leading-relaxed">
              매주 소요된 간병 시간과 이동 루트를 다이어리로 자동 분석하여 가족 간 공평한 분담용 데이터 리포트를 구성합니다.
            </p>
          </div>
        </div>

        {/* ── 가족 도움 요청 및 공유 ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-4">
          <h3 className="text-[18px] font-semibold text-[#111827]">가족 도움 요청</h3>
          <p className="text-[14px] text-[#6B7280] leading-relaxed">
            이번 주 축적된 돌봄 업무량 통계를 메시지로 전환하여 가족 카카오톡으로 간편하게 도움을 요청해 보세요.
          </p>
          <button
            onClick={handleShare}
            className="w-full bg-[#16C47F] text-white text-[17px] font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99]"
          >
            <ShareIcon className="w-5 h-5" />
            <span>가족에게 도움 요청하기</span>
          </button>
        </div>

      </div>
    </div>
  );
}
