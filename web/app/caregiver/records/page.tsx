'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 📋 기록 — 돌봄 타임라인 중심
// 메인 문구: "모든 돌봄은 기록이 됩니다."
// ─────────────────────────────────────────────────────────────

type RecordCategory = 'all' | 'hospital' | 'medicine' | 'test' | 'admission' | 'admin' | 'support';

const CAT_META: Record<Exclude<RecordCategory, 'all'>, { label: string; emoji: string; color: string }> = {
  hospital: { label: '진료', emoji: '🏥', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  medicine: { label: '약', emoji: '💊', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  test: { label: '검사', emoji: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  admission: { label: '입원', emoji: '🛏️', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  admin: { label: '서류', emoji: '📄', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  support: { label: '지원금', emoji: '💰', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
};

type CareRecord = {
  id: string;
  date: string;
  title: string;
  detail?: string;
  category: Exclude<RecordCategory, 'all'>;
  cost?: number;
  fromSchedule?: boolean;
};

const INIT_RECORDS: CareRecord[] = [
  { id: '1', date: '2026-06-14', title: '충남대병원 신경과 정기 진료', detail: '인지기능 상태 안정. 아리셉트 3개월분 처방. 다음 방문 9월 예약.', category: 'hospital', cost: 12000, fromSchedule: true },
  { id: '2', date: '2026-06-14', title: '아리셉트 5mg 처방전 수령 및 약국 방문', category: 'medicine', cost: 8500 },
  { id: '3', date: '2026-06-03', title: '장기요양 급여명세서 수령', detail: '6월분 방문요양 급여명세서. 본인부담금 67,500원', category: 'admin', fromSchedule: true },
  { id: '4', date: '2026-05-28', title: '을지대병원 순환기내과 진료', detail: '혈압 128/82 — 양호. 딜라트렌 유지. 다음 7월', category: 'hospital', cost: 9500 },
  { id: '5', date: '2026-05-20', title: '기초연금 수령 확인', detail: '5월분 기초연금 321,000원 입금 확인', category: 'support' },
  { id: '6', date: '2026-05-10', title: '혈액검사 결과 확인', detail: '신기능 정상, 당뇨 수치 경계. 3개월 후 재검 권고', category: 'test', cost: 35000 },
];

export default function RecordsPage() {
  const [records, setRecords] = useState<CareRecord[]>(INIT_RECORDS);
  const [filterCat, setFilterCat] = useState<RecordCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCat, setNewCat] = useState<Exclude<RecordCategory, 'all'>>('hospital');
  const [newCost, setNewCost] = useState('');
  const [showPremium, setShowPremium] = useState(false);

  const filtered = records
    .filter(r => filterCat === 'all' || r.category === filterCat)
    .filter(r =>
      !searchQuery ||
      r.title.includes(searchQuery) ||
      (r.detail ?? '').includes(searchQuery)
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  // 월별 그룹핑
  const grouped: Record<string, CareRecord[]> = {};
  filtered.forEach(r => {
    const month = r.date.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(r);
  });

  // 월간 요약
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthRecords = records.filter(r => r.date.startsWith(thisMonth));
  const totalCost = thisMonthRecords.reduce((a, r) => a + (r.cost ?? 0), 0);
  const hospitalCount = thisMonthRecords.filter(r => r.category === 'hospital').length;
  const workCount = thisMonthRecords.length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setRecords(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      title: newTitle, detail: newDetail, category: newCat,
      cost: newCost ? parseInt(newCost) : undefined,
    }, ...prev]);
    setNewTitle(''); setNewDetail(''); setNewCost(''); setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-5 pb-4 sticky top-14 z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">돌봄 타임라인</p>
            <h1 className="text-sm font-black text-slate-900">모든 돌봄은 기록이 됩니다.</h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl"
          >
            <PlusIcon className="w-4 h-4" /> 기록 추가
          </button>
        </div>

        {/* 검색 */}
        <div className="relative mb-2.5">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder='"혈압", "MRI", "장기요양", "약 변경" 등 검색'
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {(['all', ...Object.keys(CAT_META)] as RecordCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex-shrink-0 ${
                filterCat === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? '전체' : `${CAT_META[cat as Exclude<RecordCategory, 'all'>].emoji} ${CAT_META[cat as Exclude<RecordCategory, 'all'>].label}`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 pb-8">

        {/* ── 월간 요약 ── */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4">
          <h3 className="text-[10px] font-extrabold text-emerald-300 mb-2 uppercase tracking-wide">이번 달 요약</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-black">{hospitalCount}회</div>
              <div className="text-[9px] text-emerald-300">병원 방문</div>
            </div>
            <div>
              <div className="text-xl font-black">{workCount}건</div>
              <div className="text-[9px] text-emerald-300">보호자 업무</div>
            </div>
            <div>
              <div className="text-xl font-black">{totalCost > 0 ? `${Math.round(totalCost / 10000)}만원` : '0원'}</div>
              <div className="text-[9px] text-emerald-300">지출</div>
            </div>
          </div>
        </div>

        {/* PDF 내보내기 (프리미엄) */}
        <button
          onClick={() => setShowPremium(true)}
          className="w-full border border-dashed border-indigo-300 bg-indigo-50/50 text-indigo-700 text-xs font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-indigo-50"
        >
          📄 월간 돌봄 리포트 PDF 내보내기 (프리미엄)
        </button>

        {/* ── 타임라인 ── */}
        {Object.entries(grouped)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, recs]) => (
            <div key={month}>
              <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                {new Date(month + '-01').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} ({recs.length}건)
              </h3>

              <div className="relative border-l-2 border-slate-100 ml-1.5 pl-4 space-y-3">
                {recs.map(r => {
                  const meta = CAT_META[r.category];
                  const isExpanded = expandedId === r.id;

                  return (
                    <div key={r.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-4 w-3 h-3 rounded-full bg-white border-2 border-emerald-400" />

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="w-full text-left bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:bg-slate-50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-grow">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-extrabold ${meta.color}`}>
                                {meta.emoji} {meta.label}
                              </span>
                              {r.fromSchedule && (
                                <span className="text-[8px] text-indigo-500 font-bold">✓ 일정완료</span>
                              )}
                            </div>
                            <p className="text-xs font-extrabold text-slate-800 leading-snug">{r.title}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {new Date(r.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                              </span>
                              {r.cost != null && (
                                <span className="text-[10px] text-rose-500 font-bold">
                                  -{r.cost.toLocaleString()}원
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`text-[9px] text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                        </div>

                        {isExpanded && r.detail && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium leading-relaxed">
                            {r.detail}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        }

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-3">📋</p>
            <p className="text-xs font-extrabold text-slate-500">첫 돌봄 기록을 남겨보세요.<br />나중에 큰 도움이 됩니다.</p>
          </div>
        )}
      </div>

      {/* 기록 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black">기록 추가</h4>
              <button type="button" onClick={() => setShowAdd(false)}>
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <input
                required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <select value={newCat} onChange={e => setNewCat(e.target.value as Exclude<RecordCategory, 'all'>)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white"
              >
                {Object.entries(CAT_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.emoji} {meta.label}</option>
                ))}
              </select>
              <textarea value={newDetail} onChange={e => setNewDetail(e.target.value)}
                placeholder="메모 (선택사항 - 의사 소견, 처방 내용 등)"
                rows={2}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
              <input type="number" value={newCost} onChange={e => setNewCost(e.target.value)}
                placeholder="지출 금액 (원, 선택)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">기록 저장</button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-base font-black text-slate-900">월간 돌봄 리포트</h3>
            <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
              이번 달 병원 방문, 지출, 보호자 업무량을<br />깔끔한 PDF로 내보내 가족과 공유하세요.<br />
              <strong className="text-emerald-700">프리미엄 기능 · 월 4,900원</strong>
            </p>
            <button onClick={() => { setShowPremium(false); alert('구독 신청이 완료되었습니다! (시뮬레이션)'); }}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-extrabold mb-2">
              프리미엄 시작하기
            </button>
            <button onClick={() => setShowPremium(false)} className="w-full text-slate-400 text-xs font-bold py-2">나중에</button>
          </div>
        </div>
      )}
    </div>
  );
}
