/**
 * AI INNO LAB - 프롬프트 엔진 및 AI 기획안/비디오 생성기 로직
 * 1) 나만의 릴스 기획안 생성 (스토리보드, 대본, 촬영가이드, 캡션)
 * 2) 시덴스 2.5 (Seedance 2.5) 비디오 생성 AI 전용 프롬프트 빌더
 * 3) 구글 FLOW (Google Flow / Veo / VideoFX) 차세대 비디오 프롬프트 빌더
 * 4) 쓰레드(Threads) SNS 콘텐츠 변환 빌더
 */

import { ReelBenchmark, ReelPlan, StoryboardScene, VideoPromptResult, ThreadPost } from './types';

export interface PlanGenerationRequest {
  referenceReel: ReelBenchmark;
  targetAudience: string;
  toneAndManner: string;
  duration: '15s' | '30s' | '60s';
  thumbnailStyle: string;
  customModifications?: string; // 수정 방향 입력
  includePoints?: string; // 꼭 넣고 싶은 내용
  excludePoints?: string; // 빼고 싶은 부분
}

// 1. 릴스 기획안 AI 자동 생성 로직
export function generateReelPlan(req: PlanGenerationRequest): ReelPlan {
  const { referenceReel, targetAudience, toneAndManner, duration, thumbnailStyle, customModifications, includePoints, excludePoints } = req;

  // 타깃 및 톤앤매너에 따른 맞춤 키워드 도출
  const target = targetAudience || '2040 현대인 및 크리에이터';
  const tone = toneAndManner || '친근하고 설득력 있는 전문적인 톤';
  const customNotes = customModifications ? `[요청사항 반영: ${customModifications}]` : '';
  const inclusions = includePoints ? `\n- 필수 강조: ${includePoints}` : '';
  const exclusions = excludePoints ? `\n- 제외 사항: ${excludePoints}` : '';

  // 스토리보드 4~5개 씬 자동 구성
  const storyboard: StoryboardScene[] = [
    {
      sceneNumber: 1,
      timeRange: '00:00 - 00:03',
      visualDescription: `[시선 집중 인트로] ${referenceReel.title.split(' ')[0]} 관련 사용자가 겪는 가장 큰 고민 상황을 극적으로 보여주는 클로즈업 샷`,
      dialogue: `"${referenceReel.hook || '아직도 이것 때문에 스트레스받고 계신가요?'}"`,
      cameraWork: '타이트 바스트 샷 (Tight Bust Shot) → 0.5초 만에 빠른 줌인',
      bgmAndSound: '긴장감 있는 베이스 드랍 및 찰칵 사운드',
      thumbnailImage: referenceReel.thumbnailUrl
    },
    {
      sceneNumber: 2,
      timeRange: '00:03 - 00:10',
      visualDescription: `[문제점 폭로 & 공감] 기존의 비효율적인 방식과 비교하며 답답함을 시각적으로 연출`,
      dialogue: `"수많은 사람들이 똑같이 실수하는 바로 이 포인트! 사실 ${target}에게 필요한 건 따로 있습니다."`,
      cameraWork: '좌우 분할 화면 (Before vs After 대비 효과)',
      bgmAndSound: '경쾌한 템포의 트렌디 로파이 비트 전환',
      thumbnailImage: referenceReel.thumbnailUrl
    },
    {
      sceneNumber: 3,
      timeRange: '00:10 - 00:22',
      visualDescription: `[핵심 솔루션 시연] ${tone}으로 실제 제품 또는 팁을 사용하는 1단계, 2단계 실천 액션 시연`,
      dialogue: `"딱 이것만 기억하세요. 첫째, 1초 만에 각 잡기! 둘째, 이렇게 세팅하면 끝입니다."`,
      cameraWork: '오버헤드 탑뷰(Top-down) 앵글 + 손동작 디테일 매크로 샷',
      bgmAndSound: '신뢰감을 주는 산뜻한 신스 멜로디 + 띵 효과음',
      thumbnailImage: referenceReel.thumbnailUrl
    },
    {
      sceneNumber: 4,
      timeRange: '00:22 - 00:30',
      visualDescription: `[최종 완성 결과 & CTA] 깔끔하게 완성된 전경과 함께 저장 및 댓글 유도 그래픽 표시`,
      dialogue: `"진짜 삶의 질이 달라집니다. 지금 이 영상 [저장]해두고, 댓글에 '정보' 남겨주시면 링크 보내드릴게요!"`,
      cameraWork: '부드러운 슬로우 줌아웃 + 우측 하단 저장 버튼 포인팅',
      bgmAndSound: '밝은 아웃트로 사운드 및 벨소리 이펙트',
      thumbnailImage: referenceReel.thumbnailUrl
    }
  ];

  // 썸네일 제목 생성
  const thumbnailTitle = `${thumbnailStyle || '공감/후킹'}형 : "${referenceReel.title.slice(0, 18)}... 딱 3가지만 기억하세요!"`;

  // 촬영 가이드
  const shootingGuide = `1. 조명: 45도 측면 자연광 또는 링라이트(색온도 4500K)로 인물과 제품의 입체감 강조
2. 오디오: 핀마이크 사용 필수, 첫 3초 목소리 톤을 평소보다 1.2배 높여 활기차게 녹음
3. 앵글: 9:16 세로 화면 비율 기준, 중앙 80% 영역에 핵심 피사체와 텍스트 자막 배치 (인스타 UI에 가려지지 않도록 상하 10% 여백 확보)
4. 편집: 컷 전환 간격은 1.5초를 넘기지 않도록 빠른 템포의 점프컷 적용`;

  // 전체 대본 (낭독용)
  const script = `(00:00~00:03)
${referenceReel.hook || '솔직히 이것 때문에 매일 고민 많으셨죠?'}

(00:03~00:10)
비싼 돈 쓰고 시간 낭비하지 마세요. ${target} 분들이 가장 많이 놓치는 핵심 비밀이 있습니다.

(00:10~00:22)
딱 2가지만 순서대로 따라해보세요.
첫 번째, 준비 단계에서 이렇게 방향을 잡아주시고,
두 번째, 가볍게 터치하듯 마무리해주면 끝!
직접 써보면 왜 다들 추천하는지 바로 체감하실 겁니다.

(00:22~00:30)
지금 영상 [저장]해두고 꼭 따라해보세요.
더 자세한 꿀팁은 댓글 창에서 확인하세요!`;

  // 인스타그램/유튜브 최적화 캡션
  const caption = `🔥 ${referenceReel.title} (저장 필수!)

${tone}으로 정리한 실전 꿀팁 공개합니다✨
${customNotes}

📌 핵심 요약 체크리스트:
1️⃣ 가장 먼저 체크해야 할 황금 포인트
2️⃣ 시간과 비용을 절반으로 아끼는 실전 팁
3️⃣ 실패 없이 한 번에 성공하는 방법

👉 이 영상이 도움 되셨다면 [좋아요]와 [저장] 꾹 눌러주세요!
궁금한 점은 댓글로 남겨주시면 답변해 드립니다👇

#숏폼기획 #릴스추천 #트렌드릴스 #크리에이터 #${referenceReel.category} #AIINNOTOOLS #바이럴릴스`;

  return {
    id: `plan-${Date.now()}`,
    title: `[맞춤 기획] ${referenceReel.title}`,
    category: referenceReel.category,
    targetAudience: target,
    toneAndManner: tone,
    duration: duration || '30s',
    thumbnailStyle: thumbnailStyle || '후킹형',
    thumbnailTitle,
    shootingGuide,
    script,
    caption,
    storyboard,
    referenceReelId: referenceReel.id,
    referenceReel,
    createdAt: new Date().toISOString()
  };
}

