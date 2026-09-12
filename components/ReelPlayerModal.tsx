'use client';

/**
 * AI INNO LAB - 릴스 풀스크린 비디오 플레이어 모달 (components/ReelPlayerModal.tsx)
 * 벤치마킹 릴스 카드를 클릭했을 때 실제 인스타그램 릴스처럼 동영상을 재생하고
 * 음소거 해제, 자막 확인, 원클릭 나만의 릴스 기획 연동을 지원합니다.
 */

import React, { useRef, useState, useEffect } from 'react';
import { ReelBenchmark } from '@/lib/types';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Zap, 
  Sparkles,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { toggleBookmarkReel } from '@/lib/storage';

interface ReelPlayerModalProps {
  reel: ReelBenchmark | null;
  onClose: () => void;
  onBookmarkChange?: () => void;
}

export default function ReelPlayerModal({ reel, onClose, onBookmarkChange }: ReelPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (reel) {
      setIsBookmarked(reel.isBookmarked || false);
      setLikesCount(reel.likes);
      setHasLiked(false);
      setIsPlaying(true);
    }
  }, [reel]);

  // ESC 키 닫기 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!reel) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleBookmark = () => {
    const updated = toggleBookmarkReel(reel);
    setIsBookmarked(updated);
    if (onBookmarkChange) onBookmarkChange();
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return num.toLocaleString();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      {/* 닫기 X 버튼 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1010,
          transition: 'all 0.2s ease',
        }}
      >
        <X size={20} />
      </button>

      {/* 비디오 모달 메인 컨테이너 */}
      <div style={{
        display: 'flex',
        height: '85vh',
        maxHeight: '820px',
        maxWidth: '900px',
        width: '100%',
        background: '#0f172a',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }}>
        {/* [좌측] 9:16 비디오 플레이어 영역 */}
        <div style={{
          position: 'relative',
          width: '460px',
          height: '100%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={togglePlay}
        >
          {reel.videoUrl ? (
            <video
              ref={videoRef}
              src={reel.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            // 비디오 URL이 없을 때 썸네일 폴백
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.thumbnailUrl}
              alt={reel.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* 비디오 하단 진행 바 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--accent-orange)',
              transition: 'width 0.1s linear',
            }} />
          </div>

          {/* 일시정지 상태 오버레이 아이콘 */}
          {!isPlaying && (
            <div style={{
              position: 'absolute',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              pointerEvents: 'none',
            }}>
              <Play size={32} fill="#fff" style={{ marginLeft: '4px' }} />
            </div>
          )}

          {/* 우측 비디오 인터랙션 버튼들 (인스타그램 릴스 스타일) */}
          <div style={{
            position: 'absolute',
            right: '12px',
            bottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'center',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* 좋아요 */}
            <button
              onClick={handleLike}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                color: hasLiked ? '#ef4444' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexDirection: 'column',
              }}
            >
              <Heart size={20} fill={hasLiked ? '#ef4444' : 'none'} />
            </button>
            <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, marginTop: '-12px' }}>
              {formatNumber(likesCount)}
            </span>

            {/* 댓글 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MessageCircle size={20} />
              </div>
              <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                {formatNumber(reel.comments)}
              </span>
            </div>

            {/* 북마크 */}
            <button
              onClick={handleBookmark}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                color: isBookmarked ? '#f59e0b' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Bookmark size={20} fill={isBookmarked ? '#f59e0b' : 'none'} />
            </button>

            {/* 음소거 토글 */}
            <button
              onClick={toggleMute}
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* [우측] 릴스 상세 분석 & 나만의 릴스 기획 바로가기 패널 */}
        <div style={{
          flex: 1,
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          background: '#0b0f19',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 작성자 프로필 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}>
                  {reel.author.slice(0, 1)}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{reel.author}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{reel.authorHandle}</span>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-orange)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}>
                {reel.category.toUpperCase()}
              </span>
            </div>

            {/* 제목 & 후킹 포인트 */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', lineHeight: 1.4 }}>
                {reel.title}
              </h2>
              <div style={{
                fontSize: '13px',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                padding: '10px 12px',
                lineHeight: 1.5,
              }}>
                <strong>🎯 후킹 포인트:</strong> "{reel.hook}"
              </div>
            </div>

            {/* 원본 캡션 */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                원본 캡션 (Caption)
              </label>
              <div style={{
                fontSize: '13px',
                color: '#cbd5e1',
                lineHeight: 1.6,
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                maxHeight: '140px',
                overflowY: 'auto',
                whiteSpace: 'pre-line',
              }}>
                {reel.caption}
              </div>
            </div>

            {/* 추출된 주요 장면 씬 */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                추출된 씬 구성
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reel.keyScenes.map((scene, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    • {scene}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 나만의 릴스로 생성 버튼 */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              href={`/planning?refId=${reel.id}`}
              onClick={onClose}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <Sparkles size={18} />
              <span>이 영상으로 나만의 릴스 기획하기 ⚡</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
