import type { Metadata } from 'next';
import './globals.css';
import './medieval.css';
import './espresso.css';
import './auth.css';
export const metadata: Metadata = { title: 'SuGang · 나만의 시간표', description: '학교 밖에서도, 나만의 시간표. 활동과 목표, 할 일과 일지를 함께.' };
// CSS 파일 중간의 @import는 묶음 후 무시될 수 있어 글꼴은 <link>로 한 번에 불러온다.
const fonts =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IM+Fell+English:ital@0;1&family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&family=Parisienne&family=Pinyon+Script&display=swap';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fonts} />
      </head>
      <body>{children}</body>
    </html>
  );
}
