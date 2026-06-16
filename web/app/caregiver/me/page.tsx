'use client';

import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────
// 🫀 나 — 보호자 상태 체크 & 소진 관리
// 메인 문구: "돌봄도 돌봄이 필요합니다."
// ※ 의료 진단 표현 절대 금지 — "소진 신호" 수준만 표기
// ─────────────────────────────────────────────────────────────

type CheckValue = 1 | 2 | 3 | 4 | 5;

type WeeklyCheck = {
  sleep: CheckValue; // 수면 충족도 (1=매우 부족 ~ 5=충분)
  fatigue: CheckValue; // 피로도 (1=전혀 안 피곤 ~ 5=매우 피곤)
  stress: CheckValue; // 스트레스 (1=없음 ~ 5=매우 높음)
  helpNeeded: CheckValue; // 도움 필요도 (1=없음 ~ 5=매우 필요)
};

const INITIAL_CHECK: WeeklyCheck = {
  sleep: 2, fatigue: 4, stress: 4, helpNeeded: 3,
};

type WorkItem = { label: string; count: number; unit: string; emoji: string };

const WORK_ITEMS: WorkItem[] = [
  { label: '병원 동행', count: 2, unit: '회', emoji: '🏥' },
  { label: '전화 상담', count: 8, unit: '회', emoji: '📞' },
  { label: '서류 처리', count: 3, unit: '건', emoji: '📄' },
  { label: '지출 관리', count: 6, unit: '건', emoji: '💳' },
  { label: '이동 시간', count: 4, unit: '시간', emoji: '🚗' },
];

const SLIDER_LABELS: Record<keyof WeeklyCheck, { question: string; low: string; high: string; reverse?: boolean }> = {
  sleep: { question: '수면이 충분했나요?', low: '매우 부족', high: '충분함', reverse: true },
  fatigue: { question: '피로감이 어느 정도인가요?', low: '전혀 없음', high: '매우 심함' },
  stress: { question: '스트레스 수준은 어떤가요?', low: '없음', high: '매우 높음' },
  helpNeeded: { question: '가족의 도움이 필요한 정도는?', low: '없음', high: '매우 필요' },
};

