import {headers} from 'next/headers';
import {auth} from '../lib/auth';
import AuthGate from './components/AuthGate';
import Workspace from './components/Workspace';
export const dynamic='force-dynamic';
export default async function Page(){const session=await auth.api.getSession({headers:await headers()});return session?<Workspace key={session.user.id}/>:<AuthGate/>;}
