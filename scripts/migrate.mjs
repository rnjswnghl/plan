import pg from 'pg';
import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL){console.error('DATABASE_URL을 .env.local에 설정해주세요.');process.exit(1);}
const client=new pg.Client({connectionString:process.env.DATABASE_URL});
try {await client.connect();await client.query('BEGIN');for(const file of ['002_app.sql','003_calendar.sql'])await client.query(await readFile(new URL('../db/'+file,import.meta.url),'utf8'));await client.query('COMMIT');console.log('Application schema ready.');}catch{console.error('DB 연결 또는 마이그레이션 실패. 연결 값과 네트워크를 확인해주세요.');process.exitCode=1;}finally{await client.end();}