// 2. 시덴스 2.5 (Seedance 2.5) 비디오 생성 AI 전용 프롬프트 생성기
export function generateSeedance25Prompt(plan: ReelPlan): VideoPromptResult {
  const scenes = plan.storyboard.map((scene, idx) => {
    let cameraMotion = 'Dynamic push-in tracking shot, steady gimbal movement';
    if (idx === 0) cameraMotion = 'Fast forward snap zoom, high dynamic velocity, eye-level close-up';
    if (idx === 1) cameraMotion = 'Split view dynamic parallax slide, seamless cut transition';
    if (idx === 2) cameraMotion = 'Top-down macro flat-lay focus, soft shallow depth of field (f/1.8)';
    if (idx === 3) cameraMotion = 'Cinematic slow-motion pull-out dolly, subtle 24fps filmic pan';

    return {
      sceneNumber: scene.sceneNumber,
      timeRange: scene.timeRange,
      promptText: `Seedance 2.5 Video Generation - Scene ${scene.sceneNumber}: Cinematic 9:16 vertical 4K resolution. ${scene.visualDescription}. Ultra-realistic textures, natural physics, highly detailed commercial lighting, studio softbox ambient glow, vibrant colors, shot on ARRI Alexa Mini, 8k render, photorealistic realism --ar 9:16 --motion 7 --seedance-v2.5`,
      cameraInstruction: cameraMotion,
      physicsAndMotion: 'Fluid micro-dynamics, realistic fabric/surface reflections, crisp particle lighting'
    };
  });

  const fullPrompt = `/* =================================================================
   SEEDANCE 2.5 AI VIDEO GENERATION MASTER PROMPT
   Project: ${plan.title}
   Target: ${plan.targetAudience} | Aspect: 9:16 Vertical Reel
================================================================= */

[MASTER PROMPT]
Cinematic vertical 9:16 short-form commercial video. Hyper-realistic style, high visual fidelity, vivid HDR contrast, 8k resolution, photorealistic master shot.

[SCENE BREAKDOWN FOR SEEDANCE 2.5]
${scenes.map(s => `[Scene ${s.sceneNumber} (${s.timeRange})]
Prompt: ${s.promptText}
Camera: ${s.cameraInstruction}
Motion Physics: ${s.physicsAndMotion}
`).join('\n')}

[PARAMETERS & CONFIGURATION]
- Engine: Seedance 2.5 High-Precision Motion
- Aspect Ratio: 9:16 (1080x1920)
- Motion Bucket: 128 (Smooth high dynamic continuity)
- FPS: 30
- Guidance Scale: 7.5
- Sampler: DPM++ 2M Karras

[NEGATIVE PROMPT]
blurry, low quality, distorted anatomy, warped faces, flickering artifacts, watermarks, grainy, glitch, cartoonish over-saturation, bad lighting, text noise`;

  return {
    id: `seedance-${Date.now()}`,
    engineType: 'seedance_2_5',
    title: `시덴스 2.5 비디오 프롬프트 - ${plan.title}`,
    aspectRatio: '9:16',
    cameraMotion: 'Cinematic Hybrid Camera Rig (Zoom, Macro, Dolly)',
    lighting: 'Commercial Softbox Studio Light & Ambient Daylight',
    scenePrompts: scenes,
    fullPrompt,
    negativePrompt: 'blurry, low quality, distorted anatomy, warped faces, flickering, watermarks, grainy, glitch, cartoonish, noise',
    parameters: {
      seed: Math.floor(Math.random() * 99999999),
      motionBucketId: 128,
      fps: 30,
      guidanceScale: 7.5,
      sampler: 'DPM++ 2M Karras'
    },
    createdAt: new Date().toISOString()
  };
}

