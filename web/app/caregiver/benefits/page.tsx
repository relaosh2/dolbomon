'use client';

import React, { useState } from 'react';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 💰 돌봄 혜택 — 정부지원금 자동 계산 + 복지혜택 알리미
// ─────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;
type BenefitResult = {
  title: string;
  amount: string;
  condition: string;
  apply: string;
  urgent: boolean;
};

const WELFARE_BENEFITS = [
  {
    category: '장기요양 급여',
    color: 'bg-indigo-50 border-indigo-200',
    titleColor: 'text-indigo-800',
    items: [
      { name: '시설급여 (요양원)', max: '월 208만원', grade: '1~2등급', desc: '요양원 입소 시 본인부담 20%만 내면 됩니다' },
      { name: '재가급여 (방문요양)', max: '월 160만원', grade: '3~5등급', desc: '집에서 방문요양 서비스 이용 시 본인부담 15%' },
    ],
  },
  {
    category: '현금 지원',
    color: 'bg-emerald-50 border-emerald-200',
    titleColor: 'text-emerald-800',
    items: [
      { name: '기초연금', max: '월 33.4만원', grade: '만 65세 이상', desc: '소득 하위 70% 어르신 대상 매월 지급' },
      { name: '가족요양비', max: '월 18.6만원', grade: '장기요양 전등급', desc: '가족이 직접 요양하는 경우 현금 지급' },
    ],
  },
  {
    category: '의료비 감면',
    color: 'bg-rose-50 border-rose-200',
    titleColor: 'text-rose-800',
    items: [
      { name: '치매안심센터 무료 서비스', max: '연간 60만원 상당', grade: '치매 진단', desc: '치매검사, 인지강화프로그램, 쉼터 이용 무료' },
      { name: '의료급여 적용', max: '본인부담 면제', grade: '기초수급자', desc: '기초수급자는 장기요양 본인부담금 전액 면제' },
    ],
  },
];

