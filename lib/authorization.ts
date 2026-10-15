import {auth} from './auth';
export class AccessError extends Error{constructor(public status:number){super(status===401?'로그인이 필요합니다.':'자료를 찾을 수 없습니다.');}}
export async function identity(request:Request,body?:Record<string,unknown>){
 const session=await auth.api.getSession({headers:request.headers});if(!session)throw new AccessError(401);
 const u=new URL(request.url);for(const value of [u.searchParams.get('userId'),u.searchParams.get('ownerId'),u.searchParams.get('workspaceId'),request.headers.get('x-user-id'),request.headers.get('x-owner-id'),request.headers.get('x-workspace-id'),body?.userId,body?.ownerId,body?.workspaceId])if(value&&value!==session.user.id)throw new AccessError(404);
 return session;
}
export function failure(e:unknown){if(e instanceof AccessError)return Response.json({error:e.message},{status:e.status,headers:{'Cache-Control':'no-store'}});return Response.json({error:'요청을 처리할 수 없습니다.'},{status:503});}
