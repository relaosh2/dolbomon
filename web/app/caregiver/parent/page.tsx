'use client';

import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  PlusIcon, 
  PhoneIcon, 
  FolderIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type Medicine = {
  id: string;
  name: string;
  dosage: string;
  time: string;
};

type Disease = {
  id: string;
  name: string;
  severity: string;
};

type Hospital = {
  id: string;
  name: string;
  dept: string;
  cycle: string;
};

type Contact = {
  id: string;
  name: string;
  role: string;
  phone: string;
};

export default function OurParentPage() {
  const [profile, setProfile] = useState({
    name: '김순옥 어머님',
    age: 78,
    grade: '장기요양 3등급 판정',
    no: 'L-2026-9812-4411'
  });

  const [diseases, setDiseases] = useState<Disease[]>([
    { id: '1', name: '알츠하이머 치매 (초기)', severity: '주의 필요' },
    { id: '2', name: '본태성 고혈압', severity: '지속 복약 중' },
    { id: '3', name: '퇴행성 관절염', severity: '통증 관리' },
  ]);

  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: '아리셉트정 5mg (치매 개선)', dosage: '1일 1회', time: '아침 식후' },
    { id: '2', name: '딜라트렌정 12.5mg (혈압약)', dosage: '1일 1회', time: '아침 식후' },
    { id: '3', name: '세레브렉스캡슐 (소염진통)', dosage: '필요시 복용', time: '저녁 식후' },
  ]);

  const [hospitals, setHospitals] = useState<Hospital[]>([
    { id: '1', name: '충남대학교병원', dept: '신경과 (치매)', cycle: '3개월 주기 정기 검진' },
    { id: '2', name: '을지대학교병원', dept: '순환기내과', cycle: '2개월 주기 약 처방' },
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: '대전 유성구 보건소', role: '치매안심센터', phone: '042-860-6000' },
    { id: '2', name: '해피돌봄 방문요양센터', role: '담당 복지사', phone: '010-1234-5678' },
    { id: '3', name: '대장님 (보호자 본인)', role: '비상 1순위', phone: '010-9999-8888' },
  ]);

  // Modals state
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  
  // Storage box Premium simulation
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);

  useEffect(() => {
    // Load from storage if available
    const savedProfile = localStorage.getItem('parent_profile_name');
    if (savedProfile) {
      setProfile(prev => ({ ...prev, name: savedProfile }));
    }
  }, []);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    const newMed: Medicine = {
      id: Date.now().toString(),
      name: newMedName,
      dosage: '1일 1회',
      time: newMedTime || '아침 식후'
    };
    setMedicines(prev => [...prev, newMed]);
    setNewMedName('');
    setNewMedTime('');
    setIsAddMedicineOpen(false);
  };

  const handleEditProfile = () => {
    const newName = prompt('어머님 혹은 아버님의 이름을 수정하시겠습니까?', profile.name);
    if (newName) {
      setProfile(prev => ({ ...prev, name: newName }));
      localStorage.setItem('parent_profile_name', newName);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-6 max-w-md mx-auto">
      
      {/* 1. Parent Profile Card */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-rose-600">
                <HeartIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                  <span>{profile.name}</span>
                  <button onClick={handleEditProfile} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                    수정
                  </button>
                </h2>
                <span className="text-xs text-slate-400 font-bold block mt-0.5">연세: {profile.age}세 (여)</span>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              {profile.grade}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between text-[11px] font-bold text-slate-500">
            <span>장기요양번호</span>
            <span className="text-slate-800">{profile.no}</span>
          </div>
        </div>
      </section>

      {/* 2. 질환 정보 */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-rose-500 rounded-full"></span>
            <span>진단된 주요 질환</span>
          </h3>
          <div className="space-y-2.5">
            {diseases.map(d => (
              <div key={d.id} className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100/30 rounded-xl">
                <span className="text-xs font-bold text-slate-800">{d.name}</span>
                <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">{d.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 복용 중인 약 */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-full"></span>
              <span>복용 약제</span>
            </h3>
            <button 
              onClick={() => setIsAddMedicineOpen(true)}
              className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg flex items-center gap-0.5"
            >
              <PlusIcon className="w-3 h-3" />
              <span>추가</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {medicines.map(m => (
              <div key={m.id} className="p-3 bg-slate-50/50 border border-slate-100/30 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{m.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{m.dosage} ({m.time})</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">복약 중</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 진료 병원 */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></span>
            <span>정기 방문 병원</span>
          </h3>
          <div className="space-y-2.5">
            {hospitals.map(h => (
              <div key={h.id} className="p-3 bg-slate-50/50 border border-slate-100/30 rounded-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold text-slate-800">{h.name}</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{h.dept}</span>
                </div>
                <span className="text-[10px] text-indigo-600 font-bold block mt-1.5">{h.cycle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 비상 연락망 */}
      <section className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 mb-3.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full"></span>
            <span>비상 연락망</span>
          </h3>
          <div className="space-y-2.5">
            {contacts.map(c => (
              <a 
                href={`tel:${c.phone}`} 
                key={c.id} 
                className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/30 rounded-xl transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{c.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PhoneIcon className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 서류함 (Premium subscription feature) */}
      <section className="mb-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                Premium
              </span>
              <h3 className="text-sm font-black text-white mt-2 flex items-center gap-1.5">
                <FolderIcon className="w-4 h-4 text-indigo-400" />
                <span>가족 공유 서류함</span>
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">진단서, 처방전 보관</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            건보공단 제출용 서류나 처방전을 클라우드에 안전하게 무제한 업로드하고, 형제들과 함께 확인하세요.
          </p>
          <button 
            onClick={() => setShowPremiumAlert(true)}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            클라우드 서류함 열기
          </button>
        </div>
      </section>

      {/* Add Medicine Modal */}
      {isAddMedicineOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddMedicine}
            className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black text-slate-900">새로운 약제 등록</h4>
              <button type="button" onClick={() => setIsAddMedicineOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">약 이름</label>
                <input 
                  type="text" 
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="예: 혈압약, 유산균" 
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">복용 시간</label>
                <select 
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="아침 식후">아침 식후</option>
                  <option value="점심 식후">점심 식후</option>
                  <option value="저녁 식후">저녁 식후</option>
                  <option value="취침 전">취침 전</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setIsAddMedicineOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                취소
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                추가하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Lock Alert Modal */}
      {showPremiumAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">멤버십 구독 혜택 안내</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              서류함 업로드 및 가족 공유 기능은 **돌봄온 3.0 멤버십(월 4,900원)** 전용 혜택입니다.<br />
              홈 화면에서 멤버십 무료체험을 시작해 보세요!
            </p>
            <button 
              onClick={() => setShowPremiumAlert(false)}
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
