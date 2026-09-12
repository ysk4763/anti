'use client';

/**
 * AI INNO LAB - Apify API 토큰 설정 모달 (components/ApifyConfigModal.tsx)
 * Apify의 매월 $5 무료 플랜 토큰을 설정하고 실시간 인스타그램 릴스를 수집할 수 있도록 지원합니다.
 */

import React, { useState, useEffect } from 'react';
import { X, Key, Check, ExternalLink, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface ApifyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (token: string) => void;
}

export default function ApifyConfigModal({ isOpen, onClose, onSaved }: ApifyConfigModalProps) {
  const [token, setToken] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apify_api_token') || '';
      setToken(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('apify_api_token', token.trim());
    }
    setIsSaved(true);
    if (onSaved) onSaved(token.trim());
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apify_api_token');
    }
    setToken('');
    if (onSaved) onSaved('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}
    onClick={onClose}
    >
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '18px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>
                Apify 인스타그램 스크래퍼 연동 설정
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                매월 $5 무료 크레딧으로 실제 인스타 릴스를 대량 수집합니다.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 1분 무료 토큰 발급 가이드 */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={15} />
              무료 $5 API 토큰 발급 방법 (1분 소요)
            </span>
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'underline'
              }}
            >
              <span>Apify 콘솔 바로가기</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <ol style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
            <li><a href="https://apify.com" target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>Apify.com</a>에서 무료 회원가입 (매월 $5 무료 크레딧 자동 지급)</li>
            <li>우측 상단 <strong>Settings → Integrations</strong> 메뉴로 이동</li>
            <li><strong>Personal API Token</strong> 옆의 [Copy] 버튼을 눌러 복사 후 아래에 붙여넣기</li>
          </ol>
        </div>

        {/* 토큰 입력 폼 */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Apify Personal API Token (apify_api_...)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="apify_api_xxxxxxxxxxxxxxxxxxxxxxxx"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              * 입력하신 API 토큰은 브라우저의 안전한 로컬 스토리지에만 보관되며 외부에 유출되지 않습니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            {token && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-secondary"
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                토큰 초기화
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '11px',
                fontSize: '13px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
              }}
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>설정 저장 완료!</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>API 토큰 저장 및 적용하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
