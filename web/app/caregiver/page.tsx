'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 🌱 돌봄 시작하기 — 메인 진입점 (로그인 불필요)
// 장기요양등급 신청 단계별 가이드 + AI 등급 예측
// ─────────────────────────────────────────────────────────────

type GradeStep = {
  step: number;
  title: string;
  desc: string;
  duration: string;
  tip?: string;
};

const GRADE_STEPS: GradeStep[] = [
  { step: 1, title: '신청서 제출', desc: '국민건강보험공단 지사 방문 or 인터넷/전화 신청 가능', duration: '당일', tip: '신분증 + 주민등록등본 지참' },
  { step: 2, title: '방문조사', desc: '공단 직원이 자택 방문해 어르신 상태 평가 (약 1시간)', duration: '신청 후 30일 이내', tip: '당일 어르신이 직접 계셔야 합니다' },
  { step: 3, title: '의사소견서 제출', desc: '주치의 또는 병원에서 소견서 발급 (비용 약 1~2만원)', duration: '방문조사 전후', tip: '치매안심센터 발급 시 무료' },
  { step: 4, title: '등급판정위원회', desc: '공단 내부 심사 — 1~5등급 또는 인지지원등급 부여', duration: '조사 후 30일 이내' },
  { step: 5, title: '판정 결과 통보', desc: '우편 또는 앱으로 결과 통보 후 서비스 이용 개시', duration: '신청 후 최대 60일', tip: '결과 불만 시 이의신청 90일 이내' },
];

type QuickQuestion = {
  id: string;
  question: string;
  options: { label: string; value: string; score: number }[];
};

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'mobility',
    question: '혼자 이동하실 수 있나요?',
    options: [
      { label: '혼자 자유롭게 이동', value: 'free', score: 0 },
      { label: '지팡이/보조기구 필요', value: 'assist', score: 20 },
      { label: '부축/휠체어 필요', value: 'wheelchair', score: 40 },
      { label: '거의 침대에 계심', value: 'bedridden', score: 60 },
    ],
  },
  {
    id: 'cognition',
    question: '인지 능력은 어떤가요?',
    options: [
      { label: '정상적으로 소통 가능', value: 'normal', score: 0 },
      { label: '가끔 기억력 문제', value: 'mild', score: 15 },
      { label: '치매 진단 받으심', value: 'dementia', score: 35 },
      { label: '의사소통 매우 어려움', value: 'severe', score: 50 },
    ],
  },
  {
    id: 'adl',
    question: '식사/세면/화장실을 혼자 하실 수 있나요?',
    options: [
      { label: '모두 혼자 가능', value: 'independent', score: 0 },
      { label: '일부 도움 필요', value: 'partial', score: 20 },
      { label: '대부분 도움 필요', value: 'mostly', score: 40 },
      { label: '전적으로 의존', value: 'full', score: 60 },
    ],
  },
];