// 3. 구글 FLOW (Google Flow / Veo / VideoFX) 차세대 비디오 프롬프트 생성기
export function generateGoogleFlowPrompt(plan: ReelPlan): VideoPromptResult {
  const scenes = plan.storyboard.map((scene, idx) => {
    return {
      sceneNumber: scene.sceneNumber,
      timeRange: scene.timeRange,
      promptText: `Google Flow Video Pipeline [Shot ${scene.sceneNumber}]: A high-end vertical 9:16 cinematic sequence depicting: ${scene.visualDescription}. Consistent character lighting, photorealistic subsurface scattering, natural motion blur, 4k 60fps film grading, hyper-detailed environment. Dialogue sync point: "${scene.dialogue.replace(/"/g, '')}".`,
      cameraInstruction: `Google Flow Camera Choreography: Smooth virtual crane move, focal length 35mm f/1.4, cinematic racking focus.`,
      physicsAndMotion: `Consistent scene physics, zero spatial drift, unified color palette, temporal coherence.`
    };
  });

  const fullPrompt = `/* =================================================================
   GOOGLE FLOW (VEO / VIDEOFX) MULTI-SHOT PROMPT PIPELINE
   Project: ${plan.title}
   Engine: Google Flow Cinematic Diffusion Core
================================================================= */

@GoogleFlow:Timeline {
  format: "vertical_reel_9_16",
  resolution: "2160x3840",
  fps: 60,
  coherence_lock: true,
  style_dna: "Modern Commercial / Hyper-Clean Aesthetics"
}

${scenes.map(s => `@Shot[${s.sceneNumber}] (${s.timeRange}) {
  visual_prompt: "${s.promptText}",
  camera_path: "${s.cameraInstruction}",
  coherence: "temporal_consistency_high"
}`).join('\n\n')}

@PostProcessing {
  color_grade: "Clean Modern Teal & Warm Orange",
  lens_flare: "Subtle Anamorphic",
  sharpness: 1.15
}`;

  return {
    id: `flow-${Date.now()}`,
    engineType: 'google_flow',
    title: `구글 FLOW 비디오 프롬프트 - ${plan.title}`,
    aspectRatio: '9:16',
    cameraMotion: 'Google Flow Multi-Shot Automated Crane & Glidecam',
    lighting: 'Volumetric Daylight & Diffused Key Lighting',
    scenePrompts: scenes,
    fullPrompt,
    negativePrompt: 'temporal flickering, character inconsistency, bad textures, blurry edges, jittery camera, bad anatomy',
    parameters: {
      seed: Math.floor(Math.random() * 88888888),
      motionBucketId: 100,
      fps: 60,
      guidanceScale: 8.0,
      sampler: 'Flow Matching Euler'
    },
    createdAt: new Date().toISOString()
  };
}

