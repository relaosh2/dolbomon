'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 📋 기록 — 3탭 구조
//   [타임라인] 자동기록 + 월간요약 + 가이드 카드
//   [건강일지] 슬라이더 + 태그 + 시계열 그래프
//   [재정기록] 지출/수입 대시보드 + PDF 리포트
// ─────────────────────────────────────────────────────────────

// ── 공유 localStorage 유틸 ──
const RECORDS_KEY = 'dolbomon_records';
const HEALTH_KEY = 'dolbomon_health';
const FINANCE_KEY = 'dolbomon_finance';

type RecordCategory = 'hospital' | 'medicine' | 'test' | 'admission' | 'admin' | 'support';

interface CareRecord {
  id: string; date: string; title: string; detail?: string;
  category: RecordCategory; cost?: number; tags?: string[];
  fromSchedule?: boolean; createdAt: number;
}

interface HealthLog {
  id: string; date: string;
  appetite: number; mobility: number; memory: number; sleep: number; mood: number;
  tags: string[]; memo?: string;
}

interface FinanceEntry {
  id: string; date: string; title: string; amount: number;
  type: 'expense' | 'income'; category: string;
}

function getRecords(): CareRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'); } catch { return []; }
}
function getHealth(): HealthLog[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(HEALTH_KEY) || '[]'); } catch { return []; }
}
function getFinance(): FinanceEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FINANCE_KEY) || '[]'); } catch { return []; }
}
function saveHealth(logs: HealthLog[]) { localStorage.setItem(HEALTH_KEY, JSON.stringify(logs)); }
function saveFinance(entries: FinanceEntry[]) { localStorage.setItem(FINANCE_KEY, JSON.stringify(entries)); }

// ── 샘플 데이터 ──
const SAMPLE_RECORDS: CareRecord[] = [
  { id: 's1', date: '2026-06-14', title: '충남대병원 신경과 정기 진료', detail: '인지기능 안정. 아리셉트 3개월분 처방. 다음 방문 9월 예약.', category: 'hospital', cost: 12000, fromSchedule: true, createdAt: Date.now() - 4 * 86400000 },
  { id: 's2', date: '2026-06-14', title: '아리셉트 5mg 처방전 수령', category: 'medicine', cost: 8500, createdAt: Date.now() - 4 * 86400000 },
  { id: 's3', date: '2026-06-03', title: '장기요양 급여명세서 수령', detail: '6월분 방문요양. 본인부담금 67,500원', category: 'admin', fromSchedule: true, createdAt: Date.now() - 15 * 86400000 },
  { id: 's4', date: '2026-05-28', title: '을지대병원 순환기내과 진료', detail: '혈압 128/82 양호. 딜라트렌 유지.', category: 'hospital', cost: 9500, createdAt: Date.now() - 21 * 86400000 },
  { id: 's5', date: '2026-05-20', title: '기초연금 5월분 수령 확인', category: 'support', createdAt: Date.now() - 29 * 86400000 },
];

function generateSampleHealth(): HealthLog[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return {
      id: `h${i}`, date: d.toISOString().slice(0, 10),
      appetite: Math.floor(2 + Math.random() * 2.5),
      mobility: Math.floor(2 + Math.random() * 2),
      memory: Math.floor(1.5 + Math.random() * 2),
      sleep: Math.floor(2 + Math.random() * 2.5),
      mood: Math.floor(2 + Math.random() * 2.5),
      tags: i % 3 === 0 ? ['증상 호전'] : i % 5 === 0 ? ['식사 거부'] : [],
      createdAt: d.getTime(),
    };
  });
}

const SAMPLE_FINANCE: FinanceEntry[] = [
  { id: 'f1', date: '2026-06-14', title: '충남대병원 진료비', amount: 12000, type: 'expense', category: '진료비' },
  { id: 'f2', date: '2026-06-14', title: '아리셉트 약값', amount: 8500, type: 'expense', category: '약값' },
  { id: 'f3', date: '2026-06-10', title: '방문요양 본인부담금', amount: 67500, type: 'expense', category: '간병비' },
  { id: 'f4', date: '2026-06-05', title: '기초연금 수령', amount: 321000, type: 'income', category: '기초연금' },
  { id: 'f5', date: '2026-06-01', title: '장기요양 환급금', amount: 42000, type: 'income', category: '장기요양' },
];

