import { NextResponse } from 'next/server';
import { z } from 'zod';
import { load,save } from '../../../lib/db';
import { stateSchema } from '../../../lib/model';
export const dynamic='force-dynamic';
function unavailable(){return NextResponse.json({error:'DB 연결 설정 또는 테이블 준비가 필요합니다.'},{status:503});}
export async function GET(){try{return NextResponse.json(await load(),{headers:{'Cache-Control':'no-store'}});}catch{return unavailable();}}
export async function PUT(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'허용되지 않은 요청'},{status:403});
 try{const raw=await request.text();if(raw.length>2000000)return NextResponse.json({error:'데이터 크기 제한 초과'},{status:413});const body=z.object({state:stateSchema,version:z.number().int().nonnegative(),requestKey:z.string().uuid()}).parse(JSON.parse(raw));return NextResponse.json({version:await save(body.state,body.version,body.requestKey)});
 }catch(e){if(e instanceof z.ZodError||e instanceof SyntaxError||e instanceof Error&&['기존 실행 기록은 보존해야 합니다.','수정 이력은 보존해야 합니다.','계획 변경 이력이 필요합니다.'].includes(e.message))return NextResponse.json({error:'입력 형식이나 데이터 연결·이력 보존을 확인해주세요.'},{status:400});if(e instanceof Error&&e.message==='CONFLICT')return NextResponse.json({error:'다른 변경이 저장되었습니다. 새로고침 후 다시 수정해주세요.'},{status:409});return unavailable();}
}
