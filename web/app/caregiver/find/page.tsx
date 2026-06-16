'use client';

import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, StarIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

// ─────────────────────────────────────────────────────────────
// 🔍 돌봄 찾기 — 요양시설 / 요양보호사 / 손주매칭
// ─────────────────────────────────────────────────────────────

type ServiceCategory = 'facility' | 'homecare' | 'grandchild';

type Facility = {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  reviewCount: number;
  distance: string;
  monthlyFee: string;
  vacancy: boolean;
  tags: string[];
};

const MOCK_FACILITIES: Facility[] = [
  { id: '1', name: '하늘사랑 요양원', type: '노인요양시설', location: '대전 유성구 봉명동', rating: 4.8, reviewCount: 47, distance: '1.2km', monthlyFee: '월 85~120만원', vacancy: true, tags: ['치매 전문', '2인실 여유', '가족 방문 자유'] },
  { id: '2', name: '행복한노을 요양원', type: '노인요양시설', location: '대전 서구 탄방동', rating: 4.5, reviewCount: 31, distance: '2.8km', monthlyFee: '월 90~130만원', vacancy: false, tags: ['1등급 특화', '의사 상주', '종교활동'] },
  { id: '3', name: '해피케어 주간보호센터', type: '주간보호', location: '대전 중구 대흥동', rating: 4.9, reviewCount: 62, distance: '0.9km', monthlyFee: '월 30~50만원', vacancy: true, tags: ['치매등급 전용', '가요/체조', '도시락 제공'] },
];

type Caregiver = {
  id: string;
  name: string;
  age: number;
  career: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  available: string;
};

const MOCK_CAREGIVERS: Caregiver[] = [
  { id: '1', name: '박○○ 요양보호사', age: 52, career: '경력 8년', specialty: ['치매케어', '치매전문교육 수료'], rating: 4.9, reviewCount: 28, hourlyRate: '시급 12,000원', available: '주 5일 오전 가능' },
  { id: '2', name: '김○○ 요양보호사', age: 45, career: '경력 5년', specialty: ['거동불편', '욕창관리'], rating: 4.7, reviewCount: 19, hourlyRate: '시급 11,500원', available: '주 3~5일 유연' },
];

type GrandchildService = {
  id: string;
  name: string;
  age: number;
  services: string[];
  rating: number;
  reviewCount: number;
  region: string;
  fee: string;
  bio: string;
};

const MOCK_GRANDCHILD: GrandchildService[] = [
  { id: '1', name: '이○○ (대학생)', age: 22, services: ['말벗 대화', '병원 동행', '장보기 동행'], rating: 5.0, reviewCount: 12, region: '대전 유성구·중구', fee: '시간당 12,000원', bio: '사회복지학과 3학년. 할머니와 함께 자라 어르신 대화에 편안함을 느낍니다.' },
  { id: '2', name: '최○○ (직장인)', age: 28, services: ['병원 동행', '관공서 동행', '스마트폰 도움'], rating: 4.8, reviewCount: 8, region: '대전 서구·중구', fee: '시간당 15,000원', bio: '사회초년생. 주말 봉사경험 3년. 꼼꼼하고 책임감 있습니다.' },
];

