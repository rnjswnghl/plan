import {redirect} from 'next/navigation';
import {pageSession} from '../../lib/session';
import AuthGate from '../components/AuthGate';
export const dynamic='force-dynamic';
export default async function Signup(){if(await pageSession())redirect('/');return <AuthGate signup googleEnabled={!!(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET)}/>;}
