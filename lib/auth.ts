import {betterAuth} from 'better-auth';
import {db} from './pool';
export const auth=betterAuth({
 appName:'SuGang',baseURL:process.env.BETTER_AUTH_URL,secret:process.env.BETTER_AUTH_SECRET,
 database:db(),emailAndPassword:{enabled:true,minPasswordLength:10,maxPasswordLength:128},
 socialProviders:process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET?{google:{clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}}:{},
 user:{modelName:'t07_user',additionalFields:{role:{type:'string',defaultValue:'user',input:false}},deleteUser:{enabled:true}},account:{modelName:'t07_account'},verification:{modelName:'t07_verification'},
 session:{modelName:'t07_session',expiresIn:60*60*24*3,disableSessionRefresh:true,cookieCache:{enabled:false}},
 advanced:{cookiePrefix:'sugang-t07',database:{generateId:'uuid'}},
 rateLimit:{enabled:true,storage:'database',modelName:'t07_rate_limit',window:60,max:100,customRules:{'/sign-in/email':{window:60,max:10},'/sign-up/email':{window:60,max:5}}},
 logger:{disabled:true},
});
