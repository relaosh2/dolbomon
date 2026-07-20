'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

type RecordCategory = 'hospital' | 'medicine' | 'test' | 'admission' | 'admin' | 'finance';

interface CareRecord {
  id: string;
  date: string;
  title: string;
  detail?: string;
  category: RecordCategory;
  cost?: number;
  tags?: string[];
}

const SAMPLE_RECORDS: CareRecord[] = [
  { id: '1', date: '2026.06.19', title: '충남대병원 신경과 정기 진료', detail: '치매 증상 관리 차원 방문. 인지 기능 유지 상태 양호.', category: 'hospital', cost: 12000, tags: ['진료', '처방완료'] },
  { id: '2', date: '2026-06-19', title: '아리셉트정 5mg 약제 처방 수령', detail: '3개월 분량 약국 수령 완료.', category: 'medicine', cost: 8500, tags: ['약수령'] },
  { id: '3', date: '2026-06-17', title: '야간 인지 반응 변화 및 불면 증상', detail: '밤샘 배회 현상 약간 보임.', category: 'test', tags: ['건강'] },
  { id: '4', date: '2026-06-10', title: '방문요양 서비스 본인 부담 청구', detail: '5월 급여 이용액 본인부담.', category: 'finance', cost: 67500, tags: ['간병비'] },
  { id: '5', date: '2026-06-05', title: '장기요양 급여 이용 통지 서류 수령', detail: '공단 통지서 보관.', category: 'admin', tags: ['서류'] },
];

const CAT_META: Record<RecordCategory, { label: string; emoji: string }> = {
  hospital: { label: '진료', emoji: '🏥' },
  medicine: { label: '약', emoji: '💊' },
  test: { label: '검사', emoji: '🔬' },
  admission: { label: '입원', emoji: '🛏️' },
  admin: { label: '서류', emoji: '📄' },
  finance: { label: '재정', emoji: '💰' },
};

