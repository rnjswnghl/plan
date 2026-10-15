import {hashPassword} from 'better-auth/crypto';
import {db} from '../lib/pool';
import {randomUUID} from 'node:crypto';
async function main(){
 process.stderr.write('Enter the requested test administrator password (hidden), then Enter.\n');
 if(process.stdin.isTTY)process.stdin.setRawMode(true);
 const password=await new Promise<string>((resolve,reject)=>{let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{input+=chunk;if(input.includes('\u0003'))reject(Error('Cancelled'));if(/[\r\n]/.test(input)){if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.pause();resolve(input.trim());}});});
 if(!password||password.length>128)throw Error('Invalid password length.');
 const hash=await hashPassword(password),c=await db().connect();try{await c.query('BEGIN');const r=await c.query('SELECT id FROM t07_user WHERE email=$1 FOR UPDATE',['admin@email.com']);const id=r.rows[0]?.id??randomUUID();
 if(!r.rowCount)await c.query('INSERT INTO t07_user(id,name,email,"emailVerified",role) VALUES($1,$2,$3,false,$4)',[id,'SuGang Admin','admin@email.com','admin']);
 else await c.query('UPDATE t07_user SET role=$2,"updatedAt"=now() WHERE id=$1',[id,'admin']);
 const a=await c.query('SELECT id FROM t07_account WHERE "userId"=$1 AND "providerId"=$2',[id,'credential']);
 if(a.rowCount)await c.query('UPDATE t07_account SET password=$2,"updatedAt"=now() WHERE id=$1',[a.rows[0].id,hash]);
 else await c.query('INSERT INTO t07_account(id,"accountId","providerId","userId",password,"updatedAt") VALUES($1,$2,$3,$4,$5,now())',[randomUUID(),id,'credential',id,hash]);
 await c.query('DELETE FROM t07_session WHERE "userId"=$1',[id]);await c.query('COMMIT');console.log('Requested test administrator provisioned; existing sessions revoked.');
 }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();await db().end();}}
main().catch(()=>{console.error('Administrator provisioning failed.');process.exitCode=1});
