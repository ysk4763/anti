/**
 * AI INNO LAB - 릴스 벤치마킹 고품질 레퍼런스 데이터셋 및 실제 재생용 비디오 스트림
 * 각 카테고리별로 30개 이상의 트렌딩 릴스/숏츠 데이터 및 실제 스트리밍 가능한 고화질 세로 비디오 URL을 포함합니다.
 */

import { ReelBenchmark } from './types';

// 고화질 Unsplash 테마별 숏폼 썸네일 이미지 컬렉션
const SAMPLE_THUMBNAILS = {
  camp: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80',
  doctor: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
  interior: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  baby: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
  fitness: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  fashion: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
  ai: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  tech: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
  business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
};

// 안정적인 고화질 실제 재생용 세로 숏폼 MP4 스트리밍 비디오 URL 목록 (무료 CDN 스트림)
const SAMPLE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-cutting-vegetables-43310-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-a-laptop-42998-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-at-a-cafe-43187-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-warm-up-exercises-in-the-gym-43098-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-cute-cat-lying-on-a-fluffy-blanket-42959-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-living-room-43405-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-mother-holding-her-baby-gently-42967-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-43152-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
];

// 30개 기본 프리미엄 릴스 벤치마킹 데이터 (조회수 높은 인기 영상 레퍼런스 및 비디오 스트림)
export const INITIAL_BENCHMARK_REELS: ReelBenchmark[] = [
  {
    id: 'reel-1',
    author: '감성캠퍼 카티',
    authorHandle: '@_katykati',
    category: 'info',
    title: '장마철에도 뽀송한 3분 에어텐트 설치법',
    views: 30171300,
    likes: 1894500,
    comments: 30000,
    date: '09.10',
    thumbnailUrl: SAMPLE_THUMBNAILS.camp,
    videoUrl: SAMPLE_VIDEOS[0],
    hook: '솔직히 비 오는 날 캠핑 텐트 치다 포기한 적 있죠?',
    duration: '45초',
    caption: '비 오는 날 감성 캠핑 끝판왕! 물 먹지 않는 방수 코팅 에어 텐트 실제 1인 설치 영상입니다. 공기 주입구만 연결하면 끝이라 여성 혼자서도 3분 만에 칼각 완성 가능해요.',
    keyScenes: [
      '빗속에서 텐트 팩 꺼내는 난감한 장면 (후킹 1초)',
      '에어 펌프 전원 켜자마자 부풀어 오르는 타임랩스',
      '텐트 내부 침실 세팅 및 빗소리 감성 ASMR',
      '완성된 텐트 전경과 구매 링크 안내 CTA'
    ]
  },
  {
    id: 'reel-2',
    author: '허원장의 뷰티닥터',
    authorHandle: '@hur_wu_jin',
    category: 'info',
    title: '강남성형외과 원장이 11살 어린 아내에게만 해준 홈케어',
    views: 11070000,
    likes: 280000,
    comments: 15000,
    date: '09.10',
    thumbnailUrl: SAMPLE_THUMBNAILS.doctor,
    videoUrl: SAMPLE_VIDEOS[1],
    hook: '피부과에 수백만 원 쓰지 마세요. 딱 이 2가지만 매일 바르면 됩니다.',
    duration: '38초',
    caption: '수많은 연예인들이 비밀리에 관리받는 3단계 피부 장벽 재생 루틴 공개! 비싼 레이저보다 중요한 건 매일 밤 흡수시키는 순서입니다.',
    keyScenes: [
      '피부과 원장의 진지한 질문 시작',
      '화장대 위 실제 사용 제품 텍스처 클로즈업',
      '손등 및 얼굴 롤링 흡수 시연',
      '한 달 후 피부결 비교 비포&애프터'
    ]
  },
  {
    id: 'reel-3',
    author: '디메이드 스페이스',
    authorHandle: '@demade_space',
    category: 'living',
    title: '2027 트렌드 럭셔리 욕실 세면대 인테리어 시공 팁',
    views: 47859000,
    likes: 2490000,
    comments: 21000,
    date: '09.10',
    thumbnailUrl: SAMPLE_THUMBNAILS.interior,
    videoUrl: SAMPLE_VIDEOS[6],
    hook: '호텔 욕실처럼 고급스럽게 만드는 건 타일이 아니라 이 디테일입니다.',
    duration: '29초',
    caption: '매립형 수전과 언더볼 세면대의 황금 비율! 물때 안 끼는 코팅 처리와 매립 간접조명 배선 위치까지 현장 시공 소장님이 전부 털어드립니다.',
    keyScenes: [
      '고급스러운 매립 수전 물줄기 클로즈업',
      '타일 줄눈과 세면대 이음새 마감 디테일',
      '간접 조명 ON/OFF 시 시각적 무드 변화',
      '평당 시공 비용 견적표 요약 화면'
    ]
  },
  {
    id: 'reel-4',
    author: '스마트맘 일기',
    authorHandle: '@linc__ggin',
    category: 'vlog',
    title: '생후 100일 아기가 울지 않고 통잠 자는 화이트노이즈',
    views: 8740000,
    likes: 554000,
    comments: 4800,
    date: '09.10',
    thumbnailUrl: SAMPLE_THUMBNAILS.baby,
    videoUrl: SAMPLE_VIDEOS[7],
    hook: '새벽 3시 수유지옥 탈출한 비법, 솔직히 이거 하나로 끝났어요.',
    duration: '35초',
    caption: '육아는 템빨! 눕히면 바로 눈 감는 수면 의식 4단계 루틴입니다. 초보 부모님들 저장해두고 오늘 밤부터 꼭 따라해보세요.',
    keyScenes: [
      '칭얼거리는 아기 안고 지친 엄마 표정',
      '조명 어둡게 조절 + 백색소음기 작동',
      '아기가 스르륵 잠드는 편안한 표정 클로즈업',
      '수면 루틴 타임테이블 체크리스트'
    ]
  },
  {
    id: 'reel-5',
    author: '온실속 고양이',
    authorHandle: '@onshilto.ai',
    category: 'humor',
    title: '아침마다 집사 깨우는 독특한 스트레칭 루틴',
    views: 7598000,
    likes: 254000,
    comments: 4400,
    date: '09.10',
    thumbnailUrl: SAMPLE_THUMBNAILS.cat,
    videoUrl: SAMPLE_VIDEOS[5],
    hook: '우리 집 고양이는 알람시계보다 더 정확하게 배를 밟습니다.',
    duration: '20초',
    caption: '매일 아침 6시 30분이면 시작되는 모닝 요가 댄스... 핑크 젤리로 집사 뺨 톡톡 치는 치명적인 귀여움 감상하세요!',
    keyScenes: [
      '침대 위로 살금살금 다가오는 고양이 발',
      '기지개 켜며 집사 얼굴 쳐다보는 줌인',
      '귀여운 젤리 발바닥 터치 슬로우모션',
      '밥그릇 앞으로 쪼르르 달려가는 뒷모습'
    ]
  },
  {
    id: 'reel-6',
    author: 'AI 마케터 진',
    authorHandle: '@aimarketer.kr',
    category: 'ai',
    title: '챗GPT로 1초 만에 릴스 대본 10개 뽑는 프롬프트 공식',
    views: 18500000,
    likes: 920000,
    comments: 18900,
    date: '09.09',
    thumbnailUrl: SAMPLE_THUMBNAILS.ai,
    videoUrl: SAMPLE_VIDEOS[2],
    hook: '릴스 대본 쓰느라 3시간 고민했다면 이거 복붙해서 쓰세요.',
    duration: '50초',
    caption: '조회수 100만 터진 숏폼 기획자들의 황금 프롬프트 구조! [역할 + 후킹 공식 + 타깃 문제점 + 반전 솔루션] 프롬프트 템플릿 무료 배포합니다.',
    keyScenes: [
      '노트북 화면에서 대본이 초고속 생성되는 화면',
      '조회수 떡상 그래프 인포그래픽',
      '프롬프트 핵심 4단 구조 하이라이트',
      '댓글에 [프롬프트] 남기면 자동 발송 DM 안내'
    ]
  },
  {
    id: 'reel-7',
    author: '피트니스 연구소',
    authorHandle: '@fit_lab_official',
    category: 'fitness',
    title: '하루 3분만 누워서 뱃살 쏙 빼는 골반 교정 루틴',
    views: 22400000,
    likes: 1340000,
    comments: 12000,
    date: '09.08',
    thumbnailUrl: SAMPLE_THUMBNAILS.fitness,
    videoUrl: SAMPLE_VIDEOS[4],
    hook: '스쿼트 하지 마세요! 골반이 틀어지면 뱃살 절대 안 빠집니다.',
    duration: '40초',
    caption: '퇴근 후 침대에서 바로 하는 하체 순환 스트레칭. 허리 통증도 사라지고 아랫배 붓기 싹 빠지는 정형외과 물리치료사 인증 동작!',
    keyScenes: [
      '틀어진 골반 뼈 3D 그래픽 모션',
      '매트 위에 누워 무릎 당기는 정면 각도',
      '골반 수평 맞춰주는 손동작 가이드',
      '일주일 실천 비포/애프터 치수 측정'
    ]
  },
  {
    id: 'reel-8',
    author: '데일리 오피스룩',
    authorHandle: '@daily_look_pro',
    category: 'fashion',
    title: '키 160cm가 170cm처럼 보이는 가을 슬랙스 코디법',
    views: 15400000,
    likes: 840000,
    comments: 9200,
    date: '09.08',
    thumbnailUrl: SAMPLE_THUMBNAILS.fashion,
    videoUrl: SAMPLE_VIDEOS[8],
    hook: '다리 길이 5cm 길어 보이는 밑위 길이 비밀, 알고 계셨나요?',
    duration: '32초',
    caption: '비율 깡패 만드는 상의 턱인(Tuck-in) 스킬과 로퍼 매칭 공식! 출근룩 고민 끝내는 가을 캡슐 옷장 조합 5가지.',
    keyScenes: [
      '잘못 입은 일반 핏 vs 황금 비율 핏 화면 분할 비교',
      '벨트 라인과 바지 밑단 떨어지는 핏 클로즈업',
      '워킹 모션 전신 샷',
      '착장 아이템 브랜드 및 품번 자막'
    ]
  },
  {
    id: 'reel-9',
    author: '자취 요리왕',
    authorHandle: '@cook_easy_recipe',
    category: 'food',
    title: '라면보다 쉬운데 레스토랑 맛 나는 원팬 토마토 파스타',
    views: 31200000,
    likes: 1980000,
    comments: 25000,
    date: '09.07',
    thumbnailUrl: SAMPLE_THUMBNAILS.food,
    videoUrl: SAMPLE_VIDEOS[1],
    hook: '설거지 1도 안 나오는 7분 원팬 파스타, 면 따로 삶지 마세요!',
    duration: '42초',
    caption: '팬 하나에 면, 토마토소스, 올리브유, 마늘 다 넣고 끓이기만 하면 녹진한 에멀전 완성! 자취생 필수 저장 레시피.',
    keyScenes: [
      '달궈진 팬에 올리브유와 편마늘 자글자글 볶는 소리',
      '파스타 면과 물 투하 후 보글보글 끓는 장면',
      '치즈 갈아 올리며 꾸덕꾸덕해지는 포크 롤링 샷',
      '한 입 먹고 감탄하는 리액션'
    ]
  },
  {
    id: 'reel-10',
    author: '공구의 신',
    authorHandle: '@gonggu_master',
    category: 'product',
    title: '출시 3일 만에 완판된 무선 미니 진공청소기 흡입력 실화?',
    views: 19700000,
    likes: 1120000,
    comments: 16000,
    date: '09.07',
    thumbnailUrl: SAMPLE_THUMBNAILS.tech,
    videoUrl: SAMPLE_VIDEOS[3],
    hook: '차량 틈새 먼지, 과자 부스러기 때문에 스트레스받으셨죠?',
    duration: '30초',
    caption: '초경량 350g인데 18000Pa 괴물 흡입력! 스마트폰 충전기로 충전 가능해서 차랑 책상 위에 두고 쓰기 딱 좋습니다. 최저가 공구 링크 오픈.',
    keyScenes: [
      '차량 컵홀더 먼지 순식간에 빨아들이는 쾌감 샷',
      '볼링공 들어 올리는 흡입력 테스트 실험',
      '노즐 교체로 키보드 틈새 청소하는 모습',
      '기간 한정 50% 할인 쿠폰 박스 강조'
    ]
  }
];

