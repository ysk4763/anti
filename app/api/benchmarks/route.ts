import { NextResponse } from 'next/server';
import { getAllBenchmarkReels } from '@/lib/benchmarkData';

export const dynamic = 'force-dynamic';

/**
 * GET /api/benchmarks
 * 카테고리, 정렬, 검색 쿼리를 바탕으로 릴스 벤치마킹 데이터를 반환하는 API
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'views';
    const query = searchParams.get('q') || '';

    let reels = getAllBenchmarkReels();

    if (category !== 'all') {
      reels = reels.filter((r) => r.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      reels = reels.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.caption.toLowerCase().includes(q)
      );
    }

    if (sort === 'views') {
      reels.sort((a, b) => b.views - a.views);
    } else if (sort === 'likes') {
      reels.sort((a, b) => b.likes - a.likes);
    }

    return NextResponse.json({
      success: true,
      total: reels.length,
      data: reels,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || '데이터 조회 중 오류 발생' },
      { status: 500 }
    );
  }
}
