'use client';

import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function DonatePage() {
  const tossDonationUrl = "https://toss.me/kitox_leader/2000";

  const processDonation = () => {
    // 모바일 환경 등에서 딥링크 격발을 위해 location.href 사용
    // 브라우저가 알아서 토스 앱이 있으면 띄워주고, 없으면 웹으로 연결
    window.location.href = tossDonationUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href='/dolbomon'}>
            <HeartIcon className="w-8 h-8 text-rose-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-700">
              돌봄온
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 items-center">
            <a href="/dolbomon" className="hover:text-amber-700 transition-colors">장기요양계산기</a>
            <a href="/dolbomon/mission" className="hover:text-amber-700 transition-colors">자녀효도퀘스트</a>
            <a href="/dolbomon/os" className="hover:text-amber-700 transition-colors">돌봄온</a>
            <span className="font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">☕ 커피응원</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 px-6 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-100 p-8 sm:p-12 text-center relative overflow-hidden">
          
          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-50 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="text-6xl mb-6 drop-shadow-md">☕</div>
            
            {/* Narrative */}
            <h1 className="text-2xl font-extrabold text-slate-800 mb-6 leading-tight">
              엄마 개발자에게<br />따뜻한 커피 한 잔 어떠세요?
            </h1>
            
            <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed font-medium mb-10 text-left sm:text-center px-2">
              <p>
                삼 남매를 키우며 홀로 밤새워 AI를 공부해 만든 <strong>무료 앱</strong>입니다.
              </p>
              <p>
                위로는 부모님의 요양을 고민하고, 아래로는 아이들의 경제 교육을 걱정하는 
                우리 4050 세대의 고단함을 누구보다 잘 알기에 <strong>광고 없이 청정하게</strong> 준비했습니다.
              </p>
              <p>
                이 작은 공간이 계속 유지될 수 있도록, 커피 한 잔(2,000원)의 응원으로 
                힘을 보태주시면 감사하겠습니다.
              </p>
            </div>

            {/* CTA Button */}
            <button 
              onClick={processDonation}
              className="w-full sm:w-auto bg-[#8D6E63] hover:bg-[#795548] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[#8D6E63]/30 active:scale-95 flex items-center justify-center space-x-2 mx-auto"
            >
              <span className="text-xl">☕</span>
              <span>지친 엄마 개발자에게 커피 한 잔 응원하기 (2,000원)</span>
            </button>

            {/* Footer / Disclaimer */}
            <div className="mt-10 pt-6 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed px-4">
              * 본 후원금은 광고 없는 청정 돌봄온 서비스의 서버 인프라 유지 및 데이터 업데이트 비용으로만 소중하게 사용됩니다.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
