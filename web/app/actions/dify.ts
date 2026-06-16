'use server';

export type CaregiverReportParams = {
  age: number;
  region: string;
  disease: string;
  incomeLevel: string;
  careType: string;
  actualRatePercent: number;
  userMonthlyCost: number;
  potentialLossCost: number;
};

/**
 * 가족돌봄OS 스트레스 진단기 AI 서버 액션
 * Dify Cloud API를 호출하여 AI 맞춤 처방 결과를 반환합니다.
 */
export async function generateCaregiverReport(params: CaregiverReportParams): Promise<string> {
  const apiKey = process.env.DIFY_CAREGIVER_API_KEY;

  const fallbackMockReport = `
<h1 class="text-rose-600 text-2xl font-bold mb-4">🚨 이번 달 신청 안 하면 매월 최대 <strong>${params.potentialLossCost.toLocaleString()}원</strong>(추정) 손해 발생 가능성!</h1>
<p class="mb-4 text-slate-800 leading-relaxed">보호자님, 입력해주신 정보(${params.region} 거주, ${params.age}세)를 바탕으로 <strong>AI가 추정한 예상 결과</strong>입니다.</p>

<h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 flex items-center">💰 월 예상 비용 내역 (${params.careType === 'FACILITY' ? '요양원 입소(시설급여)' : '방문요양(재가급여)'})</h3>
<ul class="list-disc pl-6 mb-6 space-y-2 text-slate-700">
  <li><strong>적용 예상 감경 요율:</strong> <strong class="text-indigo-600">${params.actualRatePercent}%</strong></li>
  <li><strong>비급여 포함 월 예상 본인 부담금:</strong> <strong class="text-rose-600">약 ${params.userMonthlyCost.toLocaleString()}원</strong></li>
</ul>

<blockquote class="border-l-4 border-amber-400 pl-4 py-3 my-6 bg-amber-50 text-amber-900 rounded-r-lg shadow-sm text-sm">
  <strong>⚠️ 유의사항:</strong> 위 산정 금액은 공단 평균 수가를 기반으로 <strong>AI가 추정한 예상치</strong>입니다. 실제 청구액은 어르신의 정확한 장기요양등급, 실제 이용 시간, 시설별 비급여 항목(식대 등)에 따라 <strong>차이가 발생할 수 있습니다.</strong><br/><br/>
  다만, 등급을 신청하지 않고 100% 사비로 간병을 해결하실 경우 매월 약 <strong>${params.potentialLossCost.toLocaleString()}원</strong> 규모의 정부 지원 혜택을 놓치게 될 것으로 예상됩니다.
</blockquote>

<hr class="my-8 border-slate-200" />

<p class="font-bold text-indigo-700 text-lg mb-2">💡 AI 케어 코치의 한마디</p>
<p class="text-slate-700 leading-relaxed">예상보다 큰 혜택, 더 이상 미루지 마시고 장기요양등급 신청을 준비하세요! 복잡한 행정 절차는 <strong>가족돌봄OS</strong>가 매월 캘린더로 챙겨드립니다.</p>
  `;

  if (!apiKey) {
    console.warn('[Dify API] DIFY_CAREGIVER_API_KEY is not set. Returning mock report.');
    // API 키가 없으면 로컬/Vercel 테스트를 위해 기존과 동일한 Mock 데이터 반환
    return fallbackMockReport;
  }

  try {
    const response = await fetch('https://api.dify.ai/v1/completion-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          age: params.age,
          region: params.region,
          disease: params.disease,
          income_level: params.incomeLevel,
          care_type: params.careType,
          actual_rate_percent: params.actualRatePercent,
          user_monthly_cost: params.userMonthlyCost,
          potential_loss_cost: params.potentialLossCost,
        },
        response_mode: 'blocking',
        user: 'caregiver-os-anonymous',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Dify API Error]', response.status, errText);
      throw new Error(`Dify API returned ${response.status}`);
    }

    const data = await response.json();
    return data.answer || fallbackMockReport;
  } catch (error) {
    console.error('[Dify API Call Failed]', error);
    // 실패 시에도 앱이 깨지지 않도록 Fallback 제공
    return fallbackMockReport;
  }
}
