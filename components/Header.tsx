'use client';

/**
 * AI INNO LAB - 상단 글로벌 헤더 컴포넌트
 * 현재 라우트 경로 표시(Breadcrumb) 및 톤앤매너 상태 표시를 제공합니다.
 */

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Sparkles, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/storage';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 경로명 한글 라벨 맵핑
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return '릴스 벤치마킹';
      case '/planning':
        return '나만의 릴스 기획';
      case '/library':
        return '저장소 (라이브러리)';
      case '/seedance-prompt':
        return '시덴스 2.5 비디오 프롬프트';
      case '/google-flow':
        return '구글 FLOW 비디오 프롬프트';
      case '/threads':
        return '쓰레드(Threads) SNS 생성';
      default:
        return 'AI INNO LAB';
    }
  };

  return (
    <header className="top-header">
      {/* 1. 좌측 빵부스러기(Breadcrumbs) 네비게이션 */}
      <div className="breadcrumb">
        <span>AI INNO LAB</span>
        <ChevronRight size={14} />
        <span className="breadcrumb-current">{getPageTitle()}</span>
      </div>

      {/* 2. 우측 시스템 상태 및 뱃지 */}
      <div className="header-actions">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)'
        }}>
          <Database size={14} color="#38bdf8" />
          <span>스토리지: {mounted && isSupabaseConfigured ? 'Supabase 클라우드' : '로컬 스마트 캐시'}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.1)',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <Sparkles size={14} />
          <span>PRO AI 엔진 활성화</span>
        </div>
      </div>
    </header>
  );
}