type RecordTab = 'timeline' | 'health' | 'finance';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<RecordTab>('timeline');
  const [filterCat, setFilterCat] = useState<RecordCategory | 'all'>('all');
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 모달 입력 필드 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<RecordCategory>('hospital');
  const [cost, setCost] = useState('');
  const [detail, setDetail] = useState('');

  // LocalStorage 로드
  useEffect(() => {
    const saved = localStorage.getItem('dolbomon_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords(SAMPLE_RECORDS);
      }
    } else {
      setRecords(SAMPLE_RECORDS);
      localStorage.setItem('dolbomon_records', JSON.stringify(SAMPLE_RECORDS));
    }
    setIsLoaded(true);
  }, []);

  const saveRecordsToStorage = (updated: CareRecord[]) => {
    setRecords(updated);
    localStorage.setItem('dolbomon_records', JSON.stringify(updated));
  };

  const handleOpenAddModal = () => {
    setTitle('');
    // 오늘 날짜 기본값 YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
    setCategory('hospital');
    setCost('');
    setDetail('');
    setShowAddModal(true);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      alert('제목과 날짜를 입력해주세요.');
      return;
    }

    const newRecord: CareRecord = {
      id: Date.now().toString(),
      date,
      title: title.trim(),
      detail: detail.trim() || undefined,
      category,
      cost: cost ? parseInt(cost, 10) : undefined,
      tags: [CAT_META[category].label],
    };

    const updated = [newRecord, ...records];
    saveRecordsToStorage(updated);
    setShowAddModal(false);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      const updated = records.filter(r => r.id !== id);
      saveRecordsToStorage(updated);
    }
  };

  const filtered = records.filter(r => filterCat === 'all' || r.category === filterCat);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-32">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        
        {/* ── 헤더 ── */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-bold text-[#111827]">기록</h1>
            <p className="text-[14px] text-[#6B7280] mt-1">부모님의 돌봄 타임라인</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white text-[16px] font-semibold px-4 py-2.5 rounded-2xl shadow-sm transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>기록하기</span>
          </button>
        </div>

        {/* ── 상단 탭 ── */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {(['timeline', 'health', 'finance'] as RecordTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[16px] font-semibold rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-[#5B3DF5] text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {tab === 'timeline' && '타임라인'}
              {tab === 'health' && '건강일지'}
              {tab === 'finance' && '재정기록'}
            </button>
          ))}
        </div>

        {/* ════════════════ 타임라인 탭 ════════════════ */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {/* 카테고리 필터 */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
              {(['all', 'hospital', 'medicine', 'test', 'admission', 'admin', 'finance'] as (RecordCategory | 'all')[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-semibold border transition-all flex-shrink-0 ${
                    filterCat === cat
                      ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                      : 'bg-white text-[#6B7280] border-slate-200 hover:text-[#111827]'
                  }`}
                >
                  {cat === 'all' ? '전체' : `${CAT_META[cat as RecordCategory].emoji} ${CAT_META[cat as RecordCategory].label}`}
                </button>
              ))}
            </div>

            {/* 타임라인 카드 리스트 */}
            <div className="space-y-4">
              {!isLoaded ? (
                <div className="text-center py-8 text-slate-400">불러오는 중...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-[#6B7280] font-medium bg-white rounded-3xl border border-slate-100">
                  등록된 기록이 없습니다.
                </div>
              ) : (
                filtered.map(r => (
                  <div key={r.id} className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-2 relative group">
                    <button
                      onClick={() => handleDeleteRecord(r.id)}
                      className="absolute top-5 right-5 text-slate-300 hover:text-[#FF5C7A] transition-colors p-1"
                      title="삭제"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <div className="flex justify-between items-center pr-6">
                      <span className="text-[14px] text-[#6B7280] font-semibold">{r.date}</span>
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#6B7280]">
                        {r.category === 'finance' ? '재정' : CAT_META[r.category]?.label}
                      </span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-[#111827] pr-6">{r.title}</h3>
                    {r.detail && <p className="text-[14px] text-[#6B7280] leading-relaxed">{r.detail}</p>}
                    {r.cost != null && (
                      <div className="text-[16px] font-bold text-[#FF5C7A] pt-1">
                        지출 금액: {r.cost.toLocaleString()}원
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════════════ 건강일지 탭 ════════════════ */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            {/* AI 요약 섹션 상단 노출 */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✨</span>
                <h3 className="text-[18px] font-semibold text-[#111827]">건강일지 AI 요약</h3>
              </div>
              <div className="bg-[#5B3DF5]/5 rounded-2xl p-4 border border-[#5B3DF5]/10 space-y-2">
                <p className="text-[16px] font-semibold text-[#5B3DF5]">최근 2주 간 요약:</p>
                <div className="text-[14px] text-[#111827] space-y-1 font-medium">
                  <p>• 💤 수면량: 야간 시간 수면이 눈에 띄게 감소했습니다.</p>
                  <p>• 🍚 식사량: 어머님 식욕이 전반적으로 감소해 반찬 섭취율이 낮아졌습니다.</p>
                  <p>• 🚶 거동 상태: 통증 기복이 있으나 이전 수준의 활동량을 유지하고 있습니다.</p>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-2 font-medium">※ 병원 진료 시 의료진에게 간편히 제시하는 용도로 활용해 보세요.</p>
              </div>
            </div>

            {/* 건강 입력 폼 */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-4">
              <h3 className="text-[18px] font-semibold text-[#111827]">상태 기록지</h3>
              <p className="text-[14px] text-[#6B7280]">식사, 수면, 거동, 기억 등의 건강 상태를 기입하세요.</p>
              <button
                onClick={() => alert('건강 기록 완료')}
                className="w-full bg-[#5B3DF5] text-white text-[17px] font-semibold py-3.5 rounded-2xl"
              >
                오늘 건강기록 저장하기
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ 재정기록 탭 ════════════════ */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            {/* 보호자가 바로 이해하기 쉬운 3단계 요약 대시보드 */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-4">
              <h3 className="text-[18px] font-semibold text-[#111827]">이번 달 돌봄 재정</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[16px] font-medium text-[#6B7280]">총 지출</span>
                  <span className="text-[18px] font-bold text-[#111827]">
                    {(records.filter(r => r.category === 'finance' || r.cost != null).reduce((sum, r) => sum + (r.cost || 0), 0)).toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[16px] font-medium text-[#6B7280]">지원금 수급</span>
                  <span className="text-[18px] font-bold text-[#16C47F]">363,000원</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-t border-slate-100 pt-3">
                  <span className="text-[18px] font-bold text-[#111827]">실제 부담 금액</span>
                  <span className="text-[22px] font-bold text-[#5B3DF5]">
                    {Math.max(0, (records.filter(r => r.category === 'finance' || r.cost != null).reduce((sum, r) => sum + (r.cost || 0), 0)) - 363000).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 재정 리포트 및 지출 내역 리스트 */}
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100/50 space-y-3">
              <h3 className="text-[18px] font-semibold text-[#111827]">돌봄 비용 지출 항목</h3>
              
              <div className="space-y-3">
                {records.filter(r => r.cost != null).length === 0 ? (
                  <div className="text-center py-4 text-slate-400">지출 내역이 없습니다.</div>
                ) : (
                  records.filter(r => r.cost != null).map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <h4 className="text-[16px] font-semibold text-[#111827]">{item.title}</h4>
                        <span className="text-[12px] text-[#6B7280]">{CAT_META[item.category]?.label || '지출'}</span>
                      </div>
                      <span className="text-[16px] font-bold text-[#FF5C7A]">{(item.cost || 0).toLocaleString()}원</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 월간 리포트 하단에만 프리미엄 노출 */}
            <div className="bg-[#111827] rounded-[24px] p-6 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#5B3DF5]/20 blur-2xl rounded-full" />
              <span className="inline-block text-[12px] font-bold bg-[#5B3DF5] text-white px-2.5 py-0.5 rounded-full mb-3">
                PREMIUM
              </span>
              <h3 className="text-[18px] font-semibold mb-1">월간 지출 통합 정산 리포트</h3>
              <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-4">
                지출 영수증을 모아 간편하게 세무 증빙 및 보험 환급 제출용 엑셀/PDF 리포트로 출력해 보세요.
              </p>
              <button className="w-full bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white text-[17px] font-semibold py-3 rounded-2xl transition-all">
                월 4,900원으로 세무 리포트 활성화
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 기록 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-bold text-[#111827]">기록 등록</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#374151]">기록 구분</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CAT_META) as RecordCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 rounded-xl border text-[14px] font-semibold flex items-center justify-center gap-1 transition-all ${
                        category === cat
                          ? 'border-[#5B3DF5] bg-[#5B3DF5]/5 text-[#5B3DF5]'
                          : 'border-slate-200 bg-white text-[#4B5563] hover:bg-slate-50'
                      }`}
                    >
                      <span>{CAT_META[cat].emoji}</span>
                      <span>{CAT_META[cat].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#374151]">날짜</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#5B3DF5] text-[15px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#374151]">제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 충남대병원 정기 진료"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#5B3DF5] text-[15px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#374151]">지출 금액 (선택)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="원 단위 입력"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#5B3DF5] text-[15px] font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-slate-400">원</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#374151]">상세 내용 (선택)</label>
                <textarea
                  placeholder="추가적인 설명이나 특이사항을 기록해 주세요."
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#5B3DF5] text-[15px] font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white text-[16px] font-semibold py-3.5 rounded-2xl shadow-sm transition-all mt-4"
              >
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

