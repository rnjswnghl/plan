import {Pool} from 'pg';
const shared=globalThis as unknown as {t07pool?:Pool};
// Pool은 첫 쿼리 때 연결한다. 빌드 단계(DATABASE_URL 없음)에서 모듈을 불러와도 실패하지 않고, 실제 요청에서만 503이 된다.
export function db(){return shared.t07pool??=new Pool({connectionString:process.env.DATABASE_URL,max:Number(process.env.PG_POOL_MAX||4),connectionTimeoutMillis:10000});}
