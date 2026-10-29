import { useId } from 'react';

const edge =
  'M61.0 32.0C60.6 34.2 60.0 36.1 59.7 38.3C59.4 40.5 59.8 42.9 59.3 45.1C58.7 47.3 57.9 49.8 56.5 51.5C55.0 53.2 52.4 53.9 50.6 55.3C48.8 56.8 47.7 59.6 45.6 60.3C43.6 60.9 40.5 59.1 38.2 59.3C36.0 59.6 34.1 61.7 32.0 61.7C29.9 61.7 27.9 59.8 25.8 59.2C23.7 58.7 21.4 59.0 19.2 58.5C17.0 58.1 14.0 57.9 12.5 56.4C11.0 54.9 11.2 51.5 10.0 49.5C8.8 47.6 6.9 46.5 5.5 44.8C4.1 43.0 2.5 41.0 1.8 38.9C1.2 36.8 1.2 34.2 1.5 32.0C1.9 29.8 3.5 27.8 4.1 25.6C4.6 23.4 4.7 21.4 4.8 18.9C5.0 16.4 3.5 12.2 4.9 10.4C6.4 8.7 10.9 9.4 13.3 8.6C15.7 7.7 17.3 6.8 19.3 5.6C21.2 4.4 22.9 1.5 25.0 1.3C27.1 1.0 29.7 4.0 32.0 4.0C34.3 4.1 36.7 1.7 38.9 1.7C41.2 1.7 43.4 3.0 45.5 4.0C47.6 4.9 50.2 5.6 51.7 7.3C53.1 9.1 53.0 12.4 54.1 14.4C55.2 16.4 56.8 17.6 58.1 19.4C59.4 21.2 61.6 23.0 62.1 25.1C62.6 27.2 61.4 29.8 61.0 32.0Z';

const tones = {
  red: { hi: '#c4524c', mid: '#8e2a2a', low: '#5b1418', line: '#4a0f12', glint: '#f2b8a8' },
  blue: { hi: '#5a7bb5', mid: '#2b4a82', low: '#16284e', line: '#0f1d3a', glint: '#c9d8f2' },
};

/** 밀랍 인장. 실천한 날의 성취 표시. 장식이 아니라 "완료" 근거이므로 aria-label을 단다. */
export default function WaxSeal({ tone = 'red', label = '실천 완료 인장' }: { tone?: 'red' | 'blue'; label?: string }) {
  const id = useId().replace(/:/g, '');
  const t = tones[tone];
  return (
    <span className={`wax-seal wax-${tone}`} role="img" aria-label={label}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <radialGradient id={`w${id}`} cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor={t.hi} />
            <stop offset=".55" stopColor={t.mid} />
            <stop offset="1" stopColor={t.low} />
          </radialGradient>
          <radialGradient id={`p${id}`} cx="60%" cy="70%" r="60%">
            <stop offset="0" stopColor={t.low} stopOpacity=".55" />
            <stop offset="1" stopColor={t.mid} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={edge} fill={`url(#w${id})`} />
        <circle cx="32" cy="32" r="21.5" fill={`url(#p${id})`} />
        <circle cx="32" cy="32" r="21.5" fill="none" stroke={t.line} strokeOpacity=".55" strokeWidth="1.4" />
        <circle cx="32" cy="32" r="19.2" fill="none" stroke={t.glint} strokeOpacity=".28" strokeWidth=".7" strokeDasharray="1 1.6" />
        {/* 만년필 펜촉과 책: SuGang의 표식 */}
        <g fill="none" stroke={t.line} strokeOpacity=".75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 26c3-2 7-2 10 0v14c-3-2-7-2-10 0Z" />
          <path d="M32 26c3-2 7-2 10 0v14c-3-2-7-2-10 0" />
          <path d="M35 37l7-12 3 2-6 11-4 2Z" />
        </g>
        <g fill="none" stroke={t.glint} strokeOpacity=".35" strokeWidth=".7" strokeLinecap="round">
          <path d="M22.6 25.3c3-1.8 6.6-1.8 9.4 0M35.7 36.4l6.4-10.8" />
        </g>
        <path d="M14 20c4-8 13-12 21-11" fill="none" stroke={t.glint} strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
