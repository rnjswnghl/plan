import {Pool} from 'pg';
const shared=globalThis as unknown as {t07pool?:Pool};
export function db(){if(!process.env.DATABASE_URL)throw Error('DB_NOT_CONFIGURED');return shared.t07pool??=new Pool({connectionString:process.env.DATABASE_URL,max:4,connectionTimeoutMillis:10000});}
