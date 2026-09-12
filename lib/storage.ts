/**
 * AI INNO LAB - 하이브리드 스토리지 유틸리티 (Supabase + LocalStorage 캐싱)
 * 비개발자 사용자도 복잡한 DB 설정 없이 즉시 완벽하게 사용할 수 있도록
 * 로컬 브라우저 저장소와 Supabase 클라우드 DB를 자동 연동합니다.
 */

import { ReelBenchmark, ReelPlan, VideoPromptResult } from './types';
import { createClient } from '@supabase/supabase-js';

// Supabase 환경변수 확인 (Vercel 배포 시 설정 가능)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 로컬 스토리지 키 상수
const STORAGE_KEYS = {
  BOOKMARKS: 'ai_inno_lab_bookmarks',
  PLANS: 'ai_inno_lab_plans',
  PROMPTS: 'ai_inno_lab_prompts',
  THREADS: 'ai_inno_lab_threads',
  CURRENT_PLAN: 'ai_inno_lab_current_plan',
};

// 1. 북마크(즐겨찾기) 저장 및 조회
export function getBookmarkedReels(): ReelBenchmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('북마크 로드 실패:', e);
    return [];
  }
}

export function toggleBookmarkReel(reel: ReelBenchmark): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getBookmarkedReels();
    const index = bookmarks.findIndex((b) => b.id === reel.id);
    let isAdded = false;

    if (index >= 0) {
      bookmarks.splice(index, 1);
      isAdded = false;
    } else {
      bookmarks.unshift({ ...reel, isBookmarked: true });
      isAdded = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));

    // Supabase 연동 시 비동기 저장
    if (supabase) {
      if (isAdded) {
        Promise.resolve(
          supabase.from('bookmarked_reels').upsert({
            original_id: reel.id,
            author: reel.author,
            category: reel.category,
            title: reel.title,
            caption: reel.caption,
            views_count: reel.views,
            likes_count: reel.likes,
            comments_count: reel.comments,
            thumbnail_url: reel.thumbnailUrl,
          })
        ).catch((err) => console.warn('Supabase 북마크 동기화 실패(로컬 유지됨):', err));
      } else {
        Promise.resolve(
          supabase.from('bookmarked_reels').delete().eq('original_id', reel.id)
        ).catch((err) => console.warn('Supabase 북마크 삭제 실패:', err));
      }
    }

    return isAdded;
  } catch (e) {
    console.error('북마크 토글 실패:', e);
    return false;
  }
}

// 2. 릴스 기획안 저장 및 조회
export function getSavedPlans(): ReelPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('기획안 로드 실패:', e);
    return [];
  }
}

export function saveReelPlan(plan: ReelPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const plans = getSavedPlans();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.unshift(plan);
    }
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(plan));

    // Supabase 연동 시 클라우드 저장
    if (supabase) {
      Promise.resolve(
        supabase.from('reel_plans').upsert({
          id: plan.id.startsWith('plan-') ? undefined : plan.id,
          title: plan.title,
          category: plan.category,
          target_audience: plan.targetAudience,
          tone_and_manner: plan.toneAndManner,
          script_duration: plan.duration,
          thumbnail_style: plan.thumbnailStyle,
          thumbnail_title: plan.thumbnailTitle,
          shooting_guide: plan.shootingGuide,
          script_content: plan.script,
          caption_content: plan.caption,
          storyboard: plan.storyboard,
          reference_reel_id: plan.referenceReelId,
        })
      ).catch((err) => console.warn('Supabase 기획안 동기화 실패(로컬 안전 보관):', err));
    }
  } catch (e) {
    console.error('기획안 저장 실패:', e);
  }
}

export function getCurrentPlan(): ReelPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    if (data) return JSON.parse(data);
    const plans = getSavedPlans();
    return plans.length > 0 ? plans[0] : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentPlan(plan: ReelPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('현재 기획안 설정 실패:', e);
  }
}

export function deletePlan(planId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const plans = getSavedPlans().filter((p) => p.id !== planId);
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    if (supabase) {
      Promise.resolve(
        supabase.from('reel_plans').delete().eq('id', planId)
      ).catch(console.warn);
    }
  } catch (e) {
    console.error('기획안 삭제 실패:', e);
  }
}

// 3. 비디오 프롬프트 저장 및 조회
export function getSavedPrompts(): VideoPromptResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveVideoPrompt(prompt: VideoPromptResult): void {
  if (typeof window === 'undefined') return;
  try {
    const prompts = getSavedPrompts();
    prompts.unshift(prompt);
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (e) {
    console.error('프롬프트 저장 실패:', e);
  }
}
