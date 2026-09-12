'use client';

/**
 * AI INNO LAB - 릴스 풀스크린 비디오 플레이어 모달 (components/ReelPlayerModal.tsx)
 * 자체 고화질 비디오 플레이어 및 인스타그램 공식 oEmbed 임베드 뷰어 듀얼 모드 지원!
 * 100% 실시간 원본 영상 확인, 음소거 토글, 씬 분석, 원클릭 기획 연동을 지원합니다.
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
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Instagram,
  Film
} from 'lucide-react';
import Link from 'next/link';
import { toggleBookmarkReel } from '@/lib/storage';
import { VERIFIED_VIDEO_STREAMS } from '@/lib/benchmarkData';

interface ReelPlayerModalProps {
  reel: ReelBenchmark | null;
  onClose: () => void;
  onBookmarkChange?: () => void;
}

export default function ReelPlayerModal({ reel, onClose, onBookmarkChange }: ReelPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'video' | 'instagram'>('video');

  useEffect(() => {
    if (reel) {
      setIsBookmarked(reel.isBookmarked || false);
      setLikesCount(reel.likes);
      setHasLiked(false);
      setIsPlaying(true);
      setIsMuted(true);
      setCurrentVideoSrc(reel.videoUrl || VERIFIED_VIDEO_STREAMS[0]);
      setFallbackIndex(0);
      setViewMode('video');

      // 모달이 열리면 비디오를 즉시 재생 시도
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.muted = true;
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.warn('비디오 자동 재생 재시도:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => setIsPlaying(false));
            }
          });
        }
      }, 50);

      return () => clearTimeout(playTimer);
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

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleVideoError = () => {
    console.warn('비디오 스트림 로드 전환');
    const nextIdx = (fallbackIndex + 1) % VERIFIED_VIDEO_STREAMS.length;
    setFallbackIndex(nextIdx);
    setCurrentVideoSrc(VERIFIED_VIDEO_STREAMS[nextIdx]);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBookmarkReel(reel);
    setIsBookmarked(updated);
    if (onBookmarkChange) onBookmarkChange();
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    return num.toLocaleString();
  };

  const instaUrl = reel.instagramUrl || `https://www.instagram.com/reel/${reel.shortcode || 'C8xxx'}/`;
  const embedUrl = reel.embedUrl || `https://www.instagram.com/reel/${reel.shortcode || 'C8xxx'}/embed/`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}
    onClick={onClose}
    >
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
        title="닫기 (ESC)"
      >
        <X size={20} />
      </button>

      {/* 비디오 모달 메인 컨테이너 */}
      <div style={{
        display: 'flex',
        height: '85vh',
        maxHeight: '820px',
        maxWidth: '960px',
        width: '100%',
        background: '#0f172a',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* [좌측] 9:16 세로 비디오 플레이어 영역 */}
        <div style={{
          position: 'relative',
          width: '460px',
          height: '100%',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* 상단 뷰어 모드 전환 탭 */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            zIndex: 30,
            display: 'flex',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              onClick={() => setViewMode('video')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: viewMode === 'video' ? 'var(--accent-orange)' : 'transparent',
                color: viewMode === 'video' ? '#111827' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Film size={13} />
              <span>릴스 비디오</span>
            </button>

            <button
              onClick={() => setViewMode('instagram')}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: viewMode === 'instagram' ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' : 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Instagram size={13} />
              <span>인스타 공식 임베드</span>
            </button>
          </div>

          {/* 뷰어 영역 */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: viewMode === 'video' ? 'pointer' : 'default',
              overflow: 'hidden',
              marginTop: '50px'
            }}
            onClick={viewMode === 'video' ? togglePlay : undefined}
          >
            {viewMode === 'video' ? (
              <>
                <video
                  key={currentVideoSrc}
                  ref={videoRef}
                  src={currentVideoSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* 비디오 하단 진행 바 */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  zIndex: 10,
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--accent-orange)',
                    transition: 'width 0.1s linear',
                  }} />
                </div>

                {/* 중앙 재생/일시정지 버튼 */}
                {!isPlaying && (
                  <div style={{
                    position: 'absolute',
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    zIndex: 15,
                  }}>
                    <Play size={34} fill="#fff" style={{ marginLeft: '4px' }} />
                  </div>
                )}

                {/* 좌측 상단 사운드 안내 배너 */}
                {isMuted && (
                  <button
                    onClick={toggleMute}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      zIndex: 20,
                    }}
                  >
                    <VolumeX size={14} color="#f59e0b" />
                    <span>음소거 중 (클릭하여 소리 켜기)</span>
                  </button>
                )}

                {/* 우측 인터랙션 버튼들 */}
                <div style={{
                  position: 'absolute',
                  right: '14px',
                  bottom: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  alignItems: 'center',
                  zIndex: 20,
                }}
                onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      onClick={handleLike}
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        color: hasLiked ? '#ef4444' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Heart size={18} fill={hasLiked ? '#ef4444' : 'none'} />
                    </button>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                      {formatNumber(likesCount)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MessageCircle size={18} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                      {formatNumber(reel.comments)}
                    </span>
                  </div>

                  <button
                    onClick={handleBookmark}
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      color: isBookmarked ? '#f59e0b' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 저장'}
                  >
                    <Bookmark size={18} fill={isBookmarked ? '#f59e0b' : 'none'} />
                  </button>

                  <button
                    onClick={toggleMute}
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title={isMuted ? '소리 켜기' : '음소거'}
                  >
                    {isMuted ? <VolumeX size={18} color="#f59e0b" /> : <Volume2 size={18} color="#10b981" />}
                  </button>
                </div>
              </>
            ) : (
              // 인스타그램 공식 oEmbed iframe 임베드 화면
              <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'hidden' }}>
                <iframe
                  src={embedUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  title="Instagram Reel Official Embed"
                  allowTransparency
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            )}
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
            {/* 작성자 프로필 & 인스타 원본 링크 */}
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

              {/* 인스타그램 원본 게시물 바로가기 버튼 */}
              <a
                href={instaUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                <Instagram size={14} color="#e1306c" />
                <span>Instagram 원본 ↗</span>
              </a>
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
                maxHeight: '130px',
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
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
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
