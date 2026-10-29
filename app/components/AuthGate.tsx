'use client';
import {useEffect,useState} from 'react';
import MedievalIcon from './MedievalIcon';

/** 로그인·가입 화면. 왼쪽은 덮인 가죽 표지, 오른쪽은 펼친 첫 장. 인증 요청은 Better Auth 엔드포인트로만 보낸다. */
export default function AuthGate({signup=false,googleEnabled=false}:{signup?:boolean,googleEnabled?:boolean}){
 const [socialBusy,setSocialBusy]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{if(new URLSearchParams(location.search).has('error'))setError('Google 로그인을 완료하지 못했습니다. 다시 시도하거나 이메일로 로그인해주세요.');},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError('');const f=new FormData(e.currentTarget);
  try{
   const r=await fetch('/api/auth/'+(signup?'sign-up/email':'sign-in/email'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:String(f.get('name')||'SuGang'),email:String(f.get('email')).trim().toLowerCase(),password:String(f.get('password'))})});
   if(r.status===429){setError('시도가 너무 많아요. 1분 뒤에 다시 시도해주세요.');return;}
   // 아이디가 없는 경우와 비밀번호가 틀린 경우를 같은 문구로 보여준다.
   if(!r.ok){setError(signup?'가입 정보를 확인해주세요. 이미 등록된 이메일은 로그인해주세요.':'이메일 또는 비밀번호를 확인해주세요.');return;}
   location.replace('/');
  }catch{setError('연결을 확인하고 다시 시도해주세요.');}finally{setBusy(false);}
 }
 async function google(){
  setSocialBusy(true);setError('');
  try{const r=await fetch('/api/auth/sign-in/social',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:'google',callbackURL:'/',errorCallbackURL:'/login?error=google'})});const d=await r.json();if(!r.ok||!d.url){setError('Google 로그인 연결을 확인해주세요.');return;}location.assign(d.url);}
  catch{setError('Google 로그인 연결에 실패했습니다. 다시 시도해주세요.');}finally{setSocialBusy(false);}
 }
 return <div className="auth-shell">
  <div className="auth-cover">
   <div className="auth-cover-inner">
    <span className="brand-crest"><MedievalIcon/></span>
    <h1 className="auth-logo">SuGang</h1>
    <p className="auth-script">A Personal Book of Days</p>
    <div className="auth-rule" aria-hidden="true">✧</div>
    <p className="auth-lede">학교 밖에서도, 나만의 시간표.<br/>활동과 목표, 할 일과 일지를 한 권에.</p>
    <p className="auth-motto">Make time. Leave your mark.</p>
   </div>
  </div>
  <main className="auth-main">
   <section className="auth-sheet" aria-labelledby="auth-title">
    <p className="eyebrow">{signup?'Begin a new volume':'Welcome back'}</p>
    <h2 id="auth-title">{signup?'나만의 다이어리 만들기':'다이어리 열기'}</h2>
    <p className="auth-sub">{signup?'가입하면 바로 빈 시간표로 시작해요. 내 기록은 나만 볼 수 있어요.':'로그인하면 나의 시간표와 To-do를 볼 수 있어요.'}</p>
    <form onSubmit={submit}>
     {signup&&<label className="field"><span>이름</span><input name="name" required maxLength={80} autoComplete="name"/></label>}
     <label className="field"><span>이메일</span><input name="email" required type="email" autoComplete="username" maxLength={254}/></label>
     <label className="field"><span>비밀번호{signup?' (10자 이상)':''}</span><input name="password" required type="password" minLength={signup?10:1} maxLength={128} autoComplete={signup?'new-password':'current-password'}/></label>
     {error&&<p className="error" role="alert">{error}</p>}
     <button className="primary submit" disabled={busy}>{busy?'확인 중…':signup?'가입하고 시작하기':'로그인'}</button>
    </form>
    <a className="auth-switch" href={signup?'/login':'/signup'}>{signup?'이미 계정이 있어요. 로그인하기':'처음 오셨나요? 가입하기'}</a>
    <div className="auth-divider">또는</div>
    <button type="button" className="google-login" disabled={socialBusy} onClick={()=>googleEnabled?google():setError('Google 로그인은 OAuth 키 설정 후 사용할 수 있어요. 지금은 이메일로 가입해주세요.')}><span aria-hidden="true">G</span>{socialBusy?'Google에 연결 중…':'Google로 계속하기'}</button>
    {!googleEnabled&&<p className="auth-note">Google 로그인은 연결 준비 중이에요. 이메일 가입은 인증 메일 없이 바로 쓸 수 있어요.</p>}
   </section>
  </main>
 </div>;
}
