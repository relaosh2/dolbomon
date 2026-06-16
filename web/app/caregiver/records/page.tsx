'use client';

import React, { useState } from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  ArrowDownTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

type CareRecord = {
  id: string;
  date: string;
  type: 'hospitalization' | 'treatment' | 'exam' | 'er' | 'care';
  title: string;
  details: string;
  doctor?: string;
  cost?: string;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<CareRecord[]>([
    { id: '1', date: '2026.06.14', type: 'exam', title: '충남대병원 치매안심센터 정기 방문', details: '인지선별검사(CIST) 검사 시행. 결과 양호하며 약물 용량 유지하기로 결정.', doctor: '홍길동 교수', cost: '12,500원' },
    { id: '2', date: '2026.05.28', type: 'treatment', title: '을지대병원 순환기내과 고혈압 진료', details: '혈압 수치 안정적(130/80). 혈압약 2개월치 추가 처방 완료.', doctor: '김진수 과장', cost: '8,400원' },
    { id: '3', date: '2026.04.10', type: 'er', title: '을지대병원 응급실 긴급 이송', details: '밤중 일시적인 호흡곤란 및 어지럼증으로 내원. 정밀 검사 후 단순 급체로 판정되어 새벽에 귀가 완료.', cost: '145,000원' },
    { id: '4', date: '2026.03.15', type: 'hospitalization', title: '성모병원 정형외과 단기 입원', details: '골관절염 무릎 인공관절 부분 치환술 시술 및 물리치료를 위한 5일간 입원.', doctor: '박지성 소장', cost: '1,200,000원' },
    { id: '5', date: '2026.02.20', type: 'care', title: '장기요양 신규등급 판정 방문 심사', details: '국민건강보험공단 심사관 자택 방문하여 거동 상태 평가 진행 → 최종 3등급 승인.', cost: '공단 지원' },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'hospitalization' | 'treatment' | 'exam' | 'er'>('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const filteredRecords = activeFilter === 'all' 
    ? records 
    : records.filter(r => r.type === activeFilter);

  const handleDownloadPDF = () => {
    setShowPremiumModal(true);
  };

  const typeStyles = {
    hospitalization: { label: '입원', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    treatment: { label: '진료', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    exam: { label: '검사', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    er: { label: '응급실', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    care: { label: '장기요양', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 max-w-md mx-auto">
      
      {/* PDF Export Header */}
      <section className="mb-6 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-800">돌봄 타임라인 기록지</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">의료진에게 부모님 건강 이력을 한눈에 보여주세요.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="text-xs bg-slate-900 text-white font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
        >
          <ArrowDownTrayIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>PDF 받기</span>
        </button>
      </section>

      {/* Record Filters */}
      <section className="mb-5 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1.5 pb-1">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            전체 보기
          </button>
          <button 
            onClick={() => setActiveFilter('hospitalization')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === 'hospitalization' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            입원
          </button>
          <button 
            onClick={() => setActiveFilter('treatment')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === 'treatment' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            진료
          </button>
          <button 
            onClick={() => setActiveFilter('exam')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === 'exam' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            검사
          </button>
          <button 
            onClick={() => setActiveFilter('er')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === 'er' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            응급실
          </button>
        </div>
      </section>

      {/* Timeline List */}
      <section className="relative border-l border-slate-200 ml-3.5 pl-5 space-y-6">
        {filteredRecords.map(record => (
          <div key={record.id} className="relative group">
            {/* Dot Indicator */}
            <div className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100 flex items-center justify-center"></div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm relative transition-all hover:border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-slate-400">{record.date}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${typeStyles[record.type].color}`}>
                  {typeStyles[record.type].label}
                </span>
              </div>

              <h3 className="text-xs font-extrabold text-slate-800 leading-snug">{record.title}</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/30">
                {record.details}
              </p>

              {(record.doctor || record.cost) && (
                <div className="mt-3 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  {record.doctor && <span>담당의: {record.doctor}</span>}
                  {record.cost && <span className="text-indigo-600">진료비: {record.cost}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Premium Download Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">돌봄온 3.0 멤버십 전용 기능</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              병원 및 응급실 기록을 한 곳에 모은 **돌봄 종합 타임라인 PDF 자동 보고서 발행**은 멤버십 회원에게만 제공됩니다.<br />
              홈 화면에서 월 4,900원으로 가족 돌봄을 더 간편하게 공유해 보세요!
            </p>
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="w-full mt-5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-3 rounded-xl transition-all"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
