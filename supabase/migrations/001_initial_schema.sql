-- ==============================================================================
-- AI INNO LAB - Supabase 데이터베이스 마이그레이션 스키마
-- 파일명: 001_initial_schema.sql
-- 설명: 릴스 벤치마킹 북마크, 기획안, AI 비디오 프롬프트(시덴스2.5/구글FLOW), 쓰레드 저장 테이블
-- ==============================================================================

-- 1. 즐겨찾기(북마크)한 릴스 레퍼런스 테이블
CREATE TABLE IF NOT EXISTS public.bookmarked_reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_id VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title TEXT,
    caption TEXT,
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    comments_count BIGINT DEFAULT 0,
    video_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AI 릴스 기획안 프로젝트 테이블
CREATE TABLE IF NOT EXISTS public.reel_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_audience TEXT,
    tone_and_manner VARCHAR(100),
    script_duration VARCHAR(20) DEFAULT '30s',
    thumbnail_style VARCHAR(100),
    thumbnail_title TEXT,
    shooting_guide TEXT,
    script_content TEXT NOT NULL,
    caption_content TEXT,
    storyboard JSONB DEFAULT '[]'::jsonb,
    reference_reel_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 비디오 프롬프트 저장 테이블 (시덴스 2.5 & 구글 FLOW)
CREATE TABLE IF NOT EXISTS public.video_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.reel_plans(id) ON DELETE SET NULL,
    engine_type VARCHAR(50) NOT NULL, -- 'seedance_2_5' 또는 'google_flow'
    title VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    negative_prompt TEXT,
    camera_motion VARCHAR(100),
    lighting_style VARCHAR(100),
    aspect_ratio VARCHAR(20) DEFAULT '9:16',
    scene_breakdown JSONB DEFAULT '[]'::jsonb,
    parameters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SNS 쓰레드(Threads) 콘텐츠 저장 테이블
CREATE TABLE IF NOT EXISTS public.thread_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.reel_plans(id) ON DELETE SET NULL,
    topic VARCHAR(255) NOT NULL,
    thread_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    hook_sentence TEXT,
    call_to_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_bookmarked_reels_category ON public.bookmarked_reels(category);
CREATE INDEX IF NOT EXISTS idx_reel_plans_created_at ON public.reel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_prompts_engine ON public.video_prompts(engine_type);

-- RLS (행 수준 보안) 활성화 및 누구나 읽기/쓰기 가능한 데모 정책 설정
ALTER TABLE public.bookmarked_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON public.bookmarked_reels FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON public.bookmarked_reels FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Access" ON public.bookmarked_reels FOR DELETE USING (true);

CREATE POLICY "Public Read Reel Plans" ON public.reel_plans FOR SELECT USING (true);
CREATE POLICY "Public Insert Reel Plans" ON public.reel_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Reel Plans" ON public.reel_plans FOR UPDATE USING (true);
CREATE POLICY "Public Delete Reel Plans" ON public.reel_plans FOR DELETE USING (true);

CREATE POLICY "Public Read Video Prompts" ON public.video_prompts FOR SELECT USING (true);
CREATE POLICY "Public Insert Video Prompts" ON public.video_prompts FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Thread Posts" ON public.thread_posts FOR SELECT USING (true);
CREATE POLICY "Public Insert Thread Posts" ON public.thread_posts FOR INSERT WITH CHECK (true);
