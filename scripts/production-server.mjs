import http from 'node:http';
import fs from 'node:fs';
import legacy from '../dist/server/index.js';
import {portal} from '../server/portal.mjs';
import {createDb} from './local-db.mjs';
const env={...process.env,LOCAL_EDITOR:false,DB:createDb(process.env.PORTAL_DB||'.local/portal.sqlite'),LOGOS:JSON.parse(fs.readFileSync('public/logos.json','utf8'))};
const legacyEnv={...process.env,DB:createDb('.local/indexer.sqlite'),ADMIN_EMAILS:'',INGEST_KEYS_JSON:'{}',SELF_HOSTED_COLLECTOR:'true'};
http.createServer(async(req,res)=>{try{
 const pathname=req.url.replace(/^\/data(?=\/)/,'');
 
 const headers=new Headers();for(const[k,v]of Object.entries(req.headers))if(!k.startsWith('oai-')&&v)headers.set(k,String(v));
 const request=new Request('https://x402blockchains.com'+pathname,{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body:req,duplex:'half'})});
 const result=pathname.startsWith('/api/live/')?await portal(request,env):await legacy.fetch(request,legacyEnv,{waitUntil:p=>p.catch(()=>{})});res.writeHead(result.status,{...Object.fromEntries(result.headers),'cache-control':'no-store','x-content-type-options':'nosniff'});res.end(Buffer.from(await result.arrayBuffer()));
}catch(e){console.error(e.message);res.writeHead(500);res.end('API temporarily unavailable')}}).listen(process.env.PORT||4174);
