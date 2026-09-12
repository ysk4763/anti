import { NextResponse } from 'next/server';
import { generateThreadsFromPlan } from '@/lib/promptTemplates';
import { ReelPlan } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/generate-threads
 * 릴스 기획안을 바탕으로 SNS 쓰레드 콘텐츠를 생성하는 API
 */
export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: ReelPlan };

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '기획안 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const threadPost = generateThreadsFromPlan(plan);

    return NextResponse.json({
      success: true,
      data: threadPost,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || '쓰레드 생성 오류' },
      { status: 500 }
    );
  }
}
