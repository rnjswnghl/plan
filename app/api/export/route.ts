import {identity,failure} from '../../../lib/authorization';
import {load} from '../../../lib/db';
export async function GET(request:Request){try{const s=await identity(request);return Response.json({schemaVersion:3,exportedAt:new Date().toISOString(),...(await load(s.user.id))},{headers:{'Cache-Control':'no-store','Content-Disposition':'attachment; filename="sugang-export.json"'}});}catch(e){return failure(e);}}
