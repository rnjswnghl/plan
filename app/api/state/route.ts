import {z} from 'zod';
import {load,save} from '../../../lib/db';
import {stateSchema} from '../../../lib/model';
import {identity,failure,AccessError} from '../../../lib/authorization';
import {allowedOrigin} from '../../../lib/request-origin';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const s=await identity(request);return Response.json(await load(s.user.id),{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e);}}
export async function PUT(request:Request){try{
 await identity(request);
 if(!allowedOrigin(request.headers.get('origin'),request.headers.get('host'),request.url))return Response.json({error:'허용되지 않은 요청'},{status:403});
 const raw=await request.text();if(raw.length>2000000)return Response.json({error:'데이터 크기 제한 초과'},{status:413});
 const parsed=JSON.parse(raw);const session=await identity(request,parsed);
 const body=z.object({state:stateSchema,version:z.number().int().nonnegative(),requestKey:z.string().uuid()}).parse(parsed);
 return Response.json({version:await save(body.state,body.version,body.requestKey,session.user.id)});
 }catch(e){if(e instanceof Error&&e.message==='NOT_FOUND')return failure(new AccessError(404));if(e instanceof z.ZodError||e instanceof SyntaxError||e instanceof Error&&e.message.includes('해야 합니다.'))return Response.json({error:'입력 형식과 이력 보존을 확인해주세요.'},{status:400});if(e instanceof Error&&e.message==='CONFLICT')return Response.json({error:'다른 변경이 저장됐습니다. 새로고침해주세요.'},{status:409});return failure(e);}}
