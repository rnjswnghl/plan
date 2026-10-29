import type { Metadata } from 'next';
// 글꼴은 저장소에 포함된 @fontsource로 직접 제공한다(외부 CDN·@import에 의존하지 않음).
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/pinyon-script/400.css';
import '@fontsource/noto-serif-kr/400.css';
import '@fontsource/noto-serif-kr/600.css';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import './globals.css';
import './medieval.css';
import './espresso.css';
import './auth.css';
import './journal.css';
export const metadata: Metadata = { title: 'SuGang · 나만의 시간표', description: '학교 밖에서도, 나만의 시간표. 활동과 목표, 할 일과 일지를 함께.' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="sg">{children}</body>
    </html>
  );
}
