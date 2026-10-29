import {hashPassword} from 'better-auth/crypto';
import {randomUUID} from 'node:crypto';
import {db} from '../lib/pool';
import {save} from '../lib/db';
import {emptyState,seoulDate,stateSchema} from '../lib/model';
import {shiftDate,defaults} from '../lib/calendar';

/**
 * 시연용 계정 + 오늘로 끝나는 5일 예시 기록을 만든다.
 * - 실제 5일 관찰 제출 근거가 아니다. 모든 항목 제목에 [예시]를 붙이고, 기록 시각은 스크립트가 정한 과거 시각이다.
 * - 비밀번호는 터미널에서 숨김 입력으로만 받는다. 코드·문서·Git에 남기지 않는다.
 * 실행: node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/seed-demo.ts [이메일]
 */
const email=(process.argv[2]??'demo@sugang.test').trim().toLowerCase();
const today=seoulDate();
const days=Array.from({length:5},(_,i)=>shiftDate(today,i-4));
const at=(date:string,hhmm:string)=>new Date(`${date}T${hhmm}:00+09:00`).toISOString();

function hiddenPassword(){
 process.stderr.write(`시연 계정(${email}) 비밀번호를 입력하세요(10자 이상, 화면에 표시되지 않음) 후 Enter.\n`);
 if(process.stdin.isTTY)process.stdin.setRawMode(true);
 return new Promise<string>((resolve,reject)=>{let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{input+=chunk;if(input.includes('\u0003'))reject(Error('취소했습니다.'));if(/[\r\n]/.test(input)){if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.pause();resolve(input.trim());}});});
}

function demoState(){
 const s=emptyState();s.onboarded=true;s.categories=defaults.map(c=>({...c}));
 const activity={id:randomUUID(),name:'[예시] 코딩테스트',goal:'하루 실제 풀이 시간을 기록하고 비교하기',categoryId:defaults[0].id,kind:'learning' as const};
 s.activities.push(activity);
 // 변경 전 규칙: 저녁 한 구간. 변경 후(3일차부터): 아침·저녁 두 구간.
 s.plans.push({id:randomUUID(),title:'[예시] 5일 관찰 주간',start:days[0],end:days[4],priority:2,success:'하루 실제 학습 시간(분) 기록',estimated:600,improvement:''});
 const plan=s.plans[0];
 s.revisions.push({id:randomUUID(),planId:plan.id,at:at(days[0],'08:00'),snapshot:{...plan}});
 const changed={...plan,success:'하루 실제 학습 시간(분) 기록 · 3일차부터 두 구간으로 나눔',improvement:'[예시] 2일차 뒤 규칙 변경: 공부 시간을 아침·저녁 두 구간으로 나눈다'};
 s.plans[0]=changed;
 s.revisions.push({id:randomUUID(),planId:plan.id,at:at(days[1],'23:30'),snapshot:{...changed}});
 const minutes=[[70],[85],[30,75],[25,90],[30,80]];
 const blocked=['','중간에 메신저 확인','','DP 점화식에서 막힘',''];
 days.forEach((date,i)=>{
  const task={id:randomUUID(),planId:plan.id,activityId:activity.id,title:`[예시] ${i+1}일차 문제 풀이`,due:date,priority:2,tags:['예시'],estimated:120,done:true,deleted:false,created:at(date,'07:50'),completedOn:date};
  s.tasks.push(task);
  minutes[i].forEach((m,j)=>{const start=minutes[i].length===1?'20:00':j===0?'07:00':'20:00';const startAt=at(date,start);s.records.push({id:randomUUID(),taskId:task.id,requestKey:randomUUID(),start:startAt,end:new Date(Date.parse(startAt)+m*60000+10*60000).toISOString(),minutes:m,blocked:j===minutes[i].length-1?blocked[i]:'',note:`[예시] ${i+1}일차 ${minutes[i].length>1?(j===0?'아침':'저녁')+' 구간':'저녁 한 구간'}`});});
 });
 return stateSchema.parse(s);
}

async function main(){
 const state=demoState();
 const password=await hiddenPassword();
 if(password.length<10||password.length>128)throw Error('비밀번호는 10~128자로 정해주세요.');
 const hash=await hashPassword(password),c=await db().connect();let id:string;
 try{
  await c.query('BEGIN');
  const r=await c.query('SELECT id FROM t07_user WHERE email=$1 FOR UPDATE',[email]);
  if(r.rowCount)throw Error('이미 있는 이메일입니다. 덮어쓰지 않습니다. 다른 이메일을 인자로 주세요.');
  id=randomUUID();
  await c.query('INSERT INTO t07_user(id,name,email,"emailVerified",role) VALUES($1,$2,$3,false,$4)',[id,'SuGang 시연',email,'user']);
  await c.query('INSERT INTO t07_account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,now(),now())',[randomUUID(),id,'credential',id,hash]);
  await c.query('COMMIT');
 }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 await save(state,0,randomUUID(),id);
 const total=[70,85,105,115,110];
 console.log(`시연 계정 생성: ${email}`);
 console.log(`5일 예시: ${days[0]} ~ ${days[4]} (오늘이 5일차). 하루 분: ${total.join(' + ')} = ${total.reduce((a,b)=>a+b)} · 평균 ${total.reduce((a,b)=>a+b)/5}`);
 console.log('Goal → 5일 관찰에서 1일차를 '+days[0]+'로 두면 같은 값이 보여야 합니다.');
 await db().end();
}
main().catch(async e=>{console.error(e.message);process.exitCode=1;await db().end().catch(()=>{});});
