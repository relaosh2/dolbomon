'use client';

import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function LoginPage() {
  const [loadingType, setLoadingType] = useState<'KAKAO' | 'NAVER' | 'GOOGLE' | null>(null);

  const handleSocialLogin = async (type: 'KAKAO' | 'NAVER' | 'GOOGLE') => {
    setLoadingType(type);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('caregiver_user_token', data.token);
        localStorage.setItem('caregiver_user_id', data.user.id);
        localStorage.setItem('caregiver_user_name', data.user.name);
        localStorage.setItem('caregiver_user_role', data.user.role);
        
        // Redirect to root calculator page
        window.location.href = '/';
      } else {
        alert('로그인에 실패했습니다: ' + data.error);
        setLoadingType(null);
      }
    } catch (err) {
      console.error(err);
      alert('서버와 통신 중 에러가 발생했습니다.');
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 selection:bg-indigo-200">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-6 font-sans">
            <HeartIcon className="w-12 h-12 text-rose-500 drop-shadow-md" />
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">
              가족돌봄OS
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3 font-sans">
            대한민국 최초<br />AI 기반 가족 돌봄 운영체계
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            돈, 일정, 행정 처리부터 자녀 경제 교육까지.<br />복잡한 간병의 무게를 기술로 덜어드립니다.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white">
          <div className="text-center mb-8">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
              단 3초 만에 시작하기
            </span>
            <h3 className="text-slate-700 font-semibold text-sm">복잡한 절차 없이 간편하게 가입하세요.</h3>
          </div>

          <div className="space-y-4">
            
            {/* Kakao Button */}
            <button
              onClick={() => handleSocialLogin('KAKAO')}
              disabled={loadingType !== null}
              className={`w-full flex items-center justify-center space-x-3 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] font-bold py-4 px-6 rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loadingType === 'KAKAO' ? (
                <Spinner color="text-black" />
              ) : (
                <>
                  <div className="w-6 h-6 flex items-center justify-center bg-black text-[#FEE500] rounded-full text-xs font-black">
                    K
                  </div>
                  <span>카카오톡으로 3초 만에 시작하기</span>
                </>
              )}
            </button>

            {/* Naver Button */}
            <button
              onClick={() => handleSocialLogin('NAVER')}
              disabled={loadingType !== null}
              className={`w-full flex items-center justify-center space-x-3 bg-[#03C75A] hover:bg-[#02b351] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loadingType === 'NAVER' ? (
                <Spinner color="text-white" />
              ) : (
                <>
                  <div className="w-6 h-6 flex items-center justify-center bg-white text-[#03C75A] rounded-md text-sm font-black">
                    N
                  </div>
                  <span>네이버로 시작하기</span>
                </>
              )}
            </button>

            {/* Google Button */}
            <button
              onClick={() => handleSocialLogin('GOOGLE')}
              disabled={loadingType !== null}
              className={`w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loadingType === 'GOOGLE' ? (
                <Spinner color="text-slate-400" />
              ) : (
                <>
                  <div className="w-6 h-6 flex items-center justify-center bg-transparent border border-slate-300 text-slate-600 rounded-full text-sm font-black">
                    G
                  </div>
                  <span>Google계정으로 시작하기</span>
                </>
              )}
            </button>
            
          </div>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            가입 시 <a href="#" className="underline hover:text-slate-600">이용약관</a> 및 <a href="#" className="underline hover:text-slate-600">개인정보 처리방침</a>에 동의하게 됩니다.
          </div>
        </div>

      </div>
    </div>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <div className="flex items-center space-x-2">
      <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>안전하게 로그인 중...</span>
    </div>
  );
}
