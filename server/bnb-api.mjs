import {BNB_PROVIDERS,BNB_TOKENS} from './bnb-facilitators.mjs';
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export async function bnbApi(req,env,{json,limitedJson,safeUrl,rate,ApiError}){
 const url=new URL(req.url),db=env.DB,path=url.pathname;
 if(!['/api/bnb/dashboard','/api/facilitator-applications'].includes(path))return null;
 if(!db)throw new ApiError(503,'Storage unavailable.');
 if(path==='/api/bnb/dashboard'&&req.method==='GET'){
 const days=Number(url.searchParams.get('days')||30),page=Number(url.searchParams.get('page')||1),q=(url.searchParams.get('q')||'').trim().toLowerCase();if(![1,7,30,0].includes(days)||!Number.isInteger(page)||page<1||page>10000||q.length>140)throw new ApiError(400,'Invalid filters.');const since=days?Date.now()-days*86400000:0;
 const stats=await db.prepare("SELECT COUNT(DISTINCT `transaction`) transactions,COUNT(DISTINCT lower(payer)) buyers,COUNT(DISTINCT lower(pay_to)) sellers,MAX(timestamp) latest FROM receipts WHERE network='BSC' AND status='settled' AND timestamp>=?").bind(since).first();
 const where="network='BSC' AND status='settled' AND timestamp>=? AND (instr(lower(`transaction`),?)>0 OR instr(lower(COALESCE(payer,'')),?)>0 OR instr(lower(pay_to),?)>0)";
 const total=await db.prepare('SELECT count(*) total FROM receipts WHERE '+where).bind(since,q,q,q).first();const rows=(await db.prepare('SELECT *, (SELECT context_key FROM chain_evidence e WHERE e.network=receipts.network AND e.`transaction`=receipts.`transaction` AND e.event_id=receipts.event_id) facilitator FROM receipts WHERE '+where+' ORDER BY timestamp DESC LIMIT 20 OFFSET ?').bind(since,q,q,q,(page-1)*20).all()).results;
 const history=(await db.prepare("SELECT CAST(timestamp/86400000 AS INTEGER)*86400000 time,COUNT(DISTINCT `transaction`) count FROM receipts WHERE network='BSC' AND status='settled' AND timestamp>=? GROUP BY time ORDER BY time").bind(since).all()).results;
 const cursors=(await db.prepare("SELECT * FROM chain_cursors WHERE id IN ('bsc-router-v1','bsc-history-v1','bnb-facilitators-v1')").all()).results;
 return json({stats,items:rows.map(r=>({...r,symbol:BNB_TOKENS[r.asset.toLowerCase()]?.symbol||'Token',explorer:'https://bscscan.com/tx/'+r.transaction,evidence:r.source==='bsc-indexer'?'Router settlement event':r.source==='bsc-documented-settlement'?'AEON documented settlement · verified on-chain':'Facilitator-associated transfer'})),history,cursors,providers:BNB_PROVIDERS,total:total.total,page,limit:20,coverage:'Historical AEON documentation examples verified on-chain, published x402-exec router events and AEON-signed USDT/USDC transfers in scanned blocks. Facilitator association alone does not prove a purchased HTTP resource. Other BNB schemes and unscanned history are excluded.'});
 }
 if(path==='/api/facilitator-applications'&&req.method==='POST'){
 if(req.headers.get('origin')!==url.origin)throw new ApiError(403,'Same-origin submission required.');await rate(db,'facilitator-applications',20,3600000);const d=await limitedJson(req,12000);
 const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
 const p={name:clean(d.name,100),website:safeUrl(d.website),endpoint:safeUrl(d.endpoint),docs:safeUrl(d.docs),logo:d.logo?safeUrl(d.logo):null,contact:clean(d.contact,200),description:clean(d.description,2000),networks:Array.isArray(d.networks)?[...new Set(d.networks)]:[],signer:clean(d.signer,100),sampleTransaction:clean(d.sampleTransaction,140)};
 if(p.name.length<2||!p.website||!p.endpoint||!p.docs||p.description.length<20||!/^\S+@\S+\.\S+$/.test(p.contact)||!p.networks.length||p.networks.some(n=>!['BSC','Base','Solana','XRP'].includes(n))||(d.logo&&!p.logo))throw new ApiError(400,'Complete the required fields with valid HTTPS links and contact email.');
 if(p.networks.includes('BSC')&&(!/^0x[0-9a-f]{40}$/i.test(p.signer)||!/^0x[0-9a-f]{64}$/i.test(p.sampleTransaction)))throw new ApiError(400,'BNB listings need a valid signer address and example transaction hash.');
 const id=crypto.randomUUID(),token=crypto.randomUUID()+crypto.randomUUID();await db.prepare('INSERT INTO facilitator_applications(id,payload,token_hash,created_at) VALUES(?,?,?,?)').bind(id,JSON.stringify(p),await digest(token),Date.now()).run();return json({id,token,status:'pending',message:'Saved for review. Your listing is not public and has not been verified.'},201);
 }
 if(path==='/api/facilitator-applications'&&req.method==='GET'){
 const token=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)throw new ApiError(401,'Submission receipt required.');const row=await db.prepare('SELECT id,status,created_at FROM facilitator_applications WHERE id=? AND token_hash=?').bind(url.searchParams.get('id'),await digest(token)).first();if(!row)throw new ApiError(404,'Submission not found.');return json(row);
 }throw new ApiError(405,'Method not allowed.');
}