export default function BenefitsPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    age: '',
    grade: 'NONE',
    income: 'GENERAL',
    disease: 'NONE',
    region: '대전',
  });
  const [results, setResults] = useState<BenefitResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateBenefits = () => {
    setLoading(true);
    setTimeout(() => {
      const res: BenefitResult[] = [];

      if (Number(form.age) >= 65) {
        res.push({
          title: '🎁 기초연금',
          amount: form.income === 'BASIC' || form.income === 'REDUCED_60' ? '월 최대 33.4만원' : '월 최대 33.4만원 (소득 심사)',
          condition: '만 65세 이상 소득 하위 70%',
          apply: '읍면동 주민센터 방문 또는 복지로(bokjiro.go.kr) 신청',
          urgent: form.grade === 'NONE',
        });
      }

      if (form.grade !== 'NONE') {
        const isHighGrade = ['G1', 'G2'].includes(form.grade);
        res.push({
          title: isHighGrade ? '🏠 시설급여 (요양원 입소)' : '🏡 재가급여 (방문요양)',
          amount: isHighGrade ? '월 최대 208만원 (본인부담 20%)' : '월 최대 160만원 (본인부담 15%)',
          condition: isHighGrade ? '장기요양 1~2등급' : '장기요양 3~5등급',
          apply: '국민건강보험공단 또는 복지로 신청',
          urgent: false,
        });
      }

      if (form.disease === 'DEMENTIA') {
        res.push({
          title: '🧠 치매안심센터 무료 서비스',
          amount: '연간 60만원 상당 (무료)',
          condition: '치매 진단받은 어르신',
          apply: '가까운 치매안심센터 방문 — 전화예약 후 이용',
          urgent: true,
        });
      }

      if (form.income === 'BASIC') {
        res.push({
          title: '🏥 장기요양 본인부담 면제',
          amount: '본인부담금 100% 면제',
          condition: '의료급여 수급자 (기초수급자)',
          apply: '장기요양 신청 시 자동 적용',
          urgent: false,
        });
      }

      if (res.length === 0) {
        res.push({
          title: '📋 장기요양등급 신청 추천',
          amount: '최대 월 208만원 지원 가능',
          condition: '등급 신청 후 판정 결과에 따라',
          apply: '국민건강보험공단 1577-1000 또는 방문 신청',
          urgent: true,
        });
      }

      setResults(res);
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto pb-8">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white px-5 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <span className="inline-block bg-indigo-700/60 border border-indigo-600/50 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3">
            💰 내 상황 맞춤 지원금 자동 계산
          </span>
          <h1 className="text-xl font-black leading-tight mb-2">
            받을 수 있는<br />
            <span className="text-amber-300">정부 지원금</span>을 찾아드려요
          </h1>
          <p className="text-sm text-indigo-200/90 font-medium">
            놓치면 매월 수십만원 손해
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-4">

        {/* ── Step 1: 입력 폼 ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm font-extrabold text-slate-800">부모님 상황을 알려주세요</h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">부모님 연세</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="예: 78"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">장기요양등급</label>
                <select name="grade" value={form.grade} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold">
                  <option value="NONE">미신청 / 모름</option>
                  <option value="G1">1등급</option>
                  <option value="G2">2등급</option>
                  <option value="G3">3등급</option>
                  <option value="G4">4등급</option>
                  <option value="G5">5등급 (치매)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">주요 질환</label>
                <select name="disease" value={form.disease} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold">
                  <option value="NONE">해당 없음</option>
                  <option value="DEMENTIA">치매</option>
                  <option value="STROKE">뇌졸중</option>
                  <option value="PARKINSON">파킨슨</option>
                  <option value="FRAILTY">노환 (기력 저하)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-600 block mb-1">경제적 상황</label>
                <select name="income" value={form.income} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold">
                  <option value="GENERAL">일반 (직장인 / 자영업)</option>
                  <option value="REDUCED_40">건보료 40% 감경 (중간 이하)</option>
                  <option value="REDUCED_60">건보료 60% 감경 (차상위)</option>
                  <option value="BASIC">기초수급자</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateBenefits}
              disabled={!form.age || loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-extrabold rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  계산 중...
                </span>
              ) : (
                <>받을 수 있는 지원금 확인하기 <ArrowRightIcon className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

        {/* ── Step 2: 결과 ── */}
        {step === 2 && (
          <div className="space-y-3 animate-in fade-in zoom-in duration-500">
            <div className="bg-indigo-600 text-white rounded-2xl p-4 flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-indigo-200 flex-shrink-0" />
              <div>
                <div className="text-sm font-extrabold">지원 가능한 혜택 {results.length}건 발견!</div>
                <div className="text-[10px] text-indigo-200 font-semibold">아래 혜택을 놓치지 마세요</div>
              </div>
            </div>

            {results.map((r, i) => (
              <div key={i} className={`bg-white rounded-2xl border p-4 shadow-sm ${r.urgent ? 'border-rose-200' : 'border-slate-100'}`}>
                {r.urgent && (
                  <span className="inline-block text-[9px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                    지금 바로 신청 가능
                  </span>
                )}
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">{r.title}</h4>
                <div className="text-lg font-black text-indigo-700 mb-2">{r.amount}</div>
                <p className="text-[10px] text-slate-500 font-semibold mb-2">대상: {r.condition}</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <p className="text-[10px] text-slate-700 font-bold">📍 신청 방법</p>
                  <p className="text-[10px] text-slate-600 font-medium mt-0.5 leading-relaxed">{r.apply}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => { setStep(1); setResults([]); }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
            >
              다시 계산하기
            </button>
          </div>
        )}

        {/* ── 전체 복지혜택 목록 ── */}
        <div className="mt-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
            <span>📚</span>
            <span>알아두면 돈이 되는 돌봄 복지</span>
          </h3>
          <div className="space-y-4">
            {WELFARE_BENEFITS.map(section => (
              <div key={section.category} className={`border rounded-2xl p-4 ${section.color}`}>
                <h4 className={`text-xs font-extrabold mb-3 ${section.titleColor}`}>{section.category}</h4>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.name} className="bg-white rounded-xl p-3 border border-white/60">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-extrabold text-slate-800">{item.name}</span>
                        <span className="text-xs font-extrabold text-indigo-700 ml-2 whitespace-nowrap">{item.max}</span>
                      </div>
                      <div className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold inline-block mb-1">{item.grade}</div>
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
