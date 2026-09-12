'use client';

/**
 * AI INNO LAB - 쓰레드(Threads) SNS 콘텐츠 생성기 (app/threads/page.tsx)
 * 릴스 기획안을 바탕으로 고인게이지먼트 SNS 쓰레드 타래 글을 자동 생성합니다.
 */

import React, { useState, useEffect } from 'react';
import { getCurrentPlan } from '@/lib/storage';
import { ReelPlan, ThreadPost } from '@/lib/types';
import { generateThreadsFromPlan } from '@/lib/promptTemplates';
import { 
  MessageSquareShare, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Send,
  Zap,
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function ThreadsPage() {
  const [currentPlan, setCurrentPlan] = useState<ReelPlan | null>(null);
  const [threadPost, setThreadPost] = useState<ThreadPost | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const plan = getCurrentPlan();
    if (plan) {
      setCurrentPlan(plan);
      const post = generateThreadsFromPlan(plan);
      setThreadPost(post);
    }
  }, []);

  const handleCopyItem = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    if (!threadPost) return;
    const fullText = threadPost.items.join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleRegenerate = () => {
    if (!currentPlan) return;
    setIsGenerating(true);
    setTimeout(() => {
      const post = generateThreadsFromPlan(currentPlan);
      setThreadPost(post);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="page-wrapper">
      {/* 1. 상단 타이틀 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <MessageSquareShare size={20} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              쓰레드(Threads) 콘텐츠 생성기
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            릴스 기획안의 핵심 인사이트를 타래(Thread) 형태의 줄글 SNS 포스팅으로 자동 전환합니다.
          </p>
        </div>

        <Link href="/planning" className="btn btn-secondary" style={{ fontSize: '13px' }}>
          <ArrowLeft size={14} />
          <span>릴스 기획안으로 돌아가기</span>
        </Link>
      </div>

      {currentPlan && threadPost ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 연계 배너 */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(16, 185, 129, 0.25)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={20} color="#34d399" />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  연계 프로젝트
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  {currentPlan.title}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRegenerate}
                className="btn btn-secondary"
                style={{ fontSize: '13px' }}
                disabled={isGenerating}
              >
                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                <span>다시 작성</span>
              </button>

              <button
                onClick={handleCopyAll}
                className="btn"
                style={{
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff'
                }}
              >
                {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedAll ? '전체 복사됨!' : '타래 전체 복사'}</span>
              </button>
            </div>
          </div>

          {/* 쓰레드 타래 카드 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {threadPost.items.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#e2e8f0',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    Post #{idx + 1}
                  </span>

                  <button
                    onClick={() => handleCopyItem(item, idx)}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
                    {copiedIdx === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedIdx === idx ? '복사됨' : '복사'}</span>
                  </button>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: '#f8fafc',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{
          textAlign: 'center',
          padding: '80px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Sparkles size={40} color="#10b981" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            먼저 [릴스 기획]에서 기획안을 생성해주세요
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px' }}>
            릴스 기획안의 스토리보드와 연계되어 쓰레드(Threads) 콘텐츠가 자동으로 완성됩니다.
          </p>
          <Link href="/planning" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <span>릴스 기획하러 가기</span>
            <Sparkles size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
