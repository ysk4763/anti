'use client';

/**
 * AI INNO LAB - 나만의 릴스 AI 기획 화면 (app/planning/page.tsx)
 * 레퍼런스 분석, 맞춤형 수정 옵션 입력, 스토리보드/대본/촬영가이드/캡션 실시간 생성 및
 * 고화질 PDF 다운로드, 시덴스 2.5 및 구글 FLOW 프롬프트로의 원클릭 연계 제작을 완벽 지원합니다.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllBenchmarkReels } from '@/lib/benchmarkData';
import { ReelBenchmark, ReelPlan } from '@/lib/types';
import { generateReelPlan } from '@/lib/promptTemplates';
import { saveReelPlan, getCurrentPlan, setCurrentPlan } from '@/lib/storage';
import { exportPlanToPdf } from '@/lib/pdfExport';
import { 
  Sparkles, 
  Layers, 
  Video, 
  Clapperboard, 
  Copy, 
  Download, 
  Edit3, 
  Check, 
  ArrowRight,
  RefreshCw,
  Film,
  Camera,
  FileText,
  FileType
} from 'lucide-react';

function PlanningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refId = searchParams?.get('refId');

  const allReels = getAllBenchmarkReels();
  const [selectedReel, setSelectedReel] = useState<ReelBenchmark>(allReels[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 수정 옵션 상태들
  const [selectedFixTags, setSelectedFixTags] = useState<string[]>(['타깃 고객', '말투/톤', '썸네일 제목']);
  const [customModifications, setCustomModifications] = useState<string>('타깃을 3040 직장인/크리에이터로 설정하고, 신뢰감 있고 실용적인 톤으로 변경해주세요.');
  const [duration, setDuration] = useState<'15s' | '30s' | '60s'>('30s');
  const [thumbnailStyle, setThumbnailStyle] = useState<string>('극단적 호기심');
  const [includePoints, setIncludePoints] = useState<string>('실제 1인 세팅 방법, 시간 절약 수치 강조');
  const [excludePoints, setExcludePoints] = useState<string>('어려운 전문 용어, 불필요한 사설');

  // 생성된 기획안 상태
  const [currentPlan, setCurrentPlanState] = useState<ReelPlan | null>(null);

  // 초기 레퍼런스 셋업 및 기획안 로드
  useEffect(() => {
    if (refId) {
      const found = allReels.find((r) => r.id === refId);
      if (found) {
        setSelectedReel(found);
      }
    } else {
      const cached = getCurrentPlan();
      if (cached) {
        setCurrentPlanState(cached);
        if (cached.referenceReel) {
          setSelectedReel(cached.referenceReel);
        }
      }
    }
  }, [refId]);

  // 수정 가능 태그 목록
  const FIX_TAG_OPTIONS = [
    '썸네일 제목', '타깃 고객', '카피메시지', '말투/톤', 
    'CTA(저장/댓글 유도)', '콘티 연출', '촬영 방식', '영상 길이'
  ];

  // 썸네일 스타일 옵션
  const THUMBNAIL_STYLES = [
    '극단적 호기심', '공감형', '질문형', '반전/경고형', '직관적 솔루션'
  ];

  const toggleTag = (tag: string) => {
    if (selectedFixTags.includes(tag)) {
      setSelectedFixTags(selectedFixTags.filter((t) => t !== tag));
    } else {
      setSelectedFixTags([...selectedFixTags, tag]);
    }
  };

  // AI 기획안 생성 핸들러
  const handleGeneratePlan = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateReelPlan({
        referenceReel: selectedReel,
        targetAudience: customModifications.includes('타깃') ? '3040 직장인 및 실무 크리에이터' : '2040 현대인',
        toneAndManner: selectedFixTags.includes('말투/톤') ? '전문적이면서도 친절하고 명쾌한 설명 톤' : '대중적이고 트렌디한 톤',
        duration,
        thumbnailStyle,
        customModifications,
        includePoints,
        excludePoints,
      });

      setCurrentPlanState(generated);
      setCurrentPlan(generated);
      saveReelPlan(generated);
      setIsGenerating(false);
    }, 1500);
  };

  // 텍스트 복사 핸들러
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // PDF 파일 다운로드 처리 함수
  const handleDownloadPdf = async () => {
    if (!currentPlan) return;
    setIsExportingPdf(true);
    try {
      await exportPlanToPdf(currentPlan);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // 시덴스 2.5 및 구글 FLOW로 이동
  const goToSeedance = () => {
    if (currentPlan) setCurrentPlan(currentPlan);
    router.push('/seedance-prompt');
  };

  const goToGoogleFlow = () => {
    if (currentPlan) setCurrentPlan(currentPlan);
    router.push('/google-flow');
  };

  return (
    <div className="page-wrapper">
      {/* 1. 상단 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          나만의 릴스로 생성
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          레퍼런스를 바탕으로 내 기획에 맞게 수정하고 릴스를 완성하세요.
        </p>
      </div>

      {/* 2. 상단 2열 그리드 (좌: 원본 레퍼런스 분석 / 우: 기획 수정 폼) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* [좌측 카드] 원본 레퍼런스 분석 정보 */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Film size={18} color="var(--accent-orange)" />
              원본 레퍼런스
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {selectedReel.authorHandle}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 레퍼런스 썸네일 */}
            <div style={{ width: '130px', minWidth: '130px', aspectRatio: '9/14', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedReel.thumbnailUrl}
                alt="레퍼런스 썸네일"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* 원본 캡션 및 핵심 정보 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                원본 캡션 (Caption)
              </div>
              <p style={{
                fontSize: '13px',
                color: '#e2e8f0',
                lineHeight: 1.5,
                background: 'rgba(0,0,0,0.25)',
                padding: '10px 12px',
                borderRadius: '8px',
                maxHeight: '110px',
                overflowY: 'auto'
              }}>
                {selectedReel.caption}
              </p>

              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                추출된 주요 장면
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedReel.keyScenes.map((scene, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      fontSize: '11px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {scene}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* [우측 카드] 기획 수정하기 폼 */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={18} color="var(--accent-orange)" />
              기획 수정하기
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              요청사항을 입력하면 AI가 기획안을 다시 작성해드립니다.
            </span>
          </div>

          {/* 1. 어떤 부분을 수정하고 싶나요? 다중 선택 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              어떤 부분을 수정하고 싶나요? (복수 선택 가능)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FIX_TAG_OPTIONS.map((tag) => {
                const isSelected = selectedFixTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                      color: isSelected ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 수정 방향 입력 */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              수정 방향 입력
            </label>
            <textarea
              rows={2}
              value={customModifications}
              onChange={(e) => setCustomModifications(e.target.value)}
              placeholder="예: 타깃을 30대 여성 자영업자로 바꿔주세요. 톤을 더 전문적으로 다듬어주세요."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* 3. 대본 길이 & 썸네일 제목 스타일 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                대본 길이
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['15s', '30s', '60s'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: duration === d ? 700 : 500,
                      background: duration === d ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.04)',
                      color: duration === d ? '#111827' : 'var(--text-secondary)',
                      border: duration === d ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                썸네일 제목 스타일
              </label>
              <select
                value={thumbnailStyle}
                onChange={(e) => setThumbnailStyle(e.target.value)}
                className="select-custom"
                style={{ width: '100%', height: '35px' }}
              >
                {THUMBNAIL_STYLES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. 꼭 넣고 싶은 내용 / 빼고 싶은 부분 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                꼭 넣고 싶은 내용
              </label>
              <input
                type="text"
                value={includePoints}
                onChange={(e) => setIncludePoints(e.target.value)}
                placeholder="예: 실용팁, 여성 키워드"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                빼고 싶은 부분
              </label>
              <input
                type="text"
                value={excludePoints}
                onChange={(e) => setExcludePoints(e.target.value)}
                placeholder="예: 광고성 멘트, 사설"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* 5. 수정 반영하기 버튼 */}
          <button
            onClick={handleGeneratePlan}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '4px' }}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>AI 기획안 생성 및 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>수정 반영하여 AI 기획안 생성 ⚡</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. AI 로딩 화면 */}
      {isGenerating && (
        <div className="glass-panel" style={{
          textAlign: 'center',
          padding: '80px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={28} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
            AI 기본 기획안 생성 중...
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
            수집된 데이터를 바탕으로 스토리보드와 대본 초안 및 촬영 가이드를 실시간으로 작성하고 있습니다...
          </p>
          <RefreshCw size={24} color="#f59e0b" className="animate-spin" style={{ marginTop: '8px' }} />
        </div>
      )}

      {/* 4. 최종 기획안 렌더링 영역 */}
      {currentPlan && !isGenerating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 기획안 상단 타이틀 & 원클릭 연계 액션 바 */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'var(--accent-orange)',
                  color: '#111827',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  FINAL PLAN
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  {currentPlan.title}
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                타깃: {currentPlan.targetAudience} • {currentPlan.duration} 대본 • {currentPlan.toneAndManner}
              </p>
            </div>

            {/* 연계 액션 버튼 모음 (PDF 다운로드 및 비디오 프롬프트 연계) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={goToSeedance}
                className="btn btn-indigo"
                style={{ fontSize: '13px', padding: '9px 16px' }}
              >
                <Video size={15} />
                <span>시덴스 2.5 프롬프트 연계</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={goToGoogleFlow}
                className="btn"
                style={{
                  fontSize: '13px',
                  padding: '9px 16px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
                }}
              >
                <Clapperboard size={15} />
                <span>구글 FLOW 프롬프트 연계</span>
                <ArrowRight size={13} />
              </button>

              {/* PDF 다운로드 버튼 */}
              <button
                onClick={handleDownloadPdf}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '9px 16px' }}
                disabled={isExportingPdf}
              >
                {isExportingPdf ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>PDF 생성 중...</span>
                  </>
                ) : (
                  <>
                    <FileType size={15} />
                    <span>기획안 PDF 다운로드</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-1. 스토리보드 (Storyboard) 씬별 카드 그리드 */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={18} color="var(--accent-orange)" />
                스토리보드 (Storyboard)
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                총 {currentPlan.storyboard.length}개 장면 구성
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {currentPlan.storyboard.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--accent-orange)',
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Scene {scene.sceneNumber}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {scene.timeRange}
                    </span>
                  </div>

                  {/* 씬 이미지 */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#1e293b'
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={scene.thumbnailImage || selectedReel.thumbnailUrl}
                      alt={`Scene ${scene.sceneNumber}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* 시각 묘사 */}
                  <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                    <strong style={{ color: '#94a3b8', display: 'block', marginBottom: '2px' }}>시각 연출:</strong>
                    {scene.visualDescription}
                  </div>

                  {/* 대사 / 내레이션 */}
                  <div style={{
                    fontSize: '12px',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.08)',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    lineHeight: 1.4
                  }}>
                    <strong style={{ color: '#0284c7', display: 'block', fontSize: '11px' }}>대사/오디오:</strong>
                    {scene.dialogue}
                  </div>

                  {/* 카메라 & 사운드 */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div>📹 {scene.cameraWork}</div>
                    <div>🎵 {scene.bgmAndSound}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-2. 썸네일 제목 & 촬영 가이드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* 썸네일 제목 */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={16} color="var(--accent-orange)" />
                  썸네일 제목
                </h4>
                <button
                  onClick={() => handleCopy(currentPlan.thumbnailTitle, 'thumb')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                >
                  {copiedField === 'thumb' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedField === 'thumb' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                padding: '14px',
                color: '#fef08a',
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: 1.5
              }}>
                {currentPlan.thumbnailTitle}
              </div>
            </div>

            {/* 촬영 가이드 */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={16} color="var(--accent-orange)" />
                  촬영 가이드
                </h4>
                <button
                  onClick={() => handleCopy(currentPlan.shootingGuide, 'guide')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                >
                  {copiedField === 'guide' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedField === 'guide' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                color: '#e2e8f0',
                fontSize: '13px',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {currentPlan.shootingGuide}
              </div>
            </div>
          </div>

          {/* 4-3. 낭독용 대본 (Script) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="var(--accent-orange)" />
                낭독용 대본 (Script)
              </h4>
              <button
                onClick={() => handleCopy(currentPlan.script, 'script')}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {copiedField === 'script' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedField === 'script' ? '복사 완료' : '전체 대본 복사'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={currentPlan.script}
              onChange={(e) => {
                const updated = { ...currentPlan, script: e.target.value };
                setCurrentPlanState(updated);
                saveReelPlan(updated);
              }}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                color: '#f8fafc',
                fontSize: '14px',
                lineHeight: 1.7,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 4-4. 인스타그램/유튜브 캡션 문구 (Caption) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent-orange)" />
                캡션 문구 및 해시태그 (Caption)
              </h4>
              <button
                onClick={() => handleCopy(currentPlan.caption, 'caption')}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {copiedField === 'caption' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedField === 'caption' ? '복사 완료' : '캡션 복사'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={currentPlan.caption}
              onChange={(e) => {
                const updated = { ...currentPlan, caption: e.target.value };
                setCurrentPlanState(updated);
                saveReelPlan(updated);
              }}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                color: '#f8fafc',
                fontSize: '14px',
                lineHeight: 1.7,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>
      )}

      {/* 기획안이 아직 없을 때 기본 안내창 */}
      {!currentPlan && !isGenerating && (
        <div className="glass-panel" style={{
          textAlign: 'center',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Sparkles size={36} color="var(--accent-orange)" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            우측의 [수정 반영하여 AI 기획안 생성] 버튼을 눌러주세요
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            레퍼런스를 자동으로 분석하여 맞춤형 스토리보드, 대본, 촬영 가이드 및 비디오 생성 프롬프트를 원스톱으로 제작해 드립니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PlanningPage() {
  return (
    <Suspense fallback={<div className="page-wrapper"><p style={{ color: '#fff' }}>로딩 중...</p></div>}>
      <PlanningContent />
    </Suspense>
  );
}
