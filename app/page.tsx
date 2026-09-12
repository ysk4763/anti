'use client';

/**
 * AI INNO LAB - 릴스 벤치마킹 메인 페이지 (app/page.tsx)
 * 인스타그램 실시간 릴스 URL 추출 분석기, 카테고리별 그리드, 공식 임베드 & 동영상 재생 모달, 
 * 조회수순 정렬, 필터링, 원클릭 AI 기획안 생성 링크를 제공합니다.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { getAllBenchmarkReels } from '@/lib/benchmarkData';
import { REEL_CATEGORIES, ReelBenchmark } from '@/lib/types';
import BenchmarkCard from '@/components/BenchmarkCard';
import ReelPlayerModal from '@/components/ReelPlayerModal';
import { getBookmarkedReels } from '@/lib/storage';
import { Sparkles, Search, RefreshCw, Instagram, ArrowRight, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BenchmarkPage() {
  const router = useRouter();

  // 상태 관리
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'latest'>('views');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePlayReel, setActivePlayReel] = useState<ReelBenchmark | null>(null);

  // 인스타그램 릴스 실시간 URL 분석기 상태
  const [instaInputUrl, setInstaInputUrl] = useState<string>('');
  const [isAnalyzingInsta, setIsAnalyzingInsta] = useState<boolean>(false);
  const [instaError, setInstaError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = getBookmarkedReels();
    setBookmarkedIds(new Set(saved.map((b) => b.id)));
  }, []);

  const syncBookmarks = () => {
    const saved = getBookmarkedReels();
    setBookmarkedIds(new Set(saved.map((b) => b.id)));
  };

  // 전체 레퍼런스 데이터 로드
  const allReels = useMemo(() => {
    return getAllBenchmarkReels();
  }, []);

  // 인스타그램 URL 실시간 AI 분석 핸들러
  const handleAnalyzeInstagramUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaInputUrl.trim()) return;

    setIsAnalyzingInsta(true);
    setInstaError(null);

    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instaInputUrl.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || '인스타그램 릴스 정보를 불러올 수 없습니다.');
      }

      // 파싱된 릴스 데이터로 모달 열기 또는 기획 페이지로 이동
      const parsedReel: ReelBenchmark = json.data;
      setActivePlayReel(parsedReel);
      setInstaInputUrl('');
    } catch (err: any) {
      setInstaError(err.message || '인스타그램 링크를 확인해주세요.');
    } finally {
      setIsAnalyzingInsta(false);
    }
  };

  // 필터링 및 정렬 처리
  const filteredReels = useMemo(() => {
    let list = [...allReels];

    // 1. 카테고리 필터
    if (selectedCategory !== 'all') {
      list = list.filter((reel) => reel.category === selectedCategory);
    }

    // 2. 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (reel) =>
          reel.title.toLowerCase().includes(q) ||
          reel.author.toLowerCase().includes(q) ||
          reel.authorHandle.toLowerCase().includes(q) ||
          reel.caption.toLowerCase().includes(q)
      );
    }

    // 3. 정렬 (조회수순 기본)
    if (sortBy === 'views') {
      list.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'likes') {
      list.sort((a, b) => b.likes - a.likes);
    }

    // 북마크 여부 매핑
    return list.map((reel) => ({
      ...reel,
      isBookmarked: bookmarkedIds.has(reel.id),
    }));
  }, [allReels, selectedCategory, searchQuery, sortBy, bookmarkedIds]);

  // 페이지당 30개씩 노출
  const ITEMS_PER_PAGE = 30;
  const totalPages = Math.ceil(filteredReels.length / ITEMS_PER_PAGE) || 1;
  const paginatedReels = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReels, currentPage]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  if (!mounted) {
    return (
      <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={20} className="animate-spin" />
          <span>AI INNO LAB 로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* 1. 상단 타이틀 영역 */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          릴스 벤치마킹 & 인스타그램 실시간 분석
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          조회수 100만 떡상 릴스를 감상하고, 인스타그램 링크를 직접 넣어 AI로 분석 및 나만의 기획안을 제작하세요.
        </p>
      </div>

      {/* 2. [신규] 인스타그램 릴스 URL 실시간 추출 및 분석 바 */}
      <div className="glass-panel" style={{
        marginBottom: '28px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(225, 48, 108, 0.25)',
        borderRadius: '12px'
      }}>
        <form onSubmit={handleAnalyzeInstagramUrl} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              <Instagram size={18} color="#e1306c" />
              <span>실시간 인스타그램 릴스 링크 분석기</span>
              <span style={{ fontSize: '10px', background: 'rgba(225, 48, 108, 0.2)', color: '#f43f5e', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(225, 48, 108, 0.4)' }}>
                FREE API
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              인스타 앱에서 [링크 복사] 후 아래에 붙여넣기만 하면 AI가 즉시 분석합니다.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '10px 14px'
            }}>
              <LinkIcon size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={instaInputUrl}
                onChange={(e) => setInstaInputUrl(e.target.value)}
                placeholder="인스타그램 릴스 URL을 입력하세요 (예: https://www.instagram.com/reel/C3_example/)"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzingInsta || !instaInputUrl.trim()}
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 700,
                minWidth: '150px',
                background: 'linear-gradient(135deg, #e1306c 0%, #f77737 100%)',
                boxShadow: '0 4px 14px rgba(225, 48, 108, 0.35)'
              }}
            >
              {isAnalyzingInsta ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>정보 추출 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>실시간 분석하기 ⚡</span>
                </>
              )}
            </button>
          </div>

          {instaError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '12px', marginTop: '2px' }}>
              <AlertCircle size={14} />
              <span>{instaError}</span>
            </div>
          )}
        </form>
      </div>

      {/* 3. 카테고리 필터 탭바 */}
      <div className="category-filter-bar">
        {REEL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentPage(1);
            }}
            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. 검색 및 정렬 드롭다운 바 */}
      <div className="filter-header">
        {/* 검색 입력창 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 16px',
          width: '320px',
          maxWidth: '100%'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="키워드, 크리에이터 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>

        {/* 정렬 셀렉터 & 새로고침 */}
        <div className="sort-select-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="select-custom"
          >
            <option value="views">조회수순</option>
            <option value="likes">좋아요순</option>
            <option value="latest">최신 등록순</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-custom"
          >
            <option value="all">전체 기간</option>
            <option value="1m">최근 1개월</option>
            <option value="3m">최근 3개월</option>
            <option value="1y">최근 1년</option>
          </select>

          <button
            onClick={handleRefresh}
            className="btn btn-secondary btn-icon-only"
            title="새로고침"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 5. 릴스 카드 30개 그리드 리스트 */}
      {paginatedReels.length > 0 ? (
        <div className="reels-grid">
          {paginatedReels.map((reel) => (
            <BenchmarkCard
              key={reel.id}
              reel={reel}
              onBookmarkChange={syncBookmarks}
              onPlayReel={(r) => setActivePlayReel(r)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel">
          <Sparkles size={40} color="var(--accent-orange)" />
          <h3>검색 결과가 없습니다</h3>
          <p>다른 검색어나 카테고리를 선택해보세요.</p>
        </div>
      )}

      {/* 6. 페이지네이션 (30개 단위) */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            이전
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`page-num-btn ${currentPage === num ? 'active' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            다음
          </button>
        </div>
      )}

      {/* 7. 릴스 비디오 재생 및 인스타그램 임베드 모달 */}
      {activePlayReel && (
        <ReelPlayerModal
          reel={activePlayReel}
          onClose={() => setActivePlayReel(null)}
          onBookmarkChange={syncBookmarks}
        />
      )}
    </div>
  );
}
