import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'AI INNO LAB - 인기 릴스 벤치마킹 & AI 비디오 프롬프트 스튜디오',
  description: '잘나가는 숏츠/릴스를 검색 및 벤치마킹하고, AI 맞춤형 기획안과 시덴스 2.5 및 구글 FLOW 영상 생성 프롬프트까지 원스톱으로 제작하는 올인원 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-container">
          {/* 1. 좌측 사이드바 네비게이션 */}
          <Sidebar />

          {/* 2. 우측 메인 콘텐츠 영역 */}
          <div className="main-content">
            <Header />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
