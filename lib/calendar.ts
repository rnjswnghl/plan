import { State,seoulDate } from './model';
export const defaults=[{id:'10000000-0000-4000-8000-000000000001',name:'학습',color:'#7695c6'},{id:'10000000-0000-4000-8000-000000000002',name:'커리어',color:'#a390c4'},{id:'10000000-0000-4000-8000-000000000003',name:'건강',color:'#80ab96'},{id:'10000000-0000-4000-8000-000000000004',name:'개인 활동',color:'#d6a06f'}];
export function shiftDate(value:string,n:number){const d=new Date(value+'T12:00:00+09:00');d.setUTCDate(d.getUTCDate()+n);return seoulDate(d);}
export function weekday(value:string){return (new Date(value+'T12:00:00+09:00').getUTCDay()+6)%7;}
export function slotsForDate(s:State,value:string){return s.slots.filter(b=>b.date?b.date===value:b.day===weekday(value));}
export function overlaps(a:State['slots'][number],b:State['slots'][number]){if(a.id===b.id||a.end<=b.start||b.end<=a.start)return false;if(a.date&&b.date)return a.date===b.date;if(a.date)return weekday(a.date)===b.day;if(b.date)return weekday(b.date)===a.day;return a.day===b.day;}
export function dayWon(s:State,value:string,today=seoulDate()){if(value>today)return false;const slots=slotsForDate(s,value);const tasks=s.tasks.filter(t=>!t.deleted&&t.due===value);return slots.length>0&&slots.every(b=>(s.achievements??[]).some(a=>a.slotId===b.id&&a.date===value))||tasks.length>0&&tasks.every(t=>t.done&&!!t.completedOn&&t.completedOn<=value);}
export function streak(s:State,today=seoulDate()){let date=dayWon(s,today,today)?today:shiftDate(today,-1),count=0;while(count<3660&&dayWon(s,date,today)){count++;date=shiftDate(date,-1);}return count;}
