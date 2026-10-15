import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {auth} from '../../lib/auth';
import AuthGate from '../components/AuthGate';
export const dynamic='force-dynamic';
export default async function Signup(){if(await auth.api.getSession({headers:await headers()}))redirect('/');return <AuthGate signup googleEnabled={!!(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET)}/>;}
