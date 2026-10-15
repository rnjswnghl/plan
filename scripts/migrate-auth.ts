import {getMigrations} from 'better-auth/db/migration';
import {auth} from '../lib/auth';
import {db} from '../lib/pool';
import {readFile,writeFile} from 'node:fs/promises';
async function main(){try{const m=await getMigrations(auth.options);const sql=await m.compileMigrations();if(sql.trim())await writeFile('db/005_auth_generated.sql',sql);await m.runMigrations();await db().query(await readFile('db/005_private.sql','utf8'));console.log('T07 authentication and private tables ready; T06 unchanged.');}finally{await db().end();}}
main().catch(e=>{console.error('T07 migration failed:',e.code,e.message?.replace(/postgres[^\s]+/g,'[redacted]'));process.exitCode=1});


