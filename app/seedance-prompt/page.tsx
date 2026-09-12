'use client';

/**
 * AI INNO LAB - 시덴스 2.5 (Seedance 2.5) 비디오 AI 프롬프트 제작소 (app/seedance-prompt/page.tsx)
 * 릴스 기획안의 스토리보드와 연계하여 Seedance 2.5 고해상도 비디오 생성에 최적화된 프롬프트를 자동 생성합니다.
 */

import React, { useState, useEffect } from 'react';
import { getCurrentPlan, saveVideoPrompt } from '@/lib/storage';
import { ReelPlan, VideoPromptResult } from '@/lib/types';
import { generateSeedance25Prompt } from '@/lib/promptTemplates';
import { 
  Video, 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  RefreshCw, 
  Camera, 
  Layers,
  Zap,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SeedancePromptPage() {
  const [currentPlan, setCurrentPlan] = useState<ReelPlan | null>(null);
  const [promptResult, setPromptResult] = useState<VideoPromptResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [motionBucket, setMotionBucket] = useState<number>(128);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [fps, setFps] = useState<number>(30);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    const plan = getCurrentPlan();
    if (plan) {
      setCurrentPlan(plan);
      const generated = generateSeedance25Prompt(plan);
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
      const generated = generateSeedance25Prompt(currentPlan);
      generated.parameters.motionBucketId = motionBucket;
      generated.parameters.guidanceScale = guidanceScale;
      generated.parameters.fps = fps;
      setPromptResult(generated);
      saveVideoPrompt(generated);
      setIsRegenerating(false);
    }, 600);
  };

  return (
    <div className="page-wrapper">
      {/* 1. 상단 타이틀 & 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Video size={20} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
              시덴스 2.5 (Seedance 2.5) 프롬프트 만들기
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            릴스 기획안의 스토리보드를 기반으로 Seedance 2.5 영상 생성 AI 전용 프롬프트 및 카메라 무빙 파라미터를 자동 생성합니다.
          </p>
        </div>

        {/* 뒤로가기 링크 */}
        <Link href="/planning" className="btn btn-secondary" style={{ fontSize: '13px' }}>
          <ArrowLeft size={14} />
          <span>릴스 기획안으로 돌아가기</span>
        </Link>
      </div>

      {currentPlan && promptResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 연계된 기획안 정보 배너 */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={20} color="#a5b4fc" />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                  연계된 프로젝트
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  {currentPlan.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleRegenerate}
              className="btn btn-indigo"
              style={{ fontSize: '13px', padding: '8px 16px' }}
              disabled={isRegenerating}
            >
              <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
              <span>프롬프트 재생성</span>
            </button>
          </div>

          {/* 파라미터 컨트롤러 바 */}
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Motion Bucket (모션 강도): {motionBucket}
              </label>
              <input
                type="range"
                min="64"
                max="255"
                value={motionBucket}
                onChange={(e) => setMotionBucket(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>자연스럽고 부드러운 카메라 무빙 최적값 (128)</span>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Guidance Scale: {guidanceScale}
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>프롬프트 반영 정확도 (기본 7.5)</span>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                출력 프레임레이트 (FPS)
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="select-custom"
                style={{ width: '100%', height: '36px' }}
              >
                <option value={24}>24 FPS (시네마틱 필름 룩)</option>
                <option value={30}>30 FPS (릴스/숏츠 표준 룩)</option>
                <option value={60}>60 FPS (고주사율 스무스 룩)</option>
              </select>
            </div>
          </div>

          {/* 마스터 프롬프트 (전체 복사용) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#a5b4fc" />
                시덴스 2.5 마스터 프롬프트 (Seedance 2.5 Full Payload)
              </h3>
              <button
                onClick={() => handleCopy(promptResult.fullPrompt, 'master')}
                className="btn btn-indigo"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                {copiedKey === 'master' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedKey === 'master' ? '복사 완료!' : '전체 마스터 프롬프트 복사'}</span>
              </button>
            </div>

            <pre style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              color: '#38bdf8',
              fontSize: '13px',
              lineHeight: 1.6,
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              maxHeight: '260px'
            }}>
              {promptResult.fullPrompt}
            </pre>
          </div>

          {/* 씬(Scene)별 분할 비디오 프롬프트 카드 */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="var(--accent-orange)" />
              장면별(Scene) 개별 영상 생성 프롬프트
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
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#a5b4fc',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}>
                        Scene {scene.sceneNumber}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        타임라인: {scene.timeRange}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(scene.promptText, `scene-${scene.sceneNumber}`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {copiedKey === `scene-${scene.sceneNumber}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedKey === `scene-${scene.sceneNumber}` ? '복사됨' : '이 장면 프롬프트 복사'}</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <strong>🎥 카메라 워크:</strong> {scene.cameraInstruction}
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      <strong>✨ 물리/광원:</strong> {scene.physicsAndMotion}
                    </div>
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
          <Sparkles size={40} color="var(--accent-orange)" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            먼저 [릴스 기획]에서 기획안을 생성해주세요
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px' }}>
            릴스 기획안의 스토리보드와 연계되어 시덴스 2.5 비디오 AI 프롬프트가 자동으로 제작됩니다.
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
