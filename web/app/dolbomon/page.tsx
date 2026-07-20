'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// 돌봄온 4.0 - 홈 탭 (기본 구성 복원)
// ─────────────────────────────────────────────────────────────

type Task = { id: string; text: string; urgent?: boolean; completed: boolean };

const INITIAL_TASKS: Task[] = [
  { id: '1', text: '충남대병원 진료 14:00', urgent: true, completed: false },
  { id: '2', text: '고혈압약 수령', urgent: false, completed: false },
  { id: '3', text: '장기요양 갱신일 확인', urgent: false, completed: false },
];

const INITIAL_RECORDS = [
  { date: '06.14', title: '신경과 정기진료', tag: '진료' },
  { date: '06.14', title: '아리셉트 처방', tag: '약' },
  { date: '06.03', title: '급여명세서 수령', tag: '서류' },
];

const CAT_LABELS: Record<string, string> = {
  hospital: '진료',
  medicine: '약',
  test: '검사',
  admission: '입원',
  admin: '서류',
  finance: '재정',
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [recentRecords, setRecentRecords] = useState<Array<{ date: string; title: string; tag: string }>>([]);
  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  useEffect(() => {
    const saved = localStorage.getItem('dolbomon_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Array<{ date: string; title: string; category: string; tags?: string[] }>;
        if (parsed.length > 0) {
          // Sort by date desc (or assuming the array is already sorted/added newest first)
          // To be safe, parse dates and sort, or slice first 3 if newest are at index 0.
          // In records/page.tsx we did: const updated = [newRecord, ...records]; so newest are at the beginning.
          const formatted = parsed.slice(0, 3).map(r => {
            // date is YYYY-MM-DD or YYYY.MM.DD. We want MM.DD format.
            const parts = r.date.split(/[-.]/);
            let displayDate = r.date;
            if (parts.length >= 3) {
              displayDate = `${parts[1]}.${parts[2]}`;
            }
            return {
              date: displayDate,
              title: r.title,
              tag: r.tags?.[0] || CAT_LABELS[r.category] || '기록',
            };
          });
          setRecentRecords(formatted);
          return;
        }
      } catch (e) {
        // Fallback
      }
    }
    setRecentRecords(INITIAL_RECORDS);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-32">
      <div className="max-w-md mx-auto px-5 pt-10 space-y-4">
        
        {/* ── 상단 헤더 ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
              <span>{today}</span>
              <span>•</span>
              <span className="text-[#5B3DF5] font-semibold">☀️ 24°C 맑음</span>
            </div>
            <h1 className="text-[26px] font-bold text-[#111827] mt-0.5 leading-tight tracking-tight">
              오늘도 수고하셨습니다
            </h1>
          </div>
          <Link href="/dolbomon/me" className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-[#FF5C7A]/20 flex items-center justify-center bg-[#FF5C7A]/5 animate-pulse">
              <span className="text-[11px] font-bold text-[#FF5C7A]">주의</span>
            </div>
          </Link>
        </div>

        {/* ── 보호자 상태 (게이지 바 대시보드) ── */}
        <Link href="/dolbomon/me" className="block bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[18px] font-bold text-[#111827]">보호자 상태</h2>
            <span className="text-[12px] font-medium text-[#6B7280]">자세히 보기 →</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '수면', value: '5.5h', pct: 55, color: '#FFB020' },
              { label: '피로', value: '높음', pct: 85, color: '#FF5C7A' },
              { label: '스트레스', value: '높음', pct: 90, color: '#FF5C7A' },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1.5 bg-[#F8F9FC] rounded-xl p-2.5 border border-slate-100">
                <div className="flex items-center justify-between text-[11.5px] gap-0.5">
                  <span className="font-medium text-[#6B7280] whitespace-nowrap">{s.label}</span>
                  <span className="font-bold text-[#111827] whitespace-nowrap">{s.value}</span>
                </div>
                {/* 게이지 바 */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* ── 오늘 할 일 ── */}
        <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[18px] font-bold text-[#111827]">오늘 할 일</h2>
            <span className="text-[12px] font-semibold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2 py-0.5 rounded-full">
              {completedCount}/{tasks.length} 완료
            </span>
          </div>
          
          <div className="space-y-2">
            {tasks.map(t => (
              <button
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="w-full flex items-start gap-2.5 py-2.5 px-3.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-slate-100/80"
              >
                <div
                  className="w-4.5 h-4.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5"
                  style={t.completed
                    ? { background: '#5B3DF5', borderColor: '#5B3DF5' }
                    : { borderColor: t.urgent ? '#FF5C7A' : '#E2E8F0' }}
                >
                  {t.completed && (
                    <svg viewBox="0 0 10 8" width="8" height="7" fill="none" stroke="white" strokeWidth={2.5}>
                      <polyline points="1,4 3.5,6.5 9,1"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[14px] font-medium flex-1 ${t.completed ? 'line-through text-[#6B7280] opacity-60' : 'text-[#111827]'}`}>
                  {t.text}
                </span>
                {t.urgent && !t.completed && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FF5C7A]/10 text-[#FF5C7A] whitespace-nowrap">
                    오늘
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 최근 기록 ── */}
        <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[18px] font-bold text-[#111827]">최근 기록</h2>
            <Link href="/dolbomon/records" className="text-[12px] font-semibold text-[#5B3DF5]">
              전체 보기 →
            </Link>
          </div>

          <div className="space-y-2">
            {recentRecords.map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0 last:pb-0">
                <span className="text-[13px] text-[#6B7280] font-semibold w-8 flex-shrink-0">{r.date}</span>
                <p className="text-[14px] font-medium text-[#111827] flex-1 truncate">{r.title}</p>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-[#6B7280]">
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
