'use client';

/**
 * AI INNO LAB - 릴스 벤치마킹 카드 컴포넌트
 * 숏부스터의 UI를 완벽하게 구현하여 썸네일, 통계, 북마크 및 "나만의 릴스로 생성" 링크를 제공합니다.
 */

import React, { useState } from 'react';
import { ReelBenchmark } from '@/lib/types';
import { Bookmark, Play, Heart, MessageCircle, Zap } from 'lucide-react';
import { toggleBookmarkReel } from '@/lib/storage';
import Link from 'next/link';

interface BenchmarkCardProps {
  reel: ReelBenchmark;
  onBookmarkChange?: () => void;
}

// 조회수/좋아요 수치를 만 단위로 읽기 쉽게 포맷팅 (예: 30,171,300 -> 3017.1만)
function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '억';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '만';
  }
  return num.toLocaleString();
}

export default function BenchmarkCard({ reel, onBookmarkChange }: BenchmarkCardProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(reel.isBookmarked || false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleBookmarkReel(reel);
    setIsBookmarked(result);
    if (onBookmarkChange) onBookmarkChange();
  };

  return (
    <div className="reel-card">
      {/* 1. 썸네일 박스 & 오버레이 영역 */}
      <div className="reel-thumbnail-box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reel.thumbnailUrl}
          alt={reel.title}
          className="reel-thumbnail-img"
          loading="lazy"
        />

        {/* 카테고리 태그 */}
        <span className="reel-badge-tag">
          {reel.category.toUpperCase()}
        </span>

        {/* 날짜 표시 */}
        <span className="reel-date-badge">
          {reel.date}
        </span>

        {/* 북마크 즐겨찾기 버튼 */}
        <button
          className={`reel-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-label="북마크"
        >
          <Bookmark size={15} fill={isBookmarked ? '#f59e0b' : 'none'} />
        </button>

        {/* 하단 그라데이션 및 작성자/조회수 통계 */}
        <div className="reel-overlay-info">
          <span className="reel-author-name">
            {reel.authorHandle || `@${reel.author}`}
          </span>

          <div className="reel-stats-row">
            <div className="reel-stat-item">
              <Play size={11} fill="#fff" />
              <span>{formatNumber(reel.views)}</span>
            </div>
            <div className="reel-stat-item">
              <Heart size={11} fill="#fff" />
              <span>{formatNumber(reel.likes)}</span>
            </div>
            <div className="reel-stat-item">
              <MessageCircle size={11} fill="#fff" />
              <span>{formatNumber(reel.comments)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 하단 나만의 릴스로 생성 액션 버튼 */}
      <div className="reel-action-box">
        <Link
          href={`/planning?refId=${reel.id}`}
          className="btn-generate-reel"
        >
          <span>나만의 릴스로 생성</span>
          <Zap size={13} />
        </Link>
      </div>
    </div>
  );
}
