'use client';

/**
 * AI INNO LAB - 릴스 벤치마킹 메인 페이지 (app/page.tsx)
 * 인기 릴스 30개씩 카테고리별 그리드 표시, 실제 동영상 재생 모달, 조회수순 정렬, 필터링, 원클릭 AI 기획안 생성 링크 제공
 */

import React, { useState, useMemo, useEffect } from 'react';
import { getAllBenchmarkReels } from '@/lib/benchmarkData';
import { REEL_CATEGORIES, ReelBenchmark } from '@/lib/types';
import BenchmarkCard from '@/components/BenchmarkCard';
import ReelPlayerModal from '@/components/ReelPlayerModal';
import { getBookmarkedReels } from '@/lib/storage';
import { Sparkles, Search, RefreshCw, Play } from 'lucide-react';

export default function BenchmarkPage() {
  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'latest'>('views');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePlayReel, setActivePlayReel] = useState<ReelBenchmark | null>(null);

  // 로컬 북마크 동기화
  const syncBookmarks = () => {
    const saved = getBookmarkedReels();
    setBookmarkedIds(new Set(saved.map((b) => b.id)));
  };

  useEffect(() => {
    syncBookmarks();
  }, []);

  // 전체 레퍼런스 데이터 로드
  const allReels = useMemo(() => {
    return getAllBenchmarkReels();
  }, []);

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

  return (
    <div className="page-wrapper">
      {/* 1. 상단 타이틀 영역 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          릴스 벤치마킹
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          조회수 100만 떡상 릴스를 실제 영상으로 감상하고, 내 콘텐츠 기획에 맞춤형으로 벤치마킹하세요. (카드를 클릭하면 동영상이 재생됩니다)
        </p>
      </div>

      {/* 2. 카테고리 필터 탭바 */}
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

      {/* 3. 검색 및 정렬 드롭다운 바 */}
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

      {/* 4. 릴스 카드 30개 그리드 리스트 (호버 시 인라인 재생 & 클릭 시 모달 재생) */}
      {paginatedReels.length > 0 ? (
        <div className="reels-grid">
          {paginatedReels.map((reel) => (
            <BenchmarkCard
              key={reel.id}
              reel={reel}
              onBookmarkChange={syncBookmarks}
              onPlayReel={(targetReel) => setActivePlayReel(targetReel)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginTop: '20px'
        }}>
          <Sparkles size={40} color="var(--accent-orange)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            검색 결과가 없습니다
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            다른 카테고리를 선택하거나 검색어를 변경해 보세요.
          </p>
        </div>
      )}

      {/* 5. 하단 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '40px'
        }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: page === currentPage ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                background: page === currentPage ? 'var(--accent-orange)' : 'var(--bg-secondary)',
                color: page === currentPage ? '#111827' : '#fff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* 6. 풀스크린 비디오 플레이어 모달 */}
      <ReelPlayerModal
        reel={activePlayReel}
        onClose={() => setActivePlayReel(null)}
        onBookmarkChange={syncBookmarks}
      />
    </div>
  );
}