const gradeFromScore = (score: number) => {
  if (score >= 130) return { grade: '1등급', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', desc: '최중증 — 하루 4~5시간 재가서비스 또는 시설 입소 가능' };
  if (score >= 95) return { grade: '2등급', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', desc: '중증 — 하루 3~4시간 재가서비스 이용 가능' };
  if (score >= 75) return { grade: '3등급', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: '중등도 — 하루 3시간 재가서비스 이용 가능' };
  if (score >= 60) return { grade: '4등급', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', desc: '경증 — 하루 2~3시간 방문요양 이용 가능' };
  if (score >= 45) return { grade: '5등급', color: 'text-lime-700', bg: 'bg-lime-50', border: 'border-lime-200', desc: '치매 특별등급 — 주간보호 중심 서비스 이용' };
  return { grade: '등급 외', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', desc: '현재 장기요양 대상이 아닐 수 있습니다. 정확한 판단을 위해 신청해 보세요.' };
};

export default function DolbomStartPage() {
  const [activeSection, setActiveSection] = useState<'guide' | 'predict'>('guide');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0) * 1.2; // 가중치 적용
  const predictedGrade = gradeFromScore(totalScore);
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handlePredict = () => {
    if (answeredCount < QUICK_QUESTIONS.length) {
      alert('모든 질문에 답해주세요.');
      return;
    }
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── Hero Section ── */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white px-5 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-300 rounded-full blur-2xl" />
        </div>
        <div className="relative">
          <span className="inline-block bg-emerald-700/60 border border-emerald-600/50 text-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 tracking-wide uppercase">
            🌱 로그인 없이 바로 시작
          </span>
          <h1 className="text-2xl font-black leading-tight mb-2">
            어디서부터<br />
            <span className="text-emerald-300">시작해야 할지</span> 몰랐죠?
          </h1>
          <p className="text-sm text-emerald-100/90 font-medium leading-relaxed">
            장기요양등급 신청부터 시설 찾기까지<br />
            돌봄온이 단계별로 안내해 드립니다.
          </p>
        </div>
      </div>

      {/* ── Tab Toggle ── */}
      <div className="px-4 -mt-4 relative z-10 mb-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-1.5 flex">
          <button
            onClick={() => { setActiveSection('guide'); setShowResult(false); }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              activeSection === 'guide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            📋 단계별 신청 가이드
          </button>
          <button
            onClick={() => { setActiveSection('predict'); setShowResult(false); }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              activeSection === 'predict'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            🤖 AI 등급 예측
          </button>
        </div>
      </div>

      <div className="px-4 pb-8">

        {/* ── 단계별 신청 가이드 ── */}
        {activeSection === 'guide' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 신청 방법 안내 */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <h3 className="text-xs font-extrabold text-emerald-800 mb-3">📍 신청 방법 선택하기</h3>
              <div className="space-y-2">
                {[
                  { icon: '🏢', label: '방문 신청', desc: '가까운 국민건강보험공단 지사', highlight: false },
                  { icon: '📱', label: '인터넷 신청', desc: 'nhis.or.kr → 장기요양 → 등급신청', highlight: true },
                  { icon: '📞', label: '전화 신청', desc: '1577-1000 (콜센터)', highlight: false },
                ].map(item => (
                  <div key={item.label} className={`flex items-center space-x-3 p-2.5 rounded-xl ${item.highlight ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-100'}`}>
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className={`text-xs font-extrabold ${item.highlight ? 'text-white' : 'text-slate-800'}`}>{item.label}</div>
                      <div className={`text-[10px] font-medium ${item.highlight ? 'text-emerald-100' : 'text-slate-500'}`}>{item.desc}</div>
                    </div>
                    {item.highlight && <span className="ml-auto text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded">추천</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* 5단계 타임라인 */}
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>장기요양등급 신청 5단계</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">총 최대 60일</span>
            </h3>

            <div className="relative border-l-2 border-emerald-200 ml-4 pl-5 space-y-5">
              {GRADE_STEPS.map((s, i) => (
                <div key={s.step} className="relative">
                  <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">{s.step}</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-extrabold text-slate-900">{s.title}</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold whitespace-nowrap ml-2">{s.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{s.desc}</p>
                    {s.tip && (
                      <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl p-2">
                        <span className="text-amber-500 text-xs">💡</span>
                        <p className="text-[10px] text-amber-800 font-bold">{s.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 등급별 혜택 미리보기 */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 mt-6">
              <h3 className="text-sm font-extrabold mb-3 flex items-center gap-1.5">
                <span>💰</span>
                <span>등급 받으면 이런 혜택이!</span>
              </h3>
              <div className="space-y-2">
                {[
                  { grade: '1~2등급', benefit: '시설 입소 or 월 최대 208만원 재가급여' },
                  { grade: '3~4등급', benefit: '방문요양 하루 3~4시간, 월 최대 160만원' },
                  { grade: '5등급', benefit: '주간보호센터 이용, 치매 특화 케어' },
                ].map(item => (
                  <div key={item.grade} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                    <span className="text-xs font-bold text-slate-300">{item.grade}</span>
                    <span className="text-xs font-extrabold text-emerald-400 text-right">{item.benefit}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/caregiver/calculator"
                className="w-full mt-4 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl text-xs font-extrabold transition-all"
              >
                정확한 비용 계산하기 <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ── AI 등급 예측 ── */}
        {activeSection === 'predict' && !showResult && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-blue-800 font-bold leading-relaxed">
                3가지 질문으로 예상 장기요양등급을 <br />미리 확인해 보세요. (30초 소요)
              </p>
              <p className="text-[10px] text-blue-500 mt-1">※ 참고용이며 실제 등급과 다를 수 있습니다</p>
            </div>

            {QUICK_QUESTIONS.map((q, qIdx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-start gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{qIdx + 1}</span>
                  <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{q.question}</h4>
                </div>
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.score)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          selected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        {selected ? '✓ ' : ''}{opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handlePredict}
              disabled={answeredCount < QUICK_QUESTIONS.length}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-extrabold rounded-2xl transition-all shadow-md shadow-emerald-100"
            >
              {answeredCount < QUICK_QUESTIONS.length
                ? `${QUICK_QUESTIONS.length - answeredCount}개 질문 남음...`
                : '🤖 AI 등급 예측 결과 보기'}
            </button>
          </div>
        )}

        {/* ── AI 예측 결과 ── */}
        {activeSection === 'predict' && showResult && (
          <div className="animate-in fade-in zoom-in duration-500 space-y-4">
            <div className={`${predictedGrade.bg} border ${predictedGrade.border} rounded-3xl p-6 text-center shadow-sm`}>
              <p className="text-[11px] font-bold text-slate-500 mb-1">AI 예상 장기요양등급</p>
              <div className={`text-4xl font-black ${predictedGrade.color} mb-2`}>{predictedGrade.grade}</div>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">{predictedGrade.desc}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800">📌 다음 단계 추천</h4>
              {[
                { icon: '📋', text: '장기요양등급 신청 가이드 확인하기', action: () => { setActiveSection('guide'); setShowResult(false); } },
                { icon: '🔍', text: '내 지역 요양시설/요양보호사 찾아보기', href: '/caregiver/find' },
                { icon: '💰', text: '정확한 월 비용 계산하기', href: '/caregiver/calculator' },
              ].map(item => (
                item.href ? (
                  <Link key={item.text} href={item.href}
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-700 flex-grow">{item.text}</span>
                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </Link>
                ) : (
                  <button key={item.text} onClick={item.action}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group text-left"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-700 flex-grow">{item.text}</span>
                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => { setAnswers({}); setShowResult(false); }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
            >
              다시 예측하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