export default function FindCarePage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('facility');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('대전');

  const categories: { key: ServiceCategory; label: string; emoji: string; desc: string; badge?: string }[] = [
    { key: 'facility', label: '요양시설', emoji: '🏠', desc: '요양원 · 주간보호' },
    { key: 'homecare', label: '요양보호사', emoji: '👩‍⚕️', desc: '방문요양 · 재가케어' },
    { key: 'grandchild', label: '손주매칭', emoji: '🤝', desc: '말벗 · 병원동행', badge: '국내최초' },
  ];

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        i <= Math.floor(rating)
          ? <StarSolid key={i} className="w-3 h-3 text-amber-400" />
          : <StarIcon key={i} className="w-3 h-3 text-slate-200" />
      ))}
      <span className="text-[10px] text-slate-500 font-bold ml-0.5">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto pb-8">

      {/* ── Search Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 pt-4 pb-4 sticky top-14 z-40 shadow-sm">
        <div className="flex gap-2 mb-3">
          <div className="flex-grow relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="시설명, 지역 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-2 py-2 bg-slate-50 outline-none font-bold text-slate-700"
          >
            {['대전', '서울', '경기', '인천', '부산'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all relative ${
                activeCategory === cat.key
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.badge && (
                <span className="absolute -top-1.5 -right-1 text-[8px] bg-rose-500 text-white font-extrabold px-1 py-0.5 rounded-full leading-none">
                  {cat.badge}
                </span>
              )}
              <span className="text-base">{cat.emoji}</span>
              <span className="text-[9px] font-extrabold mt-0.5">{cat.label}</span>
              <span className={`text-[8px] font-medium ${activeCategory === cat.key ? 'text-blue-100' : 'text-slate-400'}`}>{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── 요양시설 목록 ── */}
        {activeCategory === 'facility' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700">{selectedRegion} 지역 시설 {MOCK_FACILITIES.length}곳</span>
              <span className="text-[10px] text-slate-400 font-semibold">거리순</span>
            </div>
            {MOCK_FACILITIES.map(f => (
              <div key={f.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-extrabold text-slate-900">{f.name}</h3>
                      {f.vacancy
                        ? <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">입소가능</span>
                        : <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded font-bold">대기중</span>
                      }
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{f.type}</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-extrabold">{f.distance}</span>
                </div>

                {renderStars(f.rating)}

                <div className="flex items-center gap-1 mt-2 mb-3">
                  <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-semibold">{f.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {f.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-xs font-extrabold text-indigo-600">{f.monthlyFee}</span>
                  <button className="text-[10px] bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-800 transition-all">
                    <PhoneIcon className="w-3 h-3" />
                    <span>상담 신청</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 요양보호사 목록 ── */}
        {activeCategory === 'homecare' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-[10px] text-blue-800 font-bold">
                💡 방문요양은 장기요양 3~5등급 판정 후 이용하면 본인부담금이 <strong>15%</strong>로 줄어듭니다.
              </p>
            </div>
            {MOCK_CAREGIVERS.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl flex-shrink-0">👩‍⚕️</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-extrabold text-slate-900">{c.name}</h3>
                      <span className="text-xs font-extrabold text-indigo-600">{c.hourlyRate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{c.career} · {c.age}세</div>
                    {renderStars(c.rating)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.specialty.map(s => (
                    <span key={s} className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-[10px] text-slate-500 font-semibold">📅 {c.available}</span>
                  <button className="text-[10px] bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all">
                    매칭 신청
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 손주 매칭 (국내 최초) ── */}
        {activeCategory === 'grandchild' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🤝</span>
                <div>
                  <h3 className="text-xs font-extrabold text-rose-800">손주 매칭 서비스 — 국내 최초</h3>
                  <p className="text-[10px] text-rose-700 mt-1 leading-relaxed font-medium">
                    청년(대학생·사회초년생)이 어르신의 말벗, 병원동행, 장보기를 도와드립니다.
                    요양보호사보다 저렴하고, 손녀처럼 가깝게 대해 드립니다.
                  </p>
                </div>
              </div>
            </div>
            {MOCK_GRANDCHILD.map(g => (
              <div key={g.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-xl flex-shrink-0">🧑</div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">{g.name}</h3>
                      <span className="text-xs font-extrabold text-rose-600">{g.fee}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{g.age}세</div>
                    {renderStars(g.rating)}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">{g.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {g.services.map(s => (
                    <span key={s} className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-bold">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-semibold">{g.region}</span>
                  </div>
                  <button className="text-[10px] bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-all">
                    손주 매칭 신청
                  </button>
                </div>
              </div>
            ))}

            <div className="text-center py-4">
              <p className="text-[10px] text-slate-400 font-semibold">손주 매칭 파트너로 활동하고 싶으신가요?</p>
              <button className="mt-2 text-xs text-rose-600 font-extrabold hover:underline">손주 파트너 등록 신청 →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
