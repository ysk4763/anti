'use client';

/**
 * AI INNO LAB - 좌측 메인 사이드바 네비게이션 컴포넌트
 * 숏부스터 레이아웃을 기반으로 전문가 톤앤매너 및 신규 AI 비디오 프롬프트 메뉴가 포함되어 있습니다.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Layers, 
  FolderArchive, 
  Video, 
  Clapperboard, 
  MessageSquareShare, 
  Zap,
  Bot
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // 네비게이션 메뉴 구성
  const navItems = [
    {
      section: '숏폼 기획',
      items: [
        {
          name: '릴스 벤치마킹',
          href: '/',
          icon: <Layers size={18} />,
        },
        {
          name: '릴스 기획',
          href: '/planning',
          icon: <Sparkles size={18} />,
        },
        {
          name: '저장소',
          href: '/library',
          icon: <FolderArchive size={18} />,
        },
        {
          name: '시덴스2.5 프롬프트',
          href: '/seedance-prompt',
          icon: <Video size={18} />,
          badge: 'NEW'
        },
        {
          name: '구글 FLOW 프롬프트',
          href: '/google-flow',
          icon: <Clapperboard size={18} />,
          badge: 'AI'
        },
      ]
    },
    {
      section: 'SNS 콘텐츠',
      items: [
        {
          name: '쓰레드 생성',
          href: '/threads',
          icon: <MessageSquareShare size={18} />,
        }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* 1. 상단 브랜딩 로고 */}
      <Link href="/" className="brand-logo">
        <div className="brand-icon">
          <Bot size={22} />
        </div>
        <div className="brand-text">
          <span>AI INNO LAB</span>
          <span className="brand-subtitle">Reels & Video AI Studio</span>
        </div>
      </Link>

      {/* 2. 네비게이션 메뉴 리스트 */}
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="nav-section">
            <div className="nav-section-title">
              {group.section}
            </div>
            <ul className="nav-list">
              {group.items.map((item, iIdx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={iIdx}>
                    <Link
                      href={item.href}
                      className={`nav-item-link ${isActive ? 'active' : ''}`}
                    >
                      <div className="nav-link-content">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          background: item.badge === 'NEW' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.25)',
                          color: item.badge === 'NEW' ? '#f59e0b' : '#a5b4fc',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${item.badge === 'NEW' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* 3. 하단 상태 위젯 (크레딧 & 사용자 프로필) */}
      <div className="sidebar-footer">
        <div className="credit-badge">
          <div className="credit-label">
            <Zap size={14} />
            <span>AI 크레딧</span>
          </div>
          <span className="credit-value">무제한 PRO</span>
        </div>

        <div className="user-profile-bar">
          <div className="user-avatar">
            AI
          </div>
          <div className="user-info">
            <span className="user-name">AI INNO 크리에이터</span>
            <span className="user-status">온라인 • 준비완료</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