// 4. 쓰레드 (Threads) SNS 콘텐츠 생성기
export function generateThreadsFromPlan(plan: ReelPlan): ThreadPost {
  const items = [
    `🧵 1/5) ${plan.title.replace('[맞춤 기획] ', '')}\n\n솔직히 지금까지 이거 몰라서 시간 버리신 분들 많으실 겁니다. 오늘 딱 3가지로 압축해 드립니다. 👇`,
    `2/5) 핵심 문제점 🚨\n\n대부분의 사람들이 ${plan.targetAudience} 관점에서 실수하는 이유는 기본 원리를 건너뛰기 때문입니다.`,
    `3/5) 실전 해결책 💡\n\n1. 첫 3초 시선 사로잡기\n2. 불필요한 군더더기 생략하고 직관적인 결과 보여주기\n3. 누구나 따라 할 수 있는 1분 루틴 적용하기`,
    `4/5) 전문가 꿀팁 ⚡\n\n${plan.toneAndManner} 스타일을 유지하면서 일관된 템포로 전달하면 신뢰도와 인게이지먼트가 3배 이상 증가합니다.`,
    `5/5) 마무리 및 요약 ✨\n\n도움이 되셨다면 이 타래(Thread)를 [재게시(RT)] 및 [좋아요] 해주세요!\n저장해두고 필요할 때마다 꺼내보시면 큰 도움이 됩니다. 🙌`
  ];

  return {
    id: `thread-${Date.now()}`,
    title: `${plan.title} - 쓰레드 콘텐츠`,
    category: plan.category,
    hook: items[0],
    items,
    callToAction: '궁금한 점이나 추가 질문은 댓글로 편하게 남겨주세요!',
    createdAt: new Date().toISOString()
  };
}