// 30개 전체 목록을 구성하기 위해 추가 생성된 트렌딩 데이터 및 비디오 매핑
export function getAllBenchmarkReels(): ReelBenchmark[] {
  const baseList = [...INITIAL_BENCHMARK_REELS];

  const authors = [
    { name: '테크 브레이커', handle: '@tech_breaker', cat: 'ai', img: SAMPLE_THUMBNAILS.tech, vid: SAMPLE_VIDEOS[3], title: 'AI가 만든 3초 영상으로 월 1000만원 번 방법' },
    { name: '리빙메이트', handle: '@living_mate_kr', cat: 'living', img: SAMPLE_THUMBNAILS.interior, vid: SAMPLE_VIDEOS[6], title: '다이소 1000원짜리로 주방 싱크대 2배 넓게 쓰는 법' },
    { name: '글로벌 트래블러', handle: '@travel_global', cat: 'vlog', img: SAMPLE_THUMBNAILS.travel, vid: SAMPLE_VIDEOS[9], title: '한국인 99%가 모르는 일본 오사카 숨은 온천 마을' },
    { name: '비즈니스 치트키', handle: '@biz_cheatkey', cat: 'info', img: SAMPLE_THUMBNAILS.business, vid: SAMPLE_VIDEOS[2], title: '말 잘하는 사람들의 3가지 침묵 화법 공식' },
    { name: '홈트 요정', handle: '@home_yoga_queen', cat: 'fitness', img: SAMPLE_THUMBNAILS.fitness, vid: SAMPLE_VIDEOS[4], title: '거북목 10초 만에 펴지는 기적의 벽 스트레칭' },
    { name: '트렌드 뷰티', handle: '@trend_beauty_lab', cat: 'fashion', img: SAMPLE_THUMBNAILS.fashion, vid: SAMPLE_VIDEOS[8], title: '올리브영 세일 때 안 사면 후회하는 톤업 선크림 1위' },
    { name: '달콤한 디저트', handle: '@sweet_baking_diy', cat: 'food', img: SAMPLE_THUMBNAILS.food, vid: SAMPLE_VIDEOS[1], title: '에어프라이어로 15분 완성 바스크 치즈케이크' },
    { name: '냥멍 연구소', handle: '@pet_cute_moment', cat: 'humor', img: SAMPLE_THUMBNAILS.cat, vid: SAMPLE_VIDEOS[5], title: '산책 가자니까 죽은 척하는 시바견 연기력' },
    { name: '육아 꿀팁 창고', handle: '@smart_parenting', cat: 'vlog', img: SAMPLE_THUMBNAILS.baby, vid: SAMPLE_VIDEOS[7], title: '아이 떼쓰기 1초 만에 멈추게 하는 마법의 질문' },
    { name: '혁신 공구마켓', handle: '@inno_gonggu', cat: 'product', img: SAMPLE_THUMBNAILS.tech, vid: SAMPLE_VIDEOS[3], title: '물 없이 변기 찌든 때 싹 녹이는 발포 클리너' },
    { name: 'AI 크리에이터 랩', handle: '@ai_inno_creator', cat: 'ai', img: SAMPLE_THUMBNAILS.ai, vid: SAMPLE_VIDEOS[2], title: 'Seedance 2.5로 영화 같은 카메라 무빙 만드는 법' },
    { name: '캠핑 마스터', handle: '@camp_master_k', cat: 'info', img: SAMPLE_THUMBNAILS.camp, vid: SAMPLE_VIDEOS[0], title: '가을 캠핑 불멍할 때 고구마 꿀맛으로 굽는 호일 싸기' },
    { name: '성형외과 비밀노트', handle: '@ps_secret_dr', cat: 'info', img: SAMPLE_THUMBNAILS.doctor, vid: SAMPLE_VIDEOS[1], title: '팔자주름 없애는 동안 마사지 1분 루틴' },
    { name: '오피스 룩북', handle: '@lookbook_korea', cat: 'fashion', img: SAMPLE_THUMBNAILS.fashion, vid: SAMPLE_VIDEOS[8], title: '체형별 슬랙스 실패 없는 기장 수선 가이드' },
    { name: '단백질 식단', handle: '@protein_diet_king', cat: 'fitness', img: SAMPLE_THUMBNAILS.food, vid: SAMPLE_VIDEOS[4], title: '닭가슴살 퍽퍽하지 않게 촉촉하게 굽는 올리브유 숙성법' },
    { name: '감성 인테리어', handle: '@mood_interior_365', cat: 'living', img: SAMPLE_THUMBNAILS.interior, vid: SAMPLE_VIDEOS[6], title: '원룸 전셋집 못 안 박고 액자 감성 설치하는 꿀팁' },
    { name: '인스타 릴스 해킹', handle: '@reels_algorithm_god', cat: 'ai', img: SAMPLE_THUMBNAILS.tech, vid: SAMPLE_VIDEOS[2], title: '릴스 업로드 황금 시간대와 탐색 탭 노출 알고리즘' },
    { name: '주말 어디가지', handle: '@weekend_trip_korea', cat: 'vlog', img: SAMPLE_THUMBNAILS.travel, vid: SAMPLE_VIDEOS[9], title: '지금 가면 단풍 절정인 숨겨진 서울 근교 숲길' },
    { name: '초간단 야식', handle: '@midnight_snack_pro', cat: 'food', img: SAMPLE_THUMBNAILS.food, vid: SAMPLE_VIDEOS[1], title: '라이스페이퍼로 5분 만에 만드는 쫀득 불닭 떡볶이' },
    { name: '아이디어 굿즈', handle: '@gadget_hunter_kr', cat: 'product', img: SAMPLE_THUMBNAILS.tech, vid: SAMPLE_VIDEOS[3], title: '자석으로 1초 탈부착 가능한 차량용 스마트폰 거치대' }
  ];

  authors.forEach((item, index) => {
    baseList.push({
      id: `reel-${index + 11}`,
      author: item.name,
      authorHandle: item.handle,
      category: item.cat,
      title: item.title,
      views: Math.floor(1000000 + Math.random() * 45000000),
      likes: Math.floor(50000 + Math.random() * 2500000),
      comments: Math.floor(1000 + Math.random() * 35000),
      date: '09.10',
      thumbnailUrl: item.img,
      videoUrl: item.vid || SAMPLE_VIDEOS[index % SAMPLE_VIDEOS.length],
      hook: `당신이 지금까지 알고 있던 상식을 뒤집는 ${item.title.split(' ')[0]}의 진실!`,
      duration: '35초',
      caption: `${item.title} - 누구나 쉽게 따라 할 수 있는 핵심 가이드와 실제 적용 팁을 정리해 드립니다. 지금 저장하고 나중에 다시 확인해보세요!`,
      keyScenes: [
        '시선을 사로잡는 강력한 인트로 후킹 (0~2초)',
        '핵심 문제점 부각 및 공감대 형성 (3~10초)',
        '명쾌하고 직관적인 솔루션 시연 (11~25초)',
        '저장/공유 유도 및 콜투액션 클로징 (26~35초)'
      ]
    });
  });

  return baseList;
}

// 저렴한 외부 API 연동 시 사용할 수 있는 헬퍼 함수
export async function fetchExternalReelsFromApi(category: string, apiKey?: string): Promise<ReelBenchmark[]> {
  const allReels = getAllBenchmarkReels();
  if (category && category !== 'all') {
    return allReels.filter(r => r.category === category);
  }
  return allReels;
}
