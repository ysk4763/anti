# 🚀 AI INNO LAB - 인기 릴스 벤치마킹 & AI 비디오 프롬프트 스튜디오

숏폼(릴스/숏츠/틱톡) 기획의 모든 과정을 자동화하는 차세대 올인원 웹 애플리케이션입니다.  
인기 영상 레퍼런스 벤치마킹부터 맞춤형 릴스 AI 기획안 생성, 그리고 **시덴스 2.5(Seedance 2.5)** & **구글 FLOW(Google Flow)** 영상 생성 AI 프롬프트 제작까지 원스톱으로 지원합니다.

---

## 🌟 주요 기능

1. **릴스 벤치마킹 (카테고리별 30개 그리드)**
   - 정보/지식, 제품/공구, 패션/뷰티, AI/콘텐츠, 푸드 등 카테고리별 30개 이상의 인기 릴스 노출
   - 조회수순 / 전체기간 정렬 및 검색, 북마크(즐겨찾기) 기능
   - 각 카드에서 클릭 한 번으로 **"나만의 릴스로 생성"** 연결

2. **나만의 릴스 기획 (스토리보드 & 대본 생성)**
   - 원본 레퍼런스 분석(캡션, 주요 장면)
   - 맞춤형 수정 옵션(타깃, 톤앤매너, 대본 길이, 썸네일 스타일, 강조/제외 내용)
   - AI 기획안 생성:
     - 4~6컷 비주얼 스토리보드 (시각 묘사, 대사, 카메라 앵글, 사운드)
     - 썸네일 제목 & 시각 가이드
     - 전문 촬영 가이드
     - 낭독용 대본(Script)
     - 인스타그램/유튜브 최적화 캡션 & 해시태그

3. **시덴스 2.5 (Seedance 2.5) 프롬프트 만들기** *(신규 특화 기능)*
   - 릴스 기획안의 스토리보드를 바탕으로 Seedance 2.5 AI 영상 엔진 전용 프롬프트 자동 생성
   - 카메라 모션, 물리 광원 효과, 네거티브 프롬프트, Motion Bucket 등 세부 파라미터 제어

4. **구글 FLOW (Google Flow / Veo / VideoFX) 프롬프트 만들기** *(신규 특화 기능)*
   - Google 차세대 비디오 AI에 최적화된 다중 샷(Multi-Shot) 시네마틱 프롬프트 파이프라인 생성
   - 장면별 연속성(Temporal Consistency) 유지 및 DSL 스크립트 출력

5. **쓰레드(Threads) SNS 콘텐츠 생성**
   - 릴스 기획 내용을 바탕으로 바이럴 타래(Thread) 글 자동 생성

6. **저장소 (라이브러리)**
   - 즐겨찾기한 릴스 및 내가 생성한 기획안 프로젝트 보관 및 재편집

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: 커스텀 CSS 디자인 시스템 (전문가용 딥 슬레이트 & 인디고/바이올렛 테마)
- **Database**: Supabase + 브라우저 LocalStorage 스마트 하이브리드 캐싱
- **Deployment**: Vercel 원클릭 배포 지원

---

## 💻 로컬에서 실행하기 (비개발자 가이드)

1. 터미널(명령 프롬프트)을 열고 프로젝트 폴더로 이동합니다:
   ```bash
   cd d:\숏츠기획하기사이트
   ```

2. 로컬 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

3. 브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## ☁️ Vercel 배포 & GitHub 연동 방법

### 1단계: GitHub 저장소에 올리기
```bash
git init
git add .
git commit -m "feat: AI INNO LAB 초기 릴리즈 완료"
git branch -M main
git remote add origin <사용자_깃허브_레포지토리_URL>
git push -u origin main
```

### 2단계: Vercel 배포
1. [Vercel](https://vercel.com)에 로그인합니다.
2. **Add New Project**를 누르고 방금 올린 GitHub 저장소를 선택합니다.
3. **Deploy** 버튼을 누르면 약 1분 내로 전 세계에 배포됩니다.

---

## 🗄️ Supabase 데이터베이스 연동 (선택 사항)

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. 좌측 **SQL Editor** 메뉴로 들어갑니다.
3. 프로젝트 내 `supabase/migrations/001_initial_schema.sql` 파일의 내용을 복사하여 실행합니다.
4. `.env.local` 파일을 만들고 Supabase 키를 입력합니다:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(※ Supabase 설정 없이도 브라우저 로컬 저장소로 모든 기능이 100% 정상 작동합니다!)*
