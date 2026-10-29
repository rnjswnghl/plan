import { shiftDate } from './calendar';
import { seoulDate, State } from './model';

/**
 * 5일 관찰 지표 — 화면·설명서(docs/five-day-log.md)·손 계산이 같은 규칙을 쓴다.
 * - 하루 = 서울 시간(Asia/Seoul) 0시~24시. 실행 기록은 시작 시각이 속한 날짜에 넣는다.
 * - minutes: 그날 실행 기록 minutes의 합(휴식 제외 실제 학습 분). 계획 시간·To-do 개수와 섞지 않는다.
 * - completed: 그날 완료로 표시된(completedOn) To-do 수. 삭제한 할 일은 빼고, 완료를 취소하면 빠진다.
 * - 기록이 하나도 없는 날은 0으로 단정하지 않고 null(미기록)로 둔다.
 * - 평균 = 다섯 날짜 합계 ÷ 5, 소수 첫째 자리 반올림. 다섯 날짜가 모두 기록된 뒤에만 계산한다.
 */
export type Metric = 'minutes' | 'completed';
export function observationDays(start: string) {
  return Array.from({ length: 5 }, (_, i) => shiftDate(start, i));
}
export function observation(s: State, start: string, metric: Metric) {
  const rows = observationDays(start).map((date) => {
    const records = s.records.filter((r) => seoulDate(new Date(r.start)) === date);
    const done = s.tasks.filter((t) => !t.deleted && t.done && t.completedOn === date);
    const value = metric === 'minutes' ? (records.length ? records.reduce((n, r) => n + r.minutes, 0) : null) : records.length || done.length ? done.length : null;
    return { date, value, evidence: metric === 'minutes' ? records.length : done.length };
  });
  const recorded = rows.filter((r) => r.value !== null);
  const total = recorded.reduce((n, r) => n + (r.value ?? 0), 0);
  const complete = recorded.length === 5;
  return { rows, total, recordedDays: recorded.length, average: complete ? Math.round((total / 5) * 10) / 10 : null };
}
