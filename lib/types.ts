/**
 * AI INNO LAB - 핵심 데이터 모델 및 TypeScript 타입 정의
 * 이 파일은 플랫폼 전반에서 사용되는 데이터 구조를 정의합니다.
 */

// 1. 릴스 벤치마킹 데이터 모델
export interface ReelBenchmark {
  id: string;
  author: string;
  authorHandle: string;
  category: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  date: string;
  videoUrl?: string;
  thumbnailUrl: string;
  caption: string;
  hook: string;
  duration: string;
  keyScenes: string[];
  isBookmarked?: boolean;
}

// 2. 스토리보드 개별 씬 모델
export interface StoryboardScene {
  sceneNumber: number;
  timeRange: string; // 예: "00:00 - 00:03"
  visualDescription: string; // 시각적 연출 묘사
  dialogue: string; // 대사 / 내레이션
  cameraWork: string; // 카메라 앵글 및 모션 (클로즈업, 틸트다운 등)
  bgmAndSound: string; // BGM 및 효과음
  thumbnailImage?: string; // 씬 시각 이미지
}

// 3. AI 릴스 기획안 모델
export interface ReelPlan {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  toneAndManner: string;
  duration: '15s' | '30s' | '60s';
  thumbnailStyle: string;
  thumbnailTitle: string;
  shootingGuide: string;
  script: string;
  caption: string;
  storyboard: StoryboardScene[];
  referenceReelId?: string;
  referenceReel?: ReelBenchmark;
  createdAt: string;
}

// 4. 시덴스 2.5(Seedance 2.5) & 구글 FLOW 프롬프트 모델
export interface VideoPromptResult {
  id: string;
  engineType: 'seedance_2_5' | 'google_flow';
  title: string;
  aspectRatio: string; // "9:16", "16:9"
  cameraMotion: string;
  lighting: string;
  scenePrompts: {
    sceneNumber: number;
    timeRange: string;
    promptText: string;
    cameraInstruction: string;
    physicsAndMotion: string;
  }[];
  fullPrompt: string;
  negativePrompt: string;
  parameters: {
    seed?: number;
    motionBucketId?: number;
    fps?: number;
    guidanceScale?: number;
    sampler?: string;
  };
  createdAt: string;
}

// 5. 쓰레드(Threads) 콘텐츠 모델
export interface ThreadPost {
  id: string;
  title: string;
  category: string;
  hook: string;
  items: string[];
  callToAction: string;
  createdAt: string;
}

// 6. 카테고리 정의 목록
export const REEL_CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'info', name: '정보/지식' },
  { id: 'product', name: '제품/공구' },
  { id: 'fashion', name: '패션/뷰티' },
  { id: 'fitness', name: '헬스/운동' },
  { id: 'ai', name: 'AI/콘텐츠' },
  { id: 'food', name: '푸드/요리' },
  { id: 'living', name: '인테리어/리빙' },
  { id: 'vlog', name: '일상/브이로그' },
  { id: 'humor', name: '유머/엔터' }
] as const;
