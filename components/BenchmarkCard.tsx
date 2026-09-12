'use client';

/**
 * AI INNO LAB - 릴스 벤치마킹 카드 컴포넌트
 * 마우스 호버 시 인라인 비디오 프리뷰 자동 재생 & 클릭 시 풀스크린 비디오 플레이어 모달 연동
 */

import React, { useState, useRef } from 'react';
import { ReelBenchmark } from '@/lib/types';
import { Bookmark, Play, Heart, MessageCircle, Zap, Film } from 'lucide-react';
import { toggleBookmarkReel } from '@/lib/storage';
import Link from 'next/link';

interface BenchmarkCardProps {
  reel: ReelBenchmark;
  onBookmarkChange?: () => void;
  onPlayReel?: (reel: ReelBenchmark) => void;
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

export default function BenchmarkCard({ reel, onBookmarkChange, onPlayReel }: BenchmarkCardProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(reel.isBookmarked || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleBookmarkReel(reel);
    setIsBookmarked(result);
    if (onBookmarkChange) onBookmarkChange();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleCardClick = () => {
    if (onPlayReel) {
      onPlayReel(reel);
    }
  };

  return (
    <div
      className="reel-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. 썸네일 및 비디오 재생 박스 영역 */}
      <div
        className="reel-thumbnail-box"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >
        {/* 마우스 호버 시 비디오 자동 프리뷰 재생 */}
        {reel.videoUrl && isHovered ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="reel-thumbnail-img"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel.thumbnailUrl}
            alt={reel.title}
            className="reel-thumbnail-img"
            loading="lazy"
          />
        )}

        {/* 재생 가능 인디케이터 아이콘 (호버 전 표시) */}
        {!isHovered && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
          }}>
            <Play size={16} fill="#fff" style={{ marginLeft: '2px' }} />
          </div>
        )}

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
