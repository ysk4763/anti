import { NextResponse } from 'next/server';
import { generateSeedance25Prompt, generateGoogleFlowPrompt } from '@/lib/promptTemplates';
import { ReelPlan } from '@/lib/types';

/**
 * POST /api/generate-video-prompt
 * 릴스 기획안을 바탕으로 시덴스 2.5 또는 구글 FLOW 비디오 프롬프트를 생성하는 API
 */
export async function POST(request: Request) {
  try {
    const { plan, engineType } = (await request.json()) as {
      plan: ReelPlan;
      engineType: 'seedance_2_5' | 'google_flow';
    };

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '기획안 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    let result;
    if (engineType === 'seedance_2_5') {
      result = generateSeedance25Prompt(plan);
    } else {
      result = generateGoogleFlowPrompt(plan);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || '비디오 프롬프트 생성 오류' },
      { status: 500 }
    );
  }
}