// ── 메타 정보 ──
const CAT_META: Record<RecordCategory, { label: string; emoji: string; color: string }> = {
  hospital: { label: '진료', emoji: '🏥', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  medicine: { label: '약', emoji: '💊', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  test: { label: '검사', emoji: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  admission: { label: '입원', emoji: '🛏️', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  admin: { label: '서류', emoji: '📄', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  support: { label: '지원금', emoji: '💰', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
};

const HEALTH_METRICS: { key: keyof Pick<HealthLog, 'appetite' | 'mobility' | 'memory' | 'sleep' | 'mood'>; label: string; color: string; emoji: string }[] = [
  { key: 'appetite', label: '식사량', color: '#F59E0B', emoji: '🍚' },
  { key: 'memory', label: '기억력', color: '#6C63FF', emoji: '🧠' },
  { key: 'mobility', label: '거동', color: '#10B981', emoji: '🚶' },
  { key: 'sleep', label: '수면', color: '#3B82F6', emoji: '😴' },
  { key: 'mood', label: '기분', color: '#EC4899', emoji: '😊' },
];

const SPECIAL_TAGS = ['식사 거부', '밤샘 배회', '갑작스러운 공격성', '증상 호전', '낙상 위험', '복약 거부', '기분 좋음', '통증 호소'];

// ── 시계열 SVG 차트 ──
function TrendChart({ logs, metric, color }: { logs: HealthLog[]; metric: keyof Pick<HealthLog, 'appetite' | 'mobility' | 'memory' | 'sleep' | 'mood'>; color: string }) {
  const W = 300; const H = 80; const PAD = 8;
  const data = logs.slice(-14).map(l => l[metric] as number);
  if (data.length < 2) return null;

  const min = 1; const max = 5; const range = max - min;
  const pts = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return { x, y };
  });

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${PAD},${H - PAD} ${polyline} ${W - PAD},${H - PAD}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
      <defs>
        <linearGradient id={`grad_${metric}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* 가이드라인 */}
      {[2, 3, 4].map(y => {
        const yPos = H - PAD - ((y - min) / range) * (H - PAD * 2);
        return <line key={y} x1={PAD} y1={yPos} x2={W - PAD} y2={yPos} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />;
      })}
      {/* 영역 */}
      <polygon points={area} fill={`url(#grad_${metric})`} />
      {/* 선 */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 최신 포인트 */}
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="4" fill={color} stroke="white" strokeWidth="2" />
      )}
    </svg>
  );
}

type MainTab = 'timeline' | 'health' | 'finance';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('timeline');
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [finances, setFinances] = useState<FinanceEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<RecordCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddFinance, setShowAddFinance] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<typeof HEALTH_METRICS[0]>(HEALTH_METRICS[0]);

  // 오늘 건강 일지 상태
  const [todayHealth, setTodayHealth] = useState({ appetite: 3, memory: 3, mobility: 3, sleep: 3, mood: 3 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [healthMemo, setHealthMemo] = useState('');
  const [healthSaved, setHealthSaved] = useState(false);

  // 재정 폼
  const [newFinTitle, setNewFinTitle] = useState('');
  const [newFinAmount, setNewFinAmount] = useState('');
  const [newFinType, setNewFinType] = useState<'expense' | 'income'>('expense');
  const [newFinCat, setNewFinCat] = useState('진료비');

  // 기록 추가 폼
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecCat, setNewRecCat] = useState<RecordCategory>('hospital');
  const [newRecDetail, setNewRecDetail] = useState('');
  const [newRecCost, setNewRecCost] = useState('');

  // localStorage 로드
  const loadData = useCallback(() => {
    const stored = getRecords();
    setRecords(stored.length > 0 ? stored : SAMPLE_RECORDS);
    const storedH = getHealth();
    setHealthLogs(storedH.length > 0 ? storedH : generateSampleHealth());
    const storedF = getFinance();
    setFinances(storedF.length > 0 ? storedF : SAMPLE_FINANCE);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('dolbomon_record_updated', loadData);
    return () => window.removeEventListener('dolbomon_record_updated', loadData);
  }, [loadData]);

  // ── 재정 계산 ──
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthFinances = finances.filter(f => f.date.startsWith(thisMonth));
  const totalExpense = monthFinances.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0);
  const totalIncome = monthFinances.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0);

  // ── 타임라인 필터 ──
  const filteredRecords = records
    .filter(r => filterCat === 'all' || r.category === filterCat)
    .filter(r => !searchQuery || r.title.includes(searchQuery) || (r.detail ?? '').includes(searchQuery))
    .sort((a, b) => b.createdAt - a.createdAt);

  const thisMonthRecords = records.filter(r => r.date.startsWith(thisMonth));
  const hospitalCount = thisMonthRecords.filter(r => r.category === 'hospital').length;

  // ── 건강일지 저장 ──
  const saveHealthLog = () => {
    const log: HealthLog = {
      id: `h${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      ...todayHealth,
      tags: selectedTags,
      memo: healthMemo || undefined,
    };
    const updated = [...healthLogs.filter(h => h.date !== log.date), log].sort((a, b) => a.date.localeCompare(b.date));
    setHealthLogs(updated);
    saveHealth(updated);
    setHealthSaved(true);
    setTimeout(() => setHealthSaved(false), 2000);
    setSelectedTags([]); setHealthMemo('');
  };

  // ── 재정 추가 ──
  const addFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFinTitle || !newFinAmount) return;
    const entry: FinanceEntry = {
      id: `f${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: newFinTitle, amount: parseInt(newFinAmount),
      type: newFinType, category: newFinCat,
    };
    const updated = [entry, ...finances];
    setFinances(updated); saveFinance(updated);
    setNewFinTitle(''); setNewFinAmount(''); setShowAddFinance(false);
  };

  // ── 기록 추가 ──
  const addRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle) return;
    const record: CareRecord = {
      id: `r${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title: newRecTitle, detail: newRecDetail || undefined,
      category: newRecCat,
      cost: newRecCost ? parseInt(newRecCost) : undefined,
      createdAt: Date.now(),
    };
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
    setNewRecTitle(''); setNewRecDetail(''); setNewRecCost(''); setShowAddRecord(false);
  };

  const toggleHealthTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const SliderRow = ({ metricKey, label, emoji }: { metricKey: keyof typeof todayHealth; label: string; emoji: string }) => {
    const val = todayHealth[metricKey];
    const labels = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];
    return (
      <div className="py-3 border-b border-slate-50 last:border-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-slate-700">{emoji} {label}</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
            val <= 2 ? 'bg-rose-50 text-rose-600 border-rose-100' : val === 3 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>{labels[val - 1]}</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(v => (
            <button key={v} onClick={() => setTodayHealth(prev => ({ ...prev, [metricKey]: v }))}
              className={`flex-1 h-2.5 rounded-full transition-all ${
                v <= val
                  ? val <= 2 ? 'bg-rose-400' : val === 3 ? 'bg-amber-400' : 'bg-emerald-400'
                  : 'bg-slate-100'
              }`} />
          ))}
        </div>
      </div>
    );
  };

  const TABS: { key: MainTab; label: string; emoji: string }[] = [
    { key: 'timeline', label: '타임라인', emoji: '📋' },
    { key: 'health', label: '건강일지', emoji: '📊' },
    { key: 'finance', label: '재정기록', emoji: '💰' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── 헤더 ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-5 pb-0 sticky top-14 z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">돌봄 기록</p>
            <h1 className="text-sm font-black text-slate-900">모든 돌봄은 기록이 됩니다.</h1>
          </div>
          <button onClick={() => activeTab === 'finance' ? setShowAddFinance(true) : setShowAddRecord(true)}
            className="flex items-center gap-1 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl">
            <PlusIcon className="w-4 h-4" /> {activeTab === 'finance' ? '수입/지출 추가' : '기록 추가'}
          </button>
        </div>

        {/* 탭 바 */}
        <div className="flex border-b border-slate-100 -mx-4 px-4">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-extrabold border-b-2 transition-all -mb-px ${
                activeTab === tab.key ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-400'
              }`}>
              <span>{tab.emoji}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 pb-8">

        {/* ════════════════ 타임라인 탭 ════════════════ */}
        {activeTab === 'timeline' && (
          <>
            {/* 월간 요약 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4">
              <h3 className="text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-wide">이번 달 요약</h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div><div className="text-xl font-black">{hospitalCount}회</div><div className="text-[9px] text-slate-400">병원 방문</div></div>
                <div><div className="text-xl font-black">{thisMonthRecords.length}건</div><div className="text-[9px] text-slate-400">전체 기록</div></div>
                <div><div className="text-xl font-black text-rose-400">{totalExpense > 0 ? `${Math.round(totalExpense / 10000)}만원` : '0원'}</div><div className="text-[9px] text-slate-400">지출</div></div>
              </div>
              <div className="bg-emerald-900/40 border border-emerald-700/30 rounded-xl px-3 py-2 text-[10px] text-emerald-300 font-bold">
                💰 이번 달 총 돌봄 비용 {totalExpense.toLocaleString()}원 · 지원금 수급 {totalIncome.toLocaleString()}원 · 실지출 {Math.max(0, totalExpense - totalIncome).toLocaleString()}원
              </div>
            </div>

            {/* 검색 + 필터 */}
            <div className="space-y-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder='"혈압", "MRI", "장기요양" 등 검색'
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {(['all', ...Object.keys(CAT_META)] as (RecordCategory | 'all')[]).map(cat => (
                  <button key={cat} onClick={() => setFilterCat(cat)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex-shrink-0 transition-all ${
                      filterCat === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'
                    }`}>
                    {cat === 'all' ? '전체' : `${CAT_META[cat as RecordCategory].emoji} ${CAT_META[cat as RecordCategory].label}`}
                  </button>
                ))}
              </div>
            </div>

            {/* PDF 리포트 배너 */}
            <button onClick={() => alert('이달의 돌봄 리포트 PDF 생성 (프리미엄)')}>
              <div className="w-full border border-dashed border-violet-300 bg-violet-50/50 text-violet-700 text-xs font-extrabold py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-violet-50">
                📄 이달의 돌봄 리포트 PDF 발행 (프리미엄)
              </div>
            </button>

            {/* 빈 화면 가이드 카드 */}
            {filteredRecords.length === 0 && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-blue-800 mb-1">📝 기록 탭 시작하기</p>
                  <p className="text-[10px] text-blue-700 leading-relaxed mb-3">
                    오늘 부모님의 상태는 어떠셨나요? 식사량, 기분, 특이사항을 간단히 남겨주세요.
                  </p>
                  <button onClick={() => setShowAddRecord(true)}
                    className="bg-blue-600 text-white text-xs font-extrabold px-4 py-2 rounded-xl">
                    첫 기록 남기기
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-amber-800 mb-1">🛏️ 입원 기록 가이드</p>
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    아직 입원 기록이 없어요. 입원 시 병원 서류를 여기에 정리하면 퇴원 후 보험 청구가 훨씬 빨라집니다.
                  </p>
                </div>
              </div>
            )}

            {/* 타임라인 */}
            <div className="relative border-l-2 border-slate-100 ml-1.5 pl-4 space-y-3">
              {filteredRecords.map(r => {
                const meta = CAT_META[r.category];
                const isExpanded = expandedId === r.id;
                return (
                  <div key={r.id} className="relative">
                    <div className="absolute -left-[21px] top-4 w-3 h-3 rounded-full bg-white border-2 border-violet-400" />
                    <button onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="w-full text-left bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:bg-slate-50 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-grow">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-extrabold ${meta.color}`}>
                              {meta.emoji} {meta.label}
                            </span>
                            {r.fromSchedule && <span className="text-[8px] text-violet-500 font-bold">📅 일정완료</span>}
                          </div>
                          <p className="text-xs font-extrabold text-slate-800 leading-snug">{r.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-semibold">
                            <span>{new Date(r.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
                            {r.cost != null && <span className="text-rose-500 font-bold">-{r.cost.toLocaleString()}원</span>}
                          </div>
                          {r.tags && r.tags.filter(t => t !== '특이사항 없음').length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {r.tags.filter(t => t !== '특이사항 없음').map(tag => (
                                <span key={tag} className="text-[9px] bg-violet-50 text-violet-600 border border-violet-100 px-1.5 py-0.5 rounded font-bold">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`text-[9px] text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                      </div>
                      {isExpanded && r.detail && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium leading-relaxed">{r.detail}</div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════════ 건강일지 탭 ════════════════ */}
        {activeTab === 'health' && (
          <>
            {/* 상태 변화 그래프 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-xs font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
                <span>📈</span><span>최근 14일 상태 변화 추이</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mb-3">
                "지난주부터 식사량이 감소했고, 수면 패턴이 변화했습니다." — 데이터로 의사에게 설명하세요.
              </p>

              {/* 지표 선택 탭 */}
              <div className="flex gap-1.5 overflow-x-auto mb-3">
                {HEALTH_METRICS.map(m => (
                  <button key={m.key} onClick={() => setSelectedMetric(m)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex-shrink-0 transition-all ${
                      selectedMetric.key === m.key ? 'text-white border-transparent' : 'bg-white text-slate-500 border-slate-200'
                    }`}
                    style={selectedMetric.key === m.key ? { background: m.color, borderColor: m.color } : {}}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>

              <TrendChart logs={healthLogs} metric={selectedMetric.key} color={selectedMetric.color} />

              <div className="flex justify-between text-[9px] text-slate-300 font-semibold mt-1">
                <span>14일 전</span><span>오늘</span>
              </div>

              {/* 최근 값 */}
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                {HEALTH_METRICS.map(m => {
                  const latest = healthLogs.length > 0 ? healthLogs[healthLogs.length - 1][m.key] as number : 3;
                  return (
                    <div key={m.key} className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-sm font-black" style={{ color: m.color }}>{latest}</div>
                      <div className="text-[8px] text-slate-400 font-bold">{m.emoji}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오늘의 건강 일지 입력 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-xs font-extrabold text-slate-800 mb-1 flex items-center gap-1.5">
                <span>🌡️</span><span>오늘의 건강 일지</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mb-4">어제보다 어떠셨나요?</p>

              <SliderRow metricKey="appetite" label="식사량" emoji="🍚" />
              <SliderRow metricKey="memory" label="기억력" emoji="🧠" />
              <SliderRow metricKey="mobility" label="거동" emoji="🚶" />
              <SliderRow metricKey="sleep" label="수면" emoji="😴" />
              <SliderRow metricKey="mood" label="기분/정서" emoji="😊" />

              {/* 특이사항 태그 */}
              <div className="mt-4">
                <p className="text-[10px] text-slate-500 font-extrabold mb-2">특이사항 태그 (선택)</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIAL_TAGS.map(tag => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <button key={tag} onClick={() => toggleHealthTag(tag)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all ${
                          selected ? 'bg-violet-600 text-white border-violet-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea value={healthMemo} onChange={e => setHealthMemo(e.target.value)}
                placeholder="메모 (선택) — 의사에게 전달할 특이사항" rows={2}
                className="w-full mt-3 px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-violet-500" />

              <button onClick={saveHealthLog}
                className={`w-full mt-4 py-3 text-xs font-extrabold rounded-xl transition-all ${
                  healthSaved ? 'bg-emerald-600 text-white' : 'text-white'
                }`}
                style={!healthSaved ? { background: '#6C63FF' } : {}}>
                {healthSaved ? '✓ 오늘 건강 일지 저장 완료' : '오늘 건강 일지 저장하기'}
              </button>
            </div>
          </>
        )}

        {/* ════════════════ 재정기록 탭 ════════════════ */}
        {activeTab === 'finance' && (
          <>
            {/* 월간 재정 대시보드 */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-5">
              <p className="text-[10px] font-extrabold text-emerald-300 mb-3 uppercase tracking-wide">이번 달 돌봄 재정 요약</p>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                이번 달 총 돌봄 비용 <strong className="text-white">{totalExpense.toLocaleString()}원</strong>
                {' '}<span className="text-slate-400">(지출 {totalExpense.toLocaleString()}원 / 지원금 {totalIncome.toLocaleString()}원 수급)</span>
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-lg font-black text-rose-300">-{totalExpense.toLocaleString()}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">총 지출</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-lg font-black text-emerald-300">+{totalIncome.toLocaleString()}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">지원금 수급</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className={`text-lg font-black ${totalExpense - totalIncome > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {(totalExpense - totalIncome).toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5">실지출</div>
                </div>
              </div>
            </div>

            {/* PDF 리포트 안내 */}
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
              <p className="text-xs font-extrabold text-violet-800 mb-1">📄 이달의 돌봄 리포트</p>
              <p className="text-[10px] text-violet-700 leading-relaxed">
                매달 말, 이 기록이 자동으로 정리되어 [이달의 돌봄 리포트] PDF로 발행됩니다.<br />
                방문 병원 목록 + 처방약 변경 내역 + 상태 변화 요약 + 월간 지출/수입 내역
              </p>
              <button onClick={() => alert('PDF 리포트 기능은 프리미엄에서 제공됩니다 (월 4,900원)')}
                className="mt-3 text-violet-700 border border-violet-200 text-[10px] font-extrabold px-4 py-2 rounded-xl hover:bg-violet-100 transition-all">
                프리미엄으로 PDF 받기
              </button>
            </div>

            {/* 지출 내역 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-rose-500 rounded-full" /><span>지출 내역</span>
              </h3>
              <div className="space-y-2">
                {finances.filter(f => f.type === 'expense').map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{f.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{f.category} · {new Date(f.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="text-xs font-extrabold text-rose-600">-{f.amount.toLocaleString()}원</span>
                  </div>
                ))}
                {finances.filter(f => f.type === 'expense').length === 0 && (
                  <p className="text-[10px] text-slate-400 text-center py-3">지출 내역이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 수입 내역 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-xs font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" /><span>지원금 수입 내역</span>
              </h3>
              <div className="space-y-2">
                {finances.filter(f => f.type === 'income').map(f => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{f.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{f.category} · {new Date(f.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">+{f.amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 기록 추가 모달 ── */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <form onSubmit={addRecord} className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black">기록 추가</h4>
              <button type="button" onClick={() => setShowAddRecord(false)}><XMarkIcon className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <input required value={newRecTitle} onChange={e => setNewRecTitle(e.target.value)}
                placeholder="내용 입력" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
              <select value={newRecCat} onChange={e => setNewRecCat(e.target.value as RecordCategory)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white">
                {Object.entries(CAT_META).map(([k, m]) => <option key={k} value={k}>{m.emoji} {m.label}</option>)}
              </select>
              <textarea value={newRecDetail} onChange={e => setNewRecDetail(e.target.value)}
                placeholder="메모 (선택)" rows={2}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none resize-none" />
              <input type="number" value={newRecCost} onChange={e => setNewRecCost(e.target.value)}
                placeholder="지출 금액 (원, 선택)"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddRecord(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* ── 재정 추가 모달 ── */}
      {showAddFinance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <form onSubmit={addFinance} className="bg-white rounded-t-3xl p-5 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black">수입/지출 추가</h4>
              <button type="button" onClick={() => setShowAddFinance(false)}><XMarkIcon className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 mb-4">
              {/* 유형 토글 */}
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                <button type="button" onClick={() => setNewFinType('expense')}
                  className={`flex-1 py-2 text-xs font-extrabold transition-all ${newFinType === 'expense' ? 'bg-rose-500 text-white' : 'bg-white text-slate-500'}`}>
                  지출
                </button>
                <button type="button" onClick={() => setNewFinType('income')}
                  className={`flex-1 py-2 text-xs font-extrabold transition-all ${newFinType === 'income' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500'}`}>
                  수입 (지원금)
                </button>
              </div>
              <input required value={newFinTitle} onChange={e => setNewFinTitle(e.target.value)}
                placeholder={newFinType === 'expense' ? '진료비, 약값, 간병비...' : '기초연금, 장기요양 환급금...'}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
              <input required type="number" value={newFinAmount} onChange={e => setNewFinAmount(e.target.value)}
                placeholder="금액 (원)" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none" />
              <select value={newFinCat} onChange={e => setNewFinCat(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white">
                {newFinType === 'expense'
                  ? ['진료비', '약값', '간병비', '기저귀/소모품', '이동비용', '기타'].map(c => <option key={c}>{c}</option>)
                  : ['기초연금', '장기요양', '보험금', '정부지원금', '기타'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAddFinance(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">저장</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
