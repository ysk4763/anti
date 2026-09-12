'use client';

/**
 * AI INNO LAB - 저장소 / 라이브러리 화면 (app/library/page.tsx)
 * 즐겨찾기한 릴스 및 AI 생성 기획안 프로젝트를 통합 관리합니다.
 */

import React, { useState, useEffect } from 'react';
import { getBookmarkedReels, getSavedPlans, deletePlan, toggleBookmarkReel, setCurrentPlan } from '@/lib/storage';
import { ReelBenchmark, ReelPlan } from '@/lib/types';
import { 
  FolderArchive, 
  Bookmark, 
  FileText, 
  Trash2, 
  ExternalLink, 
  Zap, 
  Sparkles, 
  Video, 
  Clapperboard, 
  Play,
  Heart,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'projects'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<ReelBenchmark[]>([]);
  const [savedPlans, setSavedPlans] = useState<ReelPlan[]>([]);

  const loadData = () => {
    setBookmarks(getBookmarkedReels());
    setSavedPlans(getSavedPlans());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveBookmark = (reel: ReelBenchmark) => {
    toggleBookmarkReel(reel);
    loadData();
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('이 기획안을 삭제하시겠습니까?')) {
      deletePlan(id);
      loadData();
    }
  };

  const handleSelectPlan = (plan: ReelPlan) => {
    setCurrentPlan(plan);
    router.push('/planning');
  };

  return (
    <div className="page-wrapper">
      {/* 1. 상단 타이틀 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          라이브러리 (저장소)
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          즐겨찾기한 릴스와 생성한 기획안 프로젝트를 한눈에 관리하세요.
        </p>
      </div>

      {/* 2. 탭 전환 버튼 (즐겨찾기 릴스 / 내 프로젝트) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'bookmarks' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-secondary)',
            border: activeTab === 'bookmarks' ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
            color: activeTab === 'bookmarks' ? 'var(--accent-orange)' : 'var(--text-secondary)'
          }}
        >
          <Bookmark size={16} />
          <span>즐겨찾기 릴스</span>
          <span style={{
            fontSize: '11px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {bookmarks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'projects' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
            border: activeTab === 'projects' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            color: activeTab === 'projects' ? '#a5b4fc' : 'var(--text-secondary)'
          }}
        >
          <FileText size={16} />
          <span>내 프로젝트</span>
          <span style={{
            fontSize: '11px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {savedPlans.length}
          </span>
        </button>
      </div>

      {/* 3. [탭 1] 즐겨찾기 릴스 목록 렌더링 */}
      {activeTab === 'bookmarks' && (
        <>
          {bookmarks.length > 0 ? (
            <div className="reels-grid">
              {bookmarks.map((reel) => (
                <div key={reel.id} className="reel-card">
                  <div className="reel-thumbnail-box">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      className="reel-thumbnail-img"
                    />
                    <span className="reel-badge-tag">{reel.category.toUpperCase()}</span>
                    <span className="reel-date-badge">{reel.date}</span>

                    <div className="reel-overlay-info">
                      <span className="reel-author-name">{reel.authorHandle}</span>
                      <div className="reel-stats-row">
                        <div className="reel-stat-item">
                          <Play size={11} fill="#fff" />
                          <span>{(reel.views / 10000).toFixed(1)}만</span>
                        </div>
                        <div className="reel-stat-item">
                          <Heart size={11} fill="#fff" />
                          <span>{(reel.likes / 10000).toFixed(1)}만</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="reel-action-box" style={{ display: 'flex', gap: '6px' }}>
                    <Link
                      href={`/planning?refId=${reel.id}`}
                      className="btn-generate-reel"
                      style={{ flex: 1 }}
                    >
                      <span>나만의 릴스로 생성</span>
                      <Zap size={13} />
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(reel)}
                      className="btn btn-secondary btn-icon-only"
                      title="삭제"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '80px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Bookmark size={36} color="var(--accent-orange)" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                즐겨찾기한 릴스가 없습니다
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                [릴스 벤치마킹] 탭에서 마음에 드는 릴스 카드의 북마크 아이콘을 눌러보세요.
              </p>
              <Link href="/" className="btn btn-primary" style={{ marginTop: '8px' }}>
                <span>릴스 벤치마킹 둘러보기</span>
              </Link>
            </div>
          )}
        </>
      )}

      {/* 4. [탭 2] 내 프로젝트 기획안 목록 렌더링 */}
      {activeTab === 'projects' && (
        <>
          {savedPlans.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {savedPlans.map((plan) => (
                <div key={plan.id} className="glass-panel" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                      {plan.duration} • {plan.category}
                    </span>

                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="프로젝트 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                      {plan.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, maxHeight: '40px', overflow: 'hidden' }}>
                      {plan.thumbnailTitle}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                    >
                      <span>기획안 열기</span>
                      <ArrowRight size={13} />
                    </button>

                    <Link
                      href="/seedance-prompt"
                      onClick={() => setCurrentPlan(plan)}
                      className="btn btn-indigo"
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                      title="시덴스 2.5 프롬프트"
                    >
                      <Video size={14} />
                    </Link>

                    <Link
                      href="/google-flow"
                      onClick={() => setCurrentPlan(plan)}
                      className="btn"
                      style={{
                        fontSize: '12px',
                        padding: '8px 12px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                        color: '#fff'
                      }}
                      title="구글 FLOW 프롬프트"
                    >
                      <Clapperboard size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '80px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FileText size={36} color="#a5b4fc" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                저장된 기획안 프로젝트가 없습니다
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                [나만의 릴스 기획]에서 AI 기획안을 생성하면 자동으로 여기에 저장됩니다.
              </p>
              <Link href="/planning" className="btn btn-indigo" style={{ marginTop: '8px' }}>
                <span>기획안 만들러 가기</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
