'use client';

/**
 * AI INNO LAB - 릴스 벤치마킹 메인 페이지 (app/page.tsx)
 * 인스타그램 실시간 릴스 URL 추출 분석기, Apify 실시간 대량 수집기(무료 $5 플랜 연동),
 * 카테고리별 그리드, 공식 임베드 & 동영상 재생 모달, 조회수순 정렬, 원클릭 AI 기획안 생성을 지원합니다.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { getAllBenchmarkReels } from '@/lib/benchmarkData';
import { REEL_CATEGORIES, ReelBenchmark } from '@/lib/types';
import BenchmarkCard from '@/components/BenchmarkCard';
import ReelPlayerModal from '@/components/ReelPlayerModal';
import ApifyConfigModal from '@/components/ApifyConfigModal';
import { getBookmarkedReels } from '@/lib/storage';
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  Instagram, 
  Link as LinkIcon, 
  AlertCircle, 
  Key, 
  DownloadCloud,
  Layers
} from 'lucide-react';
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

  // Apify 스크래퍼 상태
  const [isApifyModalOpen, setIsApifyModalOpen] = useState<boolean>(false);
  const [isScrapingApify, setIsScrapingApify] = useState<boolean>(false);
  const [apifyKeyword, setApifyKeyword] = useState<string>('');
  const [apifyCustomReels, setApifyCustomReels] = useState<ReelBenchmark[]>([]);
  const [apifyNotice, setApifyNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = getBookmarkedReels();
    setBookmarkedIds(new Set(saved.map((b) => b.id)));
  }, []);

  const syncBookmarks = () => {
    const saved = getBookmarkedReels();
    setBookmarkedIds(new Set(saved.map((b) => b.id)));
  };

  // 전체 기본 레퍼런스 데이터 로드
  const baseReels = useMemo(() => {
    return getAllBenchmarkReels();
  }, []);

  // Apify로 수집된 릴스가 있을 경우 합산
  const allReels = useMemo(() => {
    if (apifyCustomReels.length > 0) {
      return [...apifyCustomReels, ...baseReels];
    }
    return baseReels;
  }, [apifyCustomReels, baseReels]);

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

      // 파싱된 릴스 데이터로 모달 열기
      const parsedReel: ReelBenchmark = json.data;
      setApifyCustomReels((prev) => [parsedReel, ...prev]);
      setActivePlayReel(parsedReel);
      setInstaInputUrl('');
    } catch (err: any) {
      setInstaError(err.message || '인스타그램 링크를 확인해주세요.');
    } finally {
      setIsAnalyzingInsta(false);
    }
  };

  // Apify 키워드 실시간 릴스 30개 수집 핸들러
  const handleApifyScrape = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const keywordToFetch = apifyKeyword.trim() || selectedCategory || '릴스';

    setIsScrapingApify(true);
    setApifyNotice(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('apify_api_token') : '';

      const res = await fetch('/api/apify-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keywordToFetch,
          category: selectedCategory,
          limit: 30,
          apiToken: token,
        }),
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setApifyCustomReels(json.data);
        setCurrentPage(1);
        setApifyNotice(`'${keywordToFetch}' 키워드로 릴스 30개가 실시간 수집되었습니다! 🚀`);
        setTimeout(() => setApifyNotice(null), 4000);
      }
    } catch (err: any) {
      console.error('Apify 수집 오류:', err);
    } finally {
      setIsScrapingApify(false);
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
      {/* 1. 상단 타이틀 및 Apify 설정 버튼 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            인기 릴스 벤치마킹 & 실시간 스크래퍼
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            조회수 100만 떡상 릴스를 감상하고, Apify 무료 스크래퍼 및 인스타 링크로 최신 릴스를 실시간 수집하세요.
          </p>
        </div>

        {/* Apify 토큰 설정 버튼 */}
        <button
          onClick={() => setIsApifyModalOpen(true)}
          className="btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Key size={15} />
          <span>Apify 스크래퍼 설정 ($5 무료)</span>
        </button>
      </div>

      {/* 2. 인스타그램 실시간 분석 바 & Apify 키워드 수집기 듀얼 패널 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* [패널 1] 인스타그램 릴스 단일 URL 분석기 */}
        <div className="glass-panel" style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid rgba(225, 48, 108, 0.25)',
          borderRadius: '12px'
        }}>
          <form onSubmit={handleAnalyzeInstagramUrl} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                <Instagram size={16} color="#e1306c" />
                <span>인스타 단일 릴스 URL 분석</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>링크 붙여넣기</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '8px 12px'
              }}>
                <LinkIcon size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  value={instaInputUrl}
                  onChange={(e) => setInstaInputUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzingInsta || !instaInputUrl.trim()}
                className="btn btn-primary"
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e1306c 0%, #f77737 100%)',
                }}
              >
                {isAnalyzingInsta ? <RefreshCw size={14} className="animate-spin" /> : '분석하기'}
              </button>
            </div>

            {instaError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '11px' }}>
                <AlertCircle size={12} />
                <span>{instaError}</span>
              </div>
            )}
          </form>
        </div>

        {/* [패널 2] Apify 키워드/해시태그 실시간 릴스 30개 수집기 */}
        <div className="glass-panel" style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px'
        }}>
          <form onSubmit={handleApifyScrape} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                <DownloadCloud size={16} color="#38bdf8" />
                <span>Apify 키워드 실시간 수집</span>
                <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px' }}>
                  30개 일괄
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>무료 $5 플랜 연동</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={apifyKeyword}
                onChange={(e) => setApifyKeyword(e.target.value)}
                placeholder="키워드 입력 (예: 캠핑, 뷰티, 재테크)..."
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={isScrapingApify}
                className="btn btn-indigo"
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  color: '#fff',
                  whiteSpace: 'nowrap'
                }}
              >
                {isScrapingApify ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>수집 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>실시간 수집 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 실시간 알림 배너 */}
      {apifyNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} />
          <span>{apifyNotice}</span>
        </div>
      )}

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

      {/* 8. Apify API 설정 팝업 모달 */}
      <ApifyConfigModal
        isOpen={isApifyModalOpen}
        onClose={() => setIsApifyModalOpen(false)}
      />
    </div>
  );
}
