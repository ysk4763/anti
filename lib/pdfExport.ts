/**
 * AI INNO LAB - 기획안 PDF 내보내기 유틸리티 (lib/pdfExport.ts)
 * Node.js SSR 환경에서 서버 크래시를 방지하기 위해 dynamic import 기법을 적용하여
 * 브라우저 클라이언트에서만 jspdf와 html2canvas를 안전하게 로드합니다.
 */

import { ReelPlan } from './types';

export async function exportPlanToPdf(plan: ReelPlan): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. 브라우저 전용 라이브러리 동적 로드 (SSR 오류 100% 방지)
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  // 2. PDF 렌더링용 임시 컨테이너 생성 (A4 규격 800px 너비의 모던한 문서 디자인)
  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.background = '#ffffff';
  container.style.color = '#111827';
  container.style.fontFamily = "'Pretendard', sans-serif";
  container.style.boxSizing = 'border-box';

  // 3. 기획안 HTML 내용 구조화
  container.innerHTML = `
    <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 12px; font-weight: 800; color: #6366f1; letter-spacing: 1px; text-transform: uppercase;">AI INNO LAB • REELS PRODUCTION PLAN</div>
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 6px 0 0 0;">${plan.title}</h1>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b;">
        <div>작성일자: ${new Date(plan.createdAt).toLocaleDateString('ko-KR')}</div>
        <div>길이: ${plan.duration} • 타깃: ${plan.targetAudience}</div>
      </div>
    </div>

    <!-- 1. 핵심 요약 카드 -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <div style="font-size: 13px; font-weight: 700; color: #d97706; margin-bottom: 6px;">[썸네일 제목 & 카피]</div>
      <div style="font-size: 15px; font-weight: 700; color: #1e293b;">${plan.thumbnailTitle}</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">톤앤매너: ${plan.toneAndManner} | 카테고리: ${plan.category}</div>
    </div>

    <!-- 2. 촬영 가이드 -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; border-left: 4px solid #f59e0b; padding-left: 8px; margin-bottom: 8px;">1. 촬영 및 연출 가이드</h3>
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; font-size: 12px; line-height: 1.6; color: #334155; white-space: pre-line;">
        ${plan.shootingGuide}
      </div>
    </div>

    <!-- 3. 스토리보드 4컷 -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; border-left: 4px solid #6366f1; padding-left: 8px; margin-bottom: 12px;">2. 스토리보드 (Storyboard)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        ${plan.storyboard.map((scene) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #6366f1; margin-bottom: 6px;">
              <span>Scene ${scene.sceneNumber}</span>
              <span style="color: #64748b; font-size: 11px;">${scene.timeRange}</span>
            </div>
            <div style="font-size: 12px; color: #1e293b; margin-bottom: 6px;"><strong>시각:</strong> ${scene.visualDescription}</div>
            <div style="font-size: 12px; color: #0284c7; background: #f0f9ff; padding: 6px; border-radius: 4px; margin-bottom: 6px;"><strong>대사:</strong> ${scene.dialogue}</div>
            <div style="font-size: 11px; color: #64748b;">📹 ${scene.cameraWork} | 🎵 ${scene.bgmAndSound}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 4. 전체 낭독 대본 -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; border-left: 4px solid #10b981; padding-left: 8px; margin-bottom: 8px;">3. 낭독용 전체 대본 (Script)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.7; color: #1e293b; white-space: pre-line;">
        ${plan.script}
      </div>
    </div>

    <!-- 5. 캡션 및 해시태그 -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; border-left: 4px solid #ec4899; padding-left: 8px; margin-bottom: 8px;">4. SNS 캡션 & 해시태그 (Caption)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.6; color: #334155; white-space: pre-line;">
        ${plan.caption}
      </div>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8;">
      Generated by AI INNO LAB (Short-Form AI Planning & Video Prompt Studio)
    </div>
  `;

  document.body.appendChild(container);

  try {
    // 4. HTML 캔버스화 (고해상도 배율 2배 적용)
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 가로 (mm)
    const pageHeight = 297; // A4 세로 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 내용이 길 경우 다음 페이지 자동 분할
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 파일 저장
    const sanitizedTitle = plan.title.replace(/[^a-zA-Z0-9가-힣_]/g, '_').slice(0, 30);
    pdf.save(`AI_INNO_LAB_기획안_${sanitizedTitle}.pdf`);
  } catch (error) {
    console.error('PDF 생성 실패:', error);
    alert('PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄 기능을 이용해 주세요.');
  } finally {
    // 임시 컨테이너 제거
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
