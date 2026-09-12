'use client';

/**
 * AI INNO LAB - 구글 FLOW (Google Flow / Veo / VideoFX) 비디오 프롬프트 스튜디오 (app/google-flow/page.tsx)
 * 릴스 기획안을 바탕으로 Google 차세대 비디오 AI 모델에 맞춘 다중 샷(Multi-Shot) 파이프라인 프롬프트를 생성합니다.
 */

import React, { useState, useEffect } from 'react';
import { getCurrentPlan, saveVideoPrompt } from '@/lib/storage';
import { ReelPlan, VideoPromptResult } from '@/lib/types';
import { generateGoogleFlowPrompt } from '@/lib/promptTemplates';
import { 
  Clapperboard, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Zap, 
  ArrowLeft,
  Film
} from 'lucide-react';
import Link from 'next/link';

export default function GoogleFlowPromptPage() {
  const [currentPlan, setCurrentPlan] = useState<ReelPlan | null>(null);
  const [promptResult, setPromptResult] = useState<VideoPromptResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [colorGrade, setColorGrade] = useState<string>('Clean Commercial / Cinematic Teal & Orange');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    const plan = getCurrentPlan();
    if (plan) {
      setCurrentPlan(plan);
      const generated = generateGoogleFlowPrompt(plan);
      setPromptResult(generated);
      saveVideoPrompt(generated);
    }
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerate = () => {
    if (!currentPlan) return;
    setIsRegenerating(true);
    setTimeout(() => {
      const generated = generateGoogleFlowPrompt(currentPlan);
      setPromptResult(generated);
      saveVideoPrompt(generated);
      setIsRegenerating(false);
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
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Clapperboard size={20} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              구글 FLOW (Google Flow) 프롬프트 만들기
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Google Veo / VideoFX 엔진에 최적화된 씬 연속성(Temporal Consistency) 기반 시네마틱 프롬프트를 제작합니다.
          </p>
        </div>

        <Link href="/planning" className="btn btn-secondary" style={{ fontSize: '13px' }}>
          <ArrowLeft size={14} />
          <span>릴스 기획안으로 돌아가기</span>
        </Link>
      </div>

      {currentPlan && promptResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 연계된 기획안 배너 */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(6, 182, 212, 0.08)',
            borderColor: 'rgba(6, 182, 212, 0.25)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={20} color="#38bdf8" />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Google Flow 연동 기획안
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  {currentPlan.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleRegenerate}
              className="btn"
              style={{
                fontSize: '13px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                color: '#fff'
              }}
              disabled={isRegenerating}
            >
              <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
              <span>FLOW 파이프라인 재생성</span>
            </button>
          </div>

          {/* 구글 FLOW 마스터 타임라인 스크립트 */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#38bdf8" />
                구글 FLOW 타임라인 파이프라인 스크립트 (Timeline DSL)
              </h3>
              <button
                onClick={() => handleCopy(promptResult.fullPrompt, 'flow-master')}
                className="btn"
                style={{
                  fontSize: '12px',
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: '#fff'
                }}
              >
                {copiedKey === 'flow-master' ? <Check size={14} color="#fff" /> : <Copy size={14} />}
                <span>{copiedKey === 'flow-master' ? '복사 완료!' : 'FLOW 스크립트 복사'}</span>
              </button>
            </div>

            <pre style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              color: '#67e8f9',
              fontSize: '13px',
              lineHeight: 1.6,
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              maxHeight: '280px'
            }}>
              {promptResult.fullPrompt}
            </pre>
          </div>

          {/* 샷별 Google Flow 프롬프트 뷰어 */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Film size={18} color="#38bdf8" />
              Google Flow 샷 체인 (Shot Chain)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {promptResult.scenePrompts.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#67e8f9',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(6, 182, 212, 0.3)'
                      }}>
                        @Shot[{scene.sceneNumber}]
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {scene.timeRange}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(scene.promptText, `flow-scene-${scene.sceneNumber}`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {copiedKey === `flow-scene-${scene.sceneNumber}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedKey === `flow-scene-${scene.sceneNumber}` ? '복사됨' : '샷 프롬프트 복사'}</span>
                    </button>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '12px',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    fontFamily: 'Consolas, monospace'
                  }}>
                    {scene.promptText}
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    🎯 {scene.cameraInstruction}
                  </div>
                </div>
              ))}
            </div>
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
          <Sparkles size={40} color="#38bdf8" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            먼저 [릴스 기획]에서 기획안을 생성해주세요
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px' }}>
            릴스 기획안의 스토리보드와 연계되어 Google Flow 비디오 AI 프롬프트가 자동으로 제작됩니다.
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
