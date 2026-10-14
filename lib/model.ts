import { z } from 'zod';
const id=z.string().uuid(), text=z.string().trim().min(1).max(200), note=z.string().max(4000), minutes=z.number().int().min(0).max(100000);
const date=z.iso.date(), instant=z.iso.datetime({offset:true});
export const categorySchema=z.object({id,name:text,color:z.string().regex(/^#[0-9a-fA-F]{6}$/)});
export const activitySchema=z.object({id,name:text,goal:note,categoryId:id.nullable(),kind:z.enum(['learning','todo']).optional()});
export const slotSchema=z.object({id,activityId:id,day:z.number().int().min(0).max(6),start:z.number().int().min(0).max(1439),end:z.number().int().min(1).max(1440),date:date.nullable().optional(),content:note.optional()}).refine(s=>s.end>s.start,'종료 시간은 시작 이후여야 합니다.');
export const planSchema=z.object({id,title:text,start:date,end:date,priority:z.number().int().min(1).max(3),success:text,estimated:minutes,improvement:note}).refine(p=>p.end>=p.start);
export const taskSchema=z.object({id,planId:id,activityId:id.nullable(),title:text,due:date.nullable(),priority:z.number().int().min(1).max(3),tags:z.array(z.string().max(40)).max(20),estimated:minutes,done:z.boolean(),deleted:z.boolean(),created:instant,completedOn:date.nullable().optional()});
export const recordSchema=z.object({id,taskId:id,requestKey:id,start:instant,end:instant,minutes,blocked:note,note}).refine(r=>Date.parse(r.end)>=Date.parse(r.start));
export const revisionSchema=z.object({id,planId:id,at:instant,snapshot:planSchema});
export const reviewSchema=z.object({id,planId:id,reflection:note,improvement:note,nextPlanId:id.nullable()}).refine(r=>r.nextPlanId!==r.planId);
export const stateSchema=z.object({onboarded:z.boolean(),categories:z.array(categorySchema).max(50),activities:z.array(activitySchema).max(100),slots:z.array(slotSchema).max(500),plans:z.array(planSchema).max(200),tasks:z.array(taskSchema).max(5000),records:z.array(recordSchema).max(10000),revisions:z.array(revisionSchema).max(5000),reviews:z.array(reviewSchema).max(200),settings:z.object({showTasks:z.boolean(),showContent:z.boolean()}).optional(),achievements:z.array(z.object({id,slotId:id,date,at:instant})).max(10000).optional()}).superRefine((s,c)=>{
 const issue=(message:string)=>c.addIssue({code:'custom',message});
 for(const rows of [s.categories,s.activities,s.slots,s.plans,s.tasks,s.records,s.revisions,s.reviews]) if(new Set(rows.map(r=>r.id)).size!==rows.length)issue('중복 ID');
 const has=(rows:{id:string}[],value:string|null)=>value===null||rows.some(r=>r.id===value);
 if(s.activities.some(a=>!has(s.categories,a.categoryId))||s.slots.some(a=>!has(s.activities,a.activityId))||s.tasks.some(t=>!has(s.plans,t.planId)||!has(s.activities,t.activityId))||s.records.some(r=>!has(s.tasks,r.taskId))||s.revisions.some(r=>!has(s.plans,r.planId))||s.reviews.some(r=>!has(s.plans,r.planId)||!has(s.plans,r.nextPlanId)))issue('연결된 데이터가 없습니다.');
 if(new Set(s.records.map(r=>r.requestKey)).size!==s.records.length)issue('중복 실행 요청');
 if(new Set(s.reviews.map(r=>r.planId)).size!==s.reviews.length)issue('중복 회고');
 if((s.achievements??[]).some(a=>!has(s.slots,a.slotId)))issue('완료한 일정이 없습니다.');
 if(new Set((s.achievements??[]).map(a=>a.slotId+a.date)).size!==(s.achievements??[]).length)issue('중복 일정 완료');
 for(let i=0;i<s.slots.length;i++)for(let j=i+1;j<s.slots.length;j++){const a=s.slots[i],b=s.slots[j];const dayOf=(v:string)=>(new Date(v+'T12:00:00+09:00').getUTCDay()+6)%7;const same=a.date&&b.date?a.date===b.date:a.date?dayOf(a.date)===b.day:b.date?dayOf(b.date)===a.day:a.day===b.day;if(same&&a.start<b.end&&b.start<a.end)issue('시간이 겹치는 일정이 있습니다.');}
});
export type State=z.infer<typeof stateSchema>;
export function canonical(value:unknown):string{if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';return JSON.stringify(value);}
export function emptyState():State{return {onboarded:false,categories:[],activities:[],slots:[],plans:[],tasks:[],records:[],revisions:[],reviews:[],achievements:[],settings:{showTasks:true,showContent:true}};}
export function seoulDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function metrics(s:State,planId:string,today=seoulDate()) {const tasks=s.tasks.filter(t=>t.planId===planId&&!t.deleted);const records=s.records.filter(r=>tasks.some(t=>t.id===r.taskId));const estimated=tasks.reduce((n,t)=>n+t.estimated,0),actual=records.reduce((n,r)=>n+r.minutes,0);return {planned:tasks.length,completed:tasks.filter(t=>t.done).length,overdue:tasks.filter(t=>!t.done&&t.due&&t.due<today).length,blocked:tasks.filter(t=>records.some(r=>r.taskId===t.id&&r.blocked.trim())).length,estimated,actual,difference:actual-estimated};}
export function validateTransition(previous:State,next:State){
 for(const record of previous.records)if(!next.records.some(r=>r.id===record.id&&canonical(r)===canonical(record)))throw Error('기존 실행 기록은 보존해야 합니다.');
 for(const rev of previous.revisions)if(!next.revisions.some(r=>r.id===rev.id&&canonical(r)===canonical(rev)))throw Error('수정 이력은 보존해야 합니다.');
 for(const plan of next.plans){const old=previous.plans.find(p=>p.id===plan.id);if((!old||canonical(old)!==canonical(plan))&&!next.revisions.some(r=>r.planId===plan.id&&canonical(r.snapshot)===canonical(plan)&&!previous.revisions.some(o=>o.id===r.id)))throw Error('계획 변경 이력이 필요합니다.');}
}
