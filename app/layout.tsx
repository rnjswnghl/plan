import type { Metadata } from 'next';
import './globals.css';
import './medieval.css';
import './espresso.css';
export const metadata: Metadata = { title: 'SuGang · 나만의 시간표', description: '학교 밖에서도, 나만의 시간표. 활동과 목표, 할 일과 일지를 함께.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html>; }
