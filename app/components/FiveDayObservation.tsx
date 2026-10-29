'use client';
import { useState } from 'react';
import { shiftDate, weekday } from '../../lib/calendar';
import { seoulDate, State } from '../../lib/model';
import { Metric, observation } from '../../lib/observation';

const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
const units: Record<Metric, { label: string; unit: string }> = {
  minutes: { label: '실제 학습 시간', unit: '분' },
  completed: { label: '완료한 To-do', unit: '개' },
};

/** 5일 관찰: 화면의 합계·평균이 원본 기록을 손으로 더한 값과 같은지 바로 대조할 수 있게 식까지 보여준다. */
export default function FiveDayObservation({ state, onEvidence }: { state: State; onEvidence: () => void }) {
  const [start, setStart] = useState(() => shiftDate(seoulDate(), -4)),
    [metric, setMetric] = useState<Metric>('minutes');
  const o = observation(state, start, metric);
  const u = units[metric];
  const max = Math.max(1, ...o.rows.map((r) => r.value ?? 0));
  const today = seoulDate();
  return (
    <section className="panel observation">
      <div className="section-title">
        <div>
          <div className="manuscript-caption">Five days, honestly kept.</div>
          <h2>5일 관찰</h2>
          <p className="muted">하루 {u.label}({u.unit})을 같은 규칙으로 셉니다. 원본 기록을 손으로 더한 값과 같아야 해요.</p>
        </div>
        <div className="observation-controls">
          <div className="segmented" role="group" aria-label="관찰 지표">
            {(Object.keys(units) as Metric[]).map((m) => (
              <button key={m} className={metric === m ? 'selected' : ''} aria-pressed={metric === m} onClick={() => setMetric(m)}>
                {units[m].label}
              </button>
            ))}
          </div>
          <label className="field observation-start">
            <span>1일차 날짜</span>
            <input type="date" value={start} max={today} onChange={(e) => e.target.value && setStart(e.target.value)} />
          </label>
        </div>
      </div>
      <div className="observation-grid" aria-label="5일 관찰 기록">
        {o.rows.map((r, i) => (
          <div key={r.date} className={'observation-day' + (r.value === null ? ' empty' : '')}>
            <span>
              {i + 1}일차 · {r.date.slice(5)} ({dayNames[weekday(r.date)]})
            </span>
            <div className="observation-bar" aria-hidden="true">
              <i style={{ height: `${((r.value ?? 0) / max) * 100}%` }} />
            </div>
            <strong>{r.value === null ? (r.date > today ? '예정' : '미기록') : `${r.value}${u.unit}`}</strong>
            <small>근거 {r.evidence}건</small>
          </div>
        ))}
      </div>
      <div className="observation-total">
        <div>
          <span>기록한 날 합계 ({o.recordedDays}/5일)</span>
          <strong>
            {o.total}
            {u.unit}
          </strong>
          <small>{o.rows.map((r) => (r.value === null ? '미기록' : r.value)).join(' + ')}</small>
        </div>
        <div>
          <span>5일 평균</span>
          <strong>{o.average === null ? '—' : `${o.average}${u.unit}`}</strong>
          <small>{o.average === null ? '다섯 날짜가 모두 기록되면 계산해요' : `${o.total} ÷ 5 = ${o.average}`}</small>
        </div>
        <button onClick={onEvidence}>
          <span>원본 기록과 대조</span>
          <strong>근거 보기 ↗</strong>
          <small>실행 기록 목록으로 이동</small>
        </button>
      </div>
      <details className="observation-rule">
        <summary>집계·계산 규칙</summary>
        <ul>
          <li>하루는 서울 시간 0시~24시. 실행 기록은 시작 시각의 날짜에, To-do는 완료로 체크한 날짜에 넣어요.</li>
          <li>실제 학습 시간은 실행 기록의 분(휴식 제외)을 더한 값이에요. 계획 시간과 섞지 않아요.</li>
          <li>삭제한 To-do는 빼고, 완료를 취소하면 그날 수에서 빠져요. 같은 실행 기록은 서버가 한 번만 저장해요.</li>
          <li>기록이 없는 날은 0이 아니라 미기록으로 둬요. 평균은 다섯 날짜 합계 ÷ 5, 소수 첫째 자리 반올림이에요.</li>
        </ul>
      </details>
    </section>
  );
}
