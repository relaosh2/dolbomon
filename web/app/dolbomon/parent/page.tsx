'use client';

import React, { useState, useEffect } from 'react';
import { PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PencilSquareIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Tab = 'health' | 'medicine' | 'docs' | 'contacts';

type ParentInfo = {
  name: string;
  age: string;
  grade: string;
  idNumber: string;
  guardian: string;
  service: string;
};

interface LocalEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: string;
  status: string;
  alarm: boolean;
  memo?: string;
}

interface MedicineItem {
  name: string;
  schedule: string;
  remaining: string;
}

interface DocumentItem {
  type: string;
  name: string;
  date: string;
  issuer: string;
}

interface ContactItem {
  name: string;
  tel: string;
  role: string;
}

interface HospitalItem {
  name: string;
  dept: string;
  cycle: string;
}

export default function ParentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('health');
  
  // 기본정보 로컬 상태
  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    name: '김순옥 어머님',
    age: '78세 (1948년)',
    grade: '장기요양 3등급',
    idNumber: 'L12345678-01',
    guardian: '본인 (자녀)',
    service: '방문요양 (주5회)',
  });

  // 질환 목록 상태
  const [diseases, setDiseases] = useState<string[]>(['고혈압', '치매 (알츠하이머)', '퇴행성 관절염']);
  const [newDisease, setNewDisease] = useState('');
  const [showAddDisease, setShowAddDisease] = useState(false);

  // 정기 방문 병원 상태
  const [hospitals, setHospitals] = useState<HospitalItem[]>([
    { name: '충남대학교병원', dept: '신경과', cycle: '3개월 주기 정기 진료' },
    { name: '대전을지대학교병원', dept: '순환기내과', cycle: '2개월 주기 혈압약 처방' }
  ]);
  const [newHospName, setNewHospName] = useState('');
  const [newHospDept, setNewHospDept] = useState('');
  const [newHospCycle, setNewHospCycle] = useState('3개월');
  const [showAddHosp, setShowAddHosp] = useState(false);

  // 자동 일정생성 설정 상태
  const [autoGenSchedule, setAutoGenSchedule] = useState(true);
  const [firstVisitDate, setFirstVisitDate] = useState('');
  const [selectedAlarms, setSelectedAlarms] = useState<string[]>(['1일 전', '1시간 전']);
  const [repeatAlarm, setRepeatAlarm] = useState(true);

  // 약 목록 상태
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { name: '아리셉트정 5mg (치매약)', schedule: '아침 식후 1정', remaining: '14정 남음 (2주분)' },
    { name: '딜라트렌정 12.5mg (혈압약)', schedule: '아침 식후 1정', remaining: '28정 남음 (4주분)' },
    { name: '세레브렉스캡슐 (관절염 진통제)', schedule: '통증 심할 때 복용', remaining: '8캡슐 남음' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedSchedule, setNewMedSchedule] = useState('');
  const [newMedRemaining, setNewMedRemaining] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);

  // 문서 목록 상태
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { type: '진단서', name: '알츠하이머 치매 정밀 진단서', date: '2026.03.10', issuer: '충남대학교병원' },
    { type: '처방전', name: '신경과 약물 처방전 (3개월)', date: '2026.06.14', issuer: '메디컬약국' },
    { type: '인정서', name: '장기요양인정서 (3등급)', date: '2025.08.12', issuer: '국민건강보험공단' },
    { type: '급여명세서', name: '5월 주간보호센터 급여명세서', date: '2026.06.05', issuer: '해피돌봄센터' },
  ]);
  const [newDocType, setNewDocType] = useState('처방전');
  const [newDocName, setNewDocName] = useState('');
  const [newDocDate, setNewDocDate] = useState('');
  const [newDocIssuer, setNewDocIssuer] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);

  // 연락처 목록 상태
  const [contacts, setContacts] = useState<ContactItem[]>([
    { name: '유성구 보건소 치매안심센터', tel: '042-860-6000', role: '주요기관' },
    { name: '해피돌봄 방문요양센터', tel: '010-1234-5678', role: '요양기관' },
    { name: '가족 단톡방 (도움 요청)', tel: '010-9999-8888', role: '비상 연락' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactTel, setNewContactTel] = useState('');
  const [newContactRole, setNewContactRole] = useState('요양기관');
  const [showAddContact, setShowAddContact] = useState(false);

  // 일정 연계
  const [scheduledHospitals, setScheduledHospitals] = useState<LocalEvent[]>([]);
  const [scheduledMedicines, setScheduledMedicines] = useState<LocalEvent[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ParentInfo>({ ...parentInfo });

  // 로컬스토리지 데이터 로드 및 초기화
  useEffect(() => {
    const savedInfo = localStorage.getItem('parent_info');
    if (savedInfo) setParentInfo(JSON.parse(savedInfo));

    const savedDiseases = localStorage.getItem('parent_diseases');
    if (savedDiseases) setDiseases(JSON.parse(savedDiseases));

    const savedHospitals = localStorage.getItem('dolbomon_hospitals');
    if (savedHospitals) setHospitals(JSON.parse(savedHospitals));

    const savedMedicines = localStorage.getItem('dolbomon_medicines');
    if (savedMedicines) setMedicines(JSON.parse(savedMedicines));

    const savedDocs = localStorage.getItem('dolbomon_documents');
    if (savedDocs) setDocuments(JSON.parse(savedDocs));

    const savedContacts = localStorage.getItem('dolbomon_contacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));

    // 일정 데이터 로드
    const savedEvents = localStorage.getItem('dolbomon_events');
    if (savedEvents) {
      try {
        const parsedEvents: LocalEvent[] = JSON.parse(savedEvents);
        setScheduledHospitals(parsedEvents.filter(ev => ev.type === 'hospital' && ev.status === 'pending'));
        setScheduledMedicines(parsedEvents.filter(ev => ev.type === 'medicine' && ev.status === 'pending'));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isEditing]);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    setParentInfo({ ...editForm });
    localStorage.setItem('parent_info', JSON.stringify(editForm));
    setIsEditing(false);
  };

  // 질환 추가/삭제
  const handleAddDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisease.trim()) return;
    const updated = [...diseases, newDisease.trim()];
    setDiseases(updated);
    localStorage.setItem('parent_diseases', JSON.stringify(updated));
    setNewDisease('');
    setShowAddDisease(false);
  };

  const handleDeleteDisease = (index: number) => {
    const updated = diseases.filter((_, idx) => idx !== index);
    setDiseases(updated);
    localStorage.setItem('parent_diseases', JSON.stringify(updated));
  };

  // 병원 추가/삭제 & 자동 일정 생성 계산 연동
  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName.trim() || !newHospDept.trim()) return;
    
    const cycleLabel = `${newHospCycle} 주기 정기 진료`;
    const updatedHospitals = [...hospitals, { name: newHospName.trim(), dept: newHospDept.trim(), cycle: cycleLabel }];
    setHospitals(updatedHospitals);
    localStorage.setItem('dolbomon_hospitals', JSON.stringify(updatedHospitals));

    // 일정 자동 생성 옵션 활성화 시
    if (autoGenSchedule && firstVisitDate) {
      const savedEvents = localStorage.getItem('dolbomon_events');
      let currentEvents: LocalEvent[] = [];
      if (savedEvents) {
        try {
          currentEvents = JSON.parse(savedEvents);
        } catch (err) {
          console.error(err);
        }
      }

      // 주기 계산 및 미래 일정 3회분 자동 파싱
      const generatedEvents: LocalEvent[] = [];
      const baseDate = new Date(firstVisitDate);
      let monthsToAdd = 3;
      if (newHospCycle === '1개월') monthsToAdd = 1;
      else if (newHospCycle === '2개월') monthsToAdd = 2;
      else if (newHospCycle === '6개월') monthsToAdd = 6;

      for (let i = 0; i < 3; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setMonth(baseDate.getMonth() + (i * monthsToAdd));
        const dateString = nextDate.toISOString().slice(0, 10);
        
        generatedEvents.push({
          id: `hosp-auto-${Date.now()}-${i}`,
          title: `[정기] ${newHospName.trim()} ${newHospDept.trim()} 진료`,
          date: dateString,
          time: '10:00',
          type: 'hospital',
          status: 'pending',
          alarm: true,
          memo: `정기 자동생성 일정 (알람: ${selectedAlarms.join(', ')}${repeatAlarm ? ' / 주기별 반복알람 적용' : ''})`
        });
      }

      const mergedEvents = [...currentEvents, ...generatedEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      localStorage.setItem('dolbomon_events', JSON.stringify(mergedEvents));
      
      // 상태 갱신
      setScheduledHospitals(mergedEvents.filter(ev => ev.type === 'hospital' && ev.status === 'pending'));
      alert(`정기 병원 등록 및 ${monthsToAdd}개월 주기 기준 향후 3회분의 일정이 자동 생성되었습니다!`);
    }

    setNewHospName('');
    setNewHospDept('');
    setFirstVisitDate('');
    setShowAddHosp(false);
  };

  const handleDeleteHospital = (index: number) => {
    const updated = hospitals.filter((_, idx) => idx !== index);
    setHospitals(updated);
    localStorage.setItem('dolbomon_hospitals', JSON.stringify(updated));
  };

  // 약 추가/삭제
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedSchedule.trim()) return;
    const updated = [...medicines, { name: newMedName.trim(), schedule: newMedSchedule.trim(), remaining: newMedRemaining.trim() || '정보 없음' }];
    setMedicines(updated);
    localStorage.setItem('dolbomon_medicines', JSON.stringify(updated));
    setNewMedName('');
    setNewMedSchedule('');
    setNewMedRemaining('');
    setShowAddMed(false);
  };

  const handleDeleteMedicine = (index: number) => {
    const updated = medicines.filter((_, idx) => idx !== index);
    setMedicines(updated);
    localStorage.setItem('dolbomon_medicines', JSON.stringify(updated));
  };

  // 문서 추가/삭제
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocIssuer.trim()) return;
    const updated = [...documents, { type: newDocType, name: newDocName.trim(), date: newDocDate || new Date().toISOString().slice(0, 10), issuer: newDocIssuer.trim() }];
    setDocuments(updated);
    localStorage.setItem('dolbomon_documents', JSON.stringify(updated));
    setNewDocName('');
    setNewDocIssuer('');
    setNewDocDate('');
    setShowAddDoc(false);
  };

  const handleDeleteDoc = (index: number) => {
    const updated = documents.filter((_, idx) => idx !== index);
    setDocuments(updated);
    localStorage.setItem('dolbomon_documents', JSON.stringify(updated));
  };

  // 연락처 추가/삭제
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactTel.trim()) return;
    const updated = [...contacts, { name: newContactName.trim(), tel: newContactTel.trim(), role: newContactRole }];
    setContacts(updated);
    localStorage.setItem('dolbomon_contacts', JSON.stringify(updated));
    setNewContactName('');
    setNewContactTel('');
    setShowAddContact(false);
  };

  const handleDeleteContact = (index: number) => {
    const updated = contacts.filter((_, idx) => idx !== index);
    setContacts(updated);
    localStorage.setItem('dolbomon_contacts', JSON.stringify(updated));
  };

  const handleEditOpen = () => {
    setEditForm({ ...parentInfo });
    setIsEditing(true);
  };

  const toggleAlarmSelection = (alarm: string) => {
    if (selectedAlarms.includes(alarm)) {
      setSelectedAlarms(selectedAlarms.filter(a => a !== alarm));
    } else {
      setSelectedAlarms([...selectedAlarms, alarm]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#111827] font-sans pb-32">
      <div className="max-w-md mx-auto px-5 pt-10 space-y-4">
        
        {/* 부모님의 상태 */}
        <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <h2 className="text-[18px] font-bold text-[#111827] mb-2.5">부모님 상태</h2>
          
          <div className="flex items-center justify-between p-3 bg-[#16C47F]/10 rounded-xl border border-[#16C47F]/20 mb-2.5">
            <div>
              <span className="text-[14px] font-semibold text-[#111827] block">안정 상태</span>
              <span className="text-[11px] text-[#6B7280] block">식사 및 수면 양호</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#16C47F] text-white">
              안정
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '수면', value: '안정', color: '#16C47F' },
              { label: '식사', value: '보통', color: '#FFB020' },
              { label: '거동', value: '불편', color: '#FF5C7A' },
            ].map((st, idx) => (
              <div key={idx} className="p-2.5 rounded-xl border border-slate-100 text-center bg-slate-50/50">
                <span className="text-[11px] text-[#6B7280] block font-medium">{st.label}</span>
                <span className="text-[14px] font-bold block mt-0.5" style={{ color: st.color }}>
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 어머님 기본정보 */}
        <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">👩</span>
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">{parentInfo.name} 기본정보</h2>
                <p className="text-[11px] text-[#6B7280]">정보 요약 및 관리</p>
              </div>
            </div>
            <button
              onClick={handleEditOpen}
              className="flex items-center gap-1 text-[12px] font-semibold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2.5 py-1.5 rounded-xl hover:bg-[#5B3DF5]/10 transition-colors"
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
              <span>등록/수정</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            {[
              { label: '성함', value: parentInfo.name },
              { label: '연세', value: parentInfo.age },
              { label: '등급', value: parentInfo.grade },
              { label: '인정번호', value: parentInfo.idNumber },
              { label: '보호자', value: parentInfo.guardian },
              { label: '서비스', value: parentInfo.service },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-b-0">
                <span className="text-[#6B7280] font-medium">{item.label}</span>
                <span className="font-semibold text-[#111827] text-right truncate max-w-[90px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 서브 메뉴 탭 */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
          {[
            { key: 'health', label: '건강' },
            { key: 'medicine', label: '약' },
            { key: 'docs', label: '문서' },
            { key: 'contacts', label: '연락처' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-all flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                  : 'bg-white text-[#6B7280] border-slate-200 hover:text-[#111827]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 별 상세 콘텐츠 */}
        <div className="space-y-3">
          
          {/* 1. 건강 탭 */}
          {activeTab === 'health' && (
            <div className="space-y-3">
              {/* 질환 목록 */}
              <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-[18px] font-bold text-[#111827]">현재 질환</h3>
                  <button
                    onClick={() => setShowAddDisease(true)}
                    className="flex items-center gap-0.5 text-[11px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2.5 py-1 rounded-lg"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>추가</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {diseases.length === 0 ? (
                    <span className="text-[13px] text-[#6B7280]">등록된 질환이 없습니다.</span>
                  ) : (
                    diseases.map((d, i) => (
                      <span key={i} className="flex items-center gap-1 bg-[#FF5C7A]/5 border border-[#FF5C7A]/10 text-[#FF5C7A] text-[12px] font-semibold px-2.5 py-1 rounded-lg">
                        <span>⚠️ {d}</span>
                        <button onClick={() => handleDeleteDisease(i)} className="hover:bg-[#FF5C7A]/10 rounded-full p-0.5 font-bold text-[10px]">✕</button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* 정기 방문 병원 */}
              <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-[18px] font-bold text-[#111827]">정기 방문 병원</h3>
                  <button
                    onClick={() => setShowAddHosp(true)}
                    className="flex items-center gap-0.5 text-[11px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2.5 py-1 rounded-lg"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>병원 등록</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {hospitals.length === 0 ? (
                    <p className="text-[13px] text-[#6B7280] text-center py-2">등록된 단골 병원이 없습니다.</p>
                  ) : (
                    hospitals.map((h, i) => (
                      <div key={i} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl relative group">
                        <button
                          onClick={() => handleDeleteHospital(i)}
                          className="absolute top-3 right-3 text-slate-300 hover:text-[#FF5C7A] font-bold"
                          title="삭제"
                        >
                          ✕
                        </button>
                        <div className="flex justify-between items-center pr-6 mb-1">
                          <span className="text-[14px] font-bold text-slate-800">{h.name}</span>
                          <span className="text-[11px] bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded font-bold">{h.dept}</span>
                        </div>
                        <span className="text-[12px] text-[#5B3DF5] font-semibold">🔄 {h.cycle}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 일정 연동 병원 일정 */}
              {scheduledHospitals.length > 0 && (
                <div className="bg-[#5B3DF5]/5 border border-[#5B3DF5]/20 rounded-[24px] p-4.5 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[15px] font-bold text-[#5B3DF5]">🏥 일정 연계: 예정된 병원 방문</h3>
                    <Link href="/dolbomon/schedule" className="text-[11px] font-bold text-[#5B3DF5] underline">일정 관리 →</Link>
                  </div>
                  <div className="space-y-1.5">
                    {scheduledHospitals.map(ev => (
                      <div key={ev.id} className="flex justify-between items-center text-[13px] bg-white/70 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-[#111827]">{ev.title}</span>
                        <span className="text-[#6B7280] font-medium text-[12px]">{ev.date} {ev.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 건강 변화 그래프 */}
              <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-3">
                <h3 className="text-[18px] font-bold text-[#111827]">최근 건강 변화 (2주)</h3>
                <div className="space-y-2.5">
                  {[
                    { label: '수면', val: 60, status: '하락 (-1h)' },
                    { label: '식사', val: 90, status: '안정 (90%)' },
                    { label: '기억', val: 75, status: '유지' },
                    { label: '거동', val: 65, status: '주의' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[13px]">
                      <span className="font-semibold text-[#111827] w-8 flex-shrink-0 text-left">{item.label}</span>
                      <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${item.val}%`, backgroundColor: item.status.includes('안정') ? '#16C47F' : item.status.includes('유지') ? '#5B3DF5' : item.status.includes('주의') ? '#FFB020' : '#FF5C7A' }} />
                      </div>
                      <span className="text-[#6B7280] text-[12px] font-semibold w-16 text-right">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. 약 탭 */}
          {activeTab === 'medicine' && (
            <div className="space-y-3">
              {/* 복약 목록 헤더 */}
              <div className="flex justify-between items-center px-1">
                <span className="text-[14px] font-semibold text-[#6B7280]">현재 복용 중인 약</span>
                <button
                  onClick={() => setShowAddMed(true)}
                  className="flex items-center gap-0.5 text-[11px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2 py-1 rounded-lg"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>약 등록</span>
                </button>
              </div>

              {/* 일정 연동 약수령 */}
              {scheduledMedicines.length > 0 && (
                <div className="bg-[#FFB020]/5 border border-[#FFB020]/20 rounded-[24px] p-4.5 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[15px] font-bold text-[#D97706]">💊 일정 연계: 예정된 약 수령</h3>
                    <Link href="/dolbomon/schedule" className="text-[11px] font-bold text-[#D97706] underline">일정 관리 →</Link>
                  </div>
                  <div className="space-y-1.5">
                    {scheduledMedicines.map(ev => (
                      <div key={ev.id} className="flex justify-between items-center text-[13px] bg-white/70 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-[#111827]">{ev.title}</span>
                        <span className="text-[#6B7280] font-medium text-[12px]">{ev.date} {ev.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {medicines.map((m, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-2 relative">
                  <button
                    onClick={() => handleDeleteMedicine(idx)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-[#FF5C7A]"
                    title="삭제"
                  >
                    ✕
                  </button>
                  <div className="flex justify-between items-start pr-6">
                    <h3 className="text-[16px] font-bold text-[#111827]">{m.name}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5B3DF5]/10 text-[#5B3DF5]">복용 중</span>
                  </div>
                  <div className="space-y-1 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">복용법</span>
                      <span className="font-medium text-[#111827]">{m.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">남은 분량</span>
                      <span className="font-medium text-[#FFB020]">{m.remaining}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. 문서 탭 */}
          {activeTab === 'docs' && (
            <div className="space-y-3">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-[18px] font-bold text-[#111827]">어머님 보관 문서</h3>
                  <button
                    onClick={() => setShowAddDoc(true)}
                    className="flex items-center gap-0.5 text-[11px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2 py-1 rounded-lg"
                  >
                    <PlusIcon className="w-3 h-3" />
                    <span>문서 업로드</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {documents.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors relative group">
                      <span className="text-xl">📄</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-1.5 py-0.2 rounded">{d.type}</span>
                          <span className="text-[11px] text-[#6B7280]">{d.date}</span>
                        </div>
                        <h4 className="text-[14px] font-semibold text-[#111827] truncate mt-0.5">{d.name}</h4>
                        <p className="text-[11px] text-[#6B7280]">{d.issuer}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteDoc(i)}
                        className="text-slate-300 hover:text-[#FF5C7A] ml-2"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. 연락처 탭 */}
          {activeTab === 'contacts' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1 mb-1">
                <span className="text-[14px] font-semibold text-[#6B7280]">돌봄 비상 연락처</span>
                <button
                  onClick={() => setShowAddContact(true)}
                  className="flex items-center gap-0.5 text-[11px] font-bold text-[#5B3DF5] bg-[#5B3DF5]/5 px-2 py-1 rounded-lg"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>연락처 추가</span>
                </button>
              </div>

              {contacts.map((c, i) => (
                <div key={i} className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 space-y-2.5 relative">
                  <button
                    onClick={() => handleDeleteContact(i)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-[#FF5C7A]"
                    title="삭제"
                  >
                    ✕
                  </button>
                  <div className="pr-6">
                    <span className="text-[10px] font-bold text-[#6B7280] bg-slate-100 px-1.5 py-0.5 rounded">{c.role}</span>
                    <h3 className="text-[16px] font-bold text-[#111827] mt-1">{c.name}</h3>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">{c.tel}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-50">
                    <a href={`tel:${c.tel}`} className="flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[12px] font-semibold">
                      <PhoneIcon className="w-3.5 h-3.5 text-[#5B3DF5]" />
                      <span>전화</span>
                    </a>
                    <a href={`sms:${c.tel}`} className="flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[12px] font-semibold">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-[#5B3DF5]" />
                      <span>문자</span>
                    </a>
                    <button onClick={() => alert('카카오톡 전송')} className="flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-[12px] font-semibold">
                      <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-[#5B3DF5]" />
                      <span>톡</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* 우리집 돌봄비용 계산기 */}
        <Link href="/dolbomon/calculator" className="block">
          <div className="bg-[#5B3DF5] rounded-[24px] p-5 text-white shadow-[0_4px_20px_rgba(91,61,245,0.25)] flex justify-between items-center transition-transform active:scale-[0.99]">
            <div>
              <h3 className="text-[16px] font-semibold">우리집 돌봄비용 계산기</h3>
              <p className="text-[12px] text-white/80 mt-1">지원금 및 자가부담 비율 예측하기</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="white" strokeWidth={2.5}>
                <polyline points="6,4 10,8 6,12"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* 돌봄가족 무제한 보관 및 공유 배너 */}
        <div className="bg-[#111827] rounded-[24px] p-6 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#5B3DF5]/20 blur-2xl rounded-full" />
          <span className="inline-block text-[12px] font-bold bg-[#5B3DF5] text-white px-2.5 py-0.5 rounded-full mb-3">PREMIUM</span>
          <h3 className="text-[18px] font-semibold mb-1">돌봄가족 무제한 보관 및 공유</h3>
          <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-4">보관 기간 만료나 분실 걱정 없이 중요한 처방전, 보험 청구용 진단서, 장기요양 인정서 등 건강 서류를 보관해 보세요.</p>
          <button className="w-full bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white text-[17px] font-semibold py-3 rounded-2xl transition-all">월 4,900원으로 문서함 업그레이드</button>
        </div>

      </div>

      {/* ── 기본정보 등록/수정 모달 ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">기본정보 등록/수정</h3>
              <button onClick={() => setIsEditing(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-3">
              {['name', 'age', 'grade', 'idNumber', 'guardian', 'service'].map((key) => {
                const labelMap: Record<string, string> = { name: '어머님 성함', age: '연세 (출생년도)', grade: '장기요양 등급', idNumber: '장기요양 인정번호', guardian: '보호자 관계', service: '이용 중인 서비스' };
                return (
                  <div key={key}>
                    <label className="block text-[12px] font-bold text-[#6B7280] mb-1">{labelMap[key]}</label>
                    <input
                      type="text"
                      required
                      value={editForm[key as keyof ParentInfo]}
                      onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none focus:border-[#5B3DF5]"
                    />
                  </div>
                );
              })}
              <button type="submit" className="w-full bg-[#5B3DF5] hover:bg-[#5B3DF5]/90 text-white font-semibold py-3 rounded-xl transition-all text-[15px] mt-2">등록완료</button>
            </form>
          </div>
        </div>
      )}

      {/* ── 질환 추가 모달 ── */}
      {showAddDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">현재 질환 추가</h3>
              <button onClick={() => setShowAddDisease(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddDisease} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">질환명 입력</label>
                <input type="text" required placeholder="예: 당뇨, 파킨슨병" value={newDisease} onChange={e => setNewDisease(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAddDisease(false)} className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[14px] font-semibold">취소</button>
                <button type="submit" className="flex-1 bg-[#5B3DF5] text-white font-semibold py-3 rounded-xl text-[14px]">추가하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 병원 등록 모달 (알람 조건 및 일정 연계 로직 추가) ── */}
      {showAddHosp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">정기 방문 병원 등록</h3>
              <button onClick={() => setShowAddHosp(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddHospital} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">병원/의원명</label>
                <input type="text" required placeholder="예: 대전선병원, 제일내과" value={newHospName} onChange={e => setNewHospName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">진료 과목</label>
                <input type="text" required placeholder="예: 재활의학과, 내과" value={newHospDept} onChange={e => setNewHospDept(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none focus:border-[#5B3DF5]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">정기 진료 주기</label>
                <select value={newHospCycle} onChange={e => setNewHospCycle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] bg-white focus:border-[#5B3DF5]">
                  <option value="1개월">1개월</option>
                  <option value="2개월">2개월</option>
                  <option value="3개월">3개월</option>
                  <option value="6개월">6개월</option>
                </select>
              </div>

              {/* 일정 연동 및 조건부 알람 옵션 */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#111827]">🗓️ 일정 자동 등록</span>
                  <input type="checkbox" checked={autoGenSchedule} onChange={e => setAutoGenSchedule(e.target.checked)} className="w-4 h-4 text-[#5B3DF5]" />
                </div>
                
                {autoGenSchedule && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6B7280] mb-0.5">첫 방문일 (기준일)</label>
                      <input type="date" required value={firstVisitDate} onChange={e => setFirstVisitDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] bg-white focus:border-[#5B3DF5]" />
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-[#6B7280] mb-1">미리 알람 선택 (중복 가능)</label>
                      <div className="flex flex-wrap gap-1">
                        {['일주일 전', '1일 전', '1시간 전', '10분 전'].map(alarm => {
                          const has = selectedAlarms.includes(alarm);
                          return (
                            <button key={alarm} type="button" onClick={() => toggleAlarmSelection(alarm)} className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${has ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]' : 'bg-white text-slate-500 border-slate-200'}`}>
                              {alarm}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-[#6B7280]">주기마다 반복 알림 설정</span>
                      <input type="checkbox" checked={repeatAlarm} onChange={e => setRepeatAlarm(e.target.checked)} className="w-3.5 h-3.5 text-[#5B3DF5]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddHosp(false)} className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[14px] font-semibold">취소</button>
                <button type="submit" className="flex-1 bg-[#5B3DF5] text-white font-semibold py-3 rounded-xl text-[14px]">등록하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 약 등록 모달 ── */}
      {showAddMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">새 복용 약 등록</h3>
              <button onClick={() => setShowAddMed(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddMedicine} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">약물명 (용량)</label>
                <input type="text" required placeholder="예: 하루날디정 0.2mg" value={newMedName} onChange={e => setNewMedName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">복용 주기 (복용법)</label>
                <input type="text" required placeholder="예: 아침 식후 30분, 하루 2회" value={newMedSchedule} onChange={e => setNewMedSchedule(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">잔여 분량 정보</label>
                <input type="text" placeholder="예: 30정 남음 (4주분)" value={newMedRemaining} onChange={e => setNewMedRemaining(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] focus:outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddMed(false)} className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[14px] font-semibold">취소</button>
                <button type="submit" className="flex-1 bg-[#5B3DF5] text-white font-semibold py-3 rounded-xl text-[14px]">등록하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 문서 업로드 모달 ── */}
      {showAddDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">문서 보관 등록</h3>
              <button onClick={() => setShowAddDoc(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddDoc} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">문서 종류</label>
                <select value={newDocType} onChange={e => setNewDocType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] bg-white">
                  <option value="처방전">처방전</option>
                  <option value="진단서">진단서</option>
                  <option value="인정서">인정서</option>
                  <option value="급여명세서">급여명세서</option>
                  <option value="기타">기타 서류</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">문서명</label>
                <input type="text" required placeholder="예: 6월 방문요양 영수증" value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">발행 기관</label>
                <input type="text" required placeholder="예: 유성구청, 하나약국" value={newDocIssuer} onChange={e => setNewDocIssuer(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">발행 일자</label>
                <input type="date" value={newDocDate} onChange={e => setNewDocDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] bg-white" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDoc(false)} className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[14px] font-semibold">취소</button>
                <button type="submit" className="flex-1 bg-[#5B3DF5] text-white font-semibold py-3 rounded-xl text-[14px]">보관하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 연락처 추가 모달 ── */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#111827]">비상 연락처 추가</h3>
              <button onClick={() => setShowAddContact(false)} className="text-[#6B7280] hover:text-[#111827]"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">구분</label>
                <select value={newContactRole} onChange={e => setNewContactRole(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px] bg-white">
                  <option value="요양기관">요양기관 (주야간보호, 방문요양)</option>
                  <option value="주요기관">주요기관 (보건소, 공단)</option>
                  <option value="비상 연락">비상 연락 (가족, 이웃)</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">이름/기관명</label>
                <input type="text" required placeholder="예: 대전 치매안심센터" value={newContactName} onChange={e => setNewContactName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] mb-1">전화번호</label>
                <input type="tel" required placeholder="예: 010-1234-5678" value={newContactTel} onChange={e => setNewContactTel(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[14px]" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddContact(false)} className="flex-1 py-3 bg-slate-100 text-[#6B7280] rounded-xl text-[14px] font-semibold">취소</button>
                <button type="submit" className="flex-1 bg-[#5B3DF5] text-white font-semibold py-3 rounded-xl text-[14px]">추가하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
