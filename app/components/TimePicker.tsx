'use client';
import {useState} from 'react';
import SoftSelect from './SoftSelect';
export default function TimePicker({name,defaultValue='09:00',required=false}:{name:string,defaultValue?:string,required?:boolean}){
 const [value,setValue]=useState(defaultValue);const [hour,minute]=value.split(':');const label=name==='start'?'시작':'종료';
 return <div className="time-picker"><input type="hidden" name={name} value={value} required={required}/><SoftSelect aria-label={`${label} 시`} value={hour} onChange={e=>setValue(e.target.value+':'+minute)}>{Array.from({length:24},(_,i)=>{const n=String(i).padStart(2,'0');return <option key={n} value={n}>{n}시</option>;})}</SoftSelect><span>:</span><SoftSelect aria-label={`${label} 분`} value={minute} onChange={e=>setValue(hour+':'+e.target.value)}>{Array.from({length:60},(_,i)=>{const n=String(i).padStart(2,'0');return <option key={n} value={n}>{n}분</option>;})}</SoftSelect></div>;
}
