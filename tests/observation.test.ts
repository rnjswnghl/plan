import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {emptyState} from '../lib/model';
import {observation} from '../lib/observation';

function state(){
 const s=emptyState();const plan=randomUUID();
 s.plans.push({id:plan,title:'p',start:'2026-11-02',end:'2026-11-08',priority:2,success:'s',estimated:0,improvement:''});
 const task=(done:boolean,completedOn:string|null,deleted=false)=>{const id=randomUUID();s.tasks.push({id,planId:plan,activityId:null,title:'t',due:null,priority:2,tags:[],estimated:30,done,deleted,created:'2026-11-01T00:00:00Z',completedOn});return id;};
 const t=task(true,'2026-11-02');task(true,'2026-11-02');task(true,'2026-11-03',true);task(false,null);
 // 서울 0시 경계: 11-02 23:30 KST(=14:30Z)는 2일, 11-03 00:10 KST(=11-02 15:10Z)는 3일.
 const rec=(start:string,minutes:number)=>s.records.push({id:randomUUID(),taskId:t,requestKey:randomUUID(),start,end:start,minutes,blocked:'',note:''});
 rec('2026-11-02T14:30:00Z',30);rec('2026-11-02T15:10:00Z',45);rec('2026-11-04T01:00:00Z',60);rec('2026-11-05T01:00:00Z',20);rec('2026-11-06T01:00:00Z',25);
 return s;
}
test('5일 관찰: 서울 날짜 경계, 미기록, 합계·평균이 손 계산과 같다',()=>{
 const s=state();
 const m=observation(s,'2026-11-02','minutes');
 assert.deepEqual(m.rows.map(r=>r.value),[30,45,60,20,25]);
 assert.equal(m.total,30+45+60+20+25);
 assert.equal(m.average,Math.round((180/5)*10)/10);
 const c=observation(s,'2026-11-02','completed');
 assert.deepEqual(c.rows.map(r=>r.value),[2,0,0,0,0]); // 삭제한 할 일 제외, 기록이 있는 날은 0개
 const gap=observation(s,'2026-11-05','minutes');
 assert.deepEqual(gap.rows.map(r=>r.value),[20,25,null,null,null]);
 assert.equal(gap.average,null);
});
