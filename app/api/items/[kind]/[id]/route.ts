import {identity,failure,AccessError} from '../../../../../lib/authorization';
import {load,save} from '../../../../../lib/db';
import {State,stateSchema} from '../../../../../lib/model';
import {allowedOrigin} from '../../../../../lib/request-origin';
type Context={params:Promise<{kind:string,id:string}>};
const kinds=['tasks','activities','plans','records','slots','reviews','revisions','achievements','categories'];
async function item(request:Request,context:Context){const session=await identity(request),{kind,id}=await context.params;if(!kinds.includes(kind))throw new AccessError(404);const current=await load(session.user.id),rows=current.state[kind as keyof State] as {id:string}[];const found=rows.find(r=>r.id===id);if(!found)throw new AccessError(404);return {session,kind:kind as 'tasks',id,current,found};}
export async function GET(request:Request,context:Context){try{return Response.json((await item(request,context)).found,{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e);}}
async function change(request:Request,context:Context,remove:boolean){try{await identity(request);if(!allowedOrigin(request.headers.get('origin'),request.headers.get('host'),request.url))return Response.json({error:'허용되지 않은 요청'},{status:403});const x=await item(request,context);if(x.kind!=='tasks')return Response.json({error:'이 자료는 전용 화면에서 수정해주세요.'},{status:400});const body=remove?{}:await request.json();await identity(request,body);const next=stateSchema.parse({...x.current.state,tasks:x.current.state.tasks.map(t=>t.id===x.id?remove?{...t,deleted:true}:{...t,title:body.title??t.title,due:body.due===undefined?t.due:body.due}:t)});return Response.json({version:await save(next,x.current.version,crypto.randomUUID(),x.session.user.id)});}catch(e){if(e instanceof AccessError)return failure(e);return Response.json({error:'입력값과 저장 상태를 확인해주세요.'},{status:400});}}
export const PATCH=(r:Request,c:Context)=>change(r,c,false);
export const DELETE=(r:Request,c:Context)=>change(r,c,true);