const getBurnoutLevel = (check: WeeklyCheck) => {
  const score = (6 - check.sleep) + check.fatigue + check.stress + check.helpNeeded;
  if (score <= 7) return { level: '낮음', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: '이번 주는 비교적 안정적이었습니다.' };
  if (score <= 12) return { level: '주의', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: '소진 신호가 감지됩니다. 가족에게 도움을 요청해보세요.' };
  return { level: '높음', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', desc: '소진 신호가 높게 나타났습니다. 혼자 감당하지 마세요.' };
};

const HELP_REQUEST_TEMPLATE = `안녕, 나 요즘 엄마 돌봄이 좀 힘들어.

이번 주 병원 동행 2회, 서류 처리 3건, 전화 상담 8회 정도 됐어.
수면도 많이 부족하고 피로도도 높아서 체력적으로 한계야.

이번 달 한 번만 병원 동행이나 약 수령 도와줄 수 있어?
일정 맞춰볼게!

– 돌봄온으로 작성된 역할 분담 요청`;

export default function MePage() {
  const [check, setCheck] = useState<WeeklyCheck>(INITIAL_CHECK);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);

  const burnout = getBurnoutLevel(check);

  const updateCheck = (key: keyof WeeklyCheck, value: CheckValue) => {
    setCheck(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(HELP_REQUEST_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const labelFor = (key: keyof WeeklyCheck, val: CheckValue) => {
    const meta = SLIDER_LABELS[key];
    const labels = ['매우낮음', '낮음', '보통', '높음', '매우높음'];
    return meta.reverse ? labels[5 - val] : labels[val - 1];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 px-5 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <span className="text-[10px] font-extrabold text-purple-300/80 tracking-widest uppercase">나 · 보호자 체크인</span>
          <h1 className="text-xl font-black text-white mt-2 leading-snug">
            돌봄도 <span className="text-purple-300">돌봄이 필요합니다.</span>
          </h1>
          <p className="text-xs text-purple-200/80 mt-1 font-medium">
            오늘의 상태를 남겨보세요.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-5 relative z-10 space-y-4 pb-8">

        {/* ── 소진 신호 결과 카드 ── */}
        <div className={`rounded-2xl border p-5 shadow-lg ${burnout.bg} ${burnout.border}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-700">이번 주 소진 신호</h3>
            <span className={`text-sm font-black ${burnout.color}`}>{burnout.level}</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden bg-slate-200`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                burnout.level === '낮음' ? 'bg-emerald-500 w-1/4' :
                burnout.level === '주의' ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-3/4'
              }`}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">{burnout.desc}</p>
          <p className="text-[9px] text-slate-400 mt-1">
            ※ 이 결과는 <strong>참고용 체크리스트</strong>이며 의료 진단이 아닙니다.
          </p>
        </div>

        {/* ── 이번 주 상태 체크 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-xs font-extrabold text-slate-800 mb-4 flex items-center gap-1.5">
            <span>🔆</span>
            <span>이번 주 보호자 상태 체크</span>
          </h3>

          <div className="space-y-5">
            {(Object.keys(SLIDER_LABELS) as (keyof WeeklyCheck)[]).map(key => {
              const meta = SLIDER_LABELS[key];
              const val = check[key];

              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-extrabold text-slate-700">{meta.question}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      (meta.reverse ? (6 - val) : val) <= 2
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : (meta.reverse ? (6 - val) : val) === 3
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {labelFor(key, val)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4, 5] as CheckValue[]).map(v => (
                      <button
                        key={v}
                        onClick={() => updateCheck(key, v)}
                        className={`flex-1 h-2.5 rounded-full transition-all ${
                          v <= val
                            ? val <= 2 ? 'bg-emerald-400' : val === 3 ? 'bg-amber-400' : 'bg-rose-400'
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-slate-300 font-semibold">{meta.low}</span>
                    <span className="text-[8px] text-slate-300 font-semibold">{meta.high}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            className={`w-full mt-5 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {saved ? '✓ 오늘 상태 저장 완료' : '오늘의 상태 저장하기'}
          </button>
        </div>

        {/* ── 이번 주 돌봄량 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
            <span>📊</span>
            <span>이번 주 돌봄 업무량</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {WORK_ITEMS.map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2">
                <span className="text-base">{item.emoji}</span>
                <div>
                  <div className="text-sm font-black text-slate-800">{item.count}<span className="text-xs font-medium ml-0.5">{item.unit}</span></div>
                  <div className="text-[9px] text-slate-400 font-bold">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 도움 요청 문구 생성 ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
            <span>💬</span>
            <span>가족에게 도움 요청 문구 만들기</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mb-3 leading-relaxed">
            혼자 감당하지 않아도 됩니다. 이번 주 상태 기반으로 메시지를 만들어드립니다.
          </p>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl transition-all"
          >
            📨 가족 역할 분담 요청 메시지 보기
          </button>
        </div>

        {/* ── 리마인더 ── */}
        {burnout.level !== '낮음' && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <p className="text-xs font-extrabold text-indigo-800 mb-1">💡 리마인드</p>
            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
              이번 주 돌봄 업무가 많았습니다. 가족에게 도움을 요청해보세요.
              혼자 모든 걸 감당하는 건 장기적으로 지속 불가능합니다.
            </p>
          </div>
        )}

        {/* ── 프리미엄 배너 ── */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-5 text-center">
          <p className="text-xs font-extrabold mb-1">📄 문서보관, 리포트, 가족공유는 프리미엄에서 제공됩니다.</p>
          <p className="text-[10px] text-slate-400 mb-3">"내 시간을 줄여주고, 중요한 일을 놓치지 않게 해준다"</p>
          <button
            onClick={() => alert('구독 신청 페이지로 이동합니다 (시뮬레이션)')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-2 rounded-xl transition-all"
          >
            프리미엄 시작 · 월 4,900원
          </button>
        </div>
      </div>

      {/* 도움 요청 메시지 모달 */}
      {showHelp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h4 className="text-sm font-black text-slate-900 mb-1">가족 역할 분담 요청 메시지</h4>
            <p className="text-[10px] text-slate-400 font-medium mb-3">카카오톡에 복사해서 바로 보내세요.</p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-700 leading-relaxed font-medium whitespace-pre-line mb-4">
              {HELP_REQUEST_TEMPLATE}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHelp(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">닫기</button>
              <button onClick={handleCopy} className={`flex-1 py-2.5 text-white rounded-xl text-xs font-extrabold transition-all ${copied ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                {copied ? '✓ 복사됨!' : '클립보드 복사'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
