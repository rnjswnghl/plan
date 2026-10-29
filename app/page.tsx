import {pageSession} from '../lib/session';
import AuthGate from './components/AuthGate';
import Workspace from './components/Workspace';
export const dynamic='force-dynamic';
export default async function Page(){const session=await pageSession();return session?<Workspace key={session.user.id}/>:<AuthGate googleEnabled={!!(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET)}/>;}
