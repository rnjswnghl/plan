import {headers} from 'next/headers';
import {auth} from './auth';
/** 화면용 세션 조회. DB에 닿지 못하면 로그인 전과 같게 취급해 500 대신 로그인 화면을 보여준다(자료는 열리지 않는다). */
export async function pageSession(){try{return await auth.api.getSession({headers:await headers()});}catch{return null;}}
