import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {emptyState} from '../lib/model';
import {dayWon,overlaps,shiftDate,streak,weekday} from '../lib/calendar';
test('요일·날짜 계산과 반복/단일 일정 중복',()=>{assert.equal(weekday('2026-10-15'),3);assert.equal(shiftDate('2026-12-31',1),'2027-01-01');const a={id:randomUUID(),activityId:randomUUID(),day:3,start:600,end:660};assert.equal(overlaps(a,{...a,id:randomUUID(),start:660,end:720}),false);assert.equal(overlaps(a,{...a,id:randomUUID(),date:'2026-10-15',start:630}),true);assert.equal(overlaps(a,{...a,id:randomUUID(),date:'2026-10-16',start:630}),false);});
test('빈 날과 미래는 성공 아님, 실제 일정 완료만 스탬프와 연속 일수로 계산',()=>{const s=emptyState(),today='2026-10-15';assert.equal(dayWon(s,today,today),false);for(let i=0;i<2;i++){const date=shiftDate(today,-i),slot={id:randomUUID(),activityId:randomUUID(),date,day:weekday(date),start:600,end:660};s.slots.push(slot);s.achievements!.push({id:randomUUID(),slotId:slot.id,date,at:new Date().toISOString()});}assert.equal(streak(s,today),2);assert.equal(dayWon(s,'2026-10-16',today),false);s.achievements!.pop();assert.equal(streak(s,today),1);});
