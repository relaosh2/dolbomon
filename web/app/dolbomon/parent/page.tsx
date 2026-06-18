'use client';

import React, { useState } from 'react';
import { PlusIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// 👴 부모 — 기본정보 / 건강정보 / 문서함 / 연락처
// 메인 문구: "부모님의 정보를 한 곳에 정리하세요."
// ─────────────────────────────────────────────────────────────

type ParentTab = 'basic' | 'health' | 'docs' | 'contacts';

type Medicine = { id: string; name: string; dosage: string; time: string };
type Disease = { id: string; name: string; severity: string };
type Hospital = { id: string; name: string; dept: string; cycle: string };
type Contact = { id: string; name: string; role: string; phone: string };
type Document = { id: string; name: string; date: string; category: string };

const INIT_MEDICINES: Medicine[] = [
  { id: '1', name: '아리셉트정 5mg (치매 개선)', dosage: '1일 1회', time: '아침 식후' },
  { id: '2', name: '딜라트렌정 12.5mg (혈압)', dosage: '1일 1회', time: '아침 식후' },
  { id: '3', name: '세레브렉스캡슐 (소염진통)', dosage: '필요시', time: '저녁 식후' },
];

const INIT_DISEASES: Disease[] = [
  { id: '1', name: '알츠하이머 치매 (초기)', severity: '주의 필요' },
  { id: '2', name: '본태성 고혈압', severity: '지속 복약 중' },
  { id: '3', name: '퇴행성 관절염', severity: '통증 관리' },
];

const INIT_HOSPITALS: Hospital[] = [
  { id: '1', name: '충남대학교병원', dept: '신경과 (치매)', cycle: '3개월 주기' },
  { id: '2', name: '을지대학교병원', dept: '순환기내과', cycle: '2개월 주기' },
];

const INIT_CONTACTS: Contact[] = [
  { id: '1', name: '대전 유성구 보건소 치매안심센터', role: '주요기관', phone: '042-860-6000' },
  { id: '2', name: '해피돌봄 방문요양센터', role: '요양기관', phone: '010-1234-5678' },
  { id: '3', name: '대장님 (보호자)', role: '비상 1순위', phone: '010-9999-8888' },
];

const SAMPLE_DOCS: Document[] = [
  { id: '1', name: '진단서 - 알츠하이머 (2026.03)', date: '2026.03.10', category: '진단서' },
  { id: '2', name: '처방전 - 치매약 (2026.06)', date: '2026.06.14', category: '처방전' },
];

export default function ParentPage() {
  const [activeTab, setActiveTab] = useState<ParentTab>('basic');
  const [parentName, setParentName] = useState('김순옥 어머님');
  const [medicines, setMedicines] = useState<Medicine[]>(INIT_MEDICINES);
  const [diseases] = useState<Disease[]>(INIT_DISEASES);
  const [hospitals] = useState<Hospital[]>(INIT_HOSPITALS);
  const [contacts] = useState<Contact[]>(INIT_CONTACTS);
  const [isAddMed, setIsAddMed] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('아침 식후');
  const [showPremium, setShowPremium] = useState(false);

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedicines(prev => [...prev, {
      id: Date.now().toString(), name: newMedName, dosage: '1일 1회', time: newMedTime,
    }]);
    setNewMedName(''); setIsAddMed(false);
  };

  const TABS: { key: ParentTab; label: string; emoji: string }[] = [
    { key: 'basic', label: '기본정보', emoji: '👤' },
    { key: 'health', label: '건강정보', emoji: '🏥' },
    { key: 'docs', label: '문서함', emoji: '📁' },
    { key: 'contacts', label: '연락처', emoji: '📞' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto">

      {/* ── 부모 프로필 헤더 ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-5 pb-4">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">부모님 정보</p>
        <h1 className="text-base font-black text-slate-900 mb-0.5 flex items-center gap-2">
          <span>{parentName}</span>
          <button
            onClick={() => {
              const n = prompt('이름을 수정하세요', parentName);
              if (n) setParentName(n);
            }}
            className="text-[9px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-bold"
          >
            수정
          </button>
        </h1>
        <p className="text-xs text-slate-400 font-semibold">78세 · 장기요양 3등급 · 대전 유성구</p>

        {/* Tab Bar */}
        <div className="flex gap-1 mt-4 border-b border-slate-100 -mx-4 px-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 px-3 py-2 text-[10px] font-extrabold border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-8 space-y-3">

        {/* ── 기본정보 ── */}
        {activeTab === 'basic' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
              {[
                { label: '이름', value: '김순옥' },
                { label: '생년월일', value: '1948. 3. 12 (78세)' },
                { label: '거주형태', value: '자택 (방문요양 이용 중)' },
                { label: '주보호자', value: '대장님 (장녀)' },
                { label: '장기요양등급', value: '3등급 (2025.08 판정)' },
                { label: '인정기간', value: '2025.08 ~ 2027.08 (갱신 필요)' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[10px] font-extrabold text-slate-400">{item.label}</span>
                  <span className="text-xs font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 건강정보 ── */}
        {activeTab === 'health' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 질환 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-rose-500 rounded-full" />
                주요 질환
              </h3>
              <div className="space-y-2">
                {diseases.map(d => (
                  <div key={d.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-800">{d.name}</span>
                    <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold border border-rose-100">{d.severity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 복용약 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                  복용 약제 ({medicines.length})
                </h3>
                <button
                  onClick={() => setIsAddMed(true)}
                  className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg font-bold flex items-center gap-0.5"
                >
                  <PlusIcon className="w-3 h-3" /> 추가
                </button>
              </div>
              <div className="space-y-2">
                {medicines.map(m => (
                  <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-800 block">{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{m.dosage} · {m.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 진료 병원 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full" />
                정기 방문 병원
              </h3>
              <div className="space-y-2">
                {hospitals.map(h => (
                  <div key={h.id} className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-extrabold text-slate-800">{h.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{h.dept}</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-bold">{h.cycle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 문서함 (프리미엄) ── */}
        {activeTab === 'docs' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 blur-2xl rounded-full" />
              <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                Premium
              </span>
              <h3 className="text-sm font-black mt-2 mb-1">처방전·진단서 클라우드 보관</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                문서를 사진으로 찍어 무제한 저장하고, 병원 방문 때 즉시 꺼내 보여주세요.
              </p>
              <button
                onClick={() => setShowPremium(true)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all"
              >
                문서함 잠금 해제 (월 4,900원)
              </button>
            </div>

            {/* 샘플 미리보기 */}
            <p className="text-[10px] text-slate-400 font-bold text-center">프리미엄 미리보기</p>
            {SAMPLE_DOCS.map(doc => (
              <div key={doc.id} className="bg-white/60 rounded-2xl border border-slate-100 p-4 flex items-center gap-3 opacity-60">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{doc.date} · {doc.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 연락처 ── */}
        {activeTab === 'contacts' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <p className="text-[10px] text-slate-400 font-bold px-1">응급상황 시 원클릭 전화</p>
            {contacts.map(c => (
              <a
                href={`tel:${c.phone}`}
                key={c.id}
                className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-extrabold text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{c.role} · {c.phone}</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-extrabold">전화</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {isAddMed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddMed} className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black text-slate-900">약 추가</h4>
              <button type="button" onClick={() => setIsAddMed(false)}>
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <input
                type="text" value={newMedName} onChange={e => setNewMedName(e.target.value)}
                placeholder="약 이름 (예: 아리셉트정 5mg)" required
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select value={newMedTime} onChange={e => setNewMedTime(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {['아침 식후', '점심 식후', '저녁 식후', '취침 전', '필요시'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsAddMed(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">취소</button>
              <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold">추가</button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-base font-black text-slate-900">프리미엄 문서함</h3>
            <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
              처방전, 진단서, 검사결과, 보험서류를 사진으로 찍어 무제한 보관하고 가족과 공유하세요.<br />
              <strong className="text-indigo-700">월 4,900원</strong>으로 시작합니다.
            </p>
            <button onClick={() => { setShowPremium(false); alert('구독 신청이 완료되었습니다! (시뮬레이션)'); }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-extrabold mb-2">
              문서함 잠금 해제하기
            </button>
            <button onClick={() => setShowPremium(false)} className="w-full text-slate-400 text-xs font-bold py-2">나중에</button>
          </div>
        </div>
      )}
    </div>
  );
}
