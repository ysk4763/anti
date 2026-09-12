import { NextResponse } from 'next/server';
import { generateReelPlan, PlanGenerationRequest } from '@/lib/promptTemplates';

export const dynamic = 'force-dynamic';

/**
 * POST /api/generate-plan
 * 레퍼런스 및 사용자 요구사항을 기반으로 맞춤형 릴스 기획안을 생성하는 API
 */
export async function POST(request: Request) {
  try {
    const body: PlanGenerationRequest = await request.json();

    if (!body.referenceReel) {
      return NextResponse.json(
        { success: false, message: '레퍼런스 릴스 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const plan = generateReelPlan(body);

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || '기획안 생성 중 오류 발생' },
      { status: 500 }
    );
  }
}
